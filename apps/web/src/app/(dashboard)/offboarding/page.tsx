'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UserMinus, Plus } from 'lucide-react';
import Link from 'next/link';

const OFFBOARDING_LIST = [
  {
    id: '1', employeeId: 'EMP-2024-012', name: 'Rohit Sharma', department: 'Sales',
    lastWorkingDate: '2026-03-31', reason: 'Resignation', status: 'IN_PROGRESS', progress: 40,
    tasksCompleted: 3, totalTasks: 8,
  },
  {
    id: '2', employeeId: 'EMP-2023-089', name: 'Neha Agarwal', department: 'Marketing',
    lastWorkingDate: '2026-03-15', reason: 'Better opportunity', status: 'IN_PROGRESS', progress: 75,
    tasksCompleted: 6, totalTasks: 8,
  },
  {
    id: '3', employeeId: 'EMP-2022-034', name: 'Vivek Menon', department: 'Engineering',
    lastWorkingDate: '2026-02-28', reason: 'Resignation', status: 'COMPLETED', progress: 100,
    tasksCompleted: 8, totalTasks: 8,
  },
];

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  NOT_STARTED: { color: 'bg-gray-100 text-gray-600', label: 'Not Started' },
  IN_PROGRESS: { color: 'bg-orange-100 text-orange-700', label: 'In Progress' },
  COMPLETED: { color: 'bg-green-100 text-green-700', label: 'Completed' },
};

export default function OffboardingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offboarding</h1>
          <p className="text-sm text-gray-500">Manage employee exit processes and clearance</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Plus size={16} className="mr-2" /> Initiate Offboarding
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-orange-600">2</p>
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
            <p className="text-3xl font-bold text-gray-600">3</p>
            <p className="text-sm text-gray-500">This Quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Offboarding List */}
      <div className="space-y-3">
        {OFFBOARDING_LIST.map((item) => {
          const config = STATUS_CONFIG[item.status];
          return (
            <Card key={item.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <UserMinus size={18} className="text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <Badge className={config.color}>{config.label}</Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        {item.employeeId} | {item.department} | Last Day: {item.lastWorkingDate} | {item.reason}
                      </p>
                      <div className="flex items-center gap-2 mt-2 max-w-sm">
                        <Progress value={item.progress} className="h-2 flex-1" />
                        <span className="text-xs text-gray-500">{item.tasksCompleted}/{item.totalTasks}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/offboarding/${item.id}`}>
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
