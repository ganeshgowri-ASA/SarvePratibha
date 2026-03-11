'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Receipt,
  Plus,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  GitBranch,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  loadApprovals,
  saveApprovals,
  addApproval,
  updateApprovalStep,
  buildReimbursementChain,
  generateId,
  formatTimestamp,
} from '@/lib/approval-store';
import type { ApprovalRequest, ApprovalStatus } from '@/lib/approval-store';
import { ApprovalTimeline } from '@/components/approvals/approval-timeline';
import { ApprovalChainBadges } from '@/components/approvals/approval-timeline';

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  SUBMITTED: 'bg-blue-100 text-blue-700',
  MANAGER_APPROVED: 'bg-yellow-100 text-yellow-700',
  FINANCE_APPROVED: 'bg-teal-100 text-teal-700',
  PAID: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

const APPROVAL_STATUS_STYLE: Record<ApprovalStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  APPROVED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
  ESCALATED: 'bg-orange-100 text-orange-700 border-orange-200',
};

const MY_CLAIMS = [
  { id: '1', category: 'Travel', amount: 4500, date: '5 Mar 2026', description: 'Client visit - Pune', status: 'SUBMITTED', receipt: true },
  { id: '2', category: 'Medical', amount: 2200, date: '28 Feb 2026', description: 'Health checkup', status: 'MANAGER_APPROVED', receipt: true },
  { id: '3', category: 'Food', amount: 1800, date: '20 Feb 2026', description: 'Team lunch - project milestone', status: 'PAID', receipt: true },
  { id: '4', category: 'Travel', amount: 6000, date: '10 Feb 2026', description: 'Client visit - Delhi', status: 'PAID', receipt: true },
  { id: '5', category: 'Communication', amount: 500, date: '5 Feb 2026', description: 'Mobile recharge', status: 'REJECTED', receipt: false },
  { id: '6', category: 'Medical', amount: 3500, date: '15 Jan 2026', description: 'Dental treatment', status: 'PAID', receipt: true },
  { id: '7', category: 'Equipment', amount: 12500, date: '1 Mar 2026', description: 'Ergonomic keyboard & mouse', status: 'SUBMITTED', receipt: true },
];

const PENDING_APPROVALS = [
  { id: '101', employee: 'Amit Verma', empId: 'SP-ENG-004', category: 'Travel', amount: 8500, date: '7 Mar 2026', description: 'Conference travel', department: 'Engineering' },
  { id: '102', employee: 'Sneha Gupta', empId: 'SP-ENG-005', category: 'Medical', amount: 4200, date: '5 Mar 2026', description: 'Eye checkup + glasses', department: 'Engineering' },
  { id: '103', employee: 'Rahul Singh', empId: 'SP-ENG-006', category: 'Food', amount: 2100, date: '3 Mar 2026', description: 'Working dinner - release prep', department: 'Engineering' },
  { id: '104', employee: 'Priya Nair', empId: 'SP-ENG-007', category: 'Equipment', amount: 15000, date: '1 Mar 2026', description: 'Standing desk attachment', department: 'Engineering' },
];

function formatCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

const SUMMARY = {
  total: MY_CLAIMS.reduce((sum, c) => sum + c.amount, 0),
  pending: MY_CLAIMS.filter((c) => ['SUBMITTED', 'MANAGER_APPROVED'].includes(c.status)).reduce((sum, c) => sum + c.amount, 0),
  approved: MY_CLAIMS.filter((c) => c.status === 'PAID').reduce((sum, c) => sum + c.amount, 0),
  rejected: MY_CLAIMS.filter((c) => c.status === 'REJECTED').reduce((sum, c) => sum + c.amount, 0),
};

