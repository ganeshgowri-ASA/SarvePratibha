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
