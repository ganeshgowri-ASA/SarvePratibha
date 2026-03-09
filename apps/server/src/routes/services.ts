import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { serviceRequestSchema } from '@sarve-pratibha/shared';

export const servicesRouter = Router();

servicesRouter.use(authenticate);

// Get service categories
servicesRouter.get('/categories', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const services = await prisma.corporateService.findMany({
      where: { isActive: true },
      orderBy: { category: 'asc' },
    });

    res.json({ success: true, data: services });
  } catch (err) {
    next(err);
  }
});

// Raise service request
servicesRouter.post('/request', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = serviceRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(400, parsed.error.errors[0].message));
    }

    const employee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!employee) return next(new AppError(404, 'Employee not found'));

    const service = await prisma.corporateService.findUnique({
      where: { id: parsed.data.corporateServiceId },
    });
    if (!service) return next(new AppError(404, 'Service not found'));

    // Calculate SLA deadline based on priority
    const slaHours: Record<string, number> = { LOW: 72, MEDIUM: 48, HIGH: 24, CRITICAL: 4 };
    const priority = parsed.data.priority || 'MEDIUM';
    const slaDeadline = new Date(Date.now() + slaHours[priority] * 60 * 60 * 1000);

    const request = await prisma.serviceRequest.create({
      data: {
        employeeId: employee.id,
        corporateServiceId: parsed.data.corporateServiceId,
        subject: parsed.data.subject,
        description: parsed.data.description,
        priority,
        slaDeadline,
      },
      include: { corporateService: true },
    });

    res.status(201).json({ success: true, data: request });
  } catch (err) {
    next(err);
  }
});

// Get employee service requests
servicesRouter.get('/requests/:employeeId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', status } = req.query;
    const where: Record<string, unknown> = { employeeId: req.params.employeeId };
    if (status) where.status = status;

    const [requests, total] = await Promise.all([
      prisma.serviceRequest.findMany({
        where,
        include: { corporateService: true },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.serviceRequest.count({ where }),
    ]);

    res.json({
      success: true,
      data: requests,
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
});

export default servicesRouter;
