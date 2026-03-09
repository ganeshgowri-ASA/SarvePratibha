import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import {
  leaveRequestSchema,
  leaveApprovalSchema,
  leaveTypeCreateSchema,
} from '@sarve-pratibha/shared';

export const leaveRouter = Router();

leaveRouter.use(authenticate);

// ─── Leave Types ────────────────────────────────────────────────────

// GET /api/leave/types - Get all leave types
leaveRouter.get('/types', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const leaveTypes = await prisma.leaveType.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, data: leaveTypes });
  } catch (err) {
    next(err);
  }
});

// POST /api/leave/types - Create leave type (admin only)
leaveRouter.post(
  '/types',
  authorize('IT_ADMIN'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = leaveTypeCreateSchema.parse(req.body);

      const existing = await prisma.leaveType.findUnique({ where: { code: parsed.code } });
      if (existing) {
        throw new AppError(409, 'Leave type code already exists');
      }

      const leaveType = await prisma.leaveType.create({ data: parsed });
      res.status(201).json({ success: true, data: leaveType });
    } catch (err) {
      next(err);
    }
  },
);

// ─── Leave Balance ──────────────────────────────────────────────────

// GET /api/leave/balance/:employeeId
leaveRouter.get('/balance/:employeeId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;
    const year = Number(req.query.year) || new Date().getFullYear();

    // Employees can only view their own balance; managers+ can view team
    const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
    if (!employee) throw new AppError(404, 'Employee not found');

    if (
      req.user!.role === 'EMPLOYEE' &&
      req.user!.employeeId !== employeeId
    ) {
      throw new AppError(403, 'You can only view your own leave balance');
    }

    const balances = await prisma.leaveBalance.findMany({
      where: { employeeId, year },
      include: { leaveType: true },
      orderBy: { leaveType: { name: 'asc' } },
    });

    const data = balances.map((b) => ({
      id: b.id,
      leaveType: b.leaveType.name,
      code: b.leaveType.code,
      allocated: b.allocated,
      used: b.used,
      carried: b.carried,
      balance: b.balance,
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// ─── Apply Leave ────────────────────────────────────────────────────

// POST /api/leave/apply
leaveRouter.post('/apply', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = leaveRequestSchema.parse(req.body);
    const employeeId = req.user!.employeeId;

    if (!employeeId) throw new AppError(400, 'Employee profile not found');

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { leaveBalances: { include: { leaveType: true } } },
    });
    if (!employee) throw new AppError(404, 'Employee not found');

    // Check probation restrictions
    if (employee.probationEndDate && new Date() < employee.probationEndDate) {
      const leaveType = await prisma.leaveType.findUnique({ where: { id: parsed.leaveTypeId } });
      if (leaveType && leaveType.code !== 'SL') {
        throw new AppError(400, 'Only Sick Leave is allowed during probation');
      }
    }

    // Calculate days
    const startDate = new Date(parsed.startDate);
    const endDate = new Date(parsed.endDate);

    if (endDate < startDate) {
      throw new AppError(400, 'End date must be after or equal to start date');
    }

    let days = 0;
    const current = new Date(startDate);
    while (current <= endDate) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        days += 1;
      }
      current.setDate(current.getDate() + 1);
    }

    // Adjust for half-day
    if (parsed.startDayType === 'FIRST_HALF' || parsed.startDayType === 'SECOND_HALF') {
      days -= 0.5;
    } else if (parsed.startDayType === 'QUARTER') {
      days -= 0.75;
    }
    if (
      startDate.getTime() !== endDate.getTime() &&
      (parsed.endDayType === 'FIRST_HALF' || parsed.endDayType === 'SECOND_HALF')
    ) {
      days -= 0.5;
    } else if (
      startDate.getTime() !== endDate.getTime() &&
      parsed.endDayType === 'QUARTER'
    ) {
      days -= 0.75;
    }

    if (days <= 0) throw new AppError(400, 'Invalid leave duration');

    // Check balance
    const year = startDate.getFullYear();
    const balance = await prisma.leaveBalance.findFirst({
      where: { employeeId, leaveTypeId: parsed.leaveTypeId, year },
    });

    if (balance && balance.balance < days) {
      throw new AppError(400, `Insufficient leave balance. Available: ${balance.balance}, Requested: ${days}`);
    }

    // Check max consecutive days (15 days max)
    if (days > 15) {
      throw new AppError(400, 'Maximum consecutive leave of 15 days allowed');
    }

    // Check overlapping leaves
    const overlapping = await prisma.leaveRequest.findFirst({
      where: {
        employeeId,
        status: { in: ['PENDING', 'APPROVED'] },
        OR: [
          { startDate: { lte: endDate }, endDate: { gte: startDate } },
        ],
      },
    });
    if (overlapping) {
      throw new AppError(400, 'You have overlapping leave requests for this period');
    }

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        employeeId,
        leaveTypeId: parsed.leaveTypeId,
        startDate,
        endDate,
        days,
        startDayType: parsed.startDayType,
        endDayType: parsed.endDayType,
        reason: parsed.reason,
        attachmentUrl: parsed.attachmentUrl,
      },
      include: { leaveType: true },
    });

    res.status(201).json({ success: true, data: leaveRequest });
  } catch (err) {
    next(err);
  }
});

// ─── Approve / Reject Leave ─────────────────────────────────────────

