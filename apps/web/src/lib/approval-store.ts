/**
 * Approval workflow state management via localStorage.
 * Provides a simple, persistent approval tracking system for all HR modules.
 * Integrates with approval-config.ts for grade-based routing and delegations.
 */

import {
  type EmployeeGrade,
  type RequestType,
  getApprovalChain,
  getActiveDelegate,
  loadHierarchy,
} from './approval-config';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ESCALATED';

export type ApprovalType =
  | 'LEAVE'
  | 'ATTENDANCE_REGULARIZATION'
  | 'REIMBURSEMENT'
  | 'TRAVEL_REQUEST'
  | 'TRAVEL_DOMESTIC'
  | 'TRAVEL_INTERNATIONAL'
  | 'EXPENSE_CLAIM'
  | 'WORK_FROM_HOME'
  | 'OVERTIME'
  | 'ASSET_REQUEST'
  | 'SALARY_ADVANCE'
  | 'SEPARATION';

export interface ApprovalStep {
  stepId: string;
  level: number;
  role: string;
  label: string;
  status: ApprovalStatus;
  approverName?: string;
  comment?: string;
  timestamp?: string;
  escalateDays?: number;
  delegatedTo?: string; // delegate name if routed via delegation
}

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  title: string;
  description: string;
  requestedBy: string;
  requestedByName: string;
  requestedByGrade?: EmployeeGrade;
  requestedAt: string;
  status: ApprovalStatus;
  steps: ApprovalStep[];
  amount?: number; // for monetary threshold routing
  metadata?: Record<string, unknown>;
}

const STORAGE_KEY = 'sp-approval-requests';

export function loadApprovals(): ApprovalRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveApprovals(requests: ApprovalRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch {
    // ignore storage errors
  }
}

export function addApproval(request: ApprovalRequest): void {
  const current = loadApprovals();
  current.unshift(request);
  saveApprovals(current);
}

export function updateApprovalStep(
  requestId: string,
  stepId: string,
  status: ApprovalStatus,
  approverName: string,
  comment?: string,
): void {
  const requests = loadApprovals();
  const req = requests.find((r) => r.id === requestId);
  if (!req) return;

  const step = req.steps.find((s) => s.stepId === stepId);
  if (!step) return;

  step.status = status;
  step.approverName = approverName;
  step.comment = comment;
  step.timestamp = new Date().toISOString();

  // Update overall request status
  if (status === 'REJECTED') {
    req.status = 'REJECTED';
  } else if (status === 'APPROVED') {
    const nextStep = req.steps.find((s) => s.level === step.level + 1);
    if (nextStep) {
      nextStep.status = 'PENDING';
      req.status = 'PENDING'; // still pending at next level
    } else {
      req.status = 'APPROVED'; // all steps done
    }
  } else if (status === 'ESCALATED') {
    req.status = 'ESCALATED';
  }

  saveApprovals(requests);
}

export function getPendingCount(forRole?: string): number {
  const requests = loadApprovals();
  return requests.filter((r) => {
    if (r.status === 'PENDING' || r.status === 'ESCALATED') {
      if (forRole) {
        return r.steps.some((s) => s.status === 'PENDING' && s.role === forRole);
      }
      return true;
    }
    return false;
  }).length;
}

export function getMyPendingApprovals(role: string): ApprovalRequest[] {
  const requests = loadApprovals();
  return requests.filter((r) =>
    r.steps.some((s) => s.status === 'PENDING' && s.role === role),
  );
}

