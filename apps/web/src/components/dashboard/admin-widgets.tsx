'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  Users,
  FileSearch,
  Server,
  Database,
  Wifi,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

// ─── System Health ──────────────────────────────────────────────────

export function SystemHealth() {
  const services = [
    { name: 'Application Server', status: 'healthy', uptime: '99.9%', icon: Server },
    { name: 'Database', status: 'healthy', uptime: '99.8%', icon: Database },
    { name: 'Email Service', status: 'warning', uptime: '98.5%', icon: Wifi },
    { name: 'File Storage', status: 'healthy', uptime: '99.7%', icon: Database },
  ];

  const statusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 size={14} className="text-green-500" />;
      case 'warning': return <AlertTriangle size={14} className="text-yellow-500" />;
      case 'error': return <XCircle size={14} className="text-red-500" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity size={18} className="text-teal-600" />
            System Health
          </CardTitle>
          <Badge className="bg-green-100 text-green-700 text-[10px]">All Operational</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {services.map((svc) => (
            <div key={svc.name} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2">
                <svc.icon size={14} className="text-gray-500" />
                <span className="text-sm text-gray-700">{svc.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{svc.uptime}</span>
                {statusIcon(svc.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── User Management Summary ────────────────────────────────────────

export function UserManagement() {
  const stats = [
    { label: 'Total Users', value: 156, color: 'bg-blue-50 text-blue-700' },
    { label: 'Active Today', value: 128, color: 'bg-green-50 text-green-700' },
    { label: 'New This Month', value: 7, color: 'bg-teal-50 text-teal-700' },
    { label: 'Deactivated', value: 3, color: 'bg-red-50 text-red-700' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Users size={18} className="text-teal-600" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className={`p-3 rounded-lg text-center ${stat.color}`}>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-3 text-teal-600" size="sm">
          Manage Users
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Audit Logs ─────────────────────────────────────────────────────

const RECENT_LOGS = [
  { user: 'Admin', action: 'Updated user role', entity: 'User', time: '2 min ago' },
  { user: 'System', action: 'Payslip generated', entity: 'Payslip', time: '15 min ago' },
  { user: 'HR Manager', action: 'Approved leave', entity: 'LeaveRequest', time: '1 hr ago' },
  { user: 'Admin', action: 'Created department', entity: 'Department', time: '2 hrs ago' },
  { user: 'System', action: 'Backup completed', entity: 'System', time: '3 hrs ago' },
];

export function AuditLogs() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileSearch size={18} className="text-teal-600" />
          Recent Audit Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {RECENT_LOGS.map((log, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-sm">
              <div className="flex-1 min-w-0">
                <span className="font-medium text-gray-900">{log.user}</span>
                <span className="text-gray-500"> {log.action}</span>
                <Badge variant="outline" className="ml-2 text-[10px]">{log.entity}</Badge>
              </div>
              <span className="text-xs text-gray-400 shrink-0 ml-2">{log.time}</span>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-3 text-teal-600" size="sm">
          View All Logs
        </Button>
      </CardContent>
    </Card>
  );
}
