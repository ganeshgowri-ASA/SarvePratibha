'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ApprovalTimeline } from './approval-timeline';
import type { ApprovalRequest, ApprovalStatus } from '@/lib/approval-store';
import { updateApprovalStep, TYPE_LABELS, TYPE_COLORS } from '@/lib/approval-store';

const OVERALL_STATUS_STYLE: Record<ApprovalStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  APPROVED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
  ESCALATED: 'bg-orange-100 text-orange-700 border-orange-200',
};

interface ApprovalWorkflowProps {
  request: ApprovalRequest;
  /** Role of the currently logged in user. If provided and matches a pending step, shows action buttons */
  currentUserRole?: string;
  currentUserName?: string;
  onUpdate?: (updated: ApprovalRequest) => void;
  className?: string;
}

export function ApprovalWorkflow({
  request,
  currentUserRole,
  currentUserName,
  onUpdate,
  className,
}: ApprovalWorkflowProps) {
  const [comment, setComment] = useState('');
  const [acting, setActing] = useState(false);

  // Find the active step this user can act on
  const activeStep = currentUserRole
    ? request.steps.find((s) => s.status === 'PENDING' && s.role === currentUserRole)
    : null;

  async function handleAction(status: 'APPROVED' | 'REJECTED' | 'ESCALATED') {
    if (!activeStep || !currentUserName) return;
    setActing(true);
    updateApprovalStep(request.id, activeStep.stepId, status, currentUserName, comment || undefined);

    // Build updated request for callback
    const updatedSteps = request.steps.map((s) =>
      s.stepId === activeStep.stepId
        ? { ...s, status, approverName: currentUserName, comment: comment || undefined, timestamp: new Date().toISOString() }
        : s,
    );

    let overallStatus: ApprovalStatus = request.status;
    if (status === 'REJECTED') {
      overallStatus = 'REJECTED';
    } else if (status === 'APPROVED') {
      const nextStep = updatedSteps.find((s) => s.level === activeStep.level + 1);
      overallStatus = nextStep ? 'PENDING' : 'APPROVED';
    } else {
      overallStatus = 'ESCALATED';
    }

    onUpdate?.({ ...request, steps: updatedSteps, status: overallStatus });
    setComment('');
    setActing(false);
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <GitBranch size={18} className="text-teal-600 shrink-0" />
            <div>
              <CardTitle className="text-base">Approval Workflow</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">
                <span className={cn('px-2 py-0.5 rounded-full text-[11px] font-semibold border mr-2', TYPE_COLORS[request.type])}>
                  {TYPE_LABELS[request.type]}
                </span>
              </p>
            </div>
          </div>
          <Badge className={cn('text-xs border shrink-0', OVERALL_STATUS_STYLE[request.status])}>
            {request.status}
          </Badge>
        </div>

        <div className="text-sm text-gray-600 mt-1">
          <span className="font-medium">{request.title}</span>
          {request.description && (
            <p className="text-xs text-gray-400 mt-0.5">{request.description}</p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ApprovalTimeline steps={request.steps} />

        {/* Action area for eligible approvers */}
        {activeStep && (request.status === 'PENDING' || request.status === 'ESCALATED') && (
          <div className="border-t pt-4 space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Your action required as <span className="text-teal-600">{activeStep.label}</span>:
            </p>
            <Textarea
              placeholder="Add a comment (optional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              className="text-sm"
            />
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 gap-1"
                onClick={() => handleAction('APPROVED')}
                disabled={acting}
              >
                <CheckCircle2 size={14} /> Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="gap-1"
                onClick={() => handleAction('REJECTED')}
                disabled={acting}
              >
                <XCircle size={14} /> Reject
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1 text-orange-600 border-orange-200 hover:bg-orange-50"
                onClick={() => handleAction('ESCALATED')}
                disabled={acting}
              >
                <AlertCircle size={14} /> Escalate
              </Button>
            </div>
          </div>
        )}

        {request.status === 'APPROVED' && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
            <CheckCircle2 size={16} /> All levels approved. Request completed.
          </div>
        )}

        {request.status === 'REJECTED' && (
          <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            <XCircle size={16} /> Request has been rejected.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
