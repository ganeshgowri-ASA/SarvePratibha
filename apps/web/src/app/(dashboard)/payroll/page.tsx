'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  IndianRupee,
  Download,
  FileText,
  TrendingUp,
  Calculator,
  Receipt,
  FileCheck,
  ChevronRight,
  Play,
} from 'lucide-react';
import Link from 'next/link';

const SALARY_STRUCTURE = {
  basic: 42500,
  hra: 17000,
  conveyance: 1600,
  medicalAllow: 1250,
  specialAllow: 15150,
  otherAllow: 7500,
  grossSalary: 85000,
  pfDeduction: 5100,
  esiDeduction: 0,
  profTax: 200,
  tds: 9900,
  totalDeductions: 15200,
  netSalary: 69800,
};

const RECENT_PAYSLIPS = [
  { month: 2, year: 2026, label: 'February 2026', gross: 85000, deductions: 15200, net: 69800, status: 'PAID' },
  { month: 1, year: 2026, label: 'January 2026', gross: 85000, deductions: 15200, net: 69800, status: 'PAID' },
  { month: 12, year: 2025, label: 'December 2025', gross: 85000, deductions: 15200, net: 69800, status: 'PAID' },
  { month: 11, year: 2025, label: 'November 2025', gross: 85000, deductions: 15200, net: 69800, status: 'PAID' },
  { month: 10, year: 2025, label: 'October 2025', gross: 85000, deductions: 15200, net: 69800, status: 'PAID' },
];

const NAV_LINKS = [
  { label: 'Tax Declaration', href: '/payroll/tax-declaration', icon: Calculator, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Tax Computation', href: '/payroll/tax-computation', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Reimbursements', href: '/payroll/reimbursements', icon: Receipt, color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Form 16', href: '/payroll/form16', icon: FileCheck, color: 'text-green-600', bg: 'bg-green-50' },
];

function formatCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

export default function PayrollPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll</h1>
          <p className="text-sm text-gray-500">View your salary details, payslips, and tax information</p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${link.bg}`}>
                    <link.icon size={18} className={link.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{link.label}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Salary Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-teal-50">
                <IndianRupee size={20} className="text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Gross Salary</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(SALARY_STRUCTURE.grossSalary)}</p>
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
                <p className="text-xl font-bold text-gray-900">{formatCurrency(SALARY_STRUCTURE.totalDeductions)}</p>
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
                <p className="text-xl font-bold text-gray-900">{formatCurrency(SALARY_STRUCTURE.netSalary)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-green-700">Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Basic Salary', amount: SALARY_STRUCTURE.basic },
                { label: 'House Rent Allowance (HRA)', amount: SALARY_STRUCTURE.hra },
                { label: 'Conveyance Allowance', amount: SALARY_STRUCTURE.conveyance },
                { label: 'Medical Allowance', amount: SALARY_STRUCTURE.medicalAllow },
                { label: 'Special Allowance', amount: SALARY_STRUCTURE.specialAllow },
                { label: 'Other Allowances', amount: SALARY_STRUCTURE.otherAllow },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium text-gray-900">{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between items-center font-semibold">
                <span className="text-gray-900">Gross Salary</span>
                <span className="text-green-700">{formatCurrency(SALARY_STRUCTURE.grossSalary)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-red-700">Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Provident Fund (PF)', amount: SALARY_STRUCTURE.pfDeduction },
                { label: 'ESI', amount: SALARY_STRUCTURE.esiDeduction },
                { label: 'Professional Tax', amount: SALARY_STRUCTURE.profTax },
                { label: 'Tax Deducted at Source (TDS)', amount: SALARY_STRUCTURE.tds },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium text-gray-900">{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between items-center font-semibold">
                <span className="text-gray-900">Total Deductions</span>
                <span className="text-red-700">{formatCurrency(SALARY_STRUCTURE.totalDeductions)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payslip History */}
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
              <div key={`${slip.month}-${slip.year}`} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{slip.label}</p>
                  <p className="text-xs text-gray-500">
                    Gross: {formatCurrency(slip.gross)} | Deductions: {formatCurrency(slip.deductions)} | Net: {formatCurrency(slip.net)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700">{slip.status}</Badge>
                  <Link href={`/payroll/payslip/${slip.month}-${slip.year}`}>
                    <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
                      View
                    </Button>
                  </Link>
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
