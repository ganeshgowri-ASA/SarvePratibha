'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  CheckCircle2,
  Circle,
  Lock,
  Award,
  Download,
  GraduationCap,
  Layers,
  Building2,
  Calendar,
  ArrowLeft,
  RefreshCw,
  Youtube,
  Video,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import {
  CourseData,
  CourseModule,
  CourseProgress,
  fetchCourseById,
  generateCertificate,
  getCourseProgressWithDefault,
  getVideoEmbedUrl,
  initCourseProgress,
  PLATFORM_STYLES,
  saveModuleComplete,
} from '@/lib/learning-service';

// ─── Platform Icon Map ──────────────────────────────────────────────────────
const PLATFORM_ICONS: Record<string, typeof BookOpen> = {
  Coursera: GraduationCap,
  'LinkedIn Learning': Layers,
  Udemy: BookOpen,
  YouTube: Youtube,
  Vimeo: Video,
  Dailymotion: Play,
  'Articulate 360': Building2,
  Internal: BookOpen,
};

const LEVEL_STYLES: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-purple-100 text-purple-700',
};

// ─── Default progress map for pre-seeded courses ────────────────────────────
const DEFAULT_PROGRESS: Record<string, { progress: number; status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' }> = {
  c1: { progress: 40, status: 'IN_PROGRESS' },
  c2: { progress: 20, status: 'IN_PROGRESS' },
  c3: { progress: 100, status: 'COMPLETED' },
  l1: { progress: 65, status: 'IN_PROGRESS' },
  a1: { progress: 100, status: 'COMPLETED' },
  a2: { progress: 100, status: 'COMPLETED' },
  i1: { progress: 100, status: 'COMPLETED' },
  i2: { progress: 55, status: 'IN_PROGRESS' },
};

