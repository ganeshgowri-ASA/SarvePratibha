'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select } from '@/components/ui/select';
import {
  Target,
  Plus,
  ChevronRight,
  BookOpen,
  Briefcase,
  Lightbulb,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Heart,
  Award,
} from 'lucide-react';

const STATUS_STYLES: Record<string, string> = {
  NOT_STARTED: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  DEFERRED: 'bg-yellow-100 text-yellow-700',
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  BUSINESS: Briefcase,
  LEARNING: BookOpen,
  DEVELOPMENT: Lightbulb,
  BEHAVIOURAL: Heart,
  COMPETENCY: Award,
};

const CATEGORY_BADGE_STYLES: Record<string, string> = {
  BUSINESS: 'bg-green-100 text-green-700 border-green-200',
  LEARNING: 'bg-purple-100 text-purple-700 border-purple-200',
  DEVELOPMENT: 'bg-teal-100 text-teal-700 border-teal-200',
  BEHAVIOURAL: 'bg-orange-100 text-orange-700 border-orange-200',
  COMPETENCY: 'bg-blue-100 text-blue-700 border-blue-200',
};

const SAMPLE_GOALS = [
  { id: '1', title: 'Complete API migration', description: 'Migrate all REST endpoints to v2 API', category: 'BUSINESS', weightage: 30, progress: 75, status: 'IN_PROGRESS', targetDate: '2026-06-30', isApproved: true, kpis: [{ title: 'Endpoints migrated', target: '50', actual: '38', unit: 'endpoints' }] },
  { id: '2', title: 'Mentor 2 junior developers', description: 'Regular 1:1s and code reviews', category: 'DEVELOPMENT', weightage: 20, progress: 50, status: 'IN_PROGRESS', targetDate: '2026-03-31', isApproved: true, kpis: [] },
  { id: '3', title: 'Reduce deployment time by 40%', description: 'Optimize CI/CD pipeline', category: 'BUSINESS', weightage: 25, progress: 100, status: 'COMPLETED', targetDate: '2025-12-31', isApproved: true, kpis: [{ title: 'Deploy time', target: '< 10min', actual: '8min', unit: 'minutes' }] },
  { id: '4', title: 'Complete AWS certification', description: 'AWS Solutions Architect Associate', category: 'LEARNING', weightage: 15, progress: 20, status: 'IN_PROGRESS', targetDate: '2026-06-30', isApproved: false, kpis: [] },
  { id: '5', title: 'Improve test coverage to 80%', description: 'Add unit and integration tests', category: 'BUSINESS', weightage: 10, progress: 0, status: 'NOT_STARTED', targetDate: '2026-03-31', isApproved: true, kpis: [{ title: 'Coverage', target: '80%', actual: '62%', unit: '%' }] },
  { id: '6', title: 'Improve cross-team collaboration', description: 'Enhance communication and teamwork across departments through regular sync-ups and shared documentation', category: 'BEHAVIOURAL', weightage: 15, progress: 60, status: 'IN_PROGRESS', targetDate: '2026-06-30', isApproved: true, kpis: [{ title: 'Cross-team projects', target: '4', actual: '2', unit: 'projects' }] },
  { id: '7', title: 'Develop leadership skills through mentoring', description: 'Mentor junior team members and lead knowledge-sharing sessions to build leadership capabilities', category: 'BEHAVIOURAL', weightage: 10, progress: 40, status: 'IN_PROGRESS', targetDate: '2026-06-30', isApproved: true, kpis: [{ title: 'Mentoring sessions', target: '12', actual: '5', unit: 'sessions' }] },
  { id: '8', title: 'AWS Solutions Architect certification', description: 'Complete AWS Solutions Architect Professional certification to deepen cloud infrastructure expertise', category: 'COMPETENCY', weightage: 20, progress: 80, status: 'IN_PROGRESS', targetDate: '2026-04-30', isApproved: true, kpis: [{ title: 'Practice exams passed', target: '5', actual: '4', unit: 'exams' }] },
  { id: '9', title: 'Master React performance optimization', description: 'Learn and apply advanced React patterns including memoization, code splitting, and virtual DOM optimization', category: 'COMPETENCY', weightage: 15, progress: 50, status: 'IN_PROGRESS', targetDate: '2026-06-30', isApproved: true, kpis: [{ title: 'Performance improvements', target: '10', actual: '5', unit: 'optimizations' }] },
];

