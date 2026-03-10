import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error-handler';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/rbac';
import {
  jobRequisitionSchema,
  candidateSchema,
  applicationMoveStageSchema,
  interviewScheduleSchema,
  interviewFeedbackSchema,
  interviewAssessmentSchema,
  offerLetterSchema,
  sourceImportSchema,
  talentPoolSchema,
} from '@sarve-pratibha/shared';

export const recruitmentRouter = Router();

// All recruitment routes require authentication
recruitmentRouter.use(authenticate);

// ─── JOB REQUISITIONS ──────────────────────────────────────────────

// Create job requisition
recruitmentRouter.post(
  '/requisition',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const data = jobRequisitionSchema.parse(req.body);
      const employeeId = req.user!.employeeId;
      if (!employeeId) throw new AppError(400, 'Employee profile required');

      const requisition = await prisma.jobRequisition.create({
        data: {
          ...data,
          closingDate: data.closingDate ? new Date(data.closingDate) : undefined,
          createdById: employeeId,
          status: 'PENDING_APPROVAL',
        },
        include: {
          department: { select: { name: true } },
          designation: { select: { name: true } },
          createdBy: { select: { firstName: true, lastName: true } },
        },
      });

      res.status(201).json({ success: true, data: requisition });
    } catch (err) {
      next(err);
    }
  },
);

