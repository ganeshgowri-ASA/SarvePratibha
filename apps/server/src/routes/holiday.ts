import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { holidayCreateSchema, compOffSchema, wfhSchema, onDutySchema } from '@sarve-pratibha/shared';

export const holidayRouter = Router();

holidayRouter.use(authenticate);

// ─── Holidays ───────────────────────────────────────────────────────

// GET /api/holidays?year=&location=
holidayRouter.get('/holidays', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const { location } = req.query;

    const where: Record<string, unknown> = { year };
    if (location) {
      where.OR = [{ location: location as string }, { location: null }];
    }

    const holidays = await prisma.holidayCalendar.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    res.json({ success: true, data: holidays });
  } catch (err) {
    next(err);
  }
});

// POST /api/holidays - Admin create holiday
holidayRouter.post(
  '/holidays',
  authorize('IT_ADMIN'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = holidayCreateSchema.parse(req.body);

      const holiday = await prisma.holidayCalendar.create({
        data: {
          name: parsed.name,
          date: new Date(parsed.date),
          type: parsed.type,
          location: parsed.location,
          isOptional: parsed.isOptional,
          year: parsed.year,
        },
      });

      res.status(201).json({ success: true, data: holiday });
    } catch (err) {
      next(err);
    }
  },
);

// ─── Comp Off ───────────────────────────────────────────────────────

// POST /api/compoff/apply
holidayRouter.post('/compoff/apply', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = compOffSchema.parse(req.body);
    const employeeId = req.user!.employeeId;
    if (!employeeId) throw new AppError(400, 'Employee profile not found');

    const compOff = await prisma.compOff.create({
      data: {
        employeeId,
        workedDate: new Date(parsed.workedDate),
        compOffDate: parsed.compOffDate ? new Date(parsed.compOffDate) : null,
        reason: parsed.reason,
        hours: parsed.hours,
      },
    });

    res.status(201).json({ success: true, data: compOff });
  } catch (err) {
    next(err);
  }
});

// GET /api/compoff - List comp off requests
holidayRouter.get('/compoff', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { team } = req.query;
    const employeeId = req.user!.employeeId;

    let where: Record<string, unknown> = {};
    if (team === 'true' && req.user!.role !== 'EMPLOYEE') {
      if (req.user!.role === 'MANAGER') {
        where = { employee: { managerId: employeeId } };
      }
    } else {
      where = { employeeId };
    }

    const compOffs = await prisma.compOff.findMany({
      where,
      include: {
        employee: {
          select: { firstName: true, lastName: true, employeeId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: compOffs });
  } catch (err) {
    next(err);
  }
});

// PUT /api/compoff/:id/approve
holidayRouter.put(
  '/compoff/:id/approve',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await prisma.compOff.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedBy: req.user!.employeeId,
          approvedAt: new Date(),
          remarks: req.body.remarks,
        },
      });

      res.json({ success: true, message: 'Comp-off approved' });
    } catch (err) {
      next(err);
    }
  },
);

// PUT /api/compoff/:id/reject
holidayRouter.put(
  '/compoff/:id/reject',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await prisma.compOff.update({
        where: { id },
        data: {
          status: 'REJECTED',
          approvedBy: req.user!.employeeId,
          approvedAt: new Date(),
          remarks: req.body.remarks,
        },
      });

      res.json({ success: true, message: 'Comp-off rejected' });
    } catch (err) {
      next(err);
    }
  },
);

// ─── Work From Home ─────────────────────────────────────────────────

// POST /api/wfh/apply
holidayRouter.post('/wfh/apply', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = wfhSchema.parse(req.body);
    const employeeId = req.user!.employeeId;
    if (!employeeId) throw new AppError(400, 'Employee profile not found');

    const startDate = new Date(parsed.startDate);
    const endDate = new Date(parsed.endDate);

    if (endDate < startDate) throw new AppError(400, 'End date must be after start date');

    // Calculate working days
    let days = 0;
    const current = new Date(startDate);
    while (current <= endDate) {
      if (current.getDay() !== 0 && current.getDay() !== 6) days++;
      current.setDate(current.getDate() + 1);
    }

    const wfh = await prisma.workFromHome.create({
      data: {
        employeeId,
        startDate,
        endDate,
        days,
        reason: parsed.reason,
      },
    });

    res.status(201).json({ success: true, data: wfh });
  } catch (err) {
    next(err);
  }
});

