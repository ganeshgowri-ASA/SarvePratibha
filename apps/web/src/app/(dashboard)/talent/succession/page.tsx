'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GitBranch, Plus, User, ArrowRight } from 'lucide-react';

const SUCCESSION_PLANS = [
  {
    id: '1', position: 'VP of Engineering', department: 'Engineering', priority: 1,
    currentHolder: { name: 'Rajesh Kumar', id: 'EMP001' },
    successor: { name: 'Priya Sharma', id: 'EMP025', readiness: 'Ready Now', designation: 'Sr. Director' },
    notes: 'Strong technical leadership, has led 3 major initiatives',
  },
  {
    id: '2', position: 'Head of Product', department: 'Product', priority: 1,
    currentHolder: { name: 'Anita Verma', id: 'EMP008' },
    successor: { name: 'Vikram Thakur', id: 'EMP032', readiness: 'Ready in 1-2 years', designation: 'Product Manager' },
    notes: 'Needs exposure to enterprise strategy and P&L management',
  },
  {
    id: '3', position: 'CFO', department: 'Finance', priority: 1,
    currentHolder: { name: 'Suresh Mehta', id: 'EMP003' },
    successor: { name: 'Deepika Nair', id: 'EMP041', readiness: 'Ready in 1-2 years', designation: 'Finance Director' },
    notes: 'Completing executive MBA, strong analytical skills',
  },
  {
    id: '4', position: 'Director of Sales', department: 'Sales', priority: 2,
    currentHolder: { name: 'Amit Patel', id: 'EMP012' },
    successor: { name: 'Sneha Joshi', id: 'EMP056', readiness: 'Ready Now', designation: 'Regional Sales Head' },
    notes: 'Exceeded targets for 4 consecutive quarters',
  },
  {
    id: '5', position: 'CHRO', department: 'HR', priority: 1,
    currentHolder: { name: 'Meera Gupta', id: 'EMP005' },
    successor: { name: 'Kiran Das', id: 'EMP048', readiness: 'Ready in 2+ years', designation: 'HR Manager' },
    notes: 'Needs C-suite exposure and board interaction experience',
  },
];

const READINESS_STYLES: Record<string, string> = {
  'Ready Now': 'bg-green-100 text-green-700',
  'Ready in 1-2 years': 'bg-yellow-100 text-yellow-700',
  'Ready in 2+ years': 'bg-orange-100 text-orange-700',
};

export default function SuccessionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Succession Planning</h1>
          <p className="text-sm text-gray-500">Plan leadership transitions and identify successors</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus size={16} className="mr-2" /> New Plan
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {SUCCESSION_PLANS.map((plan) => (
          <Card key={plan.id}>
            <CardContent className="py-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <GitBranch size={16} className="text-purple-600" />
                    <span className="font-semibold text-gray-900">{plan.position}</span>
                    <Badge variant="outline">{plan.department}</Badge>
                    <Badge className={plan.priority === 1 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                      P{plan.priority}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Current Holder */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg min-w-[200px]">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User size={16} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{plan.currentHolder.name}</p>
                        <p className="text-xs text-gray-500">Current | {plan.currentHolder.id}</p>
                      </div>
                    </div>

                    <ArrowRight size={20} className="text-gray-400 shrink-0" />

                    {/* Successor */}
                    <div className="flex items-center gap-2 p-3 bg-teal-50 rounded-lg min-w-[200px]">
                      <div className="w-8 h-8 bg-teal-200 rounded-full flex items-center justify-center">
                        <User size={16} className="text-teal-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{plan.successor.name}</p>
                        <p className="text-xs text-gray-500">{plan.successor.designation} | {plan.successor.id}</p>
                        <Badge className={`${READINESS_STYLES[plan.successor.readiness]} text-xs mt-0.5`}>
                          {plan.successor.readiness}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {plan.notes && (
                    <p className="text-sm text-gray-500 mt-3 italic">{plan.notes}</p>
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