export function generateId(): string {
  return `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function formatTimestamp(ts?: string): string {
  if (!ts) return '—';
  return new Date(ts).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const TYPE_LABELS: Record<ApprovalType, string> = {
  LEAVE: 'Leave Request',
  ATTENDANCE_REGULARIZATION: 'Attendance Regularization',
  REIMBURSEMENT: 'Reimbursement Claim',
  TRAVEL_REQUEST: 'Travel Request',
  TRAVEL_DOMESTIC: 'Travel (Domestic)',
  TRAVEL_INTERNATIONAL: 'Travel (International)',
  EXPENSE_CLAIM: 'Expense Claim',
  WORK_FROM_HOME: 'Work From Home',
  OVERTIME: 'Overtime Request',
  ASSET_REQUEST: 'Asset Request',
  SALARY_ADVANCE: 'Salary Advance',
  SEPARATION: 'Separation / Resignation',
};

export const TYPE_COLORS: Record<ApprovalType, string> = {
  LEAVE: 'bg-blue-100 text-blue-700',
  ATTENDANCE_REGULARIZATION: 'bg-purple-100 text-purple-700',
  REIMBURSEMENT: 'bg-orange-100 text-orange-700',
  TRAVEL_REQUEST: 'bg-sky-100 text-sky-700',
  TRAVEL_DOMESTIC: 'bg-sky-100 text-sky-700',
  TRAVEL_INTERNATIONAL: 'bg-blue-100 text-blue-800',
  EXPENSE_CLAIM: 'bg-amber-100 text-amber-700',
  WORK_FROM_HOME: 'bg-teal-100 text-teal-700',
  OVERTIME: 'bg-pink-100 text-pink-700',
  ASSET_REQUEST: 'bg-indigo-100 text-indigo-700',
  SALARY_ADVANCE: 'bg-green-100 text-green-700',
  SEPARATION: 'bg-red-100 text-red-700',
};

// ─── Grade-aware chain builders ────────────────────────────────────────────────

/**
 * Build an approval chain using the configured matrix for a given grade + type.
 * Falls back to hardcoded defaults if no grade is provided.
 */
export function buildChainFromMatrix(
  grade: EmployeeGrade,
  requestType: RequestType,
  employeeId?: string,
  amount?: number,
): ApprovalStep[] {
  const levels = getApprovalChain(grade, requestType, amount);

  return levels.map((lvl, idx) => {
    const stepId = `s${idx + 1}`;
    let role = lvl.role;
    let label = lvl.label;
    let delegatedTo: string | undefined;

    // Check if this manager has delegated their approval
    if (employeeId && (lvl.level === 1 || lvl.level === 2)) {
      const hierarchy = loadHierarchy();
      const emp = hierarchy.find((n) => n.employeeId === employeeId);
      if (emp) {
        const managerId = lvl.level === 1 ? emp.l1ManagerId : emp.l2ManagerId;
        if (managerId) {
          const delegation = getActiveDelegate(managerId, requestType);
          if (delegation) {
            delegatedTo = delegation.delegateName;
            label = `${lvl.label} (Delegated → ${delegation.delegateName})`;
          }
        }
      }
    }

    return {
      stepId,
      level: lvl.level,
      role,
      label,
      status: idx === 0 ? 'PENDING' : ('PENDING' as ApprovalStatus),
      escalateDays: lvl.escalateDays,
      delegatedTo,
    };
  });
}

// ─── Legacy chain builders (kept for backward compat) ─────────────────────────

export function buildLeaveChain(days: number): ApprovalStep[] {
  const steps: ApprovalStep[] = [
    { stepId: 's1', level: 1, role: 'MANAGER', label: 'L1 Manager', status: 'PENDING' },
  ];
  if (days > 3) {
    steps.push({ stepId: 's2', level: 2, role: 'SECTION_HEAD', label: 'L2 Manager', status: 'PENDING' });
  }
  return steps;
}

export function buildRegularizationChain(): ApprovalStep[] {
  return [{ stepId: 's1', level: 1, role: 'MANAGER', label: 'L1 Manager', status: 'PENDING' }];
}

export function buildReimbursementChain(amount: number): ApprovalStep[] {
  const steps: ApprovalStep[] = [
    { stepId: 's1', level: 1, role: 'MANAGER', label: 'L1 Manager', status: 'PENDING' },
    { stepId: 's2', level: 2, role: 'FINANCE', label: 'Finance Team', status: 'PENDING' },
    { stepId: 's3', level: 3, role: 'HR', label: 'HR Confirm', status: 'PENDING' },
  ];
  if (amount > 10000) {
    steps.splice(1, 0, { stepId: 's2a', level: 2, role: 'SECTION_HEAD', label: 'L2 Manager', status: 'PENDING' });
    steps[2].stepId = 's3';
    steps[3].stepId = 's4';
  }
  return steps;
}

export function buildTravelRequestChain(isInternational: boolean): ApprovalStep[] {
  const steps: ApprovalStep[] = [
    { stepId: 's1', level: 1, role: 'MANAGER', label: 'L1 Manager', status: 'PENDING' },
    { stepId: 's2', level: 2, role: 'TRAVEL_DESK', label: 'Travel Desk', status: 'PENDING' },
  ];
  if (isInternational) {
    steps.splice(1, 0, { stepId: 's1b', level: 2, role: 'SECTION_HEAD', label: 'L2 Manager', status: 'PENDING' });
    steps.push({ stepId: 's3', level: 3, role: 'HR_HEAD', label: 'HR Head', status: 'PENDING' });
  }
  return steps;
}

export function buildExpenseClaimChain(): ApprovalStep[] {
  return [
    { stepId: 's1', level: 1, role: 'MANAGER', label: 'L1 Manager', status: 'PENDING' },
    { stepId: 's2', level: 2, role: 'FINANCE', label: 'Finance Team', status: 'PENDING' },
  ];
}

export function buildWFHChain(): ApprovalStep[] {
  return [{ stepId: 's1', level: 1, role: 'MANAGER', label: 'L1 Manager', status: 'PENDING' }];
}

export function buildOvertimeChain(): ApprovalStep[] {
  return [
    { stepId: 's1', level: 1, role: 'MANAGER', label: 'L1 Manager', status: 'PENDING' },
    { stepId: 's2', level: 2, role: 'HR', label: 'HR', status: 'PENDING' },
  ];
}

export function buildAssetRequestChain(): ApprovalStep[] {
  return [
    { stepId: 's1', level: 1, role: 'MANAGER', label: 'L1 Manager', status: 'PENDING' },
    { stepId: 's2', level: 2, role: 'IT_ADMIN', label: 'IT / Admin', status: 'PENDING' },
  ];
}

export function buildSalaryAdvanceChain(): ApprovalStep[] {
  return [
    { stepId: 's1', level: 1, role: 'MANAGER', label: 'L1 Manager', status: 'PENDING' },
    { stepId: 's2', level: 2, role: 'FINANCE', label: 'Finance', status: 'PENDING' },
    { stepId: 's3', level: 3, role: 'HR_HEAD', label: 'HR Head', status: 'PENDING' },
  ];
}
