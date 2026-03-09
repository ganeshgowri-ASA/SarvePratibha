'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Receipt, Plus, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const CLAIMS = [
  { type: 'Travel', amount: '4,500', date: '5 Mar 2026', status: 'SUBMITTED' },
  { type: 'Medical', amount: '2,200', date: '28 Feb 2026', status: 'MANAGER_APPROVED' },
  { type: 'Food', amount: '1,800', date: '20 Feb 2026', status: 'PAID' },
  { type: 'Travel', amount: '6,000', date: '10 Feb 2026', status: 'PAID' },
];

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  SUBMITTED: 'bg-blue-100 text-blue-700',
  MANAGER_APPROVED: 'bg-yellow-100 text-yellow-700',
  FINANCE_APPROVED: 'bg-teal-100 text-teal-700',
  PAID: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export default function ReimbursementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reimbursements</h1>
          <p className="text-sm text-gray-500">Submit and track your expense claims</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/payroll/reimbursements">
            <Button variant="outline" size="sm">
              Full View <ChevronRight size={14} className="ml-1" />
            </Button>
          </Link>
          <Link href="/payroll/reimbursements/submit">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus size={16} className="mr-2" /> New Claim
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Receipt size={18} className="text-teal-600" />
            Recent Claims
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {CLAIMS.map((claim, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{claim.type} Reimbursement</p>
                  <p className="text-xs text-gray-500">{claim.date} &middot; &#8377;{claim.amount}</p>
                </div>
                <Badge className={STATUS_STYLES[claim.status] || ''}>
                  {claim.status.replace(/_/g, ' ')}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/payroll/reimbursements">
              <Button variant="ghost" size="sm" className="text-teal-600">
                View All Claims <ChevronRight size={14} className="ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