// List requisitions with filters
recruitmentRouter.get(
  '/requisitions',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { status, dept, page = '1', limit = '10', search } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: Record<string, unknown> = {};
      if (status) where.status = status;
      if (dept) where.departmentId = dept;
      if (search) {
        where.title = { contains: search as string, mode: 'insensitive' };
      }

      const [requisitions, total] = await Promise.all([
        prisma.jobRequisition.findMany({
          where,
          include: {
            department: { select: { name: true } },
            designation: { select: { name: true } },
            createdBy: { select: { firstName: true, lastName: true } },
            approvedBy: { select: { firstName: true, lastName: true } },
            _count: { select: { jobPostings: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit),
        }),
        prisma.jobRequisition.count({ where }),
      ]);

      res.json({
        success: true,
        data: requisitions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

// Approve/reject requisition (section head)
recruitmentRouter.put(
  '/requisition/:id/approve',
  authorize('SECTION_HEAD'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { action, remarks } = req.body;
      const employeeId = req.user!.employeeId;
      if (!employeeId) throw new AppError(400, 'Employee profile required');

      const requisition = await prisma.jobRequisition.findUnique({ where: { id } });
      if (!requisition) throw new AppError(404, 'Requisition not found');
      if (requisition.status !== 'PENDING_APPROVAL') {
        throw new AppError(400, 'Requisition is not pending approval');
      }

      const updatedRequisition = await prisma.jobRequisition.update({
        where: { id },
        data: {
          status: action === 'approve' ? 'APPROVED' : 'REJECTED',
          approvedById: employeeId,
          approvedAt: new Date(),
          remarks,
        },
        include: {
          department: { select: { name: true } },
          createdBy: { select: { firstName: true, lastName: true } },
        },
      });

      res.json({ success: true, data: updatedRequisition });
    } catch (err) {
      next(err);
    }
  },
);

// ─── JOB POSTING / PUBLISHING ──────────────────────────────────────

// Publish job to boards
recruitmentRouter.post(
  '/job/publish',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { requisitionId, platforms = [] } = req.body;

      const requisition = await prisma.jobRequisition.findUnique({
        where: { id: requisitionId },
        include: { department: true },
      });
      if (!requisition) throw new AppError(404, 'Requisition not found');
      if (!['APPROVED', 'OPEN'].includes(requisition.status)) {
        throw new AppError(400, 'Requisition must be approved before publishing');
      }

      // Create or update job posting
      const jobPosting = await prisma.jobPosting.upsert({
        where: {
          id: await prisma.jobPosting
            .findFirst({ where: { requisitionId }, select: { id: true } })
            .then((r) => r?.id || ''),
        },
        create: {
          requisitionId,
          title: requisition.title,
          departmentId: requisition.departmentId,
          description: requisition.description,
          requirements: requisition.requirements,
          skills: requisition.skills,
          location: requisition.location,
          positions: requisition.positions,
          minExp: requisition.minExp,
          maxExp: requisition.maxExp,
          minSalary: requisition.minSalary,
          maxSalary: requisition.maxSalary,
          employmentType: requisition.employmentType,
          isPublished: true,
          publishedPlatforms: platforms,
          closingDate: requisition.closingDate,
        },
        update: {
          isPublished: true,
          publishedPlatforms: platforms,
          isActive: true,
        },
      });

      // Update requisition status to OPEN
      await prisma.jobRequisition.update({
        where: { id: requisitionId },
        data: { status: 'OPEN' },
      });

      res.json({ success: true, data: jobPosting });
    } catch (err) {
      next(err);
    }
  },
);

// ─── CANDIDATES ────────────────────────────────────────────────────

// List candidates with search/filter
recruitmentRouter.get(
  '/candidates',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { search, status, source, page = '1', limit = '10' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: Record<string, unknown> = {};
      if (search) {
        where.OR = [
          { firstName: { contains: search as string, mode: 'insensitive' } },
          { lastName: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } },
          { currentCompany: { contains: search as string, mode: 'insensitive' } },
        ];
      }
      if (source) where.source = source;
      if (status) {
        where.applications = { some: { status: status as string } };
      }

      const [candidates, total] = await Promise.all([
        prisma.candidate.findMany({
          where,
          include: {
            tags: { select: { tag: true } },
            _count: { select: { applications: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit),
        }),
        prisma.candidate.count({ where }),
      ]);

      res.json({
        success: true,
        data: candidates,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

// Add candidate manually
recruitmentRouter.post(
  '/candidate/add',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const data = candidateSchema.parse(req.body);
      const { jobPostingId, tags } = req.body;

      // Check for duplicates
      const existing = await prisma.candidate.findUnique({ where: { email: data.email } });
      if (existing) {
        throw new AppError(409, `Candidate with email ${data.email} already exists (ID: ${existing.id})`);
      }

      const candidate = await prisma.candidate.create({
        data: {
          ...data,
          tags: tags?.length
            ? { create: tags.map((t: string) => ({ tag: t })) }
            : undefined,
        },
        include: { tags: { select: { tag: true } } },
      });

      // If jobPostingId provided, create application
      if (jobPostingId) {
        await prisma.application.create({
          data: {
            jobPostingId,
            candidateId: candidate.id,
            source: data.source as never,
          },
        });
      }

      res.status(201).json({ success: true, data: candidate });
    } catch (err) {
      next(err);
    }
  },
);

// Get candidate full profile
recruitmentRouter.get(
  '/candidate/:id/profile',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const candidate = await prisma.candidate.findUnique({
        where: { id },
        include: {
          tags: { select: { id: true, tag: true } },
          applications: {
            include: {
              jobPosting: {
                select: { id: true, title: true, department: { select: { name: true } } },
              },
              interviews: {
                include: {
                  interviewer: { select: { firstName: true, lastName: true } },
                  feedbacks: true,
                },
                orderBy: { scheduledAt: 'desc' },
              },
              offer: true,
            },
            orderBy: { createdAt: 'desc' },
          },
          talentPools: {
            include: { talentPool: { select: { id: true, name: true } } },
          },
        },
      });

      if (!candidate) throw new AppError(404, 'Candidate not found');

      res.json({ success: true, data: candidate });
    } catch (err) {
      next(err);
    }
  },
);

// Move candidate through pipeline stages
recruitmentRouter.post(
  '/candidate/:id/move-stage',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { stage, remarks } = applicationMoveStageSchema.parse(req.body);
      const { applicationId } = req.body;

      if (!applicationId) throw new AppError(400, 'Application ID is required');

      const application = await prisma.application.findFirst({
        where: { id: applicationId, candidateId: id },
      });
      if (!application) throw new AppError(404, 'Application not found');

      // Map stage to application status
      const statusMap: Record<string, string> = {
        APPLIED: 'APPLIED',
        SCREENING: 'SCREENING',
        INTERVIEW: 'INTERVIEW_SCHEDULED',
        OFFERED: 'OFFERED',
        HIRED: 'HIRED',
        REJECTED: 'REJECTED',
      };

      const updatedApp = await prisma.application.update({
        where: { id: applicationId },
        data: {
          stage,
          status: statusMap[stage] as never,
          movedAt: new Date(),
          remarks,
        },
        include: {
          candidate: { select: { firstName: true, lastName: true, email: true } },
          jobPosting: { select: { title: true } },
        },
      });

      // If hired, update requisition filled count
      if (stage === 'HIRED') {
        const posting = await prisma.jobPosting.findUnique({
          where: { id: application.jobPostingId },
          select: { requisitionId: true },
        });
        if (posting) {
          await prisma.jobRequisition.update({
            where: { id: posting.requisitionId },
            data: { filledPositions: { increment: 1 } },
          });
        }
      }

      res.json({ success: true, data: updatedApp });
    } catch (err) {
      next(err);
    }
  },
);

// ─── INTERVIEWS ────────────────────────────────────────────────────

// Schedule interview
recruitmentRouter.post(
  '/interview/schedule',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const data = interviewScheduleSchema.parse(req.body);

      const application = await prisma.application.findUnique({
        where: { id: data.applicationId },
      });
      if (!application) throw new AppError(404, 'Application not found');

      const schedule = await prisma.interviewSchedule.create({
        data: {
          ...data,
          scheduledAt: new Date(data.scheduledAt),
        },
        include: {
          application: {
            include: {
              candidate: { select: { firstName: true, lastName: true, email: true } },
              jobPosting: { select: { title: true } },
            },
          },
          interviewer: { select: { firstName: true, lastName: true } },
        },
      });

      // Update application status if still at APPLIED or SCREENING
      if (['APPLIED', 'SCREENING'].includes(application.stage)) {
        await prisma.application.update({
          where: { id: data.applicationId },
          data: { stage: 'INTERVIEW', status: 'INTERVIEW_SCHEDULED', movedAt: new Date() },
        });
      }

      res.status(201).json({ success: true, data: schedule });
    } catch (err) {
      next(err);
    }
  },
);

