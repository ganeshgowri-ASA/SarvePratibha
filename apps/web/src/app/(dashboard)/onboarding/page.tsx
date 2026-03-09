'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UserCheck, Plus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const ONBOARDING_LIST = [
  {
    id: '1', employeeId: 'EMP-2026-045', name: 'Arjun Reddy', department: 'Engineering',
    dateOfJoining: '2026-03-01', status: 'IN_PROGRESS', progress: 60,
    tasksCompleted: 6, totalTasks: 10, assignedBy: 'Manager',
  },
  {
    id: '2', employeeId: 'EMP-2026-046', name: 'Pooja Krishnan', department: 'Product',
    dateOfJoining: '2026-03-05', status: 'IN_PROGRESS', progress: 30,
    tasksCompleted: 3, totalTasks: 10, assignedBy: 'Manager',
  },
  {
    id: '3', employeeId: 'EMP-2026-044', name: 'Sanjay Verma', department: 'Design',
    dateOfJoining: '2026-02-15', status: 'COMPLETED', progress: 100,
    tasksCompleted: 10, totalTasks: 10, assignedBy: 'HR Admin',
  },
  {
    id: '4', employeeId: 'EMP-2026-047', name: 'Divya Nair', department: 'Marketing',
    dateOfJoining: '2026-03-10', status: 'NOT_STARTED', progress: 0,
    tasksCompleted: 0, totalTasks: 10, assignedBy: 'Manager',
  },
];

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  NOT_STARTED: { color: 'bg-gray-100 text-gray-600', label: 'Not Started' },
  IN_PROGRESS: { color: 'bg-blue-100 text-blue-700', label: 'In Progress' },
  COMPLETED: { color: 'bg-green-100 text-green-700', label: 'Completed' },
};

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Onboarding</h1>
          <p className="text-sm text-gray-500">Manage new employee onboarding checklists</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Plus size={16} className="mr-2" /> Create Checklist
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-blue-600">4</p>
            <p className="text-sm text-gray-500">Total Onboardings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-yellow-600">2</p>
            <p className="text-sm text-gray-500">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-600">1</p>
            <p className="text-sm text-gray-500">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-gray-600">1</p>
            <p className="text-sm text-gray-500">Pending Start</p>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding List */}
      <div className="space-y-3">
        {ONBOARDING_LIST.map((item) => {
          const config = STATUS_CONFIG[item.status];
          return (
            <Card key={item.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-teal-50 rounded-lg">
                      <UserCheck size={18} className="text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <Badge className={config.color}>{config.label}</Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        {item.employeeId} | {item.department} | Joined: {item.dateOfJoining}
                      </p>
                      <div className="flex items-center gap-2 mt-2 max-w-sm">
                        <Progress value={item.progress} className="h-2 flex-1" />
                        <span className="text-xs text-gray-500">{item.tasksCompleted}/{item.totalTasks}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/onboarding/${item.id}`}>
                    <Button size="sm" variant="outline">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
