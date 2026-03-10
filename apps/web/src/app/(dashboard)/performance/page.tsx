'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Compass,
  ArrowUp,
  ArrowDown,
  Minus,
  BookOpen,
  UserCheck,
  Calendar,
  CheckCircle2,
  Clock,
  Circle,
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
  { label: 'Competency Tracking', href: '#competency-tracking', icon: Compass, description: 'Track your competencies' },
  { label: 'Team Review', href: '/performance/review', icon: Users, description: 'Review your team members', roles: ['MANAGER', 'SECTION_HEAD', 'IT_ADMIN'] },
  { label: 'PIP Tracking', href: '/performance/pip', icon: AlertTriangle, description: 'Performance improvement plans', roles: ['MANAGER', 'SECTION_HEAD', 'IT_ADMIN'] },
  { label: 'Analytics', href: '/performance/analytics', icon: BarChart3, description: 'Department analytics', roles: ['SECTION_HEAD', 'IT_ADMIN'] },
];

// --- Competency Data ---

type CompetencyCategory = 'Core' | 'Leadership' | 'Technical';
type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
type DevPlanStatus = 'Not Started' | 'In Progress' | 'Completed';

const COMPETENCY_CATEGORY_STYLES: Record<CompetencyCategory, string> = {
  Core: 'bg-teal-100 text-teal-700',
  Leadership: 'bg-purple-100 text-purple-700',
  Technical: 'bg-blue-100 text-blue-700',
};

const PROFICIENCY_LEVELS: ProficiencyLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

interface Competency {
  name: string;
  category: CompetencyCategory;
  selfRating: number;
  managerRating: number;
  expectedLevel: ProficiencyLevel;
  currentLevel: ProficiencyLevel;
}

const COMPETENCY_DATA: Competency[] = [
  // Core Competencies
  { name: 'Communication', category: 'Core', selfRating: 4, managerRating: 4, expectedLevel: 'Advanced', currentLevel: 'Advanced' },
  { name: 'Teamwork', category: 'Core', selfRating: 5, managerRating: 4, expectedLevel: 'Advanced', currentLevel: 'Advanced' },
  { name: 'Problem Solving', category: 'Core', selfRating: 4, managerRating: 5, expectedLevel: 'Advanced', currentLevel: 'Advanced' },
  { name: 'Adaptability', category: 'Core', selfRating: 3, managerRating: 3, expectedLevel: 'Advanced', currentLevel: 'Intermediate' },
  { name: 'Time Management', category: 'Core', selfRating: 3, managerRating: 2, expectedLevel: 'Advanced', currentLevel: 'Intermediate' },
  { name: 'Integrity', category: 'Core', selfRating: 5, managerRating: 5, expectedLevel: 'Advanced', currentLevel: 'Expert' },
  // Leadership Competencies
  { name: 'Strategic Thinking', category: 'Leadership', selfRating: 3, managerRating: 3, expectedLevel: 'Advanced', currentLevel: 'Intermediate' },
  { name: 'People Management', category: 'Leadership', selfRating: 4, managerRating: 3, expectedLevel: 'Advanced', currentLevel: 'Intermediate' },
  { name: 'Decision Making', category: 'Leadership', selfRating: 4, managerRating: 4, expectedLevel: 'Advanced', currentLevel: 'Advanced' },
  { name: 'Conflict Resolution', category: 'Leadership', selfRating: 2, managerRating: 2, expectedLevel: 'Intermediate', currentLevel: 'Beginner' },
  { name: 'Mentoring', category: 'Leadership', selfRating: 4, managerRating: 4, expectedLevel: 'Advanced', currentLevel: 'Advanced' },
  { name: 'Change Management', category: 'Leadership', selfRating: 3, managerRating: 2, expectedLevel: 'Intermediate', currentLevel: 'Beginner' },
  // Technical Competencies
  { name: 'Domain Expertise', category: 'Technical', selfRating: 5, managerRating: 5, expectedLevel: 'Expert', currentLevel: 'Expert' },
  { name: 'Technical Skills', category: 'Technical', selfRating: 5, managerRating: 4, expectedLevel: 'Expert', currentLevel: 'Advanced' },
  { name: 'Innovation', category: 'Technical', selfRating: 4, managerRating: 3, expectedLevel: 'Advanced', currentLevel: 'Intermediate' },
  { name: 'Quality Focus', category: 'Technical', selfRating: 4, managerRating: 4, expectedLevel: 'Advanced', currentLevel: 'Advanced' },
  { name: 'Process Improvement', category: 'Technical', selfRating: 3, managerRating: 3, expectedLevel: 'Advanced', currentLevel: 'Intermediate' },
  { name: 'Data Analytics', category: 'Technical', selfRating: 2, managerRating: 2, expectedLevel: 'Intermediate', currentLevel: 'Beginner' },
];

