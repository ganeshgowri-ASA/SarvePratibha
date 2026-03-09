import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/rbac';

export const adminRouter = Router();

adminRouter.use(authenticate);
adminRouter.use(requireRole('IT_ADMIN'));

// Get system stats
adminRouter.get('/stats', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [userCount, activeEmployees, departments, pendingLeaves] = await Promise.all([
      prisma.user.count(),
      prisma.employee.count({ where: { employmentStatus: 'ACTIVE' } }),
      prisma.department.count(),
      prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers: userCount,
        activeEmployees,
        departments,
        pendingLeaves,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Get audit logs
adminRouter.get('/audit-logs', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '50' } = req.query;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.auditLog.count(),
    ]);

    res.json({ success: true, data: logs, total });
  } catch (err) {
    next(err);
  }
});

// Manage users
adminRouter.get('/users', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        employee: {
          select: { employeeId: true, departmentId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
});
