'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ALL_GRADES,
  ALL_REQUEST_TYPES,
  REQUEST_TYPE_LABELS,
  type EmployeeGrade,
  type RequestType,
  type ApprovalRule,
  type ApproverLevel,
  type MonetaryThreshold,
  loadApprovalMatrix,
  saveApprovalMatrix,
  resetApprovalMatrix,
} from '@/lib/approval-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  GitBranch,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  IndianRupee,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Grade groups for column headers ─────────────────────────────────────────

const GRADE_GROUPS = [
  { label: 'Junior (L1–L5)', grades: ['L1','L2','L3','L4','L5'] as EmployeeGrade[] },
  { label: 'Senior (L6–L10)', grades: ['L6','L7','L8','L9','L10'] as EmployeeGrade[] },
  { label: 'Manager (M1–M5)', grades: ['M1','M2','M3','M4','M5'] as EmployeeGrade[] },
  { label: 'Director (D1–D3)', grades: ['D1','D2','D3'] as EmployeeGrade[] },
  { label: 'Leadership', grades: ['VP','SVP','CXO'] as EmployeeGrade[] },
];

const ROLE_OPTIONS = [
  { value: 'MANAGER', label: 'L1 Manager' },
  { value: 'SECTION_HEAD', label: 'L2 / Section Head' },
  { value: 'HR_HEAD', label: 'HR Head' },
  { value: 'HR', label: 'HR' },
  { value: 'FINANCE', label: 'Finance' },
  { value: 'IT_ADMIN', label: 'IT Admin' },
  { value: 'TRAVEL_DESK', label: 'Travel Desk' },
  { value: 'CEO', label: 'CEO / CXO' },
];

