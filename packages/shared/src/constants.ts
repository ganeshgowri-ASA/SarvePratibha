import type { UserRole, MenuItem, QuickLink } from './types';

// ─── Role Hierarchy ─────────────────────────────────────────────────

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  EMPLOYEE: 0,
  MANAGER: 1,
  SECTION_HEAD: 2,
  IT_ADMIN: 3,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  EMPLOYEE: 'Employee',
  MANAGER: 'Manager',
  SECTION_HEAD: 'Section Head',
  IT_ADMIN: 'IT Admin',
};

// ─── Sidebar Menu Items ─────────────────────────────────────────────

export const SIDEBAR_MENU: MenuItem[] = [
  { id: 'home', label: 'Home', icon: 'Home', href: '/dashboard' },
  { id: 'people', label: 'People', icon: 'Users', href: '/people', roles: ['MANAGER', 'SECTION_HEAD', 'IT_ADMIN'] },
  { id: 'personal', label: 'Personal Details', icon: 'UserCircle', href: '/personal-details' },
  { id: 'leave-attendance', label: 'Leave & Attendance', icon: 'CalendarDays', href: '/leave-attendance' },
  { id: 'payroll', label: 'Payroll', icon: 'IndianRupee', href: '/payroll' },
  { id: 'reimbursements', label: 'Reimbursements', icon: 'Receipt', href: '/reimbursements' },
  { id: 'benefits', label: 'Benefits', icon: 'Gift', href: '/benefits' },
  { id: 'diversity', label: 'D&I', icon: 'Heart', href: '/diversity-inclusion' },
  { id: 'self-services', label: 'Self Services', icon: 'Settings', href: '/self-services' },
  { id: 'corporate', label: 'Corporate Services', icon: 'Building2', href: '/services' },
  { id: 'security', label: 'Security Services', icon: 'Shield', href: '/security-services' },
  { id: 'performance', label: 'Performance Management', icon: 'TrendingUp', href: '/performance' },
  { id: 'travel', label: 'Travel & Guest House', icon: 'Plane', href: '/travel' },
  { id: 'assets', label: 'Assets', icon: 'Laptop', href: '/assets' },
  { id: 'helpdesk', label: 'Helpdesk', icon: 'Headphones', href: '/helpdesk' },
  { id: 'meeting-rooms', label: 'Meeting Rooms', icon: 'DoorOpen', href: '/meeting-rooms' },
  { id: 'cab-booking', label: 'Cab Booking', icon: 'Car', href: '/cab-booking' },
  { id: 'engagement', label: 'Employee Engagement', icon: 'Smile', href: '/engagement' },
  { id: 'talent', label: 'Talent Management', icon: 'GraduationCap', href: '/talent', roles: ['MANAGER', 'SECTION_HEAD', 'IT_ADMIN'] },
  { id: 'compliance', label: 'Compliance Management', icon: 'ClipboardCheck', href: '/compliance' },
];

// ─── Quick Links ────────────────────────────────────────────────────

export const EMPLOYEE_QUICK_LINKS: QuickLink[] = [
  { label: 'Apply Leave', href: '/leave-attendance/apply', icon: 'CalendarPlus', description: 'Submit a new leave request' },
  { label: 'View Payslip', href: '/payroll/payslips', icon: 'FileText', description: 'Download your latest payslip' },
  { label: 'Submit Claim', href: '/reimbursements/new', icon: 'Receipt', description: 'File a new reimbursement claim' },
  { label: 'IT Support', href: '/helpdesk/new', icon: 'Laptop', description: 'Raise an IT support ticket' },
  { label: 'My Goals', href: '/performance/goals', icon: 'Target', description: 'View and update your goals' },
  { label: 'Tax Declaration', href: '/payroll/tax', icon: 'Calculator', description: 'Submit tax declarations' },
];

// ─── Color Theme ────────────────────────────────────────────────────

export const BRAND_COLORS = {
  primary: '#0D9488',       // teal-600
  primaryDark: '#0F766E',   // teal-700
  primaryLight: '#14B8A6',  // teal-500
  secondary: '#1E40AF',     // blue-800
  secondaryLight: '#3B82F6', // blue-500
  accent: '#F59E0B',        // amber-500
  background: '#F8FAFC',    // slate-50
  surface: '#FFFFFF',
  textPrimary: '#0F172A',   // slate-900
  textSecondary: '#64748B', // slate-500
} as const;

// ─── Date Formats ───────────────────────────────────────────────────

export const DATE_FORMAT = 'dd MMM yyyy';
export const DATETIME_FORMAT = 'dd MMM yyyy, hh:mm a';
export const TIME_FORMAT = 'hh:mm a';
