import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/rbac';

export const employeeRouter = Router();

employeeRouter.use(authenticate);

// Get all employees (managers and above)
employeeRouter.get('/', authorize('MANAGER'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', search, department, status } = req.query;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { employeeId: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    if (department) where.departmentId = department;
    if (status) where.employmentStatus = status;

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        include: {
          user: { select: { email: true, role: true, image: true } },
          department: { select: { name: true } },
          designation: { select: { name: true } },
          manager: { select: { firstName: true, lastName: true } },
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { firstName: 'asc' },
      }),
      prisma.employee.count({ where }),
    ]);

    res.json({
      success: true,
      data: employees,
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

// Get own profile
employeeRouter.get('/me', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const employee = await prisma.employee.findFirst({
      where: { userId: req.user!.id },
      include: {
        user: { select: { email: true, role: true, image: true } },
        department: true,
        designation: true,
        manager: { select: { firstName: true, lastName: true, employeeId: true } },
        leaveBalances: { include: { leaveType: true } },
      },
    });

    res.json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
});

export default employeeRouter;
