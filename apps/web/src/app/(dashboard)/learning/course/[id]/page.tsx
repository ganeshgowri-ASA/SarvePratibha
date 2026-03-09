'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Users, Star, Play, CheckCircle2, Circle, Lock } from 'lucide-react';

const COURSE = {
  id: '1',
  title: 'Advanced React Patterns',
  description: 'Master advanced React patterns including render props, higher-order components, compound components, and custom hooks. Build performant and maintainable React applications.',
  category: 'Technical',
  level: 'Advanced',
  duration: '8 hours',
  instructor: 'Priya Shah',
  rating: 4.8,
  enrollments: 85,
  isEnrolled: true,
  progress: 75,
};

const MODULES = [
  { id: '1', title: 'Introduction to Advanced Patterns', duration: '30 min', status: 'completed' },
  { id: '2', title: 'Render Props Pattern', duration: '45 min', status: 'completed' },
  { id: '3', title: 'Higher-Order Components', duration: '45 min', status: 'completed' },
  { id: '4', title: 'Compound Components', duration: '50 min', status: 'completed' },
  { id: '5', title: 'Custom Hooks Deep Dive', duration: '60 min', status: 'completed' },
  { id: '6', title: 'State Management Patterns', duration: '45 min', status: 'completed' },
  { id: '7', title: 'Performance Optimization', duration: '50 min', status: 'completed' },
  { id: '8', title: 'Context Patterns', duration: '40 min', status: 'completed' },
  { id: '9', title: 'Controlled vs Uncontrolled', duration: '35 min', status: 'completed' },
  { id: '10', title: 'Testing Patterns', duration: '45 min', status: 'current' },
  { id: '11', title: 'Server Components', duration: '50 min', status: 'locked' },
  { id: '12', title: 'Final Project & Assessment', duration: '60 min', status: 'locked' },
];

const STATUS_ICON: Record<string, typeof CheckCircle2> = {
  completed: CheckCircle2,
  current: Play,
  locked: Lock,
};

export default function CourseDetailPage() {
  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-purple-100 text-purple-700">{COURSE.level}</Badge>
            <Badge variant="outline">{COURSE.category}</Badge>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{COURSE.title}</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">{COURSE.description}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Clock size={14} /> {COURSE.duration}</span>
            <span className="flex items-center gap-1"><Users size={14} /> {COURSE.enrollments} enrolled</span>
            <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500" fill="currentColor" /> {COURSE.rating}</span>
            <span>By {COURSE.instructor}</span>
          </div>
        </div>
        {!COURSE.isEnrolled && (
          <Button className="bg-teal-600 hover:bg-teal-700">Enroll Now</Button>
        )}
      </div>

      {/* Progress */}
      {COURSE.isEnrolled && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Course Progress</span>
              <span className="text-sm font-bold text-teal-600">{COURSE.progress}%</span>
            </div>
            <Progress value={COURSE.progress} className="h-3" />
            <p className="text-xs text-gray-500 mt-2">
              {MODULES.filter((m) => m.status === 'completed').length} of {MODULES.length} modules completed
            </p>
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
