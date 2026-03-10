'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import {
  Calculator,
  CreditCard,
  TrendingDown,
  Landmark,
  Calendar,
  Phone,
  IndianRupee,
  AlertTriangle,
  CheckCircle2,
  ArrowDown,
  Shield,
  Zap,
  Snowflake,
  HandCoins,
  Clock,
} from 'lucide-react';

function formatCurrency(amount: number): string {
  return '\u20B9' + amount.toLocaleString('en-IN');
}

interface Loan {
  id: string;
  name: string;
  principal: number;
  outstanding: number;
  emi: number;
  rate: number;
  remainingMonths: number;
  type: string;
}

const LOANS: Loan[] = [
  { id: '1', name: 'Home Loan', principal: 3500000, outstanding: 2800000, emi: 32000, rate: 8.5, remainingMonths: 180, type: 'Secured' },
  { id: '2', name: 'Car Loan', principal: 600000, outstanding: 320000, emi: 12500, rate: 9.5, remainingMonths: 30, type: 'Secured' },
  { id: '3', name: 'Personal Loan', principal: 200000, outstanding: 85000, emi: 8500, rate: 14, remainingMonths: 11, type: 'Unsecured' },
];

const CREDIT_SCORE_TIPS = [
  'Pay all EMIs and credit card bills on time',
  'Keep credit utilization below 30%',
  'Avoid multiple loan inquiries in short period',
  'Maintain a healthy mix of secured and unsecured credit',
  'Review your credit report regularly for errors',
];

function calculateEMI(principal: number, ratePerAnnum: number, tenureMonths: number): number {
  const r = ratePerAnnum / 12 / 100;
  if (r === 0) return principal / tenureMonths;
  return Math.round(principal * r * Math.pow(1 + r, tenureMonths) / (Math.pow(1 + r, tenureMonths) - 1));
}

function getAvalancheOrder(loans: Loan[]): Loan[] {
  return [...loans].sort((a, b) => b.rate - a.rate);
}

function getSnowballOrder(loans: Loan[]): Loan[] {
  return [...loans].sort((a, b) => a.outstanding - b.outstanding);
}

