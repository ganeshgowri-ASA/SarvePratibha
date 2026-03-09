import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { helpdeskTicketSchema } from '@sarve-pratibha/shared';

export const helpdeskRouter = Router();

helpdeskRouter.use(authenticate);

// Raise helpdesk ticket
helpdeskRouter.post('/ticket', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = helpdeskTicketSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(400, parsed.error.errors[0].message));
    }

    const employee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!employee) return next(new AppError(404, 'Employee not found'));

    // Generate ticket number
    const count = await prisma.helpdeskTicket.count();
    const ticketNumber = `HD-${String(count + 1).padStart(6, '0')}`;

    // SLA deadline based on priority
    const slaHours: Record<string, number> = { LOW: 72, MEDIUM: 48, HIGH: 24, CRITICAL: 4 };
    const priority = parsed.data.priority || 'MEDIUM';
    const slaDeadline = new Date(Date.now() + slaHours[priority] * 60 * 60 * 1000);

    const ticket = await prisma.helpdeskTicket.create({
      data: {
        ticketNumber,
        employeeId: employee.id,
        category: parsed.data.category,
        subject: parsed.data.subject,
        description: parsed.data.description,
        priority,
        slaDeadline,
      },
    });

    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
});

// Get employee tickets
helpdeskRouter.get('/tickets/:employeeId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', status } = req.query;
    const where: Record<string, unknown> = { employeeId: req.params.employeeId };
    if (status) where.status = status;

    const [tickets, total] = await Promise.all([
      prisma.helpdeskTicket.findMany({
        where,
        include: { comments: { orderBy: { createdAt: 'asc' } } },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.helpdeskTicket.count({ where }),
    ]);

    res.json({
      success: true,
      data: tickets,
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

// Resolve ticket
helpdeskRouter.put('/ticket/:id/resolve', authorize('MANAGER'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { resolution } = req.body;
    if (!resolution) return next(new AppError(400, 'Resolution is required'));

    const ticket = await prisma.helpdeskTicket.findUnique({ where: { id: req.params.id } });
    if (!ticket) return next(new AppError(404, 'Ticket not found'));
    if (ticket.status === 'CLOSED') {
      return next(new AppError(400, 'Ticket is already closed'));
    }

    const updated = await prisma.helpdeskTicket.update({
      where: { id: req.params.id },
      data: {
        status: 'RESOLVED',
        resolution,
        resolvedAt: new Date(),
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

export default helpdeskRouter;
