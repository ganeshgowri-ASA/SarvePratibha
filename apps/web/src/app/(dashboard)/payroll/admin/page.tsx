'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Play,
  IndianRupee,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const PAYROLL_HISTORY = [
  { month: 2, year: 2026, status: 'COMPLETED', employees: 145, gross: 12325000, deductions: 2198800, net: 10126200, runDate: '28 Feb 2026' },
  { month: 1, year: 2026, status: 'COMPLETED', employees: 143, gross: 12155000, deductions: 2168800, net: 9986200, runDate: '30 Jan 2026' },
  { month: 12, year: 2025, status: 'COMPLETED', employees: 140, gross: 11900000, deductions: 2120000, net: 9780000, runDate: '29 Dec 2025' },
  { month: 11, year: 2025, status: 'COMPLETED', employees: 138, gross: 11730000, deductions: 2090000, net: 9640000, runDate: '28 Nov 2025' },
];

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
};

function formatCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

export default function PayrollAdminPage() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(3); // March
  const [selectedYear, setSelectedYear] = useState(2026);

  const handleRunPayroll = () => {
    setRunning(true);
    setProgress(0);
    setCompleted(false);

    // Simulate payroll run
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setRunning(false);
          setCompleted(true);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Payroll Administration</h1>
          <p className="text-sm text-gray-500">Run payroll, manage salary structures, and view reports</p>
        </div>
      </div>

      {/* Current Month Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Active Employees</p>
                <p className="text-lg font-bold text-gray-900">145</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <IndianRupee size={16} className="text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Last Month Gross</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(12325000)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-red-500" />
              <div>
                <p className="text-xs text-gray-500">Last Month Deductions</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(2198800)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <IndianRupee size={16} className="text-teal-500" />
              <div>
                <p className="text-xs text-gray-500">Last Month Net Pay</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(10126200)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Run Wizard */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Play size={18} className="text-teal-600" />
            Run Payroll
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Month/Year Selection */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <select
                  className="border rounded-md px-3 py-2 text-sm"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                  ))}
                </select>
                <select
                  className="border rounded-md px-3 py-2 text-sm"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                </select>
              </div>
            </div>

            {/* Pre-run Checklist */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Pre-run Checklist</h4>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'All salary structures assigned', ok: true },
                  { label: 'Attendance finalized', ok: true },
                  { label: 'Leave approvals completed', ok: true },
                  { label: 'Reimbursements processed', ok: false },
                  { label: 'Tax declarations updated', ok: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    {item.ok ? (
                      <CheckCircle2 size={14} className="text-green-600" />
                    ) : (
                      <AlertCircle size={14} className="text-yellow-600" />
                    )}
                    <span className={item.ok ? 'text-gray-600' : 'text-yellow-700'}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress */}
            {(running || completed) && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {completed ? 'Payroll completed' : 'Processing payroll...'}
                  </span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                {completed && (
                  <div className="bg-green-50 rounded-lg p-3 flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle2 size={16} />
                    Payroll processed for 145 employees. Total disbursement: {formatCurrency(10126200)}
                  </div>
                )}
              </div>
            )}

            {/* Run Button */}
            <Button
              className="bg-teal-600 hover:bg-teal-700"
              onClick={handleRunPayroll}
              disabled={running}
            >
              {running ? (
                <>
                  <Clock size={14} className="mr-2 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Play size={14} className="mr-2" /> Run Payroll for {MONTHS[selectedMonth - 1]} {selectedYear}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payroll History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payroll History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 text-gray-500 font-medium">Period</th>
                  <th className="pb-2 text-gray-500 font-medium">Employees</th>
                  <th className="pb-2 text-gray-500 font-medium text-right">Gross Pay</th>
                  <th className="pb-2 text-gray-500 font-medium text-right">Deductions</th>
                  <th className="pb-2 text-gray-500 font-medium text-right">Net Pay</th>
                  <th className="pb-2 text-gray-500 font-medium">Status</th>
                  <th className="pb-2 text-gray-500 font-medium">Run Date</th>
                </tr>
              </thead>
              <tbody>
                {PAYROLL_HISTORY.map((run) => (
                  <tr key={`${run.month}-${run.year}`} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 font-medium">{MONTHS[run.month - 1]} {run.year}</td>
                    <td className="py-3">{run.employees}</td>
                    <td className="py-3 text-right">{formatCurrency(run.gross)}</td>
                    <td className="py-3 text-right text-red-600">{formatCurrency(run.deductions)}</td>
                    <td className="py-3 text-right font-medium text-green-700">{formatCurrency(run.net)}</td>
                    <td className="py-3">
                      <Badge className={STATUS_STYLES[run.status] || ''}>
                        {run.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-gray-500">{run.runDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
