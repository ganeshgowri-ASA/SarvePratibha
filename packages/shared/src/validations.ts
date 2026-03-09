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
  startDayType: z.enum(['FULL', 'FIRST_HALF', 'SECOND_HALF', 'QUARTER']).default('FULL'),
  endDayType: z.enum(['FULL', 'FIRST_HALF', 'SECOND_HALF', 'QUARTER']).default('FULL'),
  reason: z.string().min(1, 'Reason is required').max(500),
  attachmentUrl: z.string().optional(),
});

export const leaveApprovalSchema = z.object({
  remarks: z.string().max(500).optional(),
});

export const leaveTypeCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required').max(10),
  description: z.string().optional(),
  defaultDays: z.number().min(0).default(0),
  carryForwardLimit: z.number().min(0).default(0),
  isEncashable: z.boolean().default(false),
  isPaidLeave: z.boolean().default(true),
});

// ─── Attendance Validations ─────────────────────────────────────────

export const checkinSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  location: z.string().optional(),
});

export const checkoutSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  location: z.string().optional(),
});

export const regularizeSchema = z.object({
  date: z.string().or(z.date()),
  reason: z.string().min(1, 'Reason is required').max(500),
  requestedStatus: z.enum(['PRESENT', 'HALF_DAY', 'WORK_FROM_HOME']).default('PRESENT'),
});

// ─── Holiday Validations ────────────────────────────────────────────

export const holidayCreateSchema = z.object({
  name: z.string().min(1, 'Holiday name is required'),
  date: z.string().or(z.date()),
  type: z.enum(['NATIONAL', 'OPTIONAL', 'RESTRICTED']).default('NATIONAL'),
  location: z.string().optional(),
  isOptional: z.boolean().default(false),
  year: z.number().int().min(2020).max(2100),
});

// ─── CompOff Validations ────────────────────────────────────────────

export const compOffSchema = z.object({
  workedDate: z.string().or(z.date()),
  compOffDate: z.string().or(z.date()).optional(),
  reason: z.string().min(1, 'Reason is required').max(500),
  hours: z.number().min(1).max(24).default(8),
});

// ─── WFH Validations ───────────────────────────────────────────────

export const wfhSchema = z.object({
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  reason: z.string().min(1, 'Reason is required').max(500),
});

// ─── On Duty Validations ───────────────────────────────────────────

export const onDutySchema = z.object({
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  reason: z.string().min(1, 'Reason is required').max(500),
  location: z.string().optional(),
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

// ─── Type exports ───────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type EmployeeCreateInput = z.infer<typeof employeeCreateSchema>;
export type LeaveRequestInput = z.infer<typeof leaveRequestSchema>;
export type LeaveApprovalInput = z.infer<typeof leaveApprovalSchema>;
export type LeaveTypeCreateInput = z.infer<typeof leaveTypeCreateSchema>;
export type CheckinInput = z.infer<typeof checkinSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type RegularizeInput = z.infer<typeof regularizeSchema>;
export type HolidayCreateInput = z.infer<typeof holidayCreateSchema>;
export type CompOffInput = z.infer<typeof compOffSchema>;
export type WfhInput = z.infer<typeof wfhSchema>;
export type OnDutyInput = z.infer<typeof onDutySchema>;
export type ClaimInput = z.infer<typeof claimSchema>;
export type GoalInput = z.infer<typeof goalSchema>;
