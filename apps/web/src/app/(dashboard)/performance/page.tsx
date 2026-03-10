'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Target,
  ClipboardList,
  MessageSquare,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Star,
  ChevronRight,
  Users,
} from 'lucide-react';
import type { UserRole } from '@sarve-pratibha/shared';

const STATUS_STYLES: Record<string, string> = {
  NOT_STARTED: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  DEFERRED: 'bg-yellow-100 text-yellow-700',
};

const CATEGORY_BADGE_STYLES: Record<string, string> = {
  BUSINESS: 'bg-green-100 text-green-700 border-green-200',
  LEARNING: 'bg-purple-100 text-purple-700 border-purple-200',
  DEVELOPMENT: 'bg-teal-100 text-teal-700 border-teal-200',
  BEHAVIOURAL: 'bg-orange-100 text-orange-700 border-orange-200',
  COMPETENCY: 'bg-blue-100 text-blue-700 border-blue-200',
};

const SAMPLE_GOALS = [
  { title: 'Complete API migration', weightage: 30, progress: 75, status: 'IN_PROGRESS', category: 'BUSINESS' },
  { title: 'Mentor 2 junior developers', weightage: 20, progress: 50, status: 'IN_PROGRESS', category: 'DEVELOPMENT' },
  { title: 'Reduce deployment time by 40%', weightage: 25, progress: 100, status: 'COMPLETED', category: 'BUSINESS' },
  { title: 'Complete AWS certification', weightage: 15, progress: 20, status: 'IN_PROGRESS', category: 'LEARNING' },
  { title: 'Improve test coverage to 80%', weightage: 10, progress: 0, status: 'NOT_STARTED', category: 'BUSINESS' },
  { title: 'Improve cross-team collaboration', weightage: 15, progress: 60, status: 'IN_PROGRESS', category: 'BEHAVIOURAL' },
  { title: 'Develop leadership skills through mentoring', weightage: 10, progress: 40, status: 'IN_PROGRESS', category: 'BEHAVIOURAL' },
  { title: 'AWS Solutions Architect certification', weightage: 20, progress: 80, status: 'IN_PROGRESS', category: 'COMPETENCY' },
  { title: 'Master React performance optimization', weightage: 15, progress: 50, status: 'IN_PROGRESS', category: 'COMPETENCY' },
];

interface QuickAction {
  label: string;
  href: string;
  icon: React.ElementType;
  description: string;
  roles?: UserRole[];
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'My Goals', href: '/performance/goals', icon: Target, description: 'View and manage your goals' },
  { label: 'Self Assessment', href: '/performance/review/self', icon: ClipboardList, description: 'Complete your self-review' },
  { label: '360 Feedback', href: '/performance/feedback', icon: MessageSquare, description: 'View feedback requests' },
  { label: 'Team Review', href: '/performance/review', icon: Users, description: 'Review your team members', roles: ['MANAGER', 'SECTION_HEAD', 'IT_ADMIN'] },
  { label: 'PIP Tracking', href: '/performance/pip', icon: AlertTriangle, description: 'Performance improvement plans', roles: ['MANAGER', 'SECTION_HEAD', 'IT_ADMIN'] },
  { label: 'Analytics', href: '/performance/analytics', icon: BarChart3, description: 'Department analytics', roles: ['SECTION_HEAD', 'IT_ADMIN'] },
];

export default function PerformancePage() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role as UserRole | undefined;

  const filteredActions = QUICK_ACTIONS.filter((action) => {
    if (!action.roles) return true;
    if (userRole === 'IT_ADMIN') return true;
    return action.roles.includes(userRole!);
  });

  const overallProgress = Math.round(
    SAMPLE_GOALS.reduce((sum, g) => sum + (g.progress * g.weightage) / 100, 0),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Performance Management</h1>
        <p className="text-sm text-gray-500">Track your goals, reviews, and career development</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {filteredActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-4 pb-3 px-3 text-center">
                <div className="mx-auto mb-2 w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <action.icon size={20} className="text-teal-600" />
                </div>
                <p className="text-xs font-medium text-gray-900">{action.label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{action.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Overall Progress & Current Cycle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">FY 2025-26 Goals Progress</h3>
                <p className="text-sm text-gray-500">Annual Review Cycle</p>
              </div>
              <span className="text-2xl font-bold text-teal-600">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>{SAMPLE_GOALS.filter((g) => g.status === 'COMPLETED').length}/{SAMPLE_GOALS.length} goals completed</span>
              <Link href="/performance/goals" className="text-teal-600 hover:underline flex items-center">
                View all <ChevronRight size={14} />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">Current Review Cycle</h3>
                <p className="text-sm text-gray-500">Annual 2025-26</p>
              </div>
              <Badge className="bg-blue-100 text-blue-700">Self Review</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Self-Assessment Deadline</span>
                <span className="font-medium text-gray-900">31 Mar 2026</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Manager Review Deadline</span>
                <span className="font-medium text-gray-900">15 Apr 2026</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Status</span>
                <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
              </div>
            </div>
            <div className="mt-3">
              <Link href="/performance/review/self">
                <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700">
                  Start Self Assessment
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals by Category */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Target size={18} className="text-teal-600" />
              My Goals
            </CardTitle>
            <Link href="/performance/goals/new">
              <Button size="sm" variant="outline" className="text-xs">
                Add Goal
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {SAMPLE_GOALS.map((goal, i) => (
              <div key={i} className="p-3 rounded-lg border hover:border-teal-200 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{goal.title}</p>
                      <Badge className={`text-[10px] px-1.5 py-0 ${CATEGORY_BADGE_STYLES[goal.category] || ''}`}>
                        {goal.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Weight: {goal.weightage}%</p>
                  </div>
                  <Badge className={STATUS_STYLES[goal.status] || ''}>
                    {goal.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={goal.progress} className="h-2 flex-1" />
                  <span className="text-xs font-medium text-gray-600 w-10">{goal.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
                <Star size={24} className="text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">4.2</p>
                <p className="text-xs text-gray-500">Last Review Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">+0.3</p>
                <p className="text-xs text-gray-500">Rating Trend (YoY)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <Target size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">85%</p>
                <p className="text-xs text-gray-500">Goal Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
