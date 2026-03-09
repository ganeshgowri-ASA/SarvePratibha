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

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'ON_LEAVE' | 'HOLIDAY' | 'WEEKEND' | 'WORK_FROM_HOME';

export interface PunchStatus {
  isPunchedIn: boolean;
  lastPunchTime?: string;
  todayHours?: number;
  punchInTime?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: AttendanceStatus;
  firstPunchIn?: string;
  lastPunchOut?: string;
  totalHours?: number;
  overtime?: number;
  remarks?: string;
}

export interface TeamAttendance {
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  status: AttendanceStatus;
  punchIn?: string;
  punchOut?: string;
  totalHours?: number;
}

export interface RegularizationRequest {
  id: string;
  date: string;
  reason: string;
  requestedStatus: AttendanceStatus;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  remarks?: string;
  createdAt: string;
}

// ─── Leave ──────────────────────────────────────────────────────────

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type LeaveDay = 'FULL' | 'FIRST_HALF' | 'SECOND_HALF' | 'QUARTER';

export interface LeaveBalanceSummary {
  id: string;
  leaveType: string;
  code: string;
  allocated: number;
  used: number;
  carried: number;
  balance: number;
  color?: string;
}

export interface LeaveRequestSummary {
  id: string;
  leaveType: string;
  leaveTypeCode: string;
  startDate: string;
  endDate: string;
  days: number;
  startDayType: LeaveDay;
  endDayType: LeaveDay;
  reason?: string;
  status: LeaveStatus;
  appliedOn: string;
  approvedBy?: string;
  remarks?: string;
}

export interface LeaveTypeInfo {
  id: string;
  name: string;
  code: string;
  description?: string;
  defaultDays: number;
  carryForwardLimit: number;
  isEncashable: boolean;
  isPaidLeave: boolean;
  isActive: boolean;
}

export interface HolidayInfo {
  id: string;
  name: string;
  date: string;
  type: 'NATIONAL' | 'OPTIONAL' | 'RESTRICTED';
  location?: string;
  isOptional: boolean;
}

export interface CompOffRequest {
  id: string;
  workedDate: string;
  compOffDate?: string;
  reason: string;
  hours: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
}

export interface WfhRequest {
  id: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
}