// Get interviews (calendar view data)
recruitmentRouter.get(
  '/interviews',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { from, to, interviewerId, page = '1', limit = '50' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: Record<string, unknown> = {};
      if (from || to) {
        where.scheduledAt = {};
        if (from) (where.scheduledAt as Record<string, unknown>).gte = new Date(from as string);
        if (to) (where.scheduledAt as Record<string, unknown>).lte = new Date(to as string);
      }
      if (interviewerId) where.interviewerId = interviewerId;

      const [interviews, total] = await Promise.all([
        prisma.interviewSchedule.findMany({
          where,
          include: {
            application: {
              include: {
                candidate: { select: { firstName: true, lastName: true, email: true } },
                jobPosting: { select: { title: true } },
              },
            },
            interviewer: { select: { firstName: true, lastName: true } },
            feedbacks: true,
          },
          orderBy: { scheduledAt: 'asc' },
          skip,
          take: Number(limit),
        }),
        prisma.interviewSchedule.count({ where }),
      ]);

      res.json({
        success: true,
        data: interviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

// Submit interview feedback
recruitmentRouter.post(
  '/interview/feedback',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const data = interviewFeedbackSchema.parse(req.body);
      const employeeId = req.user!.employeeId;
      if (!employeeId) throw new AppError(400, 'Employee profile required');

      const schedule = await prisma.interviewSchedule.findUnique({
        where: { id: data.interviewScheduleId },
      });
      if (!schedule) throw new AppError(404, 'Interview schedule not found');

      const feedback = await prisma.interviewFeedback.create({
        data: {
          ...data,
          interviewerId: employeeId,
        },
      });

      // Update interview result based on recommendation
      if (data.recommendation) {
        const resultMap: Record<string, string> = {
          STRONG_HIRE: 'SELECTED',
          HIRE: 'SELECTED',
          NO_HIRE: 'REJECTED',
          STRONG_NO_HIRE: 'REJECTED',
        };
        await prisma.interviewSchedule.update({
          where: { id: data.interviewScheduleId },
          data: { result: resultMap[data.recommendation] as never },
        });
      }

      res.status(201).json({ success: true, data: feedback });
    } catch (err) {
      next(err);
    }
  },
);

// Submit detailed interview assessment scorecard
recruitmentRouter.post(
  '/interview/assessment',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const data = interviewAssessmentSchema.parse(req.body);
      const employeeId = req.user!.employeeId;
      if (!employeeId) throw new AppError(400, 'Employee profile required');

      const schedule = await prisma.interviewSchedule.findUnique({
        where: { id: data.interviewScheduleId },
      });
      if (!schedule) throw new AppError(404, 'Interview schedule not found');

      // Extract scores from all criteria
      const criteriaKeys = [
        'domainKnowledge', 'problemSolving', 'codingAbility',
        'verbalClarity', 'articulation', 'activeListening', 'presentation',
        'valuesAlignment', 'teamCompatibility', 'attitude', 'workEthic',
        'pastExperience', 'projectDepth', 'industryKnowledge',
        'initiative', 'decisionMaking', 'mentoringAbility', 'vision',
      ] as const;

      const allScores = criteriaKeys.map((key) => data[key].score);
      const overallRating = allScores.reduce((a, b) => a + b, 0) / allScores.length;

      // Map technical/communication/cultureFit averages
      const technicalRating = Math.round(
        (data.domainKnowledge.score + data.problemSolving.score + data.codingAbility.score) / 3
      );
      const communicationRating = Math.round(
        (data.verbalClarity.score + data.articulation.score + data.activeListening.score + data.presentation.score) / 4
      );
      const cultureFitRating = Math.round(
        (data.valuesAlignment.score + data.teamCompatibility.score + data.attitude.score + data.workEthic.score) / 4
      );

      // Map recommendation to match existing enum
      const recMap: Record<string, string> = {
        STRONG_HIRE: 'STRONG_HIRE',
        HIRE: 'HIRE',
        MAYBE: 'HIRE',
        NO_HIRE: 'NO_HIRE',
      };

      // Create feedback record (using existing InterviewFeedback model)
      const feedback = await prisma.interviewFeedback.create({
        data: {
          interviewScheduleId: data.interviewScheduleId,
          interviewerId: employeeId,
          technicalRating,
          communicationRating,
          cultureFitRating,
          overallRating: Math.round(overallRating * 10) / 10,
          strengths: data.strengths,
          weaknesses: data.areasOfConcern || '',
          recommendation: recMap[data.recommendation] as never,
          comments: data.finalComments || '',
        },
      });

      // Update interview result based on recommendation
      const resultMap: Record<string, string> = {
        STRONG_HIRE: 'SELECTED',
        HIRE: 'SELECTED',
        MAYBE: 'ON_HOLD',
        NO_HIRE: 'REJECTED',
      };
      await prisma.interviewSchedule.update({
        where: { id: data.interviewScheduleId },
        data: { result: resultMap[data.recommendation] as never },
      });

      res.status(201).json({ success: true, data: feedback });
    } catch (err) {
      next(err);
    }
  },
);

