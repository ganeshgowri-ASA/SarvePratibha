'use client';

import { CheckCircle2, XCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ApprovalStep, ApprovalStatus } from '@/lib/approval-store';
import { formatTimestamp } from '@/lib/approval-store';

const STATUS_ICON: Record<ApprovalStatus, React.ReactNode> = {
  PENDING: <Clock size={18} className="text-yellow-500" />,
  APPROVED: <CheckCircle2 size={18} className="text-green-600" />,
  REJECTED: <XCircle size={18} className="text-red-600" />,
  ESCALATED: <AlertCircle size={18} className="text-orange-500" />,
};

const STATUS_BADGE: Record<ApprovalStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  APPROVED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
  ESCALATED: 'bg-orange-100 text-orange-700 border-orange-200',
};

const STATUS_DOT: Record<ApprovalStatus, string> = {
  PENDING: 'bg-yellow-400',
  APPROVED: 'bg-green-500',
  REJECTED: 'bg-red-500',
  ESCALATED: 'bg-orange-500',
};

interface ApprovalTimelineProps {
  steps: ApprovalStep[];
  compact?: boolean;
}

export function ApprovalTimeline({ steps, compact = false }: ApprovalTimelineProps) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <div key={step.stepId} className="flex gap-3">
            {/* Timeline line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 bg-white',
                  step.status === 'APPROVED' ? 'border-green-500' :
                  step.status === 'REJECTED' ? 'border-red-500' :
                  step.status === 'ESCALATED' ? 'border-orange-500' :
                  'border-gray-300',
                )}
              >
                {STATUS_ICON[step.status]}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'w-0.5 flex-1 min-h-[24px]',
                    step.status === 'APPROVED' ? 'bg-green-400' : 'bg-gray-200',
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className={cn('pb-4 flex-1', isLast && 'pb-0')}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-900">
                  Level {step.level}: {step.label}
                </span>
                <span
                  className={cn(
                    'text-[11px] font-semibold px-2 py-0.5 rounded-full border',
                    STATUS_BADGE[step.status],
                  )}
                >
                  {step.status}
                </span>
              </div>

              {step.approverName && (
                <p className="text-xs text-gray-500 mt-0.5">
                  By: <span className="font-medium text-gray-700">{step.approverName}</span>
                  {step.timestamp && (
                    <span className="ml-2 text-gray-400">&middot; {formatTimestamp(step.timestamp)}</span>
                  )}
                </p>
              )}

              {step.status === 'PENDING' && !step.approverName && (
                <p className="text-xs text-gray-400 mt-0.5">Awaiting approval</p>
              )}

              {step.comment && (
                <div className="mt-1.5 bg-gray-50 border border-gray-100 rounded px-2.5 py-1.5">
                  <p className="text-xs text-gray-600 italic">&ldquo;{step.comment}&rdquo;</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Compact horizontal chain for listing pages */
export function ApprovalChainBadges({ steps }: { steps: ApprovalStep[] }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {steps.map((step, index) => (
        <div key={step.stepId} className="flex items-center gap-1">
          <span
            className={cn(
              'text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1',
              STATUS_BADGE[step.status],
            )}
          >
            <span className={cn('w-1.5 h-1.5 rounded-full', STATUS_DOT[step.status])} />
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <ArrowRight size={10} className="text-gray-400 shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}
