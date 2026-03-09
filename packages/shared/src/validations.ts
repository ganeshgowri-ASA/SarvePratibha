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

// ─── AI Screening Validations ──────────────────────────────────────

export const initiateScreeningSchema = z.object({
  applicationId: z.string().min(1, 'Application ID is required'),
  jobPostingId: z.string().min(1, 'Job Posting ID is required'),
  candidateName: z.string().min(1, 'Candidate name is required'),
  candidateEmail: z.string().email('Valid email is required'),
  candidatePhone: z.string().optional(),
  templateId: z.string().optional(),
  language: z.string().default('en'),
});

export const evaluateScreeningSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  responses: z.array(z.object({
    questionId: z.string().min(1),
    responseText: z.string().optional(),
    audioUrl: z.string().optional(),
    duration: z.number().optional(),
  })),
});

export const initiateVoiceCallSchema = z.object({
  sessionId: z.string().optional(),
  candidateName: z.string().min(1, 'Candidate name is required'),
  candidatePhone: z.string().min(1, 'Phone number is required'),
  provider: z.enum(['VAPI', 'RETELL', 'ELEVENLABS', 'SARVAM']).default('VAPI'),
});

export const aiAssistantConfigSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  voiceProvider: z.enum(['VAPI', 'RETELL', 'ELEVENLABS', 'SARVAM']).default('VAPI'),
  voiceId: z.string().optional(),
  personality: z.string().optional(),
  companyContext: z.string().optional(),
  language: z.string().default('en'),
  supportedLanguages: z.array(z.string()).default(['en', 'hi']),
  maxCallDuration: z.number().min(60).max(3600).default(900),
  evaluationCriteria: z.record(z.unknown()).optional(),
  isActive: z.boolean().default(true),
});

export const screeningTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  roleTitle: z.string().optional(),
  department: z.string().optional(),
  questions: z.array(z.object({
    text: z.string().min(1, 'Question text is required'),
    type: z.enum(['TECHNICAL', 'BEHAVIORAL', 'SITUATIONAL', 'CULTURAL_FIT', 'COMMUNICATION']).default('TECHNICAL'),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']).default('MEDIUM'),
    expectedAnswer: z.string().optional(),
    maxScore: z.number().min(1).default(10),
  })).min(1, 'At least one question is required'),
});

export const resumeParseSchema = z.object({
  resumeUrl: z.string().optional(),
  resumeText: z.string().optional(),
  jobPostingId: z.string().optional(),
}).refine(data => data.resumeUrl || data.resumeText, {
  message: 'Either resumeUrl or resumeText is required',
});

export const candidateRankSchema = z.object({
  jobPostingId: z.string().min(1, 'Job Posting ID is required'),
  applicationIds: z.array(z.string()).min(1, 'At least one application is required'),
});

// ─── Type exports ───────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type EmployeeCreateInput = z.infer<typeof employeeCreateSchema>;
export type LeaveRequestInput = z.infer<typeof leaveRequestSchema>;
export type ClaimInput = z.infer<typeof claimSchema>;
export type GoalInput = z.infer<typeof goalSchema>;
export type InitiateScreeningInput = z.infer<typeof initiateScreeningSchema>;
export type EvaluateScreeningInput = z.infer<typeof evaluateScreeningSchema>;
export type InitiateVoiceCallInput = z.infer<typeof initiateVoiceCallSchema>;
export type AIAssistantConfigInput = z.infer<typeof aiAssistantConfigSchema>;
export type ScreeningTemplateInput = z.infer<typeof screeningTemplateSchema>;
export type ResumeParseInput = z.infer<typeof resumeParseSchema>;
export type CandidateRankInput = z.infer<typeof candidateRankSchema>;
