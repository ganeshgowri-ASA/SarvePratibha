import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import {
  selfAssessmentSchema,
  managerReviewSchema,
  feedback360RequestSchema,
  feedbackResponseSchema,
  pipCreateSchema,
} from '@sarve-pratibha/shared';

export const performanceRouter = Router();

performanceRouter.use(authenticate);

// ─── REVIEW CYCLES ──────────────────────────────────────────────────

// GET /api/performance/cycles — List review cycles
performanceRouter.get('/cycles', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { year, isActive } = req.query;

    const where: Record<string, unknown> = {};
    if (year) where.year = Number(year);
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const cycles = await prisma.performanceReviewCycle.findMany({
      where,
      orderBy: [{ year: 'desc' }, { startDate: 'desc' }],
    });

    res.json({ success: true, data: cycles });
  } catch (err) {
    next(err);
  }
});

// ─── SELF ASSESSMENT ────────────────────────────────────────────────

// POST /api/performance/review/self — Submit self-assessment
performanceRouter.post('/review/self', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = selfAssessmentSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors.map((e) => e.message).join(', '));
    }

    const employee = await prisma.employee.findFirst({
      where: { userId: req.user!.id },
      include: { manager: true },
    });
    if (!employee) throw new AppError(404, 'Employee profile not found');

    const { cycle, year, selfRating, selfComments, ratings, competencyRatings } = parsed.data;

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { revieweeId_cycle_year: { revieweeId: employee.id, cycle, year } },
    });

    if (existingReview && existingReview.status !== 'SELF_REVIEW') {
      throw new AppError(400, 'Self-assessment phase has already been completed');
    }

    const reviewerId = employee.managerId || employee.id;

    // Find the active review cycle
    const reviewCycle = await prisma.performanceReviewCycle.findFirst({
      where: { cycle, year, isActive: true },
    });

    const review = await prisma.$transaction(async (tx) => {
      // Upsert the review
      const rev = await tx.review.upsert({
        where: { revieweeId_cycle_year: { revieweeId: employee.id, cycle, year } },
        create: {
          revieweeId: employee.id,
          reviewerId,
          cycleId: reviewCycle?.id,
          cycle,
          year,
          selfRating,
          selfComments,
          status: 'MANAGER_REVIEW',
        },
        update: {
          selfRating,
          selfComments,
          status: 'MANAGER_REVIEW',
        },
      });

      // Upsert KRA ratings
      if (ratings?.length) {
        // Remove existing ratings for this review
        await tx.reviewRating.deleteMany({ where: { reviewId: rev.id } });
        await tx.reviewRating.createMany({
          data: ratings.map((r) => ({
            reviewId: rev.id,
            kraId: r.kraId,
            area: r.area,
            selfRating: r.selfRating,
            selfComment: r.selfComment,
            weightage: r.weightage,
          })),
        });
      }

      // Upsert competency ratings
      if (competencyRatings?.length) {
        for (const cr of competencyRatings) {
          await tx.competencyRating.upsert({
            where: { reviewId_competencyId: { reviewId: rev.id, competencyId: cr.competencyId } },
            create: {
              reviewId: rev.id,
              competencyId: cr.competencyId,
              employeeId: employee.id,
              selfRating: cr.selfRating,
              comments: cr.comments,
            },
            update: {
              selfRating: cr.selfRating,
              comments: cr.comments,
            },
          });
        }
      }

      // Also update self-ratings on goals
      await tx.performanceGoal.updateMany({
        where: { employeeId: employee.id, cycle, year },
        data: { selfRating },
      });

      return rev;
    });

    const fullReview = await prisma.review.findUnique({
      where: { id: review.id },
      include: {
        reviewee: {
          select: {
            firstName: true, lastName: true, employeeId: true,
            department: { select: { name: true } },
            designation: { select: { name: true } },
          },
        },
        reviewer: { select: { firstName: true, lastName: true } },
        ratings: true,
        competencyRatings: { include: { competency: true } },
      },
    });

    res.status(201).json({ success: true, data: fullReview });
  } catch (err) {
    next(err);
  }
});

