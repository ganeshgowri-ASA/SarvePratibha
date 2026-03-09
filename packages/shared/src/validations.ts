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

// ─── Admin Validations ─────────────────────────────────────────────

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain a digit')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
  role: z.enum(['EMPLOYEE', 'MANAGER', 'SECTION_HEAD', 'IT_ADMIN']).default('EMPLOYEE'),
  employeeId: z.string().optional(),
  departmentId: z.string().optional(),
  designationId: z.string().optional(),
  dateOfJoining: z.string().optional(),
});

export const securityPolicySchema = z.object({
  minPasswordLength: z.number().min(6).max(32),
  requireUppercase: z.boolean(),
  requireLowercase: z.boolean(),
  requireNumbers: z.boolean(),
  requireSpecialChars: z.boolean(),
  passwordExpiryDays: z.number().min(0).max(365),
  maxLoginAttempts: z.number().min(1).max(20),
  lockoutDurationMins: z.number().min(1).max(1440),
  sessionTimeoutMins: z.number().min(5).max(1440),
  enable2FA: z.boolean(),
  ipWhitelist: z.string().optional(),
  enforceIPWhitelist: z.boolean(),
});

export const departmentSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

export const locationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
});

export const designationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  level: z.number().min(0),
  band: z.string().optional(),
});

export const gradeSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  level: z.number().min(0),
  minSalary: z.number().optional(),
  maxSalary: z.number().optional(),
  description: z.string().optional(),
});

export const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  targetRole: z.enum(['EMPLOYEE', 'MANAGER', 'SECTION_HEAD', 'IT_ADMIN']).optional(),
  isPinned: z.boolean().default(false),
  publishAt: z.string().optional(),
  expiresAt: z.string().optional(),
});

export const companyPolicySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  version: z.string().default('1.0'),
  effectiveFrom: z.string(),
  effectiveTo: z.string().optional(),
});

export const customFieldSchema = z.object({
  module: z.string().min(1, 'Module is required'),
  fieldName: z.string().min(1, 'Field name is required'),
  fieldLabel: z.string().min(1, 'Field label is required'),
  fieldType: z.enum(['TEXT', 'NUMBER', 'DATE', 'BOOLEAN', 'SELECT', 'MULTI_SELECT', 'FILE', 'URL', 'EMAIL', 'PHONE']).default('TEXT'),
  options: z.any().optional(),
  isRequired: z.boolean().default(false),
  displayOrder: z.number().default(0),
});

export const workflowSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  module: z.string().min(1, 'Module is required'),
  description: z.string().optional(),
  triggerEvent: z.string().optional(),
  steps: z.array(z.object({
    name: z.string().min(1),
    approverRole: z.enum(['EMPLOYEE', 'MANAGER', 'SECTION_HEAD', 'IT_ADMIN']).optional(),
    approverId: z.string().optional(),
    isRequired: z.boolean().default(true),
    autoApprove: z.boolean().default(false),
    timeoutHours: z.number().optional(),
  })).optional(),
});

// ─── Type exports ───────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type EmployeeCreateInput = z.infer<typeof employeeCreateSchema>;
export type LeaveRequestInput = z.infer<typeof leaveRequestSchema>;
export type ClaimInput = z.infer<typeof claimSchema>;
export type GoalInput = z.infer<typeof goalSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type SecurityPolicyInput = z.infer<typeof securityPolicySchema>;
export type DepartmentInput = z.infer<typeof departmentSchema>;
export type LocationInput = z.infer<typeof locationSchema>;
export type DesignationInput = z.infer<typeof designationSchema>;
export type GradeInput = z.infer<typeof gradeSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
export type CompanyPolicyInput = z.infer<typeof companyPolicySchema>;
export type CustomFieldInput = z.infer<typeof customFieldSchema>;
export type WorkflowInput = z.infer<typeof workflowSchema>;
