'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Home,
  Users,
  UserCircle,
  CalendarDays,
  IndianRupee,
  Receipt,
  Gift,
  Heart,
  Settings,
  Building2,
  Shield,
  TrendingUp,
  Plane,
  Smile,
  GraduationCap,
  ClipboardCheck,
  UserPlus,
  Bot,
  Headphones,
  Laptop,
  DoorOpen,
  Car,
  Bell,
  ShieldCheck,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FileText,
  UserCheck,
  UserMinus,
  Hotel,
  Bus,
  Train,
  Briefcase,
  MapPin,
  GitBranch,
  Clock,
  Fingerprint,
  Cpu,
  type LucideIcon,
} from 'lucide-react';
import { loadApprovals } from '@/lib/approval-store';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { UserRole } from '@sarve-pratibha/shared';
import { ROLE_HIERARCHY } from '@sarve-pratibha/shared';

const ICON_MAP: Record<string, LucideIcon> = {
  Home,
  Users,
  UserCircle,
  CalendarDays,
  IndianRupee,
  Receipt,
  Gift,
  Heart,
  Settings,
  Building2,
  Shield,
  TrendingUp,
  Plane,
  Smile,
  GraduationCap,
  ClipboardCheck,
  UserPlus,
  Bot,
  Headphones,
  Laptop,
  DoorOpen,
  Car,
  Bell,
  ShieldCheck,
  BookOpen,
  FileText,
  UserCheck,
  UserMinus,
  CreditCard,
  Hotel,
  Bus,
  Train,
  Briefcase,
  MapPin,
  GitBranch,
  Clock,
  Fingerprint,
  Cpu,
};

interface ProviderBadge {
  label: string;
  color: string;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  roles?: UserRole[];
  providers?: ProviderBadge[];
}

interface SidebarGroup {
  id: string;
  label: string;
  icon: string;
  standalone?: boolean;
  roles?: UserRole[];
  items: SidebarItem[];
}

