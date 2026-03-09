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

// ─── Recruitment Validations ────────────────────────────────────────

export const jobRequisitionSchema = z.object({
  title: z.string().min(1, 'Job title is required').max(200),
  departmentId: z.string().min(1, 'Department is required'),
  designationId: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.string().optional(),
  skills: z.array(z.string()).default([]),
  location: z.string().optional(),
  positions: z.number().int().min(1, 'At least 1 position required').default(1),
  minExp: z.number().min(0).optional(),
  maxExp: z.number().min(0).optional(),
  minSalary: z.number().min(0).optional(),
  maxSalary: z.number().min(0).optional(),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'CONSULTANT']).default('FULL_TIME'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  closingDate: z.string().or(z.date()).optional(),
});

export const candidateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  resumeUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  currentCompany: z.string().optional(),
  currentTitle: z.string().optional(),
  totalExp: z.number().min(0).optional(),
  currentSalary: z.number().min(0).optional(),
  expectedSalary: z.number().min(0).optional(),
  skills: z.array(z.string()).default([]),
  location: z.string().optional(),
  source: z.enum(['NAUKRI', 'LINKEDIN', 'INDEED', 'GLASSDOOR', 'INTERNAL', 'REFERRAL', 'CAREER_PAGE', 'OTHER']).default('OTHER'),
  sourceDetails: z.string().optional(),
  notes: z.string().optional(),
});

export const applicationMoveStageSchema = z.object({
  stage: z.enum(['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFERED', 'HIRED', 'REJECTED']),
  remarks: z.string().optional(),
});

export const interviewScheduleSchema = z.object({
  applicationId: z.string().min(1, 'Application is required'),
  interviewerId: z.string().min(1, 'Interviewer is required'),
  roundId: z.string().optional(),
  scheduledAt: z.string().or(z.date()),
  duration: z.number().int().min(15).max(480).default(60),
  round: z.number().int().min(1).default(1),
  mode: z.enum(['IN_PERSON', 'VIDEO', 'PHONE']).default('IN_PERSON'),
  location: z.string().optional(),
  meetingLink: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
});

export const interviewFeedbackSchema = z.object({
  interviewScheduleId: z.string().min(1, 'Interview schedule is required'),
  technicalRating: z.number().int().min(1).max(5).optional(),
  communicationRating: z.number().int().min(1).max(5).optional(),
  cultureFitRating: z.number().int().min(1).max(5).optional(),
  overallRating: z.number().min(1).max(5).optional(),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  recommendation: z.enum(['STRONG_HIRE', 'HIRE', 'NO_HIRE', 'STRONG_NO_HIRE']).optional(),
  comments: z.string().optional(),
});

export const offerLetterSchema = z.object({
  applicationId: z.string().min(1, 'Application is required'),
  designation: z.string().min(1, 'Designation is required'),
  department: z.string().min(1, 'Department is required'),
  joiningDate: z.string().or(z.date()),
  basicSalary: z.number().positive('Basic salary must be positive'),
  hra: z.number().min(0).default(0),
  conveyance: z.number().min(0).default(0),
  specialAllow: z.number().min(0).default(0),
  otherAllow: z.number().min(0).default(0),
  pfContribution: z.number().min(0).default(0),
  esiContribution: z.number().min(0).default(0),
  professionalTax: z.number().min(0).default(0),
  tds: z.number().min(0).default(0),
  bonus: z.number().min(0).optional(),
  stockOptions: z.string().optional(),
  benefits: z.string().optional(),
  validUntil: z.string().or(z.date()).optional(),
});

export const sourceImportSchema = z.object({
  candidates: z.array(candidateSchema).min(1, 'At least one candidate required'),
  jobPostingId: z.string().optional(),
  source: z.enum(['NAUKRI', 'LINKEDIN', 'INDEED', 'GLASSDOOR']),
});

export const talentPoolSchema = z.object({
  name: z.string().min(1, 'Pool name is required'),
  description: z.string().optional(),
  skills: z.array(z.string()).default([]),
});

// ─── Type exports ───────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type EmployeeCreateInput = z.infer<typeof employeeCreateSchema>;
export type LeaveRequestInput = z.infer<typeof leaveRequestSchema>;
export type ClaimInput = z.infer<typeof claimSchema>;
export type GoalInput = z.infer<typeof goalSchema>;
export type JobRequisitionInput = z.infer<typeof jobRequisitionSchema>;
export type CandidateInput = z.infer<typeof candidateSchema>;
export type ApplicationMoveStageInput = z.infer<typeof applicationMoveStageSchema>;
export type InterviewScheduleInput = z.infer<typeof interviewScheduleSchema>;
export type InterviewFeedbackInput = z.infer<typeof interviewFeedbackSchema>;
export type OfferLetterInput = z.infer<typeof offerLetterSchema>;
export type SourceImportInput = z.infer<typeof sourceImportSchema>;
export type TalentPoolInput = z.infer<typeof talentPoolSchema>;
