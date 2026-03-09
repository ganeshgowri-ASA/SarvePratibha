'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CalendarDays, Plus, Clock, CheckCircle2, XCircle } from 'lucide-react';

const LEAVE_BALANCES = [
  { type: 'Casual Leave', code: 'CL', allocated: 12, used: 4, color: 'bg-blue-500' },
  { type: 'Sick Leave', code: 'SL', allocated: 12, used: 2, color: 'bg-red-500' },
  { type: 'Earned Leave', code: 'EL', allocated: 15, used: 5, color: 'bg-green-500' },
  { type: 'Comp Off', code: 'CO', allocated: 3, used: 1, color: 'bg-purple-500' },
];

const RECENT_LEAVES = [
  { type: 'Casual Leave', from: '5 Mar', to: '6 Mar', days: 2, status: 'APPROVED' },
  { type: 'Sick Leave', from: '15 Feb', to: '15 Feb', days: 1, status: 'APPROVED' },
  { type: 'Earned Leave', from: '25 Dec', to: '31 Dec', days: 5, status: 'APPROVED' },
  { type: 'Casual Leave', from: '20 Mar', to: '21 Mar', days: 2, status: 'PENDING' },
];

const STATUS_STYLES: Record<string, { bg: string; icon: typeof CheckCircle2 }> = {
  APPROVED: { bg: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  PENDING: { bg: 'bg-yellow-100 text-yellow-700', icon: Clock },
  REJECTED: { bg: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function LeaveAttendancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave & Attendance</h1>
          <p className="text-sm text-gray-500">Manage your leaves and view attendance</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Plus size={16} className="mr-2" /> Apply Leave
        </Button>
      </div>

      {/* Leave Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {LEAVE_BALANCES.map((leave) => (
          <Card key={leave.code}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">{leave.type}</p>
                  <p className="text-xs text-gray-500">{leave.code}</p>
                </div>
                <span className="text-2xl font-bold text-gray-900">{leave.allocated - leave.used}</span>
              </div>
              <Progress value={(leave.used / leave.allocated) * 100} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500 mt-1.5">
                <span>Used: {leave.used}</span>
                <span>Total: {leave.allocated}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Leave Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays size={18} className="text-teal-600" />
            Recent Leave Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {RECENT_LEAVES.map((leave, i) => {
              const style = STATUS_STYLES[leave.status];
              return (
                <div key={i} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{leave.type}</p>
                    <p className="text-xs text-gray-500">{leave.from} - {leave.to} ({leave.days} days)</p>
                  </div>
                  <Badge className={style.bg}>{leave.status}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
