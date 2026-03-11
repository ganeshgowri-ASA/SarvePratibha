'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, AlertCircle, ClipboardCheck, CheckCircle2, XCircle, GitBranch, Clock } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  addApproval,
  loadApprovals,
  saveApprovals,
  updateApprovalStep,
  buildRegularizationChain,
  generateId,
  formatTimestamp,
} from '@/lib/approval-store';
import type { ApprovalRequest } from '@/lib/approval-store';
import { ApprovalTimeline } from '@/components/approvals/approval-timeline';
import { ApprovalChainBadges } from '@/components/approvals/approval-timeline';

interface Regularization {
  id: string;
  date: string;
  reason: string;
  requestedStatus: string;
  status: string;
  remarks?: string;
  createdAt: string;
  employee?: { firstName: string; lastName: string; employeeId: string };
}

const STATUS_STYLES: Record<string, string> = {
  APPROVED: 'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  REJECTED: 'bg-red-100 text-red-700',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function RegularizePage() {
  const { data: session } = useSession();
  const [regularizations, setRegularizations] = useState<Regularization[]>([]);
  const [teamRegularizations, setTeamRegularizations] = useState<Regularization[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [requestedStatus, setRequestedStatus] = useState('PRESENT');
  const [punchIn, setPunchIn] = useState('');
  const [punchOut, setPunchOut] = useState('');

  // Approval workflow state
  const [regularizationApprovals, setRegularizationApprovals] = useState<ApprovalRequest[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [actionComment, setActionComment] = useState('');
  const [actingId, setActingId] = useState<string | null>(null);

  const token = (session?.user as any)?.accessToken;
  const userRole = (session?.user as any)?.role as string | undefined;
  const userName = (session?.user as any)?.name ?? 'Manager';
  const isManager = userRole === 'MANAGER' || userRole === 'SECTION_HEAD' || userRole === 'IT_ADMIN';

  useEffect(() => {
    if (!token) return;

    async function loadData() {
      try {
        const [ownRes] = await Promise.all([
          apiFetch<Regularization[]>('/api/attendance/regularizations', { token }),
        ]);
        setRegularizations(ownRes.data || []);

        if (isManager) {
          const teamRes = await apiFetch<Regularization[]>('/api/attendance/regularizations?team=true', { token });
          setTeamRegularizations((teamRes.data || []).filter((r) => r.status === 'PENDING'));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token, isManager]);

  useEffect(() => {
    const all = loadApprovals();
    setRegularizationApprovals(all.filter((r) => r.type === 'ATTENDANCE_REGULARIZATION'));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const res = await apiFetch<Regularization>('/api/attendance/regularize', {
        method: 'POST',
        token,
        body: JSON.stringify({ date, reason, requestedStatus, punchIn, punchOut }),
      });

      setSuccess('Regularization request submitted. Pending L1 Manager approval.');
      const newReg = res.data;

      if (newReg) {
        setRegularizations((prev) => [newReg, ...prev]);

        // Create approval workflow entry
        const approvalReq: ApprovalRequest = {
          id: generateId(),
          type: 'ATTENDANCE_REGULARIZATION',
          title: `Attendance Regularization — ${formatDate(date)}`,
          description: reason,
          requestedBy: 'self',
          requestedByName: userName,
          requestedAt: new Date().toISOString(),
          status: 'PENDING',
          steps: buildRegularizationChain(),
          metadata: {
            regularizationId: newReg.id,
            date,
            requestedStatus,
            punchIn: punchIn || '—',
            punchOut: punchOut || '—',
          },
        };
        addApproval(approvalReq);
        setRegularizationApprovals((prev) => [approvalReq, ...prev]);
      }

      setDate('');
      setReason('');
      setRequestedStatus('PRESENT');
      setPunchIn('');
      setPunchOut('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleApprove(reg: Regularization, comment?: string) {
    setActingId(reg.id);
    try {
      await apiFetch(`/api/attendance/regularize/${reg.id}/approve`, {
        method: 'PUT',
        token,
        body: JSON.stringify({ comment }),
      });
      setTeamRegularizations((prev) => prev.filter((r) => r.id !== reg.id));

      // Update approval store
      const all = loadApprovals();
      const req = all.find((r) => r.metadata?.regularizationId === reg.id);
      if (req) {
        const activeStep = req.steps.find((s) => s.status === 'PENDING');
        if (activeStep) {
          updateApprovalStep(req.id, activeStep.stepId, 'APPROVED', userName, comment);
        }
        setRegularizationApprovals(loadApprovals().filter((r) => r.type === 'ATTENDANCE_REGULARIZATION'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActingId(null);
      setActionComment('');
    }
  }

  async function handleReject(reg: Regularization, comment?: string) {
    setActingId(reg.id);
    try {
      await apiFetch(`/api/attendance/regularize/${reg.id}/reject`, {
        method: 'PUT',
        token,
        body: JSON.stringify({ comment }),
      });
      setTeamRegularizations((prev) => prev.filter((r) => r.id !== reg.id));

      const all = loadApprovals();
      const req = all.find((r) => r.metadata?.regularizationId === reg.id);
      if (req) {
        const activeStep = req.steps.find((s) => s.status === 'PENDING');
        if (activeStep) {
          updateApprovalStep(req.id, activeStep.stepId, 'REJECTED', userName, comment);
        }
        setRegularizationApprovals(loadApprovals().filter((r) => r.type === 'ATTENDANCE_REGULARIZATION'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActingId(null);
      setActionComment('');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/leave-attendance/attendance">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Regularization</h1>
          <p className="text-sm text-gray-500">Request corrections to your attendance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Apply Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardCheck size={18} className="text-teal-600" />
              New Regularization Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm mb-4 flex items-center gap-2">
                <CheckCircle2 size={14} /> {success}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm mb-4 flex items-center gap-2">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Requested Status *</Label>
                <Select value={requestedStatus} onValueChange={(value) => setRequestedStatus(value)}>
                  <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRESENT">Present</SelectItem>
                    <SelectItem value="HALF_DAY">Half Day</SelectItem>
                    <SelectItem value="WORK_FROM_HOME">Work From Home</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="punchIn">Actual Punch In</Label>
                  <Input type="time" id="punchIn" value={punchIn} onChange={(e) => setPunchIn(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="punchOut">Actual Punch Out</Label>
                  <Input type="time" id="punchOut" value={punchOut} onChange={(e) => setPunchOut(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason *</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why regularization is needed..."
                  required
                  maxLength={500}
                  rows={3}
                />
              </div>

              {/* Approval chain preview */}
              <div className="bg-gray-50 rounded-lg p-3 border">
                <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                  <GitBranch size={12} /> Approval Chain
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">You</span>
                  <span>→</span>
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <Clock size={10} /> L1 Manager
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700"
                disabled={submitting || !date || !reason}
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* My Requests with approval timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">My Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {regularizations.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">No regularization requests</p>
            ) : (
              <div className="divide-y max-h-[500px] overflow-y-auto">
                {regularizations.map((reg) => {
                  const approvalReq = regularizationApprovals.find((r) => r.metadata?.regularizationId === reg.id);
                  const isSelected = selectedApproval?.metadata?.regularizationId === reg.id;
                  return (
                    <div key={reg.id} className="py-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{formatDate(reg.date)}</p>
                        <Badge className={STATUS_STYLES[reg.status] || ''}>
                          {reg.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{reg.reason}</p>
                      <p className="text-xs text-gray-400">Requested: {reg.requestedStatus.replace('_', ' ')}</p>
                      {reg.remarks && <p className="text-xs text-blue-500">Remarks: {reg.remarks}</p>}

                      {approvalReq && (
                        <div>
                          <ApprovalChainBadges steps={approvalReq.steps} />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-xs text-teal-600 px-1 mt-1"
                            onClick={() => setSelectedApproval(isSelected ? null : approvalReq)}
                          >
                            <GitBranch size={12} className="mr-1" />
                            {isSelected ? 'Hide timeline' : 'Show timeline'}
                          </Button>
                          {isSelected && (
                            <div className="mt-2 bg-gray-50 rounded-lg p-3 border">
                              <ApprovalTimeline steps={approvalReq.steps} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Manager: Team Regularization Approvals */}
      {isManager && teamRegularizations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardCheck size={18} className="text-teal-600" />
              Team Regularization Requests
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {teamRegularizations.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamRegularizations.map((reg) => {
                const isActing = actingId === reg.id;
                const approvalReq = regularizationApprovals.find((r) => r.metadata?.regularizationId === reg.id);
                return (
                  <div key={reg.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {reg.employee?.firstName} {reg.employee?.lastName}
                          <span className="text-xs text-gray-400 ml-2">({reg.employee?.employeeId})</span>
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(reg.date)}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{reg.reason}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">
                        {reg.requestedStatus.replace('_', ' ')}
                      </Badge>
                    </div>

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
                        onChange={(e) => setActionComment(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 h-8 gap-1"
                          disabled={isActing}
                          onClick={() => handleApprove(reg, actionComment)}
                        >
                          <CheckCircle2 size={14} /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 gap-1"
                          disabled={isActing}
                          onClick={() => handleReject(reg, actionComment)}
                        >
                          <XCircle size={14} /> Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
