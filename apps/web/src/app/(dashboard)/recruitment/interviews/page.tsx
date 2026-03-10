'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  User,
  Plus,
  Star,
  BarChart3,
  Columns3,
  List,
  ExternalLink,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { INTERVIEW_MODE_LABELS } from '@sarve-pratibha/shared';

// ── Types ────────────────────────────────────────────────────────────────────

interface Interview {
  id: string;
  candidateName: string;
  jobTitle: string;
  department: string;
  interviewerName: string;
  scheduledAt: string;
  duration: number;
  round: number;
  mode: string;
  location?: string;
  meetingLink?: string;
  result: string;
  pipelineStage: string;
  overallScore?: number;
  recommendation?: string;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_INTERVIEWS: Interview[] = [
  {
    id: '1', candidateName: 'Arjun Mehta', jobTitle: 'Senior Software Engineer', department: 'Engineering',
    interviewerName: 'Priya Sharma', scheduledAt: '2026-03-10T10:00:00Z', duration: 60,
    round: 2, mode: 'IN_PERSON', location: 'Conference Room A', result: 'PENDING', pipelineStage: 'ROUND_2',
  },
  {
    id: '2', candidateName: 'Lakshmi Rao', jobTitle: 'Senior Software Engineer', department: 'Engineering',
    interviewerName: 'Vikram Singh', scheduledAt: '2026-03-10T14:00:00Z', duration: 45,
    round: 1, mode: 'VIDEO', meetingLink: 'https://meet.google.com/abc-xyz', result: 'PENDING', pipelineStage: 'SCREENING',
  },
  {
    id: '3', candidateName: 'Meera Krishnan', jobTitle: 'Product Manager', department: 'Product',
    interviewerName: 'Rajesh Kumar', scheduledAt: '2026-03-11T11:00:00Z', duration: 60,
    round: 1, mode: 'VIDEO', meetingLink: 'https://meet.google.com/def-ghi', result: 'PENDING', pipelineStage: 'SCREENING',
  },
  {
    id: '4', candidateName: 'Pooja Shah', jobTitle: 'Senior Software Engineer', department: 'Engineering',
    interviewerName: 'Priya Sharma', scheduledAt: '2026-03-12T10:30:00Z', duration: 45,
    round: 1, mode: 'PHONE', result: 'PENDING', pipelineStage: 'SCREENING',
  },
  {
    id: '5', candidateName: 'Vivek Gupta', jobTitle: 'Senior Software Engineer', department: 'Engineering',
    interviewerName: 'Vikram Singh', scheduledAt: '2026-03-08T15:00:00Z', duration: 60,
    round: 3, mode: 'IN_PERSON', location: 'Board Room', result: 'SELECTED', pipelineStage: 'OFFER',
    overallScore: 4.4, recommendation: 'STRONG_HIRE',
  },
  {
    id: '6', candidateName: 'Rohit Verma', jobTitle: 'DevOps Engineer', department: 'Infrastructure',
    interviewerName: 'Rajesh Kumar', scheduledAt: '2026-03-07T11:00:00Z', duration: 45,
    round: 1, mode: 'VIDEO', result: 'REJECTED', pipelineStage: 'SCREENING',
    overallScore: 2.2, recommendation: 'NO_HIRE',
  },
  {
    id: '7', candidateName: 'Ananya Desai', jobTitle: 'UX Designer', department: 'Design',
    interviewerName: 'Priya Sharma', scheduledAt: '2026-03-09T09:30:00Z', duration: 90,
    round: 2, mode: 'IN_PERSON', location: 'Design Lab', result: 'SELECTED', pipelineStage: 'HR_ROUND',
    overallScore: 4.3, recommendation: 'HIRE',
  },
  {
    id: '8', candidateName: 'Karthik Nair', jobTitle: 'Data Analyst', department: 'Analytics',
    interviewerName: 'Vikram Singh', scheduledAt: '2026-03-13T16:00:00Z', duration: 60,
    round: 1, mode: 'VIDEO', meetingLink: 'https://meet.google.com/jkl-mno', result: 'PENDING', pipelineStage: 'ROUND_1',
  },
  {
    id: '9', candidateName: 'Sneha Patil', jobTitle: 'Senior Software Engineer', department: 'Engineering',
    interviewerName: 'Priya Sharma', scheduledAt: '2026-03-14T10:00:00Z', duration: 60,
    round: 2, mode: 'VIDEO', meetingLink: 'https://meet.google.com/pqr-stu', result: 'PENDING', pipelineStage: 'ROUND_2',
  },
  {
    id: '10', candidateName: 'Amit Joshi', jobTitle: 'Product Manager', department: 'Product',
    interviewerName: 'Rajesh Kumar', scheduledAt: '2026-03-06T14:00:00Z', duration: 60,
    round: 3, mode: 'IN_PERSON', location: 'Board Room', result: 'SELECTED', pipelineStage: 'FINAL',
    overallScore: 3.8, recommendation: 'HIRE',
  },
  {
    id: '11', candidateName: 'Divya Reddy', jobTitle: 'QA Engineer', department: 'Engineering',
    interviewerName: 'Vikram Singh', scheduledAt: '2026-03-15T11:30:00Z', duration: 45,
    round: 1, mode: 'PHONE', result: 'PENDING', pipelineStage: 'SCREENING',
  },
  {
    id: '12', candidateName: 'Rahul Menon', jobTitle: 'DevOps Engineer', department: 'Infrastructure',
    interviewerName: 'Rajesh Kumar', scheduledAt: '2026-03-05T09:00:00Z', duration: 60,
    round: 2, mode: 'IN_PERSON', location: 'Conference Room B', result: 'ON_HOLD', pipelineStage: 'ROUND_2',
    overallScore: 3.1, recommendation: 'MAYBE',
  },
];

// ── Pipeline Stages ──────────────────────────────────────────────────────────

const PIPELINE_STAGES = [
  { key: 'SCREENING', label: 'Screening', color: 'bg-blue-50 border-blue-200', headerColor: 'bg-blue-500' },
  { key: 'ROUND_1', label: 'Round 1', color: 'bg-indigo-50 border-indigo-200', headerColor: 'bg-indigo-500' },
  { key: 'ROUND_2', label: 'Round 2', color: 'bg-purple-50 border-purple-200', headerColor: 'bg-purple-500' },
  { key: 'HR_ROUND', label: 'HR Round', color: 'bg-pink-50 border-pink-200', headerColor: 'bg-pink-500' },
  { key: 'FINAL', label: 'Final', color: 'bg-amber-50 border-amber-200', headerColor: 'bg-amber-500' },
  { key: 'OFFER', label: 'Offer', color: 'bg-green-50 border-green-200', headerColor: 'bg-green-500' },
];

// ── Assessment Summary Data ──────────────────────────────────────────────────

const CATEGORY_AVERAGES = [
  { label: 'Technical Skills', score: 3.7 },
  { label: 'Communication', score: 3.9 },
  { label: 'Cultural Fit', score: 3.8 },
  { label: 'Experience', score: 3.5 },
  { label: 'Leadership', score: 3.1 },
];

const INTERVIEWER_STATS = [
  { name: 'Priya Sharma', conducted: 4, avgScore: 4.1, passRate: 75 },
  { name: 'Vikram Singh', conducted: 4, avgScore: 3.5, passRate: 50 },
  { name: 'Rajesh Kumar', conducted: 4, avgScore: 3.2, passRate: 50 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

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

function getPipelineCardColor(result: string): string {
  switch (result) {
    case 'SELECTED': return 'border-l-green-500';
    case 'REJECTED': return 'border-l-red-500';
    case 'ON_HOLD': return 'border-l-amber-500';
    default: return 'border-l-blue-500';
  }
}

function getRecommendationBadge(rec?: string) {
  if (!rec) return null;
  const styles: Record<string, string> = {
    STRONG_HIRE: 'bg-green-100 text-green-800',
    HIRE: 'bg-emerald-50 text-emerald-700',
    MAYBE: 'bg-amber-50 text-amber-700',
    NO_HIRE: 'bg-red-50 text-red-700',
  };
  const labels: Record<string, string> = {
    STRONG_HIRE: 'Strong Hire',
    HIRE: 'Hire',
    MAYBE: 'Maybe',
    NO_HIRE: 'No Hire',
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[rec] || ''}`}>{labels[rec] || rec}</span>;
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function InterviewsPage() {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
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
      weekday: 'long', day: '2-digit', month: 'short', year: 'numeric',
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(interview);
    return acc;
  }, {});

  // Stats for summary
  const assessed = MOCK_INTERVIEWS.filter((i) => i.overallScore);
  const passCount = assessed.filter((i) => i.recommendation === 'STRONG_HIRE' || i.recommendation === 'HIRE').length;
  const failCount = assessed.filter((i) => i.recommendation === 'NO_HIRE').length;
  const maybeCount = assessed.filter((i) => i.recommendation === 'MAYBE').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
          <p className="text-gray-500 mt-1">Manage interview schedules, pipeline, and assessments</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setShowScheduleDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Interview
        </Button>
      </div>

      {/* Tabs: List / Pipeline / Summary */}
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-1.5">
            <List className="h-4 w-4" /> List View
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="flex items-center gap-1.5">
            <Columns3 className="h-4 w-4" /> Pipeline
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4" /> Assessment Summary
          </TabsTrigger>
        </TabsList>

        {/* ── LIST VIEW TAB ─────────────────────────────────────────────────── */}
        <TabsContent value="list" className="space-y-4 mt-4">
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
                  <Link key={interview.id} href={`/recruitment/interviews/${interview.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
                            {interview.overallScore && (
                              <span className="flex items-center gap-1 text-sm font-medium text-amber-600">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                {interview.overallScore.toFixed(1)}
                              </span>
                            )}
                            {getResultBadge(interview.result)}
                            <ExternalLink className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No {filter === 'all' ? '' : filter} interviews found.
            </div>
          )}
        </TabsContent>

        {/* ── PIPELINE KANBAN TAB ───────────────────────────────────────────── */}
        <TabsContent value="pipeline" className="mt-4">
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {PIPELINE_STAGES.map((stage) => {
                const stageInterviews = MOCK_INTERVIEWS.filter((i) => i.pipelineStage === stage.key);
                return (
                  <div key={stage.key} className={`w-72 rounded-lg border ${stage.color} flex flex-col`}>
                    {/* Stage Header */}
                    <div className={`${stage.headerColor} text-white px-4 py-2.5 rounded-t-lg flex items-center justify-between`}>
                      <span className="font-medium text-sm">{stage.label}</span>
                      <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                        {stageInterviews.length}
                      </Badge>
                    </div>

                    {/* Cards */}
                    <div className="p-3 space-y-3 flex-1">
                      {stageInterviews.length === 0 && (
                        <div className="text-center text-xs text-gray-400 py-4">No candidates</div>
                      )}
                      {stageInterviews.map((interview) => (
                        <Link key={interview.id} href={`/recruitment/interviews/${interview.id}`}>
                          <Card className={`border-l-4 ${getPipelineCardColor(interview.result)} hover:shadow-md transition-shadow cursor-pointer`}>
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between mb-1">
                                <p className="font-medium text-sm">{interview.candidateName}</p>
                                {getResultBadge(interview.result)}
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{interview.jobTitle}</p>
                              <div className="space-y-1 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(interview.scheduledAt).toLocaleDateString('en-IN', {
                                    day: '2-digit', month: 'short',
                                  })}
                                  {' '}
                                  {new Date(interview.scheduledAt).toLocaleTimeString('en-IN', {
                                    hour: '2-digit', minute: '2-digit', hour12: true,
                                  })}
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {interview.interviewerName}
                                </div>
                                <div className="flex items-center gap-1">
                                  {getModeIcon(interview.mode)}
                                  {INTERVIEW_MODE_LABELS[interview.mode]}
                                </div>
                              </div>
                              {interview.overallScore && (
                                <div className="flex items-center justify-between mt-2 pt-2 border-t">
                                  <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    {interview.overallScore.toFixed(1)}/5.0
                                  </span>
                                  {getRecommendationBadge(interview.recommendation)}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ── ASSESSMENT SUMMARY TAB ────────────────────────────────────────── */}
        <TabsContent value="summary" className="space-y-6 mt-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="inline-flex p-2 rounded-lg bg-blue-50 text-blue-600 mb-2">
                  <Users className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold">{assessed.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">Total Assessed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="inline-flex p-2 rounded-lg bg-green-50 text-green-600 mb-2">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold">{passCount}</p>
                <p className="text-xs text-gray-500 mt-0.5">Passed (Hire/Strong Hire)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="inline-flex p-2 rounded-lg bg-red-50 text-red-600 mb-2">
                  <XCircle className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold">{failCount}</p>
                <p className="text-xs text-gray-500 mt-0.5">Rejected (No Hire)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="inline-flex p-2 rounded-lg bg-amber-50 text-amber-600 mb-2">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold">
                  {assessed.length > 0
                    ? (assessed.reduce((s, i) => s + (i.overallScore || 0), 0) / assessed.length).toFixed(1)
                    : '--'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Average Score</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Averages Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Average Scores by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {CATEGORY_AVERAGES.map((cat) => (
                    <div key={cat.label}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-700">{cat.label}</span>
                        <span className="font-medium">{cat.score.toFixed(1)}/5.0</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-teal-500 h-3 rounded-full transition-all"
                          style={{ width: `${(cat.score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pass/Fail Donut (CSS-based) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recommendation Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-8">
                  {/* Donut Chart (CSS-based) */}
                  <div className="relative w-40 h-40 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      {(() => {
                        const total = assessed.length || 1;
                        const segments = [
                          { count: passCount, color: '#10b981' },
                          { count: maybeCount, color: '#f59e0b' },
                          { count: failCount, color: '#ef4444' },
                        ];
                        let offset = 0;
                        return segments.map((seg, idx) => {
                          const pct = (seg.count / total) * 100;
                          const el = (
                            <circle
                              key={idx}
                              cx="18" cy="18" r="15.9155"
                              fill="none"
                              stroke={seg.color}
                              strokeWidth="3.5"
                              strokeDasharray={`${pct} ${100 - pct}`}
                              strokeDashoffset={`${-offset}`}
                            />
                          );
                          offset += pct;
                          return el;
                        });
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{assessed.length}</p>
                        <p className="text-xs text-gray-500">Total</p>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-sm text-gray-700">Hire / Strong Hire</span>
                      <span className="text-sm font-medium ml-auto">{passCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-sm text-gray-700">Maybe</span>
                      <span className="text-sm font-medium ml-auto">{maybeCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-sm text-gray-700">No Hire</span>
                      <span className="text-sm font-medium ml-auto">{failCount}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interviewer Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Interviewer Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-sm">Interviewer</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-sm">Interviews Conducted</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-sm">Avg. Score</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-sm">Pass Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {INTERVIEWER_STATS.map((stat) => (
                      <tr key={stat.name} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-medium">
                              {stat.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            {stat.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{stat.conducted}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {stat.avgScore.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-teal-500 h-2 rounded-full"
                                style={{ width: `${stat.passRate}%` }}
                              />
                            </div>
                            <span>{stat.passRate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Assessments Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-sm">Candidate</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-sm">Position</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-sm">Score</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-sm">Recommendation</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-sm">Date</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {assessed
                      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
                      .map((interview) => (
                        <tr key={interview.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium">{interview.candidateName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{interview.jobTitle}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="flex items-center gap-1 font-medium text-amber-600">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              {interview.overallScore?.toFixed(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{getRecommendationBadge(interview.recommendation)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(interview.scheduledAt).toLocaleDateString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric',
                            })}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <Link href={`/recruitment/interviews/${interview.id}`}>
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); setShowScheduleDialog(false); }}>
            <div className="space-y-4 py-4">
              <div>
                <Label>Application *</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select Application" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a1">Suresh Kumar - Senior SE</SelectItem>
                    <SelectItem value="a2">Divya Agarwal - Senior SE</SelectItem>
                    <SelectItem value="a4">Pooja Shah - Senior SE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Interviewer *</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select Interviewer" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emp1">Priya Sharma (Engineering Lead)</SelectItem>
                    <SelectItem value="emp2">Vikram Singh (Tech Architect)</SelectItem>
                    <SelectItem value="emp3">Rajesh Kumar (Section Head)</SelectItem>
                  </SelectContent>
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
                  <Select defaultValue="VIDEO">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN_PERSON">In Person</SelectItem>
                      <SelectItem value="VIDEO">Video Call</SelectItem>
                      <SelectItem value="PHONE">Phone</SelectItem>
                    </SelectContent>
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
    </div>
  );
}
