'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, ClipboardList, Eye, BarChart3 } from 'lucide-react';
import Link from 'next/link';

const SURVEYS = [
  { id: '1', title: 'Q1 2026 Employee Satisfaction Survey', description: 'Quarterly pulse on employee satisfaction across all departments', status: 'ACTIVE', questions: 15, responses: 142, total: 200, startDate: '2026-01-15', endDate: '2026-03-31', isAnonymous: true },
  { id: '2', title: 'Remote Work Experience Feedback', description: 'Understanding employee experience with remote/hybrid work', status: 'ACTIVE', questions: 10, responses: 89, total: 200, startDate: '2026-02-01', endDate: '2026-03-15', isAnonymous: true },
  { id: '3', title: 'Annual Culture Survey 2025', description: 'Comprehensive annual culture and workplace assessment', status: 'CLOSED', questions: 25, responses: 195, total: 200, startDate: '2025-11-01', endDate: '2025-12-31', isAnonymous: true },
  { id: '4', title: 'Onboarding Experience Feedback', description: 'Feedback from recently joined employees', status: 'DRAFT', questions: 8, responses: 0, total: 50, startDate: '', endDate: '', isAnonymous: false },
];

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-600',
  DRAFT: 'bg-yellow-100 text-yellow-700',
};

export default function SurveysPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Surveys</h1>
          <p className="text-sm text-gray-500">Create and manage employee surveys</p>
        </div>
        <Link href="/engagement/surveys/new">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus size={16} className="mr-2" /> Create Survey
          </Button>
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input placeholder="Search surveys..." className="pl-9" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SURVEYS.map((survey) => {
          const pct = survey.total > 0 ? Math.round((survey.responses / survey.total) * 100) : 0;
          return (
            <Card key={survey.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <ClipboardList size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{survey.title}</CardTitle>
                      <p className="text-xs text-gray-500 mt-0.5">{survey.questions} questions</p>
                    </div>
                  </div>
                  <Badge className={STATUS_STYLES[survey.status]}>{survey.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{survey.description}</p>
                {survey.isAnonymous && (
                  <Badge variant="outline" className="text-xs">Anonymous</Badge>
                )}
                {survey.status !== 'DRAFT' && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{survey.responses} / {survey.total} responses</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  {survey.status === 'ACTIVE' && (
                    <Button size="sm" variant="outline">
                      <Eye size={14} className="mr-1" /> Take Survey
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <BarChart3 size={14} className="mr-1" /> Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
