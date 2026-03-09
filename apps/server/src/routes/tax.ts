import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { taxDeclarationSchema, regimeSelectionSchema } from '@sarve-pratibha/shared';

export const taxRouter = Router();

taxRouter.use(authenticate);

// ─── Tax Calculation Helpers ────────────────────────────────────────

function calculateOldRegimeTax(taxableIncome: number): number {
  if (taxableIncome <= 250000) return 0;
  let tax = 0;
  if (taxableIncome > 250000) tax += Math.min(taxableIncome - 250000, 250000) * 0.05;
  if (taxableIncome > 500000) tax += Math.min(taxableIncome - 500000, 500000) * 0.2;
  if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.3;
  // Rebate u/s 87A for income up to 5L
  if (taxableIncome <= 500000) tax = 0;
  return tax;
}

function calculateNewRegimeTax(taxableIncome: number): number {
  if (taxableIncome <= 300000) return 0;
  let tax = 0;
  if (taxableIncome > 300000) tax += Math.min(taxableIncome - 300000, 300000) * 0.05;
  if (taxableIncome > 600000) tax += Math.min(taxableIncome - 600000, 300000) * 0.1;
  if (taxableIncome > 900000) tax += Math.min(taxableIncome - 900000, 300000) * 0.15;
  if (taxableIncome > 1200000) tax += Math.min(taxableIncome - 1200000, 300000) * 0.2;
  if (taxableIncome > 1500000) tax += (taxableIncome - 1500000) * 0.3;
  // Rebate u/s 87A for income up to 7L under new regime
  if (taxableIncome <= 700000) tax = 0;
  return tax;
}

function calculateHraExemption(
  basicSalary: number,
  hraReceived: number,
  rentPaid: number,
  isMetro: boolean,
): number {
  if (rentPaid <= 0 || hraReceived <= 0) return 0;
  const actual = hraReceived;
  const pctBasic = basicSalary * (isMetro ? 0.5 : 0.4);
  const rentMinusBasic = Math.max(rentPaid - basicSalary * 0.1, 0);
  return Math.min(actual, pctBasic, rentMinusBasic);
}

// POST /api/tax/declaration (submit IT declaration)
taxRouter.post(
  '/declaration',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = taxDeclarationSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.errors[0].message);
      }

      const employee = await prisma.employee.findFirst({
        where: { userId: req.user!.id },
      });

      if (!employee) {
        throw new AppError(404, 'Employee profile not found');
      }

      const data = parsed.data;
      const totalDeclared =
        data.section80C + data.section80D + data.section80G +
        data.section24 + data.hra + data.lta + data.otherDeductions;

      const declaration = await prisma.taxDeclaration.upsert({
        where: {
          employeeId_financialYear: {
            employeeId: employee.id,
            financialYear: data.financialYear,
          },
        },
        update: {
          ...data,
          totalDeclared,
        },
        create: {
          employeeId: employee.id,
          ...data,
          totalDeclared,
        },
      });

      res.json({
        success: true,
        data: declaration,
        message: 'Tax declaration submitted successfully',
      });
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/tax/declaration/:employeeId?fy=
taxRouter.get(
  '/declaration/:employeeId',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { employeeId } = req.params;
      const { fy } = req.query;

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
        throw new AppError(403, 'You can only view your own tax declaration');
      }

      const where: Record<string, unknown> = { employeeId };
      if (fy) where.financialYear = fy as string;

      const declarations = await prisma.taxDeclaration.findMany({
        where,
        orderBy: { financialYear: 'desc' },
      });

      res.json({ success: true, data: fy ? declarations[0] || null : declarations });
    } catch (err) {
      next(err);
    }
  },
);