export default function GoalsPage() {
  const [filter, setFilter] = useState('all');

  const filteredGoals = filter === 'all'
    ? SAMPLE_GOALS
    : SAMPLE_GOALS.filter((g) => g.category === filter);

  const totalWeightage = SAMPLE_GOALS.reduce((sum, g) => sum + g.weightage, 0);
  const overallProgress = Math.round(
    SAMPLE_GOALS.reduce((sum, g) => sum + (g.progress * g.weightage) / 100, 0),
  );

  const statusCounts = {
    total: SAMPLE_GOALS.length,
    completed: SAMPLE_GOALS.filter((g) => g.status === 'COMPLETED').length,
    inProgress: SAMPLE_GOALS.filter((g) => g.status === 'IN_PROGRESS').length,
    notStarted: SAMPLE_GOALS.filter((g) => g.status === 'NOT_STARTED').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/performance" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Goals</h1>
            <p className="text-sm text-gray-500">FY 2025-26 - Annual Review Cycle</p>
          </div>
        </div>
        <Link href="/performance/goals/new">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus size={16} className="mr-2" /> Add Goal
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-teal-600" />
              <span className="text-sm text-gray-500">Total Goals</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{statusCounts.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-600" />
              <span className="text-sm text-gray-500">Completed</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{statusCounts.completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-600" />
              <span className="text-sm text-gray-500">In Progress</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{statusCounts.inProgress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Weightage Used</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalWeightage}%</p>
            <Progress value={totalWeightage} className="h-1.5 mt-1" />
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all">All <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">{SAMPLE_GOALS.length}</Badge></TabsTrigger>
          <TabsTrigger value="BUSINESS">
            <Briefcase size={14} className="mr-1" /> Business <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">{SAMPLE_GOALS.filter(g => g.category === 'BUSINESS').length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="DEVELOPMENT">
            <Lightbulb size={14} className="mr-1" /> Development <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">{SAMPLE_GOALS.filter(g => g.category === 'DEVELOPMENT').length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="BEHAVIOURAL">
            <Heart size={14} className="mr-1" /> Behavioural <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">{SAMPLE_GOALS.filter(g => g.category === 'BEHAVIOURAL').length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="COMPETENCY">
            <Award size={14} className="mr-1" /> Competency <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">{SAMPLE_GOALS.filter(g => g.category === 'COMPETENCY').length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-4">
          <div className="space-y-3">
            {filteredGoals.map((goal) => {
              const CatIcon = CATEGORY_ICONS[goal.category] || Target;
              return (
                <Card key={goal.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CatIcon size={16} className="text-teal-600" />
                          <h3 className="text-sm font-semibold text-gray-900">{goal.title}</h3>
                          {!goal.isApproved && (
                            <Badge className="bg-orange-100 text-orange-700 text-[10px]">Pending Approval</Badge>
                          )}
                        </div>
                        {goal.description && (
                          <p className="text-xs text-gray-500 ml-6 mb-2">{goal.description}</p>
                        )}
                        <div className="ml-6 flex items-center gap-4 text-xs text-gray-500">
                          <span>Weight: {goal.weightage}%</span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {new Date(goal.targetDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <Badge className={`text-[10px] px-1.5 py-0 ${CATEGORY_BADGE_STYLES[goal.category] || ''}`}>
                            {goal.category}
                          </Badge>
                        </div>
                      </div>
                      <Badge className={STATUS_STYLES[goal.status] || ''}>
                        {goal.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <Progress value={goal.progress} className="h-2 flex-1" />
                      <span className="text-xs font-semibold text-gray-600 w-10">{goal.progress}%</span>
                    </div>

                    {goal.kpis.length > 0 && (
                      <div className="mt-3 ml-6 space-y-1">
                        {goal.kpis.map((kpi, j) => (
                          <div key={j} className="flex items-center gap-2 text-xs">
                            <span className="text-gray-500">{kpi.title}:</span>
                            <span className="font-medium text-gray-700">{kpi.actual || '-'}</span>
                            <span className="text-gray-400">/ {kpi.target}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
