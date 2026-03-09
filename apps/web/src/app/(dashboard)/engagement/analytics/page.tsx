'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Minus, Users, Smile, BarChart3, Target } from 'lucide-react';

const DEPT_SCORES = [
  { dept: 'Engineering', score: 82, trend: 'up', change: '+3', employees: 45 },
  { dept: 'Product', score: 78, trend: 'up', change: '+5', employees: 15 },
  { dept: 'Design', score: 85, trend: 'same', change: '0', employees: 12 },
  { dept: 'Marketing', score: 71, trend: 'down', change: '-2', employees: 20 },
  { dept: 'Sales', score: 68, trend: 'down', change: '-4', employees: 30 },
  { dept: 'HR', score: 88, trend: 'up', change: '+2', employees: 10 },
  { dept: 'Finance', score: 75, trend: 'same', change: '0', employees: 18 },
  { dept: 'Operations', score: 73, trend: 'up', change: '+1', employees: 25 },
];

const NPS_HISTORY = [
  { month: 'Oct', score: 68 },
  { month: 'Nov', score: 70 },
  { month: 'Dec', score: 72 },
  { month: 'Jan', score: 71 },
  { month: 'Feb', score: 74 },
  { month: 'Mar', score: 76 },
];

const PULSE_CATEGORIES = [
  { category: 'Work-Life Balance', score: 4.2, max: 5 },
  { category: 'Manager Support', score: 4.0, max: 5 },
  { category: 'Career Growth', score: 3.6, max: 5 },
  { category: 'Team Collaboration', score: 4.4, max: 5 },
  { category: 'Company Culture', score: 3.9, max: 5 },
  { category: 'Compensation', score: 3.3, max: 5 },
];

const getTrendIcon = (trend: string) => {
  if (trend === 'up') return <TrendingUp size={14} className="text-green-600" />;
  if (trend === 'down') return <TrendingDown size={14} className="text-red-600" />;
  return <Minus size={14} className="text-gray-400" />;
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
};

export default function EngagementAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Engagement Analytics</h1>
          <p className="text-sm text-gray-500">Team engagement heatmap, eNPS, and pulse check insights</p>
        </div>
        <Select defaultValue="2026">
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="p-3 bg-teal-50 rounded-full w-12 h-12 mx-auto flex items-center justify-center mb-2">
              <Target size={20} className="text-teal-600" />
            </div>
            <p className="text-3xl font-bold text-teal-600">76</p>
            <p className="text-sm text-gray-500">eNPS Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="p-3 bg-blue-50 rounded-full w-12 h-12 mx-auto flex items-center justify-center mb-2">
              <Smile size={20} className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">4.1</p>
            <p className="text-sm text-gray-500">Avg Pulse Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="p-3 bg-green-50 rounded-full w-12 h-12 mx-auto flex items-center justify-center mb-2">
              <Users size={20} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">85%</p>
            <p className="text-sm text-gray-500">Participation Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="p-3 bg-purple-50 rounded-full w-12 h-12 mx-auto flex items-center justify-center mb-2">
              <BarChart3 size={20} className="text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">12</p>
            <p className="text-sm text-gray-500">Surveys Completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Department Engagement Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {DEPT_SCORES.map((dept) => (
                <div key={dept.dept} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-[140px]">
                    <span className="text-sm text-gray-700">{dept.dept}</span>
                    <span className="text-xs text-gray-400">({dept.employees})</span>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${dept.score >= 80 ? 'bg-green-500' : dept.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${dept.score}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 min-w-[80px] justify-end">
                    <span className={`text-sm font-bold ${getScoreColor(dept.score)}`}>{dept.score}</span>
                    {getTrendIcon(dept.trend)}
                    <span className={`text-xs ${dept.trend === 'up' ? 'text-green-600' : dept.trend === 'down' ? 'text-red-600' : 'text-gray-400'}`}>
                      {dept.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pulse Check Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pulse Check Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {PULSE_CATEGORIES.map((cat) => {
                const pct = (cat.score / cat.max) * 100;
                return (
                  <div key={cat.category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{cat.category}</span>
                      <span className="font-medium">{cat.score}/{cat.max}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* eNPS Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">eNPS Score Trend (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-around h-48">
            {NPS_HISTORY.map((item) => {
              const height = (item.score / 100) * 160;
              return (
                <div key={item.month} className="flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-gray-700">{item.score}</span>
                  <div
                    className="w-12 bg-teal-500 rounded-t-md"
                    style={{ height: `${height}px` }}
                  />
                  <span className="text-xs text-gray-500">{item.month}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
