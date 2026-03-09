import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, requireRole, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { notificationService } from '../services/notification.service';
import {
  sendNotificationSchema,
  bulkNotificationSchema,
  updatePreferencesSchema,
  createTemplateSchema,
  updateTemplateSchema,
  pushSubscriptionSchema,
} from '@sarve-pratibha/shared';
import type { NotificationCategory } from '@prisma/client';

export const notificationRouter = Router();

notificationRouter.use(authenticate);

// ─── User Notifications ────────────────────────────────────────────

// GET /api/notifications/:userId - List notifications for a user
notificationRouter.get('/:userId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    // Users can only view their own notifications unless admin
    if (req.user!.role !== 'IT_ADMIN' && req.user!.id !== userId) {
      throw new AppError(403, 'Cannot view other users\' notifications');
    }

    const { read, type, category, page = '1', limit = '20' } = req.query;

    const result = await notificationService.getForUser(userId, {
      read: read !== undefined ? read === 'true' : undefined,
      category: category as NotificationCategory | undefined,
      page: Number(page),
      limit: Number(limit),
    });

    res.json({
      success: true,
      data: result.notifications,
      unreadCount: result.unreadCount,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/notifications/:id/read - Mark notification as read
notificationRouter.put('/:id/read', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await notificationService.markAsRead(req.params.id, req.user!.id);
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    next(err);
  }
});

// PUT /api/notifications/read-all - Mark all as read
notificationRouter.put('/read-all', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await notificationService.markAllAsRead(req.user!.id);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/notifications/:id - Delete notification
notificationRouter.delete('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await notificationService.delete(req.params.id, req.user!.id);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    next(err);
  }
});

// ─── Preferences ───────────────────────────────────────────────────

// GET /api/notifications/preferences/:userId
notificationRouter.get('/preferences/:userId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    if (req.user!.role !== 'IT_ADMIN' && req.user!.id !== userId) {
      throw new AppError(403, 'Cannot view other users\' preferences');
    }

    const [preferences, quietHours] = await Promise.all([
      prisma.notificationPreference.findMany({ where: { userId } }),
      prisma.quietHours.findUnique({ where: { userId } }),
    ]);

    res.json({
      success: true,
      data: {
        preferences,
        quietHours: quietHours || { enabled: false, startTime: '22:00', endTime: '07:00', timezone: 'Asia/Kolkata' },
      },
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/notifications/preferences - Update preferences
notificationRouter.put('/preferences', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = updatePreferencesSchema.parse(req.body);
    const userId = req.user!.id;

    // Upsert preferences
    for (const pref of parsed.preferences) {
      await prisma.notificationPreference.upsert({
        where: { userId_category: { userId, category: pref.category } },
        update: {
          email: pref.email,
          sms: pref.sms,
          push: pref.push,
          inApp: pref.inApp,
          frequency: pref.frequency,
        },
        create: {
          userId,
          category: pref.category,
          email: pref.email,
          sms: pref.sms,
          push: pref.push,
          inApp: pref.inApp,
          frequency: pref.frequency,
        },
      });
    }

    // Upsert quiet hours
    if (parsed.quietHours) {
      await prisma.quietHours.upsert({
        where: { userId },
        update: {
          enabled: parsed.quietHours.enabled,
          startTime: parsed.quietHours.startTime,
          endTime: parsed.quietHours.endTime,
          timezone: parsed.quietHours.timezone,
        },
        create: {
          userId,
          enabled: parsed.quietHours.enabled,
          startTime: parsed.quietHours.startTime,
          endTime: parsed.quietHours.endTime,
          timezone: parsed.quietHours.timezone,
        },
      });
    }

    res.json({ success: true, message: 'Preferences updated' });
  } catch (err) {
    next(err);
  }
});

// ─── Admin: Send Notifications ─────────────────────────────────────

// POST /api/notifications/send - Admin send custom notification
notificationRouter.post('/send', requireRole('IT_ADMIN'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = sendNotificationSchema.parse(req.body);

    const targetUser = await prisma.user.findUnique({
      where: { id: parsed.userId },
      select: { id: true, email: true, employee: { select: { phone: true } } },
    });

    if (!targetUser) throw new AppError(404, 'Target user not found');

    await notificationService.createAndDeliver({
      userId: parsed.userId,
      title: parsed.title,
      message: parsed.message,
      type: parsed.type,
      category: parsed.category,
      link: parsed.link,
      channels: parsed.channels,
      userEmail: targetUser.email,
      userPhone: targetUser.employee?.phone || undefined,
    });

    res.json({ success: true, message: 'Notification sent' });
  } catch (err) {
    next(err);
  }
});