// PUT /api/leave/:id/approve
leaveRouter.put(
  '/:id/approve',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { remarks } = leaveApprovalSchema.parse(req.body);

      const leaveRequest = await prisma.leaveRequest.findUnique({
        where: { id },
        include: { employee: true },
      });
      if (!leaveRequest) throw new AppError(404, 'Leave request not found');
      if (leaveRequest.status !== 'PENDING') {
        throw new AppError(400, 'Leave request is not pending');
      }

      // Verify manager has authority over this employee
      if (
        req.user!.role === 'MANAGER' &&
        leaveRequest.employee.managerId !== req.user!.employeeId
      ) {
        throw new AppError(403, 'You can only approve leaves of your direct reports');
      }

      // Approve and deduct balance
      const year = leaveRequest.startDate.getFullYear();

      await prisma.$transaction(async (tx) => {
        await tx.leaveRequest.update({
          where: { id },
          data: {
            status: 'APPROVED',
            approvedBy: req.user!.employeeId,
            approvedAt: new Date(),
            remarks,
          },
        });

        await tx.leaveBalance.updateMany({
          where: {
            employeeId: leaveRequest.employeeId,
            leaveTypeId: leaveRequest.leaveTypeId,
            year,
          },
          data: {
            used: { increment: leaveRequest.days },
            balance: { decrement: leaveRequest.days },
          },
        });
      });

      res.json({ success: true, message: 'Leave approved successfully' });
    } catch (err) {
      next(err);
    }
  },
);

// PUT /api/leave/:id/reject
leaveRouter.put(
  '/:id/reject',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { remarks } = leaveApprovalSchema.parse(req.body);

      const leaveRequest = await prisma.leaveRequest.findUnique({
        where: { id },
        include: { employee: true },
      });
      if (!leaveRequest) throw new AppError(404, 'Leave request not found');
      if (leaveRequest.status !== 'PENDING') {
        throw new AppError(400, 'Leave request is not pending');
      }

      if (
        req.user!.role === 'MANAGER' &&
        leaveRequest.employee.managerId !== req.user!.employeeId
      ) {
        throw new AppError(403, 'You can only reject leaves of your direct reports');
      }

      await prisma.leaveRequest.update({
        where: { id },
        data: {
          status: 'REJECTED',
          approvedBy: req.user!.employeeId,
          approvedAt: new Date(),
          remarks,
        },
      });

      res.json({ success: true, message: 'Leave rejected' });
    } catch (err) {
      next(err);
    }
  },
);

// ─── Leave Requests (Manager view) ─────────────────────────────────

// GET /api/leave/requests?status=pending&team=true
leaveRouter.get('/requests', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status, team, page = '1', limit = '20' } = req.query;
    const employeeId = req.user!.employeeId;

    const where: Record<string, unknown> = {};

    if (team === 'true' && req.user!.role !== 'EMPLOYEE') {
      // Manager/SH sees their team's requests
      if (req.user!.role === 'MANAGER') {
        where.employee = { managerId: employeeId };
      } else if (req.user!.role === 'SECTION_HEAD') {
        // Section heads see department-level
        const shEmployee = await prisma.employee.findUnique({
          where: { id: employeeId! },
          select: { departmentId: true },
        });
        if (shEmployee) {
          where.employee = { departmentId: shEmployee.departmentId };
        }
      }
      // IT_ADMIN sees all (no filter)
    } else {
      // Employee sees own requests
      where.employeeId = employeeId;
    }

    if (status) {
      where.status = (status as string).toUpperCase();
    }

    const [requests, total] = await Promise.all([
      prisma.leaveRequest.findMany({
        where,
        include: {
          leaveType: true,
          employee: {
            select: {
              firstName: true,
              lastName: true,
              employeeId: true,
              department: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.leaveRequest.count({ where }),
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

// ─── Leave History ──────────────────────────────────────────────────

// GET /api/leave/history/:employeeId
leaveRouter.get('/history/:employeeId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;
    const { year, page = '1', limit = '20' } = req.query;

    if (
      req.user!.role === 'EMPLOYEE' &&
      req.user!.employeeId !== employeeId
    ) {
      throw new AppError(403, 'You can only view your own leave history');
    }

    const where: Record<string, unknown> = { employeeId };
    if (year) {
      const y = Number(year);
      where.startDate = { gte: new Date(`${y}-01-01`), lte: new Date(`${y}-12-31`) };
    }

    const [requests, total] = await Promise.all([
      prisma.leaveRequest.findMany({
        where,
        include: { leaveType: true },
        orderBy: { startDate: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.leaveRequest.count({ where }),
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

// PUT /api/leave/:id/cancel - Cancel own leave
leaveRouter.put('/:id/cancel', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const leaveRequest = await prisma.leaveRequest.findUnique({ where: { id } });
    if (!leaveRequest) throw new AppError(404, 'Leave request not found');

    if (leaveRequest.employeeId !== req.user!.employeeId) {
      throw new AppError(403, 'You can only cancel your own leave requests');
    }

    if (leaveRequest.status === 'CANCELLED') {
      throw new AppError(400, 'Leave is already cancelled');
    }

    const wasApproved = leaveRequest.status === 'APPROVED';

    await prisma.$transaction(async (tx) => {
      await tx.leaveRequest.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });

      // Restore balance if was approved
      if (wasApproved) {
        const year = leaveRequest.startDate.getFullYear();
        await tx.leaveBalance.updateMany({
          where: {
            employeeId: leaveRequest.employeeId,
            leaveTypeId: leaveRequest.leaveTypeId,
            year,
          },
          data: {
            used: { decrement: leaveRequest.days },
            balance: { increment: leaveRequest.days },
          },
        });
      }
    });

    res.json({ success: true, message: 'Leave cancelled successfully' });
  } catch (err) {
    next(err);
  }
});

export default leaveRouter;
