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

export type NotificationTypeEnum = 'INFO' | 'WARNING' | 'ACTION_REQUIRED' | 'APPROVAL' | 'SYSTEM';
export type NotificationCategory = 'LEAVE' | 'ATTENDANCE' | 'PAYROLL' | 'PERFORMANCE' | 'RECRUITMENT' | 'SYSTEM' | 'GENERAL';
export type NotificationChannel = 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
export type NotificationFrequency = 'INSTANT' | 'DAILY_DIGEST' | 'WEEKLY_DIGEST';
export type EmailStatus = 'QUEUED' | 'SENT' | 'DELIVERED' | 'FAILED' | 'BOUNCED';
export type SMSStatus = 'QUEUED' | 'SENT' | 'DELIVERED' | 'FAILED';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationTypeEnum;
  category: NotificationCategory;
  link?: string;
  isRead: boolean;
  readAt?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface NotificationPreferenceItem {
  id: string;
  category: NotificationCategory;
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  frequency: NotificationFrequency;
}

export interface NotificationTemplateItem {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: NotificationCategory;
  channel: NotificationChannel;
  variables?: Record<string, string>;
  isActive: boolean;
  createdAt: string;
}

export interface EmailLogItem {
  id: string;
  to: string;
  from?: string;
  subject: string;
  status: EmailStatus;
  provider?: string;
  error?: string;
  sentAt?: string;
  createdAt: string;
}

export interface SMSLogItem {
  id: string;
  to: string;
  message: string;
  status: SMSStatus;
  provider?: string;
  error?: string;
  sentAt?: string;
  createdAt: string;
}

export interface QuietHoursSettings {
  enabled: boolean;
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface BulkNotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationTypeEnum;
  category: NotificationCategory;
  targetRoles?: UserRole[];
  targetDepts?: string[];
  totalCount: number;
  sentCount: number;
  failedCount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}
