'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, FileText, Filter } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface LeaveRequest {
  id: string;
  leaveType: { name: string; code: string };
  startDate: string;
  endDate: string;
  days: number;
  startDayType: string;
  endDayType: string;
  reason: string;
  status: string;
  remarks?: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  APPROVED: 'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  REJECTED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function LeaveHistoryPage() {
  const { data: session } = useSession();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = (session?.user as any)?.accessToken;
  const employeeId = (session?.user as any)?.employeeId;

  useEffect(() => {
    if (!token || !employeeId) return;

    async function loadHistory() {
      setLoading(true);
      try {
        let url = `/api/leave/history/${employeeId}?page=${page}&limit=15`;
        if (yearFilter) url += `&year=${yearFilter}`;

        const res = await apiFetch<LeaveRequest[]>(url, { token });
        let data = (res.data || []) as LeaveRequest[];

        if (statusFilter) {
          data = data.filter((l) => l.status === statusFilter);
        }

        setLeaves(data);
        setTotalPages(res.pagination?.totalPages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [token, employeeId, page, yearFilter, statusFilter]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/leave-attendance">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave History</h1>
          <p className="text-sm text-gray-500">View all your past leave requests</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <Filter size={16} className="text-gray-500" />
            <Select
              className="w-36"
              value={yearFilter}
              onChange={(e) => { setYearFilter(e.target.value); setPage(1); }}
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </Select>
            <Select
              className="w-40"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leave Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText size={18} className="text-teal-600" />
            Leave Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-sm text-gray-500">Loading...</div>
          ) : leaves.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">No leave requests found</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaves.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell className="font-medium">
                        {leave.leaveType.name}
                        <span className="text-xs text-gray-400 ml-1">({leave.leaveType.code})</span>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(leave.startDate)}</TableCell>
                      <TableCell className="text-sm">{formatDate(leave.endDate)}</TableCell>
                      <TableCell>
                        {leave.days}
                        {leave.startDayType !== 'FULL' && (
                          <span className="text-xs text-gray-400 block">{leave.startDayType.replace('_', ' ')}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 max-w-[200px] truncate">
                        {leave.reason}
                      </TableCell>
                      <TableCell>
                        <Badge className={STATUS_STYLES[leave.status] || 'bg-gray-100'}>
                          {leave.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(leave.createdAt)}
                      </TableCell>
                      <TableCell>
                        {leave.status === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 h-7 text-xs"
                            onClick={async () => {
                              try {
                                await apiFetch(`/api/leave/${leave.id}/cancel`, {
                                  method: 'PUT',
                                  token,
                                  body: JSON.stringify({}),
                                });
                                setLeaves((prev) =>
                                  prev.map((l) => (l.id === leave.id ? { ...l, status: 'CANCELLED' } : l)),
                                );
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center text-sm text-gray-500">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
