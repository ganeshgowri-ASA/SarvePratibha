'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Download,
  ExternalLink,
  Lightbulb,
  TrendingUp,
  Shield,
  PiggyBank,
  Eye,
  Calculator,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

function formatCurrency(amount: number): string {
  return '\u20B9' + amount.toLocaleString('en-IN');
}

const ITR_FORMS = [
  {
    form: 'ITR-1 (Sahaj)',
    applicable: true,
    description: 'For salaried individuals with income up to 50 lakhs from salary, one house property, and other sources',
    conditions: ['Total income up to 50 lakhs', 'Salary/pension income', 'One house property', 'Interest income'],
  },
  {
    form: 'ITR-2',
    applicable: false,
    description: 'For individuals with income from capital gains, multiple house properties, or foreign income',
    conditions: ['Capital gains income', 'More than one house property', 'Foreign income/assets'],
  },
  {
    form: 'ITR-3',
    applicable: false,
    description: 'For individuals with income from business or profession',
    conditions: ['Business/professional income', 'Partner in a firm'],
  },
];

const AVAILABLE_FORMS = [
  { name: 'Form 16 - Part A', description: 'TDS Certificate from employer', status: 'Available', year: 'FY 2024-25' },
  { name: 'Form 16 - Part B', description: 'Detailed salary & tax computation', status: 'Available', year: 'FY 2024-25' },
  { name: 'Form 12BB', description: 'Investment declaration form', status: 'Available', year: 'FY 2025-26' },
  { name: 'Form 16 (Current)', description: 'Provisional for current FY', status: 'Processing', year: 'FY 2025-26' },
];

const TAX_SAVING_SUGGESTIONS = [
  {
    title: 'Maximize 80C Investments',
    description: 'You have utilized 1,50,000 of 1,50,000 limit.',
    status: 'fully_utilized',
    savings: 0,
    icon: Shield,
  },
  {
    title: 'NPS Contribution (80CCD)',
    description: 'Additional 50,000 deduction under 80CCD(1B) beyond 80C limit.',
    status: 'not_utilized',
    savings: 15600,
    icon: PiggyBank,
  },
  {
    title: 'Health Insurance for Parents (80D)',
    description: 'Increase parent insurance to claim up to 50,000 (for senior citizen parents).',
    status: 'partial',
    savings: 13416,
    icon: Shield,
  },
];

const INVESTMENT_SUGGESTIONS = [
  {
    type: 'ELSS Mutual Funds',
    minAmount: 500,
    lockIn: '3 years',
    expectedReturn: '12-15%',
    taxBenefit: '80C',
    projectedValue: '1,00,000 invested grows to ~1,52,000 in 3 years (at 15% p.a.)',
    risk: 'Moderate-High',
  },
  {
    type: 'NPS (National Pension System)',
    minAmount: 1000,
    lockIn: 'Till 60 years',
    expectedReturn: '8-10%',
    taxBenefit: '80CCD(1B) - Additional 50K',
    projectedValue: '50,000/year for 25 years = ~39 lakhs (at 9% p.a.)',
    risk: 'Moderate',
  },
  {
    type: 'PPF (Public Provident Fund)',
    minAmount: 500,
    lockIn: '15 years',
    expectedReturn: '7.1%',
    taxBenefit: '80C - EEE status',
    projectedValue: '1,50,000/year for 15 years = ~40 lakhs (at 7.1% p.a.)',
    risk: 'Low',
  },
  {
    type: 'Tax Saving FD',
    minAmount: 10000,
    lockIn: '5 years',
    expectedReturn: '7-7.5%',
    taxBenefit: '80C',
    projectedValue: '1,00,000 grows to ~1,43,000 in 5 years (at 7.5% p.a.)',
    risk: 'Low',
  },
];

export default function TaxFilingTab() {
  return (
    <div className="space-y-6">
      {/* ITR Form Recommendation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            Applicable ITR Form - AY 2026-27
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ITR_FORMS.map((form) => (
              <div
                key={form.form}
                className={`rounded-lg border-2 p-4 ${form.applicable ? 'border-teal-500 bg-teal-50/50' : 'border-gray-200 opacity-60'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{form.form}</h3>
                    {form.applicable && (
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        <CheckCircle2 size={10} className="mr-0.5" /> Recommended
                      </Badge>
                    )}
                  </div>
                  {form.applicable && (
                    <Button size="sm" variant="outline" className="text-xs">
                      <ExternalLink size={12} className="mr-1" /> File on IT Portal
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{form.description}</p>
                <div className="flex flex-wrap gap-2">
                  {form.conditions.map((c) => (
                    <Badge key={c} variant="secondary" className="text-xs font-normal">{c}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Filing Deadline: July 31, 2026</p>
                <p className="text-xs text-blue-600 mt-0.5">
                  Based on your salary structure (12 LPA) and single source of income, ITR-1 is the recommended form.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form 16 & Form 12BB */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Download size={18} className="text-teal-600" />
            Tax Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {AVAILABLE_FORMS.map((form) => (
              <div key={form.name} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{form.name}</p>
                  <p className="text-xs text-gray-500">{form.description} - {form.year}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${form.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {form.status}
                  </Badge>
                  {form.status === 'Available' ? (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="text-teal-600 h-8">
                        <Eye size={14} className="mr-1" /> View
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download size={14} />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Available after March</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tax Saving Suggestions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb size={18} className="text-amber-600" />
            Tax Saving Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {TAX_SAVING_SUGGESTIONS.map((suggestion) => (
              <div key={suggestion.title} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <div className={`p-2 rounded-lg ${suggestion.status === 'fully_utilized' ? 'bg-green-100' : suggestion.status === 'partial' ? 'bg-amber-100' : 'bg-red-100'}`}>
                  <suggestion.icon size={16} className={suggestion.status === 'fully_utilized' ? 'text-green-600' : suggestion.status === 'partial' ? 'text-amber-600' : 'text-red-600'} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{suggestion.title}</p>
                    {suggestion.savings > 0 && (
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        Save {formatCurrency(suggestion.savings)}/year
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
                  {suggestion.status === 'fully_utilized' && (
                    <Badge className="mt-1 bg-green-100 text-green-700 text-xs">
                      <CheckCircle2 size={10} className="mr-0.5" /> Fully Utilized
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            <div className="mt-2 p-3 rounded-lg bg-teal-50 border border-teal-200">
              <div className="flex items-start gap-2">
                <IndianRupee size={16} className="text-teal-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-teal-900">
                    Total Potential Additional Savings: {formatCurrency(TAX_SAVING_SUGGESTIONS.reduce((s, sg) => s + sg.savings, 0))}/year
                  </p>
                  <p className="text-xs text-teal-700 mt-0.5">
                    By optimizing NPS and parent health insurance, you could reduce your tax liability further.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Suggestions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp size={18} className="text-green-600" />
            Investment Suggestions with Projected Returns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INVESTMENT_SUGGESTIONS.map((inv) => (
              <div key={inv.type} className="rounded-lg border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">{inv.type}</h4>
                  <Badge variant="secondary" className="text-xs">{inv.risk}</Badge>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Min. Investment</span>
                    <span className="font-medium">{formatCurrency(inv.minAmount)}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Lock-in Period</span>
                    <span className="font-medium">{inv.lockIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expected Return</span>
                    <span className="font-medium text-green-600">{inv.expectedReturn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax Benefit</span>
                    <span className="font-medium text-blue-600">{inv.taxBenefit}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="bg-green-50 rounded p-2">
                    <p className="text-xs text-green-800">
                      <Calculator size={10} className="inline mr-1" />
                      {inv.projectedValue}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
