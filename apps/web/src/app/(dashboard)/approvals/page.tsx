'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitBranch, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  loadApprovals,
  saveApprovals,
  updateApprovalStep,
  TYPE_LABELS,
  TYPE_COLORS,
  formatTimestamp,
} from '@/lib/approval-store';
import type { ApprovalRequest, ApprovalStatus } from '@/lib/approval-store';
import { ApprovalWorkflow } from '@/components/approvals/approval-workflow';
import { ApprovalChainBadges } from '@/components/approvals/approval-timeline';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const STATUS_STYLE: Record<ApprovalStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  APPROVED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
  ESCALATED: 'bg-orange-100 text-orange-700 border-orange-200',
};

const STATUS_ICON: Record<ApprovalStatus, React.ReactNode> = {
  PENDING: <Clock size={14} className="text-yellow-500" />,
  APPROVED: <CheckCircle2 size={14} className="text-green-600" />,
  REJECTED: <XCircle size={14} className="text-red-600" />,
  ESCALATED: <AlertCircle size={14} className="text-orange-500" />,
};

export default function ApprovalsPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [selected, setSelected] = useState<ApprovalRequest | null>(null);
  const [tab, setTab] = useState('pending');

  const userRole = (session?.user as any)?.role as string | undefined;
  const userName = (session?.user as any)?.name ?? 'You';

  useEffect(() => {
    setRequests(loadApprovals());
  }, []);

  function refresh() {
    setRequests(loadApprovals());
    if (selected) {
      const updated = loadApprovals().find((r) => r.id === selected.id);
      setSelected(updated ?? null);
    }
  }

  function handleWorkflowUpdate(updated: ApprovalRequest) {
    const all = loadApprovals();
    const idx = all.findIndex((r) => r.id === updated.id);
    if (idx !== -1) {
      all[idx] = updated;
      saveApprovals(all);
    }
    setRequests(loadApprovals());
    setSelected(updated);
  }

  const pending = requests.filter((r) => r.status === 'PENDING' || r.status === 'ESCALATED');
  const completed = requests.filter((r) => r.status === 'APPROVED' || r.status === 'REJECTED');
  const myActionNeeded = pending.filter((r) =>
    r.steps.some((s) => s.status === 'PENDING' && s.role === userRole),
  );

  const displayList = tab === 'pending' ? pending : tab === 'action' ? myActionNeeded : completed;

  const summaryCards = [
    { label: 'Total Requests', value: requests.length, icon: <GitBranch size={16} className="text-teal-600" /> },
    { label: 'Pending', value: pending.length, icon: <Clock size={16} className="text-yellow-500" /> },
    { label: 'Action Needed', value: myActionNeeded.length, icon: <AlertCircle size={16} className="text-orange-500" /> },
    { label: 'Completed', value: completed.length, icon: <CheckCircle2 size={16} className="text-green-600" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <GitBranch size={24} className="text-teal-600" />
          My Approvals
        </h1>
        <p className="text-sm text-gray-500">Track and manage all approval requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((c) => (
          <Card key={c.label}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2">
                {c.icon}
                <div>
                  <p className="text-xs text-gray-500">{c.label}</p>
                  <p className="text-xl font-bold text-gray-900">{c.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* List panel */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="pending" className="flex-1 text-xs">
                    Pending {pending.length > 0 && <span className="ml-1 bg-yellow-500 text-white text-[10px] rounded-full px-1.5">{pending.length}</span>}
                  </TabsTrigger>
                  <TabsTrigger value="action" className="flex-1 text-xs">
                    My Action {myActionNeeded.length > 0 && <span className="ml-1 bg-red-500 text-white text-[10px] rounded-full px-1.5">{myActionNeeded.length}</span>}
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="flex-1 text-xs">Done</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0">
              {displayList.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No requests here</p>
              ) : (
                <div className="divide-y max-h-[600px] overflow-y-auto">
                  {displayList.map((req) => (
                    <button
                      key={req.id}
                      className={cn(
                        'w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors',
                        selected?.id === req.id && 'bg-teal-50 border-l-2 border-l-teal-500',
                      )}
                      onClick={() => setSelected(req)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={cn(
                                'text-[10px] font-semibold px-1.5 py-0.5 rounded border',
                                TYPE_COLORS[req.type],
                              )}
                            >
                              {TYPE_LABELS[req.type]}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mt-0.5 truncate">{req.title}</p>
                          <p className="text-xs text-gray-400">{req.requestedByName} &middot; {formatTimestamp(req.requestedAt)}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {STATUS_ICON[req.status]}
                          <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full border', STATUS_STYLE[req.status])}>
                            {req.status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1.5">
                        <ApprovalChainBadges steps={req.steps} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="space-y-4">
              <ApprovalWorkflow
                request={selected}
                currentUserRole={userRole}
                currentUserName={userName}
                onUpdate={handleWorkflowUpdate}
              />
              {/* Metadata display */}
              {selected.metadata && Object.keys(selected.metadata).length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Request Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      {Object.entries(selected.metadata).map(([key, val]) => (
                        <div key={key}>
                          <dt className="text-xs text-gray-500 capitalize">{key.replace(/_/g, ' ')}</dt>
                          <dd className="font-medium text-gray-900">{String(val)}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[300px]">
              <CardContent>
                <div className="text-center text-gray-400">
                  <GitBranch size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select a request to view the approval workflow</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
