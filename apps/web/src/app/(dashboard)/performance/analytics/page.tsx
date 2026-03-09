'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Star,
  Award,
} from 'lucide-react';

const RATING_LABELS: Record<string, string> = {
  '1': 'Needs Improvement',
  '2': 'Below Expectations',
  '3': 'Meets Expectations',
  '4': 'Exceeds Expectations',
  '5': 'Outstanding',
};

const RATING_COLORS: Record<string, string> = {
  '1': 'bg-red-500',
  '2': 'bg-orange-500',
  '3': 'bg-yellow-500',
  '4': 'bg-teal-500',
  '5': 'bg-green-500',
};

const SAMPLE_BELL_CURVE = [
  { rating: 1, count: 2, percentage: 5, label: 'Needs Improvement' },
  { rating: 2, count: 6, percentage: 15, label: 'Below Expectations' },
  { rating: 3, count: 20, percentage: 50, label: 'Meets Expectations' },
  { rating: 4, count: 8, percentage: 20, label: 'Exceeds Expectations' },
  { rating: 5, count: 4, percentage: 10, label: 'Outstanding' },
];

const IDEAL_DISTRIBUTION = [5, 15, 60, 15, 5];

const TOP_PERFORMERS = [
  { name: 'Vikram Singh', employeeId: 'EMP004', rating: 4.8, department: 'Engineering' },
  { name: 'Priya Sharma', employeeId: 'EMP001', rating: 4.6, department: 'Engineering' },
  { name: 'Anjali Menon', employeeId: 'EMP020', rating: 4.5, department: 'Engineering' },
  { name: 'Karthik Rajan', employeeId: 'EMP025', rating: 4.4, department: 'Engineering' },
  { name: 'Sanya Iyer', employeeId: 'EMP030', rating: 4.3, department: 'Engineering' },
];

const BOTTOM_PERFORMERS = [
  { name: 'Suresh Kumar', employeeId: 'EMP010', rating: 1.8, department: 'Engineering' },
  { name: 'Rohit Patil', employeeId: 'EMP012', rating: 2.2, department: 'Engineering' },
];

const DEPARTMENT_STATS = {
  name: 'Engineering',
  totalEmployees: 40,
  reviewsCompleted: 35,
  avgRating: 3.4,
  goalCompletionRate: 72,
};

export default function AnalyticsPage() {
  const [department, setDepartment] = useState('engineering');
  const [year, setYear] = useState('2026');

  const maxCount = Math.max(...SAMPLE_BELL_CURVE.map((d) => d.count));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/performance" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
            <p className="text-sm text-gray-500">Department performance distribution and insights</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-40">
            <option value="engineering">Engineering</option>
            <option value="quality">Quality</option>
            <option value="hr">HR</option>
            <option value="finance">Finance</option>
          </Select>
          <Select value={year} onChange={(e) => setYear(e.target.value)} className="w-24">
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </Select>
        </div>
      </div>

      {/* Department Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-teal-600" />
              <span className="text-sm text-gray-500">Total Employees</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{DEPARTMENT_STATS.totalEmployees}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <Star size={16} className="text-amber-500" />
              <span className="text-sm text-gray-500">Avg Rating</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{DEPARTMENT_STATS.avgRating}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-green-600" />
              <span className="text-sm text-gray-500">Goal Completion</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{DEPARTMENT_STATS.goalCompletionRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-blue-600" />
              <span className="text-sm text-gray-500">Reviews Done</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {DEPARTMENT_STATS.reviewsCompleted}/{DEPARTMENT_STATS.totalEmployees}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bell Curve Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 size={18} className="text-teal-600" />
            Rating Distribution (Bell Curve)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-center gap-4 h-64 mb-6">
            {SAMPLE_BELL_CURVE.map((bucket) => (
              <div key={bucket.rating} className="flex flex-col items-center gap-2 flex-1 max-w-24">
                <span className="text-xs font-bold text-gray-700">{bucket.count}</span>
                <span className="text-[10px] text-gray-500">{bucket.percentage}%</span>
                <div className="w-full flex flex-col items-center gap-1">
                  {/* Actual bar */}
                  <div
                    className={`w-full rounded-t-md ${RATING_COLORS[String(bucket.rating)]} transition-all`}
                    style={{ height: `${(bucket.count / maxCount) * 180}px` }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold">{bucket.rating}</p>
                  <p className="text-[10px] text-gray-500 leading-tight">{bucket.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Ideal vs Actual Distribution */}
          <div className="border-t pt-4">
            <p className="text-xs font-medium text-gray-500 uppercase mb-3">Actual vs Ideal Distribution</p>
            <div className="space-y-2">
              {SAMPLE_BELL_CURVE.map((bucket, i) => (
                <div key={bucket.rating} className="grid grid-cols-12 gap-2 items-center text-sm">
                  <span className="col-span-3 text-gray-600">Rating {bucket.rating}</span>
                  <div className="col-span-7 flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-3 relative overflow-hidden">
                      <div
                        className={`h-full rounded-full ${RATING_COLORS[String(bucket.rating)]} opacity-80`}
                        style={{ width: `${bucket.percentage}%` }}
                      />
                      {/* Ideal marker */}
                      <div
                        className="absolute top-0 h-full w-0.5 bg-gray-800"
                        style={{ left: `${IDEAL_DISTRIBUTION[i]}%` }}
                        title={`Ideal: ${IDEAL_DISTRIBUTION[i]}%`}
                      />
                    </div>
                  </div>
                  <span className="col-span-2 text-xs text-gray-500">
                    {bucket.percentage}% <span className="text-gray-300">/ {IDEAL_DISTRIBUTION[i]}%</span>
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Black line indicates ideal bell curve distribution
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Top & Bottom Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp size={18} className="text-green-600" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead className="text-right">Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TOP_PERFORMERS.map((emp, i) => (
                  <TableRow key={emp.employeeId}>
                    <TableCell>
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs font-bold">
                        {i + 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{emp.name}</p>
                      <p className="text-xs text-gray-500">{emp.employeeId}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="font-bold text-gray-900">{emp.rating}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown size={18} className="text-red-600" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {BOTTOM_PERFORMERS.map((emp) => (
                  <TableRow key={emp.employeeId}>
                    <TableCell>
                      <p className="text-sm font-medium">{emp.name}</p>
                      <p className="text-xs text-gray-500">{emp.employeeId}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-red-400 text-red-400" />
                        <span className="font-bold text-red-600">{emp.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link href="/performance/pip">
                        <Badge className="bg-red-100 text-red-700 cursor-pointer hover:bg-red-200">
                          PIP
                        </Badge>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Goal Completion by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target size={18} className="text-teal-600" />
            Goal Completion Rates by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { category: 'Business', completion: 78, total: 120, completed: 94 },
              { category: 'Learning', completion: 65, total: 45, completed: 29 },
              { category: 'Development', completion: 58, total: 35, completed: 20 },
            ].map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-900">{cat.category}</span>
                  <span className="text-gray-500">{cat.completed}/{cat.total} ({cat.completion}%)</span>
                </div>
                <Progress value={cat.completion} className="h-2.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
