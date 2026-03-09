'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Users, BarChart3, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const DIVERSITY_STATS = [
  { label: 'Gender Diversity', value: '38%', sublabel: 'Women in workforce', icon: Users, color: 'text-pink-600', bg: 'bg-pink-50' },
  { label: 'Inclusion Index', value: '4.2/5', sublabel: 'Employee survey', icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
  { label: 'Pay Equity Gap', value: '3.2%', sublabel: 'Gender pay gap', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'D&I Goals Met', value: '6/8', sublabel: 'This quarter', icon: Target, color: 'text-green-600', bg: 'bg-green-50' },
];

const GENDER_BREAKDOWN = [
  { label: 'Male', count: 124, pct: 62, color: 'bg-blue-500' },
  { label: 'Female', count: 68, pct: 34, color: 'bg-pink-500' },
  { label: 'Other', count: 8, pct: 4, color: 'bg-purple-500' },
];

const AGE_DISTRIBUTION = [
  { range: '18-25', count: 25, pct: 12.5 },
  { range: '26-35', count: 95, pct: 47.5 },
  { range: '36-45', count: 52, pct: 26.0 },
  { range: '46-55', count: 22, pct: 11.0 },
  { range: '55+', count: 6, pct: 3.0 },
];

const DI_GOALS = [
  { id: '1', title: 'Increase women in leadership to 40%', category: 'Gender', target: 40, current: 32, status: 'IN_PROGRESS' },
  { id: '2', title: 'Hire 20% candidates from underrepresented groups', category: 'Hiring', target: 20, current: 18, status: 'IN_PROGRESS' },
  { id: '3', title: 'Close gender pay gap to <2%', category: 'Pay Equity', target: 2, current: 3.2, status: 'IN_PROGRESS' },
  { id: '4', title: 'D&I training for all managers', category: 'Training', target: 100, current: 100, status: 'COMPLETED' },
];

export default function DiversityInclusionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diversity & Inclusion</h1>
          <p className="text-sm text-gray-500">Diversity metrics, pay equity, and inclusion goals</p>
        </div>
        <Link href="/diversity-inclusion/report">
          <Button variant="outline">
            <BarChart3 size={16} className="mr-2" /> View Report
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DIVERSITY_STATS.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.sublabel}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1 h-8 rounded-full overflow-hidden mb-4">
              {GENDER_BREAKDOWN.map((g) => (
                <div key={g.label} className={`${g.color}`} style={{ width: `${g.pct}%` }} title={`${g.label}: ${g.pct}%`} />
              ))}
            </div>
            <div className="space-y-2">
              {GENDER_BREAKDOWN.map((g) => (
                <div key={g.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${g.color}`} />
                    <span className="text-sm text-gray-700">{g.label}</span>
                  </div>
                  <span className="text-sm font-medium">{g.count} ({g.pct}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {AGE_DISTRIBUTION.map((age) => (
                <div key={age.range}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{age.range} years</span>
                    <span className="text-gray-500">{age.count} ({age.pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${age.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* D&I Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">D&I Goals Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {DI_GOALS.map((goal) => {
              const pct = goal.status === 'COMPLETED' ? 100 : Math.min(Math.round((goal.current / goal.target) * 100), 100);
              return (
                <div key={goal.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{goal.title}</p>
                      <Badge variant="outline" className="mt-1 text-xs">{goal.category}</Badge>
                    </div>
                    <Badge className={goal.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                      {goal.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Current: {goal.current}{goal.category === 'Pay Equity' ? '%' : ''}</span>
                    <span>Target: {goal.target}{goal.category === 'Pay Equity' ? '%' : ''}</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
