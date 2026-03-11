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
import { Receipt, Plus, ArrowLeft, Upload, GitBranch, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  loadApprovals,
  saveApprovals,
  addApproval,
  updateApprovalStep,
  buildExpenseClaimChain,
  generateId,
  formatTimestamp,
} from '@/lib/approval-store';
import type { ApprovalRequest, ApprovalStatus } from '@/lib/approval-store';
import { ApprovalTimeline } from '@/components/approvals/approval-timeline';
import { ApprovalChainBadges } from '@/components/approvals/approval-timeline';

interface ExpenseItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  receipt: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  SUBMITTED: 'bg-blue-100 text-blue-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  PAID: 'bg-teal-100 text-teal-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
};

const APPROVAL_STATUS_STYLE: Record<ApprovalStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  APPROVED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
  ESCALATED: 'bg-orange-100 text-orange-700 border-orange-200',
};

const EXISTING_EXPENSES: ExpenseItem[] = [
  { id: 'e1', category: 'Flight', description: 'Bangalore to Mumbai round trip', amount: 12500, date: '15 Mar 2026', receipt: true },
  { id: 'e2', category: 'Hotel', description: 'Hotel Taj - 3 nights', amount: 18000, date: '15 Mar 2026', receipt: true },
  { id: 'e3', category: 'Cab', description: 'Airport transfers', amount: 2500, date: '15 Mar 2026', receipt: true },
  { id: 'e4', category: 'Meals', description: 'Per diem - 3 days', amount: 4500, date: '15 Mar 2026', receipt: false },
];

