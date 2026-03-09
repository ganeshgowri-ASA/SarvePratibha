'use client';

import { useSession } from 'next-auth/react';
import type { UserRole } from '@sarve-pratibha/shared';
import { GreetingBanner } from '@/components/dashboard/greeting-banner';
import { PunchWidget } from '@/components/dashboard/punch-widget';
import { AttendanceCalendar } from '@/components/dashboard/attendance-calendar';
import { QuickLinks } from '@/components/dashboard/quick-links';
import { BirthdaysWidget } from '@/components/dashboard/birthdays-widget';
import { AnnouncementsWidget } from '@/components/dashboard/announcements-widget';
import { TeamApprovals, TeamAttendance, PendingRequests } from '@/components/dashboard/manager-widgets';
import { DepartmentAnalytics, BulkApprovals, HeadcountWidget } from '@/components/dashboard/section-head-widgets';
import { SystemHealth, UserManagement, AuditLogs } from '@/components/dashboard/admin-widgets';

export default function DashboardPage() {
  const { data: session } = useSession();
  const role = ((session?.user as any)?.role as UserRole) || 'EMPLOYEE';

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <GreetingBanner />

      {/* Employee Dashboard (base for all roles) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PunchWidget />
            <QuickLinks />
          </div>
          <AttendanceCalendar />

          {/* Manager+ widgets */}
          {(role === 'MANAGER' || role === 'SECTION_HEAD' || role === 'IT_ADMIN') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TeamApprovals />
              <TeamAttendance />
            </div>
          )}

          {/* Section Head+ widgets */}
          {(role === 'SECTION_HEAD' || role === 'IT_ADMIN') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DepartmentAnalytics />
              <BulkApprovals />
            </div>
          )}

          {/* IT Admin widgets */}
          {role === 'IT_ADMIN' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SystemHealth />
              <AuditLogs />
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <BirthdaysWidget />
          <AnnouncementsWidget />

          {/* Manager+ */}
          {(role === 'MANAGER' || role === 'SECTION_HEAD' || role === 'IT_ADMIN') && (
            <PendingRequests />
          )}

          {/* Section Head+ */}
          {(role === 'SECTION_HEAD' || role === 'IT_ADMIN') && (
            <HeadcountWidget />
          )}

          {/* IT Admin */}
          {role === 'IT_ADMIN' && <UserManagement />}
        </div>
      </div>
    </div>
  );
}
