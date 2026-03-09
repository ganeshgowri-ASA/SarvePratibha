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

// ─── Notification Validations ───────────────────────────────────────

const notificationCategoryEnum = z.enum([
  'LEAVE', 'ATTENDANCE', 'PAYROLL', 'PERFORMANCE', 'RECRUITMENT', 'SYSTEM', 'GENERAL',
]);

const notificationTypeEnum = z.enum([
  'INFO', 'WARNING', 'ACTION_REQUIRED', 'APPROVAL', 'SYSTEM',
]);

const notificationChannelEnum = z.enum(['EMAIL', 'SMS', 'PUSH', 'IN_APP']);

const notificationFrequencyEnum = z.enum(['INSTANT', 'DAILY_DIGEST', 'WEEKLY_DIGEST']);

export const sendNotificationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  title: z.string().min(1, 'Title is required').max(200),
  message: z.string().min(1, 'Message is required').max(2000),
  type: notificationTypeEnum.optional().default('INFO'),
  category: notificationCategoryEnum.optional().default('GENERAL'),
  link: z.string().optional(),
  channels: z.array(notificationChannelEnum).optional(),
});

export const bulkNotificationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  message: z.string().min(1, 'Message is required').max(2000),
  type: notificationTypeEnum.optional().default('INFO'),
  category: notificationCategoryEnum.optional().default('GENERAL'),
  targetRoles: z.array(z.enum(['EMPLOYEE', 'MANAGER', 'SECTION_HEAD', 'IT_ADMIN'])).optional(),
  targetDepts: z.array(z.string()).optional(),
  channels: z.array(notificationChannelEnum).optional(),
});

export const updatePreferencesSchema = z.object({
  preferences: z.array(
    z.object({
      category: notificationCategoryEnum,
      email: z.boolean(),
      sms: z.boolean(),
      push: z.boolean(),
      inApp: z.boolean(),
      frequency: notificationFrequencyEnum.optional().default('INSTANT'),
    }),
  ),
  quietHours: z
    .object({
      enabled: z.boolean(),
      startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:MM format'),
      endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:MM format'),
      timezone: z.string().optional().default('Asia/Kolkata'),
    })
    .optional(),
});

export const createTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100),
  subject: z.string().min(1, 'Subject is required').max(200),
  body: z.string().min(1, 'Body is required'),
  category: notificationCategoryEnum,
  channel: notificationChannelEnum,
  variables: z.record(z.string()).optional(),
});

export const updateTemplateSchema = createTemplateSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const pushSubscriptionSchema = z.object({
  endpoint: z.string().url('Invalid endpoint URL'),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
  userAgent: z.string().optional(),
});

// ─── Type exports ───────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type EmployeeCreateInput = z.infer<typeof employeeCreateSchema>;
export type LeaveRequestInput = z.infer<typeof leaveRequestSchema>;
export type ClaimInput = z.infer<typeof claimSchema>;
export type GoalInput = z.infer<typeof goalSchema>;
export type SendNotificationInput = z.infer<typeof sendNotificationSchema>;
export type BulkNotificationInput = z.infer<typeof bulkNotificationSchema>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
export type PushSubscriptionInput = z.infer<typeof pushSubscriptionSchema>;
