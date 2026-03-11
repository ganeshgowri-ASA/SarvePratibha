'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, GitBranch, CheckCircle2, XCircle, Users, IndianRupee, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  loadApprovals,
  saveApprovals,
  addApproval,
  updateApprovalStep,
  buildOvertimeChain,
  generateId,
  formatTimestamp,
} from '@/lib/approval-store';
import type { ApprovalRequest, ApprovalStatus } from '@/lib/approval-store';
import { ApprovalTimeline } from '@/components/approvals/approval-timeline';
import { ApprovalChainBadges } from '@/components/approvals/approval-timeline';

const APPROVAL_STATUS_STYLE: Record<ApprovalStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  APPROVED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
  ESCALATED: 'bg-orange-100 text-orange-700 border-orange-200',
};

const MY_OT_HISTORY = [
  { id: 'ot1', date: '2026-03-08', hours: 3, reason: 'Sprint release deployment', type: 'WEEKDAY', status: 'APPROVED', compensation: 'COMP_OFF' },
  { id: 'ot2', date: '2026-02-22', hours: 5, reason: 'Critical bug fix - prod issue', type: 'WEEKEND', status: 'APPROVED', compensation: 'CASH' },
  { id: 'ot3', date: '2026-02-10', hours: 2, reason: 'Client demo prep', type: 'WEEKDAY', status: 'PENDING', compensation: 'COMP_OFF' },
];

const TEAM_OT_PENDING = [
  { id: 'tot1', employee: 'Rahul Singh', empId: 'SP-ENG-006', date: '2026-03-14', hours: 4, reason: 'Server migration', type: 'WEEKEND', compensation: 'CASH' },
  { id: 'tot2', employee: 'Priya Nair', empId: 'SP-ENG-007', date: '2026-03-15', hours: 2, reason: 'Quarterly report', type: 'WEEKDAY', compensation: 'COMP_OFF' },
];

