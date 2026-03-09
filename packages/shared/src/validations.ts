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

// ─── Type exports ───────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type EmployeeCreateInput = z.infer<typeof employeeCreateSchema>;
export type LeaveRequestInput = z.infer<typeof leaveRequestSchema>;
export type ClaimInput = z.infer<typeof claimSchema>;
export type GoalInput = z.infer<typeof goalSchema>;
export type TravelRequestInput = z.infer<typeof travelRequestSchema>;
export type TravelExpenseInput = z.infer<typeof travelExpenseSchema>;
export type TravelItineraryInput = z.infer<typeof travelItinerarySchema>;
export type BenefitEnrollInput = z.infer<typeof benefitEnrollSchema>;
export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;
export type AssetAssignInput = z.infer<typeof assetAssignSchema>;
export type HelpdeskTicketInput = z.infer<typeof helpdeskTicketSchema>;
export type MeetingBookingInput = z.infer<typeof meetingBookingSchema>;
export type CabRequestInput = z.infer<typeof cabRequestSchema>;
