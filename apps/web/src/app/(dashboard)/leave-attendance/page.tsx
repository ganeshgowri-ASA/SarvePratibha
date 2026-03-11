'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
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
  MessageSquare,
  GitBranch,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  addApproval,
  loadApprovals,
  saveApprovals,
  updateApprovalStep,
  buildLeaveChain,
  generateId,
  formatTimestamp,
} from '@/lib/approval-store';
import type { ApprovalRequest } from '@/lib/approval-store';
import { ApprovalTimeline } from '@/components/approvals/approval-timeline';
import { ApprovalChainBadges } from '@/components/approvals/approval-timeline';

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
  ESCALATED: { bg: 'bg-orange-100 text-orange-700' },
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

  // Approval workflow state
  const [leaveApprovals, setLeaveApprovals] = useState<ApprovalRequest[]>([]);
  const [selectedLeave, setSelectedLeave] = useState<ApprovalRequest | null>(null);
  const [approveComment, setApproveComment] = useState('');
  const [actingId, setActingId] = useState<string | null>(null);

  const token = (session?.user as any)?.accessToken;
  const employeeId = (session?.user as any)?.employeeId;
  const userRole = (session?.user as any)?.role as string | undefined;
  const userName = (session?.user as any)?.name ?? 'Manager';
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

  // Load leave approval workflow requests from localStorage
  useEffect(() => {
    const all = loadApprovals();
    setLeaveApprovals(all.filter((r) => r.type === 'LEAVE'));
  }, []);

  function createLeaveApprovalRequest(leave: LeaveRequest) {
    const existing = leaveApprovals.find((r) => r.metadata?.leaveId === leave.id);
    if (existing) {
      setSelectedLeave(existing);
      return;
    }
    const req: ApprovalRequest = {
      id: generateId(),
      type: 'LEAVE',
      title: `${leave.leaveType.name} — ${formatDate(leave.startDate)} to ${formatDate(leave.endDate)} (${leave.days} days)`,
      description: leave.reason,
      requestedBy: employeeId || 'emp',
      requestedByName: `${leave.employee?.firstName ?? 'Employee'} ${leave.employee?.lastName ?? ''}`.trim(),
      requestedAt: leave.createdAt || new Date().toISOString(),
      status: leave.status === 'APPROVED' ? 'APPROVED' : leave.status === 'REJECTED' ? 'REJECTED' : 'PENDING',
      steps: buildLeaveChain(leave.days),
      metadata: { leaveId: leave.id, leaveType: leave.leaveType.name, days: leave.days },
    };
    addApproval(req);
    setLeaveApprovals((prev) => [req, ...prev]);
    setSelectedLeave(req);
  }

  async function handleApprove(leave: LeaveRequest, comment?: string) {
    setActingId(leave.id);
    try {
      await apiFetch(`/api/leave/${leave.id}/approve`, {
        method: 'PUT',
        token,
        body: JSON.stringify({ comment }),
      });
      setPendingApprovals((prev) => prev.filter((l) => l.id !== leave.id));

      // Update approval workflow store
      const all = loadApprovals();
      const req = all.find((r) => r.metadata?.leaveId === leave.id);
      if (req) {
        const activeStep = req.steps.find((s) => s.status === 'PENDING');
        if (activeStep) {
          updateApprovalStep(req.id, activeStep.stepId, 'APPROVED', userName, comment);
        }
        setLeaveApprovals(loadApprovals().filter((r) => r.type === 'LEAVE'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActingId(null);
      setApproveComment('');
    }
  }

  async function handleReject(leave: LeaveRequest, comment?: string) {
    setActingId(leave.id);
    try {
      await apiFetch(`/api/leave/${leave.id}/reject`, {
        method: 'PUT',
        token,
        body: JSON.stringify({ comment }),
      });
      setPendingApprovals((prev) => prev.filter((l) => l.id !== leave.id));

      const all = loadApprovals();
      const req = all.find((r) => r.metadata?.leaveId === leave.id);
      if (req) {
        const activeStep = req.steps.find((s) => s.status === 'PENDING');
        if (activeStep) {
          updateApprovalStep(req.id, activeStep.stepId, 'REJECTED', userName, comment);
        }
        setLeaveApprovals(loadApprovals().filter((r) => r.type === 'LEAVE'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActingId(null);
      setApproveComment('');
    }
  }

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
          {isManager && (
            <TabsTrigger value="approvals">
              Pending Approvals
              {pendingApprovals.length > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {pendingApprovals.length}
                </span>
              )}
            </TabsTrigger>
          )}
          <TabsTrigger value="recent">My Recent Requests</TabsTrigger>
          <TabsTrigger value="timeline">Approval Timeline</TabsTrigger>
        </TabsList>

        {/* Manager: Pending Approvals with workflow */}
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
                  <div className="space-y-4">
                    {pendingApprovals.map((leave) => {
                      const isActing = actingId === leave.id;
                      const approvalReq = leaveApprovals.find((r) => r.metadata?.leaveId === leave.id);
                      return (
                        <div key={leave.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {leave.employee?.firstName} {leave.employee?.lastName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {leave.leaveType.name} &middot; {formatDate(leave.startDate)} – {formatDate(leave.endDate)} ({leave.days} days)
                              </p>
                              {leave.reason && <p className="text-xs text-gray-400 mt-0.5 italic">{leave.reason}</p>}
                            </div>
                            <Badge className={cn(STATUS_STYLES[leave.status]?.bg || 'bg-gray-100')}>
                              {leave.status}
                            </Badge>
                          </div>

                          {/* Approval chain badges */}
                          {approvalReq && (
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Approval chain:</p>
                              <ApprovalChainBadges steps={approvalReq.steps} />
                            </div>
                          )}

                          <div className="space-y-2">
                            <Textarea
                              placeholder="Add comment (optional)..."
                              rows={2}
                              className="text-xs"
                              id={`comment-${leave.id}`}
                              onChange={(e) => setApproveComment(e.target.value)}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 h-8 gap-1"
                                disabled={isActing}
                                onClick={() => handleApprove(leave, approveComment)}
                              >
                                <CheckCircle2 size={14} /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-8 gap-1"
                                disabled={isActing}
                                onClick={() => handleReject(leave, approveComment)}
                              >
                                <XCircle size={14} /> Reject
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1 text-teal-600 border-teal-200"
                                onClick={() => createLeaveApprovalRequest(leave)}
                              >
                                <GitBranch size={14} /> Timeline
                              </Button>
                            </div>
                          </div>

                          {/* Inline timeline when selected */}
                          {selectedLeave && selectedLeave.metadata?.leaveId === leave.id && (
                            <div className="border-t pt-3">
                              <p className="text-xs font-semibold text-gray-600 mb-2">Approval Timeline:</p>
                              <ApprovalTimeline steps={selectedLeave.steps} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Recent Requests */}
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
                    const approvalReq = leaveApprovals.find((r) => r.metadata?.leaveId === leave.id);
                    return (
                      <div key={leave.id} className="py-3 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{leave.leaveType.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatDate(leave.startDate)} – {formatDate(leave.endDate)} ({leave.days} days)
                            </p>
                          </div>
                          <Badge className={style.bg}>{leave.status}</Badge>
                        </div>
                        {approvalReq && (
                          <ApprovalChainBadges steps={approvalReq.steps} />
                        )}
                        {!approvalReq && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-xs text-teal-600 px-1"
                            onClick={() => createLeaveApprovalRequest(leave)}
                          >
                            <GitBranch size={12} className="mr-1" /> Track approval
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approval Timeline tab */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GitBranch size={18} className="text-teal-600" />
                Leave Approval History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leaveApprovals.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">
                  No approval workflows tracked yet. Apply for leave or click &quot;Track approval&quot; on a request.
                </p>
              ) : (
                <div className="space-y-4">
                  {leaveApprovals.slice(0, 10).map((req) => (
                    <div key={req.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{req.title}</p>
                          <p className="text-xs text-gray-400">{req.requestedByName} &middot; {formatTimestamp(req.requestedAt)}</p>
                        </div>
                        <Badge className={cn(STATUS_STYLES[req.status]?.bg || 'bg-gray-100')}>
                          {req.status}
                        </Badge>
                      </div>
                      <ApprovalTimeline steps={req.steps} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
