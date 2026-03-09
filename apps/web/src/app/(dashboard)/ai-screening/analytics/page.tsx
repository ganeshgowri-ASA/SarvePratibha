'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  CheckCircle,
  Target,
  Zap,
} from 'lucide-react';

// Mock analytics data
const mockAnalytics = {
  totalScreenings: 156,
  completedScreenings: 142,
  avgScore: 68,
  shortlistRate: 45,
  avgDuration: 16, // minutes
  costPerScreening: 2.5, // USD
  timeSaved: 1420, // hours
  accuracyRate: 87,
  scoreDistribution: [
    { range: '0-20', count: 5 },
    { range: '21-40', count: 12 },
    { range: '41-60', count: 35 },
    { range: '61-80', count: 52 },
    { range: '81-100', count: 38 },
  ],
  providerBreakdown: [
    { provider: 'Vapi.ai', calls: 98, avgDuration: 15, cost: 245 },
    { provider: 'Retell AI', calls: 34, avgDuration: 18, cost: 102 },
    { provider: 'ElevenLabs', calls: 15, avgDuration: 12, cost: 45 },
    { provider: 'Sarvam AI', calls: 9, avgDuration: 14, cost: 18 },
  ],
  topCandidates: [
    { name: 'Sneha Patel', role: 'UI/UX Designer', score: 91, recommendation: 'STRONG_SHORTLIST' },
    { name: 'Priya Sharma', role: 'Sr. Software Engineer', score: 85, recommendation: 'STRONG_SHORTLIST' },
    { name: 'Arjun Reddy', role: 'Backend Engineer', score: 83, recommendation: 'STRONG_SHORTLIST' },
    { name: 'Meera Joshi', role: 'Product Manager', score: 79, recommendation: 'SHORTLIST' },
    { name: 'Rahul Verma', role: 'Product Manager', score: 72, recommendation: 'SHORTLIST' },
  ],
  monthlyTrend: [
    { month: 'Jan', screenings: 18, avgScore: 62 },
    { month: 'Feb', screenings: 42, avgScore: 65 },
    { month: 'Mar', screenings: 96, avgScore: 68 },
  ],
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-teal-600" />
          Screening Analytics
        </h1>
        <p className="text-gray-500 mt-1">AI screening effectiveness and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Screenings</p>
                <p className="text-3xl font-bold text-gray-900">{mockAnalytics.totalScreenings}</p>
                <p className="text-xs text-green-600 mt-1">+128% from last month</p>
              </div>
              <div className="h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Score</p>
                <p className="text-3xl font-bold text-gray-900">{mockAnalytics.avgScore}%</p>
                <p className="text-xs text-green-600 mt-1">+4.6% improvement</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Time Saved</p>
                <p className="text-3xl font-bold text-gray-900">{mockAnalytics.timeSaved}h</p>
                <p className="text-xs text-gray-500 mt-1">vs manual screening</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Accuracy Rate</p>
                <p className="text-3xl font-bold text-gray-900">{mockAnalytics.accuracyRate}%</p>
                <p className="text-xs text-gray-500 mt-1">vs final hire decision</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAnalytics.scoreDistribution.map((bucket) => {
                const maxCount = Math.max(...mockAnalytics.scoreDistribution.map((b) => b.count));
                const percentage = (bucket.count / maxCount) * 100;
                return (
                  <div key={bucket.range} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 w-16">{bucket.range}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                      <div
                        className="bg-teal-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-xs font-medium text-white">{bucket.count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Provider Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Provider Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.providerBreakdown.map((provider) => (
                <div key={provider.provider} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{provider.provider}</p>
                    <p className="text-sm text-gray-500">{provider.calls} calls | Avg {provider.avgDuration} min</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${provider.cost}</p>
                    <p className="text-xs text-gray-500">${(provider.cost / provider.calls).toFixed(2)}/call</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Candidates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAnalytics.topCandidates.map((candidate, idx) => (
                <div key={candidate.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <span className="text-lg font-bold text-gray-300 w-6">#{idx + 1}</span>
                  <div className="h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-teal-700">
                      {candidate.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{candidate.name}</p>
                    <p className="text-xs text-gray-500">{candidate.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={candidate.score} className="w-16 h-2" />
                    <span className="text-sm font-bold text-gray-700 w-10">{candidate.score}%</span>
                  </div>
                  <Badge className={candidate.recommendation.includes('SHORTLIST') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} variant="secondary">
                    {candidate.recommendation.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.monthlyTrend.map((month) => (
                <div key={month.month} className="flex items-center gap-4 p-3 border rounded-lg">
                  <span className="text-sm font-semibold text-gray-700 w-10">{month.month}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500">{month.screenings} screenings</span>
                      <span className="text-sm font-medium text-teal-600">Avg: {month.avgScore}%</span>
                    </div>
                    <Progress value={month.avgScore} className="h-2" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-teal-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-teal-600" />
                <span className="text-sm font-semibold text-teal-800">Key Insight</span>
              </div>
              <p className="text-sm text-teal-700">
                Screening volume increased by 128% in March with a steady improvement in average candidate quality.
                AI recommendations aligned with final hiring decisions 87% of the time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
