'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ClipboardList,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

// ─── Team Approvals ─────────────────────────────────────────────────

const MOCK_APPROVALS = [
  { name: 'Neha Gupta', type: 'Leave Request', detail: 'Casual Leave - 12 Mar to 14 Mar', status: 'PENDING' },
  { name: 'Amit Kumar', type: 'Reimbursement', detail: 'Travel claim - INR 4,500', status: 'PENDING' },
  { name: 'Sonia Das', type: 'WFH Request', detail: 'Work from home - 13 Mar', status: 'PENDING' },
];

export function TeamApprovals() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList size={18} className="text-teal-600" />
            Pending Approvals
          </CardTitle>
          <Badge className="bg-orange-100 text-orange-700">{MOCK_APPROVALS.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {MOCK_APPROVALS.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">
                  {item.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-gray-500">{item.type} - {item.detail}</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50">
                  <CheckCircle2 size={16} />
                </Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                  <XCircle size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-3 text-teal-600" size="sm">
          View All Requests
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Team Attendance ────────────────────────────────────────────────

const TEAM_ATTENDANCE = {
  present: 12,
  absent: 2,
  onLeave: 3,
  wfh: 1,
  total: 18,
};

export function TeamAttendance() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Users size={18} className="text-teal-600" />
          Team Attendance Today
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-green-50 text-center">
            <p className="text-2xl font-bold text-green-600">{TEAM_ATTENDANCE.present}</p>
            <p className="text-xs text-green-700">Present</p>
          </div>
          <div className="p-3 rounded-lg bg-red-50 text-center">
            <p className="text-2xl font-bold text-red-600">{TEAM_ATTENDANCE.absent}</p>
            <p className="text-xs text-red-700">Absent</p>
          </div>
          <div className="p-3 rounded-lg bg-yellow-50 text-center">
            <p className="text-2xl font-bold text-yellow-600">{TEAM_ATTENDANCE.onLeave}</p>
            <p className="text-xs text-yellow-700">On Leave</p>
          </div>
          <div className="p-3 rounded-lg bg-purple-50 text-center">
            <p className="text-2xl font-bold text-purple-600">{TEAM_ATTENDANCE.wfh}</p>
            <p className="text-xs text-purple-700">WFH</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
          <span className="text-gray-500">Total team strength</span>
          <span className="font-semibold">{TEAM_ATTENDANCE.total}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Pending Requests Summary ───────────────────────────────────────

export function PendingRequests() {
  const requests = [
    { label: 'Leave Requests', count: 5, icon: Clock, color: 'text-blue-600' },
    { label: 'Expense Claims', count: 3, icon: AlertCircle, color: 'text-orange-600' },
    { label: 'IT Asset Requests', count: 2, icon: ClipboardList, color: 'text-purple-600' },
    { label: 'WFH Requests', count: 1, icon: Users, color: 'text-green-600' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertCircle size={18} className="text-teal-600" />
          Pending Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {requests.map((req) => (
            <div key={req.label} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <req.icon size={16} className={req.color} />
                <span className="text-sm text-gray-700">{req.label}</span>
              </div>
              <Badge variant="secondary">{req.count}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
