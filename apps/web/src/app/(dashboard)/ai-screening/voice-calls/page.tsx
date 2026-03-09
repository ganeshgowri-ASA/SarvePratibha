'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Plus,
  Eye,
  Search,
  Radio,
  Clock,
} from 'lucide-react';

const mockCalls = [
  { id: '1', candidateName: 'Priya Sharma', candidatePhone: '+91-9876543210', provider: 'VAPI', status: 'COMPLETED', duration: 1080, startedAt: '2026-03-08T10:30:00Z', endedAt: '2026-03-08T10:48:00Z', direction: 'outbound' },
  { id: '2', candidateName: 'Rahul Verma', candidatePhone: '+91-9876543211', provider: 'VAPI', status: 'COMPLETED', duration: 720, startedAt: '2026-03-08T09:15:00Z', endedAt: '2026-03-08T09:27:00Z', direction: 'outbound' },
  { id: '3', candidateName: 'Anita Desai', candidatePhone: '+91-9876543212', provider: 'RETELL', status: 'IN_PROGRESS', duration: null, startedAt: '2026-03-09T11:00:00Z', endedAt: null, direction: 'outbound' },
  { id: '4', candidateName: 'Karan Mehta', candidatePhone: '+91-9876543213', provider: 'VAPI', status: 'NO_ANSWER', duration: null, startedAt: null, endedAt: null, direction: 'outbound' },
  { id: '5', candidateName: 'Sneha Patel', candidatePhone: '+91-9876543214', provider: 'SARVAM', status: 'COMPLETED', duration: 960, startedAt: '2026-03-07T16:30:00Z', endedAt: '2026-03-07T16:46:00Z', direction: 'outbound' },
  { id: '6', candidateName: 'Amit Kumar', candidatePhone: '+91-9876543215', provider: 'RETELL', status: 'QUEUED', duration: null, startedAt: null, endedAt: null, direction: 'outbound' },
  { id: '7', candidateName: 'Deepa Nair', candidatePhone: '+91-9876543216', provider: 'VAPI', status: 'FAILED', duration: null, startedAt: null, endedAt: null, direction: 'outbound' },
];

function getStatusBadge(status: string) {
  const config: Record<string, { color: string; icon: React.ReactNode }> = {
    COMPLETED: { color: 'bg-green-100 text-green-800', icon: <Phone className="h-3 w-3" /> },
    IN_PROGRESS: { color: 'bg-blue-100 text-blue-800', icon: <PhoneCall className="h-3 w-3" /> },
    QUEUED: { color: 'bg-amber-100 text-amber-800', icon: <Clock className="h-3 w-3" /> },
    RINGING: { color: 'bg-purple-100 text-purple-800', icon: <Radio className="h-3 w-3" /> },
    FAILED: { color: 'bg-red-100 text-red-800', icon: <PhoneOff className="h-3 w-3" /> },
    NO_ANSWER: { color: 'bg-gray-100 text-gray-800', icon: <PhoneOff className="h-3 w-3" /> },
    BUSY: { color: 'bg-orange-100 text-orange-800', icon: <PhoneOff className="h-3 w-3" /> },
  };
  const c = config[status] || config.QUEUED;
  return (
    <Badge className={c.color} variant="secondary">
      <span className="flex items-center gap-1">{c.icon} {status.replace('_', ' ')}</span>
    </Badge>
  );
}

function formatDuration(seconds: number | null) {
  if (!seconds) return '--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export default function VoiceCallsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showInitiateDialog, setShowInitiateDialog] = useState(false);

  const filtered = mockCalls.filter((call) => {
    const matchSearch = call.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      call.candidatePhone.includes(search);
    const matchStatus = statusFilter === 'ALL' || call.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeCalls = mockCalls.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'RINGING').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Phone className="h-6 w-6 text-teal-600" />
            Voice Call Manager
          </h1>
          <p className="text-gray-500 mt-1">Initiate and monitor AI voice screening calls</p>
        </div>
        <div className="flex items-center gap-3">
          {activeCalls > 0 && (
            <Badge className="bg-blue-100 text-blue-800" variant="secondary">
              <Radio className="h-3 w-3 mr-1 animate-pulse" />
              {activeCalls} Active Call{activeCalls > 1 ? 's' : ''}
            </Badge>
          )}
          <Button onClick={() => setShowInitiateDialog(true)} className="bg-teal-600 hover:bg-teal-700">
            <PhoneCall className="h-4 w-4 mr-2" />
            Initiate Call
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="QUEUED">Queued</SelectItem>
                <SelectItem value="RINGING">Ringing</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="NO_ANSWER">No Answer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Calls Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="font-medium">{call.candidateName}</TableCell>
                  <TableCell className="text-sm text-gray-500">{call.candidatePhone}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{call.provider}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(call.status)}</TableCell>
                  <TableCell className="text-sm">{formatDuration(call.duration)}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {call.startedAt ? new Date(call.startedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '--'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {call.status === 'IN_PROGRESS' && (
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <PhoneOff className="h-3.5 w-3.5 mr-1" /> End
                        </Button>
                      )}
                      {call.status === 'COMPLETED' && (
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3.5 w-3.5 mr-1" /> Transcript
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No voice calls found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Initiate Call Dialog */}
      <Dialog open={showInitiateDialog} onOpenChange={setShowInitiateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Initiate AI Voice Call</DialogTitle>
            <DialogDescription>Start an AI-powered screening call with a candidate.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Candidate Name</Label>
              <Input placeholder="Enter candidate name" />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input placeholder="+91-XXXXXXXXXX" />
            </div>
            <div className="space-y-2">
              <Label>Voice Provider</Label>
              <Select defaultValue="VAPI">
                <option value="VAPI">Vapi.ai</option>
                <option value="RETELL">Retell AI</option>
                <option value="ELEVENLABS">ElevenLabs</option>
                <option value="SARVAM">Sarvam AI (Indian Languages)</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Screening Session (Optional)</Label>
              <Select>
                <option value="">No linked session</option>
                <option value="1">Session #1 - Priya Sharma</option>
                <option value="2">Session #2 - Rahul Verma</option>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInitiateDialog(false)}>Cancel</Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setShowInitiateDialog(false)}>
              <PhoneCall className="h-4 w-4 mr-2" />
              Start Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
