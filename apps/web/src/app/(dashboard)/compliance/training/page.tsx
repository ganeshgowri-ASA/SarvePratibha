'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Play, CheckCircle2, Award } from 'lucide-react';

const TRAININGS = [
  { id: '1', title: 'Information Security Awareness', category: 'IT Security', duration: 120, passingScore: 80, description: 'Learn about data security best practices, phishing prevention, and secure coding', isRequired: true, enrolled: true, progress: 60, status: 'IN_PROGRESS' },
  { id: '2', title: 'Prevention of Sexual Harassment (POSH)', category: 'HR Compliance', duration: 90, passingScore: 70, description: 'Mandatory training on workplace harassment prevention and reporting', isRequired: true, enrolled: false, progress: 0, status: 'NOT_STARTED' },
  { id: '3', title: 'Code of Conduct Refresher', category: 'Ethics', duration: 60, passingScore: 70, description: 'Annual refresher on company code of conduct and ethical guidelines', isRequired: true, enrolled: true, progress: 100, status: 'COMPLETED', score: 95 },
  { id: '4', title: 'Anti-Money Laundering (AML)', category: 'Legal', duration: 45, passingScore: 80, description: 'Understanding AML regulations and compliance requirements', isRequired: false, enrolled: false, progress: 0, status: 'NOT_STARTED' },
  { id: '5', title: 'GDPR & Data Privacy', category: 'IT Security', duration: 75, passingScore: 75, description: 'Data privacy regulations and handling personal data', isRequired: true, enrolled: true, progress: 100, status: 'COMPLETED', score: 88 },
];

const STATUS_CONFIG: Record<string, { color: string; icon: typeof CheckCircle2; label: string }> = {
  COMPLETED: { color: 'bg-green-100 text-green-700', icon: CheckCircle2, label: 'Completed' },
  IN_PROGRESS: { color: 'bg-blue-100 text-blue-700', icon: Play, label: 'In Progress' },
  NOT_STARTED: { color: 'bg-gray-100 text-gray-600', icon: Clock, label: 'Not Started' },
  OVERDUE: { color: 'bg-red-100 text-red-700', icon: Clock, label: 'Overdue' },
};

export default function ComplianceTrainingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Training</h1>
          <p className="text-sm text-gray-500">Mandatory and optional compliance training courses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TRAININGS.map((training) => {
          const config = STATUS_CONFIG[training.status] || STATUS_CONFIG.NOT_STARTED;
          return (
            <Card key={training.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <BookOpen size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{training.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{training.category}</Badge>
                        {training.isRequired && <Badge className="bg-red-100 text-red-700 text-xs">Required</Badge>}
                      </div>
                    </div>
                  </div>
                  <Badge className={config.color}>{config.label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{training.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {training.duration} mins
                  </span>
                  <span>Passing: {training.passingScore}%</span>
                  {(training as any).score && (
                    <span className="flex items-center gap-1 text-green-600">
                      <Award size={12} /> Score: {(training as any).score}%
                    </span>
                  )}
                </div>
                {training.enrolled && training.status !== 'COMPLETED' && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span>{training.progress}%</span>
                    </div>
                    <Progress value={training.progress} className="h-2" />
                  </div>
                )}
                <div className="pt-1">
                  {training.status === 'NOT_STARTED' && (
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                      <Play size={14} className="mr-1" /> Start Training
                    </Button>
                  )}
                  {training.status === 'IN_PROGRESS' && (
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                      <Play size={14} className="mr-1" /> Continue
                    </Button>
                  )}
                  {training.status === 'COMPLETED' && (
                    <Button size="sm" variant="outline">
                      <Award size={14} className="mr-1" /> View Certificate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
