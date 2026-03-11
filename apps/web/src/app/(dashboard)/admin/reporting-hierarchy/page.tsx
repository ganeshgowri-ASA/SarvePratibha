'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  type EmployeeHierarchyNode,
  type EmployeeGrade,
  ALL_GRADES,
  loadHierarchy,
  saveHierarchy,
  updateEmployeeHierarchy,
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
  Users,
  Search,
  ChevronRight,
  ChevronDown,
  Pencil,
  Upload,
  Building2,
  MapPin,
  UserCircle,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DEPARTMENTS = [
  'All', 'Engineering', 'HR', 'Finance', 'Technology', 'Sales', 'Marketing', 'Operations', 'Executive',
];
const LOCATIONS = ['All', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad', 'Delhi', 'Chennai'];

const GRADE_COLORS: Record<string, string> = {
  L1: 'bg-gray-100 text-gray-600',
  L2: 'bg-gray-100 text-gray-600',
  L3: 'bg-gray-100 text-gray-600',
  L4: 'bg-slate-100 text-slate-600',
  L5: 'bg-slate-100 text-slate-600',
  L6: 'bg-blue-100 text-blue-600',
  L7: 'bg-blue-100 text-blue-600',
  L8: 'bg-blue-100 text-blue-600',
  L9: 'bg-indigo-100 text-indigo-600',
  L10: 'bg-indigo-100 text-indigo-600',
  M1: 'bg-teal-100 text-teal-700',
  M2: 'bg-teal-100 text-teal-700',
  M3: 'bg-teal-100 text-teal-700',
  M4: 'bg-teal-100 text-teal-700',
  M5: 'bg-teal-100 text-teal-700',
  D1: 'bg-purple-100 text-purple-700',
  D2: 'bg-purple-100 text-purple-700',
  D3: 'bg-purple-100 text-purple-700',
  VP: 'bg-orange-100 text-orange-700',
  SVP: 'bg-amber-100 text-amber-700',
  CXO: 'bg-red-100 text-red-700',
};

export default function ReportingHierarchyPage() {
  const [hierarchy, setHierarchy] = useState<EmployeeHierarchyNode[]>([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState<EmployeeGrade | 'All'>('All');
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list');
  const [editingNode, setEditingNode] = useState<EmployeeHierarchyNode | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    setHierarchy(loadHierarchy());
  }, []);

  const filtered = useMemo(() => {
    return hierarchy.filter((n) => {
      const matchSearch =
        !search ||
        n.name.toLowerCase().includes(search.toLowerCase()) ||
        n.ecCode.toLowerCase().includes(search.toLowerCase()) ||
        n.designation.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === 'All' || n.department === deptFilter;
      const matchLoc = locationFilter === 'All' || n.location === locationFilter;
      const matchGrade = gradeFilter === 'All' || n.grade === gradeFilter;
      return matchSearch && matchDept && matchLoc && matchGrade;
    });
  }, [hierarchy, search, deptFilter, locationFilter, gradeFilter]);

  // Build tree: top-level nodes are those without l1Manager
  const topLevel = useMemo(
    () => hierarchy.filter((n) => !n.l1ManagerId),
    [hierarchy],
  );

  const getDirectReports = (managerId: string) =>
    hierarchy.filter((n) => n.l1ManagerId === managerId);

  const toggleExpand = (id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getManagerName = (id?: string) => {
    if (!id) return '—';
    return hierarchy.find((n) => n.employeeId === id)?.name ?? id;
  };

  const handleSaveNode = (node: EmployeeHierarchyNode) => {
    updateEmployeeHierarchy(node);
    setHierarchy(loadHierarchy());
    setShowEditDialog(false);
    setEditingNode(null);
  };

  const handleCSVDownload = () => {
    const header = 'employeeId,name,ecCode,grade,department,location,designation,l1ManagerId,l2ManagerId';
    const rows = hierarchy.map(
      (n) =>
        `${n.employeeId},${n.name},${n.ecCode},${n.grade},${n.department},${n.location},${n.designation},${n.l1ManagerId ?? ''},${n.l2ManagerId ?? ''}`,
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporting-hierarchy.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.trim().split('\n');
      const nodes: EmployeeHierarchyNode[] = [];
      for (let i = 1; i < lines.length; i++) {
        const [employeeId, name, ecCode, grade, department, location, designation, l1ManagerId, l2ManagerId] =
          lines[i].split(',');
        if (!employeeId || !name) continue;
        nodes.push({
          employeeId: employeeId.trim(),
          name: name.trim(),
          ecCode: ecCode?.trim() ?? '',
          grade: (grade?.trim() ?? 'L1') as EmployeeGrade,
          department: department?.trim() ?? '',
          location: location?.trim() ?? '',
          designation: designation?.trim() ?? '',
          l1ManagerId: l1ManagerId?.trim() || undefined,
          l2ManagerId: l2ManagerId?.trim() || undefined,
        });
      }
      if (nodes.length > 0) {
        saveHierarchy(nodes);
        setHierarchy(nodes);
        setShowUploadDialog(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Users className="h-5 w-5 text-teal-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Reporting Hierarchy</h1>
          </div>
          <p className="text-gray-500 mt-1 ml-11">
            Manage employee reporting structure and manager assignments.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleCSVDownload}>
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowUploadDialog(true)}>
            <Upload className="h-4 w-4 mr-1" />
            Bulk Upload
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'list' ? 'tree' : 'list')}
          >
            {viewMode === 'list' ? 'Org Tree View' : 'List View'}
          </Button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Employees', value: hierarchy.length, icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Departments', value: [...new Set(hierarchy.map((n) => n.department))].length, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Locations', value: [...new Set(hierarchy.map((n) => n.location))].length, icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Managers', value: hierarchy.filter((n) => ['M1','M2','M3','M4','M5','D1','D2','D3','VP','SVP','CXO'].includes(n.grade)).length, icon: UserCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', s.bg)}>
                  <s.icon className={cn('h-4 w-4', s.color)} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <p className="text-xl font-bold text-gray-900">{s.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, EC code, designation…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            {LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={gradeFilter} onValueChange={(v) => setGradeFilter(v as EmployeeGrade | 'All')}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Grades</SelectItem>
            {ALL_GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Employees ({filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {filtered.map((node) => (
                <div key={node.employeeId} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm shrink-0">
                      {node.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900 text-sm">{node.name}</span>
                        <span className="text-xs text-gray-400">{node.ecCode}</span>
                        <Badge variant="outline" className={cn('text-[10px]', GRADE_COLORS[node.grade] ?? '')}>
                          {node.grade}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-500">{node.designation}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {node.department}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {node.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0 ml-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-400">L1 Manager</p>
                      <p className="text-xs font-medium text-gray-700">{getManagerName(node.l1ManagerId)}</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-gray-400">L2 Manager</p>
                      <p className="text-xs font-medium text-gray-700">{getManagerName(node.l2ManagerId)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setEditingNode({ ...node });
                        setShowEditDialog(true);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="px-6 py-10 text-center text-gray-400 text-sm">
                  No employees match the current filters.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Tree View */
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Org Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {topLevel.map((node) => (
                <TreeNode
                  key={node.employeeId}
                  node={node}
                  depth={0}
                  expanded={expandedNodes}
                  onToggle={toggleExpand}
                  getReports={getDirectReports}
                  gradeColors={GRADE_COLORS}
                  onEdit={(n) => {
                    setEditingNode({ ...n });
                    setShowEditDialog(true);
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      {editingNode && (
        <EditNodeDialog
          open={showEditDialog}
          node={editingNode}
          allNodes={hierarchy}
          onClose={() => {
            setShowEditDialog(false);
            setEditingNode(null);
          }}
          onSave={handleSaveNode}
        />
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Upload Hierarchy (CSV)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Upload a CSV file with columns: <code className="bg-gray-100 px-1 rounded text-xs">employeeId, name, ecCode, grade, department, location, designation, l1ManagerId, l2ManagerId</code>
            </p>
            <Button variant="outline" size="sm" onClick={handleCSVDownload} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download current as template
            </Button>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-2">Choose CSV file</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="block mx-auto text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Tree Node ────────────────────────────────────────────────────────────────

interface TreeNodeProps {
  node: EmployeeHierarchyNode;
  depth: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  getReports: (id: string) => EmployeeHierarchyNode[];
  gradeColors: Record<string, string>;
  onEdit: (node: EmployeeHierarchyNode) => void;
}

function TreeNode({ node, depth, expanded, onToggle, getReports, gradeColors, onEdit }: TreeNodeProps) {
  const reports = getReports(node.employeeId);
  const hasReports = reports.length > 0;
  const isExpanded = expanded.has(node.employeeId);

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer group',
          depth > 0 && 'ml-6',
        )}
        style={{ paddingLeft: `${12 + depth * 20}px` }}
      >
        <button
          onClick={() => hasReports && onToggle(node.employeeId)}
          className="w-5 h-5 flex items-center justify-center shrink-0"
        >
          {hasReports ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          )}
        </button>

        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs shrink-0">
          {node.name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-900">{node.name}</span>
            <span className="text-xs text-gray-400">{node.ecCode}</span>
            <Badge variant="outline" className={cn('text-[10px]', gradeColors[node.grade] ?? '')}>
              {node.grade}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 truncate">
            {node.designation} · {node.department}
            {hasReports && (
              <span className="ml-1 text-teal-600 font-medium">({reports.length} direct report{reports.length > 1 ? 's' : ''})</span>
            )}
          </p>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onEdit(node); }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200"
        >
          <Pencil className="h-3.5 w-3.5 text-gray-500" />
        </button>
      </div>

      {isExpanded && reports.map((child) => (
        <TreeNode
          key={child.employeeId}
          node={child}
          depth={depth + 1}
          expanded={expanded}
          onToggle={onToggle}
          getReports={getReports}
          gradeColors={gradeColors}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

// ─── Edit Node Dialog ─────────────────────────────────────────────────────────

interface EditNodeDialogProps {
  open: boolean;
  node: EmployeeHierarchyNode;
  allNodes: EmployeeHierarchyNode[];
  onClose: () => void;
  onSave: (node: EmployeeHierarchyNode) => void;
}

function EditNodeDialog({ open, node, allNodes, onClose, onSave }: EditNodeDialogProps) {
  const [form, setForm] = useState<EmployeeHierarchyNode>(node);

  useEffect(() => {
    setForm({ ...node });
  }, [node]);

  const managerOptions = allNodes.filter((n) => n.employeeId !== node.employeeId);

  const update = (field: keyof EmployeeHierarchyNode, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value || undefined }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Employee — {node.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-2">
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Name</Label>
            <Input value={form.name} onChange={(e) => update('name', e.target.value)} className="h-9" />
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">EC Code</Label>
            <Input value={form.ecCode} onChange={(e) => update('ecCode', e.target.value)} className="h-9" />
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Grade</Label>
            <Select value={form.grade} onValueChange={(v) => update('grade', v)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ALL_GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Department</Label>
            <Input value={form.department} onChange={(e) => update('department', e.target.value)} className="h-9" />
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Location</Label>
            <Input value={form.location} onChange={(e) => update('location', e.target.value)} className="h-9" />
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Designation</Label>
            <Input value={form.designation} onChange={(e) => update('designation', e.target.value)} className="h-9" />
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">L1 Manager</Label>
            <Select
              value={form.l1ManagerId ?? '__none__'}
              onValueChange={(v) => update('l1ManagerId', v === '__none__' ? '' : v)}
            >
              <SelectTrigger className="h-9"><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None</SelectItem>
                {managerOptions.map((m) => (
                  <SelectItem key={m.employeeId} value={m.employeeId}>
                    {m.name} ({m.grade})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">L2 Manager</Label>
            <Select
              value={form.l2ManagerId ?? '__none__'}
              onValueChange={(v) => update('l2ManagerId', v === '__none__' ? '' : v)}
            >
              <SelectTrigger className="h-9"><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None</SelectItem>
                {managerOptions.map((m) => (
                  <SelectItem key={m.employeeId} value={m.employeeId}>
                    {m.name} ({m.grade})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => onSave(form)}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
