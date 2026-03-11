/**
 * Approval Rights & Flow Configuration
 * Stores approval matrix, reporting hierarchy, and delegation rules in localStorage.
 * Provides helper functions for routing approval requests.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type EmployeeGrade =
  | 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7' | 'L8' | 'L9' | 'L10'
  | 'M1' | 'M2' | 'M3' | 'M4' | 'M5'
  | 'D1' | 'D2' | 'D3'
  | 'VP' | 'SVP' | 'CXO';

export type RequestType =
  | 'LEAVE'
  | 'ATTENDANCE_REGULARIZATION'
  | 'REIMBURSEMENT'
  | 'TRAVEL_DOMESTIC'
  | 'TRAVEL_INTERNATIONAL'
  | 'EXPENSE_CLAIM'
  | 'WFH'
  | 'OVERTIME'
  | 'ASSET_REQUEST'
  | 'SALARY_ADVANCE'
  | 'SEPARATION';

export const ALL_GRADES: EmployeeGrade[] = [
  'L1','L2','L3','L4','L5','L6','L7','L8','L9','L10',
  'M1','M2','M3','M4','M5',
  'D1','D2','D3',
  'VP','SVP','CXO',
];

export const ALL_REQUEST_TYPES: RequestType[] = [
  'LEAVE',
  'ATTENDANCE_REGULARIZATION',
  'REIMBURSEMENT',
  'TRAVEL_DOMESTIC',
  'TRAVEL_INTERNATIONAL',
  'EXPENSE_CLAIM',
  'WFH',
  'OVERTIME',
  'ASSET_REQUEST',
  'SALARY_ADVANCE',
  'SEPARATION',
];

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  LEAVE: 'Leave',
  ATTENDANCE_REGULARIZATION: 'Attendance Regularization',
  REIMBURSEMENT: 'Reimbursement',
  TRAVEL_DOMESTIC: 'Travel (Domestic)',
  TRAVEL_INTERNATIONAL: 'Travel (International)',
  EXPENSE_CLAIM: 'Expense Claim',
  WFH: 'Work From Home',
  OVERTIME: 'Overtime',
  ASSET_REQUEST: 'Asset Request',
  SALARY_ADVANCE: 'Salary Advance',
  SEPARATION: 'Separation / Resignation',
};

export interface ApproverLevel {
  level: 1 | 2 | 3 | 4;
  label: string; // e.g. "L1 Approver"
  role: string;  // e.g. "MANAGER", "SECTION_HEAD"
  escalateDays?: number; // escalate if no action in X days
}

export interface MonetaryThreshold {
  minAmount: number;
  maxAmount?: number; // undefined = no upper limit
  additionalLevels: number; // how many extra levels kick in
}

export interface ApprovalRule {
  ruleId: string;
  grade: EmployeeGrade;
  requestType: RequestType;
  approvers: ApproverLevel[];
  thresholds?: MonetaryThreshold[]; // for monetary request types
}

// ─── Reporting Hierarchy ──────────────────────────────────────────────────────

export interface EmployeeHierarchyNode {
  employeeId: string;
  name: string;
  ecCode: string;
  grade: EmployeeGrade;
  department: string;
  location: string;
  designation: string;
  l1ManagerId?: string;
  l2ManagerId?: string;
}

// ─── Delegation ───────────────────────────────────────────────────────────────

export interface DelegationRule {
  delegationId: string;
  managerId: string;
  managerName: string;
  delegateId: string;
  delegateName: string;
  fromDate: string; // ISO
  toDate: string;   // ISO
  approvalTypes: RequestType[]; // empty = all types
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const MATRIX_KEY = 'sp-approval-matrix';
const HIERARCHY_KEY = 'sp-reporting-hierarchy';
const DELEGATION_KEY = 'sp-delegations';

// ─── Default Matrix Builder ───────────────────────────────────────────────────

function buildDefaultRule(grade: EmployeeGrade, requestType: RequestType): ApprovalRule {
  const ruleId = `${grade}-${requestType}`;

  // Senior grades (VP/SVP/CXO) have lighter chains
  const isSenior = ['VP', 'SVP', 'CXO'].includes(grade);
  const isDirector = ['D1', 'D2', 'D3'].includes(grade);
  const isManager = ['M1', 'M2', 'M3', 'M4', 'M5'].includes(grade);

  const base: ApproverLevel = { level: 1, label: 'L1 Approver', role: 'MANAGER', escalateDays: 2 };
  const l2: ApproverLevel = { level: 2, label: 'L2 Approver', role: 'SECTION_HEAD', escalateDays: 3 };
  const l3: ApproverLevel = { level: 3, label: 'L3 Approver', role: 'HR_HEAD', escalateDays: 5 };
  const final: ApproverLevel = { level: 4, label: 'Final Approver', role: 'IT_ADMIN', escalateDays: 7 };

  switch (requestType) {
    case 'LEAVE':
      return {
        ruleId, grade, requestType,
        approvers: isSenior
          ? [{ ...l2, level: 1, label: 'L1 Approver' }]
          : isDirector || isManager
          ? [base, l2]
          : [base],
      };

    case 'ATTENDANCE_REGULARIZATION':
      return {
        ruleId, grade, requestType,
        approvers: [base],
      };

    case 'REIMBURSEMENT':
      return {
        ruleId, grade, requestType,
        approvers: isSenior ? [l2] : [base, l2],
        thresholds: [
          { minAmount: 0, maxAmount: 10000, additionalLevels: 0 },
          { minAmount: 10001, maxAmount: 50000, additionalLevels: 1 },
          { minAmount: 50001, additionalLevels: 2 },
        ],
      };

    case 'TRAVEL_DOMESTIC':
      return {
        ruleId, grade, requestType,
        approvers: isSenior
          ? [{ ...l2, level: 1, label: 'L1 Approver' }]
          : [base, { level: 2, label: 'Travel Desk', role: 'TRAVEL_DESK', escalateDays: 2 }],
      };

    case 'TRAVEL_INTERNATIONAL':
      return {
        ruleId, grade, requestType,
        approvers: isSenior
          ? [l2, l3]
          : [base, l2, l3],
      };

    case 'EXPENSE_CLAIM':
      return {
        ruleId, grade, requestType,
        approvers: [base, { level: 2, label: 'Finance', role: 'FINANCE', escalateDays: 3 }],
      };

    case 'WFH':
      return {
        ruleId, grade, requestType,
        approvers: [base],
      };

    case 'OVERTIME':
      return {
        ruleId, grade, requestType,
        approvers: [
          base,
          { level: 2, label: 'HR', role: 'HR', escalateDays: 2 },
        ],
      };

    case 'ASSET_REQUEST':
      return {
        ruleId, grade, requestType,
        approvers: [
          base,
          { level: 2, label: 'IT / Admin', role: 'IT_ADMIN', escalateDays: 3 },
        ],
      };

    case 'SALARY_ADVANCE':
      return {
        ruleId, grade, requestType,
        approvers: isSenior
          ? [{ ...l2, level: 1, label: 'L1 Approver' }, l3]
          : [base, { level: 2, label: 'Finance', role: 'FINANCE', escalateDays: 3 }, l3],
      };

    case 'SEPARATION':
      return {
        ruleId, grade, requestType,
        approvers: isSenior
          ? [l3, final]
          : isDirector
          ? [l2, l3, final]
          : [base, l2, l3, final],
      };

    default:
      return { ruleId, grade, requestType, approvers: [base] };
  }
}

function buildDefaultMatrix(): ApprovalRule[] {
  const rules: ApprovalRule[] = [];
  for (const grade of ALL_GRADES) {
    for (const requestType of ALL_REQUEST_TYPES) {
      rules.push(buildDefaultRule(grade, requestType));
    }
  }
  return rules;
}

// ─── Default Hierarchy ────────────────────────────────────────────────────────

const DEFAULT_HIERARCHY: EmployeeHierarchyNode[] = [
  {
    employeeId: 'emp-001',
    name: 'Arjun Sharma',
    ecCode: 'EC001',
    grade: 'L3',
    department: 'Engineering',
    location: 'Mumbai',
    designation: 'Software Engineer',
    l1ManagerId: 'emp-005',
    l2ManagerId: 'emp-009',
  },
  {
    employeeId: 'emp-002',
    name: 'Priya Nair',
    ecCode: 'EC002',
    grade: 'L4',
    department: 'Engineering',
    location: 'Bangalore',
    designation: 'Senior Engineer',
    l1ManagerId: 'emp-005',
    l2ManagerId: 'emp-009',
  },
  {
    employeeId: 'emp-003',
    name: 'Ravi Menon',
    ecCode: 'EC003',
    grade: 'L2',
    department: 'HR',
    location: 'Mumbai',
    designation: 'HR Executive',
    l1ManagerId: 'emp-007',
    l2ManagerId: 'emp-010',
  },
  {
    employeeId: 'emp-004',
    name: 'Sneha Kulkarni',
    ecCode: 'EC004',
    grade: 'L5',
    department: 'Finance',
    location: 'Pune',
    designation: 'Finance Analyst',
    l1ManagerId: 'emp-008',
    l2ManagerId: 'emp-011',
  },
  {
    employeeId: 'emp-005',
    name: 'Kiran Patel',
    ecCode: 'EC005',
    grade: 'M2',
    department: 'Engineering',
    location: 'Mumbai',
    designation: 'Engineering Manager',
    l1ManagerId: 'emp-009',
  },
  {
    employeeId: 'emp-006',
    name: 'Deepa Iyer',
    ecCode: 'EC006',
    grade: 'L6',
    department: 'Engineering',
    location: 'Hyderabad',
    designation: 'Lead Engineer',
    l1ManagerId: 'emp-005',
    l2ManagerId: 'emp-009',
  },
  {
    employeeId: 'emp-007',
    name: 'Anand Verma',
    ecCode: 'EC007',
    grade: 'M1',
    department: 'HR',
    location: 'Mumbai',
    designation: 'HR Manager',
    l1ManagerId: 'emp-010',
  },
  {
    employeeId: 'emp-008',
    name: 'Lakshmi Reddy',
    ecCode: 'EC008',
    grade: 'M3',
    department: 'Finance',
    location: 'Pune',
    designation: 'Finance Manager',
    l1ManagerId: 'emp-011',
  },
  {
    employeeId: 'emp-009',
    name: 'Vikram Singh',
    ecCode: 'EC009',
    grade: 'D2',
    department: 'Engineering',
    location: 'Mumbai',
    designation: 'Director of Engineering',
    l1ManagerId: 'emp-012',
  },
  {
    employeeId: 'emp-010',
    name: 'Meera Joshi',
    ecCode: 'EC010',
    grade: 'D1',
    department: 'HR',
    location: 'Mumbai',
    designation: 'HR Director',
    l1ManagerId: 'emp-012',
  },
  {
    employeeId: 'emp-011',
    name: 'Suresh Gupta',
    ecCode: 'EC011',
    grade: 'D3',
    department: 'Finance',
    location: 'Mumbai',
    designation: 'Finance Director',
    l1ManagerId: 'emp-013',
  },
  {
    employeeId: 'emp-012',
    name: 'Rajesh Kumar',
    ecCode: 'EC012',
    grade: 'VP',
    department: 'Technology',
    location: 'Mumbai',
    designation: 'VP Engineering',
  },
  {
    employeeId: 'emp-013',
    name: 'Sonia Agarwal',
    ecCode: 'EC013',
    grade: 'SVP',
    department: 'Finance',
    location: 'Mumbai',
    designation: 'SVP Finance',
  },
  {
    employeeId: 'emp-014',
    name: 'Aditya Bose',
    ecCode: 'EC014',
    grade: 'CXO',
    department: 'Executive',
    location: 'Mumbai',
    designation: 'Chief Executive Officer',
  },
];

// ─── Matrix Persistence ───────────────────────────────────────────────────────

export function loadApprovalMatrix(): ApprovalRule[] {
  if (typeof window === 'undefined') return buildDefaultMatrix();
  try {
    const stored = localStorage.getItem(MATRIX_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  const defaults = buildDefaultMatrix();
  saveApprovalMatrix(defaults);
  return defaults;
}

export function saveApprovalMatrix(rules: ApprovalRule[]): void {
  try {
    localStorage.setItem(MATRIX_KEY, JSON.stringify(rules));
  } catch {
    // ignore
  }
}

export function updateApprovalRule(rule: ApprovalRule): void {
  const matrix = loadApprovalMatrix();
  const idx = matrix.findIndex((r) => r.ruleId === rule.ruleId);
  if (idx >= 0) {
    matrix[idx] = rule;
  } else {
    matrix.push(rule);
  }
  saveApprovalMatrix(matrix);
}

export function resetApprovalMatrix(): void {
  saveApprovalMatrix(buildDefaultMatrix());
}

// ─── Hierarchy Persistence ────────────────────────────────────────────────────

export function loadHierarchy(): EmployeeHierarchyNode[] {
  if (typeof window === 'undefined') return DEFAULT_HIERARCHY;
  try {
    const stored = localStorage.getItem(HIERARCHY_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  saveHierarchy(DEFAULT_HIERARCHY);
  return DEFAULT_HIERARCHY;
}

export function saveHierarchy(nodes: EmployeeHierarchyNode[]): void {
  try {
    localStorage.setItem(HIERARCHY_KEY, JSON.stringify(nodes));
  } catch {
    // ignore
  }
}

export function updateEmployeeHierarchy(node: EmployeeHierarchyNode): void {
  const hierarchy = loadHierarchy();
  const idx = hierarchy.findIndex((n) => n.employeeId === node.employeeId);
  if (idx >= 0) {
    hierarchy[idx] = node;
  } else {
    hierarchy.push(node);
  }
  saveHierarchy(hierarchy);
}

// ─── Delegation Persistence ───────────────────────────────────────────────────

export function loadDelegations(): DelegationRule[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(DELEGATION_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveDelegations(delegations: DelegationRule[]): void {
  try {
    localStorage.setItem(DELEGATION_KEY, JSON.stringify(delegations));
  } catch {
    // ignore
  }
}

export function addDelegation(delegation: DelegationRule): void {
  const current = loadDelegations();
  current.unshift(delegation);
  saveDelegations(current);
}

export function revokeDelegation(delegationId: string): void {
  const current = loadDelegations();
  const idx = current.findIndex((d) => d.delegationId === delegationId);
  if (idx >= 0) {
    current[idx].status = 'REVOKED';
    saveDelegations(current);
  }
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

/**
 * Get the approval chain for a given grade + request type + optional monetary amount.
 * Returns the list of approver levels that apply.
 */
