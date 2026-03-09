'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, AlertCircle, ClipboardCheck } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface Regularization {
  id: string;
  date: string;
  reason: string;
  requestedStatus: string;
  status: string;
  remarks?: string;
  createdAt: string;
  employee?: { firstName: string; lastName: string; employeeId: string };
}

const STATUS_STYLES: Record<string, string> = {
  APPROVED: 'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  REJECTED: 'bg-red-100 text-red-700',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function RegularizePage() {
  const { data: session } = useSession();
  const [regularizations, setRegularizations] = useState<Regularization[]>([]);
  const [teamRegularizations, setTeamRegularizations] = useState<Regularization[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [requestedStatus, setRequestedStatus] = useState('PRESENT');

  const token = (session?.user as any)?.accessToken;
  const userRole = (session?.user as any)?.role;
  const isManager = userRole === 'MANAGER' || userRole === 'SECTION_HEAD' || userRole === 'IT_ADMIN';

  useEffect(() => {
    if (!token) return;

    async function loadData() {
      try {
        const [ownRes] = await Promise.all([
          apiFetch<Regularization[]>('/api/attendance/regularizations', { token }),
        ]);
        setRegularizations(ownRes.data || []);

        if (isManager) {
          const teamRes = await apiFetch<Regularization[]>('/api/attendance/regularizations?team=true', { token });
          setTeamRegularizations((teamRes.data || []).filter((r) => r.status === 'PENDING'));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token, isManager]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const res = await apiFetch<Regularization>('/api/attendance/regularize', {
        method: 'POST',
        token,
        body: JSON.stringify({ date, reason, requestedStatus }),
      });

      setSuccess('Regularization request submitted successfully');
      setDate('');
      setReason('');
      setRequestedStatus('PRESENT');

      if (res.data) {
        setRegularizations((prev) => [res.data!, ...prev]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleApprove(id: string) {
    try {
      await apiFetch(`/api/attendance/regularize/${id}/approve`, {
        method: 'PUT',
        token,
        body: JSON.stringify({}),
      });
      setTeamRegularizations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleReject(id: string) {
    try {
      await apiFetch(`/api/attendance/regularize/${id}/reject`, {
        method: 'PUT',
        token,
        body: JSON.stringify({}),
      });
      setTeamRegularizations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/leave-attendance/attendance">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Regularization</h1>
          <p className="text-sm text-gray-500">Request corrections to your attendance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Apply Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardCheck size={18} className="text-teal-600" />
              New Regularization Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm mb-4">
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm mb-4 flex items-center gap-2">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Requested Status *</Label>
                <Select
                  id="status"
                  value={requestedStatus}
                  onChange={(e) => setRequestedStatus(e.target.value)}
                >
                  <option value="PRESENT">Present</option>
                  <option value="HALF_DAY">Half Day</option>
                  <option value="WORK_FROM_HOME">Work From Home</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason *</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why regularization is needed..."
                  required
                  maxLength={500}
                  rows={3}
                />
              </div>
              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700"
                disabled={submitting || !date || !reason}
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* My Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">My Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {regularizations.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">No regularization requests</p>
            ) : (
              <div className="divide-y max-h-[400px] overflow-y-auto">
                {regularizations.map((reg) => (
                  <div key={reg.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{formatDate(reg.date)}</p>
                      <Badge className={STATUS_STYLES[reg.status] || ''}>
                        {reg.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{reg.reason}</p>
                    <p className="text-xs text-gray-400">Requested: {reg.requestedStatus.replace('_', ' ')}</p>
                    {reg.remarks && <p className="text-xs text-blue-500 mt-0.5">Remarks: {reg.remarks}</p>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Manager: Team Regularization Approvals */}
      {isManager && teamRegularizations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Team Regularization Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Requested Status</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamRegularizations.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell className="font-medium">
                      {reg.employee?.firstName} {reg.employee?.lastName}
                    </TableCell>
                    <TableCell>{formatDate(reg.date)}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-700">
                        {reg.requestedStatus.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{reg.reason}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 h-7 text-xs" onClick={() => handleApprove(reg.id)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => handleReject(reg.id)}>
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
