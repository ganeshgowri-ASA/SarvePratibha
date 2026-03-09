'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { REQUISITION_STATUS_LABELS, PRIORITY_LABELS } from '@sarve-pratibha/shared';

interface Requisition {
  id: string;
  title: string;
  department: { name: string };
  designation?: { name: string };
  positions: number;
  filledPositions: number;
  status: string;
  priority: string;
  employmentType: string;
  location?: string;
  createdBy: { firstName: string; lastName: string };
  approvedBy?: { firstName: string; lastName: string };
  createdAt: string;
  closingDate?: string;
  _count: { jobPostings: number };
}

const MOCK_REQUISITIONS: Requisition[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    department: { name: 'Engineering' },
    designation: { name: 'SSE' },
    positions: 3,
    filledPositions: 1,
    status: 'OPEN',
    priority: 'HIGH',
    employmentType: 'FULL_TIME',
    location: 'Bangalore',
    createdBy: { firstName: 'Priya', lastName: 'Sharma' },
    approvedBy: { firstName: 'Rajesh', lastName: 'Kumar' },
    createdAt: '2026-02-15T00:00:00Z',
    closingDate: '2026-04-15T00:00:00Z',
    _count: { jobPostings: 1 },
  },
  {
    id: '2',
    title: 'Product Manager',
    department: { name: 'Product' },
    positions: 1,
    filledPositions: 0,
    status: 'PENDING_APPROVAL',
    priority: 'MEDIUM',
    employmentType: 'FULL_TIME',
    location: 'Mumbai',
    createdBy: { firstName: 'Amit', lastName: 'Patel' },
    createdAt: '2026-03-01T00:00:00Z',
    _count: { jobPostings: 0 },
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    department: { name: 'Design' },
    positions: 2,
    filledPositions: 0,
    status: 'APPROVED',
    priority: 'MEDIUM',
    employmentType: 'FULL_TIME',
    location: 'Bangalore',
    createdBy: { firstName: 'Sneha', lastName: 'Reddy' },
    approvedBy: { firstName: 'Rajesh', lastName: 'Kumar' },
    createdAt: '2026-03-05T00:00:00Z',
    closingDate: '2026-04-30T00:00:00Z',
    _count: { jobPostings: 0 },
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    department: { name: 'Engineering' },
    positions: 1,
    filledPositions: 1,
    status: 'CLOSED',
    priority: 'HIGH',
    employmentType: 'FULL_TIME',
    location: 'Hyderabad',
    createdBy: { firstName: 'Vikram', lastName: 'Singh' },
    approvedBy: { firstName: 'Rajesh', lastName: 'Kumar' },
    createdAt: '2026-01-20T00:00:00Z',
    _count: { jobPostings: 1 },
  },
  {
    id: '5',
    title: 'Data Analyst Intern',
    department: { name: 'Analytics' },
    positions: 2,
    filledPositions: 0,
    status: 'DRAFT',
    priority: 'LOW',
    employmentType: 'INTERN',
    location: 'Remote',
    createdBy: { firstName: 'Neha', lastName: 'Gupta' },
    createdAt: '2026-03-08T00:00:00Z',
    _count: { jobPostings: 0 },
  },
];

function getStatusBadgeVariant(status: string) {
  const map: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    DRAFT: 'secondary',
    PENDING_APPROVAL: 'outline',
    APPROVED: 'default',
    OPEN: 'default',
    REJECTED: 'destructive',
    ON_HOLD: 'outline',
    CLOSED: 'secondary',
    CANCELLED: 'destructive',
  };
  return map[status] || 'secondary';
}

function getPriorityColor(priority: string) {
  const map: Record<string, string> = {
    LOW: 'text-gray-600',
    MEDIUM: 'text-blue-600',
    HIGH: 'text-orange-600',
    URGENT: 'text-red-600',
  };
  return map[priority] || '';
}

export default function RequisitionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [requisitions] = useState<Requisition[]>(MOCK_REQUISITIONS);

  const filtered = requisitions.filter((r) => {
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Requisitions</h1>
          <p className="text-gray-500 mt-1">Create and manage hiring requisitions</p>
        </div>
        <Link href="/recruitment/requisitions/new">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="mr-2 h-4 w-4" />
            New Requisition
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search requisitions..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
              <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                {Object.entries(REQUISITION_STATUS_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label as string}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requisitions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Job Title</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Department</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Positions</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Priority</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Created By</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/recruitment/pipeline/${req.id}`} className="font-medium text-teal-700 hover:underline">
                        {req.title}
                      </Link>
                      {req.location && (
                        <p className="text-xs text-gray-400">{req.location} &middot; {req.employmentType.replace('_', ' ')}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{req.department.name}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{req.filledPositions}</span>
                      <span className="text-gray-400">/{req.positions}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusBadgeVariant(req.status)}>
                        {REQUISITION_STATUS_LABELS[req.status] || req.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${getPriorityColor(req.priority)}`}>
                        {PRIORITY_LABELS[req.priority] || req.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {req.createdBy.firstName} {req.createdBy.lastName}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/recruitment/pipeline/${req.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {req.status === 'PENDING_APPROVAL' && (
                          <>
                            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No requisitions found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
