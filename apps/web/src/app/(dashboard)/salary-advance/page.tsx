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
import {
  IndianRupee, GitBranch, CheckCircle2, XCircle, Clock, Users, AlertCircle, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  loadApprovals,
  saveApprovals,
  addApproval,
  updateApprovalStep,
  buildSalaryAdvanceChain,
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

const MY_ADVANCE_HISTORY = [
  { id: 'sa1', amount: 25000, reason: 'Medical emergency', repayMonths: 3, status: 'APPROVED', requestedAt: '2025-11-10T09:00:00Z' },
  { id: 'sa2', amount: 15000, reason: 'Home repair', repayMonths: 2, status: 'REJECTED', requestedAt: '2025-08-05T09:00:00Z' },
];

function formatCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

export default function SalaryAdvancePage() {
  const { data: session } = useSession();
  const userName = (session?.user as any)?.name ?? 'Employee';
  const userRole = (session?.user as any)?.role as string | undefined;
  const isManager = userRole === 'MANAGER' || userRole === 'SECTION_HEAD' || userRole === 'IT_ADMIN';

  const [amount, setAmount] = useState('');
  const [repayMonths, setRepayMonths] = useState('3');
  const [reason, setReason] = useState('');
  const [category, setCategory] = useState('MEDICAL');
  const [success, setSuccess] = useState('');

  const [advanceApprovals, setAdvanceApprovals] = useState<ApprovalRequest[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [actionComment, setActionComment] = useState('');

  useEffect(() => {
    const all = loadApprovals();
    setAdvanceApprovals(all.filter((r) => r.type === 'SALARY_ADVANCE'));
  }, []);

  function handleSubmit() {
    if (!amount || !reason || parseFloat(amount) <= 0) return;
    const numAmount = parseFloat(amount);

    const req: ApprovalRequest = {
      id: generateId(),
      type: 'SALARY_ADVANCE',
      title: `Salary Advance — ${formatCurrency(numAmount)} (${repayMonths} months)`,
      description: `${category.replace('_', ' ')}: ${reason}`,
      requestedBy: 'self',
      requestedByName: userName,
      requestedAt: new Date().toISOString(),
      status: 'PENDING',
      steps: buildSalaryAdvanceChain(),
      metadata: {
        amount: numAmount,
        repayMonths,
        category,
        reason,
        monthlyDeduction: Math.ceil(numAmount / parseInt(repayMonths)),
      },
    };
    addApproval(req);
    const all = loadApprovals();
    setAdvanceApprovals(all.filter((r) => r.type === 'SALARY_ADVANCE'));
    setSelectedApproval(req);
    setSuccess(`Salary advance request of ${formatCurrency(numAmount)} submitted. Pending L1 Manager → Finance → HR Head approval.`);
    setAmount('');
    setReason('');
  }

  function handleManagerAction(approvalId: string, stepId: string, action: 'APPROVED' | 'REJECTED') {
    updateApprovalStep(approvalId, stepId, action, userName, actionComment || undefined);
    const all = loadApprovals();
    setAdvanceApprovals(all.filter((r) => r.type === 'SALARY_ADVANCE'));
    const updated = all.find((r) => r.id === approvalId);
    if (updated) setSelectedApproval(updated);
    setActionComment('');
  }

  const myApprovals = advanceApprovals.filter((r) => r.requestedByName === userName);
  const pendingApprovals = advanceApprovals.filter((r) => r.status === 'PENDING');

  const advanceHistoryItems: Partial<ApprovalRequest>[] = [
    ...myApprovals,
    ...MY_ADVANCE_HISTORY.map((h) => ({
      id: h.id,
      title: `Salary Advance — ${formatCurrency(h.amount)} (${h.repayMonths} months)`,
      description: h.reason,
      status: h.status as ApprovalStatus,
      requestedAt: h.requestedAt,
      metadata: { amount: h.amount, repayMonths: h.repayMonths },
      steps: buildSalaryAdvanceChain().map((s, i) => ({
        ...s,
        status: (h.status === 'APPROVED' ? 'APPROVED' : i === 0 ? 'REJECTED' : 'PENDING') as ApprovalStatus,
      })),
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <IndianRupee size={24} className="text-teal-600" />
          Salary Advance
        </h1>
        <p className="text-sm text-gray-500">Request advance salary with multi-level approval</p>
      </div>

      <Tabs defaultValue="request" className="space-y-4">
        <TabsList>
          <TabsTrigger value="request">Apply for Advance</TabsTrigger>
          <TabsTrigger value="history">My History</TabsTrigger>
          {isManager && (
            <TabsTrigger value="approvals">
              Manager Approvals
              {pendingApprovals.length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">{pendingApprovals.length}</span>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        {/* Apply */}
        <TabsContent value="request">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <IndianRupee size={18} className="text-teal-600" />
                    Salary Advance Request
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
                      <Label htmlFor="advAmount">Advance Amount (₹) *</Label>
                      <Input
                        id="advAmount"
                        type="number"
                        placeholder="e.g. 25000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      {amount && parseFloat(amount) > 0 && (
                        <p className="text-xs text-gray-500">
                          Max allowed: 2x monthly CTC or ₹1,00,000 (whichever is lower)
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Repayment Period</Label>
                      <Select value={repayMonths} onValueChange={setRepayMonths}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 month</SelectItem>
                          <SelectItem value="2">2 months</SelectItem>
                          <SelectItem value="3">3 months</SelectItem>
                          <SelectItem value="6">6 months</SelectItem>
                          <SelectItem value="12">12 months</SelectItem>
                        </SelectContent>
                      </Select>
                      {amount && (
                        <p className="text-xs text-teal-600 font-medium">
                          Monthly deduction: {formatCurrency(Math.ceil(parseFloat(amount || '0') / parseInt(repayMonths)))}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEDICAL">Medical Emergency</SelectItem>
                        <SelectItem value="EDUCATION">Education</SelectItem>
                        <SelectItem value="HOME">Home Purchase / Repair</SelectItem>
                        <SelectItem value="MARRIAGE">Marriage</SelectItem>
                        <SelectItem value="OTHER">Other Personal Need</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="advReason">Reason / Justification *</Label>
                    <Textarea
                      id="advReason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Explain the reason for salary advance request..."
                      rows={4}
                    />
                  </div>

                  {/* Approval chain preview */}
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <p className="text-xs font-semibold text-gray-600 mb-3 flex items-center gap-1">
                      <GitBranch size={12} /> Multi-Level Approval Chain
                    </p>
                    <ApprovalTimeline steps={buildSalaryAdvanceChain()} />
                  </div>

                  <Button
                    className="bg-teal-600 hover:bg-teal-700 w-full"
                    disabled={!amount || !reason || parseFloat(amount) <= 0}
                    onClick={handleSubmit}
                  >
                    Submit Advance Request
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
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
                          <GitBranch size={14} /> Track in Approvals
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertCircle size={16} className="text-teal-600" />
                    Advance Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-gray-600 space-y-2">
                  <p>• Maximum advance: 2x monthly gross salary or ₹1,00,000</p>
                  <p>• Repayment deducted from monthly salary</p>
                  <p>• Maximum repayment period: 12 months</p>
                  <p>• Only 1 active advance allowed at a time</p>
                  <p>• No interest charged for standard advances</p>
                  <p>• Requires L1 Manager, Finance, and HR Head approval</p>
                  <p>• Processing time: 3-5 working days after final approval</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Advance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {advanceHistoryItems.map((req) => (
                  <div key={req.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{req.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{req.description}</p>
                        <p className="text-xs text-gray-400">{formatTimestamp(req.requestedAt)}</p>
                        {req.metadata?.amount && (
                          <p className="text-xs text-teal-600 font-medium mt-0.5">
                            Monthly deduction: {formatCurrency(Math.ceil(Number(req.metadata.amount) / Number(req.metadata.repayMonths)))}
                          </p>
                        )}
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

                {myApprovals.length === 0 && MY_ADVANCE_HISTORY.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-6">No advance requests</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manager Approvals */}
        {isManager && (
          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users size={18} className="text-teal-600" />
                  Pending Salary Advance Approvals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingApprovals.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-6">No pending advance requests</p>
                ) : (
                  <div className="space-y-4">
                    {pendingApprovals.map((req) => {
                      const activeStep = req.steps.find((s) => s.status === 'PENDING');
                      return (
                        <div key={req.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">{req.requestedByName}</p>
                              <p className="text-sm text-gray-700">{req.title}</p>
                              <p className="text-xs text-gray-400 italic mt-0.5">{req.description}</p>
                              <p className="text-xs text-gray-400">{formatTimestamp(req.requestedAt)}</p>
                              {req.metadata?.monthlyDeduction && (
                                <p className="text-xs text-teal-600 font-medium">
                                  Monthly deduction: {formatCurrency(Number(req.metadata.monthlyDeduction))}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">{formatCurrency(Number(req.metadata?.amount || 0))}</p>
                              <Badge className={cn('border text-xs mt-1', APPROVAL_STATUS_STYLE[req.status])}>
                                {req.status}
                              </Badge>
                            </div>
                          </div>

                          <ApprovalChainBadges steps={req.steps} />

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
                                disabled={!activeStep}
                                onClick={() => activeStep && handleManagerAction(req.id, activeStep.stepId, 'APPROVED')}
                              >
                                <CheckCircle2 size={14} /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-8 gap-1"
                                disabled={!activeStep}
                                onClick={() => activeStep && handleManagerAction(req.id, activeStep.stepId, 'REJECTED')}
                              >
                                <XCircle size={14} /> Reject
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1 text-teal-600 border-teal-200"
                                onClick={() => setSelectedApproval(selectedApproval?.id === req.id ? null : req)}
                              >
                                <GitBranch size={14} /> Timeline
                              </Button>
                            </div>
                          </div>

                          {selectedApproval?.id === req.id && (
                            <div className="border-t pt-3">
                              <ApprovalTimeline steps={req.steps} />
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
      </Tabs>
    </div>
  );
}
