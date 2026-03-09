import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { diGoalCreateSchema } from '@sarve-pratibha/shared';

export const diRouter = Router();

diRouter.use(authenticate);

// Get D&I metrics
diRouter.get('/metrics', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { department, year, category } = req.query;
    const where: Record<string, unknown> = {};
    if (department) where.department = department;
    if (year) where.year = Number(year);
    if (category) where.category = category;

    const metrics = await prisma.dIMetric.findMany({
      where,
      orderBy: [{ year: 'desc' }, { category: 'asc' }],
    });

    res.json({ success: true, data: metrics });
  } catch (err) {
    next(err);
  }
});

// Get D&I report
diRouter.get('/report', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { dept, year } = req.query;
    const where: Record<string, unknown> = {};
    if (dept) where.department = dept;
    if (year) where.year = Number(year);

    const reports = await prisma.dIReport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Also get current goals
    const goals = await prisma.dIGoal.findMany({
      where: dept ? { department: dept as string } : {},
      orderBy: { endDate: 'asc' },
    });

    res.json({ success: true, data: { reports, goals } });
  } catch (err) {
    next(err);
  }
});

// Create D&I goal (Section Head+)
diRouter.post('/goal', authorize('SECTION_HEAD'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = diGoalCreateSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(400, parsed.error.errors[0].message));

    const goal = await prisma.dIGoal.create({
      data: {
        ...parsed.data,
        startDate: new Date(parsed.data.startDate),
        endDate: new Date(parsed.data.endDate),
        createdById: req.user!.id,
      },
    });

    res.status(201).json({ success: true, data: goal });
  } catch (err) {
    next(err);
  }
});

export default diRouter;
