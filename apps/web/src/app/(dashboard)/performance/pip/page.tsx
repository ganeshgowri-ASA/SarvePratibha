'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  AlertTriangle,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
} from 'lucide-react';

const PIP_STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-green-100 text-green-700',
  EXTENDED: 'bg-yellow-100 text-yellow-700',
  TERMINATED: 'bg-gray-100 text-gray-700',
};

const PIP_STATUS_ICONS: Record<string, React.ElementType> = {
  ACTIVE: Clock,
  COMPLETED: CheckCircle2,
  EXTENDED: ArrowUpRight,
  TERMINATED: XCircle,
};

const SAMPLE_PIPS = [
  {
    id: '1',
    employeeName: 'Suresh Kumar',
    employeeId: 'EMP010',
    designation: 'Developer',
    department: 'Engineering',
    reason: 'Consistent underperformance in Q3 and Q4 deliverables. Missed 3 sprint deadlines and code quality below team standards.',
    startDate: '2026-01-15',
    endDate: '2026-04-15',
    status: 'ACTIVE',
    milestones: [
      { title: 'Complete pending code reviews', dueDate: '2026-02-01', isCompleted: true, completedAt: '2026-01-28' },
      { title: 'Deliver module A on time', dueDate: '2026-02-28', isCompleted: true, completedAt: '2026-02-25' },
      { title: 'Achieve 80% test coverage', dueDate: '2026-03-15', isCompleted: false },
      { title: 'Complete performance assessment', dueDate: '2026-04-15', isCompleted: false },
    ],
    reviewDates: ['2026-02-15', '2026-03-15', '2026-04-15'],
    createdBy: 'Rajesh Manager',
  },
  {
    id: '2',
    employeeName: 'Neha Gupta',
    employeeId: 'EMP015',
    designation: 'QA Analyst',
    department: 'Quality',
    reason: 'Low productivity and frequent errors in test case documentation.',
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    status: 'COMPLETED',
    milestones: [
      { title: 'Complete test automation training', dueDate: '2025-10-31', isCompleted: true, completedAt: '2025-10-28' },
      { title: 'Automate 10 regression tests', dueDate: '2025-11-30', isCompleted: true, completedAt: '2025-11-25' },
      { title: 'Zero defects in documentation', dueDate: '2025-12-31', isCompleted: true, completedAt: '2025-12-20' },
    ],
    reviewDates: ['2025-11-01', '2025-12-01', '2025-12-31'],
    outcome: 'Successfully completed all milestones. Returned to regular performance track.',
    createdBy: 'Rajesh Manager',
  },
];

export default function PIPPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPip, setNewPip] = useState({
    employeeId: '',
    reason: '',
    startDate: '',
    endDate: '',
  });

  const activePips = SAMPLE_PIPS.filter((p) => p.status === 'ACTIVE');
  const closedPips = SAMPLE_PIPS.filter((p) => p.status !== 'ACTIVE');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/performance" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PIP Tracking</h1>
            <p className="text-sm text-gray-500">Performance Improvement Plans</p>
          </div>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setShowCreateDialog(true)}>
          <Plus size={16} className="mr-2" /> Create PIP
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-red-500" />
              <span className="text-sm text-gray-500">Active</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{activePips.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="text-sm text-gray-500">Completed</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {SAMPLE_PIPS.filter((p) => p.status === 'COMPLETED').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <ArrowUpRight size={16} className="text-yellow-500" />
              <span className="text-sm text-gray-500">Extended</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {SAMPLE_PIPS.filter((p) => p.status === 'EXTENDED').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <XCircle size={16} className="text-gray-500" />
              <span className="text-sm text-gray-500">Terminated</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {SAMPLE_PIPS.filter((p) => p.status === 'TERMINATED').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* PIP Cards */}
      {SAMPLE_PIPS.map((pip) => {
        const StatusIcon = PIP_STATUS_ICONS[pip.status] || Clock;
        const completedMilestones = pip.milestones.filter((m) => m.isCompleted).length;
        const progress = (completedMilestones / pip.milestones.length) * 100;

        return (
          <Card key={pip.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-red-100 text-red-700">
                      {pip.employeeName.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{pip.employeeName}</CardTitle>
                    <p className="text-xs text-gray-500">{pip.employeeId} - {pip.designation}, {pip.department}</p>
                  </div>
                </div>
                <Badge className={PIP_STATUS_STYLES[pip.status]}>
                  <StatusIcon size={12} className="mr-1" />
                  {pip.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Reason */}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Reason</p>
                <p className="text-sm text-gray-700 mt-1">{pip.reason}</p>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-500">
                  <Calendar size={14} />
                  <span>{new Date(pip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <span className="text-gray-300">→</span>
                <div className="flex items-center gap-1 text-gray-500">
                  <Calendar size={14} />
                  <span>{new Date(pip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Overall Progress */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500">Milestone Progress</span>
                  <span className="font-medium">{completedMilestones}/{pip.milestones.length}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Milestones */}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-2">Milestones</p>
                <div className="space-y-2">
                  {pip.milestones.map((milestone, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      {milestone.isCompleted ? (
                        <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className={`${milestone.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {milestone.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          Due: {new Date(milestone.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          {milestone.isCompleted && milestone.completedAt && (
                            <> - Done: {new Date(milestone.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outcome */}
              {pip.outcome && (
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-green-700 uppercase">Outcome</p>
                  <p className="text-sm text-green-800 mt-1">{pip.outcome}</p>
                </div>
              )}

              {/* Review Dates */}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Review dates:</span>
                {pip.reviewDates.map((d, i) => (
                  <Badge key={i} variant="outline" className="text-[10px]">
                    {new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </Badge>
                ))}
              </div>

              <p className="text-xs text-gray-400">Created by: {pip.createdBy}</p>
            </CardContent>
          </Card>
        );
      })}

      {/* Create PIP Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Performance Improvement Plan</DialogTitle>
            <DialogDescription>
              Set up a PIP for an underperforming team member with clear milestones and review dates.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Employee ID</Label>
              <Input
                value={newPip.employeeId}
                onChange={(e) => setNewPip({ ...newPip, employeeId: e.target.value })}
                placeholder="e.g., EMP010"
              />
            </div>
            <div className="space-y-2">
              <Label>Reason *</Label>
              <Textarea
                value={newPip.reason}
                onChange={(e) => setNewPip({ ...newPip, reason: e.target.value })}
                placeholder="Describe the performance issues..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={newPip.startDate}
                  onChange={(e) => setNewPip({ ...newPip, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={newPip.endDate}
                  onChange={(e) => setNewPip({ ...newPip, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700">
              Create PIP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