export default function ReimbursementsPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState('my-claims');
  const [reimbApprovals, setReimbApprovals] = useState<ApprovalRequest[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [actionComment, setActionComment] = useState('');
  const [approvalStatuses, setApprovalStatuses] = useState<Record<string, ApprovalStatus>>({});

  const userRole = (session?.user as any)?.role as string | undefined;
  const userName = (session?.user as any)?.name ?? 'Manager';

  useEffect(() => {
    const all = loadApprovals();
    const reimb = all.filter((r) => r.type === 'REIMBURSEMENT');
    setReimbApprovals(reimb);

    // Seed approval workflows for existing claims that don't have one yet
    let updated = false;
    const allById = new Set(reimb.map((r) => r.metadata?.claimId as string));
    MY_CLAIMS.filter((c) => c.status === 'SUBMITTED' || c.status === 'MANAGER_APPROVED').forEach((claim) => {
      if (!allById.has(claim.id)) {
        const req: ApprovalRequest = {
          id: generateId(),
          type: 'REIMBURSEMENT',
          title: `${claim.category} — ${claim.description}`,
          description: `${claim.category} expense claim for ${formatCurrency(claim.amount)}`,
          requestedBy: 'emp-self',
          requestedByName: 'Me',
          requestedAt: new Date(claim.date).toISOString(),
          status: claim.amount > 10000 ? 'PENDING' : 'PENDING',
          steps: buildReimbursementChain(claim.amount),
          metadata: {
            claimId: claim.id,
            category: claim.category,
            amount: claim.amount,
            date: claim.date,
          },
        };
        all.unshift(req);
        updated = true;
      }
    });
    if (updated) {
      saveApprovals(all);
      setReimbApprovals(all.filter((r) => r.type === 'REIMBURSEMENT'));
    }
  }, []);

  function getApprovalForClaim(claimId: string): ApprovalRequest | undefined {
    return reimbApprovals.find((r) => r.metadata?.claimId === claimId);
  }

  function handleManagerAction(approvalId: string, claimEmployee: string, stepId: string, action: 'APPROVED' | 'REJECTED') {
    updateApprovalStep(approvalId, stepId, action, userName, actionComment || undefined);
    const all = loadApprovals();
    setReimbApprovals(all.filter((r) => r.type === 'REIMBURSEMENT'));
    const updated = all.find((r) => r.id === approvalId);
    if (updated) setSelectedApproval(updated);
    setActionComment('');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/payroll">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reimbursements</h1>
            <p className="text-sm text-gray-500">Submit and track expense claims</p>
          </div>
        </div>
        <Link href="/payroll/reimbursements/submit">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus size={16} className="mr-2" /> New Claim
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <IndianRupee size={16} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Total Claims</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(SUMMARY.total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-yellow-500" />
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-lg font-bold text-yellow-700">{formatCurrency(SUMMARY.pending)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Approved/Paid</p>
                <p className="text-lg font-bold text-green-700">{formatCurrency(SUMMARY.approved)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <XCircle size={16} className="text-red-500" />
              <div>
                <p className="text-xs text-gray-500">Rejected</p>
                <p className="text-lg font-bold text-red-700">{formatCurrency(SUMMARY.rejected)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="my-claims" onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="my-claims">My Claims</TabsTrigger>
          <TabsTrigger value="approvals">Pending Approvals ({PENDING_APPROVALS.length})</TabsTrigger>
          <TabsTrigger value="workflow">Approval Workflows</TabsTrigger>
        </TabsList>

        {/* My Claims */}
        <TabsContent value="my-claims">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt size={18} className="text-teal-600" />
                Claims History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MY_CLAIMS.map((claim) => {
                  const approvalReq = getApprovalForClaim(claim.id);
                  const isHighValue = claim.amount > 10000;
                  return (
                    <div key={claim.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-gray-900">{claim.category}</p>
                            {isHighValue && (
                              <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded border border-orange-200 font-medium">
                                High Value &gt;₹10k
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">{claim.description}</p>
                          <p className="text-xs text-gray-400">{claim.date}</p>
                          {approvalReq && (
                            <div className="mt-1.5">
                              <ApprovalChainBadges steps={approvalReq.steps} />
                            </div>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-base font-bold text-gray-900">{formatCurrency(claim.amount)}</p>
                          <Badge className={cn('mt-1', STATUS_STYLES[claim.status] || '')}>
                            {claim.status.replace(/_/g, ' ')}
                          </Badge>
                          <div className="flex items-center gap-1 mt-1">
                            {claim.receipt ? (
                              <Badge className="bg-green-50 text-green-700 text-[10px]">Receipt ✓</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-500 text-[10px]">No Receipt</Badge>
                            )}
                          </div>
                          {approvalReq && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 text-xs text-teal-600 mt-1"
                              onClick={() => setSelectedApproval(selectedApproval?.id === approvalReq.id ? null : approvalReq)}
                            >
                              <GitBranch size={12} className="mr-1" />
                              {selectedApproval?.id === approvalReq.id ? 'Hide' : 'Timeline'}
                            </Button>
                          )}
                        </div>
                      </div>
                      {selectedApproval?.id === approvalReq?.id && approvalReq && (
                        <div className="mt-3 pt-3 border-t">
                          <ApprovalTimeline steps={approvalReq.steps} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Approvals (Manager View) */}
        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock size={18} className="text-yellow-600" />
                Pending Approvals ({PENDING_APPROVALS.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {PENDING_APPROVALS.map((item) => {
                  // Create approval workflow if not exists
                  const approvalReq = reimbApprovals.find((r) => r.metadata?.claimId === item.id) || (() => {
                    const req: ApprovalRequest = {
                      id: generateId(),
                      type: 'REIMBURSEMENT',
                      title: `${item.category} — ${item.description}`,
                      description: `${item.category} expense by ${item.employee}`,
                      requestedBy: item.empId,
                      requestedByName: item.employee,
                      requestedAt: new Date(item.date).toISOString(),
                      status: 'PENDING',
                      steps: buildReimbursementChain(item.amount),
                      metadata: { claimId: item.id, category: item.category, amount: item.amount, employee: item.employee },
                    };
                    return req;
                  })();

                  const activeStep = approvalReq.steps.find((s) => s.status === 'PENDING');
                  const isSelected = selectedApproval?.metadata?.claimId === item.id;

                  return (
                    <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="text-sm font-semibold text-gray-900">{item.employee}</p>
                            <span className="text-xs text-gray-400">({item.empId})</span>
                            <Badge variant="outline" className="text-xs">{item.department}</Badge>
                            {item.amount > 10000 && (
                              <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded border border-orange-200 font-medium">
                                &gt;₹10k — L2 needed
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{item.category} — {item.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                          <div className="mt-2">
                            <ApprovalChainBadges steps={approvalReq.steps} />
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                          <Badge className={cn('mt-1', APPROVAL_STATUS_STYLE[approvalReq.status])}>
                            {approvalReq.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t space-y-3">
                        <Textarea
                          placeholder="Add comment before approving/rejecting..."
                          rows={2}
                          className="text-xs"
                          value={actionComment}
                          onChange={(e) => setActionComment(e.target.value)}
                        />
                        <div className="flex items-center gap-2 flex-wrap">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 h-8 gap-1"
                            onClick={() => activeStep && handleManagerAction(approvalReq.id, item.employee, activeStep.stepId, 'APPROVED')}
                            disabled={!activeStep || approvalReq.status !== 'PENDING'}
                          >
                            <CheckCircle2 size={14} /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 gap-1"
                            onClick={() => activeStep && handleManagerAction(approvalReq.id, item.employee, activeStep.stepId, 'REJECTED')}
                            disabled={!activeStep || approvalReq.status !== 'PENDING'}
                          >
                            <XCircle size={14} /> Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1 text-teal-600 border-teal-200"
                            onClick={() => setSelectedApproval(isSelected ? null : approvalReq)}
                          >
                            <GitBranch size={14} /> {isSelected ? 'Hide Timeline' : 'View Timeline'}
                          </Button>
                        </div>
                        {isSelected && selectedApproval && (
                          <div className="bg-gray-50 rounded-lg p-3 border">
                            <ApprovalTimeline steps={selectedApproval.steps} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approval Workflows tab */}
        <TabsContent value="workflow">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GitBranch size={18} className="text-teal-600" />
                Reimbursement Approval Workflows
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reimbApprovals.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">
                  No approval workflows yet. Submit a claim to start tracking.
                </p>
              ) : (
                <div className="space-y-4">
                  {reimbApprovals.map((req) => (
                    <div key={req.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{req.title}</p>
                          <p className="text-xs text-gray-400">
                            {req.requestedByName} &middot; {formatTimestamp(req.requestedAt)}
                          </p>
                          {req.metadata?.amount && (
                            <p className="text-xs text-gray-600 font-medium mt-0.5">
                              {formatCurrency(Number(req.metadata.amount))}
                            </p>
                          )}
                        </div>
                        <Badge className={cn('border text-xs', APPROVAL_STATUS_STYLE[req.status])}>
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
