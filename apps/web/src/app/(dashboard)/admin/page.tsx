'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users, Shield, Activity, Database, Server, Clock,
  FileText, Settings, Bell, Building2, MapPin, Briefcase,
} from 'lucide-react';
import Link from 'next/link';
import type { SystemHealthData } from '@sarve-pratibha/shared';

const ADMIN_LINKS = [
  { href: '/admin/users', label: 'User Management', icon: Users, desc: 'Manage user accounts and roles' },
  { href: '/admin/roles', label: 'Role & Permissions', icon: Shield, desc: 'Configure role-permission matrix' },
  { href: '/admin/security', label: 'Security Settings', icon: Shield, desc: 'Password policies and 2FA' },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: FileText, desc: 'View system audit trail' },
  { href: '/admin/system-health', label: 'System Health', icon: Activity, desc: 'Monitor system metrics' },
  { href: '/admin/departments', label: 'Departments', icon: Building2, desc: 'Manage department structure' },
  { href: '/admin/locations', label: 'Locations', icon: MapPin, desc: 'Manage office locations' },
  { href: '/admin/designations', label: 'Designations', icon: Briefcase, desc: 'Job titles and levels' },
  { href: '/admin/grades', label: 'Grades', icon: Briefcase, desc: 'Salary grades and bands' },
  { href: '/admin/announcements', label: 'Announcements', icon: Bell, desc: 'Create company announcements' },
  { href: '/admin/company-policies', label: 'Company Policies', icon: FileText, desc: 'Manage policies' },
  { href: '/admin/workflows', label: 'Workflows', icon: Settings, desc: 'Approval workflow builder' },
  { href: '/admin/custom-fields', label: 'Custom Fields', icon: Settings, desc: 'Add fields to modules' },
  { href: '/admin/data-import', label: 'Data Import', icon: Database, desc: 'Import bulk data' },
  { href: '/admin/data-export', label: 'Data Export', icon: Database, desc: 'Export system data' },
  { href: '/admin/backup', label: 'Backup', icon: Server, desc: 'Database backup management' },
  { href: '/admin/integrations', label: 'Integrations', icon: Settings, desc: 'Third-party integrations' },
];

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

export default function AdminDashboardPage() {
  const { data: healthData } = useQuery<{ data: SystemHealthData }>({
    queryKey: ['admin', 'health'],
    queryFn: () => api.get('/api/admin/system/health'),
  });

  const { data: auditData } = useQuery({
    queryKey: ['admin', 'audit-logs', { limit: 5 }],
    queryFn: () => api.get('/api/admin/audit-logs?limit=5'),
  });

  const health = healthData?.data;
  const recentLogs = (auditData?.data as any[]) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 mt-1">System configuration and management</p>
      </div>

      {/* System Health Summary */}
      {health && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-lg"><Users className="h-5 w-5 text-teal-600" /></div>
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold">{health.stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg"><Activity className="h-5 w-5 text-green-600" /></div>
                <div>
                  <p className="text-sm text-gray-500">Active Employees</p>
                  <p className="text-2xl font-bold">{health.stats.activeEmployees}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg"><Server className="h-5 w-5 text-blue-600" /></div>
                <div>
                  <p className="text-sm text-gray-500">Database</p>
                  <Badge variant={health.services.database === 'OK' ? 'default' : 'destructive'} className={health.services.database === 'OK' ? 'bg-green-100 text-green-800' : ''}>
                    {health.services.database}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg"><Clock className="h-5 w-5 text-purple-600" /></div>
                <div>
                  <p className="text-sm text-gray-500">Uptime</p>
                  <p className="text-lg font-semibold">{formatUptime(health.system.uptime)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Access Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ADMIN_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-teal-50 rounded-lg shrink-0">
                      <link.icon className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{link.label}</p>
                      <p className="text-sm text-gray-500 mt-1">{link.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Audit Logs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <Link href="/admin/audit-logs" className="text-sm text-teal-600 hover:underline">View all</Link>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log: any) => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{log.action} - {log.entity}</p>
                    <p className="text-xs text-gray-500">{log.user?.name || 'System'}</p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
