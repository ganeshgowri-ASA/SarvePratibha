'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Award,
  Clock,
  Play,
  GraduationCap,
  Target,
  ShieldCheck,
  Trophy,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Download,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { generateCertificate, getProgressPercent } from '@/lib/learning-service';

// ─── KPI Data ──────────────────────────────────────────────────────────────
const KPI_STATS = [
  {
    label: 'Total Learning Hours',
    value: '28 / 40',
    sub: 'Planned: 40 | Achieved: 28',
    icon: Clock,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  {
    label: 'Courses Completed',
    value: '8 / 15',
    sub: '5 In Progress | 2 Overdue',
    icon: BookOpen,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    label: 'Certifications Earned',
    value: '3',
    sub: '2 pending completion',
    icon: Award,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    label: 'Compliance Status',
    value: '85%',
    sub: 'Deadline: Mar 31, 2026',
    icon: ShieldCheck,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
];

// ─── Donut Chart Data ──────────────────────────────────────
const COMPLETION_DATA = [
  { name: 'Completed', value: 8, color: '#10B981' },
  { name: 'In Progress', value: 5, color: '#6366F1' },
  { name: 'Not Started', value: 2, color: '#D1D5DB' },
];

// ─── Learning Hours Data (Last 6 Months) ──────────────────
const LEARNING_HOURS = [
  { month: 'Oct', planned: 40, achieved: 35 },
  { month: 'Nov', planned: 40, achieved: 30 },
  { month: 'Dec', planned: 40, achieved: 38 },
  { month: 'Jan', planned: 40, achieved: 32 },
  { month: 'Feb', planned: 40, achieved: 28 },
  { month: 'Mar', planned: 40, achieved: 12 },
];

// ─── Category Breakdown ────────────────────────────────────
const CATEGORY_BREAKDOWN = [
  { category: 'Technical', total: 6, completed: 4, rate: 67 },
  { category: 'Leadership', total: 3, completed: 2, rate: 67 },
  { category: 'Compliance', total: 4, completed: 1, rate: 25 },
  { category: 'Domain', total: 2, completed: 1, rate: 50 },
];

// ─── Top Learners Leaderboard ──────────────────────────────
const TOP_LEARNERS = [
  { rank: 1, name: 'Amit Verma', hours: 52, courses: 12 },
  { rank: 2, name: 'Sneha Patel', hours: 48, courses: 10 },
  { rank: 3, name: 'Rajesh Kumar', hours: 45, courses: 11 },
  { rank: 4, name: 'Priya Sharma', hours: 42, courses: 8 },
  { rank: 5, name: 'Deepak Rao', hours: 38, courses: 9 },
];

// ─── Course Status Data ────────────────────────────────────
const COURSE_STATUS = {
  completed: 8,
  inProgress: 5,
  assigned: 15,
  overdue: 2,
};

// ─── My Learning Path ──────────────────────────────────────
// IDs align with the course catalog so buttons route correctly
const LEARNING_PATH = [
  {
    id: 'i1',
    title: 'Company Orientation',
    platform: 'Internal',
    mandatory: true,
    status: 'COMPLETED',
    progress: 100,
    dueDate: '2026-01-15',
    duration: '2h',
    certificate: 'CERT-SP-001',
    instructor: 'HR Team',
    completedAt: '2026-01-14',
  },
  {
    id: 'a1',
    title: 'Annual Compliance Training',
    platform: 'Articulate 360',
    mandatory: true,
    status: 'COMPLETED',
    progress: 100,
    dueDate: '2026-01-31',
    duration: '3h',
    certificate: 'CERT-SP-002',
    instructor: 'Legal & Compliance Team',
    completedAt: '2026-01-28',
  },
  {
    id: 'a2',
    title: 'Safety Induction',
    platform: 'Articulate 360',
    mandatory: true,
    status: 'COMPLETED',
    progress: 100,
    dueDate: '2026-02-15',
    duration: '1.5h',
    certificate: 'CERT-SP-003',
    instructor: 'EHS Team',
    completedAt: '2026-02-10',
  },
  {
    id: 'l1',
    title: 'Leadership Foundations',
    platform: 'LinkedIn Learning',
    mandatory: true,
    status: 'IN_PROGRESS',
    progress: 65,
    dueDate: '2026-03-15',
    duration: '6h',
    certificate: null,
    instructor: 'Lisa Earle McLeod',
    completedAt: null,
  },
  {
    id: 'c1',
    title: 'Machine Learning Specialization',
    platform: 'Coursera',
    mandatory: false,
    status: 'IN_PROGRESS',
    progress: 40,
    dueDate: '2026-04-30',
    duration: '12h',
    certificate: null,
    instructor: 'Andrew Ng',
    completedAt: null,
  },
  {
    id: 'u1',
    title: 'React Complete Guide',
    platform: 'Udemy',
    mandatory: false,
    status: 'NOT_STARTED',
    progress: 0,
    dueDate: '2026-05-31',
    duration: '16h',
    certificate: null,
    instructor: 'Maximilian Schwarzmüller',
    completedAt: null,
  },
  {
    id: 'a3',
    title: 'Prevention of Sexual Harassment (POSH)',
    platform: 'Articulate 360',
    mandatory: true,
    status: 'NOT_STARTED',
    progress: 0,
    dueDate: '2026-03-01',
    duration: '1h',
    certificate: null,
    instructor: 'HR & Legal Team',
    completedAt: null,
  },
];

// ─── Recent Course Activity ────────────────────────────────
const RECENT_COURSES = [
  {
    id: 'c1',
    title: 'Machine Learning Specialization',
    platform: 'Coursera',
    category: 'Technical',
    instructor: 'Andrew Ng',
    progress: 40,
    status: 'IN_PROGRESS',
    duration: '12h',
    hasCertificate: true,
  },
  {
    id: 'l1',
    title: 'Leadership Foundations',
    platform: 'LinkedIn Learning',
    category: 'Leadership',
    instructor: 'Lisa Earle McLeod',
    progress: 65,
    status: 'IN_PROGRESS',
    duration: '6h',
    hasCertificate: true,
  },
  {
    id: 'a1',
    title: 'Annual Compliance Training',
    platform: 'Articulate 360',
    category: 'Compliance',
    instructor: 'Legal & Compliance Team',
    progress: 100,
    status: 'COMPLETED',
    duration: '3h',
    hasCertificate: true,
    completedAt: '2026-01-28',
  },
];

const STATUS_STYLES: Record<string, string> = {
  NOT_STARTED: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

const PLATFORM_COLORS: Record<string, { bg: string; text: string }> = {
  Coursera: { bg: 'bg-blue-100', text: 'text-blue-700' },
  'LinkedIn Learning': { bg: 'bg-sky-100', text: 'text-sky-700' },
  Udemy: { bg: 'bg-violet-100', text: 'text-violet-700' },
  'Articulate 360': { bg: 'bg-orange-100', text: 'text-orange-700' },
  Internal: { bg: 'bg-teal-100', text: 'text-teal-700' },
};

function isOverdue(dueDate: string, status: string) {
  return status !== 'COMPLETED' && new Date(dueDate) < new Date('2026-03-10');
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white border rounded-lg shadow-lg p-3 text-xs">
      <p className="font-medium text-gray-700 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value}h
        </p>
      ))}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PieLabel(props: any) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.05) return null;
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {(percent * 100).toFixed(0)}%
    </text>
  );
}