// ─── MANAGER REVIEW ─────────────────────────────────────────────────

// POST /api/performance/review/manager — Manager submits review
performanceRouter.post('/review/manager', authorize('MANAGER'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = managerReviewSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors.map((e) => e.message).join(', '));
    }

    const { reviewId, managerRating, managerComments, promotionRec, ratings, competencyRatings } = parsed.data;

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { reviewee: true },
    });
    if (!review) throw new AppError(404, 'Review not found');

    if (review.status === 'COMPLETED') {
      throw new AppError(400, 'This review has already been completed');
    }

    // Verify the manager is the reviewer
    const currentEmployee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!currentEmployee) throw new AppError(404, 'Employee profile not found');

    const isReviewer = review.reviewerId === currentEmployee.id;
    const isHigherRole = req.user!.role === 'SECTION_HEAD' || req.user!.role === 'IT_ADMIN';

    if (!isReviewer && !isHigherRole) {
      throw new AppError(403, 'Only the assigned reviewer or higher role can submit manager review');
    }

    // Calculate weighted overall rating from self + manager
    const overallRating = review.selfRating
      ? (review.selfRating * 0.3 + managerRating * 0.7)
      : managerRating;

    const updatedReview = await prisma.$transaction(async (tx) => {
      const rev = await tx.review.update({
        where: { id: reviewId },
        data: {
          managerRating,
          managerComments,
          promotionRec,
          overallRating: Math.round(overallRating * 100) / 100,
          status: 'CALIBRATION',
        },
      });

      // Update manager ratings on review ratings
      if (ratings?.length) {
        for (const r of ratings) {
          if (r.id) {
            await tx.reviewRating.update({
              where: { id: r.id },
              data: { mgrRating: r.mgrRating, mgrComment: r.mgrComment },
            });
          } else {
            await tx.reviewRating.create({
              data: {
                reviewId: rev.id,
                kraId: r.kraId,
                area: r.area,
                mgrRating: r.mgrRating,
                mgrComment: r.mgrComment,
                weightage: r.weightage,
              },
            });
          }
        }
      }

      // Update competency manager ratings
      if (competencyRatings?.length) {
        for (const cr of competencyRatings) {
          await tx.competencyRating.upsert({
            where: { reviewId_competencyId: { reviewId: rev.id, competencyId: cr.competencyId } },
            create: {
              reviewId: rev.id,
              competencyId: cr.competencyId,
              employeeId: review.revieweeId,
              managerRating: cr.managerRating,
              comments: cr.comments,
            },
            update: {
              managerRating: cr.managerRating,
              comments: cr.comments,
            },
          });
        }
      }

      // Update manager ratings on goals
      await tx.performanceGoal.updateMany({
        where: { employeeId: review.revieweeId, cycle: review.cycle, year: review.year },
        data: { mgrRating: managerRating },
      });

      return rev;
    });

    const fullReview = await prisma.review.findUnique({
      where: { id: updatedReview.id },
      include: {
        reviewee: {
          select: {
            firstName: true, lastName: true, employeeId: true,
            department: { select: { name: true } },
            designation: { select: { name: true } },
          },
        },
        reviewer: { select: { firstName: true, lastName: true } },
        ratings: true,
        competencyRatings: { include: { competency: true } },
      },
    });

    res.json({ success: true, data: fullReview });
  } catch (err) {
    next(err);
  }
});

