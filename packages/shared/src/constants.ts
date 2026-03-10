import type { UserRole, MenuItem, QuickLink, NotificationCategory } from './types';

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
  {
    id: 'recruitment',
    label: 'Recruitment',
    icon: 'UserPlus',
    href: '/recruitment',
    roles: ['MANAGER', 'SECTION_HEAD', 'IT_ADMIN'],
    children: [
      { id: 'req-dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/recruitment' },
      { id: 'req-requisitions', label: 'Requisitions', icon: 'FileText', href: '/recruitment/requisitions' },
      { id: 'req-candidates', label: 'Candidates', icon: 'Users', href: '/recruitment/candidates' },
      { id: 'req-interviews', label: 'Interviews', icon: 'Calendar', href: '/recruitment/interviews' },
      { id: 'req-offers', label: 'Offers', icon: 'Mail', href: '/recruitment/offers' },
      { id: 'req-analytics', label: 'Analytics', icon: 'BarChart3', href: '/recruitment/analytics' },
      { id: 'req-talent-pool', label: 'Talent Pool', icon: 'Database', href: '/recruitment/talent-pool' },
      { id: 'req-sources', label: 'Sources', icon: 'Globe', href: '/recruitment/sources' },
    ],
  },
  { id: 'ai-screening', label: 'AI Screening', icon: 'Bot', href: '/ai-screening', roles: ['MANAGER', 'SECTION_HEAD', 'IT_ADMIN'] },
  { id: 'compliance', label: 'Compliance Management', icon: 'ClipboardCheck', href: '/compliance' },
  { id: 'admin', label: 'Admin Panel', icon: 'ShieldCheck', href: '/admin', roles: ['IT_ADMIN'] },
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

// ─── Notification Categories ────────────────────────────────────────

export const NOTIFICATION_CATEGORY_LABELS: Record<NotificationCategory, string> = {
  LEAVE: 'Leave',
  ATTENDANCE: 'Attendance',
  PAYROLL: 'Payroll',
  PERFORMANCE: 'Performance',
  RECRUITMENT: 'Recruitment',
  SYSTEM: 'System',
  GENERAL: 'General',
};

export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  'LEAVE', 'ATTENDANCE', 'PAYROLL', 'PERFORMANCE', 'RECRUITMENT', 'SYSTEM', 'GENERAL',
];

export const NOTIFICATION_TEMPLATE_VARIABLES: Record<string, string> = {
  '{{employeeName}}': 'Employee full name',
  '{{employeeId}}': 'Employee ID',
  '{{leaveType}}': 'Leave type (e.g., Casual, Sick)',
  '{{startDate}}': 'Start date',
  '{{endDate}}': 'End date',
  '{{approverName}}': 'Approver name',
  '{{month}}': 'Month name',
  '{{year}}': 'Year',
  '{{reviewCycle}}': 'Review cycle name',
  '{{interviewDate}}': 'Interview date/time',
  '{{position}}': 'Job position',
  '{{companyName}}': 'Company name',
};

// ─── Date Formats ───────────────────────────────────────────────────

export const DATE_FORMAT = 'dd MMM yyyy';
export const DATETIME_FORMAT = 'dd MMM yyyy, hh:mm a';
export const TIME_FORMAT = 'hh:mm a';

// ─── Recruitment Constants ─────────────────────────────────────────

export const PIPELINE_STAGES = [
  { key: 'APPLIED', label: 'Applied', color: 'bg-blue-100 text-blue-800' },
  { key: 'SCREENING', label: 'Screening', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'INTERVIEW', label: 'Interview', color: 'bg-purple-100 text-purple-800' },
  { key: 'OFFERED', label: 'Offered', color: 'bg-orange-100 text-orange-800' },
  { key: 'HIRED', label: 'Hired', color: 'bg-green-100 text-green-800' },
  { key: 'REJECTED', label: 'Rejected', color: 'bg-red-100 text-red-800' },
] as const;

export const REQUISITION_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  PENDING_APPROVAL: 'Pending Approval',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  OPEN: 'Open',
  ON_HOLD: 'On Hold',
  CLOSED: 'Closed',
  CANCELLED: 'Cancelled',
};

