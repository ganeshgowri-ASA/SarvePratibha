// ─── User Roles ─────────────────────────────────────────────────────

export type UserRole = 'EMPLOYEE' | 'MANAGER' | 'SECTION_HEAD' | 'IT_ADMIN';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
  employeeId?: string;
}

// ─── API Response ───────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Menu & Navigation ─────────────────────────────────────────────

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  roles?: UserRole[];
  children?: MenuItem[];
}

// ─── Dashboard Widgets ──────────────────────────────────────────────

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  pendingLeaves: number;
  pendingApprovals: number;
  todayPresent: number;
  todayAbsent: number;
}

export interface QuickLink {
  label: string;
  href: string;
  icon: string;
  description?: string;
}

export interface BirthdayAnniversary {
  employeeId: string;
  name: string;
  image?: string;
  type: 'birthday' | 'work_anniversary';
  date: string;
  years?: number;
}

// ─── Attendance ─────────────────────────────────────────────────────

export interface PunchStatus {
  isPunchedIn: boolean;
  lastPunchTime?: string;
  todayHours?: number;
}

// ─── Leave ──────────────────────────────────────────────────────────

export interface LeaveBalanceSummary {
  leaveType: string;
  code: string;
  allocated: number;
  used: number;
  balance: number;
}

// ─── Notification ───────────────────────────────────────────────────

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ACTION_REQUIRED' | 'APPROVAL' | 'SYSTEM';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

// ─── Travel ────────────────────────────────────────────────────────

export type TravelRequestStatus = 'DRAFT' | 'SUBMITTED' | 'MANAGER_APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
export type TravelExpenseStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'PAID';

export interface TravelRequestItem {
  id: string;
  destination: string;
  fromCity: string;
  travelStartDate: string;
  travelEndDate: string;
  purpose: string;
  estimatedCost: number;
  advanceAmount: number;
  travelMode: string;
  status: TravelRequestStatus;
  approvedBy?: string;
  createdAt: string;
}

export interface TravelItineraryItem {
  id: string;
  day: number;
  date: string;
  fromLocation: string;
  toLocation: string;
  mode: string;
  bookingRef?: string;
  departureTime?: string;
  arrivalTime?: string;
  hotelName?: string;
  notes?: string;
}

export interface TravelExpenseItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  receiptUrl?: string;
  expenseDate: string;
  status: TravelExpenseStatus;
}

export interface TravelPolicyItem {
  id: string;
  name: string;
  description?: string;
  perDiemDomestic: number;
  perDiemInternational: number;
  maxHotelDomestic: number;
  maxHotelInternational: number;
  advanceBookingDays: number;
  maxAdvancePercent: number;
  flightClass: string;
  trainClass: string;
}

// ─── Benefits ──────────────────────────────────────────────────────

export type BenefitType = 'HEALTH' | 'DENTAL' | 'VISION' | 'LIFE_INSURANCE' | 'RETIREMENT' | 'WELLNESS' | 'EDUCATION' | 'OTHER';
export type BenefitEnrollmentStatus = 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED';

export interface BenefitPlanItem {
  id: string;
  name: string;
  type: BenefitType;
  description?: string;
  provider?: string;
  coverage?: string;
  premium: number;
  employerContribution: number;
  employeeContribution: number;
  isActive: boolean;
}

export interface BenefitEnrollmentItem {
  id: string;
  benefitPlan: BenefitPlanItem;
  startDate: string;
  endDate?: string;
  status: BenefitEnrollmentStatus;
  nominees?: unknown;
}

export interface InsurancePolicyItem {
  id: string;
  name: string;
  policyNumber: string;
  provider: string;
  type: string;
  coverageAmount: number;
  premium: number;
  startDate: string;
  endDate: string;
}

// ─── Corporate Services ────────────────────────────────────────────

export type ServiceCategory = 'IT_SUPPORT' | 'FACILITIES' | 'HR_SERVICES' | 'FINANCE' | 'ADMIN' | 'TRANSPORT' | 'CATERING' | 'OTHER';
export type ServiceRequestStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'CANCELLED';
export type ServicePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CorporateServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  description?: string;
  icon?: string;
}

export interface ServiceRequestItem {
  id: string;
  corporateService: CorporateServiceItem;
  subject: string;
  description: string;
  priority: ServicePriority;
  status: ServiceRequestStatus;
  assignedTo?: string;
  resolvedAt?: string;
  createdAt: string;
}

// ─── Assets ────────────────────────────────────────────────────────

export type AssetStatus = 'AVAILABLE' | 'ASSIGNED' | 'UNDER_MAINTENANCE' | 'RETIRED' | 'LOST';

export interface AssetItem {
  id: string;
  assetTag: string;
  name: string;
  category: string;
  make?: string;
  model?: string;
  serialNumber?: string;
  status: AssetStatus;
  condition: string;
}

export interface AssetAssignmentItem {
  id: string;
  asset: AssetItem;
  assignedAt: string;
  returnedAt?: string;
}

// ─── Helpdesk ──────────────────────────────────────────────────────

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_ON_USER' | 'RESOLVED' | 'CLOSED';
export type TicketCategory = 'HARDWARE' | 'SOFTWARE' | 'NETWORK' | 'ACCESS' | 'EMAIL' | 'GENERAL' | 'OTHER';

export interface HelpdeskTicketItem {
  id: string;
  ticketNumber: string;
  category: TicketCategory;
  subject: string;
  description: string;
  priority: ServicePriority;
  status: TicketStatus;
  assignedTo?: string;
  resolvedAt?: string;
  resolution?: string;
  feedback?: string;
  rating?: number;
  createdAt: string;
}

export interface HelpdeskCommentItem {
  id: string;
  authorId: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
}

// ─── Meeting Rooms ─────────────────────────────────────────────────

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface MeetingRoomItem {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  hasProjector: boolean;
  hasWhiteboard: boolean;
  hasVideoConf: boolean;
}

export interface MeetingBookingItem {
  id: string;
  room: MeetingRoomItem;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  isRecurring: boolean;
  status: BookingStatus;
}

// ─── Cab Booking ───────────────────────────────────────────────────

export type CabRequestStatus = 'REQUESTED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type CabType = 'SEDAN' | 'SUV' | 'HATCHBACK' | 'SHARED';

export interface CabRequestItem {
  id: string;
  pickupLocation: string;
  dropLocation: string;
  pickupTime: string;
  cabType: CabType;
  passengers: number;
  purpose?: string;
  status: CabRequestStatus;
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  createdAt: string;
}