const MONETARY_TYPES: RequestType[] = ['REIMBURSEMENT', 'EXPENSE_CLAIM', 'SALARY_ADVANCE'];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ApprovalMatrixPage() {
  const [matrix, setMatrix] = useState<ApprovalRule[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<EmployeeGrade>('L1');
  const [editingRule, setEditingRule] = useState<ApprovalRule | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');

  useEffect(() => {
    setMatrix(loadApprovalMatrix());
  }, []);

  const getRule = useCallback(
    (grade: EmployeeGrade, requestType: RequestType) =>
      matrix.find((r) => r.grade === grade && r.requestType === requestType),
    [matrix],
  );

  const handleEdit = (grade: EmployeeGrade, requestType: RequestType) => {
    const existing = getRule(grade, requestType);
    if (existing) {
      setEditingRule(JSON.parse(JSON.stringify(existing))); // deep clone
    }
    setShowEditDialog(true);
  };

  const handleSaveRule = (rule: ApprovalRule) => {
    const updated = matrix.map((r) => (r.ruleId === rule.ruleId ? rule : r));
    setMatrix(updated);
    saveApprovalMatrix(updated);
    setShowEditDialog(false);
    setEditingRule(null);
  };

  const handleReset = () => {
    resetApprovalMatrix();
    setMatrix(loadApprovalMatrix());
    setShowResetConfirm(false);
  };

  const levelColor = (count: number) => {
    if (count === 1) return 'bg-green-100 text-green-700 border-green-200';
    if (count === 2) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (count === 3) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-100 rounded-lg">
              <GitBranch className="h-5 w-5 text-teal-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Approval Matrix</h1>
          </div>
          <p className="text-gray-500 mt-1 ml-11">
            Configure approval chains per employee grade and request type.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'detail' : 'grid')}
          >
            {viewMode === 'grid' ? 'Detail View' : 'Grid View'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => setShowResetConfirm(true)}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset to Defaults
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {[
          { color: 'bg-green-100 text-green-700', label: '1 level' },
          { color: 'bg-blue-100 text-blue-700', label: '2 levels' },
          { color: 'bg-orange-100 text-orange-700', label: '3 levels' },
          { color: 'bg-red-100 text-red-700', label: '4+ levels' },
        ].map((item) => (
          <div key={item.label} className={cn('px-2 py-1 rounded border font-medium', item.color)}>
            {item.label}
          </div>
        ))}
        <div className="flex items-center gap-1 text-gray-500 ml-2">
          <IndianRupee className="h-3 w-3" />
          <span>= monetary thresholds apply</span>
        </div>
      </div>

      {/* Grade selector tabs */}
      <div className="flex flex-wrap gap-2">
        {ALL_GRADES.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGrade(g)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium border transition-all',
              selectedGrade === g
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50',
            )}
          >
            {g}
          </button>
        ))}
      </div>

      {viewMode === 'grid' ? (
        /* ── Grid View ── */
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Approval Chains — Grade <span className="text-teal-600">{selectedGrade}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {ALL_REQUEST_TYPES.map((rt) => {
                const rule = getRule(selectedGrade, rt);
                const levels = rule?.approvers.length ?? 0;
                const hasThresholds = rule?.thresholds && rule.thresholds.length > 0;

                return (
                  <div
                    key={rt}
                    className="flex items-center justify-between px-6 py-3 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {REQUEST_TYPE_LABELS[rt]}
                      </span>
                      {hasThresholds && (
                        <IndianRupee className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      {/* Approval chain pills */}
                      <div className="flex items-center gap-1">
                        {rule?.approvers.map((ap, i) => (
                          <div key={i} className="flex items-center gap-1">
                            {i > 0 && <span className="text-gray-300 text-xs">→</span>}
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                              {ap.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      <Badge
                        variant="outline"
                        className={cn('text-xs shrink-0', levelColor(levels))}
                      >
                        {levels}L
                      </Badge>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleEdit(selectedGrade, rt)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* ── Detail View: full grade × request matrix ── */
        <div className="space-y-6">
          {GRADE_GROUPS.map((group) => (
            <Card key={group.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-700">{group.label}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="w-full">
                  <div className="min-w-max">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left px-4 py-2 font-semibold text-gray-600 sticky left-0 bg-gray-50 min-w-[180px]">
                            Request Type
                          </th>
                          {group.grades.map((g) => (
                            <th key={g} className="px-4 py-2 font-semibold text-gray-600 text-center min-w-[120px]">
                              {g}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {ALL_REQUEST_TYPES.map((rt) => (
                          <tr key={rt} className="hover:bg-gray-50">
                            <td className="px-4 py-2 font-medium text-gray-700 sticky left-0 bg-white border-r">
                              {REQUEST_TYPE_LABELS[rt]}
                            </td>
                            {group.grades.map((g) => {
                              const rule = getRule(g, rt);
                              const levels = rule?.approvers.length ?? 0;
                              return (
                                <td key={g} className="px-3 py-2 text-center">
                                  <div className="flex flex-col items-center gap-1">
                                    <Badge
                                      variant="outline"
                                      className={cn('text-[10px] cursor-pointer', levelColor(levels))}
                                      onClick={() => {
                                        setSelectedGrade(g);
                                        handleEdit(g, rt);
                                      }}
                                    >
                                      {levels}L
                                    </Badge>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      {editingRule && (
        <EditRuleDialog
          open={showEditDialog}
          rule={editingRule}
          onClose={() => {
            setShowEditDialog(false);
            setEditingRule(null);
          }}
          onSave={handleSaveRule}
        />
      )}

      {/* Reset Confirm Dialog */}
      <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Reset Approval Matrix?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            This will restore all approval chains to their default configuration. Custom changes will
            be lost.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Edit Rule Dialog ─────────────────────────────────────────────────────────

interface EditRuleDialogProps {
  open: boolean;
  rule: ApprovalRule;
  onClose: () => void;
  onSave: (rule: ApprovalRule) => void;
}

function EditRuleDialog({ open, rule, onClose, onSave }: EditRuleDialogProps) {
  const [approvers, setApprovers] = useState<ApproverLevel[]>(rule.approvers);
  const [thresholds, setThresholds] = useState<MonetaryThreshold[]>(rule.thresholds ?? []);
  const isMonetary = MONETARY_TYPES.includes(rule.requestType);

  useEffect(() => {
    setApprovers(JSON.parse(JSON.stringify(rule.approvers)));
    setThresholds(JSON.parse(JSON.stringify(rule.thresholds ?? [])));
  }, [rule]);

  const addApprover = () => {
    const next = approvers.length + 1;
    setApprovers([
      ...approvers,
      {
        level: next as 1 | 2 | 3 | 4,
        label: `L${next} Approver`,
        role: 'MANAGER',
        escalateDays: 3,
      },
    ]);
  };

  const removeApprover = (idx: number) => {
    const updated = approvers.filter((_, i) => i !== idx).map((a, i) => ({
      ...a,
      level: (i + 1) as 1 | 2 | 3 | 4,
      stepId: `s${i + 1}`,
    }));
    setApprovers(updated);
  };

  const moveApprover = (idx: number, dir: 'up' | 'down') => {
    const arr = [...approvers];
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= arr.length) return;
    [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
    setApprovers(arr.map((a, i) => ({ ...a, level: (i + 1) as 1 | 2 | 3 | 4 })));
  };

  const updateApprover = (idx: number, field: keyof ApproverLevel, value: string | number) => {
    const arr = [...approvers];
    (arr[idx] as Record<string, unknown>)[field] = value;
    setApprovers(arr);
  };

  const addThreshold = () => {
    setThresholds([...thresholds, { minAmount: 0, additionalLevels: 1 }]);
  };

  const removeThreshold = (idx: number) => {
    setThresholds(thresholds.filter((_, i) => i !== idx));
  };

  const updateThreshold = (idx: number, field: keyof MonetaryThreshold, value: number | undefined) => {
    const arr = [...thresholds];
    if (value === undefined) {
      delete arr[idx][field as 'maxAmount'];
    } else {
      (arr[idx] as Record<string, unknown>)[field] = value;
    }
    setThresholds(arr);
  };

  const handleSave = () => {
    onSave({ ...rule, approvers, thresholds: isMonetary ? thresholds : undefined });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Edit Approval Chain — {rule.grade} / {REQUEST_TYPE_LABELS[rule.requestType]}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Approvers */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Approval Levels</h3>
              {approvers.length < 4 && (
                <Button variant="outline" size="sm" onClick={addApprover}>
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Level
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {approvers.map((ap, idx) => (
                <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-gray-500 w-6">L{idx + 1}</span>
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">Label</Label>
                        <Input
                          value={ap.label}
                          onChange={(e) => updateApprover(idx, 'label', e.target.value)}
                          className="h-8 text-sm"
                          placeholder="e.g. L1 Manager"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">Role</Label>
                        <Select
                          value={ap.role}
                          onValueChange={(v) => updateApprover(idx, 'role', v)}
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLE_OPTIONS.map((r) => (
                              <SelectItem key={r.value} value={r.value}>
                                {r.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="w-24">
                      <Label className="text-xs text-gray-500 mb-1 block">Escalate (days)</Label>
                      <Input
                        type="number"
                        min={1}
                        max={30}
                        value={ap.escalateDays ?? ''}
                        onChange={(e) =>
                          updateApprover(idx, 'escalateDays', parseInt(e.target.value) || 3)
                        }
                        className="h-8 text-sm"
                        placeholder="3"
                      />
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => moveApprover(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => moveApprover(idx, 'down')}
                        disabled={idx === approvers.length - 1}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeApprover(idx)}
                      disabled={approvers.length <= 1}
                      className="p-1 rounded hover:bg-red-50 text-red-500 disabled:opacity-30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monetary Thresholds */}
          {isMonetary && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-700">Monetary Thresholds</h3>
                  <div className="relative group">
                    <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                    <div className="absolute left-5 top-0 z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded hidden group-hover:block">
                      Define amount bands that trigger extra approval levels.
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={addThreshold}>
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Band
                </Button>
              </div>

              {thresholds.length === 0 ? (
                <p className="text-xs text-gray-500 italic">
                  No monetary thresholds. Amount will not affect approval chain.
                </p>
              ) : (
                <div className="space-y-2">
                  {thresholds.map((t, idx) => (
                    <div key={idx} className="border rounded-lg p-3 bg-amber-50/50 flex items-center gap-3">
                      <IndianRupee className="h-4 w-4 text-amber-600 shrink-0" />
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">Min Amount (₹)</Label>
                          <Input
                            type="number"
                            value={t.minAmount}
                            onChange={(e) => updateThreshold(idx, 'minAmount', parseInt(e.target.value) || 0)}
                            className="h-7 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">Max Amount (₹, blank=∞)</Label>
                          <Input
                            type="number"
                            value={t.maxAmount ?? ''}
                            onChange={(e) =>
                              updateThreshold(
                                idx,
                                'maxAmount',
                                e.target.value ? parseInt(e.target.value) : undefined,
                              )
                            }
                            className="h-7 text-xs"
                            placeholder="No limit"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">Extra Levels</Label>
                          <Input
                            type="number"
                            min={0}
                            max={3}
                            value={t.additionalLevels}
                            onChange={(e) =>
                              updateThreshold(idx, 'additionalLevels', parseInt(e.target.value) || 0)
                            }
                            className="h-7 text-xs"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeThreshold(idx)}
                        className="p-1 rounded hover:bg-red-50 text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSave}>
            Save Chain
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
