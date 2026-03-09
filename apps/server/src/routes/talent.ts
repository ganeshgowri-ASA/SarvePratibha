import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { successionPlanCreateSchema } from '@sarve-pratibha/shared';

export const talentRouter = Router();

talentRouter.use(authenticate);

// Get talent profile
talentRouter.get('/profile/:employeeId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await prisma.talentProfile.findUnique({
      where: { employeeId: req.params.employeeId },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true,
            department: { select: { name: true } },
            designation: { select: { name: true } },
          },
        },
      },
    });
    if (!profile) return next(new AppError(404, 'Talent profile not found'));

    // Also get skills
    const skills = await prisma.skillMatrix.findMany({
      where: { employeeId: req.params.employeeId },
      orderBy: { category: 'asc' },
    });

    res.json({ success: true, data: { ...profile, skills } });
  } catch (err) {
    next(err);
  }
});

// Create succession plan (Manager+)
talentRouter.post('/succession-plan', authorize('MANAGER'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = successionPlanCreateSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(400, parsed.error.errors[0].message));

    const plan = await prisma.successionPlan.create({
      data: {
        ...parsed.data,
        targetDate: parsed.data.targetDate ? new Date(parsed.data.targetDate) : undefined,
        createdById: req.user!.id,
      },
      include: {
        successor: { select: { firstName: true, lastName: true, employeeId: true } },
        currentHolder: { select: { firstName: true, lastName: true, employeeId: true } },
      },
    });

    res.status(201).json({ success: true, data: plan });
  } catch (err) {
    next(err);
  }
});

// Get succession plans (Manager+)
talentRouter.get('/succession-plans', authorize('MANAGER'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { department } = req.query;
    const where: Record<string, unknown> = {};
    if (department) where.department = department;

    const plans = await prisma.successionPlan.findMany({
      where,
      include: {
        successor: { select: { firstName: true, lastName: true, employeeId: true, designation: { select: { name: true } } } },
        currentHolder: { select: { firstName: true, lastName: true, employeeId: true } },
      },
      orderBy: { priority: 'asc' },
    });

    res.json({ success: true, data: plans });
  } catch (err) {
    next(err);
  }
});

// Get skill matrix (department level)
talentRouter.get('/skill-matrix', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { dept } = req.query;
    const where: Record<string, unknown> = {};
    if (dept) where.department = dept;

    const skills = await prisma.skillMatrix.findMany({
      where,
      include: {
        employee: { select: { firstName: true, lastName: true, employeeId: true } },
      },
      orderBy: [{ category: 'asc' }, { skillName: 'asc' }],
    });

    // Group by category
    const grouped: Record<string, typeof skills> = {};
    skills.forEach((s) => {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    });

    res.json({ success: true, data: { skills, grouped } });
  } catch (err) {
    next(err);
  }
});

export default talentRouter;