// POST /api/notifications/bulk - Admin bulk notification
notificationRouter.post('/bulk', requireRole('IT_ADMIN'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = bulkNotificationSchema.parse(req.body);

    const result = await notificationService.sendBulk({
      title: parsed.title,
      message: parsed.message,
      type: parsed.type,
      category: parsed.category,
      targetRoles: parsed.targetRoles,
      targetDepts: parsed.targetDepts,
      channels: parsed.channels,
      createdBy: req.user!.id,
    });

    res.json({ success: true, data: result, message: 'Bulk notification initiated' });
  } catch (err) {
    next(err);
  }
});

// ─── Templates ─────────────────────────────────────────────────────

// GET /api/notifications/templates
notificationRouter.get('/templates', requireRole('IT_ADMIN'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { category, channel } = req.query;
    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (channel) where.channel = channel;

    const templates = await prisma.notificationTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: templates });
  } catch (err) {
    next(err);
  }
});

// POST /api/notifications/templates
notificationRouter.post('/templates', requireRole('IT_ADMIN'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = createTemplateSchema.parse(req.body);

    const template = await prisma.notificationTemplate.create({
      data: {
        name: parsed.name,
        subject: parsed.subject,
        body: parsed.body,
        category: parsed.category,
        channel: parsed.channel,
        variables: parsed.variables || undefined,
        createdBy: req.user!.id,
      },
    });

    res.status(201).json({ success: true, data: template });
  } catch (err) {
    next(err);
  }
});

// PUT /api/notifications/templates/:id
notificationRouter.put('/templates/:id', requireRole('IT_ADMIN'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = updateTemplateSchema.parse(req.body);

    const template = await prisma.notificationTemplate.update({
      where: { id: req.params.id },
      data: parsed,
    });

    res.json({ success: true, data: template });
  } catch (err) {
    next(err);
  }
});

// ─── Logs ──────────────────────────────────────────────────────────

// GET /api/notifications/logs/email
notificationRouter.get('/logs/email', requireRole('IT_ADMIN'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { from, to, page = '1', limit = '50', status } = req.query;
    const where: Record<string, unknown> = {};

    if (from || to) {
      where.createdAt = {};
      if (from) (where.createdAt as Record<string, unknown>).gte = new Date(from as string);
      if (to) (where.createdAt as Record<string, unknown>).lte = new Date(to as string);
    }
    if (status) where.status = status;

    const [logs, total] = await Promise.all([
      prisma.emailLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.emailLog.count({ where }),
    ]);

    res.json({
      success: true,
      data: logs,
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

// GET /api/notifications/logs/sms
notificationRouter.get('/logs/sms', requireRole('IT_ADMIN'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { from, to, page = '1', limit = '50', status } = req.query;
    const where: Record<string, unknown> = {};

    if (from || to) {
      where.createdAt = {};
      if (from) (where.createdAt as Record<string, unknown>).gte = new Date(from as string);
      if (to) (where.createdAt as Record<string, unknown>).lte = new Date(to as string);
    }
    if (status) where.status = status;

    const [logs, total] = await Promise.all([
      prisma.sMSLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.sMSLog.count({ where }),
    ]);

    res.json({
      success: true,
      data: logs,
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

// ─── Push Subscription ─────────────────────────────────────────────

// POST /api/notifications/push/subscribe
notificationRouter.post('/push/subscribe', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = pushSubscriptionSchema.parse(req.body);

    await prisma.pushSubscription.upsert({
      where: { id: 'temp' }, // will use create since this won't match
      update: {
        endpoint: parsed.endpoint,
        p256dh: parsed.keys.p256dh,
        auth: parsed.keys.auth,
        userAgent: parsed.userAgent,
        isActive: true,
      },
      create: {
        userId: req.user!.id,
        endpoint: parsed.endpoint,
        p256dh: parsed.keys.p256dh,
        auth: parsed.keys.auth,
        userAgent: parsed.userAgent,
      },
    });

    res.json({ success: true, message: 'Push subscription saved' });
  } catch (err) {
    next(err);
  }
});
