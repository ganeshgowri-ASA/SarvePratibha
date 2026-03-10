'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Scale,
  TrendingUp,
  Calculator,
  CheckCircle2,
  Info,
  IndianRupee,
  Lightbulb,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

function formatCurrency(amount: number): string {
  return '\u20B9' + amount.toLocaleString('en-IN');
}

const OLD_REGIME_SLABS = [
  { range: 'Up to 2,50,000', rate: 0, min: 0, max: 250000 },
  { range: '2,50,001 - 5,00,000', rate: 5, min: 250000, max: 500000 },
  { range: '5,00,001 - 10,00,000', rate: 20, min: 500000, max: 1000000 },
  { range: 'Above 10,00,000', rate: 30, min: 1000000, max: Infinity },
];

const NEW_REGIME_SLABS = [
  { range: 'Up to 4,00,000', rate: 0, min: 0, max: 400000 },
  { range: '4,00,001 - 8,00,000', rate: 5, min: 400000, max: 800000 },
  { range: '8,00,001 - 12,00,000', rate: 10, min: 800000, max: 1200000 },
  { range: '12,00,001 - 16,00,000', rate: 15, min: 1200000, max: 1600000 },
  { range: '16,00,001 - 20,00,000', rate: 20, min: 1600000, max: 2000000 },
  { range: '20,00,001 - 24,00,000', rate: 25, min: 2000000, max: 2400000 },
  { range: 'Above 24,00,000', rate: 30, min: 2400000, max: Infinity },
];

const SLAB_COLORS = ['#10B981', '#34D399', '#6EE7B7', '#FCD34D', '#FBBF24', '#F97316', '#EF4444'];

function calculateOldRegimeTax(grossIncome: number, deductions: number): number {
  const taxableIncome = Math.max(0, grossIncome - deductions - 50000); // 50k standard deduction
  let tax = 0;
  for (const slab of OLD_REGIME_SLABS) {
    if (taxableIncome > slab.min) {
      const taxable = Math.min(taxableIncome, slab.max) - slab.min;
      tax += taxable * (slab.rate / 100);
    }
  }
  // Rebate u/s 87A for income up to 5L
  if (taxableIncome <= 500000) tax = 0;
  const cess = tax * 0.04;
  return Math.round(tax + cess);
}

function calculateNewRegimeTax(grossIncome: number): number {
  const taxableIncome = Math.max(0, grossIncome - 75000); // 75k standard deduction in new regime
  let tax = 0;
  for (const slab of NEW_REGIME_SLABS) {
    if (taxableIncome > slab.min) {
      const taxable = Math.min(taxableIncome, slab.max) - slab.min;
      tax += taxable * (slab.rate / 100);
    }
  }
  // Rebate u/s 87A for income up to 12L under new regime (Budget 2025)
  if (taxableIncome <= 1200000) tax = 0;
  const cess = tax * 0.04;
  return Math.round(tax + cess);
}

interface SlabTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { range: string; rate: number; tax: number } }>;
}

function SlabChartTooltip({ active, payload }: SlabTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-900">{data.range}</p>
      <p className="text-gray-600">Rate: {data.rate}%</p>
      <p className="text-teal-700 font-medium">Tax: {formatCurrency(data.tax)}</p>
    </div>
  );
}