const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'Home',
    standalone: true,
    items: [{ id: 'home', label: 'Home', icon: 'Home', href: '/dashboard' }],
  },
  {
    id: 'people-org',
    label: 'People & Organization',
    icon: 'Users',
    items: [
      { id: 'people', label: 'People', icon: 'Users', href: '/people' },
      { id: 'organization', label: 'Organization', icon: 'Building2', href: '/organization' },
      { id: 'personal', label: 'Personal Details', icon: 'UserCircle', href: '/personal-details' },
    ],
  },
  {
    id: 'attendance-leave',
    label: 'Attendance & Leave',
    icon: 'CalendarDays',
    items: [
      { id: 'leave-attendance', label: 'Leave & Attendance', icon: 'CalendarDays', href: '/leave-attendance' },
      { id: 'biometric-logs', label: 'Biometric Logs', icon: 'Fingerprint', href: '/attendance/biometric-logs' },
    ],
  },
  {
    id: 'payroll-benefits',
    label: 'Payroll & Benefits',
    icon: 'IndianRupee',
    items: [
      { id: 'payroll', label: 'Payroll', icon: 'IndianRupee', href: '/payroll' },
      { id: 'reimbursements', label: 'Reimbursements', icon: 'Receipt', href: '/reimbursements' },
      { id: 'benefits', label: 'Benefits', icon: 'Gift', href: '/benefits' },
    ],
  },
  {
    id: 'travel-transport',
    label: 'Travel & Transport',
    icon: 'Plane',
    items: [
      {
        id: 'travel',
        label: 'Travel & Guest House',
        icon: 'Train',
        href: '/travel',
        providers: [
          { label: 'IRCTC', color: 'bg-blue-500/80' },
          { label: 'MMT', color: 'bg-red-500/80' },
          { label: 'Paytm', color: 'bg-indigo-500/80' },
          { label: 'Bus', color: 'bg-green-600/80' },
        ],
      },
      {
        id: 'cab-booking',
        label: 'Cab Booking',
        icon: 'Car',
        href: '/cab-booking',
        providers: [
          { label: 'Ola', color: 'bg-yellow-500/80' },
          { label: 'Uber', color: 'bg-gray-700/80' },
          { label: 'Rapido', color: 'bg-yellow-400/80' },
          { label: 'Meru', color: 'bg-green-500/80' },
          { label: 'Ohm', color: 'bg-teal-500/80' },
        ],
      },
      {
        id: 'hotel-bookings',
        label: 'Hotel Bookings',
        icon: 'Hotel',
        href: '/hotel-bookings',
        providers: [
          { label: 'MMT', color: 'bg-red-500/80' },
          { label: 'Paytm', color: 'bg-indigo-500/80' },
          { label: 'Booking', color: 'bg-blue-600/80' },
          { label: 'OYO', color: 'bg-rose-600/80' },
        ],
      },
      {
        id: 'corporate-ext',
        label: 'Cards & Trips',
        icon: 'CreditCard',
        href: '/corporate-services',
      },
    ],
  },
  {
    id: 'facilities-services',
    label: 'Facilities & Services',
    icon: 'Building2',
    items: [
      { id: 'meeting-rooms', label: 'Meeting Rooms', icon: 'DoorOpen', href: '/meeting-rooms' },
      { id: 'assets', label: 'Assets', icon: 'Laptop', href: '/assets' },
      { id: 'helpdesk', label: 'Helpdesk', icon: 'Headphones', href: '/helpdesk' },
      { id: 'corporate', label: 'Corporate Services', icon: 'Building2', href: '/services' },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    icon: 'Shield',
    items: [
      { id: 'security-services', label: 'Security Services', icon: 'Shield', href: '/security-services' },
    ],
  },
  {
    id: 'talent-performance',
    label: 'Talent & Performance',
    icon: 'TrendingUp',
    items: [
      { id: 'performance', label: 'Performance Management', icon: 'TrendingUp', href: '/performance' },
      { id: 'talent', label: 'Talent Management', icon: 'GraduationCap', href: '/talent', roles: ['MANAGER', 'SECTION_HEAD', 'IT_ADMIN'] },
      { id: 'recruitment', label: 'Recruitment', icon: 'UserPlus', href: '/recruitment', roles: ['MANAGER', 'SECTION_HEAD', 'IT_ADMIN'] },
      { id: 'ai-screening', label: 'AI Screening', icon: 'Bot', href: '/ai-screening', roles: ['MANAGER', 'SECTION_HEAD', 'IT_ADMIN'] },
    ],
  },
  {
    id: 'learning-dev',
    label: 'Learning & Development',
    icon: 'BookOpen',
    items: [
      { id: 'learning', label: 'Learning', icon: 'BookOpen', href: '/learning' },
    ],
  },
  {
    id: 'employee-experience',
    label: 'Employee Experience',
    icon: 'Smile',
    items: [
      { id: 'engagement', label: 'Employee Engagement', icon: 'Smile', href: '/engagement' },
      { id: 'diversity', label: 'D&I', icon: 'Heart', href: '/diversity-inclusion' },
      { id: 'self-services', label: 'Self Services', icon: 'Settings', href: '/self-services' },
    ],
  },
  {
    id: 'compliance-docs',
    label: 'Compliance & Docs',
    icon: 'ClipboardCheck',
    items: [
      { id: 'compliance', label: 'Compliance Management', icon: 'ClipboardCheck', href: '/compliance' },
      { id: 'documents', label: 'Documents', icon: 'FileText', href: '/documents' },
    ],
  },
  {
    id: 'workforce-lifecycle',
    label: 'Workforce Lifecycle',
    icon: 'UserCheck',
    items: [
      { id: 'onboarding', label: 'Onboarding', icon: 'UserCheck', href: '/onboarding', roles: ['MANAGER', 'SECTION_HEAD', 'IT_ADMIN'] },
      { id: 'offboarding', label: 'Offboarding', icon: 'UserMinus', href: '/offboarding', roles: ['MANAGER', 'SECTION_HEAD', 'IT_ADMIN'] },
    ],
  },
  {
    id: 'my-approvals',
    label: 'My Approvals',
    icon: 'GitBranch',
    items: [
      { id: 'approvals', label: 'All Approvals', icon: 'GitBranch', href: '/approvals' },
      { id: 'wfh', label: 'Work From Home', icon: 'Briefcase', href: '/wfh' },
      { id: 'overtime', label: 'Overtime', icon: 'Clock', href: '/overtime' },
      { id: 'salary-advance', label: 'Salary Advance', icon: 'IndianRupee', href: '/salary-advance' },
    ],
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: 'ShieldCheck',
    roles: ['IT_ADMIN'],
    items: [
      { id: 'notifications', label: 'Notifications', icon: 'Bell', href: '/notifications' },
      { id: 'admin-panel', label: 'Admin Panel', icon: 'ShieldCheck', href: '/admin', roles: ['IT_ADMIN'] },
      { id: 'approval-matrix', label: 'Approval Matrix', icon: 'GitBranch', href: '/admin/approval-matrix', roles: ['IT_ADMIN'] },
      { id: 'reporting-hierarchy', label: 'Reporting Hierarchy', icon: 'Users', href: '/admin/reporting-hierarchy', roles: ['IT_ADMIN'] },
      { id: 'delegation', label: 'Delegation & Proxy', icon: 'UserCheck', href: '/admin/delegation', roles: ['IT_ADMIN'] },
      { id: 'biometric-devices', label: 'Biometric Devices', icon: 'Cpu', href: '/admin/biometric-devices', roles: ['IT_ADMIN'] },
      { id: 'biometric-mapping', label: 'Device Mapping', icon: 'Fingerprint', href: '/admin/biometric-mapping', roles: ['IT_ADMIN'] },
      { id: 'api-integration-settings', label: 'API Integration Settings', icon: 'Settings', href: '/admin/api-integration-settings', roles: ['IT_ADMIN'] },
    ],
  },
];

const STORAGE_KEY = 'sidebar-group-open-state';

