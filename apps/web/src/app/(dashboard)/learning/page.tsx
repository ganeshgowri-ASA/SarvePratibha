'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Award, Clock, Play, GraduationCap } from 'lucide-react';
import Link from 'next/link';

const STATS = [
  { label: 'Available Courses', value: '24', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Enrolled', value: '5', icon: Play, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Completed', value: '8', icon: Award, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Learning Hours', value: '42h', icon: Clock, color: 'text-teal-600', bg: 'bg-teal-50' },
];

const MY_COURSES = [
  { id: '1', title: 'Advanced React Patterns', category: 'Technical', progress: 75, status: 'IN_PROGRESS', duration: '8h', modules: 12, completed: 9 },
  { id: '2', title: 'Leadership Fundamentals', category: 'Leadership', progress: 40, status: 'IN_PROGRESS', duration: '6h', modules: 8, completed: 3 },
  { id: '3', title: 'AWS Cloud Practitioner', category: 'Technical', progress: 100, status: 'COMPLETED', duration: '12h', modules: 15, completed: 15 },
];

const RECOMMENDED = [
  { id: '4', title: 'System Design Masterclass', category: 'Technical', level: 'Advanced', duration: '16h', modules: 20, enrollments: 45 },
  { id: '5', title: 'Data-Driven Decision Making', category: 'Business', level: 'Intermediate', duration: '4h', modules: 6, enrollments: 120 },
  { id: '6', title: 'Effective Communication', category: 'Soft Skills', level: 'Beginner', duration: '3h', modules: 5, enrollments: 200 },
];

const STATUS_STYLES: Record<string, string> = {
  ENROLLED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

const LEVEL_STYLES: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-purple-100 text-purple-700',
};

export default function LearningPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Learning</h1>
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* My Active Courses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">My Active Courses</CardTitle>
          <Link href="/learning/my-courses">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {MY_COURSES.map((course) => (
            <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <BookOpen size={18} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{course.title}</p>
                    <Badge className={STATUS_STYLES[course.status]}>{course.status.replace('_', ' ')}</Badge>
                  </div>
                  <p className="text-xs text-gray-500">{course.category} | {course.duration} | {course.completed}/{course.modules} modules</p>
                  <Progress value={course.progress} className="h-1.5 mt-1" />
                </div>
              </div>
              <Link href={`/learning/course/${course.id}`}>
                <Button size="sm" variant="outline">
                  {course.status === 'COMPLETED' ? 'Review' : 'Continue'}
                </Button>
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommended */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recommended for You</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RECOMMENDED.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={LEVEL_STYLES[course.level]}>{course.level}</Badge>
                    <Badge variant="outline" className="text-xs">{course.category}</Badge>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{course.title}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-0.5"><Clock size={12} /> {course.duration}</span>
                    <span>{course.modules} modules</span>
                    <span>{course.enrollments} enrolled</span>
                  </div>
                  <Link href={`/learning/course/${course.id}`}>
                    <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700 mt-1">Enroll</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