interface DevelopmentPlanItem {
  competency: string;
  action: string;
  type: 'Training' | 'Mentorship' | 'Self-Study' | 'Project';
  targetDate: string;
  status: DevPlanStatus;
}

const DEVELOPMENT_PLAN: DevelopmentPlanItem[] = [
  { competency: 'Time Management', action: 'Complete "Getting Things Done" workshop', type: 'Training', targetDate: '30 Apr 2026', status: 'In Progress' },
  { competency: 'Time Management', action: 'Pair with Priya Sharma (productivity mentor)', type: 'Mentorship', targetDate: '31 May 2026', status: 'Not Started' },
  { competency: 'Adaptability', action: 'Lead cross-functional sprint for Q2 release', type: 'Project', targetDate: '30 Jun 2026', status: 'Not Started' },
  { competency: 'Conflict Resolution', action: 'Complete "Managing Difficult Conversations" course', type: 'Training', targetDate: '31 Mar 2026', status: 'In Progress' },
  { competency: 'Change Management', action: 'Shadow VP Engineering during org restructure', type: 'Mentorship', targetDate: '30 Apr 2026', status: 'Not Started' },
  { competency: 'Data Analytics', action: 'Complete SQL & Tableau fundamentals on Coursera', type: 'Self-Study', targetDate: '31 May 2026', status: 'In Progress' },
  { competency: 'Innovation', action: 'Lead hackathon project and present to leadership', type: 'Project', targetDate: '30 Jun 2026', status: 'Completed' },
  { competency: 'Process Improvement', action: 'Obtain Lean Six Sigma Yellow Belt', type: 'Training', targetDate: '31 Jul 2026', status: 'Not Started' },
];

function getLevelIndex(level: ProficiencyLevel): number {
  return PROFICIENCY_LEVELS.indexOf(level);
}

function getLevelProgress(current: ProficiencyLevel, expected: ProficiencyLevel): number {
  const currentIdx = getLevelIndex(current);
  const expectedIdx = getLevelIndex(expected);
  if (expectedIdx === 0) return 100;
  return Math.round((currentIdx / expectedIdx) * 100);
}

function StarRating({ rating, filled, interactive, onChange }: { rating: number; filled?: boolean; interactive?: boolean; onChange?: (r: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
          onClick={() => interactive && onChange?.(star)}
        >
          <Star
            size={14}
            className={star <= rating ? (filled ? 'text-amber-500 fill-amber-500' : 'text-teal-500 fill-teal-500') : 'text-gray-200'}
          />
        </button>
      ))}
    </div>
  );
}

function GapIndicator({ gap }: { gap: number }) {
  if (gap === 0) return <span className="text-xs text-gray-400 flex items-center gap-0.5"><Minus size={12} /> No gap</span>;
  if (gap > 0) return <span className="text-xs text-green-600 flex items-center gap-0.5"><ArrowUp size={12} /> +{gap}</span>;
  return <span className="text-xs text-red-500 flex items-center gap-0.5"><ArrowDown size={12} /> {gap}</span>;
}

