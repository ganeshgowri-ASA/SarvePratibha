import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, requireRole, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { assetAssignSchema } from '@sarve-pratibha/shared';

export const assetsRouter = Router();

assetsRouter.use(authenticate);

// Assign asset to employee (IT admin)
assetsRouter.post('/assign', requireRole('IT_ADMIN'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = assetAssignSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(400, parsed.error.errors[0].message));
    }

    const asset = await prisma.asset.findUnique({ where: { id: parsed.data.assetId } });
    if (!asset) return next(new AppError(404, 'Asset not found'));
    if (asset.status !== 'AVAILABLE') {
      return next(new AppError(400, 'Asset is not available for assignment'));
    }

    const employee = await prisma.employee.findUnique({ where: { id: parsed.data.employeeId } });
    if (!employee) return next(new AppError(404, 'Employee not found'));

    const [assignment] = await prisma.$transaction([
      prisma.assetAssignment.create({
        data: {
          assetId: parsed.data.assetId,
          employeeId: parsed.data.employeeId,
          assignedBy: req.user!.id,
          notes: parsed.data.notes,
        },
        include: { asset: true, employee: true },
      }),
      prisma.asset.update({
        where: { id: parsed.data.assetId },
        data: { status: 'ASSIGNED' },
      }),
    ]);

    res.status(201).json({ success: true, data: assignment });
  } catch (err) {
    next(err);
  }
});

// Get employee assets
assetsRouter.get('/employee/:employeeId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const assignments = await prisma.assetAssignment.findMany({
      where: { employeeId: req.params.employeeId, returnedAt: null },
      include: { asset: true },
      orderBy: { assignedAt: 'desc' },
    });

    res.json({ success: true, data: assignments });
  } catch (err) {
    next(err);
  }
});

// Get asset inventory (admin)
assetsRouter.get('/inventory', authorize('MANAGER'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', status, category } = req.query;
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        where,
        include: {
          assignments: {
            where: { returnedAt: null },
            include: { employee: { select: { firstName: true, lastName: true, employeeId: true } } },
            take: 1,
          },
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.asset.count({ where }),
    ]);

    res.json({
      success: true,
      data: assets,
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

export default assetsRouter;