export default function OvertimePage() {
  const { data: session } = useSession();
  const userName = (session?.user as any)?.name ?? 'Employee';
  const userRole = (session?.user as any)?.role as string | undefined;
  const isManager = userRole === 'MANAGER' || userRole === 'SECTION_HEAD' || userRole === 'IT_ADMIN';

  const [date, setDate] = useState('');
  const [hours, setHours] = useState('');
  const [reason, setReason] = useState('');
  const [otType, setOtType] = useState('WEEKDAY');
  const [compensation, setCompensation] = useState('COMP_OFF');
  const [success, setSuccess] = useState('');

  const [otApprovals, setOtApprovals] = useState<ApprovalRequest[]>([]);
  const [teamApprovalMap, setTeamApprovalMap] = useState<Record<string, ApprovalRequest>>({});
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [actionComment, setActionComment] = useState('');

  useEffect(() => {
    const all = loadApprovals();
    const ot = all.filter((r) => r.type === 'OVERTIME');
    setOtApprovals(ot);

    let updated = false;
    const existingIds = new Set(ot.map((r) => r.metadata?.otId as string));
    TEAM_OT_PENDING.forEach((item) => {
      if (!existingIds.has(item.id)) {
        const req: ApprovalRequest = {
          id: generateId(),
          type: 'OVERTIME',
          title: `OT Request — ${item.date} (${item.hours}h, ${item.type.replace('_', ' ')})`,
          description: item.reason,
          requestedBy: item.empId,
          requestedByName: item.employee,
          requestedAt: new Date().toISOString(),
          status: 'PENDING',
          steps: buildOvertimeChain(),
          metadata: { otId: item.id, date: item.date, hours: item.hours, type: item.type, employee: item.employee, compensation: item.compensation },
        };
        all.unshift(req);
        updated = true;
      }
    });

    if (updated) {
      saveApprovals(all);
      const updatedOt = loadApprovals().filter((r) => r.type === 'OVERTIME');
      setOtApprovals(updatedOt);
      const map: Record<string, ApprovalRequest> = {};
      TEAM_OT_PENDING.forEach((item) => {
        const found = updatedOt.find((r) => r.metadata?.otId === item.id);
        if (found) map[item.id] = found;
      });
      setTeamApprovalMap(map);
    } else {
      const map: Record<string, ApprovalRequest> = {};
      TEAM_OT_PENDING.forEach((item) => {
        const found = ot.find((r) => r.metadata?.otId === item.id);
        if (found) map[item.id] = found;
      });
      setTeamApprovalMap(map);
    }
  }, []);

  function handleSubmit() {
    if (!date || !hours || !reason) return;

    const req: ApprovalRequest = {
      id: generateId(),
      type: 'OVERTIME',
      title: `OT Request — ${date} (${hours}h, ${otType.replace('_', ' ')})`,
      description: reason,
      requestedBy: 'self',
      requestedByName: userName,
      requestedAt: new Date().toISOString(),
      status: 'PENDING',
      steps: buildOvertimeChain(),
      metadata: { date, hours, type: otType, compensation, reason },
    };
    addApproval(req);
    setOtApprovals(loadApprovals().filter((r) => r.type === 'OVERTIME'));
    setSelectedApproval(req);
    setSuccess(`OT request for ${date} (${hours} hours) submitted. Pending L1 Manager & HR approval.`);
    setDate('');
    setHours('');
    setReason('');
  }

  function handleTeamAction(approvalId: string, stepId: string, action: 'APPROVED' | 'REJECTED') {
    updateApprovalStep(approvalId, stepId, action, userName, actionComment || undefined);
    const all = loadApprovals();
    setOtApprovals(all.filter((r) => r.type === 'OVERTIME'));
    const updated = all.find((r) => r.id === approvalId);
    const newMap = { ...teamApprovalMap };
    const key = Object.keys(newMap).find((k) => newMap[k].id === approvalId);
    if (key && updated) newMap[key] = updated;
    setTeamApprovalMap(newMap);
    setActionComment('');
  }

  const pendingTeam = Object.values(teamApprovalMap).filter((r) => r.status === 'PENDING');
  const myApprovals = otApprovals.filter((r) => r.requestedByName === userName);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Clock size={24} className="text-teal-600" />
          Overtime Requests
        </h1>
        <p className="text-sm text-gray-500">Request OT approval and track compensation</p>
      </div>

      <Tabs defaultValue="request" className="space-y-4">
        <TabsList>
          <TabsTrigger value="request">Apply OT</TabsTrigger>
          <TabsTrigger value="history">My History</TabsTrigger>
          {isManager && (
            <TabsTrigger value="team">
              Team Requests
              {pendingTeam.length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">{pendingTeam.length}</span>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="request">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock size={18} className="text-teal-600" />
                  New OT Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                    <CheckCircle2 size={14} /> {success}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="otDate">Date *</Label>
                    <Input type="date" id="otDate" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otHours">OT Hours *</Label>
                    <Input type="number" id="otHours" placeholder="e.g. 3" min="1" max="12" value={hours} onChange={(e) => setHours(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Day Type</Label>
                    <Select value={otType} onValueChange={setOtType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WEEKDAY">Weekday</SelectItem>
                        <SelectItem value="WEEKEND">Weekend</SelectItem>
                        <SelectItem value="HOLIDAY">Public Holiday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Compensation Type</Label>
                    <Select value={compensation} onValueChange={setCompensation}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COMP_OFF">Compensatory Off</SelectItem>
                        <SelectItem value="CASH">Cash Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otReason">Reason / Task Description *</Label>
                  <Textarea
                    id="otReason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Describe the work done during overtime..."
                    rows={3}
                  />
                </div>

                {/* Approval chain preview */}
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                    <GitBranch size={12} /> Approval Chain
                  </p>
                  <ApprovalChainBadges steps={buildOvertimeChain()} />
                  <p className="text-[10px] text-gray-400 mt-1">L1 Manager → HR approval required</p>
                </div>

                <Button
                  className="bg-teal-600 hover:bg-teal-700 w-full"
                  disabled={!date || !hours || !reason}
                  onClick={handleSubmit}
                >
                  Submit OT Request
                </Button>
              </CardContent>
            </Card>

            {selectedApproval ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <GitBranch size={16} className="text-teal-600" />
                    Approval Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-semibold mb-1">{selectedApproval.title}</p>
                  <Badge className={cn('border mb-3', APPROVAL_STATUS_STYLE[selectedApproval.status])}>
                    {selectedApproval.status}
                  </Badge>
                  <ApprovalTimeline steps={selectedApproval.steps} />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <IndianRupee size={16} className="text-teal-600" />
                    OT Compensation Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-gray-600 space-y-2">
                  <p>• <strong>Weekday OT:</strong> 1.5x hourly rate or 1 comp off day</p>
                  <p>• <strong>Weekend OT:</strong> 2x hourly rate or 1.5 comp off days</p>
                  <p>• <strong>Holiday OT:</strong> 3x hourly rate or 2 comp off days</p>
                  <p>• Maximum 4 hours OT per day, 20 hours per month</p>
                  <p>• Comp off must be availed within 60 days</p>
                  <p>• Cash compensation paid in the following month</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">OT History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...myApprovals, ...MY_OT_HISTORY.map((h) => ({
                  id: h.id,
                  title: `OT — ${h.date} (${h.hours}h, ${h.type.replace('_', ' ')})`,
                  description: h.reason,
                  status: h.status as ApprovalStatus,
                  metadata: { compensation: h.compensation },
                  steps: buildOvertimeChain().map((s) => ({ ...s, status: (h.status === 'APPROVED' ? 'APPROVED' : 'PENDING') as ApprovalStatus })),
                } as Partial<ApprovalRequest>)].slice(0, 10).map((req) => (
                  <div key={req.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{req.title}</p>
                        <p className="text-xs text-gray-500">{req.description}</p>
                        {req.metadata?.compensation && (
                          <p className="text-xs text-teal-600 font-medium mt-0.5">
                            Compensation: {String(req.metadata.compensation).replace('_', ' ')}
                          </p>
                        )}
                      </div>
                      <Badge className={cn('border text-xs', APPROVAL_STATUS_STYLE[req.status!])}>
                        {req.status}
                      </Badge>
                    </div>
                    {req.steps && <div className="mt-2"><ApprovalChainBadges steps={req.steps as any} /></div>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isManager && (
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users size={18} className="text-teal-600" />
                  Team OT Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {TEAM_OT_PENDING.map((item) => {
                    const approvalReq = teamApprovalMap[item.id];
                    const activeStep = approvalReq?.steps.find((s) => s.status === 'PENDING');
                    return (
                      <div key={item.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">{item.employee} <span className="text-xs text-gray-400 font-normal">({item.empId})</span></p>
                            <p className="text-xs text-gray-600">{item.date} &middot; {item.hours} hours &middot; {item.type.replace('_', ' ')}</p>
                            <p className="text-xs text-gray-400 italic mt-0.5">{item.reason}</p>
                            <p className="text-xs text-teal-600 font-medium">Compensation: {item.compensation.replace('_', ' ')}</p>
                          </div>
                          <Badge className={cn('border text-xs', approvalReq ? APPROVAL_STATUS_STYLE[approvalReq.status] : 'bg-yellow-100 text-yellow-700 border-yellow-200')}>
                            {approvalReq?.status || 'PENDING'}
                          </Badge>
                        </div>
                        {approvalReq && <ApprovalChainBadges steps={approvalReq.steps} />}
                        <div className="space-y-2">
                          <Textarea placeholder="Add comment..." rows={1} className="text-xs" value={actionComment} onChange={(e) => setActionComment(e.target.value)} />
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8 gap-1" disabled={!activeStep} onClick={() => approvalReq && activeStep && handleTeamAction(approvalReq.id, activeStep.stepId, 'APPROVED')}>
                              <CheckCircle2 size={14} /> Approve
                            </Button>
                            <Button size="sm" variant="destructive" className="h-8 gap-1" disabled={!activeStep} onClick={() => approvalReq && activeStep && handleTeamAction(approvalReq.id, activeStep.stepId, 'REJECTED')}>
                              <XCircle size={14} /> Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {TEAM_OT_PENDING.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-6">No pending OT requests</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
