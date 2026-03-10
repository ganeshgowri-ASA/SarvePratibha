'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Play,
  Award,
  Clock,
  Download,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  generateCertificate,
  getCourseProgress,
  PLATFORM_STYLES,
} from '@/lib/learning-service';

// ─── Enrolled Courses Data ──────────────────────────────────────────────────
const ENROLLED = [
  {
    id: 'c1',
    title: 'Machine Learning Specialization',
    platform: 'Coursera' as const,
    category: 'Technical',
    progress: 40,
    status: 'IN_PROGRESS',
    duration: '12h',
    modules: 8,
    completed: 3,
    startedAt: '2026-01-10',
    dueDate: '2026-04-30',
    mandatory: false,
    instructor: 'Andrew Ng',
  },
  {
    id: 'l1',
    title: 'Leadership Foundations',
    platform: 'LinkedIn Learning' as const,
    category: 'Leadership',
    progress: 65,
    status: 'IN_PROGRESS',
    duration: '6h',
    modules: 5,
    completed: 3,
    startedAt: '2026-02-01',
    dueDate: '2026-03-15',
    mandatory: true,
    instructor: 'Lisa Earle McLeod',
  },
  {
    id: 'c2',
    title: 'Google Project Management',
    platform: 'Coursera' as const,
    category: 'Business',
    progress: 20,
    status: 'IN_PROGRESS',
    duration: '8h',
    modules: 5,
    completed: 1,
    startedAt: '2026-02-15',
    dueDate: '2026-04-15',
    mandatory: false,
    instructor: 'Google',
  },
  {
    id: 'i2',
    title: 'Product Training',
    platform: 'Internal' as const,
    category: 'Domain',
    progress: 55,
    status: 'IN_PROGRESS',
    duration: '6h',
    modules: 4,
    completed: 2,
    startedAt: '2026-01-20',
    dueDate: '2026-03-31',
    mandatory: true,
    instructor: 'Product Team',
  },
  {
    id: 'a3',
    title: 'Prevention of Sexual Harassment (POSH)',
    platform: 'Articulate 360' as const,
    category: 'Compliance',
    progress: 0,
    status: 'NOT_STARTED',
    duration: '1h',
    modules: 3,
    completed: 0,
    startedAt: null,
    dueDate: '2026-03-01',
    mandatory: true,
    instructor: 'HR & Legal Team',
  },
];

const COMPLETED_COURSES = [
  {
    id: 'i1',
    title: 'Company Orientation',
    platform: 'Internal' as const,
    category: 'Domain',
    duration: '2h',
    completedAt: '2026-01-14',
    certificate: 'CERT-SP-001',
    instructor: 'HR Team',
  },
  {
    id: 'a1',
    title: 'Annual Compliance Training',
    platform: 'Articulate 360' as const,
    category: 'Compliance',
    duration: '3h',
    completedAt: '2026-01-28',
    certificate: 'CERT-SP-002',
    instructor: 'Legal & Compliance Team',
  },
  {
    id: 'a2',
    title: 'Safety Induction',
    platform: 'Articulate 360' as const,
    category: 'Compliance',
    duration: '1.5h',
    completedAt: '2026-02-10',
    certificate: 'CERT-SP-003',
    instructor: 'EHS Team',
  },
  {
    id: 'c3',
    title: 'AWS Cloud Practitioner',
    platform: 'Coursera' as const,
    category: 'Technical',
    duration: '10h',
    completedAt: '2025-12-20',
    certificate: 'CERT-AWS-001',
    instructor: 'AWS Training',
  },
  {
    id: 'comm1',
    title: 'Effective Communication',
    platform: 'LinkedIn Learning' as const,
    category: 'Soft Skills',
    duration: '3h',
    completedAt: '2025-12-05',
    certificate: 'CERT-LL-001',
    instructor: 'Brenda Bailey-Hughes',
  },
  {
    id: 'git1',
    title: 'Git & Version Control',
    platform: 'Internal' as const,
    category: 'Technical',
    duration: '2h',
    completedAt: '2025-11-20',
    certificate: 'CERT-INT-001',
    instructor: 'Engineering Team',
  },
  {
    id: 'react1',
    title: 'Advanced React Patterns',
    platform: 'Udemy' as const,
    category: 'Technical',
    duration: '8h',
    completedAt: '2025-11-01',
    certificate: null,
    instructor: 'Priya Shah',
  },
  {
    id: 'pm1',
    title: 'Project Management Essentials',
    platform: 'Internal' as const,
    category: 'Business',
    duration: '5h',
    completedAt: '2025-10-15',
    certificate: null,
    instructor: 'PMO Team',
  },
];

function isOverdue(dueDate: string, status: string) {
  return status !== 'COMPLETED' && new Date(dueDate) < new Date('2026-03-10');
}

