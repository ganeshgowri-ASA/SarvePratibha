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

// ─── Type exports ───────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type EmployeeCreateInput = z.infer<typeof employeeCreateSchema>;
export type LeaveRequestInput = z.infer<typeof leaveRequestSchema>;
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
