'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Cpu, HardDrive, Users, Database, Server, Clock, Layers } from 'lucide-react';
import type { SystemHealthData } from '@sarve-pratibha/shared';

function formatBytes(bytes: number) {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

export default function SystemHealthPage() {
  const { data, isLoading } = useQuery<{ data: SystemHealthData }>({
    queryKey: ['admin', 'health'],
    queryFn: () => api.get('/api/admin/system/health'),
    refetchInterval: 30000,
  });

  if (isLoading) return <div className="text-center py-8 text-gray-500">Loading system health...</div>;
  const health = data?.data;
  if (!health) return <div className="text-center py-8 text-gray-500">Unable to load system health data</div>;

  const memPercent = parseFloat(health.system.memoryUsage.percentage);
  const heapPercent = (health.system.memoryUsage.heapUsed / health.system.memoryUsage.heapTotal) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
        <p className="text-gray-500 mt-1">Real-time system monitoring (auto-refreshes every 30s)</p>
      </div>

      {/* Service Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg"><Server className="h-5 w-5 text-green-600" /></div>
                <div>
                  <p className="text-sm text-gray-500">API Server</p>
                  <p className="font-semibold">{health.services.api}</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Healthy</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${health.services.database === 'OK' ? 'bg-green-100' : 'bg-red-100'}`}>
                  <Database className={`h-5 w-5 ${health.services.database === 'OK' ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Database</p>
                  <p className="font-semibold">{health.services.database}</p>
                </div>
              </div>
              <Badge className={health.services.database === 'OK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {health.services.database === 'OK' ? 'Healthy' : 'Error'}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg"><Users className="h-5 w-5 text-blue-600" /></div>
                <div>
                  <p className="text-sm text-gray-500">Active Sessions</p>
                  <p className="font-semibold">{health.services.activeSessions}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Memory Usage */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-teal-600" />
              <CardTitle>Memory Usage</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>System Memory</span>
                <span>{memPercent.toFixed(1)}%</span>
              </div>
              <Progress value={memPercent} className="h-3" />
              <p className="text-xs text-gray-500 mt-1">
                {formatBytes(health.system.memoryUsage.used)} / {formatBytes(health.system.memoryUsage.total)}
              </p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Heap Memory</span>
                <span>{heapPercent.toFixed(1)}%</span>
              </div>
              <Progress value={heapPercent} className="h-3" />
              <p className="text-xs text-gray-500 mt-1">
                {formatBytes(health.system.memoryUsage.heapUsed)} / {formatBytes(health.system.memoryUsage.heapTotal)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CPU Load */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-teal-600" />
              <CardTitle>CPU Load Average</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {['1 min', '5 min', '15 min'].map((label, i) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{label}</span>
                  <span>{health.system.cpuLoad[i]?.toFixed(2)}</span>
                </div>
                <Progress value={Math.min(health.system.cpuLoad[i] * 25, 100)} className="h-3" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-teal-600" />
              <CardTitle>System Info</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              {[
                ['Platform', health.system.platform],
                ['Node.js', health.system.nodeVersion],
                ['Uptime', formatUptime(health.system.uptime)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <dt className="text-sm text-gray-500">{label}</dt>
                  <dd className="text-sm font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        {/* Platform Stats */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-teal-600" />
              <CardTitle>Platform Stats</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              {[
                ['Total Users', health.stats.totalUsers],
                ['Active Employees', health.stats.activeEmployees],
                ['Departments', health.stats.departments],
                ['Pending Leaves', health.stats.pendingLeaves],
              ].map(([label, value]) => (
                <div key={label as string} className="flex justify-between">
                  <dt className="text-sm text-gray-500">{label}</dt>
                  <dd className="text-sm font-bold">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
