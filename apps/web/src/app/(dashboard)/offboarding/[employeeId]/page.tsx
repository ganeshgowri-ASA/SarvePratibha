'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, User, Calendar, Building2, AlertTriangle } from 'lucide-react';

const EMPLOYEE = {
  name: 'Rohit Sharma',
  employeeId: 'EMP-2024-012',
  department: 'Sales',
  designation: 'Senior Sales Executive',
  dateOfJoining: '2024-06-15',
  lastWorkingDate: '2026-03-31',
  reason: 'Resignation',
  manager: 'Amit Patel',
};

const TASKS = [
  { id: '1', title: 'Return Company Laptop', category: 'ASSET_RETURN', description: 'Return assigned laptop and accessories to IT', isCompleted: true, completedAt: '2026-03-15' },
  { id: '2', title: 'Return ID Card & Access Card', category: 'ASSET_RETURN', description: 'Return employee ID and building access cards to security', isCompleted: true, completedAt: '2026-03-15' },
  { id: '3', title: 'Knowledge Transfer', category: 'KNOWLEDGE_TRANSFER', description: 'Complete knowledge transfer documentation and handover to team', isCompleted: true, completedAt: '2026-03-20' },
  { id: '4', title: 'Exit Interview', category: 'EXIT_INTERVIEW', description: 'Schedule and complete exit interview with HR', isCompleted: false },
  { id: '5', title: 'Full & Final Settlement', category: 'FINANCE', description: 'Process full and final settlement including leave encashment', isCompleted: false },
  { id: '6', title: 'Revoke System Access', category: 'IT_CLEARANCE', description: 'Revoke all system access (email, VPN, apps)', isCompleted: false },
  { id: '7', title: 'Clear Pending Dues', category: 'FINANCE', description: 'Clear pending reimbursements, travel advances, loans', isCompleted: false },
  { id: '8', title: 'No Objection Certificate', category: 'CLEARANCE', description: 'Obtain NOC from all departments (IT, Finance, Admin, Library)', isCompleted: false },
];

const CATEGORY_LABELS: Record<string, string> = {
  ASSET_RETURN: 'Asset Return',
  KNOWLEDGE_TRANSFER: 'Knowledge Transfer',
  EXIT_INTERVIEW: 'Exit Interview',
  FINANCE: 'Finance & Settlement',
  IT_CLEARANCE: 'IT Clearance',
  CLEARANCE: 'Department Clearance',
};

const CATEGORIES = ['ASSET_RETURN', 'KNOWLEDGE_TRANSFER', 'EXIT_INTERVIEW', 'FINANCE', 'IT_CLEARANCE', 'CLEARANCE'];

export default function OffboardingDetailPage() {
  const completed = TASKS.filter((t) => t.isCompleted).length;
  const progress = Math.round((completed / TASKS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Employee Info */}
      <Card className="border-orange-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-orange-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{EMPLOYEE.name}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                <span>{EMPLOYEE.employeeId}</span>
                <span className="flex items-center gap-1"><Building2 size={12} /> {EMPLOYEE.department}</span>
                <span>{EMPLOYEE.designation}</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <Badge className="bg-orange-100 text-orange-700">
                  <Calendar size={10} className="mr-1" /> Last Day: {EMPLOYEE.lastWorkingDate}
                </Badge>
                <Badge variant="outline">{EMPLOYEE.reason}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Clearance Progress</span>
            <span className="text-sm font-bold text-orange-600">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-gray-500 mt-2">{completed} of {TASKS.length} tasks completed</p>
          {progress < 100 && (
            <div className="flex items-center gap-1 mt-2 text-yellow-600">
              <AlertTriangle size={14} />
              <span className="text-xs">Pending clearance items need attention before last working day</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tasks by Category */}
      {CATEGORIES.map((cat) => {
        const catTasks = TASKS.filter((t) => t.category === cat);
        if (catTasks.length === 0) return null;

        return (
          <Card key={cat}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{CATEGORY_LABELS[cat]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {catTasks.map((task) => (
                <div key={task.id} className={`flex items-center justify-between p-3 rounded-lg border ${task.isCompleted ? 'bg-green-50/50 border-green-200' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    {task.isCompleted ? (
                      <CheckCircle2 size={20} className="text-green-500" fill="currentColor" />
                    ) : (
                      <Circle size={20} className="text-gray-300" />
                    )}
                    <div>
                      <p className={`text-sm ${task.isCompleted ? 'text-gray-500 line-through' : 'font-medium text-gray-900'}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-400">{task.description}</p>
                    </div>
                  </div>
                  {task.isCompleted ? (
                    <span className="text-xs text-green-600">{task.completedAt}</span>
                  ) : (
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Complete</Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
