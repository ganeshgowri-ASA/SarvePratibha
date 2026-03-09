'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CalendarPlus,
  FileText,
  Receipt,
  Laptop,
  Target,
  Calculator,
  Zap,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  CalendarPlus,
  FileText,
  Receipt,
  Laptop,
  Target,
  Calculator,
};

const LINKS = [
  { label: 'Apply Leave', href: '/leave-attendance/apply', icon: 'CalendarPlus', color: 'bg-green-50 text-green-600' },
  { label: 'View Payslip', href: '/payroll/payslips', icon: 'FileText', color: 'bg-blue-50 text-blue-600' },
  { label: 'Submit Claim', href: '/reimbursements/new', icon: 'Receipt', color: 'bg-orange-50 text-orange-600' },
  { label: 'IT Support', href: '/self-services/it-request', icon: 'Laptop', color: 'bg-purple-50 text-purple-600' },
  { label: 'My Goals', href: '/performance/goals', icon: 'Target', color: 'bg-teal-50 text-teal-600' },
  { label: 'Tax Declaration', href: '/payroll/tax', icon: 'Calculator', color: 'bg-red-50 text-red-600' },
];

export function QuickLinks() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Zap size={18} className="text-teal-600" />
          Quick Links
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {LINKS.map((link) => {
            const Icon = ICON_MAP[link.icon] || Zap;
            return (
              <Link
                key={link.label}
                href={link.href}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:shadow-md transition-all text-center group"
              >
                <div className={`p-2.5 rounded-lg ${link.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs font-medium text-gray-700">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
