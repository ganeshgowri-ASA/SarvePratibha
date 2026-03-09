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
  category: z.enum(['BUSINESS', 'LEARNING', 'DEVELOPMENT']).default('BUSINESS'),
  weightage: z.number().min(0).max(100),
  targetDate: z.string().or(z.date()).optional(),
  cycle: z.enum(['QUARTERLY', 'HALF_YEARLY', 'ANNUAL']).default('ANNUAL'),
  year: z.number().int().min(2020).max(2100),
  parentGoalId: z.string().optional(),
});

export const goalProgressSchema = z.object({
  progress: z.number().int().min(0).max(100),
  notes: z.string().optional(),
});

export const goalApproveSchema = z.object({
  isApproved: z.boolean(),
  remarks: z.string().optional(),
});

// ─── Self-Assessment / Review Validations ──────────────────────────

export const selfAssessmentSchema = z.object({
  revieweeId: z.string().min(1),
  cycle: z.enum(['QUARTERLY', 'HALF_YEARLY', 'ANNUAL']),
  year: z.number().int(),
  selfRating: z.number().min(1).max(5),
  selfComments: z.string().min(1, 'Self-assessment comments are required'),
  ratings: z.array(z.object({
    kraId: z.string().optional(),
    area: z.string().min(1),
    selfRating: z.number().min(1).max(5),
    selfComment: z.string().optional(),
    weightage: z.number().min(0).max(100),
  })).optional(),
  competencyRatings: z.array(z.object({
    competencyId: z.string().min(1),
    selfRating: z.number().min(1).max(5),
    comments: z.string().optional(),
  })).optional(),
});

export const managerReviewSchema = z.object({
  reviewId: z.string().min(1),
  managerRating: z.number().min(1).max(5),
  managerComments: z.string().min(1, 'Manager comments are required'),
  promotionRec: z.boolean().default(false),
  ratings: z.array(z.object({
    id: z.string().optional(),
    kraId: z.string().optional(),
    area: z.string().min(1),
    mgrRating: z.number().min(1).max(5),
    mgrComment: z.string().optional(),
    weightage: z.number().min(0).max(100),
  })).optional(),
  competencyRatings: z.array(z.object({
    competencyId: z.string().min(1),
    managerRating: z.number().min(1).max(5),
    comments: z.string().optional(),
  })).optional(),
});

// ─── 360 Feedback Validations ──────────────────────────────────────

export const feedback360RequestSchema = z.object({
  targetId: z.string().min(1, 'Target employee is required'),
  cycle: z.enum(['QUARTERLY', 'HALF_YEARLY', 'ANNUAL']),
  year: z.number().int(),
  responderIds: z.array(z.string()).min(1, 'At least one responder is required'),
  deadline: z.string().or(z.date()).optional(),
  isAnonymous: z.boolean().default(true),
});

export const feedbackResponseSchema = z.object({
  feedback360Id: z.string().min(1),
  ratings: z.record(z.string(), z.number().min(1).max(5)).optional(),
  strengths: z.string().optional(),
  improvements: z.string().optional(),
  comments: z.string().optional(),
});

// ─── PIP Validations ───────────────────────────────────────────────

export const pipCreateSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  reason: z.string().min(1, 'Reason is required'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  milestones: z.array(z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    dueDate: z.string().or(z.date()),
  })).optional(),
  reviewDates: z.array(z.string()).optional(),
});

// ─── Type exports ───────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type EmployeeCreateInput = z.infer<typeof employeeCreateSchema>;
export type LeaveRequestInput = z.infer<typeof leaveRequestSchema>;
export type ClaimInput = z.infer<typeof claimSchema>;
export type GoalInput = z.infer<typeof goalSchema>;
export type GoalProgressInput = z.infer<typeof goalProgressSchema>;
export type GoalApproveInput = z.infer<typeof goalApproveSchema>;
export type SelfAssessmentInput = z.infer<typeof selfAssessmentSchema>;
export type ManagerReviewInput = z.infer<typeof managerReviewSchema>;
export type Feedback360RequestInput = z.infer<typeof feedback360RequestSchema>;
export type FeedbackResponseInput = z.infer<typeof feedbackResponseSchema>;
export type PIPCreateInput = z.infer<typeof pipCreateSchema>;
