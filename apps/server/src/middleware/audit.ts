import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from './rbac';

/**
 * Middleware that logs admin actions to the audit trail
 */
export function auditLog(action: string, entity: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);

    res.json = function (body: any) {
      // Only log successful operations
      if (body?.success && req.user?.id) {
        prisma.auditLog
          .create({
            data: {
              userId: req.user.id,
              action,
              entity,
              entityId: req.params?.id || body?.data?.id || null,
              newData: ['POST', 'PUT', 'PATCH'].includes(req.method) ? req.body : undefined,
              ipAddress: req.ip || req.headers['x-forwarded-for']?.toString() || null,
              userAgent: req.headers['user-agent'] || null,
            },
          })
          .catch((err) => console.error('Audit log error:', err));
      }
      return originalJson(body);
    };

    next();
  };
}
