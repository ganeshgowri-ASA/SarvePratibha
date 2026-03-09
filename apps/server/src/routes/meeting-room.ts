import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { meetingBookingSchema } from '@sarve-pratibha/shared';

export const meetingRoomRouter = Router();

meetingRoomRouter.use(authenticate);

// Book meeting room
meetingRoomRouter.post('/book', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = meetingBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(400, parsed.error.errors[0].message));
    }

    const employee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!employee) return next(new AppError(404, 'Employee not found'));

    const room = await prisma.meetingRoom.findUnique({ where: { id: parsed.data.roomId } });
    if (!room) return next(new AppError(404, 'Meeting room not found'));
    if (!room.isActive) return next(new AppError(400, 'Meeting room is not available'));

    // Check for conflicting bookings
    const bookingDate = new Date(parsed.data.date);
    const conflicts = await prisma.meetingBooking.findMany({
      where: {
        roomId: parsed.data.roomId,
        date: bookingDate,
        status: 'CONFIRMED',
        OR: [
          {
            startTime: { lt: parsed.data.endTime },
            endTime: { gt: parsed.data.startTime },
          },
        ],
      },
    });

    if (conflicts.length > 0) {
      return next(new AppError(409, 'Meeting room is already booked for this time slot'));
    }

    const booking = await prisma.meetingBooking.create({
      data: {
        roomId: parsed.data.roomId,
        employeeId: employee.id,
        title: parsed.data.title,
        date: bookingDate,
        startTime: parsed.data.startTime,
        endTime: parsed.data.endTime,
        attendees: parsed.data.attendees || 1,
        isRecurring: parsed.data.isRecurring || false,
        recurringEnd: parsed.data.recurringEnd ? new Date(parsed.data.recurringEnd) : null,
        notes: parsed.data.notes,
      },
      include: { room: true },
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});

// Get room availability
meetingRoomRouter.get('/availability', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { date, floor } = req.query;
    if (!date) return next(new AppError(400, 'Date is required'));

    const where: Record<string, unknown> = { isActive: true };
    if (floor) where.floor = Number(floor);

    const rooms = await prisma.meetingRoom.findMany({
      where,
      include: {
        bookings: {
          where: {
            date: new Date(date as string),
            status: 'CONFIRMED',
          },
          orderBy: { startTime: 'asc' },
          select: {
            id: true,
            title: true,
            startTime: true,
            endTime: true,
            attendees: true,
            employee: { select: { firstName: true, lastName: true } },
          },
        },
      },
      orderBy: [{ floor: 'asc' }, { name: 'asc' }],
    });

    res.json({ success: true, data: rooms });
  } catch (err) {
    next(err);
  }
});

export default meetingRoomRouter;
