'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, Download, Play, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import type { BackupLogItem } from '@sarve-pratibha/shared';

const STATUS_CONFIG: Record<string, { icon: any; color: string }> = {
  PENDING: { icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  IN_PROGRESS: { icon: Loader2, color: 'bg-blue-100 text-blue-800' },
  COMPLETED: { icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  FAILED: { icon: XCircle, color: 'bg-red-100 text-red-800' },
};

function formatSize(bytes: string | null) {
  if (!bytes) return '-';
  const num = parseInt(bytes);
  if (num === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(num) / Math.log(1024));
  return `${(num / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export default function BackupPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'backup-logs'],
    queryFn: () => api.get('/api/admin/backup/logs'),
    refetchInterval: 10000,
  });

  const triggerMutation = useMutation({
    mutationFn: (type: string) => api.post('/api/admin/backup/trigger', { type }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'backup-logs'] }),
  });

  const backups: BackupLogItem[] = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Backup Management</h1>
          <p className="text-gray-500 mt-1">Database backup and restore operations</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => triggerMutation.mutate('FULL')}
            className="bg-teal-600 hover:bg-teal-700"
            disabled={triggerMutation.isPending}
          >
            <Play className="h-4 w-4 mr-2" />
            {triggerMutation.isPending ? 'Triggering...' : 'Full Backup'}
          </Button>
          <Button
            variant="outline"
            onClick={() => triggerMutation.mutate('INCREMENTAL')}
            disabled={triggerMutation.isPending}
          >
            Incremental Backup
          </Button>
        </div>
      </div>

      {triggerMutation.isSuccess && (
        <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle className="h-4 w-4" /> Backup triggered successfully. It will complete shortly.
        </div>
      )}

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-teal-600" /> Backup History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">Loading...</TableCell></TableRow>
              ) : backups.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No backup history</TableCell></TableRow>
              ) : (
                backups.map((backup) => {
                  const statusConf = STATUS_CONFIG[backup.status] || STATUS_CONFIG.PENDING;
                  const StatusIcon = statusConf.icon;
                  return (
                    <TableRow key={backup.id}>
                      <TableCell className="text-sm">{new Date(backup.startedAt).toLocaleString()}</TableCell>
                      <TableCell><Badge variant="outline">{backup.type}</Badge></TableCell>
                      <TableCell>
                        <Badge className={statusConf.color}>
                          <StatusIcon className={`h-3 w-3 mr-1 ${backup.status === 'IN_PROGRESS' ? 'animate-spin' : ''}`} />
                          {backup.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-mono text-gray-500">{backup.fileName || '-'}</TableCell>
                      <TableCell className="text-sm">{formatSize(backup.fileSize || null)}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {backup.completedAt
                          ? `${((new Date(backup.completedAt).getTime() - new Date(backup.startedAt).getTime()) / 1000).toFixed(1)}s`
                          : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
