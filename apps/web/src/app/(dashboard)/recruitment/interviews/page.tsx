'use client';

import { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { INTERVIEW_MODE_LABELS } from '@sarve-pratibha/shared';

interface Interview {
  id: string;
  candidateName: string;
  jobTitle: string;
  interviewerName: string;
  scheduledAt: string;
  duration: number;
  round: number;
  mode: string;
  location?: string;
  meetingLink?: string;
  result: string;
}

const MOCK_INTERVIEWS: Interview[] = [
  {
    id: '1', candidateName: 'Arjun Mehta', jobTitle: 'Senior Software Engineer',
    interviewerName: 'Priya Sharma', scheduledAt: '2026-03-10T10:00:00Z', duration: 60,
    round: 2, mode: 'IN_PERSON', location: 'Conference Room A', result: 'PENDING',
  },
  {
    id: '2', candidateName: 'Lakshmi Rao', jobTitle: 'Senior Software Engineer',
    interviewerName: 'Vikram Singh', scheduledAt: '2026-03-10T14:00:00Z', duration: 45,
    round: 1, mode: 'VIDEO', meetingLink: 'https://meet.google.com/abc-xyz', result: 'PENDING',
  },
  {
    id: '3', candidateName: 'Meera Krishnan', jobTitle: 'Product Manager',
    interviewerName: 'Rajesh Kumar', scheduledAt: '2026-03-11T11:00:00Z', duration: 60,
    round: 1, mode: 'VIDEO', meetingLink: 'https://meet.google.com/def-ghi', result: 'PENDING',
  },
  {
    id: '4', candidateName: 'Pooja Shah', jobTitle: 'Senior Software Engineer',
    interviewerName: 'Priya Sharma', scheduledAt: '2026-03-12T10:30:00Z', duration: 45,
    round: 1, mode: 'PHONE', result: 'PENDING',
  },
  {
    id: '5', candidateName: 'Vivek Gupta', jobTitle: 'Senior Software Engineer',
    interviewerName: 'Vikram Singh', scheduledAt: '2026-03-08T15:00:00Z', duration: 60,
    round: 3, mode: 'IN_PERSON', location: 'Board Room', result: 'SELECTED',
  },
  {
    id: '6', candidateName: 'Rohit Verma', jobTitle: 'DevOps Engineer',
    interviewerName: 'Rajesh Kumar', scheduledAt: '2026-03-07T11:00:00Z', duration: 45,
    round: 1, mode: 'VIDEO', result: 'REJECTED',
  },
];

function getModeIcon(mode: string) {
  switch (mode) {
    case 'VIDEO': return <Video className="h-4 w-4" />;
    case 'PHONE': return <Phone className="h-4 w-4" />;
    default: return <MapPin className="h-4 w-4" />;
  }
}

function getResultBadge(result: string) {
  const map: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
    PENDING: { variant: 'outline', label: 'Pending' },
    SELECTED: { variant: 'default', label: 'Selected' },
    REJECTED: { variant: 'destructive', label: 'Rejected' },
    ON_HOLD: { variant: 'secondary', label: 'On Hold' },
  };
  const { variant, label } = map[result] || { variant: 'outline' as const, label: result };
  return <Badge variant={variant}>{label}</Badge>;
}

