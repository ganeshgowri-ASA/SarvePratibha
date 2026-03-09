'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, User, Calendar, Building2 } from 'lucide-react';

const EMPLOYEE = {
  name: 'Arjun Reddy',
  employeeId: 'EMP-2026-045',
  department: 'Engineering',
  designation: 'Software Engineer',
  dateOfJoining: '2026-03-01',
  manager: 'Priya Sharma',
};

const TASKS = [
  { id: '1', title: 'Welcome Kit Distribution', category: 'IT_SETUP', description: 'Laptop, headset, mouse, keyboard', isCompleted: true, completedAt: '2026-03-01' },
  { id: '2', title: 'ID Card & Access Badge', category: 'IT_SETUP', description: 'Employee ID card and building access', isCompleted: true, completedAt: '2026-03-01' },
  { id: '3', title: 'System Account Setup', category: 'IT_SETUP', description: 'Email, Slack, Jira, GitHub access', isCompleted: true, completedAt: '2026-03-01' },
  { id: '4', title: 'HR Document Submission', category: 'HR_DOCS', description: 'Aadhaar, PAN, bank details, photo', isCompleted: true, completedAt: '2026-03-02' },
  { id: '5', title: 'Benefits Enrollment', category: 'HR_DOCS', description: 'Health insurance, PF nomination', isCompleted: true, completedAt: '2026-03-03' },
  { id: '6', title: 'Policy Acknowledgement', category: 'COMPLIANCE', description: 'Read and acknowledge all company policies', isCompleted: true, completedAt: '2026-03-03' },
  { id: '7', title: 'Team Introduction', category: 'ORIENTATION', description: 'Meet the team and key stakeholders', isCompleted: false },
  { id: '8', title: 'Product Walkthrough', category: 'TRAINING', description: 'Comprehensive product and architecture overview', isCompleted: false },
  { id: '9', title: 'Development Environment Setup', category: 'TRAINING', description: 'Set up local dev environment and run the app', isCompleted: false },
  { id: '10', title: '30-Day Check-in', category: 'REVIEW', description: 'First month review with manager', isCompleted: false, dueDate: '2026-04-01' },
];

const CATEGORIES = ['IT_SETUP', 'HR_DOCS', 'COMPLIANCE', 'ORIENTATION', 'TRAINING', 'REVIEW'];
const CATEGORY_LABELS: Record<string, string> = {
  IT_SETUP: 'IT Setup',
  HR_DOCS: 'HR Documents',
  COMPLIANCE: 'Compliance',
  ORIENTATION: 'Orientation',
  TRAINING: 'Training',
  REVIEW: 'Review',
};

export default function OnboardingDetailPage() {
  const completed = TASKS.filter((t) => t.isCompleted).length;
  const progress = Math.round((completed / TASKS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Employee Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-teal-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{EMPLOYEE.name}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                <span>{EMPLOYEE.employeeId}</span>
                <span className="flex items-center gap-1"><Building2 size={12} /> {EMPLOYEE.department}</span>
                <span>{EMPLOYEE.designation}</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> Joined {EMPLOYEE.dateOfJoining}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Onboarding Progress</span>
            <span className="text-sm font-bold text-teal-600">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-gray-500 mt-2">{completed} of {TASKS.length} tasks completed</p>
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
