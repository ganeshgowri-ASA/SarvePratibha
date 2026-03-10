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
  category: z.enum(['BUSINESS', 'LEARNING', 'DEVELOPMENT', 'BEHAVIOURAL', 'COMPETENCY']).default('BUSINESS'),
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

// ─── Personal Details Validations ──────────────────────────────────

export const basicInfoSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().or(z.date()).optional(),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']).optional(),
  maritalSinceDate: z.string().or(z.date()).optional(),
  nationality: z.string().optional(),
  bloodGroup: z.string().optional(),
  placeOfBirth: z.string().optional(),
  stateOfBirth: z.string().optional(),
  religion: z.string().optional(),
  identificationMark: z.string().optional(),
  heightCm: z.number().positive().optional(),
  weightKg: z.number().positive().optional(),
  motherTongue: z.string().optional(),
  caste: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
});

export const contactInfoSchema = z.object({
  corporatePhone: z.string().optional(),
  personalPhone: z.string().optional(),
  residentialPhone: z.string().optional(),
  officePhone: z.string().optional(),
  officialEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  personalEmail: z.string().email('Invalid email').optional().or(z.literal('')),
});

export const addressSchema = z.object({
  permanentAddress: z.string().optional(),
  permanentCity: z.string().optional(),
  permanentState: z.string().optional(),
  permanentCountry: z.string().optional(),
  permanentPincode: z.string().optional(),
});

export const personalDocumentSchema = z.object({
  documentType: z.enum(['AADHAAR', 'PAN', 'PASSPORT', 'DRIVING_LICENSE', 'VOTER_ID']),
  documentNumber: z.string().min(1, 'Document number is required'),
  expiryDate: z.string().or(z.date()).optional(),
});

export const familyMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  relationship: z.enum(['FATHER', 'MOTHER', 'SPOUSE', 'SON', 'DAUGHTER', 'BROTHER', 'SISTER', 'OTHER']),
  dateOfBirth: z.string().or(z.date()).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  occupation: z.string().optional(),
  phone: z.string().optional(),
  isDependent: z.boolean().default(true),
});

export const nominationSchema = z.object({
  type: z.enum(['PF', 'GRATUITY', 'INSURANCE']),
  nomineeName: z.string().min(1, 'Nominee name is required'),
  relationship: z.enum(['FATHER', 'MOTHER', 'SPOUSE', 'SON', 'DAUGHTER', 'BROTHER', 'SISTER', 'OTHER']),
  dateOfBirth: z.string().or(z.date()).optional(),
  percentage: z.number().min(0).max(100, 'Percentage must be between 0 and 100'),
  address: z.string().optional(),
});

export const bankAccountSchema = z.object({
  bankAccountNo: z.string().optional(),
  ifscCode: z.string().optional(),
  bankName: z.string().optional(),
  bankBranch: z.string().optional(),
});

export const educationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution is required'),
  university: z.string().optional(),
  yearOfPassing: z.number().int().optional(),
  percentage: z.number().min(0).max(100).optional(),
  grade: z.string().optional(),
  specialization: z.string().optional(),
});

export const experienceSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  designation: z.string().min(1, 'Designation is required'),
  fromDate: z.string().or(z.date()),
  toDate: z.string().or(z.date()).optional(),
  isCurrent: z.boolean().default(false),
  reasonForLeaving: z.string().optional(),
  lastDrawnSalary: z.number().positive().optional(),
  location: z.string().optional(),
});

export const peopleSearchSchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  type: z.enum(['name', 'mobile', 'email']).default('name'),
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

// ─── Travel Validations ────────────────────────────────────────────

export const travelRequestSchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  fromCity: z.string().min(1, 'From city is required'),
  travelStartDate: z.string().or(z.date()),
  travelEndDate: z.string().or(z.date()),
  purpose: z.string().min(1, 'Purpose is required').max(500),
  estimatedCost: z.number().min(0, 'Estimated cost must be non-negative').optional(),
  advanceAmount: z.number().min(0).optional(),
  travelMode: z.enum(['FLIGHT', 'TRAIN', 'BUS', 'CAR', 'OTHER']).optional(),
  accommodationType: z.enum(['HOTEL', 'GUEST_HOUSE', 'SELF', 'NONE']).optional(),
});

export const travelExpenseSchema = z.object({
  travelRequestId: z.string().min(1, 'Travel request is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive'),
  expenseDate: z.string().or(z.date()),
  currency: z.string().optional(),
});

export const travelItinerarySchema = z.object({
  travelRequestId: z.string().min(1, 'Travel request is required'),
  day: z.number().int().positive(),
  date: z.string().or(z.date()),
  fromLocation: z.string().min(1, 'From location is required'),
  toLocation: z.string().min(1, 'To location is required'),
  mode: z.string().min(1, 'Mode is required'),
  departureTime: z.string().optional(),
  arrivalTime: z.string().optional(),
  hotelName: z.string().optional(),
  notes: z.string().optional(),
});

// ─── Benefits Validations ──────────────────────────────────────────