// Get assessment details for an interview
recruitmentRouter.get(
  '/interview/:id/assessment',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const schedule = await prisma.interviewSchedule.findUnique({
        where: { id },
        include: {
          application: {
            include: {
              candidate: { select: { firstName: true, lastName: true, email: true } },
              jobPosting: { select: { title: true, department: { select: { name: true } } } },
            },
          },
          interviewer: { select: { firstName: true, lastName: true, designation: true } },
          feedbacks: {
            include: {
              interviewer: { select: { firstName: true, lastName: true } },
            },
          },
        },
      });

      if (!schedule) throw new AppError(404, 'Interview schedule not found');

      res.json({ success: true, data: schedule });
    } catch (err) {
      next(err);
    }
  },
);

// ─── PIPELINE VIEW ─────────────────────────────────────────────────

// Get pipeline data for a requisition (kanban view)
recruitmentRouter.get(
  '/pipeline/:requisitionId',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { requisitionId } = req.params;

      const requisition = await prisma.jobRequisition.findUnique({
        where: { id: requisitionId },
        include: {
          department: { select: { name: true } },
          jobPostings: { select: { id: true } },
        },
      });
      if (!requisition) throw new AppError(404, 'Requisition not found');

      const jobPostingIds = requisition.jobPostings.map((jp) => jp.id);

      const applications = await prisma.application.findMany({
        where: { jobPostingId: { in: jobPostingIds } },
        include: {
          candidate: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              currentTitle: true,
              source: true,
            },
          },
          interviews: {
            include: { feedbacks: { select: { overallRating: true } } },
          },
        },
        orderBy: { movedAt: 'desc' },
      });

      const stages = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFERED', 'HIRED', 'REJECTED'];
      const pipeline = stages.map((stage) => {
        const stageApps = applications.filter((a) => a.stage === stage);
        return {
          stage,
          label: stage.charAt(0) + stage.slice(1).toLowerCase(),
          count: stageApps.length,
          applications: stageApps.map((app) => {
            const ratings = app.interviews
              .flatMap((i) => i.feedbacks)
              .map((f) => f.overallRating)
              .filter(Boolean) as number[];
            return {
              id: app.id,
              candidateId: app.candidate.id,
              candidateName: `${app.candidate.firstName} ${app.candidate.lastName}`,
              email: app.candidate.email,
              currentTitle: app.candidate.currentTitle,
              source: app.candidate.source,
              appliedAt: app.appliedAt.toISOString(),
              movedAt: app.movedAt.toISOString(),
              interviewCount: app.interviews.length,
              avgRating: ratings.length
                ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
                : undefined,
            };
          }),
        };
      });

      res.json({
        success: true,
        data: { requisition, pipeline },
      });
    } catch (err) {
      next(err);
    }
  },
);