// GET /api/performance/review/:employeeId — Get review for an employee
performanceRouter.get('/review/:employeeId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;
    const { cycle, year } = req.query;

    const employee = await prisma.employee.findFirst({
      where: { OR: [{ id: employeeId }, { employeeId }] },
    });
    if (!employee) throw new AppError(404, 'Employee not found');

    const where: Record<string, unknown> = { revieweeId: employee.id };
    if (cycle) where.cycle = cycle;
    if (year) where.year = Number(year);

    const reviews = await prisma.review.findMany({
      where,
      include: {
        reviewee: {
          select: {
            firstName: true, lastName: true, employeeId: true,
            department: { select: { name: true } },
            designation: { select: { name: true } },
          },
        },
        reviewer: { select: { firstName: true, lastName: true } },
        ratings: { include: { kra: true } },
        competencyRatings: { include: { competency: true } },
        reviewCycle: true,
      },
      orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
    });

    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
});

// GET /api/performance/team/:managerId — Team ratings overview
performanceRouter.get('/team/:managerId', authorize('MANAGER'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { managerId } = req.params;
    const { cycle, year } = req.query;

    const manager = await prisma.employee.findFirst({
      where: { OR: [{ id: managerId }, { employeeId: managerId }] },
    });
    if (!manager) throw new AppError(404, 'Manager not found');

    // Get direct reports
    const directReports = await prisma.employee.findMany({
      where: { managerId: manager.id, employmentStatus: 'ACTIVE' },
      select: { id: true, firstName: true, lastName: true, employeeId: true,
        department: { select: { name: true } },
        designation: { select: { name: true } },
      },
    });

    const reportIds = directReports.map((r) => r.id);

    const reviewWhere: Record<string, unknown> = { revieweeId: { in: reportIds } };
    if (cycle) reviewWhere.cycle = cycle;
    if (year) reviewWhere.year = Number(year);

    const reviews = await prisma.review.findMany({
      where: reviewWhere,
      include: {
        reviewee: {
          select: {
            firstName: true, lastName: true, employeeId: true,
            department: { select: { name: true } },
            designation: { select: { name: true } },
          },
        },
        ratings: true,
      },
      orderBy: { overallRating: 'desc' },
    });

    // Get goals summary for each report
    const goalSummaries = await Promise.all(
      reportIds.map(async (empId) => {
        const goalWhere: Record<string, unknown> = { employeeId: empId };
        if (cycle) goalWhere.cycle = cycle;
        if (year) goalWhere.year = Number(year);

        const goals = await prisma.performanceGoal.findMany({ where: goalWhere });
        const totalGoals = goals.length;
        const completedGoals = goals.filter((g) => g.status === 'COMPLETED').length;
        const avgProgress = totalGoals > 0 ? goals.reduce((sum, g) => sum + g.progress, 0) / totalGoals : 0;

        return { employeeId: empId, totalGoals, completedGoals, avgProgress: Math.round(avgProgress) };
      }),
    );

    const teamData = directReports.map((report) => ({
      ...report,
      review: reviews.find((r) => r.revieweeId === report.id) || null,
      goalSummary: goalSummaries.find((g) => g.employeeId === report.id) || null,
    }));

    res.json({ success: true, data: teamData });
  } catch (err) {
    next(err);
  }
});

// ─── 360 FEEDBACK ───────────────────────────────────────────────────