export const benefitEnrollSchema = z.object({
  benefitPlanId: z.string().min(1, 'Benefit plan is required'),
  startDate: z.string().or(z.date()),
  nominees: z.any().optional(),
});

// ─── Service Request Validations ───────────────────────────────────

export const serviceRequestSchema = z.object({
  corporateServiceId: z.string().min(1, 'Service is required'),
  subject: z.string().min(1, 'Subject is required').max(200),
  description: z.string().min(1, 'Description is required').max(2000),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
});

// ─── Asset Validations ─────────────────────────────────────────────

export const assetAssignSchema = z.object({
  assetId: z.string().min(1, 'Asset is required'),
  employeeId: z.string().min(1, 'Employee is required'),
  notes: z.string().optional(),
});

// ─── Helpdesk Validations ──────────────────────────────────────────

export const helpdeskTicketSchema = z.object({
  category: z.enum(['HARDWARE', 'SOFTWARE', 'NETWORK', 'ACCESS', 'EMAIL', 'GENERAL', 'OTHER']),
  subject: z.string().min(1, 'Subject is required').max(200),
  description: z.string().min(1, 'Description is required').max(2000),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
});

// ─── Meeting Room Validations ──────────────────────────────────────

export const meetingBookingSchema = z.object({
  roomId: z.string().min(1, 'Meeting room is required'),
  title: z.string().min(1, 'Title is required').max(200),
  date: z.string().or(z.date()),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  attendees: z.number().int().positive().optional(),
  isRecurring: z.boolean().optional(),
  recurringEnd: z.string().or(z.date()).optional(),
  notes: z.string().optional(),
});

// ─── Cab Booking Validations ───────────────────────────────────────

export const cabRequestSchema = z.object({
  pickupLocation: z.string().min(1, 'Pickup location is required'),
  dropLocation: z.string().min(1, 'Drop location is required'),
  pickupTime: z.string().or(z.date()),
  cabType: z.enum(['SEDAN', 'SUV', 'HATCHBACK', 'SHARED']).optional(),
  passengers: z.number().int().positive().optional(),
  purpose: z.string().optional(),
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
export type BasicInfoInput = z.infer<typeof basicInfoSchema>;
export type ContactInfoInput = z.infer<typeof contactInfoSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type PersonalDocumentInput = z.infer<typeof personalDocumentSchema>;
export type FamilyMemberInput = z.infer<typeof familyMemberSchema>;
export type NominationInput = z.infer<typeof nominationSchema>;
export type BankAccountInput = z.infer<typeof bankAccountSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type PeopleSearchInput = z.infer<typeof peopleSearchSchema>;
export type GoalProgressInput = z.infer<typeof goalProgressSchema>;
export type GoalApproveInput = z.infer<typeof goalApproveSchema>;
export type SelfAssessmentInput = z.infer<typeof selfAssessmentSchema>;
export type ManagerReviewInput = z.infer<typeof managerReviewSchema>;
export type Feedback360RequestInput = z.infer<typeof feedback360RequestSchema>;
export type FeedbackResponseInput = z.infer<typeof feedbackResponseSchema>;
export type PIPCreateInput = z.infer<typeof pipCreateSchema>;
export type TaxDeclarationInput = z.infer<typeof taxDeclarationSchema>;
export type RegimeSelectionInput = z.infer<typeof regimeSelectionSchema>;
export type ReimbursementSubmitInput = z.infer<typeof reimbursementSubmitSchema>;
export type ReimbursementApproveInput = z.infer<typeof reimbursementApproveSchema>;
export type PayrollRunInput = z.infer<typeof payrollRunSchema>;
export type InvestmentInput = z.infer<typeof investmentSchema>;
export type JobRequisitionInput = z.infer<typeof jobRequisitionSchema>;
export type CandidateInput = z.infer<typeof candidateSchema>;
export type ApplicationMoveStageInput = z.infer<typeof applicationMoveStageSchema>;
export type InterviewScheduleInput = z.infer<typeof interviewScheduleSchema>;
export type InterviewFeedbackInput = z.infer<typeof interviewFeedbackSchema>;
export type OfferLetterInput = z.infer<typeof offerLetterSchema>;
export type SourceImportInput = z.infer<typeof sourceImportSchema>;
export type TalentPoolInput = z.infer<typeof talentPoolSchema>;
export type InitiateScreeningInput = z.infer<typeof initiateScreeningSchema>;
export type EvaluateScreeningInput = z.infer<typeof evaluateScreeningSchema>;
export type InitiateVoiceCallInput = z.infer<typeof initiateVoiceCallSchema>;
export type AIAssistantConfigInput = z.infer<typeof aiAssistantConfigSchema>;
export type ScreeningTemplateInput = z.infer<typeof screeningTemplateSchema>;
export type ResumeParseInput = z.infer<typeof resumeParseSchema>;
export type CandidateRankInput = z.infer<typeof candidateRankSchema>;
export type TravelRequestInput = z.infer<typeof travelRequestSchema>;
export type TravelExpenseInput = z.infer<typeof travelExpenseSchema>;
export type TravelItineraryInput = z.infer<typeof travelItinerarySchema>;
export type BenefitEnrollInput = z.infer<typeof benefitEnrollSchema>;
export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;
export type AssetAssignInput = z.infer<typeof assetAssignSchema>;
export type HelpdeskTicketInput = z.infer<typeof helpdeskTicketSchema>;
export type MeetingBookingInput = z.infer<typeof meetingBookingSchema>;
export type CabRequestInput = z.infer<typeof cabRequestSchema>;
export type SendNotificationInput = z.infer<typeof sendNotificationSchema>;
export type BulkNotificationInput = z.infer<typeof bulkNotificationSchema>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
export type PushSubscriptionInput = z.infer<typeof pushSubscriptionSchema>;
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

// ─── Engagement Validations ────────────────────────────────────────

export const surveyCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  isAnonymous: z.boolean().default(true),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'CLOSED']).default('DRAFT'),
  questions: z.array(z.object({
    text: z.string().min(1, 'Question text is required'),
    type: z.enum(['RATING', 'TEXT', 'MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'NPS']).default('RATING'),
    options: z.any().optional(),
    isRequired: z.boolean().default(true),
  })).min(1, 'At least one question is required'),
});

