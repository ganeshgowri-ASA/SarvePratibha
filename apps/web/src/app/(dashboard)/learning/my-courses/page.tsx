'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Play, Award, Clock } from 'lucide-react';
import Link from 'next/link';

const ENROLLED = [
  { id: '1', title: 'Advanced React Patterns', category: 'Technical', progress: 75, status: 'IN_PROGRESS', duration: '8h', modules: 12, completed: 9, startedAt: '2026-02-01' },
  { id: '2', title: 'Leadership Fundamentals', category: 'Leadership', progress: 40, status: 'IN_PROGRESS', duration: '6h', modules: 8, completed: 3, startedAt: '2026-02-15' },
];

const COMPLETED_COURSES = [
  { id: '3', title: 'AWS Cloud Practitioner', category: 'Technical', progress: 100, duration: '12h', completedAt: '2026-01-28', certificate: 'CERT-001' },
  { id: '4', title: 'Effective Communication', category: 'Soft Skills', progress: 100, duration: '3h', completedAt: '2026-01-15', certificate: 'CERT-002' },
  { id: '5', title: 'Git & Version Control', category: 'Technical', progress: 100, duration: '2h', completedAt: '2025-12-20', certificate: 'CERT-003' },
];

export default function MyCoursesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <p className="text-sm text-gray-500">Track your enrolled and completed courses</p>
      </div>

      <Tabs defaultValue="in-progress">
        <TabsList>
          <TabsTrigger value="in-progress">In Progress ({ENROLLED.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({COMPLETED_COURSES.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="in-progress" className="space-y-3 mt-4">
          {ENROLLED.map((course) => (
            <Card key={course.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Play size={18} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{course.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-xs">{course.category}</Badge>
                        <span className="text-xs text-gray-500">
                          <Clock size={10} className="inline mr-0.5" />{course.duration}
                        </span>
                        <span className="text-xs text-gray-500">{course.completed}/{course.modules} modules</span>
                        <span className="text-xs text-gray-400">Started: {course.startedAt}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress value={course.progress} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{course.progress}%</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/learning/course/${course.id}`}>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 ml-3">Continue</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3 mt-4">
          {COMPLETED_COURSES.map((course) => (
            <Card key={course.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Award size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{course.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-xs">{course.category}</Badge>
                        <span className="text-xs text-gray-500">{course.duration}</span>
                        <span className="text-xs text-gray-400">Completed: {course.completedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700">Certified</Badge>
                    <Button size="sm" variant="outline">
                      <Award size={14} className="mr-1" /> Certificate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
