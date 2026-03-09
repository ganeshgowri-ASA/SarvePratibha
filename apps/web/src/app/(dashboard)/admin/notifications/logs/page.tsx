'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { apiFetch } from '@/lib/api';
import type { EmailLogItem, SMSLogItem, ApiResponse, PaginatedResponse } from '@sarve-pratibha/shared';

const EMAIL_STATUS_CONFIG: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
  QUEUED: { icon: Clock, color: 'text-yellow-600 bg-yellow-50', label: 'Queued' },
  SENT: { icon: CheckCircle2, color: 'text-blue-600 bg-blue-50', label: 'Sent' },
  DELIVERED: { icon: CheckCircle2, color: 'text-green-600 bg-green-50', label: 'Delivered' },
  FAILED: { icon: XCircle, color: 'text-red-600 bg-red-50', label: 'Failed' },
  BOUNCED: { icon: AlertCircle, color: 'text-orange-600 bg-orange-50', label: 'Bounced' },
};

const SMS_STATUS_CONFIG: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
  QUEUED: { icon: Clock, color: 'text-yellow-600 bg-yellow-50', label: 'Queued' },
  SENT: { icon: CheckCircle2, color: 'text-blue-600 bg-blue-50', label: 'Sent' },
  DELIVERED: { icon: CheckCircle2, color: 'text-green-600 bg-green-50', label: 'Delivered' },
  FAILED: { icon: XCircle, color: 'text-red-600 bg-red-50', label: 'Failed' },
};

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NotificationLogsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const token = (session?.user as any)?.accessToken;

  const [emailLogs, setEmailLogs] = useState<EmailLogItem[]>([]);
  const [smsLogs, setSmsLogs] = useState<SMSLogItem[]>([]);
  const [emailLoading, setEmailLoading] = useState(true);
  const [smsLoading, setSmsLoading] = useState(true);
  const [emailPage, setEmailPage] = useState(1);
  const [smsPage, setSmsPage] = useState(1);
  const [emailTotalPages, setEmailTotalPages] = useState(1);
  const [smsTotalPages, setSmsTotalPages] = useState(1);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchEmailLogs = useCallback(async () => {
    if (!token) return;
    try {
      setEmailLoading(true);
      const params = new URLSearchParams({ page: String(emailPage), limit: '20' });
      if (dateFrom) params.set('from', dateFrom);
      if (dateTo) params.set('to', dateTo);
      if (statusFilter) params.set('status', statusFilter);

      const data = await apiFetch<PaginatedResponse<EmailLogItem>>(
        `/api/notifications/logs/email?${params}`,
        { token },
      );
      setEmailLogs(data.data || []);
      setEmailTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch email logs:', error);
    } finally {
      setEmailLoading(false);
    }
  }, [token, emailPage, dateFrom, dateTo, statusFilter]);

  const fetchSmsLogs = useCallback(async () => {
    if (!token) return;
    try {
      setSmsLoading(true);
      const params = new URLSearchParams({ page: String(smsPage), limit: '20' });
      if (dateFrom) params.set('from', dateFrom);
      if (dateTo) params.set('to', dateTo);
      if (statusFilter) params.set('status', statusFilter);

      const data = await apiFetch<PaginatedResponse<SMSLogItem>>(
        `/api/notifications/logs/sms?${params}`,
        { token },
      );
      setSmsLogs(data.data || []);
      setSmsTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch SMS logs:', error);
    } finally {
      setSmsLoading(false);
    }
  }, [token, smsPage, dateFrom, dateTo, statusFilter]);

  useEffect(() => { fetchEmailLogs(); }, [fetchEmailLogs]);
  useEffect(() => { fetchSmsLogs(); }, [fetchSmsLogs]);

  const handleRefresh = () => {
    fetchEmailLogs();
    fetchSmsLogs();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/admin/notifications')}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Delivery Logs</h1>
            <p className="text-sm text-gray-500 mt-0.5">Monitor email and SMS delivery status</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw size={14} className="mr-1.5" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div>
              <Label className="text-xs text-gray-500">From Date</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-40"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">To Date</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-40"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Status</Label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                <SelectTrigger className="w-36"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="QUEUED">Queued</SelectItem>
                  <SelectItem value="SENT">Sent</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Tabs */}
      <Tabs defaultValue="email">
        <TabsList>
          <TabsTrigger value="email">
            <Mail size={14} className="mr-1.5" />
            Email Logs
          </TabsTrigger>
          <TabsTrigger value="sms">
            <MessageSquare size={14} className="mr-1.5" />
            SMS Logs
          </TabsTrigger>
        </TabsList>

        {/* Email Logs */}
        <TabsContent value="email">
          {emailLoading ? (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">Loading email logs...</CardContent>
            </Card>
          ) : emailLogs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Mail size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No email logs found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {emailLogs.map((log) => {
                const statusConf = EMAIL_STATUS_CONFIG[log.status] || EMAIL_STATUS_CONFIG.QUEUED;
                const StatusIcon = statusConf.icon;

                return (
                  <Card key={log.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${statusConf.color}`}>
                            <StatusIcon size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{log.subject}</p>
                            <p className="text-xs text-gray-500 mt-0.5">To: {log.to}</p>
                            {log.error && (
                              <p className="text-xs text-red-500 mt-1">Error: {log.error}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge className={statusConf.color} variant="secondary">
                            {statusConf.label}
                          </Badge>
                          <p className="text-xs text-gray-400 mt-1">{formatDateTime(log.createdAt)}</p>
                          {log.provider && (
                            <p className="text-[10px] text-gray-400">via {log.provider}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {emailTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button variant="outline" size="sm" onClick={() => setEmailPage((p) => Math.max(1, p - 1))} disabled={emailPage === 1}>
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500">Page {emailPage} of {emailTotalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setEmailPage((p) => Math.min(emailTotalPages, p + 1))} disabled={emailPage === emailTotalPages}>
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* SMS Logs */}
        <TabsContent value="sms">
          {smsLoading ? (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">Loading SMS logs...</CardContent>
            </Card>
          ) : smsLogs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No SMS logs found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {smsLogs.map((log) => {
                const statusConf = SMS_STATUS_CONFIG[log.status] || SMS_STATUS_CONFIG.QUEUED;
                const StatusIcon = statusConf.icon;

                return (
                  <Card key={log.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${statusConf.color}`}>
                            <StatusIcon size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 line-clamp-2">{log.message}</p>
                            <p className="text-xs text-gray-500 mt-0.5">To: {log.to}</p>
                            {log.error && (
                              <p className="text-xs text-red-500 mt-1">Error: {log.error}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge className={statusConf.color} variant="secondary">
                            {statusConf.label}
                          </Badge>
                          <p className="text-xs text-gray-400 mt-1">{formatDateTime(log.createdAt)}</p>
                          {log.provider && (
                            <p className="text-[10px] text-gray-400">via {log.provider}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {smsTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button variant="outline" size="sm" onClick={() => setSmsPage((p) => Math.max(1, p - 1))} disabled={smsPage === 1}>
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500">Page {smsPage} of {smsTotalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setSmsPage((p) => Math.min(smsTotalPages, p + 1))} disabled={smsPage === smsTotalPages}>
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
