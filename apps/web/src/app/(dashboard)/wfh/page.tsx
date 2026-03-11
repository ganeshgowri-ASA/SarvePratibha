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
import { Briefcase, GitBranch, CheckCircle2, XCircle, Clock, Users, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  loadApprovals,
  saveApprovals,
  addApproval,
  updateApprovalStep,
  buildWFHChain,
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

// Simulated existing WFH requests
const MY_WFH_HISTORY = [
  { id: 'wfh1', date: '2026-03-05', reason: 'Home renovation', status: 'APPROVED', type: 'FULL_DAY' },
  { id: 'wfh2', date: '2026-02-20', reason: 'Child school event', status: 'APPROVED', type: 'FULL_DAY' },
  { id: 'wfh3', date: '2026-02-12', reason: 'Internet issue at office area', status: 'REJECTED', type: 'FULL_DAY' },
];

// Simulated team WFH requests (for managers)
const TEAM_WFH_PENDING = [
  { id: 'twfh1', employee: 'Amit Verma', empId: 'SP-ENG-004', date: '2026-03-15', reason: 'Personal work', type: 'FULL_DAY', requestedAt: '2026-03-10T09:00:00Z' },
  { id: 'twfh2', employee: 'Sneha Gupta', empId: 'SP-ENG-005', date: '2026-03-18', reason: 'Doctor appointment in morning', type: 'HALF_DAY', requestedAt: '2026-03-11T10:00:00Z' },
];

export default function WFHPage() {
  const { data: session } = useSession();
  const userName = (session?.user as any)?.name ?? 'Employee';
  const userRole = (session?.user as any)?.role as string | undefined;
  const isManager = userRole === 'MANAGER' || userRole === 'SECTION_HEAD' || userRole === 'IT_ADMIN';

  const [date, setDate] = useState('');
  const [type, setType] = useState('FULL_DAY');
  const [reason, setReason] = useState('');
  const [wfhApprovals, setWfhApprovals] = useState<ApprovalRequest[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [actionComment, setActionComment] = useState('');
  const [teamApprovalMap, setTeamApprovalMap] = useState<Record<string, ApprovalRequest>>({});
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const all = loadApprovals();
    const wfh = all.filter((r) => r.type === 'WORK_FROM_HOME');
    setWfhApprovals(wfh);

    // Create approval requests for team pending items
    let updated = false;
    const existingIds = new Set(wfh.map((r) => r.metadata?.wfhId as string));
    TEAM_WFH_PENDING.forEach((item) => {
      if (!existingIds.has(item.id)) {
        const req: ApprovalRequest = {
          id: generateId(),
          type: 'WORK_FROM_HOME',
          title: `WFH Request — ${item.date} (${item.type.replace('_', ' ')})`,
          description: item.reason,
          requestedBy: item.empId,
          requestedByName: item.employee,
          requestedAt: item.requestedAt,
          status: 'PENDING',
          steps: buildWFHChain(),
          metadata: { wfhId: item.id, date: item.date, type: item.type, employee: item.employee },
        };
        all.unshift(req);
        updated = true;
      }
    });
    if (updated) {
      saveApprovals(all);
      const updatedWfh = loadApprovals().filter((r) => r.type === 'WORK_FROM_HOME');
      setWfhApprovals(updatedWfh);
      const map: Record<string, ApprovalRequest> = {};
      TEAM_WFH_PENDING.forEach((item) => {
        const found = updatedWfh.find((r) => r.metadata?.wfhId === item.id);
        if (found) map[item.id] = found;
      });
      setTeamApprovalMap(map);
    } else {
      const map: Record<string, ApprovalRequest> = {};
      TEAM_WFH_PENDING.forEach((item) => {
        const found = wfh.find((r) => r.metadata?.wfhId === item.id);
        if (found) map[item.id] = found;
      });
      setTeamApprovalMap(map);
    }
  }, []);

  function handleSubmit() {
    if (!date || !reason) return;

    const req: ApprovalRequest = {
      id: generateId(),
      type: 'WORK_FROM_HOME',
      title: `WFH — ${date} (${type.replace('_', ' ')})`,
      description: reason,
      requestedBy: 'self',
      requestedByName: userName,
      requestedAt: new Date().toISOString(),
      status: 'PENDING',
      steps: buildWFHChain(),
      metadata: { date, type, reason },
    };
    addApproval(req);
    const all = loadApprovals();
    setWfhApprovals(all.filter((r) => r.type === 'WORK_FROM_HOME'));
    setSelectedApproval(req);
    setSuccess(`WFH request for ${date} submitted for manager approval.`);
    setDate('');
    setReason('');
  }

  function handleTeamAction(approvalId: string, stepId: string, action: 'APPROVED' | 'REJECTED') {
    updateApprovalStep(approvalId, stepId, action, userName, actionComment || undefined);
    const all = loadApprovals();
    setWfhApprovals(all.filter((r) => r.type === 'WORK_FROM_HOME'));
    const updated = all.find((r) => r.id === approvalId);
    const newMap = { ...teamApprovalMap };
    const key = Object.keys(newMap).find((k) => newMap[k].id === approvalId);
    if (key && updated) newMap[key] = updated;
    setTeamApprovalMap(newMap);
    setActionComment('');
  }

  const myWfhApprovals = wfhApprovals.filter((r) => r.requestedByName === userName);
  const pendingTeam = wfhApprovals.filter((r) => r.status === 'PENDING' && r.metadata?.employee);

  const wfhHistoryItems: Partial<ApprovalRequest>[] = [
    ...myWfhApprovals,
    ...MY_WFH_HISTORY.map((h) => ({
      id: h.id,
      title: `WFH — ${h.date} (${h.type.replace('_', ' ')})`,
      description: h.reason,
      status: h.status as ApprovalStatus,
      requestedAt: new Date(h.date).toISOString(),
      steps: buildWFHChain().map((s) => ({
        ...s,
        status: (h.status === 'APPROVED' ? 'APPROVED' : h.status === 'REJECTED' ? 'REJECTED' : 'PENDING') as ApprovalStatus,
      })),
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Briefcase size={24} className="text-teal-600" />
          Work From Home
        </h1>
        <p className="text-sm text-gray-500">Request and manage WFH approvals</p>
      </div>

      <Tabs defaultValue="request" className="space-y-4">
        <TabsList>
          <TabsTrigger value="request">Apply WFH</TabsTrigger>
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

        {/* Apply WFH */}
        <TabsContent value="request">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase size={18} className="text-teal-600" />
                  New WFH Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                    <CheckCircle2 size={14} /> {success}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="wfhDate">Date *</Label>
                  <Input
                    type="date"
                    id="wfhDate"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL_DAY">Full Day</SelectItem>
                      <SelectItem value="HALF_DAY">Half Day (AM)</SelectItem>
                      <SelectItem value="HALF_DAY_PM">Half Day (PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wfhReason">Reason *</Label>
                  <Textarea
                    id="wfhReason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Why do you need to work from home?"
                    rows={3}
                    required
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
                  <p className="text-[10px] text-gray-400 mt-1">Approval SLA: 24 hours</p>
                </div>

                <Button
                  className="bg-teal-600 hover:bg-teal-700 w-full"
                  disabled={!date || !reason}
                  onClick={handleSubmit}
                >
                  Submit WFH Request
                </Button>
              </CardContent>
            </Card>

            {/* Selected approval timeline */}
            {selectedApproval && (
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
                  <div className="mt-3">
                    <Link href="/approvals">
                      <Button variant="outline" size="sm" className="w-full gap-1 text-teal-600">
                        <GitBranch size={14} /> View in Approvals Center
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* WFH Policy */}
            {!selectedApproval && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertCircle size={16} className="text-teal-600" />
                    WFH Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-gray-600 space-y-2">
                  <p>• Maximum 2 WFH days per week allowed</p>
                  <p>• Must be approved by L1 Manager at least 24 hours in advance</p>
                  <p>• Not applicable on days with mandatory office presence</p>
                  <p>• WFH requests cannot be submitted for past dates</p>
                  <p>• In case of emergency, contact HR directly</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* My WFH History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock size={18} className="text-teal-600" />
                WFH History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {wfhHistoryItems.slice(0, 10).map((req, index) => (
                  <div key={req.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{req.title}</p>
                        <p className="text-xs text-gray-500">{req.description}</p>
                      </div>
                      <Badge className={cn('border text-xs', APPROVAL_STATUS_STYLE[req.status!])}>
                        {req.status}
                      </Badge>
                    </div>
                    {req.steps && (
                      <div className="mt-2">
                        <ApprovalChainBadges steps={req.steps as any} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team WFH (Manager) */}
        {isManager && (
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users size={18} className="text-teal-600" />
                  Team WFH Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {TEAM_WFH_PENDING.map((item) => {
                    const approvalReq = teamApprovalMap[item.id];
                    const activeStep = approvalReq?.steps.find((s) => s.status === 'PENDING');
                    const isExpanded = selectedApproval?.id === approvalReq?.id;

                    return (
                      <div key={item.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{item.employee}</p>
                            <p className="text-xs text-gray-500">{item.empId}</p>
                            <p className="text-xs text-gray-600 mt-0.5">
                              {item.date} &middot; {item.type.replace('_', ' ')}
                            </p>
                            <p className="text-xs text-gray-400 italic">{item.reason}</p>
                          </div>
                          <Badge className={cn('border text-xs', approvalReq ? APPROVAL_STATUS_STYLE[approvalReq.status] : 'bg-yellow-100 text-yellow-700 border-yellow-200')}>
                            {approvalReq?.status || 'PENDING'}
                          </Badge>
                        </div>

                        {approvalReq && <ApprovalChainBadges steps={approvalReq.steps} />}

                        <div className="space-y-2">
                          <Textarea
                            placeholder="Add comment..."
                            rows={2}
                            className="text-xs"
                            value={actionComment}
                            onChange={(e) => setActionComment(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 h-8 gap-1"
                              disabled={!activeStep || approvalReq?.status !== 'PENDING'}
                              onClick={() => approvalReq && activeStep && handleTeamAction(approvalReq.id, activeStep.stepId, 'APPROVED')}
                            >
                              <CheckCircle2 size={14} /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 gap-1"
                              disabled={!activeStep || approvalReq?.status !== 'PENDING'}
                              onClick={() => approvalReq && activeStep && handleTeamAction(approvalReq.id, activeStep.stepId, 'REJECTED')}
                            >
                              <XCircle size={14} /> Reject
                            </Button>
                            {approvalReq && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1 text-teal-600 border-teal-200"
                                onClick={() => setSelectedApproval(isExpanded ? null : approvalReq)}
                              >
                                <GitBranch size={14} /> {isExpanded ? 'Hide' : 'Timeline'}
                              </Button>
                            )}
                          </div>
                        </div>

                        {isExpanded && approvalReq && (
                          <div className="border-t pt-3">
                            <ApprovalTimeline steps={approvalReq.steps} />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {TEAM_WFH_PENDING.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-6">No pending WFH requests</p>
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