export default function InterviewsPage() {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  const now = new Date();
  const filtered = MOCK_INTERVIEWS.filter((i) => {
    const interviewDate = new Date(i.scheduledAt);
    if (filter === 'upcoming') return interviewDate >= now;
    if (filter === 'past') return interviewDate < now;
    return true;
  }).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  // Group by date
  const grouped = filtered.reduce<Record<string, Interview[]>>((acc, interview) => {
    const dateKey = new Date(interview.scheduledAt).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(interview);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
          <p className="text-gray-500 mt-1">View and manage interview schedules</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setShowScheduleDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Interview
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['upcoming', 'past', 'all'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className={filter === f ? 'bg-teal-600 hover:bg-teal-700' : ''}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* Interview List grouped by date */}
      {Object.entries(grouped).map(([dateKey, interviews]) => (
        <div key={dateKey}>
          <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {dateKey}
          </h3>
          <div className="space-y-3">
            {interviews.map((interview) => (
              <Card key={interview.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="text-center min-w-[60px]">
                        <p className="text-lg font-bold text-teal-600">
                          {new Date(interview.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </p>
                        <p className="text-xs text-gray-400">{interview.duration} min</p>
                      </div>
                      <div>
                        <p className="font-semibold">{interview.candidateName}</p>
                        <p className="text-sm text-gray-600">{interview.jobTitle} · Round {interview.round}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" /> {interview.interviewerName}
                          </span>
                          <span className="flex items-center gap-1">
                            {getModeIcon(interview.mode)}
                            {INTERVIEW_MODE_LABELS[interview.mode]}
                          </span>
                          {interview.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {interview.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getResultBadge(interview.result)}
                      {interview.result === 'PENDING' && new Date(interview.scheduledAt) < now && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedInterview(interview);
                            setShowFeedbackDialog(true);
                          }}
                        >
                          Add Feedback
                        </Button>
                      )}
                      {interview.meetingLink && (
                        <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <Video className="h-3 w-3 mr-1" /> Join
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No {filter === 'all' ? '' : filter} interviews found.
        </div>
      )}

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-lg" onClose={() => setShowScheduleDialog(false)}>
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); setShowScheduleDialog(false); }}>
            <div className="space-y-4 py-4">
              <div>
                <Label>Application *</Label>
                <Select required>
                  <option value="">Select Application</option>
                  <option value="a1">Suresh Kumar - Senior SE</option>
                  <option value="a2">Divya Agarwal - Senior SE</option>
                  <option value="a4">Pooja Shah - Senior SE</option>
                </Select>
              </div>
              <div>
                <Label>Interviewer *</Label>
                <Select required>
                  <option value="">Select Interviewer</option>
                  <option value="emp1">Priya Sharma (Engineering Lead)</option>
                  <option value="emp2">Vikram Singh (Tech Architect)</option>
                  <option value="emp3">Rajesh Kumar (Section Head)</option>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Date & Time *</Label>
                  <Input type="datetime-local" required />
                </div>
                <div>
                  <Label>Duration (min) *</Label>
                  <Input type="number" defaultValue="60" min="15" max="480" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Round *</Label>
                  <Input type="number" defaultValue="1" min="1" required />
                </div>
                <div>
                  <Label>Mode *</Label>
                  <Select defaultValue="VIDEO" required>
                    <option value="IN_PERSON">In Person</option>
                    <option value="VIDEO">Video Call</option>
                    <option value="PHONE">Phone</option>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Location / Meeting Link</Label>
                <Input placeholder="Conference room or meeting URL" />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea rows={2} placeholder="Any special instructions..." />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowScheduleDialog(false)}>Cancel</Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">Schedule</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="max-w-lg" onClose={() => setShowFeedbackDialog(false)}>
          <DialogHeader>
            <DialogTitle>Interview Feedback</DialogTitle>
          </DialogHeader>
          {selectedInterview && (
            <form onSubmit={(e) => { e.preventDefault(); setShowFeedbackDialog(false); }}>
              <p className="text-sm text-gray-500 mb-4">
                {selectedInterview.candidateName} · Round {selectedInterview.round} · {selectedInterview.jobTitle}
              </p>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Technical Rating (1-5)</Label>
                    <Input type="number" min="1" max="5" placeholder="1-5" />
                  </div>
                  <div>
                    <Label>Communication Rating (1-5)</Label>
                    <Input type="number" min="1" max="5" placeholder="1-5" />
                  </div>
                  <div>
                    <Label>Culture Fit Rating (1-5)</Label>
                    <Input type="number" min="1" max="5" placeholder="1-5" />
                  </div>
                  <div>
                    <Label>Overall Rating (1-5)</Label>
                    <Input type="number" min="1" max="5" step="0.1" placeholder="1-5" />
                  </div>
                </div>
                <div>
                  <Label>Recommendation</Label>
                  <Select>
                    <option value="">Select...</option>
                    <option value="STRONG_HIRE">Strong Hire</option>
                    <option value="HIRE">Hire</option>
                    <option value="NO_HIRE">No Hire</option>
                    <option value="STRONG_NO_HIRE">Strong No Hire</option>
                  </Select>
                </div>
                <div>
                  <Label>Strengths</Label>
                  <Textarea rows={2} placeholder="Key strengths observed..." />
                </div>
                <div>
                  <Label>Areas to Improve</Label>
                  <Textarea rows={2} placeholder="Areas that need improvement..." />
                </div>
                <div>
                  <Label>Comments</Label>
                  <Textarea rows={2} placeholder="Additional comments..." />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowFeedbackDialog(false)}>Cancel</Button>
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700">Submit Feedback</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
