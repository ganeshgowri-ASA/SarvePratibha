'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IndianRupee, Download, FileText, TrendingUp } from 'lucide-react';

const RECENT_PAYSLIPS = [
  { month: 'February 2026', gross: '85,000', deductions: '15,200', net: '69,800', status: 'PAID' },
  { month: 'January 2026', gross: '85,000', deductions: '15,200', net: '69,800', status: 'PAID' },
  { month: 'December 2025', gross: '85,000', deductions: '15,200', net: '69,800', status: 'PAID' },
];

export default function PayrollPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll</h1>
          <p className="text-sm text-gray-500">View your salary details and payslips</p>
        </div>
      </div>

      {/* Salary Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-teal-50">
                <IndianRupee size={20} className="text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Gross Salary</p>
                <p className="text-xl font-bold text-gray-900">&#8377;85,000</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-red-50">
                <TrendingUp size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Deductions</p>
                <p className="text-xl font-bold text-gray-900">&#8377;15,200</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-50">
                <IndianRupee size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Net Pay</p>
                <p className="text-xl font-bold text-gray-900">&#8377;69,800</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payslips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText size={18} className="text-teal-600" />
            Payslip History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {RECENT_PAYSLIPS.map((slip) => (
              <div key={slip.month} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{slip.month}</p>
                  <p className="text-xs text-gray-500">
                    Gross: &#8377;{slip.gross} | Deductions: &#8377;{slip.deductions} | Net: &#8377;{slip.net}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700">{slip.status}</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