export interface OnDutyRequest {
  id: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  location?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
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

// ─── Employee Profile ──────────────────────────────────────────────

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type MaritalStatus = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
export type DocumentType = 'AADHAAR' | 'PAN' | 'PASSPORT' | 'DRIVING_LICENSE' | 'VOTER_ID';
export type NominationType = 'PF' | 'GRATUITY' | 'INSURANCE';
export type Relationship = 'FATHER' | 'MOTHER' | 'SPOUSE' | 'SON' | 'DAUGHTER' | 'BROTHER' | 'SISTER' | 'OTHER';

export interface EmployeeProfile {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  title?: string;
  dateOfBirth?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  maritalSinceDate?: string;
  nationality?: string;
  bloodGroup?: string;
  placeOfBirth?: string;
  stateOfBirth?: string;
  religion?: string;
  identificationMark?: string;
  heightCm?: number;
  weightKg?: number;
  motherTongue?: string;
  caste?: string;
  phone?: string;
  personalEmail?: string;
  corporatePhone?: string;
  personalPhone?: string;
  residentialPhone?: string;
  officePhone?: string;
  officialEmail?: string;
  workLocation?: string;
  permanentAddress?: string;
  permanentCity?: string;
  permanentState?: string;
  permanentCountry?: string;
  permanentPincode?: string;
  panNumber?: string;
  aadharNumber?: string;
  passportNumber?: string;
  drivingLicense?: string;
  voterIdNumber?: string;
  bankAccountNo?: string;
  ifscCode?: string;
  bankName?: string;
  bankBranch?: string;
  dateOfJoining: string;
  confirmationDate?: string;
  lastPromotionDate?: string;
  lastCertifiedDate?: string;
  profilePhoto?: string;
  employmentStatus: string;
  employmentType: string;
  department: { id: string; name: string };
  designation: { id: string; name: string };
  manager?: { id: string; firstName: string; lastName: string; employeeId: string };
  dottedLineManager?: { id: string; firstName: string; lastName: string; employeeId: string };
  orgUnitChief?: { id: string; firstName: string; lastName: string; employeeId: string };
  user: { email: string; role: UserRole; image?: string };
  familyMembers?: FamilyMemberItem[];
  nominations?: NominationItem[];
  personalDocuments?: PersonalDocumentItem[];
  educationRecords?: EducationItem[];
  experienceRecords?: ExperienceItem[];
}

export interface FamilyMemberItem {
  id: string;
  name: string;
  relationship: Relationship;
  dateOfBirth?: string;
  gender?: Gender;
  occupation?: string;
  phone?: string;
  isDependent: boolean;
}

export interface NominationItem {
  id: string;
  type: NominationType;
  nomineeName: string;
  relationship: Relationship;
  dateOfBirth?: string;
  percentage: number;
  address?: string;
}

export interface PersonalDocumentItem {
  id: string;
  documentType: DocumentType;
  documentNumber: string;
  fileUrl?: string;
  fileName?: string;
  isVerified: boolean;
  expiryDate?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  university?: string;
  yearOfPassing?: number;
  percentage?: number;
  grade?: string;
  specialization?: string;
}

export interface ExperienceItem {
  id: string;
  companyName: string;
  designation: string;
  fromDate: string;
  toDate?: string;
  isCurrent: boolean;
  reasonForLeaving?: string;
  lastDrawnSalary?: number;
  location?: string;
}

export interface OrgHierarchyNode {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  designation: string;
  department: string;
  profilePhoto?: string;
  role: string;
  children?: OrgHierarchyNode[];
}

export interface PeopleSearchResult {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  personalEmail?: string;
  officialEmail?: string;
  profilePhoto?: string;
  department: string;
  designation: string;
  workLocation?: string;
}

// ─── Performance Management ─────────────────────────────────────────

export type GoalStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DEFERRED';
export type GoalCategory = 'BUSINESS' | 'LEARNING' | 'DEVELOPMENT';
export type ReviewCycleType = 'QUARTERLY' | 'HALF_YEARLY' | 'ANNUAL';
export type ReviewStatusType = 'SELF_REVIEW' | 'MANAGER_REVIEW' | 'CALIBRATION' | 'COMPLETED';
export type PIPStatusType = 'ACTIVE' | 'COMPLETED' | 'EXTENDED' | 'TERMINATED';
export type FeedbackStatusType = 'REQUESTED' | 'SUBMITTED' | 'EXPIRED';

export interface PerformanceGoalItem {
  id: string;
  employeeId: string;
  title: string;
  description?: string;
  category: GoalCategory;
  weightage: number;
  targetDate?: string;
  status: GoalStatus;
  progress: number;
  selfRating?: number;
  mgrRating?: number;
  cycle: ReviewCycleType;
  year: number;
  parentGoalId?: string;
  isApproved: boolean;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  employee?: {
    firstName: string;
    lastName: string;
    employeeId: string;
  };
  kpis?: KPIItem[];
}

export interface GoalProgressItem {
  id: string;
  goalId: string;
  progress: number;
  notes?: string;
  createdAt: string;
}

export interface ReviewCycleItem {
  id: string;
  name: string;
  cycle: ReviewCycleType;
  year: number;
  startDate: string;
  endDate: string;
  selfDeadline?: string;
  managerDeadline?: string;
  isActive: boolean;
}

export interface ReviewItem {
  id: string;
  revieweeId: string;
  reviewerId: string;
  cycleId?: string;
  cycle: ReviewCycleType;
  year: number;
  overallRating?: number;
  selfRating?: number;
  managerRating?: number;
  status: ReviewStatusType;
  selfComments?: string;
  managerComments?: string;
  promotionRec: boolean;
  completedAt?: string;
  createdAt: string;
  reviewee?: {
    firstName: string;
    lastName: string;
    employeeId: string;
    department?: { name: string };
    designation?: { name: string };
  };
  reviewer?: {
    firstName: string;
    lastName: string;
  };
  ratings?: ReviewRatingItem[];
}

export interface ReviewRatingItem {
  id: string;
  reviewId: string;
  kraId?: string;
  area: string;
  selfRating?: number;
  mgrRating?: number;
  selfComment?: string;
  mgrComment?: string;
  weightage: number;
}

export interface KRAItem {
  id: string;
  employeeId: string;
  title: string;
  description?: string;
  weightage: number;
  cycle: ReviewCycleType;
  year: number;
  kpis?: KPIItem[];
}

export interface KPIItem {
  id: string;
  kraId: string;
  goalId?: string;
  title: string;
  target: string;
  actual?: string;
  unit?: string;
  weightage: number;
}

export interface CompetencyItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  level: number;
  isActive: boolean;
}

export interface CompetencyRatingItem {
  id: string;
  reviewId: string;
  competencyId: string;
  selfRating?: number;
  managerRating?: number;
  comments?: string;
  competency?: CompetencyItem;
}

export interface PIPItem {
  id: string;
  employeeId: string;
  createdById: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: PIPStatusType;
  milestones?: PIPMilestone[];
  reviewDates?: string[];
  outcome?: string;
  completedAt?: string;
  remarks?: string;
  createdAt: string;
  employee?: {
    firstName: string;
    lastName: string;
    employeeId: string;
    department?: { name: string };
  };
  createdBy?: {
    firstName: string;
    lastName: string;
  };
}

export interface PIPMilestone {
  title: string;
  description?: string;
  dueDate: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface Feedback360Item {
  id: string;
  targetId: string;
  requestedById: string;
  cycle: ReviewCycleType;
  year: number;
  deadline?: string;
  isAnonymous: boolean;
  createdAt: string;
  target?: {
    firstName: string;
    lastName: string;
    employeeId: string;
  };
  responses?: FeedbackResponseItem[];
}

export interface FeedbackResponseItem {
  id: string;
  feedback360Id: string;
  responderId: string;
  status: FeedbackStatusType;
  ratings?: Record<string, number>;
  strengths?: string;
  improvements?: string;
  comments?: string;
  submittedAt?: string;
  responder?: {
    firstName: string;
    lastName: string;
  };
}

export interface DepartmentAnalytics {
  departmentName: string;
  totalEmployees: number;
  averageRating: number;
  ratingDistribution: Record<string, number>;
  goalCompletionRate: number;
  topPerformers: {
    employeeId: string;
    name: string;
    rating: number;
  }[];
  bottomPerformers: {
    employeeId: string;
    name: string;
    rating: number;
  }[];
}

export interface BellCurveData {
  rating: number;
  count: number;
  percentage: number;
  employees: {
    employeeId: string;
    name: string;
    department: string;
  }[];
}