export default function MyCoursesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const employeeName = session?.user?.name || 'Employee User';

  // Live progress from localStorage (re-reads on mount)
  const [liveProgress, setLiveProgress] = useState<Record<string, { progress: number; status: string }>>({});

  useEffect(() => {
    const map: Record<string, { progress: number; status: string }> = {};
    ENROLLED.forEach((c) => {
      const stored = getCourseProgress(c.id);
      if (stored) {
        map[c.id] = { progress: stored.progress, status: stored.status };
      }
    });
    setLiveProgress(map);
  }, []);

  const getEffectiveProgress = (id: string, fallback: number) =>
    liveProgress[id]?.progress ?? fallback;

  const getEffectiveStatus = (id: string, fallback: string) =>
    liveProgress[id]?.status ?? fallback;

  const overdue = ENROLLED.filter((c) => isOverdue(c.dueDate, c.status));

  const handleCertificate = (course: {
    id: string;
    title: string;
    platform: string;
    instructor: string;
    duration: string;
    certificate: string | null;
    completedAt: string;
  }) => {
    const certId =
      course.certificate ||
      `CERT-${course.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    generateCertificate({
      employeeName,
      courseName: course.title,
      platform: course.platform,
      instructor: course.instructor,
      completionDate: course.completedAt,
      certId,
      duration: course.duration,
    });
  };

  const navigateToCourse = (id: string) => router.push(`/learning/course/${id}`);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-sm text-gray-500">Track your enrolled and completed courses</p>
        </div>
        <Link href="/learning/courses">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <BookOpen size={16} className="mr-2" /> Browse Catalog
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-50">
                <Play size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ENROLLED.filter((c) => getEffectiveStatus(c.id, c.status) === 'IN_PROGRESS').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-green-50">
                <Award size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{COMPLETED_COURSES.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-yellow-50">
                <Award size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Certificates</p>
                <p className="text-2xl font-bold text-gray-900">
                  {COMPLETED_COURSES.filter((c) => c.certificate).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-red-50">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{overdue.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="in-progress">
        <TabsList>
          <TabsTrigger value="in-progress">
            In Progress &amp; Assigned ({ENROLLED.length})
          </TabsTrigger>
          <TabsTrigger value="completed">Completed ({COMPLETED_COURSES.length})</TabsTrigger>
        </TabsList>

        {/* In-Progress Tab */}
        <TabsContent value="in-progress" className="space-y-3 mt-4">
          {ENROLLED.map((course) => {
            const platformStyle =
              PLATFORM_STYLES[course.platform] || PLATFORM_STYLES.Internal;
            const overdueFlag = isOverdue(course.dueDate, course.status);
            const effectiveProgress = getEffectiveProgress(course.id, course.progress);
            const effectiveStatus = getEffectiveStatus(course.id, course.status);
            const completedModules = effectiveProgress > 0
              ? Math.round((effectiveProgress / 100) * course.modules)
              : course.completed;

            return (
              <Card key={course.id} className={overdueFlag ? 'border-red-200' : ''}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          effectiveStatus === 'IN_PROGRESS' ? 'bg-purple-50' : 'bg-gray-50'
                        }`}
                      >
                        <Play
                          size={18}
                          className={
                            effectiveStatus === 'IN_PROGRESS'
                              ? 'text-purple-600'
                              : 'text-gray-400'
                          }
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {course.title}
                          </p>
                          <Badge
                            className={`${platformStyle.bg} ${platformStyle.text} text-[10px]`}
                          >
                            {course.platform}
                          </Badge>
                          {course.mandatory && (
                            <Badge className="bg-red-100 text-red-700 text-[10px]">
                              Mandatory
                            </Badge>
                          )}
                          {overdueFlag && (
                            <Badge className="bg-red-100 text-red-700 text-[10px]">
                              <AlertTriangle size={10} className="mr-0.5" /> Overdue
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {course.category}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            <Clock size={10} className="inline mr-0.5" />
                            {course.duration}
                          </span>
                          <span className="text-xs text-gray-500">
                            {completedModules}/{course.modules} modules
                          </span>
                          <span className="text-xs text-gray-400">By {course.instructor}</span>
                          <span className="text-xs text-gray-400 flex items-center gap-0.5">
                            <Calendar size={10} /> Due: {course.dueDate}
                          </span>
                        </div>
                        {effectiveStatus === 'IN_PROGRESS' && (
                          <div className="flex items-center gap-2 mt-2">
                            <Progress
                              value={effectiveProgress}
                              className="h-2 flex-1 max-w-sm"
                            />
                            <span className="text-sm font-medium">{effectiveProgress}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className={`ml-3 shrink-0 ${
                        effectiveStatus === 'IN_PROGRESS'
                          ? 'bg-teal-600 hover:bg-teal-700'
                          : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                      onClick={() => navigateToCourse(course.id)}
                    >
                      {effectiveStatus === 'IN_PROGRESS' ? 'Continue' : 'Start'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Completed Tab */}
        <TabsContent value="completed" className="space-y-3 mt-4">
          {COMPLETED_COURSES.map((course) => {
            const platformStyle =
              PLATFORM_STYLES[course.platform] || PLATFORM_STYLES.Internal;

            return (
              <Card key={course.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-green-50 rounded-lg shrink-0">
                        <Award size={18} className="text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {course.title}
                          </p>
                          <Badge
                            className={`${platformStyle.bg} ${platformStyle.text} text-[10px]`}
                          >
                            {course.platform}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {course.category}
                          </Badge>
                          <span className="text-xs text-gray-500">{course.duration}</span>
                          <span className="text-xs text-gray-400">By {course.instructor}</span>
                          <span className="text-xs text-gray-400">
                            Completed: {course.completedAt}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className="bg-green-100 text-green-700">Completed</Badge>
                      {course.certificate ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-yellow-700 border-yellow-300 hover:bg-yellow-50"
                          onClick={() => handleCertificate(course)}
                        >
                          <Download size={14} className="mr-1" /> Certificate
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled
                          className="text-gray-400 text-xs"
                        >
                          No Certificate
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigateToCourse(course.id)}
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
