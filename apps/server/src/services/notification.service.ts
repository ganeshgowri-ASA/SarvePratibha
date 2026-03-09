import { prisma } from '../lib/prisma';
import { emailService } from './email.service';
import { smsService } from './sms.service';
import type { NotificationType, NotificationCategory, NotificationChannel } from '@prisma/client';

interface CreateNotificationOptions {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  category?: NotificationCategory;
  link?: string;
  metadata?: Record<string, unknown>;
  channels?: NotificationChannel[];
}

interface NotificationWithDelivery extends CreateNotificationOptions {
  userEmail?: string;
  userPhone?: string;
}

export class NotificationService {
  async create(options: CreateNotificationOptions) {
    const notification = await prisma.notification.create({
      data: {
        userId: options.userId,
        title: options.title,
        message: options.message,
        type: options.type || 'INFO',
        category: options.category || 'GENERAL',
        link: options.link,
        metadata: options.metadata || undefined,
      },
    });

    // Send via additional channels if specified
    if (options.channels && options.channels.length > 0) {
      await this.deliverViaChannels({
        ...options,
      });
    }

    return notification;
  }

  async createAndDeliver(options: NotificationWithDelivery) {
    // Check user preferences
    const preferences = await prisma.notificationPreference.findUnique({
      where: {
        userId_category: {
          userId: options.userId,
          category: options.category || 'GENERAL',
        },
      },
    });

    // Check quiet hours
    const quietHours = await prisma.quietHours.findUnique({
      where: { userId: options.userId },
    });

    const isQuietTime = quietHours?.enabled ? this.isInQuietHours(quietHours) : false;

    // Always create in-app notification unless disabled
    if (!preferences || preferences.inApp) {
      await this.create(options);
    }

    if (isQuietTime) return;

    // Deliver via channels based on preferences
    const channels: NotificationChannel[] = [];
    if (preferences?.email && options.userEmail) channels.push('EMAIL');
    if (preferences?.sms && options.userPhone) channels.push('SMS');
    if (preferences?.push) channels.push('PUSH');

    if (channels.length > 0 || (options.channels && options.channels.length > 0)) {
      await this.deliverViaChannels({
        ...options,
        channels: options.channels || channels,
      });
    }
  }

  private async deliverViaChannels(options: NotificationWithDelivery) {
    const channels = options.channels || [];

    for (const channel of channels) {
      try {
        switch (channel) {
          case 'EMAIL':
            if (options.userEmail) {
              await emailService.send({
                to: options.userEmail,
                subject: options.title,
                body: this.wrapHtmlEmail(options.title, options.message),
              });
            }
            break;
          case 'SMS':
            if (options.userPhone) {
              await smsService.send({
                to: options.userPhone,
                message: `${options.title}: ${options.message}`,
              });
            }
            break;
          case 'PUSH':
            // Push notification delivery handled by web push API on the client
            break;
        }
      } catch (error) {
        console.error(`Failed to deliver notification via ${channel}:`, error);
      }
    }
  }

  async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async delete(notificationId: string, userId: string) {
    return prisma.notification.deleteMany({
      where: { id: notificationId, userId },
    });
  }

  async getForUser(
    userId: string,
    options: {
      read?: boolean;
      category?: NotificationCategory;
      page?: number;
      limit?: number;
    } = {},
  ) {
    const { page = 1, limit = 20, read, category } = options;

    const where: Record<string, unknown> = { userId };
    if (read !== undefined) where.isRead = read;
    if (category) where.category = category;

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return {
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async sendBulk(options: {
    title: string;
    message: string;
    type?: NotificationType;
    category?: NotificationCategory;
    targetRoles?: string[];
    targetDepts?: string[];
    channels?: NotificationChannel[];
    createdBy: string;
  }) {
    const bulkNotification = await prisma.bulkNotification.create({
      data: {
        title: options.title,
        message: options.message,
        type: options.type || 'INFO',
        category: options.category || 'GENERAL',
        targetRoles: options.targetRoles || undefined,
        targetDepts: options.targetDepts || undefined,
        channels: options.channels || undefined,
        createdBy: options.createdBy,
        status: 'PROCESSING',
      },
    });

    // Find target users
    const userWhere: Record<string, unknown> = { isActive: true };
    if (options.targetRoles && options.targetRoles.length > 0) {
      userWhere.role = { in: options.targetRoles };
    }

    const users = await prisma.user.findMany({
      where: userWhere,
      select: { id: true, email: true },
      ...(options.targetDepts && options.targetDepts.length > 0
        ? {
            where: {
              ...userWhere,
              employee: { departmentId: { in: options.targetDepts } },
            },
          }
        : {}),
    });

    let sentCount = 0;
    let failedCount = 0;

    for (const user of users) {
      try {
        await this.create({
          userId: user.id,
          title: options.title,
          message: options.message,
          type: options.type,
          category: options.category,
        });
        sentCount++;
      } catch {
        failedCount++;
      }
    }

    await prisma.bulkNotification.update({
      where: { id: bulkNotification.id },
      data: {
        totalCount: users.length,
        sentCount,
        failedCount,
        status: failedCount === users.length ? 'FAILED' : 'COMPLETED',
      },
    });

    return bulkNotification;
  }

  private isInQuietHours(quietHours: { startTime: string; endTime: string }): boolean {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const [startH, startM] = quietHours.startTime.split(':').map(Number);
    const [endH, endM] = quietHours.endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (startMinutes <= endMinutes) {
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    }
    // Overnight quiet hours (e.g., 22:00 to 07:00)
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }

  private wrapHtmlEmail(title: string, body: string): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <div style="background:#0d9488;padding:20px;border-radius:8px 8px 0 0;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:20px;">SarvePratibha</h1>
    </div>
    <div style="background:#fff;padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
      <h2 style="color:#0f172a;margin:0 0 16px;">${title}</h2>
      <div style="color:#475569;line-height:1.6;">${body}</div>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
      <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
        This is an automated notification from SarvePratibha HRMS.
      </p>
    </div>
  </div>
</body>
</html>`;
  }
}

export const notificationService = new NotificationService();