// GET /api/wfh
holidayRouter.get('/wfh', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { team } = req.query;
    const employeeId = req.user!.employeeId;

    let where: Record<string, unknown> = {};
    if (team === 'true' && req.user!.role !== 'EMPLOYEE') {
      if (req.user!.role === 'MANAGER') {
        where = { employee: { managerId: employeeId } };
      }
    } else {
      where = { employeeId };
    }

    const wfhRequests = await prisma.workFromHome.findMany({
      where,
      include: {
        employee: {
          select: { firstName: true, lastName: true, employeeId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: wfhRequests });
  } catch (err) {
    next(err);
  }
});

// PUT /api/wfh/:id/approve
holidayRouter.put(
  '/wfh/:id/approve',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await prisma.workFromHome.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedBy: req.user!.employeeId,
          approvedAt: new Date(),
          remarks: req.body.remarks,
        },
      });

      res.json({ success: true, message: 'WFH approved' });
    } catch (err) {
      next(err);
    }
  },
);

// PUT /api/wfh/:id/reject
holidayRouter.put(
  '/wfh/:id/reject',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await prisma.workFromHome.update({
        where: { id },
        data: {
          status: 'REJECTED',
          approvedBy: req.user!.employeeId,
          approvedAt: new Date(),
          remarks: req.body.remarks,
        },
      });

      res.json({ success: true, message: 'WFH rejected' });
    } catch (err) {
      next(err);
    }
  },
);

// ─── On Duty ────────────────────────────────────────────────────────

// POST /api/onduty/apply
holidayRouter.post('/onduty/apply', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = onDutySchema.parse(req.body);
    const employeeId = req.user!.employeeId;
    if (!employeeId) throw new AppError(400, 'Employee profile not found');

    const startDate = new Date(parsed.startDate);
    const endDate = new Date(parsed.endDate);

    if (endDate < startDate) throw new AppError(400, 'End date must be after start date');

    let days = 0;
    const current = new Date(startDate);
    while (current <= endDate) {
      if (current.getDay() !== 0 && current.getDay() !== 6) days++;
      current.setDate(current.getDate() + 1);
    }

    const onDuty = await prisma.onDuty.create({
      data: {
        employeeId,
        startDate,
        endDate,
        days,
        reason: parsed.reason,
        location: parsed.location,
      },
    });

    res.status(201).json({ success: true, data: onDuty });
  } catch (err) {
    next(err);
  }
});

// GET /api/onduty
holidayRouter.get('/onduty', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { team } = req.query;
    const employeeId = req.user!.employeeId;

    let where: Record<string, unknown> = {};
    if (team === 'true' && req.user!.role !== 'EMPLOYEE') {
      if (req.user!.role === 'MANAGER') {
        where = { employee: { managerId: employeeId } };
      }
    } else {
      where = { employeeId };
    }

    const onDutyRequests = await prisma.onDuty.findMany({
      where,
      include: {
        employee: {
          select: { firstName: true, lastName: true, employeeId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: onDutyRequests });
  } catch (err) {
    next(err);
  }
});

// PUT /api/onduty/:id/approve
holidayRouter.put(
  '/onduty/:id/approve',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await prisma.onDuty.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedBy: req.user!.employeeId,
          approvedAt: new Date(),
          remarks: req.body.remarks,
        },
      });

      res.json({ success: true, message: 'On-duty approved' });
    } catch (err) {
      next(err);
    }
  },
);

// PUT /api/onduty/:id/reject
holidayRouter.put(
  '/onduty/:id/reject',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await prisma.onDuty.update({
        where: { id },
        data: {
          status: 'REJECTED',
          approvedBy: req.user!.employeeId,
          approvedAt: new Date(),
          remarks: req.body.remarks,
        },
      });

      res.json({ success: true, message: 'On-duty rejected' });
    } catch (err) {
      next(err);
    }
  },
);

export default holidayRouter;
