import { z } from 'zod';

// ─── Auth Validations ───────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one digit')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ─── Employee Validations ───────────────────────────────────────────

export const employeeCreateSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  departmentId: z.string().min(1, 'Department is required'),
  designationId: z.string().min(1, 'Designation is required'),
  dateOfJoining: z.string().or(z.date()),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'CONSULTANT']),
  managerId: z.string().optional(),
  phone: z.string().optional(),
});

// ─── Leave Validations ──────────────────────────────────────────────

export const leaveRequestSchema = z.object({
  leaveTypeId: z.string().min(1, 'Leave type is required'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  reason: z.string().min(1, 'Reason is required').max(500),
});

// ─── Claim Validations ──────────────────────────────────────────────

export const claimSchema = z.object({
  claimTypeId: z.string().min(1, 'Claim type is required'),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  incurredDate: z.string().or(z.date()),
});

// ─── Performance Goal Validations ───────────────────────────────────

export const goalSchema = z.object({
  title: z.string().min(1, 'Goal title is required'),
  description: z.string().optional(),
  weightage: z.number().min(0).max(100),
  targetDate: z.string().or(z.date()).optional(),
});

// ─── Tax Declaration Validations ────────────────────────────────────

export const taxDeclarationSchema = z.object({
  financialYear: z.string().min(1, 'Financial year is required'),
  regime: z.enum(['OLD', 'NEW']),
  section80C: z.number().min(0).max(150000).default(0),
  section80D: z.number().min(0).max(75000).default(0),
  section80G: z.number().min(0).default(0),
  section24: z.number().min(0).max(200000).default(0),
  hra: z.number().min(0).default(0),
  lta: z.number().min(0).default(0),
  otherDeductions: z.number().min(0).default(0),
});

export const regimeSelectionSchema = z.object({
  financialYear: z.string().min(1, 'Financial year is required'),
  regime: z.enum(['OLD', 'NEW']),
});

// ─── Reimbursement Validations ──────────────────────────────────────

export const reimbursementSubmitSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required').max(500),
  incurredDate: z.string().or(z.date()),
  receiptUrl: z.string().optional(),
  receiptName: z.string().optional(),
});

export const reimbursementApproveSchema = z.object({
  remarks: z.string().optional(),
});

// ─── Payroll Run Validations ────────────────────────────────────────

export const payrollRunSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2050),
});

// ─── Investment Validations ─────────────────────────────────────────

export const investmentSchema = z.object({
  financialYear: z.string().min(1, 'Financial year is required'),
  section: z.string().min(1, 'Section is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  declaredAmount: z.number().min(0, 'Amount must be non-negative'),
});

// ─── Type exports ───────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type EmployeeCreateInput = z.infer<typeof employeeCreateSchema>;
export type LeaveRequestInput = z.infer<typeof leaveRequestSchema>;
export type ClaimInput = z.infer<typeof claimSchema>;
export type GoalInput = z.infer<typeof goalSchema>;
export type TaxDeclarationInput = z.infer<typeof taxDeclarationSchema>;
export type RegimeSelectionInput = z.infer<typeof regimeSelectionSchema>;
export type ReimbursementSubmitInput = z.infer<typeof reimbursementSubmitSchema>;
export type ReimbursementApproveInput = z.infer<typeof reimbursementApproveSchema>;
export type PayrollRunInput = z.infer<typeof payrollRunSchema>;
export type InvestmentInput = z.infer<typeof investmentSchema>;
