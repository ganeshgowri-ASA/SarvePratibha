'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Clock,
  Users,
  Search,
  Star,
  Award,
  Play,
  GraduationCap,
  Linkedin,
  Layers,
  Building2,
  Youtube,
  Video,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ALL_COURSES,
  CourseData,
  fetchCourses,
  getCourseProgress,
  PLATFORM_STYLES,
  Platform,
} from '@/lib/learning-service';

// ─── Platform Icon Map ──────────────────────────────────────────────────────
const PLATFORM_ICONS: Record<string, typeof BookOpen> = {
  Coursera: GraduationCap,
  'LinkedIn Learning': Linkedin,
  Udemy: Layers,
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

const STATUS_STYLES: Record<string, string> = {
  NOT_STARTED: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

// All distinct platforms from the catalog
const ALL_PLATFORMS: Platform[] = [
  'Coursera',
  'LinkedIn Learning',
  'Udemy',
  'YouTube',
  'Vimeo',
  'Dailymotion',
  'Articulate 360',
  'Internal',
];

const CATEGORIES = ['All', 'Technical', 'Soft Skills', 'Compliance', 'Leadership', 'Business', 'Domain'];

// ─── Platform Count ─────────────────────────────────────────────────────────
function platformCount(platform: string) {
  if (platform === 'All') return ALL_COURSES.length;
  return ALL_COURSES.filter((c) => c.platform === platform).length;
}

// ─── Course Card ─────────────────────────────────────────────────────────────
function CourseCard({ course, onNavigate }: { course: CourseData; onNavigate: (id: string) => void }) {
  const platformInfo = PLATFORM_STYLES[course.platform] || PLATFORM_STYLES.Internal;
  const PlatformIcon = PLATFORM_ICONS[course.platform] || BookOpen;

  // Read live progress from localStorage
  const storedProgress = getCourseProgress(course.id);
  const progress = storedProgress?.progress ?? 0;
  const status = storedProgress?.status ?? 'NOT_STARTED';

  // Default in-progress courses (seeded data)
  const DEFAULT_STATUS: Record<string, string> = {
    c1: 'IN_PROGRESS', c2: 'IN_PROGRESS', c3: 'COMPLETED',
    l1: 'IN_PROGRESS', a1: 'COMPLETED', a2: 'COMPLETED', i1: 'COMPLETED', i2: 'IN_PROGRESS',
  };
  const DEFAULT_PROGRESS: Record<string, number> = {
    c1: 40, c2: 20, c3: 100, l1: 65, a1: 100, a2: 100, i1: 100, i2: 55,
  };

  const effectiveStatus = storedProgress ? status : (DEFAULT_STATUS[course.id] || 'NOT_STARTED');
  const effectiveProgress = storedProgress ? progress : (DEFAULT_PROGRESS[course.id] || 0);

  const btnLabel =
    effectiveStatus === 'COMPLETED' ? 'Review' :
    effectiveStatus === 'IN_PROGRESS' ? `Resume (${effectiveProgress}%)` :
    'Start Course';

  const btnClass =
    effectiveStatus === 'COMPLETED' ? 'bg-green-600 hover:bg-green-700' :
    effectiveStatus === 'IN_PROGRESS' ? 'bg-purple-600 hover:bg-purple-700' :
    'bg-teal-600 hover:bg-teal-700';

  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col">
      <CardContent className="pt-4 space-y-3 flex-1 flex flex-col">
        {/* Platform + Rating */}
        <div className="flex items-center justify-between">
          <Badge className={`${platformInfo.bg} ${platformInfo.text} text-xs`}>
            <PlatformIcon size={12} className="mr-1" />
            {course.platform}
          </Badge>
          <div className="flex items-center gap-2">
            {course.hasCertificate && (
              <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-300">
                <Award size={10} className="mr-0.5" /> Cert
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
          <p className="text-sm font-semibold text-gray-900 leading-tight">{course.title}</p>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{course.description}</p>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={LEVEL_STYLES[course.level] + ' text-[10px]'}>{course.level}</Badge>
          <Badge variant="outline" className="text-xs">{course.category}</Badge>
          {course.mandatory && (
            <Badge className="bg-red-100 text-red-700 text-[10px]">Mandatory</Badge>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-0.5"><Clock size={12} /> {course.duration}</span>
          <span>{course.modules.length} modules</span>
          <span className="flex items-center gap-0.5"><Users size={12} /> {course.enrollments}</span>
        </div>
        <p className="text-xs text-gray-400">By {course.instructor}</p>

        {/* Progress (if started) */}
        {effectiveStatus !== 'NOT_STARTED' && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <Badge className={STATUS_STYLES[effectiveStatus] + ' text-[10px]'}>
                {effectiveStatus.replace(/_/g, ' ')}
              </Badge>
              <span className="text-xs font-medium">{effectiveProgress}%</span>
            </div>
            <Progress value={effectiveProgress} className="h-1.5" />
          </div>
        )}

        {/* Due date */}
        {course.dueDate && effectiveStatus !== 'COMPLETED' && (
          <p className="text-xs text-gray-400">Due: {course.dueDate}</p>
        )}

        {/* Action Button */}
        <div className="mt-auto pt-2">
          <Button
            size="sm"
            className={`w-full ${btnClass}`}
            onClick={() => onNavigate(course.id)}
          >
            {effectiveStatus === 'COMPLETED' && <><Award size={14} className="mr-1" /> {btnLabel}</>}
            {effectiveStatus === 'IN_PROGRESS' && <><Play size={14} className="mr-1" /> {btnLabel}</>}
            {effectiveStatus === 'NOT_STARTED' && <><BookOpen size={14} className="mr-1" /> {btnLabel}</>}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function CourseCatalogPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');

  // Simulate API fetch
  useEffect(() => {
    setLoading(true);
    fetchCourses({
      platform: platformFilter,
      category: categoryFilter,
      level: levelFilter,
      search,
    }).then((data) => {
      setCourses(data);
      setLoading(false);
    });
  }, [platformFilter, categoryFilter, levelFilter, search]);

  const navigateToCourse = (id: string) => router.push(`/learning/course/${id}`);

  const clearFilters = () => {
    setSearch('');
    setPlatformFilter('All');
    setCategoryFilter('All');
    setLevelFilter('All');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Catalog</h1>
          <p className="text-sm text-gray-500">
            Browse {ALL_COURSES.length}+ courses from Coursera, LinkedIn Learning, Udemy, YouTube, Vimeo, Dailymotion & more
          </p>
        </div>
        <Link href="/learning">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      {/* Platform Tabs */}
      <Tabs value={platformFilter} onValueChange={setPlatformFilter}>
        <TabsList className="flex-wrap h-auto gap-1 justify-start">
          <TabsTrigger value="All" className="text-xs">
            All ({ALL_COURSES.length})
          </TabsTrigger>
          {ALL_PLATFORMS.map((p) => (
            <TabsTrigger key={p} value={p} className="text-xs">
              {p} ({platformCount(p)})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Search + Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search courses, instructors, or topics..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c === 'All' ? 'All Categories' : c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Levels</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
        {(search || platformFilter !== 'All' || categoryFilter !== 'All' || levelFilter !== 'All') && (
          <Button variant="outline" onClick={clearFilters} className="text-sm">
            Clear Filters
          </Button>
        )}
      </div>

      {/* Results info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {loading ? 'Fetching courses...' : `${courses.length} course${courses.length !== 1 ? 's' : ''} found`}
        </p>
        {loading && <RefreshCw size={14} className="text-teal-600 animate-spin" />}
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-4 space-y-3">
                <div className="h-5 bg-gray-100 rounded w-1/2" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-8 bg-gray-100 rounded w-full mt-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} onNavigate={navigateToCourse} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No courses found</p>
          <p className="text-sm text-gray-400 mb-4">Try adjusting your search or filters.</p>
          <Button variant="outline" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
