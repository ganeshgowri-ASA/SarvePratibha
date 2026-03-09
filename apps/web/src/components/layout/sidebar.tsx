'use client';

import { useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';
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
};

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  roles?: UserRole[];
}

const MENU_ITEMS: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: 'Home', href: '/dashboard' },
  { id: 'people', label: 'People', icon: 'Users', href: '/people' },
  { id: 'organization', label: 'Organization', icon: 'Building2', href: '/organization' },
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
  { id: 'recruitment', label: 'Recruitment', icon: 'UserPlus', href: '/recruitment', roles: ['MANAGER', 'SECTION_HEAD', 'IT_ADMIN'] },
  { id: 'ai-screening', label: 'AI Screening', icon: 'Bot', href: '/ai-screening', roles: ['MANAGER', 'SECTION_HEAD', 'IT_ADMIN'] },
  { id: 'compliance', label: 'Compliance Management', icon: 'ClipboardCheck', href: '/compliance' },
  { id: 'notifications', label: 'Notifications', icon: 'Bell', href: '/notifications' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role as UserRole | undefined;
  const userLevel = userRole ? ROLE_HIERARCHY[userRole] ?? 0 : 0;

  const filteredMenu = MENU_ITEMS.filter((item) => {
    if (!item.roles) return true;
    if (userRole === 'IT_ADMIN') return true;
    return item.roles.some((role) => userLevel >= ROLE_HIERARCHY[role]);
  });

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
          {filteredMenu.map((item) => {
            const Icon = ICON_MAP[item.icon] || Home;
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
                <Icon size={20} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