export default function TaxRegimeTab() {
  const [selectedRegime, setSelectedRegime] = useState<'old' | 'new'>('new');
  const [investments80C, setInvestments80C] = useState(150000);
  const [investments80D, setInvestments80D] = useState(25000);
  const [hraExemption, setHraExemption] = useState(120000);
  const [homeLoanInterest, setHomeLoanInterest] = useState(0);

  const grossAnnualIncome = 1200000; // 12 LPA

  const totalOldDeductions = investments80C + investments80D + hraExemption + homeLoanInterest;
  const oldRegimeTax = useMemo(() => calculateOldRegimeTax(grossAnnualIncome, totalOldDeductions), [totalOldDeductions]);
  const newRegimeTax = useMemo(() => calculateNewRegimeTax(grossAnnualIncome), []);

  const taxSaving = oldRegimeTax - newRegimeTax;
  const recommendedRegime = oldRegimeTax <= newRegimeTax ? 'old' : 'new';

  const currentSlabs = selectedRegime === 'old' ? OLD_REGIME_SLABS : NEW_REGIME_SLABS;
  const currentStdDeduction = selectedRegime === 'old' ? 50000 : 75000;
  const currentTaxableIncome = selectedRegime === 'old'
    ? Math.max(0, grossAnnualIncome - totalOldDeductions - 50000)
    : Math.max(0, grossAnnualIncome - 75000);

  const slabChartData = currentSlabs.map((slab) => {
    let tax = 0;
    if (currentTaxableIncome > slab.min) {
      const taxable = Math.min(currentTaxableIncome, slab.max) - slab.min;
      tax = taxable * (slab.rate / 100);
    }
    return {
      range: slab.range.length > 20 ? slab.range.substring(0, 18) + '...' : slab.range,
      fullRange: slab.range,
      rate: slab.rate,
      tax: Math.round(tax),
    };
  });

  const selectedTax = selectedRegime === 'old' ? oldRegimeTax : newRegimeTax;
  const monthlyTds = Math.round(selectedTax / 12);

  return (
    <div className="space-y-6">
      {/* Regime Toggle */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Scale size={18} className="text-teal-600" />
            Tax Regime Selection - FY 2025-26
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Label className={`text-sm font-medium ${selectedRegime === 'old' ? 'text-teal-700' : 'text-gray-500'}`}>
              Old Regime
            </Label>
            <Switch
              checked={selectedRegime === 'new'}
              onCheckedChange={(checked) => setSelectedRegime(checked ? 'new' : 'old')}
            />
            <Label className={`text-sm font-medium ${selectedRegime === 'new' ? 'text-teal-700' : 'text-gray-500'}`}>
              New Regime
            </Label>
            {selectedRegime === recommendedRegime && (
              <Badge className="bg-green-100 text-green-700 ml-2">
                <CheckCircle2 size={12} className="mr-1" /> Recommended
              </Badge>
            )}
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`rounded-lg border-2 p-4 ${selectedRegime === 'old' ? 'border-teal-500 bg-teal-50/50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Old Regime</h3>
                {recommendedRegime === 'old' && (
                  <Badge className="bg-green-100 text-green-700 text-xs">Best for you</Badge>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross Income</span>
                  <span className="font-medium">{formatCurrency(grossAnnualIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Standard Deduction</span>
                  <span className="font-medium text-green-700">-{formatCurrency(50000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chapter VI-A Deductions</span>
                  <span className="font-medium text-green-700">-{formatCurrency(totalOldDeductions)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxable Income</span>
                  <span className="font-medium">{formatCurrency(Math.max(0, grossAnnualIncome - totalOldDeductions - 50000))}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total Tax (incl. cess)</span>
                  <span className="text-red-600">{formatCurrency(oldRegimeTax)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Monthly TDS</span>
                  <span>{formatCurrency(Math.round(oldRegimeTax / 12))}</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500 flex items-start gap-1">
                <Info size={12} className="mt-0.5 shrink-0" />
                Allows 80C, 80D, HRA, LTA deductions
              </div>
            </div>

            <div className={`rounded-lg border-2 p-4 ${selectedRegime === 'new' ? 'border-teal-500 bg-teal-50/50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">New Regime</h3>
                {recommendedRegime === 'new' && (
                  <Badge className="bg-green-100 text-green-700 text-xs">Best for you</Badge>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross Income</span>
                  <span className="font-medium">{formatCurrency(grossAnnualIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Standard Deduction</span>
                  <span className="font-medium text-green-700">-{formatCurrency(75000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chapter VI-A Deductions</span>
                  <span className="font-medium text-gray-400">Not applicable</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxable Income</span>
                  <span className="font-medium">{formatCurrency(Math.max(0, grossAnnualIncome - 75000))}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total Tax (incl. cess)</span>
                  <span className="text-red-600">{formatCurrency(newRegimeTax)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Monthly TDS</span>
                  <span>{formatCurrency(Math.round(newRegimeTax / 12))}</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500 flex items-start gap-1">
                <Info size={12} className="mt-0.5 shrink-0" />
                Lower rates, higher standard deduction, no exemptions
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2">
              <Lightbulb size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-900">
                  Recommendation: {recommendedRegime === 'new' ? 'New' : 'Old'} Regime
                </p>
                <p className="text-amber-700 mt-1">
                  {taxSaving > 0
                    ? `You save ${formatCurrency(Math.abs(taxSaving))} per year with the New Regime. With your current investment declarations of ${formatCurrency(totalOldDeductions)}, the new regime offers better tax efficiency.`
                    : `You save ${formatCurrency(Math.abs(taxSaving))} per year with the Old Regime. Your investment declarations of ${formatCurrency(totalOldDeductions)} make the old regime more beneficial.`}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deduction Inputs (Old Regime) */}
      {selectedRegime === 'old' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator size={18} className="text-blue-600" />
              Applicable Deductions (Old Regime)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Section 80C (Max 1,50,000)</Label>
                <Input
                  type="number"
                  value={investments80C}
                  onChange={(e) => setInvestments80C(Math.min(150000, Number(e.target.value)))}
                  max={150000}
                />
                <p className="text-xs text-gray-500">PPF, ELSS, LIC, NSC, Tuition Fees</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Section 80D (Max 25,000)</Label>
                <Input
                  type="number"
                  value={investments80D}
                  onChange={(e) => setInvestments80D(Math.min(25000, Number(e.target.value)))}
                  max={25000}
                />
                <p className="text-xs text-gray-500">Medical Insurance Premium</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">HRA Exemption</Label>
                <Input
                  type="number"
                  value={hraExemption}
                  onChange={(e) => setHraExemption(Number(e.target.value))}
                />
                <p className="text-xs text-gray-500">Based on rent paid & metro city</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Section 24 - Home Loan Interest (Max 2,00,000)</Label>
                <Input
                  type="number"
                  value={homeLoanInterest}
                  onChange={(e) => setHomeLoanInterest(Math.min(200000, Number(e.target.value)))}
                  max={200000}
                />
                <p className="text-xs text-gray-500">Interest on housing loan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tax Slab Visualization */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp size={18} className="text-purple-600" />
            Tax Slab Breakdown ({selectedRegime === 'old' ? 'Old' : 'New'} Regime) - FY 2025-26
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={slabChartData} margin={{ top: 10, right: 10, left: 10, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                  axisLine={{ stroke: '#D1D5DB' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v.toString()}
                />
                <Tooltip content={<SlabChartTooltip />} />
                <Bar dataKey="tax" radius={[4, 4, 0, 0]}>
                  {slabChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={SLAB_COLORS[index % SLAB_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Slab Table */}
          <div className="mt-4">
            <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider pb-2 border-b">
              <span>Income Range</span>
              <span className="text-center">Tax Rate</span>
              <span className="text-right">Tax Amount</span>
            </div>
            {currentSlabs.map((slab, i) => {
              let tax = 0;
              if (currentTaxableIncome > slab.min) {
                const taxable = Math.min(currentTaxableIncome, slab.max) - slab.min;
                tax = taxable * (slab.rate / 100);
              }
              return (
                <div key={i} className={`grid grid-cols-3 gap-2 text-sm py-2 ${i % 2 === 0 ? 'bg-gray-50' : ''} px-1 rounded`}>
                  <span className="text-gray-700">{slab.range}</span>
                  <span className="text-center font-medium">{slab.rate}%</span>
                  <span className="text-right font-medium text-gray-900">{formatCurrency(Math.round(tax))}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tax Liability Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <IndianRupee size={18} className="text-teal-600" />
            Estimated Tax Liability & Monthly TDS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-xs text-blue-600 uppercase tracking-wider font-medium">Taxable Income</p>
              <p className="text-xl font-bold text-blue-900 mt-1">{formatCurrency(currentTaxableIncome)}</p>
              <p className="text-xs text-blue-500 mt-1">After {formatCurrency(currentStdDeduction)} std. deduction</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-xs text-red-600 uppercase tracking-wider font-medium">Annual Tax</p>
              <p className="text-xl font-bold text-red-900 mt-1">{formatCurrency(selectedTax)}</p>
              <p className="text-xs text-red-500 mt-1">Including 4% cess</p>
            </div>
            <div className="bg-teal-50 rounded-lg p-4 text-center">
              <p className="text-xs text-teal-600 uppercase tracking-wider font-medium">Monthly TDS</p>
              <p className="text-xl font-bold text-teal-900 mt-1">{formatCurrency(monthlyTds)}</p>
              <p className="text-xs text-teal-500 mt-1">Deducted from salary</p>
            </div>
          </div>

          {/* Monthly TDS Breakdown */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Monthly TDS Schedule (Apr 2025 - Mar 2026)</h4>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((month) => (
                <div key={month} className="text-center p-2 rounded bg-gray-50 border">
                  <p className="text-xs text-gray-500">{month}</p>
                  <p className="text-xs font-semibold text-gray-900">{formatCurrency(monthlyTds)}</p>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between items-center text-sm font-semibold border-t pt-2">
              <span className="text-gray-700">Total TDS for FY 2025-26</span>
              <span className="text-red-600">{formatCurrency(selectedTax)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