function CompetencySummaryBar({ data, category }: { data: Competency[]; category: CompetencyCategory }) {
  const items = data.filter((c) => c.category === category);
  const avgManager = items.reduce((sum, c) => sum + c.managerRating, 0) / items.length;
  const barColor = category === 'Core' ? 'bg-teal-500' : category === 'Leadership' ? 'bg-purple-500' : 'bg-blue-500';
  const bgColor = category === 'Core' ? 'bg-teal-100' : category === 'Leadership' ? 'bg-purple-100' : 'bg-blue-100';

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-gray-700 w-20">{category}</span>
      <div className={`flex-1 h-2.5 rounded-full ${bgColor}`}>
        <div className={`h-2.5 rounded-full ${barColor}`} style={{ width: `${(avgManager / 5) * 100}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-8">{avgManager.toFixed(1)}</span>
    </div>
  );
}

const DEV_STATUS_ICONS: Record<DevPlanStatus, React.ElementType> = {
  'Not Started': Circle,
  'In Progress': Clock,
  'Completed': CheckCircle2,
};

const DEV_STATUS_STYLES: Record<DevPlanStatus, string> = {
  'Not Started': 'text-gray-400',
  'In Progress': 'text-blue-500',
  'Completed': 'text-green-500',
};

const DEV_TYPE_STYLES: Record<string, string> = {
  Training: 'bg-orange-100 text-orange-700',
  Mentorship: 'bg-purple-100 text-purple-700',
  'Self-Study': 'bg-teal-100 text-teal-700',
  Project: 'bg-blue-100 text-blue-700',
};

export default function PerformancePage() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role as UserRole | undefined;
  const [selfRatings, setSelfRatings] = useState<Record<string, number>>(
    Object.fromEntries(COMPETENCY_DATA.map((c) => [c.name, c.selfRating])),
  );

  const filteredActions = QUICK_ACTIONS.filter((action) => {
    if (!action.roles) return true;
    if (userRole === 'IT_ADMIN') return true;
    return action.roles.includes(userRole!);
  });

  const overallProgress = Math.round(
    SAMPLE_GOALS.reduce((sum, g) => sum + (g.progress * g.weightage) / 100, 0),
  );

  // Competency calculations
  const competenciesWithRatings = COMPETENCY_DATA.map((c) => ({
    ...c,
    selfRating: selfRatings[c.name] ?? c.selfRating,
  }));

  const overallCompetencyScore = (
    competenciesWithRatings.reduce((sum, c) => sum + c.managerRating, 0) / competenciesWithRatings.length
  ).toFixed(1);

  const sortedByManager = [...competenciesWithRatings].sort((a, b) => b.managerRating - a.managerRating);
  const strengths = sortedByManager.slice(0, 3);
  const developmentAreas = sortedByManager.slice(-3).reverse();

  const showLeadership = !userRole || userRole === 'MANAGER' || userRole === 'SECTION_HEAD' || userRole === 'IT_ADMIN';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Performance Management</h1>
        <p className="text-sm text-gray-500">Track your goals, reviews, and career development</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
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

      {/* ======== COMPETENCY TRACKING SECTION ======== */}
      <div id="competency-tracking" className="scroll-mt-20">
        {/* Competency Dashboard */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Compass size={18} className="text-teal-600" />
              Competency Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className="mx-auto w-24 h-24 rounded-full border-4 border-teal-500 flex items-center justify-center mb-2">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{overallCompetencyScore}</p>
                    <p className="text-[10px] text-gray-500">out of 5.0</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">Overall Score</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <TrendingUp size={14} className="text-green-500" />
                  <span className="text-xs text-green-600">Improving</span>
                </div>
                <div className="mt-3 space-y-2">
                  <CompetencySummaryBar data={competenciesWithRatings} category="Core" />
                  <CompetencySummaryBar data={competenciesWithRatings} category="Leadership" />
                  <CompetencySummaryBar data={competenciesWithRatings} category="Technical" />
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
                  <ArrowUp size={14} className="text-green-500" />
                  Top Strengths
                </h4>
                <div className="space-y-2">
                  {strengths.map((c) => (
                    <div key={c.name} className="p-2.5 rounded-lg border border-green-100 bg-green-50/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{c.name}</span>
                          <Badge className={`text-[10px] px-1.5 py-0 ${COMPETENCY_CATEGORY_STYLES[c.category]}`}>
                            {c.category}
                          </Badge>
                        </div>
                        <span className="text-sm font-bold text-green-600">{c.managerRating}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Development Areas */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
                  <ArrowDown size={14} className="text-red-500" />
                  Development Areas
                </h4>
                <div className="space-y-2">
                  {developmentAreas.map((c) => (
                    <div key={c.name} className="p-2.5 rounded-lg border border-red-100 bg-red-50/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{c.name}</span>
                          <Badge className={`text-[10px] px-1.5 py-0 ${COMPETENCY_CATEGORY_STYLES[c.category]}`}>
                            {c.category}
                          </Badge>
                        </div>
                        <span className="text-sm font-bold text-red-500">{c.managerRating}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competency Rating Cards by Category */}
        <div className="mt-4">
          <Tabs defaultValue="Core">
            <TabsList className="mb-4">
              <TabsTrigger value="Core">Core</TabsTrigger>
              {showLeadership && <TabsTrigger value="Leadership">Leadership</TabsTrigger>}
              <TabsTrigger value="Technical">Technical</TabsTrigger>
            </TabsList>

            {(['Core', 'Leadership', 'Technical'] as CompetencyCategory[]).map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {competenciesWithRatings
                    .filter((c) => c.category === category)
                    .map((competency) => {
                      const gap = competency.selfRating - competency.managerRating;
                      const levelProgress = getLevelProgress(competency.currentLevel, competency.expectedLevel);

                      return (
                        <Card key={competency.name} className="hover:shadow-md transition-shadow">
                          <CardContent className="pt-5 pb-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{competency.name}</p>
                                <Badge className={`text-[10px] px-1.5 py-0 mt-1 ${COMPETENCY_CATEGORY_STYLES[competency.category]}`}>
                                  {competency.category}
                                </Badge>
                              </div>
                              <GapIndicator gap={gap} />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Self Rating</span>
                                <StarRating
                                  rating={competency.selfRating}
                                  interactive
                                  onChange={(r) => setSelfRatings((prev) => ({ ...prev, [competency.name]: r }))}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Manager Rating</span>
                                <StarRating rating={competency.managerRating} filled />
                              </div>
                            </div>

                            <div className="mt-3 pt-3 border-t">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs text-gray-500">Proficiency</span>
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                  {competency.currentLevel}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Progress value={levelProgress} className="h-1.5 flex-1" />
                                <span className="text-[10px] text-gray-400">{competency.expectedLevel}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Development Plan */}
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen size={18} className="text-teal-600" />
                Development Plan
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> {DEVELOPMENT_PLAN.filter((d) => d.status === 'Completed').length} completed</span>
                <span className="flex items-center gap-1"><Clock size={12} className="text-blue-500" /> {DEVELOPMENT_PLAN.filter((d) => d.status === 'In Progress').length} in progress</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {DEVELOPMENT_PLAN.map((item, i) => {
                const StatusIcon = DEV_STATUS_ICONS[item.status];
                return (
                  <div key={i} className="p-3 rounded-lg border hover:border-teal-200 transition-colors">
                    <div className="flex items-start gap-3">
                      <StatusIcon size={18} className={`mt-0.5 ${DEV_STATUS_STYLES[item.status]}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-gray-900">{item.action}</p>
                          <Badge className={`text-[10px] px-1.5 py-0 ${DEV_TYPE_STYLES[item.type] || ''}`}>
                            {item.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Compass size={11} />
                            {item.competency}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {item.targetDate}
                          </span>
                          {item.type === 'Mentorship' && (
                            <span className="flex items-center gap-1">
                              <UserCheck size={11} />
                              Mentor assigned
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge className={`text-[10px] shrink-0 ${
                        item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
