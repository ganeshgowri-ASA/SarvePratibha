'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Clock,
  Users,
  Search,
  Star,
  Award,
  Play,
  ExternalLink,
  Building2,
  Linkedin,
  GraduationCap,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

type Course = {
  id: string;
  title: string;
  platform: string;
  category: string;
  level: string;
  duration: string;
  modules: number;
  instructor: string;
  rating: number;
  enrollments: number;
  description: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  progress: number;
  hasCertificate: boolean;
};

const COURSES: Course[] = [
  // Coursera
  {
    id: 'c1',
    title: 'Machine Learning Specialization',
    platform: 'Coursera',
    category: 'Technical',
    level: 'Intermediate',
    duration: '12h',
    modules: 16,
    instructor: 'Andrew Ng',
    rating: 4.9,
    enrollments: 320,
    description: 'Master fundamental ML concepts, supervised and unsupervised learning, and best practices from Stanford.',
    status: 'IN_PROGRESS',
    progress: 40,
    hasCertificate: true,
  },
  {
    id: 'c2',
    title: 'Google Project Management',
    platform: 'Coursera',
    category: 'Business',
    level: 'Beginner',
    duration: '8h',
    modules: 10,
    instructor: 'Google',
    rating: 4.7,
    enrollments: 250,
    description: 'Learn project management skills from Google experts. Prepare for a career in project management.',
    status: 'IN_PROGRESS',
    progress: 20,
    hasCertificate: true,
  },
  {
    id: 'c3',
    title: 'AWS Cloud Practitioner',
    platform: 'Coursera',
    category: 'Technical',
    level: 'Beginner',
    duration: '10h',
    modules: 12,
    instructor: 'AWS Training',
    rating: 4.8,
    enrollments: 180,
    description: 'Prepare for the AWS Certified Cloud Practitioner exam with hands-on labs and real-world scenarios.',
    status: 'COMPLETED',
    progress: 100,
    hasCertificate: true,
  },
  // LinkedIn Learning
  {
    id: 'l1',
    title: 'Leadership Foundations',
    platform: 'LinkedIn Learning',
    category: 'Leadership',
    level: 'Beginner',
    duration: '6h',
    modules: 8,
    instructor: 'Lisa Earle McLeod',
    rating: 4.6,
    enrollments: 410,
    description: 'Develop essential leadership skills. Learn to inspire teams, communicate vision, and drive results.',
    status: 'IN_PROGRESS',
    progress: 65,
    hasCertificate: true,
  },
  {
    id: 'l2',
    title: 'Communication Skills',
    platform: 'LinkedIn Learning',
    category: 'Soft Skills',
    level: 'Beginner',
    duration: '4h',
    modules: 6,
    instructor: 'Brenda Bailey-Hughes',
    rating: 4.5,
    enrollments: 550,
    description: 'Master interpersonal communication, active listening, and persuasive speaking for the workplace.',
    status: 'NOT_STARTED',
    progress: 0,
    hasCertificate: true,
  },
  {
    id: 'l3',
    title: 'Agile Project Management',
    platform: 'LinkedIn Learning',
    category: 'Business',
    level: 'Intermediate',
    duration: '5h',
    modules: 7,
    instructor: 'Doug Rose',
    rating: 4.4,
    enrollments: 290,
    description: 'Learn Scrum, Kanban, and Agile frameworks to manage projects efficiently and deliver value faster.',
    status: 'NOT_STARTED',
    progress: 0,
    hasCertificate: true,
  },
  // Udemy
  {
    id: 'u1',
    title: 'React Complete Guide',
    platform: 'Udemy',
    category: 'Technical',
    level: 'Intermediate',
    duration: '16h',
    modules: 24,
    instructor: 'Maximilian Schwarzmuller',
    rating: 4.7,
    enrollments: 180,
    description: 'Build React apps from scratch. Covers hooks, Redux, Next.js, routing, authentication and more.',
    status: 'NOT_STARTED',
    progress: 0,
    hasCertificate: false,
  },
  {
    id: 'u2',
    title: 'Python for Data Science',
    platform: 'Udemy',
    category: 'Technical',
    level: 'Beginner',
    duration: '10h',
    modules: 14,
    instructor: 'Jose Portilla',
    rating: 4.6,
    enrollments: 220,
    description: 'Learn Python, NumPy, Pandas, Matplotlib, and Scikit-learn for data analysis and visualization.',
    status: 'NOT_STARTED',
    progress: 0,
    hasCertificate: false,
  },
  {
    id: 'u3',
    title: 'DevOps Bootcamp',
    platform: 'Udemy',
    category: 'Technical',
    level: 'Advanced',
    duration: '20h',
    modules: 28,
    instructor: 'Mumshad Mannambeth',
    rating: 4.8,
    enrollments: 150,
    description: 'Complete DevOps training covering Docker, Kubernetes, CI/CD, Terraform, and cloud deployments.',
    status: 'NOT_STARTED',
    progress: 0,
    hasCertificate: false,
  },
  // Articulate 360 (Company-created)
  {
    id: 'a1',
    title: 'Compliance Training',
    platform: 'Articulate 360',
    category: 'Compliance',
    level: 'Beginner',
    duration: '3h',
    modules: 5,
    instructor: 'Internal',
    rating: 4.2,
    enrollments: 890,
    description: 'Annual compliance training covering company policies, regulations, and ethical guidelines.',
    status: 'COMPLETED',
    progress: 100,
    hasCertificate: true,
  },
  {
    id: 'a2',
    title: 'Safety Induction',
    platform: 'Articulate 360',
    category: 'Compliance',
    level: 'Beginner',
    duration: '1.5h',
    modules: 3,
    instructor: 'Internal',
    rating: 4.0,
    enrollments: 870,
    description: 'Workplace safety procedures, emergency protocols, and hazard identification training.',
    status: 'COMPLETED',
    progress: 100,
    hasCertificate: true,
  },
  {
    id: 'a3',
    title: 'Anti-Harassment Policy',
    platform: 'Articulate 360',
    category: 'Compliance',
    level: 'Beginner',
    duration: '1h',
    modules: 2,
    instructor: 'Internal',
    rating: 4.1,
    enrollments: 860,
    description: 'Understanding workplace harassment policies, prevention measures, and reporting procedures.',
    status: 'NOT_STARTED',
    progress: 0,
    hasCertificate: true,
  },
  // Internal
  {
    id: 'i1',
    title: 'Company Orientation',
    platform: 'Internal',
    category: 'Domain',
    level: 'Beginner',
    duration: '2h',
    modules: 4,
    instructor: 'HR Team',
    rating: 4.3,
    enrollments: 920,
    description: 'Welcome to the organization. Learn about our mission, values, culture, and benefits.',
    status: 'COMPLETED',
    progress: 100,
    hasCertificate: true,
  },
  {
    id: 'i2',
    title: 'Product Training',
    platform: 'Internal',
    category: 'Domain',
    level: 'Intermediate',
    duration: '6h',
    modules: 8,
    instructor: 'Product Team',
    rating: 4.5,
    enrollments: 350,
    description: 'Deep dive into our product suite, features, roadmap, and competitive landscape.',
    status: 'IN_PROGRESS',
    progress: 55,
    hasCertificate: false,
  },
  {
    id: 'i3',
    title: 'Sales Methodology',
    platform: 'Internal',
    category: 'Domain',
    level: 'Intermediate',
    duration: '4h',
    modules: 6,
    instructor: 'Sales Enablement',
    rating: 4.4,
    enrollments: 180,
    description: 'Master our consultative sales methodology, objection handling, and deal closing techniques.',
    status: 'NOT_STARTED',
    progress: 0,
    hasCertificate: false,
  },
];

