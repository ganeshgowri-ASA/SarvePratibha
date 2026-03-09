'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  ClipboardCheck,
  Users,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

// ─── Department Analytics ───────────────────────────────────────────

export function DepartmentAnalytics() {
  const metrics = [
    { label: 'Attendance Rate', value: 94.2, change: 1.5, unit: '%' },
    { label: 'Avg. Working Hours', value: 8.3, change: 0.2, unit: 'hrs' },
    { label: 'Leave Utilization', value: 62, change: -3, unit: '%' },
    { label: 'Open Positions', value: 4, change: 2, unit: '' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 size={18} className="text-teal-600" />
          Department Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="space-y-1">
              <p className="text-xs text-gray-500">{m.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900">{m.value}{m.unit && <span className="text-sm font-normal text-gray-500">{m.unit}</span>}</span>
                <span className={`text-[10px] flex items-center ${m.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {m.change > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {Math.abs(m.change)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Bulk Approvals ─────────────────────────────────────────────────

export function BulkApprovals() {
  const pending = [
    { type: 'Leave Requests', count: 12, dept: 'Engineering' },
    { type: 'Expense Reports', count: 8, dept: 'Sales' },
    { type: 'Timesheet Approvals', count: 15, dept: 'Operations' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ClipboardCheck size={18} className="text-teal-600" />
          Bulk Approvals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pending.map((item) => (
            <div key={item.type} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="text-sm font-medium">{item.type}</p>
                <p className="text-xs text-gray-500">{item.dept} - {item.count} pending</p>
              </div>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-xs h-7">
                Review All
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Headcount ──────────────────────────────────────────────────────

export function HeadcountWidget() {
  const departments = [
    { name: 'Engineering', current: 45, approved: 50 },
    { name: 'Sales', current: 28, approved: 30 },
    { name: 'Operations', current: 32, approved: 35 },
    { name: 'HR', current: 12, approved: 12 },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Users size={18} className="text-teal-600" />
          Headcount
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {departments.map((dept) => {
            const percent = (dept.current / dept.approved) * 100;
            return (
              <div key={dept.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{dept.name}</span>
                  <span className="text-xs text-gray-500">
                    {dept.current}/{dept.approved}
                  </span>
                </div>
                <Progress value={percent} className="h-2" />
              </div>
            );
          })}
        </div>
        <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
          <span className="text-gray-500">Total headcount</span>
          <span className="font-semibold">117 / 127</span>
        </div>
      </CardContent>
    </Card>
  );
}
