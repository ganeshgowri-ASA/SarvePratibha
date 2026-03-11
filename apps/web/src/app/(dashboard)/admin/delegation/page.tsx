'use client';

import { useState, useEffect } from 'react';
import {
  type DelegationRule,
  type RequestType,
  ALL_REQUEST_TYPES,
  REQUEST_TYPE_LABELS,
  loadDelegations,
  addDelegation,
  revokeDelegation,
  saveDelegations,
  generateDelegationId,
  loadHierarchy,
  type EmployeeHierarchyNode,
} from '@/lib/approval-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  UserCheck,
  Plus,
  XCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getDelegationStatus(d: DelegationRule): 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'UPCOMING' {
  if (d.status === 'REVOKED') return 'REVOKED';
  const now = new Date();
  const from = new Date(d.fromDate);
  const to = new Date(d.toDate);
  if (now < from) return 'UPCOMING';
  if (now > to) return 'EXPIRED';
  return 'ACTIVE';
}

const STATUS_CONFIG = {
  ACTIVE: { label: 'Active', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  EXPIRED: { label: 'Expired', color: 'bg-gray-100 text-gray-500', icon: Clock },
  REVOKED: { label: 'Revoked', color: 'bg-red-100 text-red-600', icon: XCircle },
  UPCOMING: { label: 'Upcoming', color: 'bg-blue-100 text-blue-600', icon: CalendarDays },
};

export default function DelegationPage() {
  const [delegations, setDelegations] = useState<DelegationRule[]>([]);
  const [hierarchy, setHierarchy] = useState<EmployeeHierarchyNode[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'UPCOMING'>('ALL');

  useEffect(() => {
    setDelegations(loadDelegations());
    setHierarchy(loadHierarchy());
  }, []);

  // Auto-expire stale delegations on load
  useEffect(() => {
    const now = new Date();
    const updated = delegations.map((d) => {
      if (d.status === 'ACTIVE' && new Date(d.toDate) < now) {
        return { ...d, status: 'EXPIRED' as const };
      }
      return d;
    });
    if (JSON.stringify(updated) !== JSON.stringify(delegations)) {
      saveDelegations(updated);
      setDelegations(updated);
    }
  }, [delegations]);

  const filtered = delegations.filter((d) => {
    if (filterStatus === 'ALL') return true;
    return getDelegationStatus(d) === filterStatus;
  });

  const stats = {
    total: delegations.length,
    active: delegations.filter((d) => getDelegationStatus(d) === 'ACTIVE').length,
    upcoming: delegations.filter((d) => getDelegationStatus(d) === 'UPCOMING').length,
    expired: delegations.filter((d) => getDelegationStatus(d) === 'EXPIRED').length,
  };

  const handleCreate = (delegation: Omit<DelegationRule, 'delegationId' | 'createdAt'>) => {
    const full: DelegationRule = {
      ...delegation,
      delegationId: generateDelegationId(),
      createdAt: new Date().toISOString(),
    };
    addDelegation(full);
    setDelegations(loadDelegations());
    setShowCreateDialog(false);
  };

  const handleRevoke = (id: string) => {
    revokeDelegation(id);
    setDelegations(loadDelegations());
    setRevokeId(null);
  };

  const getEmployeeName = (id: string) =>
    hierarchy.find((n) => n.employeeId === id)?.name ?? id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-100 rounded-lg">
              <UserCheck className="h-5 w-5 text-teal-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Delegation & Proxy Approval</h1>
          </div>
          <p className="text-gray-500 mt-1 ml-11">
            Allow managers to delegate approval rights during leave or absence.
          </p>
        </div>
        <Button
          className="bg-teal-600 hover:bg-teal-700"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          New Delegation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-700', bg: 'bg-gray-100', filter: 'ALL' },
          { label: 'Active', value: stats.active, color: 'text-green-700', bg: 'bg-green-100', filter: 'ACTIVE' },
          { label: 'Upcoming', value: stats.upcoming, color: 'text-blue-700', bg: 'bg-blue-100', filter: 'UPCOMING' },
          { label: 'Expired', value: stats.expired, color: 'text-gray-500', bg: 'bg-gray-100', filter: 'EXPIRED' },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => setFilterStatus(s.filter as typeof filterStatus)}
            className={cn(
              'text-left p-3 rounded-xl border-2 transition-all',
              filterStatus === s.filter ? 'border-teal-500 shadow-sm' : 'border-transparent',
              s.bg,
            )}
          >
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className={cn('text-xs font-medium mt-0.5', s.color)}>{s.label} Delegations</p>
          </button>
        ))}
      </div>

      {/* Delegations List */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            {filterStatus === 'ALL' ? 'All Delegations' : `${filterStatus.charAt(0) + filterStatus.slice(1).toLowerCase()} Delegations`}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDelegations(loadDelegations())}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <UserCheck className="h-10 w-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No delegations found.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setShowCreateDialog(true)}
              >
                Create first delegation
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map((d) => {
                const effectiveStatus = getDelegationStatus(d);
                const statusConf = STATUS_CONFIG[effectiveStatus];
                const StatusIcon = statusConf.icon;
                const canRevoke = effectiveStatus === 'ACTIVE' || effectiveStatus === 'UPCOMING';

                return (
                  <div key={d.delegationId} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Manager → Delegate */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex flex-col items-center">
                            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-sm">
                              {d.managerName.charAt(0)}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-0.5">Manager</span>
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-300 mt-1" />
                          <div className="flex flex-col items-center">
                            <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                              {d.delegateName.charAt(0)}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-0.5">Delegate</span>
                          </div>
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900">
                            {d.managerName} → {d.delegateName}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {formatDate(d.fromDate)} – {formatDate(d.toDate)}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {d.approvalTypes.length === 0 ? (
                              <Badge variant="secondary" className="text-xs">All Request Types</Badge>
                            ) : (
                              d.approvalTypes.map((rt) => (
                                <Badge key={rt} variant="outline" className="text-[10px] text-gray-600">
                                  {REQUEST_TYPE_LABELS[rt]}
                                </Badge>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Badge className={cn('text-xs flex items-center gap-1', statusConf.color)}>
                          <StatusIcon className="h-3 w-3" />
                          {statusConf.label}
                        </Badge>
                        {canRevoke && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => setRevokeId(d.delegationId)}
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Revoke
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Delegation Dialog */}
      <CreateDelegationDialog
        open={showCreateDialog}
        hierarchy={hierarchy}
        onClose={() => setShowCreateDialog(false)}
        onCreate={handleCreate}
      />

      {/* Revoke Confirm Dialog */}
      <Dialog open={!!revokeId} onOpenChange={() => setRevokeId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Revoke Delegation?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            This will immediately revoke the delegation. The original manager will resume receiving
            approval requests.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => revokeId && handleRevoke(revokeId)}
            >
              Revoke
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Create Delegation Dialog ─────────────────────────────────────────────────

interface CreateDelegationDialogProps {
  open: boolean;
  hierarchy: EmployeeHierarchyNode[];
  onClose: () => void;
  onCreate: (d: Omit<DelegationRule, 'delegationId' | 'createdAt'>) => void;
}

function CreateDelegationDialog({ open, hierarchy, onClose, onCreate }: CreateDelegationDialogProps) {
  const today = new Date().toISOString().split('T')[0];

  const [managerId, setManagerId] = useState('');
  const [delegateId, setDelegateId] = useState('');
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<RequestType[]>([]);
  const [allTypes, setAllTypes] = useState(true);

  const reset = () => {
    setManagerId('');
    setDelegateId('');
    setFromDate(today);
    setToDate('');
    setSelectedTypes([]);
    setAllTypes(true);
  };

  const getEmployee = (id: string) => hierarchy.find((n) => n.employeeId === id);

  const toggleType = (rt: RequestType) => {
    setSelectedTypes((prev) =>
      prev.includes(rt) ? prev.filter((t) => t !== rt) : [...prev, rt],
    );
  };

  const isValid = managerId && delegateId && managerId !== delegateId && fromDate && toDate && new Date(toDate) >= new Date(fromDate);

  const handleSubmit = () => {
    if (!isValid) return;
    const manager = getEmployee(managerId);
    const delegate = getEmployee(delegateId);
    onCreate({
      managerId,
      managerName: manager?.name ?? managerId,
      delegateId,
      delegateName: delegate?.name ?? delegateId,
      fromDate: new Date(fromDate).toISOString(),
      toDate: new Date(toDate + 'T23:59:59').toISOString(),
      approvalTypes: allTypes ? [] : selectedTypes,
      status: 'ACTIVE',
    });
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); reset(); } }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Approval Delegation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Manager */}
          <div>
            <Label className="text-xs text-gray-500 mb-1.5 block">Delegating Manager *</Label>
            <Select value={managerId} onValueChange={setManagerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                {hierarchy.map((n) => (
                  <SelectItem key={n.employeeId} value={n.employeeId}>
                    {n.name} — {n.designation} ({n.grade})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Delegate */}
          <div>
            <Label className="text-xs text-gray-500 mb-1.5 block">Delegate (Acting Approver) *</Label>
            <Select
              value={delegateId}
              onValueChange={setDelegateId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select delegate" />
              </SelectTrigger>
              <SelectContent>
                {hierarchy
                  .filter((n) => n.employeeId !== managerId)
                  .map((n) => (
                    <SelectItem key={n.employeeId} value={n.employeeId}>
                      {n.name} — {n.designation} ({n.grade})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {managerId && delegateId && managerId === delegateId && (
              <p className="text-xs text-red-500 mt-1">Manager and delegate cannot be the same person.</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-500 mb-1.5 block">From Date *</Label>
              <Input
                type="date"
                value={fromDate}
                min={today}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1.5 block">To Date *</Label>
              <Input
                type="date"
                value={toDate}
                min={fromDate || today}
                onChange={(e) => setToDate(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          {/* Request Types */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-gray-500">Approval Types to Delegate</Label>
              <button
                className="text-xs text-teal-600 hover:underline"
                onClick={() => setAllTypes(!allTypes)}
              >
                {allTypes ? 'Select specific types' : 'Delegate all types'}
              </button>
            </div>

            {allTypes ? (
              <div className="border rounded-lg p-3 bg-teal-50 text-sm text-teal-700 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                All approval request types will be delegated.
              </div>
            ) : (
              <div className="border rounded-lg p-3 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {ALL_REQUEST_TYPES.map((rt) => (
                  <label key={rt} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(rt)}
                      onChange={() => toggleType(rt)}
                      className="accent-teal-600"
                    />
                    <span className="text-xs text-gray-700 group-hover:text-teal-700">
                      {REQUEST_TYPE_LABELS[rt]}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Preview */}
          {managerId && delegateId && fromDate && toDate && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
              <p className="font-medium mb-1">Preview</p>
              <p>
                <strong>{getEmployee(managerId)?.name ?? managerId}</strong> delegates{' '}
                {allTypes ? 'all approval types' : `${selectedTypes.length} type(s)`} to{' '}
                <strong>{getEmployee(delegateId)?.name ?? delegateId}</strong> from{' '}
                <strong>{formatDate(new Date(fromDate).toISOString())}</strong> to{' '}
                <strong>{toDate ? formatDate(new Date(toDate).toISOString()) : '…'}</strong>.
              </p>
              <p className="mt-1 text-blue-500">
                Delegation will auto-expire after the end date.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { onClose(); reset(); }}>
            Cancel
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700"
            disabled={!isValid}
            onClick={handleSubmit}
          >
            Create Delegation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
