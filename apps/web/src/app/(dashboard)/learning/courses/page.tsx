'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Clock, Users, Search, Star } from 'lucide-react';
import Link from 'next/link';

const COURSES = [
  { id: '1', title: 'Advanced React Patterns', category: 'Technical', level: 'Advanced', duration: '8h', modules: 12, instructor: 'Priya Shah', rating: 4.8, enrollments: 85, description: 'Master advanced React patterns including render props, HOCs, and hooks' },
  { id: '2', title: 'Leadership Fundamentals', category: 'Leadership', level: 'Beginner', duration: '6h', modules: 8, instructor: 'Rahul Mehta', rating: 4.5, enrollments: 120, description: 'Essential leadership skills for new and aspiring managers' },
  { id: '3', title: 'AWS Cloud Practitioner', category: 'Technical', level: 'Beginner', duration: '12h', modules: 15, instructor: 'AWS Training', rating: 4.7, enrollments: 200, description: 'Prepare for the AWS Cloud Practitioner certification' },
  { id: '4', title: 'System Design Masterclass', category: 'Technical', level: 'Advanced', duration: '16h', modules: 20, instructor: 'Vikram T.', rating: 4.9, enrollments: 45, description: 'Design scalable distributed systems from scratch' },
  { id: '5', title: 'Data-Driven Decision Making', category: 'Business', level: 'Intermediate', duration: '4h', modules: 6, instructor: 'Anita K.', rating: 4.3, enrollments: 150, description: 'Learn to make decisions backed by data and analytics' },
  { id: '6', title: 'Effective Communication', category: 'Soft Skills', level: 'Beginner', duration: '3h', modules: 5, instructor: 'HR Team', rating: 4.6, enrollments: 220, description: 'Improve verbal and written communication skills' },
  { id: '7', title: 'Python for Data Analysis', category: 'Technical', level: 'Intermediate', duration: '10h', modules: 14, instructor: 'Deepak R.', rating: 4.4, enrollments: 78, description: 'Data analysis using Python, Pandas, and visualization libraries' },
  { id: '8', title: 'Project Management Essentials', category: 'Business', level: 'Beginner', duration: '5h', modules: 7, instructor: 'PMO Team', rating: 4.2, enrollments: 95, description: 'Fundamentals of project management methodologies' },
];

const LEVEL_STYLES: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-purple-100 text-purple-700',
};

export default function CourseCatalogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Course Catalog</h1>
        <p className="text-sm text-gray-500">Browse and enroll in learning courses</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search courses..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-36"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="leadership">Leadership</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="soft-skills">Soft Skills</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-32"><SelectValue placeholder="Level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {COURSES.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge className={LEVEL_STYLES[course.level]}>{course.level}</Badge>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs text-gray-600">{course.rating}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{course.title}</p>
                <p className="text-xs text-gray-500 mt-1">{course.description}</p>
              </div>
              <Badge variant="outline" className="text-xs">{course.category}</Badge>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-0.5"><Clock size={12} /> {course.duration}</span>
                <span>{course.modules} modules</span>
                <span className="flex items-center gap-0.5"><Users size={12} /> {course.enrollments}</span>
              </div>
              <p className="text-xs text-gray-400">By {course.instructor}</p>
              <Link href={`/learning/course/${course.id}`}>
                <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700">View Course</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