export default function FinancialWellnessTab() {
  const [emiPrincipal, setEmiPrincipal] = useState(1000000);
  const [emiRate, setEmiRate] = useState(9);
  const [emiTenure, setEmiTenure] = useState(60);

  const monthlyEMI = useMemo(() => calculateEMI(emiPrincipal, emiRate, emiTenure), [emiPrincipal, emiRate, emiTenure]);
  const totalPayable = monthlyEMI * emiTenure;
  const totalInterest = totalPayable - emiPrincipal;

  const monthlySalary = 85000; // Net salary
  const totalEMI = LOANS.reduce((s, l) => s + l.emi, 0);
  const dtiRatio = ((totalEMI / monthlySalary) * 100).toFixed(1);
  const totalOutstanding = LOANS.reduce((s, l) => s + l.outstanding, 0);

  const avalancheOrder = getAvalancheOrder(LOANS);
  const snowballOrder = getSnowballOrder(LOANS);

  const creditScore = 742;

  return (
    <div className="space-y-6">
      {/* Financial Health Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-teal-50">
                <IndianRupee size={20} className="text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Net Salary</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(monthlySalary)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-red-50">
                <CreditCard size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total EMI</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalEMI)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${Number(dtiRatio) > 50 ? 'bg-red-50' : Number(dtiRatio) > 40 ? 'bg-amber-50' : 'bg-green-50'}`}>
                <TrendingDown size={20} className={Number(dtiRatio) > 50 ? 'text-red-600' : Number(dtiRatio) > 40 ? 'text-amber-600' : 'text-green-600'} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Debt-to-Income</p>
                <p className="text-xl font-bold text-gray-900">{dtiRatio}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-50">
                <Landmark size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Outstanding</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalOutstanding)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Debt-to-Income Ratio Detail */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingDown size={18} className="text-blue-600" />
            Debt-to-Income Ratio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={Number(dtiRatio)} className="h-3" />
              </div>
              <span className={`text-lg font-bold ${Number(dtiRatio) > 50 ? 'text-red-600' : Number(dtiRatio) > 40 ? 'text-amber-600' : 'text-green-600'}`}>
                {dtiRatio}%
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>0% (No debt)</span>
              <span className="text-green-600">30% (Healthy)</span>
              <span className="text-amber-600">40% (Caution)</span>
              <span className="text-red-600">50%+ (High Risk)</span>
            </div>
            <div className={`p-3 rounded-lg ${Number(dtiRatio) > 50 ? 'bg-red-50 border border-red-200' : Number(dtiRatio) > 40 ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
              <div className="flex items-start gap-2">
                {Number(dtiRatio) <= 40 ? (
                  <CheckCircle2 size={16} className="text-green-600 mt-0.5" />
                ) : (
                  <AlertTriangle size={16} className={Number(dtiRatio) > 50 ? 'text-red-600' : 'text-amber-600'} />
                )}
                <div className="text-sm">
                  {Number(dtiRatio) <= 40 ? (
                    <p className="text-green-800">Your debt-to-income ratio is healthy. You have good disposable income after EMI payments.</p>
                  ) : Number(dtiRatio) <= 50 ? (
                    <p className="text-amber-800">Your DTI is moderate. Consider reducing debt to improve financial flexibility.</p>
                  ) : (
                    <p className="text-red-800">Your DTI is high. Focus on debt reduction strategies to improve your financial health.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loan & Debt Management */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Landmark size={18} className="text-teal-600" />
            Active Loans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {LOANS.map((loan) => (
              <div key={loan.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-900">{loan.name}</h4>
                    <Badge variant="secondary" className="text-xs">{loan.type}</Badge>
                  </div>
                  <Badge className={`text-xs ${loan.rate > 12 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {loan.rate}% p.a.
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-4 text-xs mt-2">
                  <div>
                    <p className="text-gray-500">Principal</p>
                    <p className="font-medium">{formatCurrency(loan.principal)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Outstanding</p>
                    <p className="font-medium text-red-600">{formatCurrency(loan.outstanding)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Monthly EMI</p>
                    <p className="font-medium">{formatCurrency(loan.emi)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Remaining</p>
                    <p className="font-medium">{loan.remainingMonths} months</p>
                  </div>
                </div>
                <div className="mt-2">
                  <Progress value={((loan.principal - loan.outstanding) / loan.principal) * 100} className="h-1.5" />
                  <p className="text-xs text-gray-500 mt-1">
                    {(((loan.principal - loan.outstanding) / loan.principal) * 100).toFixed(0)}% repaid
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* EMI Calculator */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator size={18} className="text-purple-600" />
            EMI Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm">Loan Amount</Label>
                  <span className="text-sm font-medium text-gray-700">{formatCurrency(emiPrincipal)}</span>
                </div>
                <Slider
                  value={emiPrincipal}
                  onValueChange={(v) => setEmiPrincipal(v)}
                  min={100000}
                  max={10000000}
                  step={50000}
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>1L</span><span>1Cr</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm">Interest Rate (% p.a.)</Label>
                  <span className="text-sm font-medium text-gray-700">{emiRate}%</span>
                </div>
                <Slider
                  value={emiRate}
                  onValueChange={(v) => setEmiRate(v)}
                  min={5}
                  max={20}
                  step={0.5}
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>5%</span><span>20%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm">Tenure (months)</Label>
                  <span className="text-sm font-medium text-gray-700">{emiTenure} months ({(emiTenure / 12).toFixed(1)} years)</span>
                </div>
                <Slider
                  value={emiTenure}
                  onValueChange={(v) => setEmiTenure(v)}
                  min={6}
                  max={360}
                  step={6}
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>6 months</span><span>30 years</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-teal-50 rounded-lg p-4 text-center">
                <p className="text-xs text-teal-600 uppercase tracking-wider font-medium">Monthly EMI</p>
                <p className="text-3xl font-bold text-teal-700 mt-1">{formatCurrency(monthlyEMI)}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-blue-600">Total Payable</p>
                  <p className="text-lg font-bold text-blue-900">{formatCurrency(totalPayable)}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-red-600">Total Interest</p>
                  <p className="text-lg font-bold text-red-900">{formatCurrency(totalInterest)}</p>
                </div>
              </div>
              <div className="text-xs text-gray-500 text-center">
                Interest is {((totalInterest / emiPrincipal) * 100).toFixed(1)}% of the principal amount
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debt Clearoff Strategies */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap size={18} className="text-amber-600" />
            Debt Clearoff Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Avalanche Method */}
            <div className="rounded-lg border-2 border-red-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-red-100">
                  <ArrowDown size={16} className="text-red-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Avalanche Method</h4>
                  <p className="text-xs text-gray-500">Pay highest interest rate first</p>
                </div>
              </div>
              <div className="space-y-2">
                {avalancheOrder.map((loan, i) => (
                  <div key={loan.id} className="flex items-center justify-between text-sm p-2 rounded bg-gray-50">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 text-xs flex items-center justify-center font-semibold">{i + 1}</span>
                      <span className="text-gray-700">{loan.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-red-600">{loan.rate}%</span>
                      <span className="text-xs text-gray-500 ml-2">{formatCurrency(loan.outstanding)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-2 bg-red-50 rounded text-xs text-red-800">
                <Zap size={10} className="inline mr-1" />
                Saves more interest over time. Best for mathematically optimal debt reduction.
              </div>
            </div>

            {/* Snowball Method */}
            <div className="rounded-lg border-2 border-blue-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Snowflake size={16} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Snowball Method</h4>
                  <p className="text-xs text-gray-500">Pay smallest balance first</p>
                </div>
              </div>
              <div className="space-y-2">
                {snowballOrder.map((loan, i) => (
                  <div key={loan.id} className="flex items-center justify-between text-sm p-2 rounded bg-gray-50">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-semibold">{i + 1}</span>
                      <span className="text-gray-700">{loan.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-blue-600">{formatCurrency(loan.outstanding)}</span>
                      <span className="text-xs text-gray-500 ml-2">{loan.rate}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
                <Snowflake size={10} className="inline mr-1" />
                Builds momentum with quick wins. Best for motivation and behavioral change.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Score */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield size={18} className="text-green-600" />
            Credit Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-40 h-40">
                <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="#E5E7EB" strokeWidth="12" />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke={creditScore >= 750 ? '#10B981' : creditScore >= 650 ? '#F59E0B' : '#EF4444'}
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 70}
                    strokeDashoffset={2 * Math.PI * 70 * (1 - (creditScore - 300) / 600)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-3xl font-bold text-gray-900">{creditScore}</p>
                  <p className="text-xs text-gray-500">out of 900</p>
                </div>
              </div>
              <Badge className={`mt-3 ${creditScore >= 750 ? 'bg-green-100 text-green-700' : creditScore >= 650 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                {creditScore >= 750 ? 'Excellent' : creditScore >= 700 ? 'Good' : creditScore >= 650 ? 'Fair' : 'Poor'}
              </Badge>
              <p className="text-xs text-gray-400 mt-1">Last updated: Feb 2026</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Improvement Tips</h4>
              <div className="space-y-2">
                {CREDIT_SCORE_TIPS.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                    <span className="text-gray-600">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-50">
                <Phone size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Financial Counseling</p>
                <p className="text-xs text-gray-500">Book a session with our financial wellness advisor</p>
              </div>
              <Button size="sm" variant="outline">Book Session</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-teal-50">
                <HandCoins size={20} className="text-teal-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Salary Advance</p>
                <p className="text-xs text-gray-500">Request an advance on your upcoming salary</p>
              </div>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Request</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
