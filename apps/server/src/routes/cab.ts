import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { cabRequestSchema } from '@sarve-pratibha/shared';

export const cabRouter = Router();

cabRouter.use(authenticate);

// Request a cab
cabRouter.post('/request', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = cabRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(400, parsed.error.errors[0].message));
    }

    const employee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!employee) return next(new AppError(404, 'Employee not found'));

    const cabRequest = await prisma.cabRequest.create({
      data: {
        employeeId: employee.id,
        pickupLocation: parsed.data.pickupLocation,
        dropLocation: parsed.data.dropLocation,
        pickupTime: new Date(parsed.data.pickupTime),
        cabType: parsed.data.cabType || 'SEDAN',
        passengers: parsed.data.passengers || 1,
        purpose: parsed.data.purpose,
      },
    });

    res.status(201).json({ success: true, data: cabRequest });
  } catch (err) {
    next(err);
  }
});

// Get employee cab requests
cabRouter.get('/requests/:employeeId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20' } = req.query;

    const [requests, total] = await Promise.all([
      prisma.cabRequest.findMany({
        where: { employeeId: req.params.employeeId },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.cabRequest.count({ where: { employeeId: req.params.employeeId } }),
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

export default cabRouter;
