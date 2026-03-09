'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, Printer, IndianRupee } from 'lucide-react';
import Link from 'next/link';

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
  return '₹' + amount.toLocaleString('en-IN');
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
          <Button variant="outline" size="sm">
            <Printer size={14} className="mr-2" /> Print
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700" size="sm">
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
