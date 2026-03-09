import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { goalSchema, goalProgressSchema, goalApproveSchema } from '@sarve-pratibha/shared';

export const goalsRouter = Router();

goalsRouter.use(authenticate);

// POST /api/goals/create — Employee sets goals
goalsRouter.post('/create', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = goalSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors.map((e) => e.message).join(', '));
    }

    const employee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!employee) throw new AppError(404, 'Employee profile not found');

    const { title, description, category, weightage, targetDate, cycle, year, parentGoalId } = parsed.data;

    // Validate total weightage doesn't exceed 100%
    const existingWeightage = await prisma.performanceGoal.aggregate({
      where: { employeeId: employee.id, cycle, year },
      _sum: { weightage: true },
    });
    const totalWeightage = (existingWeightage._sum.weightage || 0) + weightage;
    if (totalWeightage > 100) {
      throw new AppError(400, `Total goal weightage would be ${totalWeightage}%. Maximum is 100%.`);
    }

    // Validate parent goal exists if cascading
    if (parentGoalId) {
      const parentGoal = await prisma.performanceGoal.findUnique({ where: { id: parentGoalId } });
      if (!parentGoal) throw new AppError(404, 'Parent goal not found');
    }

    const goal = await prisma.performanceGoal.create({
      data: {
        employeeId: employee.id,
        title,
        description,
        category,
        weightage,
        targetDate: targetDate ? new Date(targetDate) : undefined,
        cycle,
        year,
        parentGoalId,
      },
      include: {
        employee: { select: { firstName: true, lastName: true, employeeId: true } },
      },
    });

    res.status(201).json({ success: true, data: goal });
  } catch (err) {
    next(err);
  }
});

// GET /api/goals/:employeeId — Get goals for an employee
goalsRouter.get('/:employeeId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;
    const { cycle, year, category, status } = req.query;

    const employee = await prisma.employee.findFirst({
      where: { OR: [{ id: employeeId }, { employeeId }] },
    });
    if (!employee) throw new AppError(404, 'Employee not found');

    // Authorization: employees can view own goals, managers can view reports' goals
    const currentEmployee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!currentEmployee) throw new AppError(404, 'Employee profile not found');

    const isOwnGoals = currentEmployee.id === employee.id;
    const isManager = req.user!.role === 'MANAGER' || req.user!.role === 'SECTION_HEAD' || req.user!.role === 'IT_ADMIN';

    if (!isOwnGoals && !isManager) {
      throw new AppError(403, 'Insufficient permissions to view these goals');
    }

    const where: Record<string, unknown> = { employeeId: employee.id };
    if (cycle) where.cycle = cycle;
    if (year) where.year = Number(year);
    if (category) where.category = category;
    if (status) where.status = status;

    const goals = await prisma.performanceGoal.findMany({
      where,
      include: {
        employee: { select: { firstName: true, lastName: true, employeeId: true } },
        progressHistory: { orderBy: { createdAt: 'desc' }, take: 5 },
        kpis: true,
        parentGoal: { select: { id: true, title: true } },
        childGoals: { select: { id: true, title: true, progress: true, status: true } },
      },
      orderBy: [{ category: 'asc' }, { weightage: 'desc' }],
    });

    res.json({ success: true, data: goals });
  } catch (err) {
    next(err);
  }
});

// PUT /api/goals/:id/progress — Update goal progress
goalsRouter.put('/:id/progress', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = goalProgressSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors.map((e) => e.message).join(', '));
    }

    const goal = await prisma.performanceGoal.findUnique({
      where: { id: req.params.id },
      include: { employee: true },
    });
    if (!goal) throw new AppError(404, 'Goal not found');

    const currentEmployee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!currentEmployee || currentEmployee.id !== goal.employeeId) {
      throw new AppError(403, 'Only the goal owner can update progress');
    }

    const { progress, notes } = parsed.data;

    // Determine status based on progress
    let status = goal.status;
    if (progress === 100) status = 'COMPLETED';
    else if (progress > 0) status = 'IN_PROGRESS';

    const [updatedGoal] = await prisma.$transaction([
      prisma.performanceGoal.update({
        where: { id: req.params.id },
        data: { progress, status },
        include: {
          employee: { select: { firstName: true, lastName: true, employeeId: true } },
          progressHistory: { orderBy: { createdAt: 'desc' }, take: 5 },
        },
      }),
      prisma.goalProgress.create({
        data: {
          goalId: req.params.id,
          employeeId: currentEmployee.id,
          progress,
          notes,
        },
      }),
    ]);

    res.json({ success: true, data: updatedGoal });
  } catch (err) {
    next(err);
  }
});

// PUT /api/goals/:id/approve — Manager approves goal
goalsRouter.put('/:id/approve', authorize('MANAGER'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = goalApproveSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors.map((e) => e.message).join(', '));
    }

    const goal = await prisma.performanceGoal.findUnique({
      where: { id: req.params.id },
      include: { employee: true },
    });
    if (!goal) throw new AppError(404, 'Goal not found');

    // Verify the approver is the employee's manager (or higher role)
    const currentEmployee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!currentEmployee) throw new AppError(404, 'Employee profile not found');

    const isDirectManager = goal.employee.managerId === currentEmployee.id;
    const isHigherRole = req.user!.role === 'SECTION_HEAD' || req.user!.role === 'IT_ADMIN';

    if (!isDirectManager && !isHigherRole) {
      throw new AppError(403, 'Only the direct manager or higher role can approve goals');
    }

    const { isApproved, remarks } = parsed.data;

    const updatedGoal = await prisma.performanceGoal.update({
      where: { id: req.params.id },
      data: {
        isApproved,
        approvedAt: isApproved ? new Date() : null,
        remarks,
      },
      include: {
        employee: { select: { firstName: true, lastName: true, employeeId: true } },
      },
    });

    res.json({ success: true, data: updatedGoal });
  } catch (err) {
    next(err);
  }
});