// ─── OFFER MANAGEMENT ──────────────────────────────────────────────

// Generate offer letter
recruitmentRouter.post(
  '/offer/generate',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const data = offerLetterSchema.parse(req.body);
      const employeeId = req.user!.employeeId;
      if (!employeeId) throw new AppError(400, 'Employee profile required');

      const application = await prisma.application.findUnique({
        where: { id: data.applicationId },
        include: { candidate: true, offer: true },
      });
      if (!application) throw new AppError(404, 'Application not found');
      if (application.offer) throw new AppError(400, 'Offer already exists for this application');

      const grossSalary =
        data.basicSalary + data.hra + data.conveyance + data.specialAllow + data.otherAllow;
      const totalDeductions =
        data.pfContribution + data.esiContribution + data.professionalTax + data.tds;
      const netSalary = grossSalary - totalDeductions;

      const offer = await prisma.offerLetter.create({
        data: {
          ...data,
          joiningDate: new Date(data.joiningDate),
          validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
          candidateName: `${application.candidate.firstName} ${application.candidate.lastName}`,
          grossSalary,
          netSalary,
          createdById: employeeId,
          status: 'DRAFT',
        },
        include: {
          application: {
            include: {
              candidate: { select: { firstName: true, lastName: true, email: true } },
            },
          },
        },
      });

      res.status(201).json({ success: true, data: offer });
    } catch (err) {
      next(err);
    }
  },
);

