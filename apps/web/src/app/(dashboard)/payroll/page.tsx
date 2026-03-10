'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  IndianRupee,
  Download,
  FileText,
  TrendingUp,
  Calculator,
  Receipt,
  FileCheck,
  ChevronRight,
  BarChart3,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import jsPDF from 'jspdf';

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

const EMPLOYEE_INFO = {
  name: 'Priya Sharma',
  employeeId: 'SP-ENG-003',
  department: 'Engineering',
  designation: 'Senior Developer',
  bankAccount: 'XXXX XXXX 4532',
  panNumber: 'ABCPS1234K',
  pfNumber: 'MH/MUM/12345/678',
};

const RECENT_PAYSLIPS = [
  { month: 2, year: 2026, label: 'February 2026', gross: 85000, deductions: 15200, net: 69800, status: 'PAID' },
  { month: 1, year: 2026, label: 'January 2026', gross: 85000, deductions: 15200, net: 69800, status: 'PAID' },
  { month: 12, year: 2025, label: 'December 2025', gross: 85000, deductions: 15200, net: 69800, status: 'PAID' },
  { month: 11, year: 2025, label: 'November 2025', gross: 85000, deductions: 15200, net: 69800, status: 'PAID' },
  { month: 10, year: 2025, label: 'October 2025', gross: 85000, deductions: 15200, net: 69800, status: 'PAID' },
];

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTH_SHORT = [
  '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const NAV_LINKS = [
  { label: 'Tax Declaration', href: '/payroll/tax-declaration', icon: Calculator, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Tax Computation', href: '/payroll/tax-computation', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Reimbursements', href: '/payroll/reimbursements', icon: Receipt, color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Form 16', href: '/payroll/form16', icon: FileCheck, color: 'text-green-600', bg: 'bg-green-50' },
];

function formatCurrency(amount: number): string {
  return '\u20B9' + amount.toLocaleString('en-IN');
}

function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num < 20) return ones[num];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + numberToWords(num % 100) : '');
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
  return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numberToWords(num % 10000000) : '');
}

function generateSalaryTrendData() {
  const data = [];
  const currentMonth = 2; // Feb 2026
  const currentYear = 2026;

  for (let i = 11; i >= 0; i--) {
    let m = currentMonth - i;
    let y = currentYear;
    while (m <= 0) {
      m += 12;
      y -= 1;
    }
    data.push({
      month: `${MONTH_SHORT[m]} ${y.toString().slice(-2)}`,
      Basic: SALARY_STRUCTURE.basic,
      HRA: SALARY_STRUCTURE.hra,
      Conveyance: SALARY_STRUCTURE.conveyance,
      'Special Allowance': SALARY_STRUCTURE.specialAllow,
      Other: SALARY_STRUCTURE.medicalAllow + SALARY_STRUCTURE.otherAllow,
      Deductions: -SALARY_STRUCTURE.totalDeductions,
    });
  }
  return data;
}

