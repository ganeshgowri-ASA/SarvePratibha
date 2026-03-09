'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, IndianRupee, TrendingDown, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const FINANCIAL_YEAR = '2025-2026';
const ASSESSMENT_YEAR = '2026-2027';

// Mock tax computation data
const TAX_COMPUTATION = {
  regime: 'OLD' as const,
  grossIncome: 1020000,
  earnings: [
    { label: 'Basic Salary', annual: 510000 },
    { label: 'House Rent Allowance', annual: 204000 },
    { label: 'Conveyance Allowance', annual: 19200 },
    { label: 'Medical Allowance', annual: 15000 },
    { label: 'Special Allowance', annual: 181800 },
    { label: 'Other Allowances', annual: 90000 },
  ],
  deductions: {
    standardDeduction: 50000,
    section80C: 150000,
    section80D: 25000,
    section80G: 0,
    section24: 0,
    hraExemption: 120000,
    ltaExemption: 0,
    otherDeductions: 0,
  },
};

function formatCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

export default function TaxComputationPage() {
  const totalDeductions = Object.values(TAX_COMPUTATION.deductions).reduce((a, b) => a + b, 0);
  const taxableIncome = Math.max(TAX_COMPUTATION.grossIncome - totalDeductions, 0);

  // Tax calculation (Old Regime)
  let tax = 0;
  if (taxableIncome > 250000) tax += Math.min(taxableIncome - 250000, 250000) * 0.05;
  if (taxableIncome > 500000) tax += Math.min(taxableIncome - 500000, 500000) * 0.2;
  if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.3;
  if (taxableIncome <= 500000) tax = 0;

  const cess = Math.round(tax * 0.04);
  const totalTax = Math.round(tax + cess);
  const monthlyTds = Math.round(totalTax / 12);

  // Months passed (assume current month is March in FY)
  const monthsPassed = 11;
  const tdsDeducted = monthlyTds * monthsPassed;
  const remainingTds = totalTax - tdsDeducted;

  const deductionItems = [
    { label: 'Standard Deduction', amount: TAX_COMPUTATION.deductions.standardDeduction, section: 'u/s 16(ia)' },
    { label: 'Section 80C', amount: TAX_COMPUTATION.deductions.section80C, section: 'PPF, ELSS, LIC, etc.' },
    { label: 'Section 80D', amount: TAX_COMPUTATION.deductions.section80D, section: 'Medical Insurance' },
    { label: 'Section 80G', amount: TAX_COMPUTATION.deductions.section80G, section: 'Donations' },
    { label: 'Section 24', amount: TAX_COMPUTATION.deductions.section24, section: 'Home Loan Interest' },
    { label: 'HRA Exemption', amount: TAX_COMPUTATION.deductions.hraExemption, section: 'u/s 10(13A)' },
    { label: 'LTA Exemption', amount: TAX_COMPUTATION.deductions.ltaExemption, section: 'u/s 10(5)' },
  ];

  // Tax slab breakdown
  const slabs = [
    { range: 'Up to ₹2,50,000', rate: 'Nil', taxable: Math.min(taxableIncome, 250000), tax: 0 },
    { range: '₹2,50,001 - ₹5,00,000', rate: '5%', taxable: Math.max(0, Math.min(taxableIncome - 250000, 250000)), tax: Math.max(0, Math.min(taxableIncome - 250000, 250000)) * 0.05 },
    { range: '₹5,00,001 - ₹10,00,000', rate: '20%', taxable: Math.max(0, Math.min(taxableIncome - 500000, 500000)), tax: Math.max(0, Math.min(taxableIncome - 500000, 500000)) * 0.2 },
    { range: 'Above ₹10,00,000', rate: '30%', taxable: Math.max(0, taxableIncome - 1000000), tax: Math.max(0, taxableIncome - 1000000) * 0.3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/payroll">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tax Computation Sheet</h1>
            <p className="text-sm text-gray-500">FY {FINANCIAL_YEAR} (AY {ASSESSMENT_YEAR})</p>
          </div>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700" size="sm">
          <Download size={14} className="mr-2" /> Download
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-gray-500">Gross Income</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(TAX_COMPUTATION.grossIncome)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-gray-500">Total Deductions</p>
            <p className="text-lg font-bold text-green-700">{formatCurrency(totalDeductions)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-gray-500">Taxable Income</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(taxableIncome)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-gray-500">Total Tax</p>
            <p className="text-lg font-bold text-red-700">{formatCurrency(totalTax)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp size={18} className="text-green-600" />
              Income from Salary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {TAX_COMPUTATION.earnings.map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium">{formatCurrency(item.annual)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm font-semibold">
                <span>Gross Total Income</span>
                <span className="text-green-700">{formatCurrency(TAX_COMPUTATION.grossIncome)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deductions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown size={18} className="text-blue-600" />
              Deductions
              <Badge className="bg-blue-100 text-blue-700 text-xs ml-auto">{TAX_COMPUTATION.regime} Regime</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {deductionItems.map((item) => (
                <div key={item.label} className="flex justify-between text-sm items-center">
                  <div>
                    <span className="text-gray-600">{item.label}</span>
                    <span className="text-xs text-gray-400 ml-1">({item.section})</span>
                  </div>
                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm font-semibold">
                <span>Total Deductions</span>
                <span className="text-blue-700">{formatCurrency(totalDeductions)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tax Slab Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <IndianRupee size={18} className="text-red-600" />
            Tax Calculation (Old Regime - FY {FINANCIAL_YEAR})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 text-gray-500 font-medium">Income Slab</th>
                  <th className="pb-2 text-gray-500 font-medium text-right">Rate</th>
                  <th className="pb-2 text-gray-500 font-medium text-right">Taxable Amount</th>
                  <th className="pb-2 text-gray-500 font-medium text-right">Tax</th>
                </tr>
              </thead>
              <tbody>
                {slabs.map((slab) => (
                  <tr key={slab.range} className="border-b last:border-0">
                    <td className="py-2 text-gray-600">{slab.range}</td>
                    <td className="py-2 text-right font-medium">{slab.rate}</td>
                    <td className="py-2 text-right">{formatCurrency(slab.taxable)}</td>
                    <td className="py-2 text-right font-medium">{formatCurrency(Math.round(slab.tax))}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t">
                  <td colSpan={3} className="py-2 font-semibold">Income Tax</td>
                  <td className="py-2 text-right font-semibold">{formatCurrency(Math.round(tax))}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="py-1 text-gray-600">Health & Education Cess (4%)</td>
                  <td className="py-1 text-right">{formatCurrency(cess)}</td>
                </tr>
                <tr className="border-t bg-red-50 rounded">
                  <td colSpan={3} className="py-2 font-bold text-red-700">Total Tax Payable</td>
                  <td className="py-2 text-right font-bold text-red-700">{formatCurrency(totalTax)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* TDS Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">TDS Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Monthly TDS</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(monthlyTds)}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-500">TDS Deducted (Apr-Feb)</p>
              <p className="text-lg font-bold text-green-700">{formatCurrency(tdsDeducted)}</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-xs text-gray-500">Remaining TDS</p>
              <p className="text-lg font-bold text-orange-700">{formatCurrency(remainingTds)}</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-xs text-gray-500">Total Tax (Annual)</p>
              <p className="text-lg font-bold text-red-700">{formatCurrency(totalTax)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
