'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  Target,
  BarChart3,
} from 'lucide-react';

// Mock analytics data
const ANALYTICS = {
  totalRequisitions: 24,
  openPositions: 15,
  totalCandidates: 342,
  totalApplications: 186,
  hiredThisMonth: 8,
  avgTimeToHire: 28,
  hiringFunnel: [
    { stage: 'Applied', count: 186, color: 'bg-blue-500' },
    { stage: 'Screening', count: 98, color: 'bg-yellow-500' },
    { stage: 'Interview', count: 54, color: 'bg-purple-500' },
    { stage: 'Offered', count: 22, color: 'bg-orange-500' },
    { stage: 'Hired', count: 15, color: 'bg-green-500' },
    { stage: 'Rejected', count: 42, color: 'bg-red-400' },
  ],
  sourceEffectiveness: [
    { source: 'LinkedIn', count: 68, hiredCount: 6, convRate: 8.8 },
    { source: 'Naukri', count: 52, hiredCount: 4, convRate: 7.7 },
    { source: 'Referral', count: 28, hiredCount: 3, convRate: 10.7 },
    { source: 'Indeed', count: 20, hiredCount: 1, convRate: 5.0 },
    { source: 'Career Page', count: 12, hiredCount: 1, convRate: 8.3 },
    { source: 'Glassdoor', count: 6, hiredCount: 0, convRate: 0 },
  ],
  departmentOpenings: [
    { department: 'Engineering', openings: 8, filled: 3 },
    { department: 'Product', openings: 3, filled: 1 },
    { department: 'Design', openings: 2, filled: 0 },
    { department: 'Marketing', openings: 1, filled: 0 },
    { department: 'Analytics', openings: 1, filled: 0 },
  ],
  monthlyHires: [
    { month: 'Oct', count: 4 },
    { month: 'Nov', count: 6 },
    { month: 'Dec', count: 3 },
    { month: 'Jan', count: 5 },
    { month: 'Feb', count: 7 },
    { month: 'Mar', count: 8 },
  ],
};

export default function AnalyticsPage() {
  const maxFunnelCount = Math.max(...ANALYTICS.hiringFunnel.map((s) => s.count));
  const maxSourceCount = Math.max(...ANALYTICS.sourceEffectiveness.map((s) => s.count));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recruitment Analytics</h1>
        <p className="text-gray-500 mt-1">Track hiring metrics and recruitment performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Requisitions', value: ANALYTICS.totalRequisitions, icon: Briefcase, color: 'text-blue-600 bg-blue-50' },
          { label: 'Open Positions', value: ANALYTICS.openPositions, icon: Target, color: 'text-purple-600 bg-purple-50' },
          { label: 'Total Candidates', value: ANALYTICS.totalCandidates, icon: Users, color: 'text-teal-600 bg-teal-50' },
          { label: 'Applications', value: ANALYTICS.totalApplications, icon: TrendingUp, color: 'text-orange-600 bg-orange-50' },
          { label: 'Hired (Month)', value: ANALYTICS.hiredThisMonth, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
          { label: 'Avg Time to Hire', value: `${ANALYTICS.avgTimeToHire}d`, icon: Clock, color: 'text-indigo-600 bg-indigo-50' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-4 pb-4">
              <div className={`inline-flex p-2 rounded-lg ${stat.color} mb-2`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-teal-600" />
              Hiring Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ANALYTICS.hiringFunnel.map((stage) => (
                <div key={stage.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{stage.stage}</span>
                    <span className="text-gray-500">{stage.count}</span>
                  </div>
                  <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stage.color} rounded-full transition-all flex items-center justify-end pr-2`}
                      style={{ width: `${(stage.count / maxFunnelCount) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {Math.round((stage.count / ANALYTICS.totalApplications) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Source Effectiveness */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-teal-600" />
              Source Effectiveness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ANALYTICS.sourceEffectiveness.map((source) => (
                <div key={source.source} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium">{source.source}</div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${(source.count / maxSourceCount) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 min-w-[60px] text-right">{source.count} apps</div>
                  <div className="text-sm font-medium min-w-[40px] text-right">{source.hiredCount} hired</div>
                  <Badge variant={source.convRate > 8 ? 'default' : 'outline'} className="min-w-[50px] justify-center">
                    {source.convRate}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Openings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Department-wise Openings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ANALYTICS.departmentOpenings.map((dept) => (
                <div key={dept.department}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{dept.department}</span>
                    <span className="text-sm text-gray-500">
                      {dept.filled}/{dept.openings} filled
                    </span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all"
                      style={{ width: `${(dept.filled / dept.openings) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Hires Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Hires Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4 h-48">
              {ANALYTICS.monthlyHires.map((month) => (
                <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-gray-600">{month.count}</span>
                  <div
                    className="w-full bg-teal-500 rounded-t transition-all"
                    style={{ height: `${(month.count / Math.max(...ANALYTICS.monthlyHires.map((m) => m.count))) * 100}%` }}
                  />
                  <span className="text-xs text-gray-500">{month.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
