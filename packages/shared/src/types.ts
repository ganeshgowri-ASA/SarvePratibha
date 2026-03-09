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

// ─── Admin Module Types ────────────────────────────────────────────

export type ConfigCategory = 'GENERAL' | 'EMAIL' | 'SECURITY' | 'NOTIFICATIONS' | 'PAYROLL' | 'LEAVE' | 'ATTENDANCE' | 'INTEGRATION';

export interface SystemConfigItem {
  id: string;
  key: string;
  value: string;
  label: string;
  description?: string;
  category: ConfigCategory;
  isEditable: boolean;
}

export interface SystemHealthData {
  stats: {
    totalUsers: number;
    activeEmployees: number;
    departments: number;
    pendingLeaves: number;
  };
  system: {
    uptime: number;
    cpuLoad: number[];
    memoryUsage: {
      used: number;
      total: number;
      percentage: string;
      heapUsed: number;
      heapTotal: number;
    };
    nodeVersion: string;
    platform: string;
  };
  services: {
    database: string;
    api: string;
    activeSessions: number;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  image?: string;
  employee?: {
    employeeId: string;
    departmentId: string;
    department?: { name: string };
  };
}

export interface SecurityPolicyData {
  id: string;
  minPasswordLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  passwordExpiryDays: number;
  maxLoginAttempts: number;
  lockoutDurationMins: number;
  sessionTimeoutMins: number;
  enable2FA: boolean;
  ipWhitelist?: string;
  enforceIPWhitelist: boolean;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  oldData?: any;
  newData?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user: { name: string; email: string; role: UserRole };
}

export interface BackupLogItem {
  id: string;
  type: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  fileName?: string;
  fileSize?: string;
  startedAt: string;
  completedAt?: string;
  triggeredBy?: string;
  error?: string;
}

export interface IntegrationItem {
  id: string;
  name: string;
  provider: string;
  description?: string;
  config?: any;
  isEnabled: boolean;
  lastSyncAt?: string;
}

export interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  organization?: { name: string };
  parent?: { name: string };
  _count?: { employees: number };
}

export interface LocationItem {
  id: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  isActive: boolean;
}

export interface DesignationItem {
  id: string;
  name: string;
  code: string;
  level: number;
  band?: string;
  isActive: boolean;
  _count?: { employees: number };
}

export interface GradeItem {
  id: string;
  name: string;
  code: string;
  level: number;
  minSalary?: number;
  maxSalary?: number;
  isActive: boolean;
}

export interface CustomFieldItem {
  id: string;
  module: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  options?: any;
  isRequired: boolean;
  isActive: boolean;
  displayOrder: number;
}

export interface WorkflowItem {
  id: string;
  name: string;
  module: string;
  description?: string;
  triggerEvent?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  steps: WorkflowStepItem[];
}

export interface WorkflowStepItem {
  id: string;
  stepOrder: number;
  name: string;
  approverRole?: UserRole;
  approverId?: string;
  isRequired: boolean;
  autoApprove: boolean;
  timeoutHours?: number;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  targetRole?: UserRole;
  isPinned: boolean;
  isActive: boolean;
  publishAt: string;
  expiresAt?: string;
  createdBy?: string;
  createdAt: string;
}

export interface CompanyPolicyItem {
  id: string;
  title: string;
  content: string;
  category: string;
  version: string;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
}