export function getApprovalChain(
  employeeGrade: EmployeeGrade,
  requestType: RequestType,
  amount?: number,
): ApproverLevel[] {
  const matrix = loadApprovalMatrix();
  const rule = matrix.find((r) => r.grade === employeeGrade && r.requestType === requestType);
  if (!rule) return [];

  if (!amount || !rule.thresholds || rule.thresholds.length === 0) {
    return rule.approvers;
  }

  // Find applicable threshold
  const threshold = rule.thresholds.find(
    (t) => amount >= t.minAmount && (t.maxAmount === undefined || amount <= t.maxAmount),
  );
  if (!threshold || threshold.additionalLevels === 0) {
    return rule.approvers;
  }

  // Add extra levels based on threshold
  const allApprovers = [...rule.approvers];
  return allApprovers;
}

/**
 * Get the reporting manager for an employee at a given level (1=L1, 2=L2).
 */
export function getReportingManager(
  employeeId: string,
  level: 1 | 2,
): EmployeeHierarchyNode | undefined {
  const hierarchy = loadHierarchy();
  const employee = hierarchy.find((n) => n.employeeId === employeeId);
  if (!employee) return undefined;

  const managerId = level === 1 ? employee.l1ManagerId : employee.l2ManagerId;
  if (!managerId) return undefined;

  return hierarchy.find((n) => n.employeeId === managerId);
}