export default function LearningPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const employeeName = session?.user?.name || 'Employee User';

  const handleCertificate = (course: {
    id: string;
    title: string;
    platform: string;
    instructor: string;
    duration: string;
    certificate: string | null;
    completedAt: string | null;
  }) => {
    const certId = course.certificate || `CERT-${course.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    generateCertificate({
      employeeName,
      courseName: course.title,
      platform: course.platform,
      instructor: course.instructor,
      completionDate: course.completedAt || '2026-02-28',
      certId,
      duration: course.duration,
    });
  };

  const navigateToCourse = (courseId: string) => {
    router.push(`/learning/course/${courseId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Learning &amp; Training</h1>
          <p className="text-sm text-gray-500">Courses, certifications, and skill development</p>
        </div>
        <div className="flex gap-2">
          <Link href="/learning/my-courses">
            <Button variant="outline">My Courses</Button>
          </Link>
          <Link href="/learning/courses">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <BookOpen size={16} className="mr-2" /> Browse Catalog
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_STATS.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Donut Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target size={18} className="text-teal-600" />
              Overall Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={COMPLETION_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={PieLabel}
                  >
                    {COMPLETION_DATA.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value} courses`, name]}
                    contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {COMPLETION_DATA.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name} ({entry.value})
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart - Learning Hours */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp size={18} className="text-teal-600" />
              Learning Hours (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={LEARNING_HOURS} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Bar dataKey="planned" name="Planned" fill="#D1D5DB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="achieved" name="Achieved" fill="#0D9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Status + Category + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Course Status Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen size={18} className="text-blue-600" />
              Course Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-sm font-bold text-green-600">{COURSE_STATUS.completed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">In Progress</span>
              <span className="text-sm font-bold text-purple-600">{COURSE_STATUS.inProgress}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Assigned</span>
              <span className="text-sm font-bold text-blue-600">{COURSE_STATUS.assigned}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Overdue</span>
              <span className="text-sm font-bold text-red-600">{COURSE_STATUS.overdue}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-500">Compliance Training</span>
                <span className="text-xs font-semibold text-green-600">85%</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Calendar size={10} /> Deadline: Mar 31, 2026
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap size={18} className="text-purple-600" />
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {CATEGORY_BREAKDOWN.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{cat.category}</span>
                  <span className="text-xs text-gray-500">
                    {cat.completed}/{cat.total} ({cat.rate}%)
                  </span>
                </div>
                <Progress value={cat.rate} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy size={18} className="text-yellow-500" />
              Top Learners
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {TOP_LEARNERS.map((learner) => (
              <div key={learner.rank} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      learner.rank === 1
                        ? 'bg-yellow-100 text-yellow-700'
                        : learner.rank === 2
                        ? 'bg-gray-100 text-gray-600'
                        : learner.rank === 3
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    {learner.rank}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{learner.name}</p>
                    <p className="text-xs text-gray-400">{learner.courses} courses</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-teal-600">{learner.hours}h</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* My Learning Path */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target size={18} className="text-teal-600" />
            My Learning Path
          </CardTitle>
          <Link href="/learning/my-courses">
            <Button variant="ghost" size="sm">
              View All <ChevronRight size={14} className="ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-2">
          {LEARNING_PATH.map((course, idx) => {
            const overdue = isOverdue(course.dueDate, course.status);
            const platformStyle = PLATFORM_COLORS[course.platform] || PLATFORM_COLORS.Internal;
            // Get live progress from localStorage (falls back to default)
            const liveProgress =
              course.status !== 'COMPLETED'
                ? getProgressPercent(course.id, course.progress)
                : course.progress;

            return (
              <div
                key={course.id}
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  overdue ? 'border-red-200 bg-red-50/50' : ''
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex flex-col items-center gap-0.5">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        course.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-700'
                          : course.status === 'IN_PROGRESS'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    {idx < LEARNING_PATH.length - 1 && <div className="w-px h-3 bg-gray-200" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-gray-900">{course.title}</p>
                      <Badge className={`${platformStyle.bg} ${platformStyle.text} text-[10px]`}>
                        {course.platform}
                      </Badge>
                      {course.mandatory && (
                        <Badge className="bg-red-100 text-red-700 text-[10px]">Mandatory</Badge>
                      )}
                      <Badge className={STATUS_STYLES[course.status] + ' text-[10px]'}>
                        {course.status.replace(/_/g, ' ')}
                      </Badge>
                      {overdue && (
                        <Badge className="bg-red-100 text-red-700 text-[10px]">
                          <AlertTriangle size={10} className="mr-0.5" /> Overdue
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>
                        <Clock size={10} className="inline mr-0.5" />
                        {course.duration}
                      </span>
                      <span>Due: {course.dueDate}</span>
                    </div>
                    {course.status === 'IN_PROGRESS' && (
                      <Progress value={liveProgress} className="h-1.5 mt-1.5 max-w-xs" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  {course.certificate && course.status === 'COMPLETED' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => handleCertificate(course)}
                    >
                      <Download size={12} className="mr-1" /> Certificate
                    </Button>
                  )}
                  {course.status === 'IN_PROGRESS' && (
                    <Button
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700 text-xs"
                      onClick={() => navigateToCourse(course.id)}
                    >
                      <Play size={12} className="mr-1" /> Resume
                    </Button>
                  )}
                  {course.status === 'NOT_STARTED' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => navigateToCourse(course.id)}
                    >
                      Start
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Course Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Recent Courses</CardTitle>
          <Link href="/learning/courses">
            <Button variant="ghost" size="sm">
              Browse All <ChevronRight size={14} className="ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RECENT_COURSES.map((course) => {
              const platformStyle = PLATFORM_COLORS[course.platform] || PLATFORM_COLORS.Internal;
              const liveProgress =
                course.status !== 'COMPLETED'
                  ? getProgressPercent(course.id, course.progress)
                  : course.progress;

              return (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <Badge className={`${platformStyle.bg} ${platformStyle.text} text-xs`}>
                        {course.platform}
                      </Badge>
                      {course.hasCertificate && (
                        <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-300">
                          <Award size={10} className="mr-0.5" /> Certificate
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{course.title}</p>
                    <Badge variant="outline" className="text-xs">
                      {course.category}
                    </Badge>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-0.5">
                        <Clock size={12} /> {course.duration}
                      </span>
                      <span>By {course.instructor}</span>
                    </div>
                    {course.status !== 'NOT_STARTED' && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <Badge className={STATUS_STYLES[course.status] + ' text-[10px]'}>
                            {course.status.replace(/_/g, ' ')}
                          </Badge>
                          <span className="text-xs font-medium">{liveProgress}%</span>
                        </div>
                        <Progress value={liveProgress} className="h-1.5" />
                      </div>
                    )}
                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-1">
                      {course.status === 'COMPLETED' && course.hasCertificate && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                          onClick={() =>
                            handleCertificate({
                              id: course.id,
                              title: course.title,
                              platform: course.platform,
                              instructor: course.instructor,
                              duration: course.duration,
                              certificate: null,
                              completedAt: (course as { completedAt?: string }).completedAt || null,
                            })
                          }
                        >
                          <Download size={12} className="mr-1" /> Certificate
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className={`flex-1 ${
                          course.status === 'COMPLETED'
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-teal-600 hover:bg-teal-700'
                        }`}
                        onClick={() => navigateToCourse(course.id)}
                      >
                        {course.status === 'COMPLETED'
                          ? 'Review'
                          : course.status === 'IN_PROGRESS'
                          ? 'Resume'
                          : 'Start'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