export default function TravelExpensesPage() {
  const { data: session } = useSession();
  const userName = (session?.user as any)?.name ?? 'Employee';
  const userRole = (session?.user as any)?.role as string | undefined;
  const isManager = userRole === 'MANAGER' || userRole === 'SECTION_HEAD' || userRole === 'IT_ADMIN';

  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [category, setCategory] = useState('Flight');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [hasReceipt, setHasReceipt] = useState(false);
  const [notes, setNotes] = useState('');

  const [expenseApprovals, setExpenseApprovals] = useState<ApprovalRequest[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [actionComment, setActionComment] = useState('');

  useEffect(() => {
    const all = loadApprovals();
    setExpenseApprovals(all.filter((r) => r.type === 'EXPENSE_CLAIM'));

    // Seed existing expense approvals
    let updated = false;
    const existingIds = new Set(all.filter((r) => r.type === 'EXPENSE_CLAIM').map((r) => r.metadata?.expenseId as string));
    EXISTING_EXPENSES.forEach((exp) => {
      if (!existingIds.has(exp.id)) {
        const req: ApprovalRequest = {
          id: generateId(),
          type: 'EXPENSE_CLAIM',
          title: `Expense: ${exp.category} — ${exp.description}`,
          description: `Travel expense claim: ${exp.description}`,
          requestedBy: 'self',
          requestedByName: userName,
          requestedAt: new Date().toISOString(),
          status: 'PENDING',
          steps: buildExpenseClaimChain(),
          metadata: { expenseId: exp.id, category: exp.category, amount: exp.amount },
        };
        all.unshift(req);
        updated = true;
      }
    });
    if (updated) {
      saveApprovals(all);
      setExpenseApprovals(all.filter((r) => r.type === 'EXPENSE_CLAIM'));
    }
  }, []);

  function addItem() {
    if (!description || !amount || !date) return;
    setItems((prev) => [...prev, {
      id: generateId(),
      category,
      description,
      amount: parseFloat(amount),
      date,
      receipt: hasReceipt,
    }]);
    setDescription('');
    setAmount('');
    setDate('');
    setHasReceipt(false);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function submitClaim() {
    if (items.length === 0) return;
    const total = items.reduce((sum, i) => sum + i.amount, 0);
    const req: ApprovalRequest = {
      id: generateId(),
      type: 'EXPENSE_CLAIM',
      title: `Expense Claim — ${items.length} items (₹${total.toLocaleString('en-IN')})`,
      description: notes || `Post-travel expense claim with ${items.length} items`,
      requestedBy: 'self',
      requestedByName: userName,
      requestedAt: new Date().toISOString(),
      status: 'PENDING',
      steps: buildExpenseClaimChain(),
      metadata: {
        itemCount: items.length,
        totalAmount: total,
        notes,
      },
    };
    addApproval(req);
    const all = loadApprovals();
    setExpenseApprovals(all.filter((r) => r.type === 'EXPENSE_CLAIM'));
    setItems([]);
    setNotes('');
    setSelectedApproval(req);
  }

  function handleManagerAction(approvalId: string, stepId: string, action: 'APPROVED' | 'REJECTED') {
    updateApprovalStep(approvalId, stepId, action, userName, actionComment || undefined);
    const all = loadApprovals();
    setExpenseApprovals(all.filter((r) => r.type === 'EXPENSE_CLAIM'));
    const updated = all.find((r) => r.id === approvalId);
    if (updated) setSelectedApproval(updated);
    setActionComment('');
  }

  const totalAmount = items.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/travel">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Claims</h1>
          <p className="text-sm text-gray-500">Submit post-travel expense claims for reimbursement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Claim Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Expense Item */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Plus size={18} className="text-teal-600" />
                Add Expense Item
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flight">Flight</SelectItem>
                      <SelectItem value="Train">Train</SelectItem>
                      <SelectItem value="Bus">Bus</SelectItem>
                      <SelectItem value="Cab">Cab</SelectItem>
                      <SelectItem value="Hotel">Hotel</SelectItem>
                      <SelectItem value="Meals">Meals</SelectItem>
                      <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹) *</Label>
                  <Input id="amount" type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="desc">Description *</Label>
                  <Input id="desc" placeholder="Brief description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expDate">Date *</Label>
                  <Input id="expDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasReceipt}
                    onChange={(e) => setHasReceipt(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Receipt attached</span>
                </label>
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  <Upload size={12} /> Upload Receipt
                </Button>
              </div>

              <Button
                onClick={addItem}
                disabled={!description || !amount || !date}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Plus size={16} className="mr-2" /> Add Item
              </Button>
            </CardContent>
          </Card>

          {/* Items list */}
          {items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Claim Items ({items.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded font-medium">{item.category}</span>
                          {item.receipt && <span className="text-xs text-green-600">Receipt ✓</span>}
                        </div>
                        <p className="text-sm text-gray-700 mt-0.5">{item.description}</p>
                        <p className="text-xs text-gray-400">{item.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold">₹{item.amount.toLocaleString('en-IN')}</span>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => removeItem(item.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t text-sm font-bold">
                    <span>Total</span>
                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea placeholder="Any additional notes..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
                  </div>

                  {/* Approval chain preview */}
                  <div className="bg-gray-50 rounded-lg p-3 border">
                    <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                      <GitBranch size={12} /> Approval Chain
                    </p>
                    <ApprovalChainBadges steps={buildExpenseClaimChain()} />
                    <p className="text-[10px] text-gray-400 mt-1">L1 Manager → Finance Team</p>
                  </div>

                  <Button onClick={submitClaim} className="w-full bg-teal-600 hover:bg-teal-700">
                    Submit Expense Claim
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Existing Expenses */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt size={18} className="text-teal-600" />
                Previous Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {EXISTING_EXPENSES.map((exp) => {
                  const approvalReq = expenseApprovals.find((r) => r.metadata?.expenseId === exp.id);
                  return (
                    <div key={exp.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">{exp.category}</span>
                            {exp.receipt ? (
                              <span className="text-xs text-green-600">Receipt ✓</span>
                            ) : (
                              <span className="text-xs text-red-500">No Receipt</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mt-0.5">{exp.description}</p>
                          <p className="text-xs text-gray-400">{exp.date}</p>
                          {approvalReq && (
                            <div className="mt-1.5">
                              <ApprovalChainBadges steps={approvalReq.steps} />
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">₹{exp.amount.toLocaleString('en-IN')}</p>
                          {approvalReq && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 text-xs text-teal-600 mt-1"
                              onClick={() => setSelectedApproval(selectedApproval?.id === approvalReq.id ? null : approvalReq)}
                            >
                              <GitBranch size={12} className="mr-1" />
                              Timeline
                            </Button>
                          )}
                        </div>
                      </div>

                      {selectedApproval?.id === approvalReq?.id && approvalReq && (
                        <div className="mt-3 pt-3 border-t">
                          <ApprovalTimeline steps={approvalReq.steps} />
                          {isManager && (() => {
                            const activeStep = approvalReq.steps.find((s) => s.status === 'PENDING');
                            return activeStep ? (
                              <div className="mt-3 space-y-2">
                                <Textarea
                                  placeholder="Add comment..."
                                  rows={1}
                                  className="text-xs"
                                  value={actionComment}
                                  onChange={(e) => setActionComment(e.target.value)}
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700 h-7 gap-1" onClick={() => handleManagerAction(approvalReq.id, activeStep.stepId, 'APPROVED')}>
                                    <CheckCircle2 size={12} /> Approve
                                  </Button>
                                  <Button size="sm" variant="destructive" className="h-7 gap-1" onClick={() => handleManagerAction(approvalReq.id, activeStep.stepId, 'REJECTED')}>
                                    <XCircle size={12} /> Reject
                                  </Button>
                                </div>
                              </div>
                            ) : null;
                          })()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Approvals sidebar */}
        <div className="space-y-4">
          {selectedApproval && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <GitBranch size={16} className="text-teal-600" />
                  Approval Workflow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-900 truncate">{selectedApproval.title}</p>
                  <p className="text-xs text-gray-400">{formatTimestamp(selectedApproval.requestedAt)}</p>
                  <Badge className={cn('mt-1 border text-xs', APPROVAL_STATUS_STYLE[selectedApproval.status])}>
                    {selectedApproval.status}
                  </Badge>
                </div>
                <ApprovalTimeline steps={selectedApproval.steps} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Claim Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Active Claims</span>
                  <span className="font-medium">{expenseApprovals.filter((r) => r.status === 'PENDING').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Approved</span>
                  <span className="font-medium text-green-600">{expenseApprovals.filter((r) => r.status === 'APPROVED').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rejected</span>
                  <span className="font-medium text-red-600">{expenseApprovals.filter((r) => r.status === 'REJECTED').length}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <Link href="/approvals">
                  <Button variant="outline" size="sm" className="w-full gap-1 text-teal-600 border-teal-200">
                    <GitBranch size={14} /> View All Approvals
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
