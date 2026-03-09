'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, GripVertical, User, Calendar, Star, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PIPELINE_STAGES, SOURCE_LABELS } from '@sarve-pratibha/shared';

interface PipelineCard {
  id: string;
  candidateId: string;
  candidateName: string;
  email: string;
  currentTitle?: string;
  source: string;
  appliedAt: string;
  movedAt: string;
  interviewCount: number;
  avgRating?: number;
}

interface Stage {
  stage: string;
  label: string;
  count: number;
  applications: PipelineCard[];
}

const MOCK_PIPELINE: Stage[] = [
  {
    stage: 'APPLIED',
    label: 'Applied',
    count: 5,
    applications: [
      { id: 'a1', candidateId: 'c1', candidateName: 'Suresh Kumar', email: 'suresh@email.com', currentTitle: 'Frontend Developer', source: 'NAUKRI', appliedAt: '2026-03-07T00:00:00Z', movedAt: '2026-03-07T00:00:00Z', interviewCount: 0 },
      { id: 'a2', candidateId: 'c2', candidateName: 'Divya Agarwal', email: 'divya@email.com', currentTitle: 'React Developer', source: 'LINKEDIN', appliedAt: '2026-03-06T00:00:00Z', movedAt: '2026-03-06T00:00:00Z', interviewCount: 0 },
      { id: 'a3', candidateId: 'c3', candidateName: 'Rahul Joshi', email: 'rahul@email.com', currentTitle: 'Full Stack Dev', source: 'INDEED', appliedAt: '2026-03-05T00:00:00Z', movedAt: '2026-03-05T00:00:00Z', interviewCount: 0 },
    ],
  },
  {
    stage: 'SCREENING',
    label: 'Screening',
    count: 3,
    applications: [
      { id: 'a4', candidateId: 'c4', candidateName: 'Pooja Shah', email: 'pooja@email.com', currentTitle: 'SE II', source: 'REFERRAL', appliedAt: '2026-03-01T00:00:00Z', movedAt: '2026-03-04T00:00:00Z', interviewCount: 0 },
      { id: 'a5', candidateId: 'c5', candidateName: 'Anil Nair', email: 'anil@email.com', currentTitle: 'Backend Dev', source: 'CAREER_PAGE', appliedAt: '2026-02-28T00:00:00Z', movedAt: '2026-03-03T00:00:00Z', interviewCount: 0 },
    ],
  },
  {
    stage: 'INTERVIEW',
    label: 'Interview',
    count: 2,
    applications: [
      { id: 'a6', candidateId: '1', candidateName: 'Arjun Mehta', email: 'arjun@email.com', currentTitle: 'Senior SE', source: 'LINKEDIN', appliedAt: '2026-02-20T00:00:00Z', movedAt: '2026-03-02T00:00:00Z', interviewCount: 2, avgRating: 4.3 },
      { id: 'a7', candidateId: 'c6', candidateName: 'Lakshmi Rao', email: 'lakshmi@email.com', currentTitle: 'SSE', source: 'NAUKRI', appliedAt: '2026-02-22T00:00:00Z', movedAt: '2026-03-01T00:00:00Z', interviewCount: 1, avgRating: 3.8 },
    ],
  },
  {
    stage: 'OFFERED',
    label: 'Offered',
    count: 1,
    applications: [
      { id: 'a8', candidateId: 'c7', candidateName: 'Vivek Gupta', email: 'vivek@email.com', currentTitle: 'Lead SE', source: 'LINKEDIN', appliedAt: '2026-02-10T00:00:00Z', movedAt: '2026-03-05T00:00:00Z', interviewCount: 3, avgRating: 4.7 },
    ],
  },
  {
    stage: 'HIRED',
    label: 'Hired',
    count: 1,
    applications: [
      { id: 'a9', candidateId: 'c8', candidateName: 'Priyanka Das', email: 'priyanka@email.com', currentTitle: 'SSE', source: 'REFERRAL', appliedAt: '2026-01-15T00:00:00Z', movedAt: '2026-02-28T00:00:00Z', interviewCount: 3, avgRating: 4.5 },
    ],
  },
  {
    stage: 'REJECTED',
    label: 'Rejected',
    count: 2,
    applications: [
      { id: 'a10', candidateId: 'c9', candidateName: 'Amit Tiwari', email: 'amit@email.com', currentTitle: 'Jr Dev', source: 'INDEED', appliedAt: '2026-02-15T00:00:00Z', movedAt: '2026-02-25T00:00:00Z', interviewCount: 1, avgRating: 2.5 },
    ],
  },
];

function getStageColor(stage: string) {
  const found = PIPELINE_STAGES.find((s) => s.key === stage);
  return found?.color || 'bg-gray-100 text-gray-800';
}

function getStageHeaderColor(stage: string) {
  const map: Record<string, string> = {
    APPLIED: 'border-blue-400',
    SCREENING: 'border-yellow-400',
    INTERVIEW: 'border-purple-400',
    OFFERED: 'border-orange-400',
    HIRED: 'border-green-400',
    REJECTED: 'border-red-400',
  };
  return map[stage] || 'border-gray-400';
}

export default function PipelinePage() {
  const [pipeline] = useState<Stage[]>(MOCK_PIPELINE);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/recruitment/requisitions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Senior Software Engineer</h1>
            <p className="text-gray-500">Engineering · 3 positions · Bangalore</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="default" className="bg-teal-600">OPEN</Badge>
          <Badge variant="outline">HIGH Priority</Badge>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {pipeline.map((stage) => (
          <div key={stage.stage} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${getStageColor(stage.stage)}`}>
            {stage.label}: {stage.applications.length}
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-6" style={{ minHeight: '60vh' }}>
        {pipeline.map((stage) => (
          <div
            key={stage.stage}
            className="flex-shrink-0 w-72"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => setDraggedCard(null)}
          >
            <div className={`rounded-t-lg border-t-4 ${getStageHeaderColor(stage.stage)} bg-gray-50 px-3 py-2 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{stage.label}</span>
                <span className="text-xs bg-white rounded-full px-2 py-0.5 text-gray-500 border">
                  {stage.applications.length}
                </span>
              </div>
            </div>

            <div className="bg-gray-50/50 rounded-b-lg p-2 space-y-2 min-h-[200px] border border-t-0">
              {stage.applications.map((app) => (
                <div
                  key={app.id}
                  draggable
                  onDragStart={() => setDraggedCard(app.id)}
                  className={`bg-white rounded-lg border p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
                    draggedCard === app.id ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <Link href={`/recruitment/candidates/${app.candidateId}`} className="font-medium text-sm hover:text-teal-600">
                      {app.candidateName}
                    </Link>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                  {app.currentTitle && (
                    <p className="text-xs text-gray-500 mb-1.5">{app.currentTitle}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className={`px-1.5 py-0.5 rounded text-xs ${getStageColor(app.source.includes('LINKED') ? 'INTERVIEW' : 'APPLIED')}`}>
                      {SOURCE_LABELS[app.source] || app.source}
                    </span>
                    {app.interviewCount > 0 && (
                      <span className="flex items-center gap-0.5">
                        <Calendar className="h-3 w-3" /> {app.interviewCount}
                      </span>
                    )}
                    {app.avgRating && (
                      <span className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {app.avgRating}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 mt-1.5">
                    {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
