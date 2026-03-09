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

// ─── Payroll ────────────────────────────────────────────────────────

export type TaxRegime = 'OLD' | 'NEW';
export type PayslipStatus = 'DRAFT' | 'GENERATED' | 'PUBLISHED' | 'PAID';
export type PayrollRunStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type ReimbursementStatus = 'DRAFT' | 'SUBMITTED' | 'MANAGER_APPROVED' | 'FINANCE_APPROVED' | 'REJECTED' | 'PAID';

export interface SalaryStructure {
  id: string;
  employeeId: string;
  basicSalary: number;
  hra: number;
  conveyance: number;
  medicalAllow: number;
  specialAllow: number;
  otherAllow: number;
  pfContribution: number;
  esiContribution: number;
  professionalTax: number;
  tds: number;
  grossSalary: number;
  netSalary: number;
}

export interface PayslipData {
  id: string;
  month: number;
  year: number;
  basicSalary: number;
  hra: number;
  conveyance: number;
  medicalAllow: number;
  specialAllow: number;
  otherAllow: number;
  otherEarnings: number;
  pfDeduction: number;
  esiDeduction: number;
  profTax: number;
  tds: number;
  otherDeductions: number;
  lop: number;
  lopDays: number;
  grossEarnings: number;
  totalDeductions: number;
  netPay: number;
  status: PayslipStatus;
}

export interface TaxDeclarationData {
  id: string;
  financialYear: string;
  regime: TaxRegime;
  section80C: number;
  section80D: number;
  section80G: number;
  section24: number;
  hra: number;
  lta: number;
  otherDeductions: number;
  totalDeclared: number;
  isProofSubmitted: boolean;
  isVerified: boolean;
}

export interface TaxComputation {
  grossIncome: number;
  standardDeduction: number;
  section80C: number;
  section80D: number;
  section80G: number;
  section24: number;
  hraExemption: number;
  ltaExemption: number;
  otherDeductions: number;
  totalDeductions: number;
  taxableIncome: number;
  taxPayable: number;
  cess: number;
  totalTax: number;
  monthlyTds: number;
  regime: TaxRegime;
}

export interface ReimbursementItem {
  id: string;
  categoryName: string;
  categoryCode: string;
  amount: number;
  description?: string;
  receiptUrl?: string;
  incurredDate: string;
  status: ReimbursementStatus;
  remarks?: string;
  createdAt: string;
}

export interface ReimbursementCategoryItem {
  id: string;
  name: string;
  code: string;
  description?: string;
  maxAmount?: number;
  requiresReceipt: boolean;
}

export interface PayrollRunSummary {
  id: string;
  month: number;
  year: number;
  status: PayrollRunStatus;
  totalEmployees: number;
  processedCount: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
}

export interface PayrollSummaryDashboard {
  totalEmployees: number;
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
  paidCount: number;
  pendingCount: number;
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
