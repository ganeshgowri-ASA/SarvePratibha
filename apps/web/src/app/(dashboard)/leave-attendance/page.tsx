'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CalendarDays,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar as CalendarIcon,
  Users,
  FileText,
  ArrowRight,
  Timer,
  Briefcase,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface LeaveBalance {
  id: string;
  leaveType: string;
  code: string;
  allocated: number;
  used: number;
  carried: number;
  balance: number;
}

interface LeaveRequest {
  id: string;
  leaveType: { name: string; code: string };
  employee?: { firstName: string; lastName: string };
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, { bg: string }> = {
  APPROVED: { bg: 'bg-green-100 text-green-700' },
  PENDING: { bg: 'bg-yellow-100 text-yellow-700' },
  REJECTED: { bg: 'bg-red-100 text-red-700' },
  CANCELLED: { bg: 'bg-gray-100 text-gray-500' },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function LeaveAttendancePage() {
  const { data: session } = useSession();
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [recentLeaves, setRecentLeaves] = useState<LeaveRequest[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const token = (session?.user as any)?.accessToken;
  const employeeId = (session?.user as any)?.employeeId;
  const userRole = (session?.user as any)?.role;
  const isManager = userRole === 'MANAGER' || userRole === 'SECTION_HEAD' || userRole === 'IT_ADMIN';

  useEffect(() => {
    if (!token || !employeeId) return;

    async function loadData() {
      try {
        const [balanceRes, leavesRes] = await Promise.all([
          apiFetch<LeaveBalance[]>(`/api/leave/balance/${employeeId}`, { token }),
          apiFetch<LeaveRequest[]>('/api/leave/requests?limit=5', { token }),
        ]);

        setBalances(balanceRes.data || []);
        setRecentLeaves((leavesRes.data || []) as LeaveRequest[]);

        if (isManager) {
          const approvalsRes = await apiFetch<LeaveRequest[]>('/api/leave/requests?status=pending&team=true', { token });
          setPendingApprovals((approvalsRes.data || []) as LeaveRequest[]);
        }
      } catch (err) {
        console.error('Failed to load leave data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token, employeeId, isManager]);

  const displayBalances = balances.length > 0 ? balances : [
    { id: '1', leaveType: 'Casual Leave', code: 'CL', allocated: 12, used: 0, carried: 0, balance: 12 },
    { id: '2', leaveType: 'Sick Leave', code: 'SL', allocated: 12, used: 0, carried: 0, balance: 12 },
    { id: '3', leaveType: 'Earned Leave', code: 'EL', allocated: 15, used: 0, carried: 0, balance: 15 },
    { id: '4', leaveType: 'Comp Off', code: 'CO', allocated: 0, used: 0, carried: 0, balance: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave & Attendance</h1>
          <p className="text-sm text-gray-500">Manage your leaves and view attendance</p>
        </div>
        <Link href="/leave-attendance/apply">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus size={16} className="mr-2" /> Apply Leave
          </Button>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <Link href="/leave-attendance/apply">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-4 flex flex-col items-center gap-2">
              <CalendarDays size={24} className="text-teal-600" />
              <span className="text-xs font-medium text-gray-700">Apply Leave</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/leave-attendance/history">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-4 flex flex-col items-center gap-2">
              <FileText size={24} className="text-blue-600" />
              <span className="text-xs font-medium text-gray-700">Leave History</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/leave-attendance/calendar">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-4 flex flex-col items-center gap-2">
              <CalendarIcon size={24} className="text-green-600" />
              <span className="text-xs font-medium text-gray-700">Holiday Calendar</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/leave-attendance/attendance">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-4 flex flex-col items-center gap-2">
              <Timer size={24} className="text-orange-600" />
              <span className="text-xs font-medium text-gray-700">Attendance</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/leave-attendance/attendance/regularize">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-4 flex flex-col items-center gap-2">
              <Briefcase size={24} className="text-purple-600" />
              <span className="text-xs font-medium text-gray-700">Regularize</span>
            </CardContent>
          </Card>
        </Link>
        {isManager && (
          <Link href="/leave-attendance/attendance/team">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-4 pb-4 flex flex-col items-center gap-2">
                <Users size={24} className="text-red-600" />
                <span className="text-xs font-medium text-gray-700">Team View</span>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>

      {/* Leave Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayBalances.map((leave) => (
          <Card key={leave.code}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">{leave.leaveType}</p>
                  <p className="text-xs text-gray-500">{leave.code}</p>
                </div>
                <span className="text-2xl font-bold text-gray-900">{leave.balance}</span>
              </div>
              <Progress
                value={leave.allocated > 0 ? (leave.used / leave.allocated) * 100 : 0}
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1.5">
                <span>Used: {leave.used}</span>
                <span>Total: {leave.allocated}</span>
              </div>
              {leave.carried > 0 && (
                <p className="text-xs text-teal-600 mt-1">+{leave.carried} carried forward</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue={isManager ? 'approvals' : 'recent'} className="space-y-4">
        <TabsList>
          {isManager && <TabsTrigger value="approvals">Pending Approvals ({pendingApprovals.length})</TabsTrigger>}
          <TabsTrigger value="recent">My Recent Requests</TabsTrigger>
        </TabsList>

        {isManager && (
          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users size={18} className="text-teal-600" />
                  Team Leave Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingApprovals.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">No pending approvals</p>
                ) : (
                  <div className="divide-y">
                    {pendingApprovals.map((leave) => (
                      <div key={leave.id} className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {leave.employee?.firstName} {leave.employee?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {leave.leaveType.name} &middot; {formatDate(leave.startDate)} - {formatDate(leave.endDate)} ({leave.days} days)
                          </p>
                          {leave.reason && <p className="text-xs text-gray-400 mt-0.5">{leave.reason}</p>}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 h-8"
                            onClick={async () => {
                              try {
                                await apiFetch(`/api/leave/${leave.id}/approve`, {
                                  method: 'PUT',
                                  token,
                                  body: JSON.stringify({}),
                                });
                                setPendingApprovals((prev) => prev.filter((l) => l.id !== leave.id));
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8"
                            onClick={async () => {
                              try {
                                await apiFetch(`/api/leave/${leave.id}/reject`, {
                                  method: 'PUT',
                                  token,
                                  body: JSON.stringify({}),
                                });
                                setPendingApprovals((prev) => prev.filter((l) => l.id !== leave.id));
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="recent">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays size={18} className="text-teal-600" />
                Recent Leave Requests
              </CardTitle>
              <Link href="/leave-attendance/history">
                <Button variant="ghost" size="sm" className="text-teal-600">
                  View All <ArrowRight size={14} className="ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentLeaves.length === 0 && !loading ? (
                <p className="text-sm text-gray-500 py-4 text-center">No leave requests found</p>
              ) : (
                <div className="divide-y">
                  {recentLeaves.map((leave) => {
                    const style = STATUS_STYLES[leave.status] || STATUS_STYLES.PENDING;
                    return (
                      <div key={leave.id} className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{leave.leaveType.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(leave.startDate)} - {formatDate(leave.endDate)} ({leave.days} days)
                          </p>
                        </div>
                        <Badge className={style.bg}>{leave.status}</Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