function loadGroupState(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveGroupState(state: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [groupOpen, setGroupOpen] = useState<Record<string, boolean>>({});
  const [pendingCount, setPendingCount] = useState(0);
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role as UserRole | undefined;
  const userLevel = userRole ? ROLE_HIERARCHY[userRole] ?? 0 : 0;

  // Load persisted open/close state on mount
  useEffect(() => {
    const saved = loadGroupState();
    setGroupOpen(saved);
  }, []);

  // Load pending approvals count from localStorage
  useEffect(() => {
    function refreshCount() {
      const all = loadApprovals();
      const count = all.filter((r) => r.status === 'PENDING' || r.status === 'ESCALATED').length;
      setPendingCount(count);
    }
    refreshCount();
    // Refresh on storage events (cross-tab) and on focus
    window.addEventListener('storage', refreshCount);
    window.addEventListener('focus', refreshCount);
    return () => {
      window.removeEventListener('storage', refreshCount);
      window.removeEventListener('focus', refreshCount);
    };
  }, []);

  const toggleGroup = (groupId: string) => {
    setGroupOpen((prev) => {
      const next = { ...prev, [groupId]: !prev[groupId] };
      saveGroupState(next);
      return next;
    });
  };

  const isGroupOpen = (groupId: string) => groupOpen[groupId] ?? false;

  const canAccessItem = (item: SidebarItem): boolean => {
    if (!item.roles) return true;
    if (userRole === 'IT_ADMIN') return true;
    return item.roles.some((role) => userLevel >= ROLE_HIERARCHY[role]);
  };

  const canAccessGroup = (group: SidebarGroup): boolean => {
    if (!group.roles) return true;
    if (userRole === 'IT_ADMIN') return true;
    return group.roles.some((role) => userLevel >= ROLE_HIERARCHY[role]);
  };

  const isGroupActive = (group: SidebarGroup): boolean => {
    return group.items.some(
      (item) => pathname === item.href || pathname.startsWith(item.href + '/'),
    );
  };

  const filteredGroups = SIDEBAR_GROUPS.filter(canAccessGroup).map((group) => ({
    ...group,
    items: group.items.filter(canAccessItem),
  })).filter((group) => group.items.length > 0);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-teal-800 to-teal-900 text-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-teal-700/50">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="font-bold text-sm">SP</span>
            </div>
            <span className="font-bold text-lg">SarvePratibha</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-teal-700/50 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <nav className="p-2 space-y-0.5">
          {filteredGroups.map((group) => {
            const GroupIcon = ICON_MAP[group.icon] || Home;
            const groupActive = isGroupActive(group);
            const open = isGroupOpen(group.id);

            // Standalone item (Home) — render as direct link
            if (group.standalone && group.items.length === 1) {
              const item = group.items[0];
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-teal-100 hover:bg-teal-700/50 hover:text-white',
                    collapsed && 'justify-center px-2',
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <GroupIcon size={20} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            }

            // Collapsible group
            return (
              <div key={group.id}>
                {/* Group header */}
                <button
                  onClick={() => !collapsed && toggleGroup(group.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all',
                    groupActive && !open
                      ? 'bg-white/15 text-white'
                      : 'text-teal-200 hover:bg-teal-700/40 hover:text-white',
                    collapsed && 'justify-center px-2',
                  )}
                  title={collapsed ? group.label : undefined}
                  aria-expanded={open}
                >
                  <GroupIcon size={20} className="shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="truncate flex-1 text-left">{group.label}</span>
                      {group.id === 'my-approvals' && pendingCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none shrink-0">
                          {pendingCount > 99 ? '99+' : pendingCount}
                        </span>
                      )}
                      {open ? (
                        <ChevronUp size={14} className="shrink-0 text-teal-300" />
                      ) : (
                        <ChevronDown size={14} className="shrink-0 text-teal-300" />
                      )}
                    </>
                  )}
                </button>

                {/* Group items */}
                {!collapsed && open && (
                  <div className="mt-0.5 ml-3 pl-3 border-l border-teal-700/50 space-y-0.5">
                    {group.items.map((item) => {
                      const ItemIcon = ICON_MAP[item.icon] || Home;
                      const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          className={cn(
                            'flex flex-col gap-1 px-2.5 py-2 rounded-lg text-sm transition-all',
                            isActive
                              ? 'bg-white/20 text-white shadow-sm'
                              : 'text-teal-100 hover:bg-teal-700/50 hover:text-white',
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <ItemIcon size={16} className="shrink-0" />
                            <span className="truncate font-medium">{item.label}</span>
                          </div>
                          {item.providers && item.providers.length > 0 && (
                            <div className="flex flex-wrap gap-1 pl-6">
                              {item.providers.map((p) => (
                                <span
                                  key={p.label}
                                  className={cn(
                                    'text-[9px] font-bold px-1.5 py-0.5 rounded text-white/90 leading-none',
                                    p.color,
                                  )}
                                >
                                  {p.label}
                                </span>
                              ))}
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