function generatePayslipPdf(slip: typeof RECENT_PAYSLIPS[0]) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // Company header background
  doc.setFillColor(13, 148, 136); // teal-600
  doc.rect(0, 0, pageWidth, 45, 'F');

  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('SarvePratibha Technologies', margin, y);
  y += 7;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('123 Tech Park, Sector 5, Mumbai, Maharashtra - 400001', margin, y);
  y += 5;
  doc.text('CIN: U72200MH2020PTC123456 | PAN: AABCS1234A', margin, y);

  // Payslip label on right
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYSLIP', pageWidth - margin, 20, { align: 'right' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${MONTH_NAMES[slip.month]} ${slip.year}`, pageWidth - margin, 28, { align: 'right' });

  y = 55;

  // Employee Information section
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(240, 253, 250); // teal-50
  doc.rect(margin, y - 5, contentWidth, 35, 'F');
  doc.setDrawColor(13, 148, 136);
  doc.rect(margin, y - 5, contentWidth, 35, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);

  const col1 = margin + 5;
  const col2 = margin + contentWidth * 0.25;
  const col3 = margin + contentWidth * 0.5;
  const col4 = margin + contentWidth * 0.75;

  // Row 1
  doc.text('Employee Name', col1, y);
  doc.text('Employee ID', col2, y);
  doc.text('Department', col3, y);
  doc.text('Designation', col4, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(EMPLOYEE_INFO.name, col1, y);
  doc.text(EMPLOYEE_INFO.employeeId, col2, y);
  doc.text(EMPLOYEE_INFO.department, col3, y);
  doc.text(EMPLOYEE_INFO.designation, col4, y);

  // Row 2
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Bank Account', col1, y);
  doc.text('PAN', col2, y);
  doc.text('PF Number', col3, y);
  doc.text('Pay Period', col4, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(EMPLOYEE_INFO.bankAccount, col1, y);
  doc.text(EMPLOYEE_INFO.panNumber, col2, y);
  doc.text(EMPLOYEE_INFO.pfNumber, col3, y);
  const daysInMonth = new Date(slip.year, slip.month, 0).getDate();
  doc.text(`1 - ${daysInMonth} ${MONTH_NAMES[slip.month]} ${slip.year}`, col4, y);

  y += 15;

  // Earnings & Deductions side by side
  const halfWidth = contentWidth / 2 - 5;

  // Earnings Header
  doc.setFillColor(220, 252, 231); // green-100
  doc.rect(margin, y - 4, halfWidth, 8, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 128, 61); // green-700
  doc.text('EARNINGS', margin + 5, y + 1);

  // Deductions Header
  doc.setFillColor(254, 226, 226); // red-100
  doc.rect(margin + halfWidth + 10, y - 4, halfWidth, 8, 'F');
  doc.setTextColor(185, 28, 28); // red-700
  doc.text('DEDUCTIONS', margin + halfWidth + 15, y + 1);

  y += 12;
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);

  const earnings = [
    { label: 'Basic Salary', amount: SALARY_STRUCTURE.basic },
    { label: 'House Rent Allowance (HRA)', amount: SALARY_STRUCTURE.hra },
    { label: 'Conveyance Allowance', amount: SALARY_STRUCTURE.conveyance },
    { label: 'Medical Allowance', amount: SALARY_STRUCTURE.medicalAllow },
    { label: 'Special Allowance', amount: SALARY_STRUCTURE.specialAllow },
    { label: 'Other Allowances', amount: SALARY_STRUCTURE.otherAllow },
  ];

  const deductions = [
    { label: 'Provident Fund (PF)', amount: SALARY_STRUCTURE.pfDeduction },
    { label: 'ESI', amount: SALARY_STRUCTURE.esiDeduction },
    { label: 'Professional Tax', amount: SALARY_STRUCTURE.profTax },
    { label: 'TDS (Income Tax)', amount: SALARY_STRUCTURE.tds },
  ];

  const maxRows = Math.max(earnings.length, deductions.length);

  for (let i = 0; i < maxRows; i++) {
    if (i % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, y - 3, halfWidth, 7, 'F');
      doc.rect(margin + halfWidth + 10, y - 3, halfWidth, 7, 'F');
    }

    if (i < earnings.length) {
      doc.setFont('helvetica', 'normal');
      doc.text(earnings[i].label, margin + 5, y);
      doc.text(formatCurrency(earnings[i].amount), margin + halfWidth - 5, y, { align: 'right' });
    }

    if (i < deductions.length) {
      doc.setFont('helvetica', 'normal');
      doc.text(deductions[i].label, margin + halfWidth + 15, y);
      doc.text(formatCurrency(deductions[i].amount), margin + contentWidth - 5, y, { align: 'right' });
    }

    y += 7;
  }

  // Totals line
  y += 3;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y - 3, margin + halfWidth, y - 3);
  doc.line(margin + halfWidth + 10, y - 3, margin + contentWidth, y - 3);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 128, 61);
  doc.text('Gross Earnings', margin + 5, y);
  doc.text(formatCurrency(SALARY_STRUCTURE.grossSalary), margin + halfWidth - 5, y, { align: 'right' });

  doc.setTextColor(185, 28, 28);
  doc.text('Total Deductions', margin + halfWidth + 15, y);
  doc.text(formatCurrency(SALARY_STRUCTURE.totalDeductions), margin + contentWidth - 5, y, { align: 'right' });

  // Net Pay box
  y += 15;
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(13, 148, 136);
  doc.roundedRect(margin, y - 5, contentWidth, 20, 3, 3, 'FD');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136);
  doc.text('NET PAY', margin + 10, y + 3);
  doc.setFontSize(14);
  doc.text(formatCurrency(SALARY_STRUCTURE.netSalary), pageWidth - margin - 10, y + 3, { align: 'right' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`(Rupees ${numberToWords(SALARY_STRUCTURE.netSalary)} Only)`, margin + 10, y + 10);

  // Bank Details
  y += 30;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Bank Transfer Details', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Account: ${EMPLOYEE_INFO.bankAccount}`, margin, y);
  doc.text('Bank: HDFC Bank', margin + contentWidth * 0.4, y);
  y += 5;
  doc.text('IFSC: HDFC0001234', margin, y);
  doc.text(`Transfer Date: 28 ${MONTH_NAMES[slip.month]} ${slip.year}`, margin + contentWidth * 0.4, y);

  // Company Seal area
  y += 20;
  doc.setDrawColor(200, 200, 200);
  doc.setLineDashPattern([2, 2], 0);
  doc.rect(pageWidth - margin - 50, y - 5, 50, 30, 'S');
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text('Company Seal', pageWidth - margin - 25, y + 12, { align: 'center' });

  // Authorized Signatory
  doc.setLineDashPattern([], 0);
  doc.line(margin, y + 20, margin + 50, y + 20);
  doc.setFontSize(8);
  doc.text('Authorized Signatory', margin, y + 25);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text('This is a system-generated payslip and does not require a physical signature.', pageWidth / 2, footerY, { align: 'center' });
  doc.text('SarvePratibha Technologies Pvt. Ltd.', pageWidth / 2, footerY + 4, { align: 'center' });

  doc.save(`Payslip_${MONTH_NAMES[slip.month]}_${slip.year}.pdf`);
}

