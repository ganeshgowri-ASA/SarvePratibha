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

// ─── Recruitment / ATS ─────────────────────────────────────────────

export type RequisitionStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'OPEN' | 'ON_HOLD' | 'CLOSED' | 'CANCELLED';
export type ApplicationStage = 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFERED' | 'HIRED' | 'REJECTED';
export type OfferStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN' | 'EXPIRED';
export type SourcePlatform = 'NAUKRI' | 'LINKEDIN' | 'INDEED' | 'GLASSDOOR' | 'INTERNAL' | 'REFERRAL' | 'CAREER_PAGE' | 'OTHER';
export type InterviewMode = 'IN_PERSON' | 'VIDEO' | 'PHONE';
export type FeedbackRecommendation = 'STRONG_HIRE' | 'HIRE' | 'NO_HIRE' | 'STRONG_NO_HIRE';

export interface RequisitionSummary {
  id: string;
  title: string;
  department: string;
  positions: number;
  filledPositions: number;
  status: RequisitionStatus;
  priority: string;
  createdAt: string;
  closingDate?: string;
}

export interface CandidateSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  currentCompany?: string;
  currentTitle?: string;
  totalExp?: number;
  source: SourcePlatform;
  skills: string[];
  applicationCount: number;
}

export interface PipelineStage {
  stage: ApplicationStage;
  label: string;
  count: number;
  applications: PipelineCard[];
}

export interface PipelineCard {
  id: string;
  candidateId: string;
  candidateName: string;
  email: string;
  currentTitle?: string;
  source: SourcePlatform;
  appliedAt: string;
  movedAt: string;
  interviewCount: number;
  avgRating?: number;
}

export interface InterviewEvent {
  id: string;
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  interviewerName: string;
  scheduledAt: string;
  duration: number;
  round: number;
  mode: InterviewMode;
  location?: string;
  meetingLink?: string;
  result: string;
}

export interface OfferSummary {
  id: string;
  applicationId: string;
  candidateName: string;
  designation: string;
  department: string;
  grossSalary: number;
  netSalary: number;
  joiningDate: string;
  status: OfferStatus;
  validUntil?: string;
}

export interface RecruitmentAnalytics {
  totalRequisitions: number;
  openPositions: number;
  totalCandidates: number;
  totalApplications: number;
  hiredThisMonth: number;
  avgTimeToHire: number;
  hiringFunnel: { stage: string; count: number }[];
  sourceEffectiveness: { source: string; count: number; hiredCount: number }[];
  departmentOpenings: { department: string; openings: number; filled: number }[];
}