export const surveyResponseSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string().min(1),
    answer: z.string(),
    rating: z.number().int().min(0).max(10).optional(),
  })).min(1),
});

export const pollCreateSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  description: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  expiresAt: z.string().or(z.date()).optional(),
  options: z.array(z.string().min(1)).min(2, 'At least 2 options required'),
});

export const pollVoteSchema = z.object({
  optionId: z.string().min(1, 'Option is required'),
});

// ─── D&I Validations ───────────────────────────────────────────────

export const diGoalCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  targetValue: z.number().min(0),
  unit: z.string().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  department: z.string().optional(),
});

// ─── Compliance Validations ────────────────────────────────────────

export const compliancePolicyCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  content: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  version: z.string().default('1.0'),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('DRAFT'),
  effectiveFrom: z.string().or(z.date()),
  effectiveTo: z.string().or(z.date()).optional(),
  isRequired: z.boolean().default(true),
});

export const complianceTrainingEnrollSchema = z.object({
  trainingId: z.string().min(1, 'Training ID is required'),
});

// ─── Document Validations ──────────────────────────────────────────

export const documentUploadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  fileUrl: z.string().min(1, 'File URL is required'),
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const documentSignSchema = z.object({
  action: z.enum(['sign', 'request']),
  signatureData: z.string().optional(),
  signerIds: z.array(z.string()).optional(),
  reason: z.string().optional(),
});

// ─── Talent Validations ────────────────────────────────────────────

export const successionPlanCreateSchema = z.object({
  positionTitle: z.string().min(1, 'Position title is required'),
  department: z.string().min(1, 'Department is required'),
  currentHolderId: z.string().optional(),
  successorId: z.string().min(1, 'Successor is required'),
  readiness: z.string().min(1, 'Readiness level is required'),
  priority: z.number().int().min(1).default(1),
  notes: z.string().optional(),
  developmentPlan: z.string().optional(),
  targetDate: z.string().or(z.date()).optional(),
});

// ─── Learning Validations ──────────────────────────────────────────

export const learningEnrollSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
});

// ─── Onboarding Validations ────────────────────────────────────────

export const onboardingChecklistCreateSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  tasks: z.array(z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    category: z.string().min(1),
    dueDate: z.string().or(z.date()).optional(),
  })).min(1, 'At least one task is required'),
});

// ─── Offboarding Validations ───────────────────────────────────────

export const offboardingInitiateSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  reason: z.string().optional(),
  lastWorkingDate: z.string().or(z.date()).optional(),
  tasks: z.array(z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    category: z.string().min(1),
  })).optional(),
});

// ─── New Module Type Inferences ────────────────────────────────────

export type SurveyCreateInput = z.infer<typeof surveyCreateSchema>;
export type SurveyResponseInput = z.infer<typeof surveyResponseSchema>;
export type PollCreateInput = z.infer<typeof pollCreateSchema>;
export type PollVoteInput = z.infer<typeof pollVoteSchema>;
export type DIGoalCreateInput = z.infer<typeof diGoalCreateSchema>;
export type CompliancePolicyCreateInput = z.infer<typeof compliancePolicyCreateSchema>;
export type ComplianceTrainingEnrollInput = z.infer<typeof complianceTrainingEnrollSchema>;
export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;
export type DocumentSignInput = z.infer<typeof documentSignSchema>;
export type SuccessionPlanCreateInput = z.infer<typeof successionPlanCreateSchema>;
export type LearningEnrollInput = z.infer<typeof learningEnrollSchema>;
export type OnboardingChecklistCreateInput = z.infer<typeof onboardingChecklistCreateSchema>;
export type OffboardingInitiateInput = z.infer<typeof offboardingInitiateSchema>;