export const OFFER_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  PENDING_APPROVAL: 'Pending Approval',
  APPROVED: 'Approved',
  SENT: 'Sent',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
  EXPIRED: 'Expired',
};

export const SOURCE_LABELS: Record<string, string> = {
  NAUKRI: 'Naukri',
  LINKEDIN: 'LinkedIn',
  INDEED: 'Indeed',
  GLASSDOOR: 'Glassdoor',
  INTERNAL: 'Internal',
  REFERRAL: 'Referral',
  CAREER_PAGE: 'Career Page',
  OTHER: 'Other',
};

export const INTERVIEW_MODE_LABELS: Record<string, string> = {
  IN_PERSON: 'In Person',
  VIDEO: 'Video Call',
  PHONE: 'Phone',
};

export const RECOMMENDATION_LABELS: Record<string, string> = {
  STRONG_HIRE: 'Strong Hire',
  HIRE: 'Hire',
  NO_HIRE: 'No Hire',
  STRONG_NO_HIRE: 'Strong No Hire',
};

export const PRIORITY_LABELS: Record<string, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

// ─── JD Match Score Constants ─────────────────────────────────────

export const MATCH_SCORE_COLORS = {
  high: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', fill: 'bg-green-500' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', fill: 'bg-yellow-500' },
  low: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', fill: 'bg-red-500' },
} as const;

export const MATCH_SCORE_THRESHOLDS = {
  high: 80,
  medium: 60,
} as const;

export const JD_FIT_LABELS: Record<string, string> = {
  strong_fit: 'Strong Fit',
  good_fit: 'Good Fit',
  partial_fit: 'Partial Fit',
  poor_fit: 'Poor Fit',
};

export const JD_FIT_COLORS: Record<string, string> = {
  strong_fit: 'bg-green-100 text-green-800',
  good_fit: 'bg-blue-100 text-blue-800',
  partial_fit: 'bg-yellow-100 text-yellow-800',
  poor_fit: 'bg-red-100 text-red-800',
// ─── Assessment Scorecard Constants ──────────────────────────────

export const SCORE_ANCHORS: Record<number, string> = {
  1: 'Poor',
  2: 'Below Average',
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
};

export const ASSESSMENT_CATEGORIES = [
  {
    key: 'technicalSkills',
    label: 'Technical Skills',
    weight: 0.30,
    criteria: [
      { key: 'domainKnowledge', label: 'Domain Knowledge' },
      { key: 'problemSolving', label: 'Problem Solving' },
      { key: 'codingAbility', label: 'Coding / Technical Ability' },
    ],
  },
  {
    key: 'communication',
    label: 'Communication',
    weight: 0.20,
    criteria: [
      { key: 'verbalClarity', label: 'Verbal Clarity' },
      { key: 'articulation', label: 'Articulation' },
      { key: 'activeListening', label: 'Active Listening' },
      { key: 'presentation', label: 'Presentation' },
    ],
  },
  {
    key: 'culturalFit',
    label: 'Cultural Fit',
    weight: 0.15,
    criteria: [
      { key: 'valuesAlignment', label: 'Values Alignment' },
      { key: 'teamCompatibility', label: 'Team Compatibility' },
      { key: 'attitude', label: 'Attitude' },
      { key: 'workEthic', label: 'Work Ethic' },
    ],
  },
  {
    key: 'experience',
    label: 'Experience',
    weight: 0.20,
    criteria: [
      { key: 'pastExperience', label: 'Past Experience Relevance' },
      { key: 'projectDepth', label: 'Project Depth' },
      { key: 'industryKnowledge', label: 'Industry Knowledge' },
    ],
  },
  {
    key: 'leadership',
    label: 'Leadership',
    weight: 0.15,
    criteria: [
      { key: 'initiative', label: 'Initiative' },
      { key: 'decisionMaking', label: 'Decision Making' },
      { key: 'mentoringAbility', label: 'Mentoring Ability' },
      { key: 'vision', label: 'Vision' },
    ],
  },
] as const;

export const ASSESSMENT_RECOMMENDATION_LABELS: Record<string, string> = {
  STRONG_HIRE: 'Strong Hire',
  HIRE: 'Hire',
  MAYBE: 'Maybe',
  NO_HIRE: 'No Hire',
};
