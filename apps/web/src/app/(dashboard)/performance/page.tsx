'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Plus } from 'lucide-react';

const GOALS = [
  { title: 'Complete API migration', weightage: 30, progress: 75, status: 'IN_PROGRESS' },
  { title: 'Mentor 2 junior developers', weightage: 20, progress: 50, status: 'IN_PROGRESS' },
  { title: 'Reduce deployment time by 40%', weightage: 25, progress: 100, status: 'COMPLETED' },
  { title: 'Complete AWS certification', weightage: 15, progress: 20, status: 'IN_PROGRESS' },
  { title: 'Improve test coverage to 80%', weightage: 10, progress: 0, status: 'NOT_STARTED' },
];

const STATUS_STYLES: Record<string, string> = {
  NOT_STARTED: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  DEFERRED: 'bg-yellow-100 text-yellow-700',
};

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Management</h1>
          <p className="text-sm text-gray-500">Track your goals and performance reviews</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Plus size={16} className="mr-2" /> Add Goal
        </Button>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">FY 2025-26 Goals Progress</h3>
              <p className="text-sm text-gray-500">Annual Review Cycle</p>
            </div>
            <span className="text-2xl font-bold text-teal-600">57%</span>
          </div>
          <Progress value={57} className="h-3" />
        </CardContent>
      </Card>

      {/* Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target size={18} className="text-teal-600" />
            My Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {GOALS.map((goal, i) => (
              <div key={i} className="p-4 rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{goal.title}</p>
                    <p className="text-xs text-gray-500">Weight: {goal.weightage}%</p>
                  </div>
                  <Badge className={STATUS_STYLES[goal.status] || ''}>
                    {goal.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={goal.progress} className="h-2 flex-1" />
                  <span className="text-xs font-medium text-gray-600 w-10">{goal.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
