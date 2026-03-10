'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Trophy,
  TrendingUp,
  Target,
  Calendar,
  ExternalLink,
  IndianRupee,
  Building2,
  Star,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

function formatCurrency(amount: number): string {
  return '\u20B9' + amount.toLocaleString('en-IN');
}

const VPB_HISTORY = [
  { year: 'FY 2022-23', companyMultiplier: 1.1, perfScore: 3.8, projected: 85000, actual: 88000, status: 'PAID' },
  { year: 'FY 2023-24', companyMultiplier: 1.15, perfScore: 4.0, projected: 95000, actual: 100000, status: 'PAID' },
  { year: 'FY 2024-25', companyMultiplier: 1.2, perfScore: 4.2, projected: 108000, actual: 115000, status: 'PAID' },
  { year: 'FY 2025-26', companyMultiplier: 1.18, perfScore: 4.3, projected: 118000, actual: 0, status: 'PROJECTED' },
];

const PAYOUT_TIMELINE = [
  { step: 'Performance Review', date: 'Mar 2026', status: 'upcoming' },
  { step: 'Company Results Published', date: 'Apr 2026', status: 'upcoming' },
  { step: 'VPB Calculation', date: 'May 2026', status: 'upcoming' },
  { step: 'Manager Approval', date: 'May 2026', status: 'upcoming' },
  { step: 'Payout', date: 'Jun 2026', status: 'upcoming' },
];

const COMPARISON_DATA = VPB_HISTORY.map(h => ({
  year: h.year.replace('FY ', ''),
  Projected: h.projected,
  Actual: h.actual || undefined,
}));

interface VpbTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function VpbChartTooltip({ active, payload, label }: VpbTooltipProps) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-900 mb-1">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: entry.color }} />
            {entry.name}
          </span>
          <span className="font-medium">{entry.value ? formatCurrency(entry.value) : 'TBD'}</span>
        </div>
      ))}
    </div>
  );
}

export default function VPBTab() {
  const currentFY = VPB_HISTORY[VPB_HISTORY.length - 1];
  const baseSalary = 1200000;
  const vpbPercentage = 10; // 10% of CTC
  const baseVPB = baseSalary * (vpbPercentage / 100);

  return (
    <div className="space-y-6">
      {/* VPB Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-50">
                <Building2 size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Company Multiplier</p>
                <p className="text-xl font-bold text-gray-900">{currentFY.companyMultiplier}x</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-amber-50">
                <Star size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Performance Score</p>
                <p className="text-xl font-bold text-gray-900">{currentFY.perfScore}/5.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-teal-50">
                <IndianRupee size={20} className="text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Projected VPB</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(currentFY.projected)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-50">
                <Target size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">VPB % of CTC</p>
                <p className="text-xl font-bold text-gray-900">{vpbPercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* VPB Calculation Formula */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy size={18} className="text-amber-600" />
            VPB Calculation Formula
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex flex-wrap items-center gap-2 text-sm justify-center">
              <div className="bg-white rounded-lg border px-3 py-2 text-center">
                <p className="text-xs text-gray-500">Base VPB</p>
                <p className="font-semibold text-gray-900">{formatCurrency(baseVPB)}</p>
                <p className="text-xs text-gray-400">(10% of CTC)</p>
              </div>
              <span className="text-lg font-bold text-gray-400">&times;</span>
              <div className="bg-white rounded-lg border px-3 py-2 text-center">
                <p className="text-xs text-gray-500">Company Multiplier</p>
                <p className="font-semibold text-purple-700">{currentFY.companyMultiplier}x</p>
                <p className="text-xs text-gray-400">(Profit share)</p>
              </div>
              <span className="text-lg font-bold text-gray-400">&times;</span>
              <div className="bg-white rounded-lg border px-3 py-2 text-center">
                <p className="text-xs text-gray-500">Performance Factor</p>
                <p className="font-semibold text-amber-700">{(currentFY.perfScore / 5).toFixed(2)}</p>
                <p className="text-xs text-gray-400">(Score / 5.0)</p>
              </div>
              <span className="text-lg font-bold text-gray-400">=</span>
              <div className="bg-teal-50 rounded-lg border border-teal-200 px-4 py-2 text-center">
                <p className="text-xs text-teal-600">Projected VPB</p>
                <p className="font-bold text-teal-700 text-lg">{formatCurrency(currentFY.projected)}</p>
              </div>
            </div>
          </div>

          {/* Company Profit Share */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Company Profit Share</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Revenue Target Achievement</span>
                  <span className="font-medium text-green-600">112%</span>
                </div>
                <Progress value={112} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Profit Margin Target</span>
                  <span className="font-medium text-green-600">108%</span>
                </div>
                <Progress value={108} className="h-2" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Company multiplier is based on overall revenue and profit target achievement
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Individual Performance</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Performance Rating</span>
                  <span className="font-medium">{currentFY.perfScore}/5.0</span>
                </div>
                <Progress value={(currentFY.perfScore / 5) * 100} className="h-2" />
              </div>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= Math.round(currentFY.perfScore) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">Exceeds Expectations</span>
              </div>
              <Link href="/performance" className="inline-flex items-center text-xs text-teal-600 hover:text-teal-700 mt-1">
                View in Performance Management <ExternalLink size={10} className="ml-1" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projected vs Actual Chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp size={18} className="text-teal-600" />
            VPB History - Projected vs Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COMPARISON_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={{ stroke: '#D1D5DB' }} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<VpbChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Projected" fill="#93C5FD" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill="#0D9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Payout Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar size={18} className="text-blue-600" />
            Payout Timeline - FY 2025-26
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {PAYOUT_TIMELINE.map((step, index) => (
              <div key={step.step} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${step.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {index + 1}
                  </div>
                  {index < PAYOUT_TIMELINE.length - 1 && (
                    <div className="w-0.5 h-8 bg-gray-200 my-1" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="text-sm font-medium text-gray-900">{step.step}</p>
                  <p className="text-xs text-gray-500">{step.date}</p>
                  <Badge className={`mt-1 text-xs ${step.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {step.status === 'completed' ? 'Completed' : 'Upcoming'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* VPB History Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Bonus Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-6 gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider pb-2 border-b">
              <span>Financial Year</span>
              <span className="text-center">Co. Multiplier</span>
              <span className="text-center">Perf. Score</span>
              <span className="text-right">Projected</span>
              <span className="text-right">Actual</span>
              <span className="text-right">Status</span>
            </div>
            {VPB_HISTORY.map((h) => (
              <div key={h.year} className="grid grid-cols-6 gap-2 text-sm py-2">
                <span className="text-gray-700 font-medium">{h.year}</span>
                <span className="text-center">{h.companyMultiplier}x</span>
                <span className="text-center">{h.perfScore}/5</span>
                <span className="text-right">{formatCurrency(h.projected)}</span>
                <span className="text-right font-medium">{h.actual > 0 ? formatCurrency(h.actual) : '-'}</span>
                <span className="text-right">
                  <Badge className={`text-xs ${h.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {h.status}
                  </Badge>
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cross-link */}
      <Link href="/performance">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-50">
                  <Target size={18} className="text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">View Performance Management</p>
                  <p className="text-xs text-gray-500">See goals, KPIs, and detailed performance review</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
