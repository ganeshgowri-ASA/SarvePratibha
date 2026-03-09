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
