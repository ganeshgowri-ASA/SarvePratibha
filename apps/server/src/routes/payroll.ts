import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { payrollRunSchema } from '@sarve-pratibha/shared';

export const payrollRouter = Router();

payrollRouter.use(authenticate);

// GET /api/payroll/salary-structure/:employeeId
payrollRouter.get(
  '/salary-structure/:employeeId',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { employeeId } = req.params;

      // Employees can only view their own, managers+ can view others
      const employee = await prisma.employee.findFirst({
        where: { id: employeeId },
        select: { userId: true, managerId: true },
      });

      if (!employee) {
        throw new AppError(404, 'Employee not found');
      }

      if (
        req.user!.role === 'EMPLOYEE' &&
        employee.userId !== req.user!.id
      ) {
        throw new AppError(403, 'You can only view your own salary structure');
      }

      const structure = await prisma.payrollStructure.findUnique({
        where: { employeeId },
      });

      if (!structure) {
        throw new AppError(404, 'Salary structure not found');
      }

      res.json({ success: true, data: structure });
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/payroll/payslip/:employeeId?month=&year=
payrollRouter.get(
  '/payslip/:employeeId',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { employeeId } = req.params;
      const { month, year } = req.query;

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
        throw new AppError(403, 'You can only view your own payslips');
      }

      if (!month || !year) {
        throw new AppError(400, 'Month and year are required');
      }

      const payslip = await prisma.payslip.findUnique({
        where: {
          employeeId_month_year: {
            employeeId,
            month: Number(month),
            year: Number(year),
          },
        },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
              employeeId: true,
              department: { select: { name: true } },
              designation: { select: { name: true } },
              bankAccountNo: true,
              panNumber: true,
              pfNumber: true,
            },
          },
        },
      });

      if (!payslip) {
        throw new AppError(404, 'Payslip not found for the specified period');
      }

      res.json({ success: true, data: payslip });
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/payroll/payslips/:employeeId
payrollRouter.get(
  '/payslips/:employeeId',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { employeeId } = req.params;
      const { page = '1', limit = '12' } = req.query;

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
        throw new AppError(403, 'You can only view your own payslips');
      }

      const [payslips, total] = await Promise.all([
        prisma.payslip.findMany({
          where: { employeeId },
          orderBy: [{ year: 'desc' }, { month: 'desc' }],
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        prisma.payslip.count({ where: { employeeId } }),
      ]);

      res.json({
        success: true,
        data: payslips,
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

// POST /api/payroll/run (admin only - run monthly payroll)
payrollRouter.post(
  '/run',
  authorize('IT_ADMIN'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = payrollRunSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.errors[0].message);
      }

      const { month, year } = parsed.data;

      // Check if payroll already run for this period
      const existing = await prisma.payrollRun.findUnique({
        where: { month_year: { month, year } },
      });

      if (existing && existing.status === 'COMPLETED') {
        throw new AppError(400, `Payroll already processed for ${month}/${year}`);
      }

      // Get all active employees with payroll structures
      const employees = await prisma.employee.findMany({
        where: { employmentStatus: 'ACTIVE' },
        include: { payrollStructure: true },
      });

      const employeesWithStructure = employees.filter((e) => e.payrollStructure);

      // Create/update payroll run record
      const payrollRun = await prisma.payrollRun.upsert({
        where: { month_year: { month, year } },
        update: {
          status: 'PROCESSING',
          totalEmployees: employeesWithStructure.length,
          processedCount: 0,
          runBy: req.user!.id,
          startedAt: new Date(),
        },
        create: {
          month,
          year,
          status: 'PROCESSING',
          totalEmployees: employeesWithStructure.length,
          runBy: req.user!.id,
          startedAt: new Date(),
        },
      });

      let processedCount = 0;
      let totalGross = 0;
      let totalDeductions = 0;
      let totalNet = 0;

      // Generate payslips for each employee
      for (const emp of employeesWithStructure) {
        const ps = emp.payrollStructure!;

        // Check for LOP days (unpaid leave)
        const lopLeaves = await prisma.leaveRequest.findMany({
          where: {
            employeeId: emp.id,
            status: 'APPROVED',
            leaveType: { isPaidLeave: false },
            startDate: { gte: new Date(year, month - 1, 1) },
            endDate: { lte: new Date(year, month, 0) },
          },
        });

        const lopDays = lopLeaves.reduce((sum, l) => sum + l.days, 0);
        const workingDays = 30; // Simplified
        const lopDeduction = lopDays > 0 ? (ps.grossSalary / workingDays) * lopDays : 0;

        const grossEarnings = ps.grossSalary - lopDeduction;
        const totalDed = ps.pfContribution + ps.esiContribution + ps.professionalTax + ps.tds;
        const netPay = grossEarnings - totalDed;

        await prisma.payslip.upsert({
          where: {
            employeeId_month_year: { employeeId: emp.id, month, year },
          },
          update: {
            basicSalary: ps.basicSalary,
            hra: ps.hra,
            conveyance: ps.conveyance,
            medicalAllow: ps.medicalAllow,
            specialAllow: ps.specialAllow,
            otherAllow: ps.otherAllow,
            pfDeduction: ps.pfContribution,
            esiDeduction: ps.esiContribution,
            profTax: ps.professionalTax,
            tds: ps.tds,
            lop: lopDeduction,
            lopDays,
            grossEarnings,
            totalDeductions: totalDed,
            netPay,
            status: 'GENERATED',
            generatedAt: new Date(),
          },
          create: {
            employeeId: emp.id,
            month,
            year,
            basicSalary: ps.basicSalary,
            hra: ps.hra,
            conveyance: ps.conveyance,
            medicalAllow: ps.medicalAllow,
            specialAllow: ps.specialAllow,
            otherAllow: ps.otherAllow,
            pfDeduction: ps.pfContribution,
            esiDeduction: ps.esiContribution,
            profTax: ps.professionalTax,
            tds: ps.tds,
            lop: lopDeduction,
            lopDays,
            grossEarnings,
            totalDeductions: totalDed,
            netPay,
            status: 'GENERATED',
            generatedAt: new Date(),
          },
        });

        processedCount++;
        totalGross += grossEarnings;
        totalDeductions += totalDed;
        totalNet += netPay;
      }

      // Update payroll run
      await prisma.payrollRun.update({
        where: { id: payrollRun.id },
        data: {
          status: 'COMPLETED',
          processedCount,
          totalGross,
          totalDeductions,
          totalNet,
          completedAt: new Date(),
        },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: req.user!.id,
          action: 'PAYROLL_RUN',
          entity: 'PayrollRun',
          entityId: payrollRun.id,
          newData: { month, year, processedCount, totalGross, totalNet },
        },
      });

      res.json({
        success: true,
        data: {
          id: payrollRun.id,
          month,
          year,
          processedCount,
          totalGross,
          totalDeductions,
          totalNet,
          status: 'COMPLETED',
        },
        message: `Payroll processed for ${processedCount} employees`,
      });
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/payroll/summary?month=&year= (admin dashboard)
payrollRouter.get(
  '/summary',
  authorize('SECTION_HEAD'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { month, year } = req.query;

      if (!month || !year) {
        throw new AppError(400, 'Month and year are required');
      }

      const m = Number(month);
      const y = Number(year);

      const payslips = await prisma.payslip.findMany({
        where: { month: m, year: y },
      });

      const summary = {
        totalEmployees: payslips.length,
        totalGrossPay: payslips.reduce((sum, p) => sum + p.grossEarnings, 0),
        totalDeductions: payslips.reduce((sum, p) => sum + p.totalDeductions, 0),
        totalNetPay: payslips.reduce((sum, p) => sum + p.netPay, 0),
        paidCount: payslips.filter((p) => p.status === 'PAID').length,
        pendingCount: payslips.filter((p) => p.status !== 'PAID').length,
      };

      const payrollRun = await prisma.payrollRun.findUnique({
        where: { month_year: { month: m, year: y } },
      });

      res.json({
        success: true,
        data: { summary, payrollRun },
      });
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/payroll/runs (admin - list all payroll runs)
payrollRouter.get(
  '/runs',
  authorize('IT_ADMIN'),
  async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const runs = await prisma.payrollRun.findMany({
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        take: 24,
      });

      res.json({ success: true, data: runs });
    } catch (err) {
      next(err);
    }
  },
);
