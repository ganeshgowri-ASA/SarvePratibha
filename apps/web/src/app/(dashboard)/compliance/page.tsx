'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, Shield, BookOpen, FileCheck, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const STATS = [
  { label: 'Active Policies', value: '12', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Acknowledged', value: '10/12', icon: FileCheck, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Trainings Due', value: '2', icon: BookOpen, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { label: 'Compliance Rate', value: '92%', icon: ClipboardCheck, color: 'text-teal-600', bg: 'bg-teal-50' },
];

const PENDING_POLICIES = [
  { id: '1', title: 'Anti-Harassment Policy v2.0', category: 'HR', dueDate: '2026-03-15' },
  { id: '2', title: 'Data Privacy & Security Policy', category: 'IT', dueDate: '2026-03-20' },
];

const UPCOMING_TRAININGS = [
  { id: '1', title: 'Information Security Awareness', category: 'IT Security', duration: '2 hours', dueDate: '2026-03-31', progress: 60 },
  { id: '2', title: 'POSH Training', category: 'HR Compliance', duration: '1.5 hours', dueDate: '2026-04-15', progress: 0 },
  { id: '3', title: 'Code of Conduct Refresher', category: 'Ethics', duration: '1 hour', dueDate: '2026-04-30', progress: 100 },
];

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Management</h1>
          <p className="text-sm text-gray-500">Policies, trainings, and compliance tracking</p>
        </div>
        <Link href="/compliance/my-status">
          <Button variant="outline">My Compliance Status</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Acknowledgements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle size={16} className="text-yellow-600" /> Pending Acknowledgements
            </CardTitle>
            <Link href="/compliance/policies">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {PENDING_POLICIES.map((policy) => (
              <div key={policy.id} className="flex items-center justify-between p-3 border rounded-lg border-yellow-200 bg-yellow-50/50">
                <div>
                  <p className="text-sm font-medium text-gray-900">{policy.title}</p>
                  <p className="text-xs text-gray-500">Category: {policy.category} | Due: {policy.dueDate}</p>
                </div>
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Acknowledge</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Training Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Training Status</CardTitle>
            <Link href="/compliance/training">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {UPCOMING_TRAININGS.map((training) => (
              <div key={training.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{training.title}</p>
                    <p className="text-xs text-gray-500">{training.category} | {training.duration} | Due: {training.dueDate}</p>
                  </div>
                  <Badge className={
                    training.progress === 100 ? 'bg-green-100 text-green-700' :
                    training.progress > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }>
                    {training.progress === 100 ? 'Completed' : training.progress > 0 ? 'In Progress' : 'Not Started'}
                  </Badge>
                </div>
                {training.progress < 100 && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${training.progress}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{training.progress}%</span>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
