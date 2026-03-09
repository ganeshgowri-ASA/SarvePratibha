import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { compliancePolicyCreateSchema, complianceTrainingEnrollSchema } from '@sarve-pratibha/shared';

export const complianceRouter = Router();

complianceRouter.use(authenticate);

// Get compliance policies
complianceRouter.get('/policies', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { category, status } = req.query;
    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (status) where.status = status;
    else where.status = 'ACTIVE';

    const policies = await prisma.compliancePolicy.findMany({
      where,
      include: { _count: { select: { acknowledgements: true } } },
      orderBy: { effectiveFrom: 'desc' },
    });

    res.json({ success: true, data: policies });
  } catch (err) {
    next(err);
  }
});

// Create compliance policy (Section Head+)
complianceRouter.post('/policy', authorize('SECTION_HEAD'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = compliancePolicyCreateSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(400, parsed.error.errors[0].message));

    const policy = await prisma.compliancePolicy.create({
      data: {
        ...parsed.data,
        effectiveFrom: new Date(parsed.data.effectiveFrom),
        effectiveTo: parsed.data.effectiveTo ? new Date(parsed.data.effectiveTo) : undefined,
        createdById: req.user!.id,
      },
    });

    res.status(201).json({ success: true, data: policy });
  } catch (err) {
    next(err);
  }
});

// Acknowledge a policy
complianceRouter.post('/acknowledge/:policyId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const employee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!employee) return next(new AppError(404, 'Employee not found'));

    const policy = await prisma.compliancePolicy.findUnique({ where: { id: req.params.policyId } });
    if (!policy) return next(new AppError(404, 'Policy not found'));

    const ack = await prisma.complianceAcknowledgement.upsert({
      where: {
        policyId_employeeId: { policyId: req.params.policyId, employeeId: employee.id },
      },
      update: { acknowledged: true, acknowledgedAt: new Date(), ipAddress: req.ip },
      create: {
        policyId: req.params.policyId,
        employeeId: employee.id,
        acknowledged: true,
        acknowledgedAt: new Date(),
        ipAddress: req.ip,
      },
    });

    res.json({ success: true, data: ack, message: 'Policy acknowledged' });
  } catch (err) {
    next(err);
  }
});

// Get compliance status for employee
complianceRouter.get('/status/:employeeId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [acknowledgements, enrollments] = await Promise.all([
      prisma.complianceAcknowledgement.findMany({
        where: { employeeId: req.params.employeeId },
        include: { policy: { select: { id: true, title: true, category: true, version: true } } },
      }),
      prisma.complianceTrainingEnrollment.findMany({
        where: { employeeId: req.params.employeeId },
        include: { training: { select: { id: true, title: true, category: true, duration: true } } },
      }),
    ]);

    const activePolicies = await prisma.compliancePolicy.count({ where: { status: 'ACTIVE', isRequired: true } });
    const acknowledgedCount = acknowledgements.filter((a) => a.acknowledged).length;

    res.json({
      success: true,
      data: {
        acknowledgements,
        trainings: enrollments,
        complianceRate: activePolicies > 0 ? Math.round((acknowledgedCount / activePolicies) * 100) : 100,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Get compliance trainings
complianceRouter.get('/training', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const trainings = await prisma.complianceTraining.findMany({
      where: { isActive: true },
      include: { _count: { select: { enrollments: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: trainings });
  } catch (err) {
    next(err);
  }
});

// Enroll in compliance training
complianceRouter.post('/training/enroll', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = complianceTrainingEnrollSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(400, parsed.error.errors[0].message));

    const employee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!employee) return next(new AppError(404, 'Employee not found'));

    const training = await prisma.complianceTraining.findUnique({ where: { id: parsed.data.trainingId } });
    if (!training || !training.isActive) return next(new AppError(400, 'Training not available'));

    const enrollment = await prisma.complianceTrainingEnrollment.upsert({
      where: {
        trainingId_employeeId: { trainingId: parsed.data.trainingId, employeeId: employee.id },
      },
      update: { status: 'IN_PROGRESS', startedAt: new Date() },
      create: {
        trainingId: parsed.data.trainingId,
        employeeId: employee.id,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        dueDate: training.dueDate,
      },
      include: { training: true },
    });

    res.status(201).json({ success: true, data: enrollment });
  } catch (err) {
    next(err);
  }
});

export default complianceRouter;
