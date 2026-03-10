'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  ExternalLink,
  GraduationCap,
  Linkedin,
  Layers,
  Building2,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

const COURSE = {
  id: 'c1',
  title: 'Machine Learning Specialization',
  description: 'Master fundamental AI concepts and develop practical machine learning skills. Learn supervised learning, unsupervised learning, recommender systems, and reinforcement learning with best practices from Stanford University and DeepLearning.AI.',
  platform: 'Coursera',
  category: 'Technical',
  level: 'Intermediate',
  duration: '12 hours',
  instructor: 'Andrew Ng',
  rating: 4.9,
  enrollments: 320,
  isEnrolled: true,
  progress: 40,
  mandatory: false,
  dueDate: '2026-04-30',
  hasCertificate: true,
  startedAt: '2026-01-10',
};

const MODULES = [
  { id: '1', title: 'Introduction to Machine Learning', duration: '30 min', status: 'completed' },
  { id: '2', title: 'Linear Regression with One Variable', duration: '45 min', status: 'completed' },
  { id: '3', title: 'Linear Regression with Multiple Variables', duration: '50 min', status: 'completed' },
  { id: '4', title: 'Logistic Regression', duration: '45 min', status: 'completed' },
  { id: '5', title: 'Regularization', duration: '40 min', status: 'completed' },
  { id: '6', title: 'Neural Networks: Representation', duration: '55 min', status: 'completed' },
  { id: '7', title: 'Neural Networks: Learning', duration: '50 min', status: 'current' },
  { id: '8', title: 'Advice for Applying ML', duration: '45 min', status: 'locked' },
  { id: '9', title: 'Machine Learning System Design', duration: '40 min', status: 'locked' },
  { id: '10', title: 'Support Vector Machines', duration: '50 min', status: 'locked' },
  { id: '11', title: 'Unsupervised Learning', duration: '55 min', status: 'locked' },
  { id: '12', title: 'Dimensionality Reduction', duration: '35 min', status: 'locked' },
  { id: '13', title: 'Anomaly Detection', duration: '40 min', status: 'locked' },
  { id: '14', title: 'Recommender Systems', duration: '45 min', status: 'locked' },
  { id: '15', title: 'Large Scale ML', duration: '50 min', status: 'locked' },
  { id: '16', title: 'Final Assessment & Certificate', duration: '60 min', status: 'locked' },
];

const STATUS_ICON: Record<string, typeof CheckCircle2> = {
  completed: CheckCircle2,
  current: Play,
  locked: Lock,
};

const PLATFORM_INFO: Record<string, { bg: string; text: string; icon: typeof BookOpen }> = {
  Coursera: { bg: 'bg-blue-100', text: 'text-blue-700', icon: GraduationCap },
  'LinkedIn Learning': { bg: 'bg-sky-100', text: 'text-sky-700', icon: Linkedin },
  Udemy: { bg: 'bg-violet-100', text: 'text-violet-700', icon: Layers },
  'Articulate 360': { bg: 'bg-orange-100', text: 'text-orange-700', icon: Building2 },
  Internal: { bg: 'bg-teal-100', text: 'text-teal-700', icon: BookOpen },
};

const LEVEL_STYLES: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-purple-100 text-purple-700',
};

export default function CourseDetailPage() {
  const platformInfo = PLATFORM_INFO[COURSE.platform] || PLATFORM_INFO.Internal;
  const PlatformIcon = platformInfo.icon;
  const completedModules = MODULES.filter((m) => m.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link href="/learning/courses" className="text-sm text-teal-600 hover:underline">
        Back to Course Catalog
      </Link>

      {/* Course Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge className={`${platformInfo.bg} ${platformInfo.text}`}>
              <PlatformIcon size={12} className="mr-1" />
              {COURSE.platform}
            </Badge>
            <Badge className={LEVEL_STYLES[COURSE.level]}>{COURSE.level}</Badge>
            <Badge variant="outline">{COURSE.category}</Badge>
            {COURSE.mandatory && (
              <Badge className="bg-red-100 text-red-700">Mandatory</Badge>
            )}
            {COURSE.hasCertificate && (
              <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                <Award size={12} className="mr-0.5" /> Certificate Available
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{COURSE.title}</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">{COURSE.description}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 flex-wrap">
            <span className="flex items-center gap-1"><Clock size={14} /> {COURSE.duration}</span>
            <span className="flex items-center gap-1"><Users size={14} /> {COURSE.enrollments} enrolled</span>
            <span className="flex items-center gap-1">
              <Star size={14} className="text-yellow-500" fill="currentColor" /> {COURSE.rating}
            </span>
            <span>By {COURSE.instructor}</span>
            {COURSE.dueDate && (
              <span className="flex items-center gap-1">
                <Calendar size={14} /> Due: {COURSE.dueDate}
              </span>
            )}
          </div>
        </div>
        {!COURSE.isEnrolled && (
          <Button className="bg-teal-600 hover:bg-teal-700">Enroll Now</Button>
        )}
      </div>

      {/* Progress + Actions */}
      {COURSE.isEnrolled && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Course Progress</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-teal-600">{COURSE.progress}%</span>
                {COURSE.progress === 100 && COURSE.hasCertificate && (
                  <Button size="sm" variant="outline">
                    <Download size={14} className="mr-1" /> Download Certificate
                  </Button>
                )}
              </div>
            </div>
            <Progress value={COURSE.progress} className="h-3" />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                {completedModules} of {MODULES.length} modules completed
              </p>
              {COURSE.startedAt && (
                <p className="text-xs text-gray-400">Started: {COURSE.startedAt}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Course Modules ({MODULES.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {MODULES.map((mod, idx) => {
            const Icon = STATUS_ICON[mod.status] || Circle;
            return (
              <div
                key={mod.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  mod.status === 'current' ? 'bg-teal-50 border border-teal-200' :
                  mod.status === 'completed' ? 'hover:bg-gray-50' :
                  'opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={20}
                    className={
                      mod.status === 'completed' ? 'text-green-500' :
                      mod.status === 'current' ? 'text-teal-600' :
                      'text-gray-400'
                    }
                    fill={mod.status === 'completed' ? 'currentColor' : 'none'}
                  />
                  <div>
                    <p className={`text-sm ${mod.status === 'current' ? 'font-semibold text-teal-700' : 'font-medium text-gray-900'}`}>
                      {idx + 1}. {mod.title}
                    </p>
                    <p className="text-xs text-gray-500">{mod.duration}</p>
                  </div>
                </div>
                {mod.status === 'current' && (
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                    <Play size={14} className="mr-1" /> Start
                  </Button>
                )}
                {mod.status === 'completed' && (
                  <Button size="sm" variant="ghost" className="text-gray-500">Review</Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
