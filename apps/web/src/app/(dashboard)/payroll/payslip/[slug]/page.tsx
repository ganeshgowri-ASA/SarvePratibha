'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, Printer, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Mock payslip data
const PAYSLIP = {
  employeeName: 'Priya Sharma',
  employeeId: 'SP-ENG-003',
  department: 'Engineering',
  designation: 'Senior Developer',
  bankAccount: 'XXXX XXXX 4532',
  panNumber: 'ABCPS1234K',
  pfNumber: 'MH/MUM/12345/678',
  basic: 42500,
  hra: 17000,
  conveyance: 1600,
  medicalAllow: 1250,
  specialAllow: 15150,
  otherAllow: 7500,
  otherEarnings: 0,
  pfDeduction: 5100,
  esiDeduction: 0,
  profTax: 200,
  tds: 9900,
  otherDeductions: 0,
  lop: 0,
  lopDays: 0,
  grossEarnings: 85000,
  totalDeductions: 15200,
  netPay: 69800,
  status: 'PAID',
};

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

function generatePayslipPdf(month: number, year: number) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // Company header background
  doc.setFillColor(13, 148, 136);
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
  doc.text(`${MONTH_NAMES[month]} ${year}`, pageWidth - margin, 28, { align: 'right' });

  y = 55;

  // Employee Information section
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(240, 253, 250);
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

  doc.text('Employee Name', col1, y);
  doc.text('Employee ID', col2, y);
  doc.text('Department', col3, y);
  doc.text('Designation', col4, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(PAYSLIP.employeeName, col1, y);
  doc.text(PAYSLIP.employeeId, col2, y);
  doc.text(PAYSLIP.department, col3, y);
  doc.text(PAYSLIP.designation, col4, y);

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
  doc.text(PAYSLIP.bankAccount, col1, y);
  doc.text(PAYSLIP.panNumber, col2, y);
  doc.text(PAYSLIP.pfNumber, col3, y);
  const daysInMonth = new Date(year, month, 0).getDate();
  doc.text(`1 - ${daysInMonth} ${MONTH_NAMES[month]} ${year}`, col4, y);

  y += 15;

  // Earnings & Deductions
  const halfWidth = contentWidth / 2 - 5;

  doc.setFillColor(220, 252, 231);
  doc.rect(margin, y - 4, halfWidth, 8, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 128, 61);
  doc.text('EARNINGS', margin + 5, y + 1);

  doc.setFillColor(254, 226, 226);
  doc.rect(margin + halfWidth + 10, y - 4, halfWidth, 8, 'F');
  doc.setTextColor(185, 28, 28);
  doc.text('DEDUCTIONS', margin + halfWidth + 15, y + 1);

  y += 12;
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);

  const earnings = [
    { label: 'Basic Salary', amount: PAYSLIP.basic },
    { label: 'House Rent Allowance (HRA)', amount: PAYSLIP.hra },
    { label: 'Conveyance Allowance', amount: PAYSLIP.conveyance },
    { label: 'Medical Allowance', amount: PAYSLIP.medicalAllow },
    { label: 'Special Allowance', amount: PAYSLIP.specialAllow },
    { label: 'Other Allowances', amount: PAYSLIP.otherAllow },
    ...(PAYSLIP.otherEarnings > 0 ? [{ label: 'Other Earnings', amount: PAYSLIP.otherEarnings }] : []),
  ];

  const deductions = [
    { label: 'Provident Fund (PF)', amount: PAYSLIP.pfDeduction },
    { label: 'ESI', amount: PAYSLIP.esiDeduction },
    { label: 'Professional Tax', amount: PAYSLIP.profTax },
    { label: 'TDS (Income Tax)', amount: PAYSLIP.tds },
    ...(PAYSLIP.otherDeductions > 0 ? [{ label: 'Other Deductions', amount: PAYSLIP.otherDeductions }] : []),
    ...(PAYSLIP.lop > 0 ? [{ label: `Loss of Pay (${PAYSLIP.lopDays} days)`, amount: PAYSLIP.lop }] : []),
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

  // Totals
  y += 3;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y - 3, margin + halfWidth, y - 3);
  doc.line(margin + halfWidth + 10, y - 3, margin + contentWidth, y - 3);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 128, 61);
  doc.text('Gross Earnings', margin + 5, y);
  doc.text(formatCurrency(PAYSLIP.grossEarnings), margin + halfWidth - 5, y, { align: 'right' });

  doc.setTextColor(185, 28, 28);
  doc.text('Total Deductions', margin + halfWidth + 15, y);
  doc.text(formatCurrency(PAYSLIP.totalDeductions), margin + contentWidth - 5, y, { align: 'right' });

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
  doc.text(formatCurrency(PAYSLIP.netPay), pageWidth - margin - 10, y + 3, { align: 'right' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`(Rupees ${numberToWords(PAYSLIP.netPay)} Only)`, margin + 10, y + 10);

  // Bank Details
  y += 30;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Bank Transfer Details', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Account: ${PAYSLIP.bankAccount}`, margin, y);
  doc.text('Bank: HDFC Bank', margin + contentWidth * 0.4, y);
  y += 5;
  doc.text('IFSC: HDFC0001234', margin, y);
  doc.text(`Transfer Date: 28 ${MONTH_NAMES[month]} ${year}`, margin + contentWidth * 0.4, y);

  // Company Seal
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

  doc.save(`Payslip_${MONTH_NAMES[month]}_${year}.pdf`);
}

