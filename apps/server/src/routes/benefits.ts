import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { benefitEnrollSchema } from '@sarve-pratibha/shared';

export const benefitsRouter = Router();

benefitsRouter.use(authenticate);

// Get available benefit plans
benefitsRouter.get('/plans', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { type } = req.query;
    const where: Record<string, unknown> = { isActive: true };
    if (type) where.type = type;

    const plans = await prisma.benefitPlan.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, data: plans });
  } catch (err) {
    next(err);
  }
});

// Enroll in a benefit plan
benefitsRouter.post('/enroll', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = benefitEnrollSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(400, parsed.error.errors[0].message));
    }

    const employee = await prisma.employee.findFirst({
      where: { userId: req.user!.id },
      include: { designation: true },
    });
    if (!employee) return next(new AppError(404, 'Employee not found'));

    const plan = await prisma.benefitPlan.findUnique({
      where: { id: parsed.data.benefitPlanId },
    });
    if (!plan) return next(new AppError(404, 'Benefit plan not found'));
    if (!plan.isActive) return next(new AppError(400, 'This plan is no longer active'));

    // Check grade eligibility
    if (employee.designation.level < plan.minGradeLevel) {
      return next(new AppError(403, 'You are not eligible for this benefit plan based on your grade level'));
    }

    // Check if already enrolled
    const existing = await prisma.benefitEnrollment.findUnique({
      where: {
        employeeId_benefitPlanId: {
          employeeId: employee.id,
          benefitPlanId: parsed.data.benefitPlanId,
        },
      },
    });
    if (existing && existing.status === 'ACTIVE') {
      return next(new AppError(400, 'You are already enrolled in this plan'));
    }

    const enrollment = await prisma.benefitEnrollment.upsert({
      where: {
        employeeId_benefitPlanId: {
          employeeId: employee.id,
          benefitPlanId: parsed.data.benefitPlanId,
        },
      },
      update: {
        startDate: new Date(parsed.data.startDate),
        status: 'ACTIVE',
        nominees: parsed.data.nominees,
      },
      create: {
        employeeId: employee.id,
        benefitPlanId: parsed.data.benefitPlanId,
        startDate: new Date(parsed.data.startDate),
        status: 'ACTIVE',
        nominees: parsed.data.nominees,
      },
      include: { benefitPlan: true },
    });

    res.status(201).json({ success: true, data: enrollment });
  } catch (err) {
    next(err);
  }
});

// Get employee enrollments
benefitsRouter.get('/enrollments/:employeeId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const enrollments = await prisma.benefitEnrollment.findMany({
      where: { employeeId: req.params.employeeId },
      include: { benefitPlan: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: enrollments });
  } catch (err) {
    next(err);
  }
});

// Get insurance policies for employee
benefitsRouter.get('/insurance/:employeeId', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const policies = await prisma.insurancePolicy.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, data: policies });
  } catch (err) {
    next(err);
  }
});

export default benefitsRouter;
