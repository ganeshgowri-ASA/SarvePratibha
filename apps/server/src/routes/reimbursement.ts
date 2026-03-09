import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { reimbursementSubmitSchema, reimbursementApproveSchema } from '@sarve-pratibha/shared';

export const reimbursementRouter = Router();

reimbursementRouter.use(authenticate);

// GET /api/reimbursement/categories
reimbursementRouter.get(
  '/categories',
  async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const categories = await prisma.reimbursementCategory.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });

      res.json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  },
);

// POST /api/reimbursement/submit (with receipt upload)
reimbursementRouter.post(
  '/submit',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = reimbursementSubmitSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.errors[0].message);
      }

      const employee = await prisma.employee.findFirst({
        where: { userId: req.user!.id },
      });

      if (!employee) {
        throw new AppError(404, 'Employee profile not found');
      }

      // Validate category exists and check max amount
      const category = await prisma.reimbursementCategory.findUnique({
        where: { id: parsed.data.categoryId },
      });

      if (!category) {
        throw new AppError(404, 'Reimbursement category not found');
      }

      if (category.maxAmount && parsed.data.amount > category.maxAmount) {
        throw new AppError(
          400,
          `Amount exceeds maximum limit of ₹${category.maxAmount.toLocaleString('en-IN')} for ${category.name}`,
        );
      }

      const reimbursement = await prisma.reimbursement.create({
        data: {
          employeeId: employee.id,
          categoryId: parsed.data.categoryId,
          amount: parsed.data.amount,
          description: parsed.data.description,
          receiptUrl: parsed.data.receiptUrl,
          receiptName: parsed.data.receiptName,
          incurredDate: new Date(parsed.data.incurredDate as string),
          status: 'SUBMITTED',
        },
        include: {
          category: { select: { name: true, code: true } },
        },
      });

      res.status(201).json({
        success: true,
        data: reimbursement,
        message: 'Reimbursement claim submitted successfully',
      });
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/reimbursement/list/:employeeId
reimbursementRouter.get(
  '/list/:employeeId',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { employeeId } = req.params;
      const { page = '1', limit = '20', status } = req.query;

      const employee = await prisma.employee.findFirst({
        where: { id: employeeId },
        select: { userId: true },
      });

      if (!employee) {
        throw new AppError(404, 'Employee not found');
      }

      if (
        req.user!.role === 'EMPLOYEE' &&
        employee.userId !== req.user!.id
      ) {
        throw new AppError(403, 'You can only view your own reimbursements');
      }

      const where: Record<string, unknown> = { employeeId };
      if (status) where.status = status;

      const [reimbursements, total] = await Promise.all([
        prisma.reimbursement.findMany({
          where,
          include: {
            category: { select: { name: true, code: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        prisma.reimbursement.count({ where }),
      ]);

      res.json({
        success: true,
        data: reimbursements,
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
  },
);

// GET /api/reimbursement/pending (manager view)
reimbursementRouter.get(
  '/pending',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { page = '1', limit = '20' } = req.query;

      // Get the manager's employee record
      const managerEmployee = await prisma.employee.findFirst({
        where: { userId: req.user!.id },
      });

      let where: Record<string, unknown> = { status: 'SUBMITTED' };

      // Managers see their direct reports, Section Heads see department, IT Admin sees all
      if (req.user!.role === 'MANAGER' && managerEmployee) {
        where = {
          status: 'SUBMITTED',
          employee: { managerId: managerEmployee.id },
        };
      } else if (req.user!.role === 'SECTION_HEAD' && managerEmployee) {
        where = {
          status: 'SUBMITTED',
          employee: { departmentId: managerEmployee.departmentId },
        };
      }

      const [reimbursements, total] = await Promise.all([
        prisma.reimbursement.findMany({
          where,
          include: {
            employee: {
              select: {
                firstName: true,
                lastName: true,
                employeeId: true,
                department: { select: { name: true } },
              },
            },
            category: { select: { name: true, code: true } },
          },
          orderBy: { createdAt: 'asc' },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        prisma.reimbursement.count({ where }),
      ]);

      res.json({
        success: true,
        data: reimbursements,
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
  },
);

// PUT /api/reimbursement/:id/approve (manager approval)
reimbursementRouter.put(
  '/:id/approve',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const parsed = reimbursementApproveSchema.safeParse(req.body);

      const reimbursement = await prisma.reimbursement.findUnique({
        where: { id },
        include: { employee: { select: { managerId: true, userId: true } } },
      });

      if (!reimbursement) {
        throw new AppError(404, 'Reimbursement not found');
      }

      if (reimbursement.status !== 'SUBMITTED') {
        throw new AppError(400, 'Only submitted reimbursements can be approved');
      }

      const updated = await prisma.reimbursement.update({
        where: { id },
        data: {
          status: 'MANAGER_APPROVED',
          approvedBy: req.user!.id,
          approvedAt: new Date(),
          remarks: parsed.success ? parsed.data.remarks : undefined,
        },
        include: {
          category: { select: { name: true, code: true } },
          employee: { select: { firstName: true, lastName: true, employeeId: true } },
        },
      });

      res.json({
        success: true,
        data: updated,
        message: 'Reimbursement approved successfully',
      });
    } catch (err) {
      next(err);
    }
  },
);

// PUT /api/reimbursement/:id/reject (manager rejection)
reimbursementRouter.put(
  '/:id/reject',
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { remarks } = req.body;

      const reimbursement = await prisma.reimbursement.findUnique({
        where: { id },
      });

      if (!reimbursement) {
        throw new AppError(404, 'Reimbursement not found');
      }

      if (reimbursement.status !== 'SUBMITTED') {
        throw new AppError(400, 'Only submitted reimbursements can be rejected');
      }

      const updated = await prisma.reimbursement.update({
        where: { id },
        data: {
          status: 'REJECTED',
          approvedBy: req.user!.id,
          approvedAt: new Date(),
          remarks: remarks || 'Rejected by manager',
        },
        include: {
          category: { select: { name: true, code: true } },
          employee: { select: { firstName: true, lastName: true, employeeId: true } },
        },
      });

      res.json({
        success: true,
        data: updated,
        message: 'Reimbursement rejected',
      });
    } catch (err) {
      next(err);
    }
  },
);
