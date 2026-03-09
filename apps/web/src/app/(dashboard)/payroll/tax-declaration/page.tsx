'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { ArrowLeft, Calculator, Save, FileUp, Info, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const FINANCIAL_YEAR = '2025-2026';

interface InvestmentEntry {
  label: string;
  key: string;
  maxLimit?: number;
  description: string;
}

const SECTION_80C_ITEMS: InvestmentEntry[] = [
  { label: 'PPF (Public Provident Fund)', key: 'ppf', description: 'Annual contribution to PPF' },
  { label: 'ELSS (Equity Linked Savings)', key: 'elss', description: 'Investment in tax-saving mutual funds' },
  { label: 'LIC Premium', key: 'lic', description: 'Life insurance premiums paid' },
  { label: 'NSC (National Savings Certificate)', key: 'nsc', description: 'Investment in NSC' },
  { label: 'Children Tuition Fee', key: 'tuition', description: 'School/college tuition for max 2 children' },
  { label: 'EPF (Employee Provident Fund)', key: 'epf', description: 'Employee contribution (auto-deducted)' },
  { label: 'Home Loan Principal', key: 'hlPrincipal', description: 'Principal repayment on home loan' },
  { label: '5-Year FD', key: 'fd5', description: 'Tax-saving fixed deposit (5-year lock-in)' },
  { label: 'Sukanya Samriddhi', key: 'sukanya', description: 'For girl child up to 10 years' },
];

const SECTION_80D_ITEMS: InvestmentEntry[] = [
  { label: 'Self & Family Medical Insurance', key: 'selfMedical', description: 'Premium for self, spouse, children' },
  { label: 'Parents Medical Insurance', key: 'parentMedical', description: 'Premium for parents' },
  { label: 'Preventive Health Checkup', key: 'healthCheckup', maxLimit: 5000, description: 'Annual health checkup expenses' },
];

function formatCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

