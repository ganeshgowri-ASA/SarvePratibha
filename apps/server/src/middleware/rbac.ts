import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { AppError } from './error-handler';

// Role hierarchy: higher roles inherit lower role permissions
const ROLE_HIERARCHY: Record<UserRole, number> = {
  EMPLOYEE: 0,
  MANAGER: 1,
  SECTION_HEAD: 2,
  IT_ADMIN: 3,
};

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    employeeId?: string;
  };
}

/**
 * Authenticate JWT token from Authorization header
 */
export function authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError(401, 'Authentication required'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: string;
      email: string;
      role: UserRole;
      employeeId?: string;
    };
    req.user = decoded;
    next();
  } catch {
    return next(new AppError(401, 'Invalid or expired token'));
  }
}

/**
 * Authorize based on minimum required role.
 * Higher roles automatically have access to lower role endpoints.
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Authentication required'));
    }

    const userLevel = ROLE_HIERARCHY[req.user.role];
    const minRequiredLevel = Math.min(...allowedRoles.map((r) => ROLE_HIERARCHY[r]));

    // IT_ADMIN always has full access
    if (req.user.role === 'IT_ADMIN') {
      return next();
    }

    // Check if user's role level meets the minimum required level
    if (userLevel >= minRequiredLevel) {
      return next();
    }

    return next(new AppError(403, 'Insufficient permissions'));
  };
}

/**
 * Require exact role (no inheritance)
 */
export function requireRole(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Authentication required'));
    }

    if (req.user.role === 'IT_ADMIN' || roles.includes(req.user.role)) {
      return next();
    }

    return next(new AppError(403, 'Insufficient permissions'));
  };
}