const SALARY_TREND_DATA = generateSalaryTrendData();

const CHART_COLORS = {
  Basic: '#0D9488',           // dark teal
  HRA: '#14B8A6',             // medium teal
  Conveyance: '#5EEAD4',      // light teal
  'Special Allowance': '#22C55E', // green
  Other: '#9CA3AF',           // gray
  Deductions: '#EF4444',      // red
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-900 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: entry.color }} />
            {entry.name}
          </span>
          <span className="font-medium">{formatCurrency(Math.abs(entry.value))}</span>
        </div>
      ))}
    </div>
  );
}

export default function PayrollPage() {
  const [viewSlip, setViewSlip] = useState<typeof RECENT_PAYSLIPS[0] | null>(null);

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

      {/* Monthly Salary Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 size={18} className="text-teal-600" />
            Monthly Salary Trend (Last 12 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SALARY_TREND_DATA} stackOffset="sign" margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  axisLine={{ stroke: '#D1D5DB' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value: number) => {
                    if (value === 0) return '0';
                    const absVal = Math.abs(value);
                    if (absVal >= 1000) return `${value < 0 ? '-' : ''}${(absVal / 1000).toFixed(0)}K`;
                    return value.toString();
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  formatter={(value: string) => <span className="text-gray-600">{value}</span>}
                />
                <ReferenceLine y={0} stroke="#D1D5DB" />
                <Bar dataKey="Basic" stackId="a" fill={CHART_COLORS.Basic} radius={[0, 0, 0, 0]} />
                <Bar dataKey="HRA" stackId="a" fill={CHART_COLORS.HRA} />
                <Bar dataKey="Conveyance" stackId="a" fill={CHART_COLORS.Conveyance} />
                <Bar dataKey="Special Allowance" stackId="a" fill={CHART_COLORS['Special Allowance']} />
                <Bar dataKey="Other" stackId="a" fill={CHART_COLORS.Other} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Deductions" stackId="b" fill={CHART_COLORS.Deductions} radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-teal-600 hover:text-teal-700"
                    onClick={() => setViewSlip(slip)}
                  >
                    <Eye size={14} className="mr-1" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => generatePayslipPdf(slip)}
                    title="Download PDF"
                  >
                    <Download size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Payslip Modal */}
      <Dialog open={!!viewSlip} onOpenChange={(open) => { if (!open) setViewSlip(null); }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Payslip - {viewSlip ? `${MONTH_NAMES[viewSlip.month]} ${viewSlip.year}` : ''}
            </DialogTitle>
            <DialogDescription>Detailed salary breakdown for the pay period</DialogDescription>
          </DialogHeader>

          {viewSlip && (
            <div className="space-y-5 py-2">
              {/* Company Header */}
              <div className="bg-teal-600 text-white rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg">SarvePratibha Technologies</p>
                    <p className="text-sm text-teal-100">123 Tech Park, Sector 5, Mumbai, Maharashtra - 400001</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">PAYSLIP</p>
                    <p className="text-sm text-teal-100">{MONTH_NAMES[viewSlip.month]} {viewSlip.year}</p>
                  </div>
                </div>
              </div>

              {/* Employee Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Employee Name</p>
                  <p className="font-medium">{EMPLOYEE_INFO.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Employee ID</p>
                  <p className="font-medium">{EMPLOYEE_INFO.employeeId}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Department</p>
                  <p className="font-medium">{EMPLOYEE_INFO.department}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Designation</p>
                  <p className="font-medium">{EMPLOYEE_INFO.designation}</p>
                </div>
              </div>

              <Separator />

              {/* Earnings & Deductions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-green-700 mb-3 uppercase tracking-wider">Earnings</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Basic Salary', amount: SALARY_STRUCTURE.basic },
                      { label: 'House Rent Allowance', amount: SALARY_STRUCTURE.hra },
                      { label: 'Conveyance Allowance', amount: SALARY_STRUCTURE.conveyance },
                      { label: 'Medical Allowance', amount: SALARY_STRUCTURE.medicalAllow },
                      { label: 'Special Allowance', amount: SALARY_STRUCTURE.specialAllow },
                      { label: 'Other Allowances', amount: SALARY_STRUCTURE.otherAllow },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-medium">{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between text-sm font-semibold">
                      <span>Gross Earnings</span>
                      <span className="text-green-700">{formatCurrency(SALARY_STRUCTURE.grossSalary)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-red-700 mb-3 uppercase tracking-wider">Deductions</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Provident Fund (PF)', amount: SALARY_STRUCTURE.pfDeduction },
                      { label: 'ESI', amount: SALARY_STRUCTURE.esiDeduction },
                      { label: 'Professional Tax', amount: SALARY_STRUCTURE.profTax },
                      { label: 'Income Tax (TDS)', amount: SALARY_STRUCTURE.tds },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-medium">{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between text-sm font-semibold">
                      <span>Total Deductions</span>
                      <span className="text-red-700">{formatCurrency(SALARY_STRUCTURE.totalDeductions)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Net Pay */}
              <div className="bg-teal-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Net Pay</p>
                    <p className="text-2xl font-bold text-teal-700 flex items-center gap-1">
                      <IndianRupee size={22} />
                      {SALARY_STRUCTURE.netSalary.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Rupees {numberToWords(SALARY_STRUCTURE.netSalary)} Only
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 text-sm px-3 py-1">{viewSlip.status}</Badge>
                </div>
              </div>

              {/* Bank Details */}
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">Bank Transfer Details</p>
                <p>Account: {EMPLOYEE_INFO.bankAccount} | Bank: HDFC Bank | IFSC: HDFC0001234</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-gray-400">
                  This is a system-generated payslip and does not require a signature.
                </p>
                <Button
                  className="bg-teal-600 hover:bg-teal-700"
                  size="sm"
                  onClick={() => generatePayslipPdf(viewSlip)}
                >
                  <Download size={14} className="mr-2" /> Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