const PLATFORM_COLORS: Record<string, { bg: string; text: string; icon: typeof BookOpen }> = {
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

const STATUS_STYLES: Record<string, string> = {
  NOT_STARTED: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

const PLATFORMS = ['All', 'Coursera', 'LinkedIn Learning', 'Udemy', 'Articulate 360', 'Internal'];
const CATEGORIES = ['All', 'Technical', 'Leadership', 'Business', 'Soft Skills', 'Compliance', 'Domain'];

export default function CourseCatalogPage() {
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');

  const filtered = COURSES.filter((c) => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchPlatform = platformFilter === 'All' || c.platform === platformFilter;
    const matchCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchLevel = levelFilter === 'All' || c.level === levelFilter;
    return matchSearch && matchPlatform && matchCategory && matchLevel;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Catalog</h1>
          <p className="text-sm text-gray-500">Browse courses from multiple learning platforms</p>
        </div>
        <Link href="/learning">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      {/* Platform Tabs */}
      <Tabs defaultValue="All" onValueChange={setPlatformFilter}>
        <TabsList className="flex-wrap h-auto gap-1">
          {PLATFORMS.map((p) => (
            <TabsTrigger key={p} value={p} className="text-xs">
              {p} ({p === 'All' ? COURSES.length : COURSES.filter((c) => c.platform === p).length})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search courses or instructors..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c === 'All' ? 'All Categories' : c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Levels</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500">{filtered.length} course{filtered.length !== 1 ? 's' : ''} found</p>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((course) => {
          const platformInfo = PLATFORM_COLORS[course.platform] || PLATFORM_COLORS.Internal;
          const PlatformIcon = platformInfo.icon;
          return (
            <Card key={course.id} className="hover:shadow-md transition-shadow flex flex-col">
              <CardContent className="pt-4 space-y-3 flex-1 flex flex-col">
                {/* Platform + Certificate */}
                <div className="flex items-center justify-between">
                  <Badge className={`${platformInfo.bg} ${platformInfo.text} text-xs`}>
                    <PlatformIcon size={12} className="mr-1" />
                    {course.platform}
                  </Badge>
                  <div className="flex items-center gap-2">
                    {course.hasCertificate && (
                      <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-300">
                        <Award size={10} className="mr-0.5" /> Certificate
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-xs text-gray-600">{course.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Title + Description */}
                <div>
                  <p className="text-sm font-semibold text-gray-900">{course.title}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={LEVEL_STYLES[course.level] + ' text-[10px]'}>{course.level}</Badge>
                  <Badge variant="outline" className="text-xs">{course.category}</Badge>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-0.5"><Clock size={12} /> {course.duration}</span>
                  <span>{course.modules} modules</span>
                  <span className="flex items-center gap-0.5"><Users size={12} /> {course.enrollments}</span>
                </div>
                <p className="text-xs text-gray-400">By {course.instructor}</p>

                {/* Progress (if started) */}
                {course.status !== 'NOT_STARTED' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Badge className={STATUS_STYLES[course.status] + ' text-[10px]'}>
                        {course.status.replace(/_/g, ' ')}
                      </Badge>
                      <span className="text-xs font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-1.5" />
                  </div>
                )}

                {/* Action Button */}
                <div className="mt-auto pt-2">
                  <Link href={`/learning/course/${course.id}`}>
                    <Button
                      size="sm"
                      className={`w-full ${
                        course.status === 'COMPLETED'
                          ? 'bg-green-600 hover:bg-green-700'
                          : course.status === 'IN_PROGRESS'
                          ? 'bg-purple-600 hover:bg-purple-700'
                          : 'bg-teal-600 hover:bg-teal-700'
                      }`}
                    >
                      {course.status === 'COMPLETED' && <><Award size={14} className="mr-1" /> Review</>}
                      {course.status === 'IN_PROGRESS' && <><Play size={14} className="mr-1" /> Resume ({course.progress}%)</>}
                      {course.status === 'NOT_STARTED' && <><BookOpen size={14} className="mr-1" /> Start Course</>}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No courses found matching your criteria.</p>
          <Button variant="outline" className="mt-3" onClick={() => { setSearch(''); setPlatformFilter('All'); setCategoryFilter('All'); setLevelFilter('All'); }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