// PUT /api/tax/declaration/:id (update)
taxRouter.put(
  '/declaration/:id',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const existing = await prisma.taxDeclaration.findUnique({
        where: { id },
        include: { employee: { select: { userId: true } } },
      });

      if (!existing) {
        throw new AppError(404, 'Tax declaration not found');
      }

      if (
        req.user!.role === 'EMPLOYEE' &&
        existing.employee.userId !== req.user!.id
      ) {
        throw new AppError(403, 'You can only update your own tax declaration');
      }

      const parsed = taxDeclarationSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.errors[0].message);
      }

      const data = parsed.data;
      const section80C = data.section80C ?? existing.section80C;
      const section80D = data.section80D ?? existing.section80D;
      const section80G = data.section80G ?? existing.section80G;
      const section24 = data.section24 ?? existing.section24;
      const hra = data.hra ?? existing.hra;
      const lta = data.lta ?? existing.lta;
      const otherDeductions = data.otherDeductions ?? existing.otherDeductions;

      const totalDeclared = section80C + section80D + section80G + section24 + hra + lta + otherDeductions;

      const updated = await prisma.taxDeclaration.update({
        where: { id },
        data: { ...data, totalDeclared },
      });

      res.json({
        success: true,
        data: updated,
        message: 'Tax declaration updated successfully',
      });
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/tax/computation/:employeeId?fy= (tax computation sheet)
taxRouter.get(
  '/computation/:employeeId',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { employeeId } = req.params;
      const { fy } = req.query;

      const financialYear = (fy as string) || '2025-2026';

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
        throw new AppError(403, 'You can only view your own tax computation');
      }

      // Get salary structure
      const structure = await prisma.payrollStructure.findUnique({
        where: { employeeId },
      });

      if (!structure) {
        throw new AppError(404, 'Salary structure not found');
      }

      // Get tax declaration
      const declaration = await prisma.taxDeclaration.findUnique({
        where: {
          employeeId_financialYear: { employeeId, financialYear },
        },
      });

      const annualGross = structure.grossSalary * 12;
      const regime = (declaration?.regime || 'NEW') as 'OLD' | 'NEW';
      const standardDeduction = 50000;

      if (regime === 'NEW') {
        // New regime - minimal deductions
        const taxableIncome = Math.max(annualGross - standardDeduction, 0);
        const taxPayable = calculateNewRegimeTax(taxableIncome);
        const cess = taxPayable * 0.04;
        const totalTax = taxPayable + cess;

        res.json({
          success: true,
          data: {
            grossIncome: annualGross,
            standardDeduction,
            section80C: 0,
            section80D: 0,
            section80G: 0,
            section24: 0,
            hraExemption: 0,
            ltaExemption: 0,
            otherDeductions: 0,
            totalDeductions: standardDeduction,
            taxableIncome,
            taxPayable,
            cess,
            totalTax,
            monthlyTds: Math.round(totalTax / 12),
            regime: 'NEW',
          },
        });
      } else {
        // Old regime - full deductions
        const s80c = Math.min(declaration?.section80C || 0, 150000);
        const s80d = Math.min(declaration?.section80D || 0, 75000);
        const s80g = declaration?.section80G || 0;
        const s24 = Math.min(declaration?.section24 || 0, 200000);
        const hraExemption = calculateHraExemption(
          structure.basicSalary * 12,
          structure.hra * 12,
          declaration?.hra || 0,
          true,
        );
        const ltaExemption = declaration?.lta || 0;
        const otherDed = declaration?.otherDeductions || 0;

        const totalDeductions = standardDeduction + s80c + s80d + s80g + s24 + hraExemption + ltaExemption + otherDed;
        const taxableIncome = Math.max(annualGross - totalDeductions, 0);
        const taxPayable = calculateOldRegimeTax(taxableIncome);
        const cess = taxPayable * 0.04;
        const totalTax = taxPayable + cess;

        res.json({
          success: true,
          data: {
            grossIncome: annualGross,
            standardDeduction,
            section80C: s80c,
            section80D: s80d,
            section80G: s80g,
            section24: s24,
            hraExemption,
            ltaExemption,
            otherDeductions: otherDed,
            totalDeductions,
            taxableIncome,
            taxPayable,
            cess,
            totalTax,
            monthlyTds: Math.round(totalTax / 12),
            regime: 'OLD',
          },
        });
      }
    } catch (err) {
      next(err);
    }
  },
);

// POST /api/tax/regime-selection (Old vs New regime)
taxRouter.post(
  '/regime-selection',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = regimeSelectionSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.errors[0].message);
      }

      const employee = await prisma.employee.findFirst({
        where: { userId: req.user!.id },
      });

      if (!employee) {
        throw new AppError(404, 'Employee profile not found');
      }

      const { financialYear, regime } = parsed.data;

      const declaration = await prisma.taxDeclaration.upsert({
        where: {
          employeeId_financialYear: {
            employeeId: employee.id,
            financialYear,
          },
        },
        update: { regime },
        create: {
          employeeId: employee.id,
          financialYear,
          regime,
        },
      });

      res.json({
        success: true,
        data: declaration,
        message: `Tax regime set to ${regime} for FY ${financialYear}`,
      });
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/tax/form16/:employeeId?fy=
taxRouter.get(
  '/form16/:employeeId',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { employeeId } = req.params;
      const { fy } = req.query;
      const financialYear = (fy as string) || '2025-2026';

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
        throw new AppError(403, 'You can only view your own Form 16');
      }

      const form16 = await prisma.form16.findUnique({
        where: {
          employeeId_financialYear: { employeeId, financialYear },
        },
      });

      if (!form16) {
        throw new AppError(404, 'Form 16 not available for this financial year');
      }

      res.json({ success: true, data: form16 });
    } catch (err) {
      next(err);
    }
  },
);
