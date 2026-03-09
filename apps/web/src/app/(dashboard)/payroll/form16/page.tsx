'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, FileCheck, Calendar, IndianRupee } from 'lucide-react';
import Link from 'next/link';

const FORM16_DATA = [
  {
    financialYear: '2024-2025',
    assessmentYear: '2025-2026',
    totalIncome: 1020000,
    totalTax: 78000,
    totalTdsDeducted: 78000,
    generatedAt: '15 Jun 2025',
    available: true,
  },
  {
    financialYear: '2023-2024',
    assessmentYear: '2024-2025',
    totalIncome: 960000,
    totalTax: 68400,
    totalTdsDeducted: 68400,
    generatedAt: '12 Jun 2024',
    available: true,
  },
  {
    financialYear: '2022-2023',
    assessmentYear: '2023-2024',
    totalIncome: 840000,
    totalTax: 52800,
    totalTdsDeducted: 52800,
    generatedAt: '14 Jun 2023',
    available: true,
  },
];

const CURRENT_FY = {
  financialYear: '2025-2026',
  assessmentYear: '2026-2027',
  available: false,
  expectedDate: 'June 2026',
};

function formatCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

export default function Form16Page() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/payroll">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Form 16</h1>
          <p className="text-sm text-gray-500">Download your annual tax certificates</p>
        </div>
      </div>

      {/* Current FY Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                FY {CURRENT_FY.financialYear} (AY {CURRENT_FY.assessmentYear})
              </p>
              <p className="text-xs text-blue-700">
                Form 16 for the current financial year will be available by {CURRENT_FY.expectedDate}.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form 16 List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileCheck size={18} className="text-teal-600" />
            Available Form 16 Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {FORM16_DATA.map((form) => (
              <div
                key={form.financialYear}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">FY {form.financialYear}</h3>
                      <Badge variant="outline" className="text-xs">AY {form.assessmentYear}</Badge>
                      <Badge className="bg-green-100 text-green-700 text-xs">Available</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-sm">
                      <div>
                        <p className="text-gray-500">Total Income</p>
                        <p className="font-medium">{formatCurrency(form.totalIncome)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total Tax</p>
                        <p className="font-medium">{formatCurrency(form.totalTax)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">TDS Deducted</p>
                        <p className="font-medium">{formatCurrency(form.totalTdsDeducted)}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">Generated on {form.generatedAt}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button className="bg-teal-600 hover:bg-teal-700" size="sm">
                      <Download size={14} className="mr-2" /> Part A & B
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download size={14} className="mr-2" /> Part A Only
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">About Form 16</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Part A:</strong> Details of tax deducted and deposited quarterly by employer (from TRACES)</p>
            <p><strong>Part B:</strong> Detailed computation of income, deductions, and tax payable</p>
            <p>Form 16 is issued by the employer under Section 203 of the Income Tax Act and is required for filing your ITR.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