export default function TaxDeclarationPage() {
  const [regime, setRegime] = useState<'OLD' | 'NEW'>('OLD');
  const [values, setValues] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);

  const handleChange = (key: string, value: string) => {
    const num = parseInt(value) || 0;
    setValues((prev) => ({ ...prev, [key]: num }));
    setSaved(false);
  };

  const getTotal80C = () => {
    return Math.min(
      SECTION_80C_ITEMS.reduce((sum, item) => sum + (values[item.key] || 0), 0),
      150000,
    );
  };

  const getTotal80D = () => {
    return Math.min(
      SECTION_80D_ITEMS.reduce((sum, item) => sum + (values[item.key] || 0), 0),
      75000,
    );
  };

  const getHraExemption = () => values.rentPaid || 0;
  const getHomeLoanInterest = () => Math.min(values.hlInterest || 0, 200000);
  const getLta = () => values.lta || 0;
  const getOtherDeductions = () => values.other80G || 0;

  const totalDeclared = getTotal80C() + getTotal80D() + getHraExemption() + getHomeLoanInterest() + getLta() + getOtherDeductions();

  const handleSave = () => {
    setSaved(true);
    // In production, this would call the API
  };

  // Regime comparison
  const grossAnnual = 85000 * 12; // 10,20,000
  const standardDeduction = 50000;

  const oldTaxable = Math.max(grossAnnual - standardDeduction - totalDeclared, 0);
  const newTaxable = Math.max(grossAnnual - standardDeduction, 0);

  const calcOldTax = (income: number) => {
    if (income <= 250000) return 0;
    let tax = 0;
    if (income > 250000) tax += Math.min(income - 250000, 250000) * 0.05;
    if (income > 500000) tax += Math.min(income - 500000, 500000) * 0.2;
    if (income > 1000000) tax += (income - 1000000) * 0.3;
    if (income <= 500000) tax = 0;
    return Math.round(tax * 1.04);
  };

  const calcNewTax = (income: number) => {
    if (income <= 300000) return 0;
    let tax = 0;
    if (income > 300000) tax += Math.min(income - 300000, 300000) * 0.05;
    if (income > 600000) tax += Math.min(income - 600000, 300000) * 0.1;
    if (income > 900000) tax += Math.min(income - 900000, 300000) * 0.15;
    if (income > 1200000) tax += Math.min(income - 1200000, 300000) * 0.2;
    if (income > 1500000) tax += (income - 1500000) * 0.3;
    if (income <= 700000) tax = 0;
    return Math.round(tax * 1.04);
  };

  const oldTax = calcOldTax(oldTaxable);
  const newTax = calcNewTax(newTaxable);
  const savings = newTax - oldTax;

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
            <h1 className="text-2xl font-bold text-gray-900">Tax Declaration</h1>
            <p className="text-sm text-gray-500">FY {FINANCIAL_YEAR} - Submit your investment declarations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <Badge className="bg-green-100 text-green-700 gap-1">
              <CheckCircle2 size={14} /> Saved
            </Badge>
          )}
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSave}>
            <Save size={14} className="mr-2" /> Save Declaration
          </Button>
        </div>
      </div>

      {/* Regime Selection & Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator size={18} className="text-teal-600" />
            Tax Regime Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => setRegime('OLD')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                regime === 'OLD' ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">Old Regime</h3>
                {regime === 'OLD' && <Badge className="bg-teal-100 text-teal-700">Selected</Badge>}
              </div>
              <p className="text-xs text-gray-500 mb-3">All deductions available (80C, 80D, HRA, etc.)</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxable Income</span>
                  <span className="font-medium">{formatCurrency(oldTaxable)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tax</span>
                  <span className="font-bold text-lg">{formatCurrency(oldTax)}</span>
                </div>
              </div>
            </button>
            <button
              onClick={() => setRegime('NEW')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                regime === 'NEW' ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">New Regime</h3>
                {regime === 'NEW' && <Badge className="bg-teal-100 text-teal-700">Selected</Badge>}
              </div>
              <p className="text-xs text-gray-500 mb-3">Lower tax rates, minimal deductions</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxable Income</span>
                  <span className="font-medium">{formatCurrency(newTaxable)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tax</span>
                  <span className="font-bold text-lg">{formatCurrency(newTax)}</span>
                </div>
              </div>
            </button>
          </div>
          {savings !== 0 && (
            <div className={`rounded-lg p-3 text-sm ${savings > 0 ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
              <Info size={14} className="inline mr-1" />
              {savings > 0
                ? `You save ${formatCurrency(savings)} with the Old Regime based on your declarations.`
                : `You save ${formatCurrency(Math.abs(savings))} with the New Regime.`}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Investment Declarations (only shown if Old Regime) */}
      {regime === 'OLD' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Investment Declarations</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={['80c']}>
              {/* Section 80C */}
              <AccordionItem value="80c">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">Section 80C</span>
                    <Badge variant="outline" className="text-xs">Max ₹1,50,000</Badge>
                    <Badge className="bg-teal-100 text-teal-700 text-xs">{formatCurrency(getTotal80C())}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-1">
                    {SECTION_80C_ITEMS.map((item) => (
                      <div key={item.key} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                        <div className="md:col-span-2">
                          <Label htmlFor={item.key} className="text-sm">{item.label}</Label>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                        <Input
                          id={item.key}
                          type="number"
                          min={0}
                          placeholder="0"
                          value={values[item.key] || ''}
                          onChange={(e) => handleChange(item.key, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section 80D */}
              <AccordionItem value="80d">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">Section 80D - Medical Insurance</span>
                    <Badge variant="outline" className="text-xs">Max ₹75,000</Badge>
                    <Badge className="bg-teal-100 text-teal-700 text-xs">{formatCurrency(getTotal80D())}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-1">
                    {SECTION_80D_ITEMS.map((item) => (
                      <div key={item.key} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                        <div className="md:col-span-2">
                          <Label htmlFor={item.key} className="text-sm">{item.label}</Label>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                        <Input
                          id={item.key}
                          type="number"
                          min={0}
                          max={item.maxLimit}
                          placeholder="0"
                          value={values[item.key] || ''}
                          onChange={(e) => handleChange(item.key, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* HRA Exemption */}
              <AccordionItem value="hra">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">HRA Exemption</span>
                    <Badge className="bg-teal-100 text-teal-700 text-xs">{formatCurrency(getHraExemption())}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-1">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                      <div className="md:col-span-2">
                        <Label htmlFor="rentPaid" className="text-sm">Annual Rent Paid</Label>
                        <p className="text-xs text-gray-500">Total rent paid during the financial year</p>
                      </div>
                      <Input
                        id="rentPaid"
                        type="number"
                        min={0}
                        placeholder="0"
                        value={values.rentPaid || ''}
                        onChange={(e) => handleChange('rentPaid', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                      <div className="md:col-span-2">
                        <Label htmlFor="landlordPan" className="text-sm">Landlord PAN</Label>
                        <p className="text-xs text-gray-500">Required if annual rent exceeds ₹1,00,000</p>
                      </div>
                      <Input id="landlordPan" type="text" placeholder="ABCDE1234F" />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Home Loan Interest */}
              <AccordionItem value="homeloan">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">Section 24 - Home Loan Interest</span>
                    <Badge variant="outline" className="text-xs">Max ₹2,00,000</Badge>
                    <Badge className="bg-teal-100 text-teal-700 text-xs">{formatCurrency(getHomeLoanInterest())}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-1">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                      <div className="md:col-span-2">
                        <Label htmlFor="hlInterest" className="text-sm">Annual Home Loan Interest</Label>
                        <p className="text-xs text-gray-500">Interest component of EMI for self-occupied property</p>
                      </div>
                      <Input
                        id="hlInterest"
                        type="number"
                        min={0}
                        placeholder="0"
                        value={values.hlInterest || ''}
                        onChange={(e) => handleChange('hlInterest', e.target.value)}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Other Deductions */}
              <AccordionItem value="other">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">Other Deductions</span>
                    <Badge className="bg-teal-100 text-teal-700 text-xs">{formatCurrency(getLta() + getOtherDeductions())}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-1">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                      <div className="md:col-span-2">
                        <Label htmlFor="lta" className="text-sm">LTA (Leave Travel Allowance)</Label>
                        <p className="text-xs text-gray-500">Travel expenses for leave period</p>
                      </div>
                      <Input
                        id="lta"
                        type="number"
                        min={0}
                        placeholder="0"
                        value={values.lta || ''}
                        onChange={(e) => handleChange('lta', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                      <div className="md:col-span-2">
                        <Label htmlFor="other80G" className="text-sm">Section 80G - Donations</Label>
                        <p className="text-xs text-gray-500">Donations to eligible charitable institutions</p>
                      </div>
                      <Input
                        id="other80G"
                        type="number"
                        min={0}
                        placeholder="0"
                        value={values.other80G || ''}
                        onChange={(e) => handleChange('other80G', e.target.value)}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Declaration Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Selected Regime</p>
              <p className="text-lg font-bold text-gray-900">{regime}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Total Declared</p>
              <p className="text-lg font-bold text-teal-700">{formatCurrency(regime === 'OLD' ? totalDeclared : 0)}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Estimated Tax</p>
              <p className="text-lg font-bold text-red-700">{formatCurrency(regime === 'OLD' ? oldTax : newTax)}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Monthly TDS</p>
              <p className="text-lg font-bold text-blue-700">{formatCurrency(Math.round((regime === 'OLD' ? oldTax : newTax) / 12))}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <FileUp size={14} />
            <span>Investment proofs can be uploaded during the proof submission window (January - March).</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