// POST /api/performance/feedback/request — Request 360 feedback
performanceRouter.post('/feedback/request', authorize('MANAGER'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = feedback360RequestSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors.map((e) => e.message).join(', '));
    }

    const currentEmployee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!currentEmployee) throw new AppError(404, 'Employee profile not found');

    const { targetId, cycle, year, responderIds, deadline, isAnonymous } = parsed.data;

    const feedback = await prisma.$transaction(async (tx) => {
      const fb = await tx.feedback360.create({
        data: {
          targetId,
          requestedById: currentEmployee.id,
          cycle,
          year,
          deadline: deadline ? new Date(deadline) : undefined,
          isAnonymous,
        },
      });

      await tx.feedbackResponse.createMany({
        data: responderIds.map((responderId) => ({
          feedback360Id: fb.id,
          responderId,
          status: 'REQUESTED' as const,
        })),
      });

      return fb;
    });

    const fullFeedback = await prisma.feedback360.findUnique({
      where: { id: feedback.id },
      include: {
        target: { select: { firstName: true, lastName: true, employeeId: true } },
        responses: {
          include: {
            responder: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    res.status(201).json({ success: true, data: fullFeedback });
  } catch (err) {
    next(err);
  }
});

// POST /api/performance/feedback/submit — Peer submits feedback
performanceRouter.post('/feedback/submit', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = feedbackResponseSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors.map((e) => e.message).join(', '));
    }

    const currentEmployee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!currentEmployee) throw new AppError(404, 'Employee profile not found');

    const { feedback360Id, ratings, strengths, improvements, comments } = parsed.data;

    const response = await prisma.feedbackResponse.findFirst({
      where: { feedback360Id, responderId: currentEmployee.id },
    });
    if (!response) throw new AppError(404, 'Feedback request not found for you');

    if (response.status === 'SUBMITTED') {
      throw new AppError(400, 'Feedback has already been submitted');
    }

    const updated = await prisma.feedbackResponse.update({
      where: { id: response.id },
      data: {
        ratings: ratings || undefined,
        strengths,
        improvements,
        comments,
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// ─── PIP ────────────────────────────────────────────────────────────

// POST /api/performance/pip/create — Manager creates PIP
performanceRouter.post('/pip/create', authorize('MANAGER'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = pipCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors.map((e) => e.message).join(', '));
    }

    const currentEmployee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!currentEmployee) throw new AppError(404, 'Employee profile not found');

    const { employeeId, reason, startDate, endDate, milestones, reviewDates } = parsed.data;

    // Check if employee already has active PIP
    const activePIP = await prisma.pIP.findFirst({
      where: { employeeId, status: 'ACTIVE' },
    });
    if (activePIP) {
      throw new AppError(400, 'Employee already has an active PIP');
    }

    const pip = await prisma.pIP.create({
      data: {
        employeeId,
        createdById: currentEmployee.id,
        reason,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        milestones: milestones?.map((m) => ({ ...m, isCompleted: false })) || [],
        reviewDates: reviewDates || [],
      },
      include: {
        employee: {
          select: {
            firstName: true, lastName: true, employeeId: true,
            department: { select: { name: true } },
          },
        },
        createdBy: { select: { firstName: true, lastName: true } },
      },
    });

    res.status(201).json({ success: true, data: pip });
  } catch (err) {
    next(err);
  }
});

// GET /api/performance/pip/:employeeId — Get PIPs for an employee
performanceRouter.get('/pip/:employeeId', authorize('MANAGER'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;

    const employee = await prisma.employee.findFirst({
      where: { OR: [{ id: employeeId }, { employeeId }] },
    });
    if (!employee) throw new AppError(404, 'Employee not found');

    const pips = await prisma.pIP.findMany({
      where: { employeeId: employee.id },
      include: {
        employee: {
          select: {
            firstName: true, lastName: true, employeeId: true,
            department: { select: { name: true } },
          },
        },
        createdBy: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: pips });
  } catch (err) {
    next(err);
  }
});

// ─── ANALYTICS ──────────────────────────────────────────────────────