// ─── Video Player Dialog ────────────────────────────────────────────────────
function VideoPlayerDialog({
  open,
  onOpenChange,
  module,
  onComplete,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  module: CourseModule | null;
  onComplete: (moduleId: string) => void;
}) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (open) setCompleted(false);
  }, [open, module?.id]);

  if (!module) return null;

  const embedUrl = getVideoEmbedUrl(module.videoProvider, module.videoId);

  const handleMarkComplete = () => {
    setCompleted(true);
    onComplete(module.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-3 border-b">
          <DialogTitle className="text-base font-semibold text-gray-900 pr-8">{module.title}</DialogTitle>
          <p className="text-xs text-gray-500 mt-0.5">{module.description}</p>
        </DialogHeader>

        {/* Video Embed */}
        <div className="relative w-full bg-black" style={{ paddingTop: '56.25%' }}>
          <iframe
            key={module.id}
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={module.title}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between border-t bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={14} />
            <span>{module.duration}</span>
            <span className="mx-1">·</span>
            <span className="capitalize">{module.videoProvider}</span>
          </div>
          <div className="flex items-center gap-3">
            {completed ? (
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <CheckCircle2 size={16} fill="currentColor" />
                Module Completed!
              </div>
            ) : (
              <Button
                onClick={handleMarkComplete}
                className="bg-teal-600 hover:bg-teal-700 text-sm"
              >
                <CheckCircle2 size={14} className="mr-1.5" />
                Mark as Complete
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Certificate Dialog ─────────────────────────────────────────────────────
function CertificateSection({
  course,
  progress,
  employeeName,
}: {
  course: CourseData;
  progress: CourseProgress;
  employeeName: string;
}) {
  if (!course.hasCertificate || progress.status !== 'COMPLETED') return null;

  const completionDate = progress.completedAt || new Date().toLocaleDateString('en-IN');
  const certId = `CERT-${course.platform.slice(0, 2).toUpperCase()}-${course.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

  const handleDownload = () => {
    generateCertificate({
      employeeName,
      courseName: course.title,
      platform: course.platform,
      instructor: course.instructor,
      completionDate,
      certId,
      duration: course.duration,
    });
  };

  return (
    <Card className="border-yellow-200 bg-yellow-50/50">
      <CardContent className="pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-yellow-100 rounded-lg">
              <Award size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Certificate of Completion</p>
              <p className="text-xs text-gray-500">Completed on {completionDate}</p>
            </div>
          </div>
          <Button onClick={handleDownload} className="bg-yellow-600 hover:bg-yellow-700 text-white">
            <Download size={14} className="mr-1.5" /> Download Certificate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<CourseData | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<CourseModule | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);

  const employeeName = session?.user?.name || 'Employee User';

  // Load course + progress
  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    fetchCourseById(courseId).then((found) => {
      if (!found) {
        setLoading(false);
        return;
      }
      setCourse(found);
      const defaults = DEFAULT_PROGRESS[courseId] || { progress: 0, status: 'NOT_STARTED' as const };
      const p = getCourseProgressWithDefault(courseId, defaults.progress, defaults.status, found);
      setProgress(p);
      setLoading(false);
    });
  }, [courseId]);

  const handleModuleComplete = useCallback(
    (moduleId: string) => {
      if (!course) return;
      const updated = saveModuleComplete(courseId, moduleId, course);
      setProgress(updated);
    },
    [courseId, course]
  );

  const openModule = (mod: CourseModule) => {
    setActiveModule(mod);
    setPlayerOpen(true);
  };

  const handleStartCourse = () => {
    if (!course) return;
    const p = initCourseProgress(courseId);
    setProgress(p);
    // Open first module
    const firstModule = course.modules[0];
    if (firstModule) openModule(firstModule);
  };

  const handleResume = () => {
    if (!course || !progress) return;
    // Find the next incomplete module
    const nextModule = course.modules.find((m) => !progress.completedModules.includes(m.id));
    if (nextModule) openModule(nextModule);
    else openModule(course.modules[course.modules.length - 1]); // review last if all done
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <RefreshCw size={32} className="mx-auto text-teal-600 animate-spin" />
          <p className="text-gray-500 text-sm">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-16">
        <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-600 font-medium">Course not found</p>
        <p className="text-sm text-gray-400 mb-4">The course you&apos;re looking for doesn&apos;t exist.</p>
        <Button variant="outline" onClick={() => router.push('/learning/courses')}>
          Browse Course Catalog
        </Button>
      </div>
    );
  }

  const platformInfo = PLATFORM_STYLES[course.platform] || PLATFORM_STYLES.Internal;
  const PlatformIcon = PLATFORM_ICONS[course.platform] || BookOpen;
  const completedCount = progress?.completedModules.length || 0;
  const progressPct = progress?.progress || 0;
  const isCompleted = progress?.status === 'COMPLETED';
  const isStarted = progress?.status !== 'NOT_STARTED';

  // Compute module states
  const moduleStates = course.modules.map((mod) => {
    if (progress?.completedModules.includes(mod.id)) return 'completed';
    const idx = course.modules.indexOf(mod);
    // Current = first incomplete module (after some are completed)
    if (idx === completedCount) return 'current';
    // Locked = not yet reached
    return 'locked';
  });

  return (
    <>
      <VideoPlayerDialog
        open={playerOpen}
        onOpenChange={setPlayerOpen}
        module={activeModule}
        onComplete={handleModuleComplete}
      />

      <div className="space-y-5">
        {/* Back Link */}
        <Link
          href="/learning/courses"
          className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-800 hover:underline"
        >
          <ArrowLeft size={14} /> Back to Course Catalog
        </Link>

        {/* Course Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge className={`${platformInfo.bg} ${platformInfo.text}`}>
                <PlatformIcon size={12} className="mr-1" />
                {course.platform}
              </Badge>
              <Badge className={LEVEL_STYLES[course.level]}>{course.level}</Badge>
              <Badge variant="outline">{course.category}</Badge>
              {course.mandatory && <Badge className="bg-red-100 text-red-700">Mandatory</Badge>}
              {course.hasCertificate && (
                <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                  <Award size={12} className="mr-0.5" /> Certificate
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-sm text-gray-500 mt-1.5 max-w-2xl leading-relaxed">{course.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-1">
                <Clock size={14} /> {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} /> {course.enrollments.toLocaleString()} enrolled
              </span>
              <span className="flex items-center gap-1">
                <Star size={14} className="text-yellow-500" fill="currentColor" /> {course.rating}
              </span>
              <span>By {course.instructor}</span>
              {course.dueDate && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> Due: {course.dueDate}
                </span>
              )}
            </div>
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {course.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Certificate Section (shown when completed) */}
        {progress && (
          <CertificateSection course={course} progress={progress} employeeName={employeeName} />
        )}

        {/* Progress Card */}
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Course Progress</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-teal-600">{progressPct}%</span>
                <span className="text-xs text-gray-400">
                  {completedCount} / {course.modules.length} modules
                </span>
              </div>
            </div>
            <Progress value={progressPct} className="h-3 mb-3" />

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              {!isStarted && (
                <Button onClick={handleStartCourse} className="bg-teal-600 hover:bg-teal-700">
                  <Play size={14} className="mr-1.5" /> Start Course
                </Button>
              )}
              {isStarted && !isCompleted && (
                <Button onClick={handleResume} className="bg-teal-600 hover:bg-teal-700">
                  <Play size={14} className="mr-1.5" /> Resume ({progressPct}%)
                </Button>
              )}
              {isCompleted && (
                <Button onClick={handleResume} variant="outline">
                  <RefreshCw size={14} className="mr-1.5" /> Review Course
                </Button>
              )}
              {progress?.startedAt && (
                <span className="text-xs text-gray-400">
                  Started: {progress.startedAt}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modules List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Course Modules ({course.modules.length})</span>
              {isCompleted && (
                <Badge className="bg-green-100 text-green-700 font-medium">All Completed</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 pb-4">
            {course.modules.map((mod, idx) => {
              const state = moduleStates[idx];
              const isLocked = state === 'locked';
              const isCurrent = state === 'current';
              const isDone = state === 'completed';

              return (
                <div
                  key={mod.id}
                  className={`flex items-center justify-between p-3.5 rounded-lg border transition-all ${
                    isCurrent
                      ? 'bg-teal-50 border-teal-200 shadow-sm'
                      : isDone
                      ? 'border-transparent hover:bg-gray-50'
                      : 'border-transparent opacity-55'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Status Icon */}
                    <div className="shrink-0">
                      {isDone && (
                        <CheckCircle2 size={20} className="text-green-500" fill="currentColor" />
                      )}
                      {isCurrent && <Play size={20} className="text-teal-600" />}
                      {isLocked && <Lock size={20} className="text-gray-300" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          isCurrent ? 'text-teal-700' : isDone ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {idx + 1}. {mod.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                        <span className="flex items-center gap-0.5">
                          <Clock size={10} /> {mod.duration}
                        </span>
                        <span>·</span>
                        <span className="capitalize">{mod.videoProvider}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="ml-3 shrink-0">
                    {isDone && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-500 hover:text-teal-600 text-xs"
                        onClick={() => openModule(mod)}
                      >
                        <Play size={12} className="mr-1" /> Review
                      </Button>
                    )}
                    {isCurrent && (
                      <Button
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-700 text-xs"
                        onClick={() => openModule(mod)}
                      >
                        <Play size={12} className="mr-1" /> Start
                      </Button>
                    )}
                    {isLocked && (
                      <span className="text-xs text-gray-300 px-2">Locked</span>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* About Instructor */}
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                {course.instructor.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{course.instructor}</p>
                <p className="text-xs text-gray-500">{course.platform} Instructor</p>
              </div>
              <div className="ml-auto flex items-center gap-1 text-yellow-500">
                <Star size={14} fill="currentColor" />
                <span className="text-sm font-medium text-gray-700">{course.rating}</span>
                <span className="text-xs text-gray-400 ml-1">({course.enrollments.toLocaleString()} students)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
