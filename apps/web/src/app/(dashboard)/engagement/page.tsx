'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smile, BarChart3, ClipboardList, Vote, Plus, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

const STATS = [
  { label: 'Active Surveys', value: '3', icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Active Polls', value: '5', icon: Vote, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Avg eNPS Score', value: '72', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Participation Rate', value: '85%', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
];

const RECENT_SURVEYS = [
  { id: '1', title: 'Q1 2026 Employee Satisfaction', status: 'ACTIVE', responses: 142, total: 200, endDate: '2026-03-31' },
  { id: '2', title: 'Remote Work Feedback', status: 'ACTIVE', responses: 89, total: 200, endDate: '2026-03-15' },
  { id: '3', title: 'Annual Culture Survey 2025', status: 'CLOSED', responses: 195, total: 200, endDate: '2025-12-31' },
];

const RECENT_POLLS = [
  { id: '1', question: 'What day works best for team outing?', votes: 156, options: 4, status: 'ACTIVE' },
  { id: '2', question: 'Preferred lunch timing?', votes: 180, options: 3, status: 'CLOSED' },
];

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-600',
  DRAFT: 'bg-yellow-100 text-yellow-700',
};

export default function EngagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Engagement</h1>
          <p className="text-sm text-gray-500">Surveys, polls, pulse checks and engagement analytics</p>
        </div>
        <div className="flex gap-2">
          <Link href="/engagement/surveys/new">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus size={16} className="mr-2" /> New Survey
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Surveys */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Surveys</CardTitle>
            <Link href="/engagement/surveys">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {RECENT_SURVEYS.map((survey) => (
              <div key={survey.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{survey.title}</p>
                  <p className="text-xs text-gray-500">
                    {survey.responses}/{survey.total} responses | Ends {survey.endDate}
                  </p>
                </div>
                <Badge className={STATUS_STYLES[survey.status]}>{survey.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Polls */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Polls</CardTitle>
            <Link href="/engagement/polls">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {RECENT_POLLS.map((poll) => (
              <div key={poll.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{poll.question}</p>
                  <p className="text-xs text-gray-500">{poll.votes} votes | {poll.options} options</p>
                </div>
                <Badge className={STATUS_STYLES[poll.status]}>{poll.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/engagement/surveys">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-lg">
                <ClipboardList size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Surveys</p>
                <p className="text-xs text-gray-500">Create & manage surveys</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/engagement/polls">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 rounded-lg">
                <Vote size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Polls</p>
                <p className="text-xs text-gray-500">Quick polls & voting</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/engagement/analytics">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="p-2.5 bg-green-50 rounded-lg">
                <BarChart3 size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Analytics</p>
                <p className="text-xs text-gray-500">Engagement insights</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