// GET /api/performance/analytics/department — Department performance analytics
performanceRouter.get('/analytics/department', authorize('SECTION_HEAD'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { dept, cycle, year } = req.query;

    if (!dept) throw new AppError(400, 'Department ID is required');

    const department = await prisma.department.findFirst({
      where: { OR: [{ id: dept as string }, { code: dept as string }] },
    });
    if (!department) throw new AppError(404, 'Department not found');

    const employees = await prisma.employee.findMany({
      where: { departmentId: department.id, employmentStatus: 'ACTIVE' },
      select: { id: true, firstName: true, lastName: true, employeeId: true },
    });

    const employeeIds = employees.map((e) => e.id);

    const reviewWhere: Record<string, unknown> = { revieweeId: { in: employeeIds } };
    if (cycle) reviewWhere.cycle = cycle;
    if (year) reviewWhere.year = Number(year);

    const reviews = await prisma.review.findMany({
      where: reviewWhere,
      include: {
        reviewee: {
          select: { firstName: true, lastName: true, employeeId: true },
        },
      },
    });

    const completedReviews = reviews.filter((r) => r.overallRating != null);
    const avgRating = completedReviews.length > 0
      ? completedReviews.reduce((sum, r) => sum + (r.overallRating || 0), 0) / completedReviews.length
      : 0;

    // Rating distribution
    const distribution: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
    completedReviews.forEach((r) => {
      const rounded = Math.round(r.overallRating || 0);
      const key = String(Math.min(5, Math.max(1, rounded)));
      distribution[key]++;
    });

    // Goal completion rate
    const goalWhere: Record<string, unknown> = { employeeId: { in: employeeIds } };
    if (cycle) goalWhere.cycle = cycle;
    if (year) goalWhere.year = Number(year);

    const goals = await prisma.performanceGoal.findMany({ where: goalWhere });
    const goalCompletionRate = goals.length > 0
      ? (goals.filter((g) => g.status === 'COMPLETED').length / goals.length) * 100
      : 0;

    // Top & bottom performers
    const sorted = [...completedReviews].sort((a, b) => (b.overallRating || 0) - (a.overallRating || 0));
    const topPerformers = sorted.slice(0, 5).map((r) => ({
      employeeId: r.reviewee.employeeId,
      name: `${r.reviewee.firstName} ${r.reviewee.lastName}`,
      rating: r.overallRating || 0,
    }));
    const bottomPerformers = sorted.slice(-5).reverse().map((r) => ({
      employeeId: r.reviewee.employeeId,
      name: `${r.reviewee.firstName} ${r.reviewee.lastName}`,
      rating: r.overallRating || 0,
    }));

    res.json({
      success: true,
      data: {
        departmentName: department.name,
        totalEmployees: employees.length,
        averageRating: Math.round(avgRating * 100) / 100,
        ratingDistribution: distribution,
        goalCompletionRate: Math.round(goalCompletionRate * 100) / 100,
        topPerformers,
        bottomPerformers,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/performance/bell-curve — Bell curve analysis
performanceRouter.get('/bell-curve', authorize('SECTION_HEAD'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { dept, cycle, year } = req.query;

    const where: Record<string, unknown> = {};
    if (cycle) where.cycle = cycle;
    if (year) where.year = Number(year);

    if (dept) {
      const department = await prisma.department.findFirst({
        where: { OR: [{ id: dept as string }, { code: dept as string }] },
      });
      if (department) {
        const deptEmployees = await prisma.employee.findMany({
          where: { departmentId: department.id },
          select: { id: true },
        });
        where.revieweeId = { in: deptEmployees.map((e) => e.id) };
      }
    }

    const reviews = await prisma.review.findMany({
      where: { ...where, overallRating: { not: null } },
      include: {
        reviewee: {
          select: {
            firstName: true, lastName: true, employeeId: true,
            department: { select: { name: true } },
          },
        },
      },
    });

    // Group by rounded rating
    const buckets: Record<number, typeof reviews> = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    reviews.forEach((r) => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.overallRating || 0)));
      buckets[rounded].push(r);
    });

    const total = reviews.length || 1;
    const bellCurveData = Object.entries(buckets).map(([rating, emps]) => ({
      rating: Number(rating),
      count: emps.length,
      percentage: Math.round((emps.length / total) * 10000) / 100,
      employees: emps.map((e) => ({
        employeeId: e.reviewee.employeeId,
        name: `${e.reviewee.firstName} ${e.reviewee.lastName}`,
        department: e.reviewee.department?.name || '',
      })),
    }));

    res.json({ success: true, data: bellCurveData });
  } catch (err) {
    next(err);
  }
});
