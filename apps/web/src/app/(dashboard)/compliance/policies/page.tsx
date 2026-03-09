'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Shield, Search, Check, Clock, FileText } from 'lucide-react';

const POLICIES = [
  { id: '1', title: 'Code of Conduct', category: 'Ethics', version: '3.0', effectiveFrom: '2026-01-01', acknowledged: true, acknowledgedAt: '2026-01-05', isRequired: true },
  { id: '2', title: 'Anti-Harassment Policy', category: 'HR', version: '2.0', effectiveFrom: '2026-02-01', acknowledged: false, isRequired: true },
  { id: '3', title: 'Data Privacy & Security Policy', category: 'IT', version: '1.5', effectiveFrom: '2026-02-15', acknowledged: false, isRequired: true },
  { id: '4', title: 'Whistleblower Policy', category: 'Legal', version: '1.0', effectiveFrom: '2025-06-01', acknowledged: true, acknowledgedAt: '2025-06-10', isRequired: true },
  { id: '5', title: 'Remote Work Policy', category: 'HR', version: '2.1', effectiveFrom: '2026-01-15', acknowledged: true, acknowledgedAt: '2026-01-20', isRequired: false },
  { id: '6', title: 'Travel & Expense Policy', category: 'Finance', version: '4.0', effectiveFrom: '2026-01-01', acknowledged: true, acknowledgedAt: '2026-01-03', isRequired: true },
  { id: '7', title: 'Information Security Policy', category: 'IT', version: '3.2', effectiveFrom: '2025-11-01', acknowledged: true, acknowledgedAt: '2025-11-10', isRequired: true },
  { id: '8', title: 'Social Media Policy', category: 'Communications', version: '1.0', effectiveFrom: '2025-09-01', acknowledged: true, acknowledgedAt: '2025-09-05', isRequired: false },
];

const CATEGORY_COLORS: Record<string, string> = {
  Ethics: 'bg-purple-100 text-purple-700',
  HR: 'bg-blue-100 text-blue-700',
  IT: 'bg-orange-100 text-orange-700',
  Legal: 'bg-red-100 text-red-700',
  Finance: 'bg-green-100 text-green-700',
  Communications: 'bg-teal-100 text-teal-700',
};

export default function PoliciesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Policies</h1>
          <p className="text-sm text-gray-500">Review and acknowledge company policies</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input placeholder="Search policies..." className="pl-9" />
      </div>

      <div className="space-y-3">
        {POLICIES.map((policy) => (
          <Card key={policy.id}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Shield size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{policy.title}</p>
                      <Badge variant="outline" className="text-xs">v{policy.version}</Badge>
                      {policy.isRequired && <Badge className="bg-red-100 text-red-700 text-xs">Required</Badge>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={CATEGORY_COLORS[policy.category] || 'bg-gray-100 text-gray-700'}>{policy.category}</Badge>
                      <span className="text-xs text-gray-500">Effective: {policy.effectiveFrom}</span>
                    </div>
                  </div>
                </div>
                <div>
                  {policy.acknowledged ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <Check size={16} />
                      <span className="text-sm font-medium">Acknowledged</span>
                      <span className="text-xs text-gray-400 ml-1">{policy.acknowledgedAt}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <FileText size={14} className="mr-1" /> Read
                      </Button>
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                        <Check size={14} className="mr-1" /> Acknowledge
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