export default function PayslipDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [monthStr, yearStr] = slug.split('-');
  const month = parseInt(monthStr);
  const year = parseInt(yearStr);
  const monthName = MONTH_NAMES[month] || 'Unknown';

  const earnings = [
    { label: 'Basic Salary', amount: PAYSLIP.basic },
    { label: 'House Rent Allowance', amount: PAYSLIP.hra },
    { label: 'Conveyance Allowance', amount: PAYSLIP.conveyance },
    { label: 'Medical Allowance', amount: PAYSLIP.medicalAllow },
    { label: 'Special Allowance', amount: PAYSLIP.specialAllow },
    { label: 'Other Allowances', amount: PAYSLIP.otherAllow },
    ...(PAYSLIP.otherEarnings > 0 ? [{ label: 'Other Earnings', amount: PAYSLIP.otherEarnings }] : []),
  ];

  const deductions = [
    { label: 'Provident Fund (Employee)', amount: PAYSLIP.pfDeduction },
    { label: 'ESI (Employee)', amount: PAYSLIP.esiDeduction },
    { label: 'Professional Tax', amount: PAYSLIP.profTax },
    { label: 'Income Tax (TDS)', amount: PAYSLIP.tds },
    ...(PAYSLIP.otherDeductions > 0 ? [{ label: 'Other Deductions', amount: PAYSLIP.otherDeductions }] : []),
    ...(PAYSLIP.lop > 0 ? [{ label: `Loss of Pay (${PAYSLIP.lopDays} days)`, amount: PAYSLIP.lop }] : []),
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
            <h1 className="text-2xl font-bold text-gray-900">Payslip - {monthName} {year}</h1>
            <p className="text-sm text-gray-500">Detailed salary breakdown</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer size={14} className="mr-2" /> Print
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700"
            size="sm"
            onClick={() => generatePayslipPdf(month, year)}
          >
            <Download size={14} className="mr-2" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Payslip Card */}
      <Card className="print:shadow-none">
        {/* Company Header */}
        <CardHeader className="bg-teal-600 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg text-white">SarvePratibha Technologies</CardTitle>
              <p className="text-sm text-teal-100">123 Tech Park, Sector 5, Mumbai, Maharashtra - 400001</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">PAYSLIP</p>
              <p className="text-sm text-teal-100">{monthName} {year}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Employee Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Employee Name</p>
              <p className="font-medium">{PAYSLIP.employeeName}</p>
            </div>
            <div>
              <p className="text-gray-500">Employee ID</p>
              <p className="font-medium">{PAYSLIP.employeeId}</p>
            </div>
            <div>
              <p className="text-gray-500">Department</p>
              <p className="font-medium">{PAYSLIP.department}</p>
            </div>
            <div>
              <p className="text-gray-500">Designation</p>
              <p className="font-medium">{PAYSLIP.designation}</p>
            </div>
            <div>
              <p className="text-gray-500">Bank Account</p>
              <p className="font-medium">{PAYSLIP.bankAccount}</p>
            </div>
            <div>
              <p className="text-gray-500">PAN</p>
              <p className="font-medium">{PAYSLIP.panNumber}</p>
            </div>
            <div>
              <p className="text-gray-500">PF Number</p>
              <p className="font-medium">{PAYSLIP.pfNumber}</p>
            </div>
            <div>
              <p className="text-gray-500">Pay Period</p>
              <p className="font-medium">1 {monthName} - {new Date(year, month, 0).getDate()} {monthName} {year}</p>
            </div>
          </div>

          <Separator />

          {/* Earnings & Deductions side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings */}
            <div>
              <h3 className="text-sm font-semibold text-green-700 mb-3 uppercase tracking-wider">Earnings</h3>
              <div className="space-y-2">
                {earnings.map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-medium">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between text-sm font-semibold">
                  <span>Total Earnings</span>
                  <span className="text-green-700">{formatCurrency(PAYSLIP.grossEarnings)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h3 className="text-sm font-semibold text-red-700 mb-3 uppercase tracking-wider">Deductions</h3>
              <div className="space-y-2">
                {deductions.map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-medium">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between text-sm font-semibold">
                  <span>Total Deductions</span>
                  <span className="text-red-700">{formatCurrency(PAYSLIP.totalDeductions)}</span>
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
                  {PAYSLIP.netPay.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Rupees {numberToWords(PAYSLIP.netPay)} Only
                </p>
              </div>
              <Badge className="bg-green-100 text-green-700 text-sm px-3 py-1">{PAYSLIP.status}</Badge>
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-400 text-center">
            This is a system-generated payslip and does not require a signature.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