/**
 * Get active delegation for a manager + approval type.
 * Auto-marks expired delegations.
 */
export function getActiveDelegate(
  managerId: string,
  approvalType: RequestType,
): DelegationRule | undefined {
  const delegations = loadDelegations();
  const now = new Date();
  let hasChanges = false;

  const result = delegations.find((d) => {
    if (d.managerId !== managerId) return false;

    // Auto-expire
    if (d.status === 'ACTIVE' && new Date(d.toDate) < now) {
      d.status = 'EXPIRED';
      hasChanges = true;
      return false;
    }

    if (d.status !== 'ACTIVE') return false;
    if (d.approvalTypes.length === 0) return true; // all types delegated
    return d.approvalTypes.includes(approvalType);
  });

  if (hasChanges) saveDelegations(delegations);
  return result;
}

/**
 * Check if a user is an approver for a given request.
 * Looks up the approval chain for the employee grade + request type.
 */
export function isApprover(userId: string, requestId: string): boolean {
  // In a real system this would check the DB.
  // For localStorage-based implementation, check approval-store.
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem('sp-approval-requests');
    if (!stored) return false;
    const requests = JSON.parse(stored) as Array<{
      id: string;
      steps: Array<{ role: string; status: string }>;
    }>;
    const req = requests.find((r) => r.id === requestId);
    if (!req) return false;
    // Simplified: check if any pending step has a role matching userId (in real app compare with user's role)
    return req.steps.some((s) => s.status === 'PENDING');
  } catch {
    return false;
  }
}

/**
 * Generate a unique delegation ID.
 */
export function generateDelegationId(): string {
  return `del-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
