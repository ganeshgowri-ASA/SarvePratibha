'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Check, X, Clock, Shield, BookOpen, AlertCircle } from 'lucide-react';

const MY_COMPLIANCE = {
  overallRate: 83,
  policies: {
    total: 12,
    acknowledged: 10,
    pending: 2,
  },
  trainings: {
    total: 5,
    completed: 2,
    inProgress: 1,
    notStarted: 2,
  },
};

const POLICY_STATUS = [
  { title: 'Code of Conduct', acknowledged: true, date: '2026-01-05' },
  { title: 'Data Privacy Policy', acknowledged: true, date: '2026-01-10' },
  { title: 'Anti-Harassment Policy', acknowledged: false, dueDate: '2026-03-15' },
  { title: 'IT Security Policy', acknowledged: true, date: '2025-11-10' },
  { title: 'Whistleblower Policy', acknowledged: true, date: '2025-06-10' },
  { title: 'Data Privacy & Security', acknowledged: false, dueDate: '2026-03-20' },
  { title: 'Travel & Expense Policy', acknowledged: true, date: '2026-01-03' },
  { title: 'Remote Work Policy', acknowledged: true, date: '2026-01-20' },
];

const TRAINING_STATUS = [
  { title: 'Information Security', status: 'IN_PROGRESS', progress: 60, dueDate: '2026-03-31' },
  { title: 'POSH Training', status: 'NOT_STARTED', progress: 0, dueDate: '2026-04-15' },
  { title: 'Code of Conduct Refresher', status: 'COMPLETED', progress: 100, score: 95 },
  { title: 'GDPR & Data Privacy', status: 'COMPLETED', progress: 100, score: 88 },
  { title: 'AML Training', status: 'NOT_STARTED', progress: 0, dueDate: '2026-05-01' },
];

export default function MyComplianceStatusPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Compliance Status</h1>
        <p className="text-sm text-gray-500">Your personal compliance dashboard</p>
      </div>

      {/* Overall Compliance */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="40" stroke="#0D9488" strokeWidth="8" fill="none"
                  strokeDasharray={`${MY_COMPLIANCE.overallRate * 2.51} 251`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-teal-600">{MY_COMPLIANCE.overallRate}%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <p className="text-sm text-gray-500">Policies Acknowledged</p>
                <p className="text-lg font-bold">{MY_COMPLIANCE.policies.acknowledged}/{MY_COMPLIANCE.policies.total}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Policies</p>
                <p className="text-lg font-bold text-yellow-600">{MY_COMPLIANCE.policies.pending}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trainings Completed</p>
                <p className="text-lg font-bold">{MY_COMPLIANCE.trainings.completed}/{MY_COMPLIANCE.trainings.total}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trainings In Progress</p>
                <p className="text-lg font-bold text-blue-600">{MY_COMPLIANCE.trainings.inProgress}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Policy Acknowledgements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield size={16} className="text-blue-600" /> Policy Acknowledgements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {POLICY_STATUS.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm text-gray-700">{p.title}</span>
                {p.acknowledged ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <Check size={14} />
                    <span className="text-xs">{p.date}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Clock size={14} />
                    <span className="text-xs">Due: {p.dueDate}</span>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Training Completion */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen size={16} className="text-blue-600" /> Training Completion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {TRAINING_STATUS.map((t, i) => (
              <div key={i} className="py-2 border-b last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{t.title}</span>
                  <Badge className={
                    t.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    t.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }>
                    {t.status === 'COMPLETED' ? `Done (${t.score}%)` : t.status === 'IN_PROGRESS' ? 'In Progress' : 'Not Started'}
                  </Badge>
                </div>
                {t.status !== 'NOT_STARTED' && (
                  <Progress value={t.progress} className="h-1.5" />
                )}
                {t.dueDate && t.status !== 'COMPLETED' && (
                  <p className="text-xs text-gray-400 mt-1">Due: {t.dueDate}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