// List offers
recruitmentRouter.get(
  '/offers',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { status, page = '1', limit = '10' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: Record<string, unknown> = {};
      if (status) where.status = status;

      const [offers, total] = await Promise.all([
        prisma.offerLetter.findMany({
          where,
          include: {
            application: {
              include: {
                candidate: { select: { firstName: true, lastName: true, email: true } },
                jobPosting: { select: { title: true } },
              },
            },
            createdBy: { select: { firstName: true, lastName: true } },
            approvedBy: { select: { firstName: true, lastName: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit),
        }),
        prisma.offerLetter.count({ where }),
      ]);

      res.json({
        success: true,
        data: offers,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

// Approve offer
recruitmentRouter.put(
  '/offer/:id/approve',
  authorize('SECTION_HEAD'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { action, remarks } = req.body;
      const employeeId = req.user!.employeeId;
      if (!employeeId) throw new AppError(400, 'Employee profile required');

      const offer = await prisma.offerLetter.findUnique({ where: { id } });
      if (!offer) throw new AppError(404, 'Offer not found');
      if (!['DRAFT', 'PENDING_APPROVAL'].includes(offer.status)) {
        throw new AppError(400, 'Offer is not in approvable state');
      }

      const updatedOffer = await prisma.offerLetter.update({
        where: { id },
        data: {
          status: action === 'approve' ? 'APPROVED' : 'REJECTED',
          approvedById: employeeId,
          approvedAt: new Date(),
          remarks,
        },
      });

      // Update application stage if approved
      if (action === 'approve') {
        await prisma.application.update({
          where: { id: offer.applicationId },
          data: { stage: 'OFFERED', status: 'OFFERED', movedAt: new Date() },
        });
      }

      res.json({ success: true, data: updatedOffer });
    } catch (err) {
      next(err);
    }
  },
);

// ─── ANALYTICS ─────────────────────────────────────────────────────

recruitmentRouter.get(
  '/analytics',
  authorize('MANAGER'),
  async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [
        totalRequisitions,
        openRequisitions,
        totalCandidates,
        totalApplications,
        hiredThisMonth,
        stageGroups,
        sourceGroups,
        deptOpenings,
      ] = await Promise.all([
        prisma.jobRequisition.count(),
        prisma.jobRequisition.count({ where: { status: { in: ['OPEN', 'APPROVED'] } } }),
        prisma.candidate.count(),
        prisma.application.count(),
        prisma.application.count({
          where: { stage: 'HIRED', movedAt: { gte: startOfMonth } },
        }),
        prisma.application.groupBy({
          by: ['stage'],
          _count: { id: true },
        }),
        prisma.application.groupBy({
          by: ['source'],
          _count: { id: true },
        }),
        prisma.jobRequisition.findMany({
          where: { status: { in: ['OPEN', 'APPROVED'] } },
          include: { department: { select: { name: true } } },
        }),
      ]);

      // Calculate source effectiveness (hired per source)
      const hiredBySource = await prisma.application.groupBy({
        by: ['source'],
        where: { stage: 'HIRED' },
        _count: { id: true },
      });

      const sourceEffectiveness = sourceGroups.map((sg) => ({
        source: sg.source,
        count: sg._count.id,
        hiredCount: hiredBySource.find((h) => h.source === sg.source)?._count.id || 0,
      }));

      // Aggregate dept openings
      const deptMap = new Map<string, { openings: number; filled: number }>();
      for (const req of deptOpenings) {
        const name = req.department.name;
        const existing = deptMap.get(name) || { openings: 0, filled: 0 };
        existing.openings += req.positions;
        existing.filled += req.filledPositions;
        deptMap.set(name, existing);
      }

      // Calculate avg time to hire
      const hiredApps = await prisma.application.findMany({
        where: { stage: 'HIRED' },
        select: { appliedAt: true, movedAt: true },
      });
      const avgTimeToHire =
        hiredApps.length > 0
          ? Math.round(
              hiredApps.reduce(
                (sum, a) => sum + (a.movedAt.getTime() - a.appliedAt.getTime()) / (1000 * 60 * 60 * 24),
                0,
              ) / hiredApps.length,
            )
          : 0;

      const openPositions = deptOpenings.reduce(
        (sum, r) => sum + (r.positions - r.filledPositions),
        0,
      );

      res.json({
        success: true,
        data: {
          totalRequisitions,
          openPositions,
          totalCandidates,
          totalApplications,
          hiredThisMonth,
          avgTimeToHire,
          hiringFunnel: stageGroups.map((sg) => ({
            stage: sg.stage,
            count: sg._count.id,
          })),
          sourceEffectiveness,
          departmentOpenings: Array.from(deptMap.entries()).map(([department, data]) => ({
            department,
            ...data,
          })),
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

// ─── SOURCE IMPORTS ────────────────────────────────────────────────

// Generic import from job boards
async function handleSourceImport(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
  platform: 'NAUKRI' | 'LINKEDIN' | 'INDEED' | 'GLASSDOOR',
) {
  try {
    const data = sourceImportSchema.parse({ ...req.body, source: platform });
    const results = { imported: 0, duplicates: 0, errors: [] as string[] };

    for (const candidateData of data.candidates) {
      try {
        const existing = await prisma.candidate.findUnique({
          where: { email: candidateData.email },
        });

        if (existing) {
          results.duplicates++;
          // If job posting specified, create application for existing candidate
          if (data.jobPostingId) {
            const existingApp = await prisma.application.findUnique({
              where: {
                jobPostingId_candidateId: {
                  jobPostingId: data.jobPostingId,
                  candidateId: existing.id,
                },
              },
            });
            if (!existingApp) {
              await prisma.application.create({
                data: {
                  jobPostingId: data.jobPostingId,
                  candidateId: existing.id,
                  source: platform,
                },
              });
            }
          }
          continue;
        }

        const candidate = await prisma.candidate.create({
          data: { ...candidateData, source: platform },
        });

        if (data.jobPostingId) {
          await prisma.application.create({
            data: {
              jobPostingId: data.jobPostingId,
              candidateId: candidate.id,
              source: platform,
            },
          });
        }

        results.imported++;
      } catch {
        results.errors.push(`Failed to import ${candidateData.email}`);
      }
    }

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
}

recruitmentRouter.post('/source/naukri/import', authorize('MANAGER'), (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
  handleSourceImport(req, res, next, 'NAUKRI'),
);

recruitmentRouter.post('/source/linkedin/import', authorize('MANAGER'), (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
  handleSourceImport(req, res, next, 'LINKEDIN'),
);

recruitmentRouter.post('/source/indeed/import', authorize('MANAGER'), (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
  handleSourceImport(req, res, next, 'INDEED'),
);

recruitmentRouter.post('/source/glassdoor/import', authorize('MANAGER'), (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
  handleSourceImport(req, res, next, 'GLASSDOOR'),
);

// ─── TALENT POOL ───────────────────────────────────────────────────

// List talent pools
recruitmentRouter.get(
  '/talent-pool',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { skills, experience, page = '1', limit = '10' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: Record<string, unknown> = { isActive: true };
      if (skills) {
        where.skills = { hasSome: (skills as string).split(',') };
      }

      const [pools, total] = await Promise.all([
        prisma.talentPool.findMany({
          where,
          include: {
            _count: { select: { candidates: true } },
            candidates: {
              include: {
                candidate: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    totalExp: true,
                    skills: true,
                    currentCompany: true,
                  },
                },
              },
              take: 5,
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit),
        }),
        prisma.talentPool.count({ where }),
      ]);

      // Filter by experience if provided
      let result = pools;
      if (experience) {
        const minExp = Number(experience);
        result = pools.map((pool) => ({
          ...pool,
          candidates: pool.candidates.filter(
            (c) => c.candidate.totalExp && c.candidate.totalExp >= minExp,
          ),
        }));
      }

      res.json({
        success: true,
        data: result,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

// Create talent pool
recruitmentRouter.post(
  '/talent-pool',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const data = talentPoolSchema.parse(req.body);

      const pool = await prisma.talentPool.create({
        data,
      });

      res.status(201).json({ success: true, data: pool });
    } catch (err) {
      next(err);
    }
  },
);

// Add candidate to talent pool
recruitmentRouter.post(
  '/talent-pool/:poolId/add-candidate',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { poolId } = req.params;
      const { candidateId } = req.body;

      if (!candidateId) throw new AppError(400, 'Candidate ID is required');

      const [pool, candidate] = await Promise.all([
        prisma.talentPool.findUnique({ where: { id: poolId } }),
        prisma.candidate.findUnique({ where: { id: candidateId } }),
      ]);

      if (!pool) throw new AppError(404, 'Talent pool not found');
      if (!candidate) throw new AppError(404, 'Candidate not found');

      const entry = await prisma.talentPoolCandidate.create({
        data: { talentPoolId: poolId, candidateId },
      });

      res.status(201).json({ success: true, data: entry });
    } catch (err) {
      next(err);
    }
  },
);
