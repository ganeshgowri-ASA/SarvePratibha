import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { checkinSchema, checkoutSchema, regularizeSchema } from '@sarve-pratibha/shared';

export const attendanceRouter = Router();

attendanceRouter.use(authenticate);

// ─── Check-in ───────────────────────────────────────────────────────

// POST /api/attendance/checkin
attendanceRouter.post('/checkin', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = checkinSchema.parse(req.body);
    const employeeId = req.user!.employeeId;
    if (!employeeId) throw new AppError(400, 'Employee profile not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already punched in today
    const existingPunch = await prisma.punchRecord.findFirst({
      where: {
        employeeId,
        punchType: 'PUNCH_IN',
        punchTime: { gte: today },
      },
      orderBy: { punchTime: 'desc' },
    });

    // Check last punch type
    const lastPunch = await prisma.punchRecord.findFirst({
      where: {
        employeeId,
        punchTime: { gte: today },
      },
      orderBy: { punchTime: 'desc' },
    });

    if (lastPunch && lastPunch.punchType === 'PUNCH_IN') {
      throw new AppError(400, 'Already punched in. Please punch out first.');
    }

    const punchRecord = await prisma.punchRecord.create({
      data: {
        employeeId,
        punchType: 'PUNCH_IN',
        location: parsed.location
          ? parsed.location
          : parsed.latitude && parsed.longitude
            ? `${parsed.latitude},${parsed.longitude}`
            : null,
        ipAddress: req.ip,
      },
    });

    // Create or update attendance record for today
    const attendanceDate = new Date(today);
    const existing = await prisma.attendance.findUnique({
      where: { employeeId_date: { employeeId, date: attendanceDate } },
    });

    if (!existing) {
      await prisma.attendance.create({
        data: {
          employeeId,
          date: attendanceDate,
          status: 'PRESENT',
          firstPunchIn: punchRecord.punchTime,
        },
      });
    }

    res.status(201).json({
      success: true,
      data: {
        punchRecord,
        message: 'Checked in successfully',
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── Check-out ──────────────────────────────────────────────────────

// POST /api/attendance/checkout
attendanceRouter.post('/checkout', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = checkoutSchema.parse(req.body);
    const employeeId = req.user!.employeeId;
    if (!employeeId) throw new AppError(400, 'Employee profile not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if punched in
    const lastPunch = await prisma.punchRecord.findFirst({
      where: {
        employeeId,
        punchTime: { gte: today },
      },
      orderBy: { punchTime: 'desc' },
    });

    if (!lastPunch || lastPunch.punchType === 'PUNCH_OUT') {
      throw new AppError(400, 'Not punched in. Please punch in first.');
    }

    const punchRecord = await prisma.punchRecord.create({
      data: {
        employeeId,
        punchType: 'PUNCH_OUT',
        location: parsed.location
          ? parsed.location
          : parsed.latitude && parsed.longitude
            ? `${parsed.latitude},${parsed.longitude}`
            : null,
        ipAddress: req.ip,
      },
    });

    // Update attendance with total hours
    const firstPunch = await prisma.punchRecord.findFirst({
      where: {
        employeeId,
        punchType: 'PUNCH_IN',
        punchTime: { gte: today },
      },
      orderBy: { punchTime: 'asc' },
    });

    if (firstPunch) {
      const totalMs = punchRecord.punchTime.getTime() - firstPunch.punchTime.getTime();
      const totalHours = Math.round((totalMs / 3600000) * 100) / 100;
      const overtime = Math.max(0, totalHours - 8);

      const attendanceDate = new Date(today);
      await prisma.attendance.upsert({
        where: { employeeId_date: { employeeId, date: attendanceDate } },
        update: {
          lastPunchOut: punchRecord.punchTime,
          totalHours,
          overtime: overtime > 0 ? overtime : null,
          status: totalHours < 4 ? 'HALF_DAY' : 'PRESENT',
        },
        create: {
          employeeId,
          date: attendanceDate,
          status: totalHours < 4 ? 'HALF_DAY' : 'PRESENT',
          firstPunchIn: firstPunch.punchTime,
          lastPunchOut: punchRecord.punchTime,
          totalHours,
          overtime: overtime > 0 ? overtime : null,
        },
      });
    }

    res.status(201).json({
      success: true,
      data: {
        punchRecord,
        message: 'Checked out successfully',
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── Attendance Log ─────────────────────────────────────────────────

// GET /api/attendance/log/:employeeId?month=&year=
attendanceRouter.get('/log/:employeeId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const year = Number(req.query.year) || new Date().getFullYear();

    if (
      req.user!.role === 'EMPLOYEE' &&
      req.user!.employeeId !== employeeId
    ) {
      throw new AppError(403, 'You can only view your own attendance');
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendances = await prisma.attendance.findMany({
      where: {
        employeeId,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: 'asc' },
    });

    // Get holidays for the month
    const holidays = await prisma.holidayCalendar.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
        year,
      },
    });

    res.json({ success: true, data: { attendances, holidays } });
  } catch (err) {
    next(err);
  }
});

// ─── Punch Status ───────────────────────────────────────────────────

// GET /api/attendance/status - Current punch status
attendanceRouter.get('/status', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const employeeId = req.user!.employeeId;
    if (!employeeId) throw new AppError(400, 'Employee profile not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastPunch = await prisma.punchRecord.findFirst({
      where: {
        employeeId,
        punchTime: { gte: today },
      },
      orderBy: { punchTime: 'desc' },
    });

    const firstPunch = await prisma.punchRecord.findFirst({
      where: {
        employeeId,
        punchType: 'PUNCH_IN',
        punchTime: { gte: today },
      },
      orderBy: { punchTime: 'asc' },
    });

    const isPunchedIn = lastPunch?.punchType === 'PUNCH_IN';

    let todayHours: number | undefined;
    if (firstPunch) {
      const endTime = isPunchedIn ? new Date() : (lastPunch?.punchTime || new Date());
      todayHours = Math.round(((endTime.getTime() - firstPunch.punchTime.getTime()) / 3600000) * 100) / 100;
    }

    res.json({
      success: true,
      data: {
        isPunchedIn,
        lastPunchTime: lastPunch?.punchTime.toISOString(),
        punchInTime: firstPunch?.punchTime.toISOString(),
        todayHours,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── Team Attendance ────────────────────────────────────────────────

// GET /api/attendance/team/:managerId
attendanceRouter.get(
  '/team/:managerId',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { managerId } = req.params;
      const date = req.query.date
        ? new Date(req.query.date as string)
        : new Date();
      date.setHours(0, 0, 0, 0);

      let teamFilter: Record<string, unknown> = {};

      if (req.user!.role === 'MANAGER') {
        teamFilter = { managerId };
      } else if (req.user!.role === 'SECTION_HEAD') {
        const manager = await prisma.employee.findUnique({
          where: { id: managerId },
          select: { departmentId: true },
        });
        if (manager) {
          teamFilter = { departmentId: manager.departmentId };
        }
      }
      // IT_ADMIN sees all - no filter

      const employees = await prisma.employee.findMany({
        where: { ...teamFilter, employmentStatus: 'ACTIVE' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeId: true,
          department: { select: { name: true } },
          attendances: {
            where: { date },
            take: 1,
          },
        },
      });

      const data = employees.map((emp) => ({
        employeeId: emp.employeeId,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        department: emp.department.name,
        date: date.toISOString(),
        status: emp.attendances[0]?.status || 'ABSENT',
        punchIn: emp.attendances[0]?.firstPunchIn?.toISOString(),
        punchOut: emp.attendances[0]?.lastPunchOut?.toISOString(),
        totalHours: emp.attendances[0]?.totalHours,
      }));

      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
);

// ─── Regularization ─────────────────────────────────────────────────

// POST /api/attendance/regularize
attendanceRouter.post('/regularize', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = regularizeSchema.parse(req.body);
    const employeeId = req.user!.employeeId;
    if (!employeeId) throw new AppError(400, 'Employee profile not found');

    const date = new Date(parsed.date);
    date.setHours(0, 0, 0, 0);

    // Check if already has a pending regularization for this date
    const existing = await prisma.attendanceRegularization.findFirst({
      where: {
        employeeId,
        date,
        status: 'PENDING',
      },
    });

    if (existing) {
      throw new AppError(400, 'Pending regularization already exists for this date');
    }

    const regularization = await prisma.attendanceRegularization.create({
      data: {
        employeeId,
        date,
        reason: parsed.reason,
        requestedStatus: parsed.requestedStatus as any,
      },
    });

    res.status(201).json({ success: true, data: regularization });
  } catch (err) {
    next(err);
  }
});

// PUT /api/attendance/regularize/:id/approve
attendanceRouter.put(
  '/regularize/:id/approve',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { remarks } = req.body;

      const reg = await prisma.attendanceRegularization.findUnique({
        where: { id },
        include: { employee: true },
      });
      if (!reg) throw new AppError(404, 'Regularization request not found');
      if (reg.status !== 'PENDING') throw new AppError(400, 'Request is not pending');

      await prisma.$transaction(async (tx) => {
        await tx.attendanceRegularization.update({
          where: { id },
          data: {
            status: 'APPROVED',
            approvedBy: req.user!.employeeId,
            approvedAt: new Date(),
            remarks,
          },
        });

        // Update the actual attendance record
        await tx.attendance.upsert({
          where: { employeeId_date: { employeeId: reg.employeeId, date: reg.date } },
          update: { status: reg.requestedStatus, remarks: `Regularized: ${reg.reason}` },
          create: {
            employeeId: reg.employeeId,
            date: reg.date,
            status: reg.requestedStatus,
            remarks: `Regularized: ${reg.reason}`,
          },
        });
      });

      res.json({ success: true, message: 'Regularization approved' });
    } catch (err) {
      next(err);
    }
  },
);

// PUT /api/attendance/regularize/:id/reject
attendanceRouter.put(
  '/regularize/:id/reject',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { remarks } = req.body;

      const reg = await prisma.attendanceRegularization.findUnique({ where: { id } });
      if (!reg) throw new AppError(404, 'Regularization request not found');
      if (reg.status !== 'PENDING') throw new AppError(400, 'Request is not pending');

      await prisma.attendanceRegularization.update({
        where: { id },
        data: {
          status: 'REJECTED',
          approvedBy: req.user!.employeeId,
          approvedAt: new Date(),
          remarks,
        },
      });

      res.json({ success: true, message: 'Regularization rejected' });
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/attendance/regularizations - get employee's regularization requests
attendanceRouter.get('/regularizations', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { team } = req.query;
    const employeeId = req.user!.employeeId;

    let where: Record<string, unknown> = {};

    if (team === 'true' && req.user!.role !== 'EMPLOYEE') {
      if (req.user!.role === 'MANAGER') {
        where = { employee: { managerId: employeeId } };
      } else if (req.user!.role === 'SECTION_HEAD') {
        const emp = await prisma.employee.findUnique({
          where: { id: employeeId! },
          select: { departmentId: true },
        });
        if (emp) where = { employee: { departmentId: emp.departmentId } };
      }
    } else {
      where = { employeeId };
    }

    const regularizations = await prisma.attendanceRegularization.findMany({
      where,
      include: {
        employee: {
          select: { firstName: true, lastName: true, employeeId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: regularizations });
  } catch (err) {
    next(err);
  }
});

export default attendanceRouter;
