'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
  Bot,
  Search,
  Plus,
  Eye,
  Filter,
} from 'lucide-react';

// Mock data
const mockSessions = [
  { id: '1', candidateName: 'Priya Sharma', candidateEmail: 'priya@example.com', jobTitle: 'Senior Software Engineer', status: 'COMPLETED', overallScore: 85, recommendation: 'STRONG_SHORTLIST', createdAt: '2026-03-08T10:30:00Z' },
  { id: '2', candidateName: 'Rahul Verma', candidateEmail: 'rahul@example.com', jobTitle: 'Product Manager', status: 'COMPLETED', overallScore: 72, recommendation: 'SHORTLIST', createdAt: '2026-03-08T09:15:00Z' },
  { id: '3', candidateName: 'Anita Desai', candidateEmail: 'anita@example.com', jobTitle: 'Data Scientist', status: 'IN_PROGRESS', overallScore: null, recommendation: null, createdAt: '2026-03-08T11:00:00Z' },
  { id: '4', candidateName: 'Karan Mehta', candidateEmail: 'karan@example.com', jobTitle: 'DevOps Engineer', status: 'COMPLETED', overallScore: 58, recommendation: 'HOLD', createdAt: '2026-03-07T14:20:00Z' },
  { id: '5', candidateName: 'Sneha Patel', candidateEmail: 'sneha@example.com', jobTitle: 'UI/UX Designer', status: 'COMPLETED', overallScore: 91, recommendation: 'STRONG_SHORTLIST', createdAt: '2026-03-07T16:45:00Z' },
  { id: '6', candidateName: 'Amit Kumar', candidateEmail: 'amit@example.com', jobTitle: 'Backend Engineer', status: 'PENDING', overallScore: null, recommendation: null, createdAt: '2026-03-09T08:00:00Z' },
  { id: '7', candidateName: 'Deepa Nair', candidateEmail: 'deepa@example.com', jobTitle: 'QA Lead', status: 'FAILED', overallScore: null, recommendation: null, createdAt: '2026-03-06T12:00:00Z' },
  { id: '8', candidateName: 'Vikram Singh', candidateEmail: 'vikram@example.com', jobTitle: 'Senior Software Engineer', status: 'COMPLETED', overallScore: 44, recommendation: 'REJECT', createdAt: '2026-03-06T10:30:00Z' },
];

function getStatusBadge(status: string) {
  const colors: Record<string, string> = {
    COMPLETED: 'bg-green-100 text-green-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    PENDING: 'bg-amber-100 text-amber-800',
    FAILED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
  };
  return <Badge className={colors[status] || 'bg-gray-100 text-gray-800'} variant="secondary">{status.replace('_', ' ')}</Badge>;
}

function getRecBadge(rec: string | null) {
  if (!rec) return null;
  const colors: Record<string, string> = {
    STRONG_SHORTLIST: 'bg-green-100 text-green-800',
    SHORTLIST: 'bg-blue-100 text-blue-800',
    HOLD: 'bg-amber-100 text-amber-800',
    REJECT: 'bg-red-100 text-red-800',
  };
  return <Badge className={colors[rec] || 'bg-gray-100 text-gray-800'} variant="secondary">{rec.replace('_', ' ')}</Badge>;
}

export default function ScreeningSessionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showNewDialog, setShowNewDialog] = useState(false);

  const filtered = mockSessions.filter((s) => {
    const matchSearch = s.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      s.candidateEmail.toLowerCase().includes(search.toLowerCase()) ||
      s.jobTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Screening Sessions</h1>
          <p className="text-gray-500 mt-1">Manage AI screening sessions for candidates</p>
        </div>
        <Button onClick={() => setShowNewDialog(true)} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          New Session
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40">
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Recommendation</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{session.candidateName}</p>
                      <p className="text-sm text-gray-500">{session.candidateEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>{session.jobTitle}</TableCell>
                  <TableCell>{getStatusBadge(session.status)}</TableCell>
                  <TableCell>
                    {session.overallScore !== null ? (
                      <div className="flex items-center gap-2">
                        <Progress value={session.overallScore} className="w-16 h-2" />
                        <span className="text-sm font-medium">{session.overallScore}%</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">--</span>
                    )}
                  </TableCell>
                  <TableCell>{getRecBadge(session.recommendation)}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(session.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/ai-screening/session/${session.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No screening sessions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Session Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Initiate AI Screening</DialogTitle>
            <DialogDescription>Start a new AI-powered screening session for a candidate.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Candidate Name</Label>
              <Input placeholder="Enter candidate name" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="candidate@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Phone (Optional)</Label>
              <Input placeholder="+91-XXXXXXXXXX" />
            </div>
            <div className="space-y-2">
              <Label>Job Posting</Label>
              <Select>
                <option value="">Select a job posting</option>
                <option value="1">Senior Software Engineer - Engineering</option>
                <option value="2">Product Manager - Product</option>
                <option value="3">Data Scientist - Analytics</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Template (Optional)</Label>
              <Select>
                <option value="">Auto-generate from JD</option>
                <option value="1">Technical Interview - SDE</option>
                <option value="2">Behavioral Assessment</option>
                <option value="3">Leadership Evaluation</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select defaultValue="en">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="kn">Kannada</option>
                <option value="ml">Malayalam</option>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>Cancel</Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setShowNewDialog(false)}>
              <Bot className="h-4 w-4 mr-2" />
              Start Screening
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
