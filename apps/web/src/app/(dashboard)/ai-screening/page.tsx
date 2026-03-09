'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Bot,
  Phone,
  BarChart3,
  FileText,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

// Mock dashboard data (will be replaced with API calls)
const mockStats = {
  activeSessions: 5,
  completedToday: 12,
  avgScore: 72,
  shortlistRate: 45,
  totalScreenings: 156,
  voiceCallsActive: 2,
};

const mockRecentSessions = [
  { id: '1', candidateName: 'Priya Sharma', role: 'Senior Software Engineer', score: 85, status: 'COMPLETED' as const, recommendation: 'STRONG_SHORTLIST' as const },
  { id: '2', candidateName: 'Rahul Verma', role: 'Product Manager', score: 72, status: 'COMPLETED' as const, recommendation: 'SHORTLIST' as const },
  { id: '3', candidateName: 'Anita Desai', role: 'Data Scientist', score: null, status: 'IN_PROGRESS' as const, recommendation: null },
  { id: '4', candidateName: 'Karan Mehta', role: 'DevOps Engineer', score: 58, status: 'COMPLETED' as const, recommendation: 'HOLD' as const },
  { id: '5', candidateName: 'Sneha Patel', role: 'UI/UX Designer', score: 91, status: 'COMPLETED' as const, recommendation: 'STRONG_SHORTLIST' as const },
];

function getRecommendationColor(rec: string | null) {
  switch (rec) {
    case 'STRONG_SHORTLIST': return 'bg-green-100 text-green-800';
    case 'SHORTLIST': return 'bg-blue-100 text-blue-800';
    case 'HOLD': return 'bg-amber-100 text-amber-800';
    case 'REJECT': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'COMPLETED': return 'bg-green-100 text-green-800';
    case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
    case 'PENDING': return 'bg-amber-100 text-amber-800';
    case 'FAILED': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export default function AIScreeningDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bot className="h-7 w-7 text-teal-600" />
            AI Screening Dashboard
          </h1>
          <p className="text-gray-500 mt-1">AI-powered candidate screening and voice assessment</p>
        </div>
        <div className="flex gap-3">
          <Link href="/ai-screening/configure">
            <Button variant="outline" size="sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Configure AI
            </Button>
          </Link>
          <Link href="/ai-screening/sessions">
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
              <Bot className="h-4 w-4 mr-2" />
              New Screening
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Sessions</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.activeSessions}</p>
              </div>
              <div className="h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed Today</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.completedToday}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Score</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.avgScore}%</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Shortlist Rate</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.shortlistRate}%</p>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/ai-screening/voice-calls">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Phone className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Voice Calls</p>
                <p className="text-sm text-gray-500">{mockStats.voiceCallsActive} active calls</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/ai-screening/templates">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Templates</p>
                <p className="text-sm text-gray-500">Manage question sets</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/ai-screening/analytics">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Analytics</p>
                <p className="text-sm text-gray-500">Screening effectiveness</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Screening Sessions</CardTitle>
          <Link href="/ai-screening/sessions">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockRecentSessions.map((session) => (
              <Link key={session.id} href={`/ai-screening/session/${session.id}`}>
                <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-teal-700">
                        {session.candidateName.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{session.candidateName}</p>
                      <p className="text-sm text-gray-500">{session.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {session.score !== null && (
                      <div className="flex items-center gap-2">
                        <Progress value={session.score} className="w-20 h-2" />
                        <span className="text-sm font-medium text-gray-700 w-10">{session.score}%</span>
                      </div>
                    )}
                    <Badge className={getStatusColor(session.status)} variant="secondary">
                      {session.status.replace('_', ' ')}
                    </Badge>
                    {session.recommendation && (
                      <Badge className={getRecommendationColor(session.recommendation)} variant="secondary">
                        {session.recommendation.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
