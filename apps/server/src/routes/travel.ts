import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { travelRequestSchema, travelExpenseSchema } from '@sarve-pratibha/shared';

export const travelRouter = Router();

travelRouter.use(authenticate);

// Submit travel request
travelRouter.post('/request', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = travelRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(400, parsed.error.errors[0].message));
    }

    const employee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!employee) return next(new AppError(404, 'Employee not found'));

    // Enforce advance booking policy
    const policy = await prisma.travelPolicy.findFirst({ where: { isActive: true } });
    if (policy) {
      const startDate = new Date(parsed.data.travelStartDate);
      const daysUntilTravel = Math.ceil((startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysUntilTravel < policy.advanceBookingDays) {
        return next(new AppError(400, `Travel must be booked at least ${policy.advanceBookingDays} days in advance`));
      }

      // Enforce advance amount limits
      if (parsed.data.advanceAmount && parsed.data.estimatedCost) {
        const maxAdvance = (parsed.data.estimatedCost * policy.maxAdvancePercent) / 100;
        if (parsed.data.advanceAmount > maxAdvance) {
          return next(new AppError(400, `Advance amount cannot exceed ${policy.maxAdvancePercent}% of estimated cost`));
        }
      }
    }

    const travelRequest = await prisma.travelRequest.create({
      data: {
        employeeId: employee.id,
        destination: parsed.data.destination,
        fromCity: parsed.data.fromCity,
        travelStartDate: new Date(parsed.data.travelStartDate),
        travelEndDate: new Date(parsed.data.travelEndDate),
        purpose: parsed.data.purpose,
        estimatedCost: parsed.data.estimatedCost || 0,
        advanceAmount: parsed.data.advanceAmount || 0,
        travelMode: parsed.data.travelMode || 'FLIGHT',
        accommodationType: parsed.data.accommodationType || 'HOTEL',
        status: 'SUBMITTED',
      },
    });

    res.status(201).json({ success: true, data: travelRequest });
  } catch (err) {
    next(err);
  }
});

// Get travel requests for an employee
travelRouter.get('/requests/:employeeId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', status } = req.query;
    const where: Record<string, unknown> = { employeeId: req.params.employeeId };
    if (status) where.status = status;

    const [requests, total] = await Promise.all([
      prisma.travelRequest.findMany({
        where,
        include: { itineraries: true, expenses: true },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.travelRequest.count({ where }),
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

// Approve/reject travel request (manager)
travelRouter.put('/request/:id/approve', authorize('MANAGER'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { action, remarks } = req.body;
    if (!['MANAGER_APPROVED', 'REJECTED'].includes(action)) {
      return next(new AppError(400, 'Invalid action. Must be MANAGER_APPROVED or REJECTED'));
    }

    const travelRequest = await prisma.travelRequest.findUnique({ where: { id: req.params.id } });
    if (!travelRequest) return next(new AppError(404, 'Travel request not found'));
    if (travelRequest.status !== 'SUBMITTED') {
      return next(new AppError(400, 'Only submitted requests can be approved/rejected'));
    }

    const updated = await prisma.travelRequest.update({
      where: { id: req.params.id },
      data: {
        status: action,
        approvedBy: req.user!.id,
        approvedAt: new Date(),
        remarks,
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// Submit expense report
travelRouter.post('/expense/submit', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = travelExpenseSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(400, parsed.error.errors[0].message));
    }

    const travelRequest = await prisma.travelRequest.findUnique({
      where: { id: parsed.data.travelRequestId },
    });
    if (!travelRequest) return next(new AppError(404, 'Travel request not found'));
    if (travelRequest.status !== 'MANAGER_APPROVED' && travelRequest.status !== 'COMPLETED') {
      return next(new AppError(400, 'Expenses can only be submitted for approved/completed travel'));
    }

    // Enforce per diem limits
    const policy = await prisma.travelPolicy.findFirst({ where: { isActive: true } });
    if (policy && parsed.data.category === 'PER_DIEM') {
      if (parsed.data.amount > policy.perDiemDomestic) {
        return next(new AppError(400, `Per diem amount exceeds the limit of ${policy.perDiemDomestic}`));
      }
    }

    const expense = await prisma.travelExpense.create({
      data: {
        travelRequestId: parsed.data.travelRequestId,
        category: parsed.data.category,
        description: parsed.data.description,
        amount: parsed.data.amount,
        expenseDate: new Date(parsed.data.expenseDate),
        currency: parsed.data.currency || 'INR',
        status: 'SUBMITTED',
      },
    });

    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
});

// Get expenses for a travel request
travelRouter.get('/expense/:requestId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const expenses = await prisma.travelExpense.findMany({
      where: { travelRequestId: req.params.requestId },
      orderBy: { expenseDate: 'asc' },
    });

    res.json({ success: true, data: expenses });
  } catch (err) {
    next(err);
  }
});

// Approve expense
travelRouter.put('/expense/:id/approve', authorize('MANAGER'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { action, remarks } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(action)) {
      return next(new AppError(400, 'Invalid action'));
    }

    const expense = await prisma.travelExpense.findUnique({ where: { id: req.params.id } });
    if (!expense) return next(new AppError(404, 'Expense not found'));
    if (expense.status !== 'SUBMITTED') {
      return next(new AppError(400, 'Only submitted expenses can be approved/rejected'));
    }

    const updated = await prisma.travelExpense.update({
      where: { id: req.params.id },
      data: {
        status: action,
        approvedBy: req.user!.id,
        approvedAt: new Date(),
        remarks,
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// Get company travel policy
travelRouter.get('/policy', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const policy = await prisma.travelPolicy.findFirst({ where: { isActive: true } });
    res.json({ success: true, data: policy });
  } catch (err) {
    next(err);
  }
});

export default travelRouter;
