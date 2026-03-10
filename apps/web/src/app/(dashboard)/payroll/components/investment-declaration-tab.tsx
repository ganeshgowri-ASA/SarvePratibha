'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Shield,
  Heart,
  GraduationCap,
  HandHeart,
  Home,
  Plane,
  Upload,
  FileText,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Calculator,
} from 'lucide-react';

function formatCurrency(amount: number): string {
  return '\u20B9' + amount.toLocaleString('en-IN');
}

interface InvestmentItem {
  id: string;
  name: string;
  declared: number;
  actual: number;
  maxLimit: number;
  proofUploaded: boolean;
}

const INITIAL_80C: InvestmentItem[] = [
  { id: 'ppf', name: 'PPF', declared: 50000, actual: 50000, maxLimit: 150000, proofUploaded: true },
  { id: 'elss', name: 'ELSS Mutual Funds', declared: 50000, actual: 36000, maxLimit: 150000, proofUploaded: true },
  { id: 'lic', name: 'LIC Premium', declared: 24000, actual: 24000, maxLimit: 150000, proofUploaded: true },
  { id: 'nsc', name: 'NSC', declared: 0, actual: 0, maxLimit: 150000, proofUploaded: false },
  { id: 'tuition', name: 'Tuition Fees', declared: 26000, actual: 26000, maxLimit: 150000, proofUploaded: true },
];

const INITIAL_80D = [
  { id: 'self_insurance', name: 'Self & Family Insurance', declared: 18000, actual: 18000, maxLimit: 25000, proofUploaded: true },
  { id: 'parent_insurance', name: 'Parents Insurance', declared: 7000, actual: 7000, maxLimit: 50000, proofUploaded: true },
];

const INITIAL_HRA = {
  monthlyRent: 15000,
  isMetroCity: true,
  monthsLived: 11,
  basicSalary: 42500,
  hraReceived: 17000,
};

export default function InvestmentDeclarationTab() {
  const [items80C, setItems80C] = useState(INITIAL_80C);
  const [items80D] = useState(INITIAL_80D);
  const [educationLoan80E] = useState({ declared: 0, actual: 0, maxLimit: Infinity });
  const [donations80G] = useState({ declared: 10000, actual: 5000, maxLimit: Infinity });
  const [hraData] = useState(INITIAL_HRA);
  const [ltaClaim] = useState({ declared: 30000, actual: 0 });
  const [isLocked, setIsLocked] = useState(false);
  const [showHraCalc, setShowHraCalc] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const total80CDeclared = items80C.reduce((sum, i) => sum + i.declared, 0);
  const total80CActual = items80C.reduce((sum, i) => sum + i.actual, 0);
  const total80DDeclared = items80D.reduce((sum, i) => sum + i.declared, 0);
  const total80DActual = items80D.reduce((sum, i) => sum + i.actual, 0);

  // HRA Calculation
  const actualHRA = hraData.hraReceived * 12;
  const rentMinus10Basic = (hraData.monthlyRent * hraData.monthsLived) - (0.1 * hraData.basicSalary * 12);
  const metroPercent = hraData.isMetroCity ? 0.5 : 0.4;
  const percentBasic = metroPercent * hraData.basicSalary * 12;
  const hraExemption = Math.min(actualHRA, Math.max(0, rentMinus10Basic), percentBasic);

  const allItems = [
    { section: '80C', declared: Math.min(total80CDeclared, 150000), actual: Math.min(total80CActual, 150000) },
    { section: '80D', declared: total80DDeclared, actual: total80DActual },
    { section: '80E', declared: educationLoan80E.declared, actual: educationLoan80E.actual },
    { section: '80G', declared: donations80G.declared, actual: donations80G.actual },
    { section: 'HRA', declared: Math.round(hraExemption), actual: Math.round(hraExemption) },
    { section: 'LTA', declared: ltaClaim.declared, actual: ltaClaim.actual },
  ];

  const totalDeclared = allItems.reduce((s, i) => s + i.declared, 0);
  const totalActual = allItems.reduce((s, i) => s + i.actual, 0);

  const handleUpdate80C = (id: string, field: 'declared' | 'actual', value: number) => {
    if (isLocked) return;
    setItems80C(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className={`p-3 rounded-lg flex items-center justify-between ${isLocked ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
        <div className="flex items-center gap-2">
          {isLocked ? (
            <>
              <Lock size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-800">Declaration submitted & locked for FY 2025-26</span>
            </>
          ) : (
            <>
              <AlertTriangle size={16} className="text-amber-600" />
              <span className="text-sm font-medium text-amber-800">Declaration in draft - submit before deadline (Jan 31, 2026)</span>
            </>
          )}
        </div>
        {!isLocked ? (
          <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => setShowSubmitDialog(true)}>
            <Lock size={14} className="mr-1" /> Submit & Lock
          </Button>
        ) : (
          <Badge className="bg-green-100 text-green-700">Approved</Badge>
        )}
      </div>

      {/* Section 80C */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield size={18} className="text-blue-600" />
              Section 80C - Investments & Savings
            </CardTitle>
            <div className="text-right">
              <p className="text-xs text-gray-500">Utilized</p>
              <p className="text-sm font-semibold text-blue-700">{formatCurrency(Math.min(total80CDeclared, 150000))} / {formatCurrency(150000)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={Math.min((total80CDeclared / 150000) * 100, 100)} className="h-2 mb-4" />
          <div className="space-y-3">
            {items80C.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-3">
                  <p className="text-sm text-gray-700">{item.name}</p>
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    value={item.declared}
                    onChange={(e) => handleUpdate80C(item.id, 'declared', Number(e.target.value))}
                    disabled={isLocked}
                    className="text-sm"
                    placeholder="Declared"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    value={item.actual}
                    onChange={(e) => handleUpdate80C(item.id, 'actual', Number(e.target.value))}
                    disabled={isLocked}
                    className="text-sm"
                    placeholder="Actual"
                  />
                </div>
                <div className="col-span-2 flex items-center gap-1">
                  {item.proofUploaded ? (
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      <CheckCircle2 size={10} className="mr-0.5" /> Proof
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm" className="text-xs h-7" disabled={isLocked}>
                      <Upload size={12} className="mr-1" /> Upload
                    </Button>
                  )}
                </div>
                <div className="col-span-1 text-right">
                  {item.declared !== item.actual && (
                    <span className={`text-xs font-medium ${item.actual < item.declared ? 'text-red-600' : 'text-green-600'}`}>
                      {item.actual < item.declared ? '-' : '+'}{formatCurrency(Math.abs(item.declared - item.actual))}
                    </span>
                  )}
                </div>
              </div>
            ))}
            <Separator />
            <div className="grid grid-cols-12 gap-3 items-center font-semibold">
              <div className="col-span-3 text-sm">Total 80C</div>
              <div className="col-span-3 text-sm text-blue-700">{formatCurrency(Math.min(total80CDeclared, 150000))}</div>
              <div className="col-span-3 text-sm text-blue-700">{formatCurrency(Math.min(total80CActual, 150000))}</div>
              <div className="col-span-3"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 80D */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Heart size={18} className="text-red-500" />
            Section 80D - Medical Insurance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items80D.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{item.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">Declared: <span className="font-medium">{formatCurrency(item.declared)}</span></span>
                  <span className="text-gray-600">Actual: <span className="font-medium">{formatCurrency(item.actual)}</span></span>
                  {item.proofUploaded && (
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      <CheckCircle2 size={10} className="mr-0.5" /> Proof
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold text-sm">
              <span>Total 80D</span>
              <span className="text-red-600">{formatCurrency(total80DDeclared)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 80E & 80G */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap size={18} className="text-indigo-600" />
              Section 80E - Education Loan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Interest on Education Loan</span>
                <span className="font-medium">{formatCurrency(educationLoan80E.declared)}</span>
              </div>
              <p className="text-xs text-gray-500">No upper limit. Deduction available for up to 8 years.</p>
              {educationLoan80E.declared === 0 && (
                <div className="bg-gray-50 rounded p-2 text-xs text-gray-500">No education loan declared</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <HandHeart size={18} className="text-pink-600" />
              Section 80G - Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Charitable Donations</span>
                <span className="font-medium">{formatCurrency(donations80G.declared)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Actual Submitted</span>
                <span className={`font-medium ${donations80G.actual < donations80G.declared ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(donations80G.actual)}
                </span>
              </div>
              {donations80G.actual < donations80G.declared && (
                <div className="bg-amber-50 rounded p-2 text-xs text-amber-700 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  Variance of {formatCurrency(donations80G.declared - donations80G.actual)} - please upload receipts
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* HRA Exemption */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Home size={18} className="text-orange-600" />
              HRA Exemption
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowHraCalc(true)}>
              <Calculator size={14} className="mr-1" /> View Calculation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <p className="text-xs text-orange-600">Monthly Rent</p>
              <p className="text-lg font-bold text-orange-900">{formatCurrency(hraData.monthlyRent)}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <p className="text-xs text-orange-600">City Type</p>
              <p className="text-lg font-bold text-orange-900">{hraData.isMetroCity ? 'Metro' : 'Non-Metro'}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <p className="text-xs text-orange-600">Months Claimed</p>
              <p className="text-lg font-bold text-orange-900">{hraData.monthsLived}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-xs text-green-600">HRA Exemption</p>
              <p className="text-lg font-bold text-green-900">{formatCurrency(Math.round(hraExemption))}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Badge className="bg-green-100 text-green-700 text-xs">
              <CheckCircle2 size={10} className="mr-0.5" /> Rent receipts uploaded
            </Badge>
            <Button variant="ghost" size="sm" className="text-teal-600 text-xs">
              <Eye size={12} className="mr-1" /> View Receipts
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* LTA Claim */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Plane size={18} className="text-sky-600" />
            LTA - Leave Travel Allowance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-gray-700">Declared: <span className="font-medium">{formatCurrency(ltaClaim.declared)}</span></p>
              <p className="text-gray-700 mt-1">Actual: <span className="font-medium">{formatCurrency(ltaClaim.actual)}</span></p>
            </div>
            <div className="flex items-center gap-2">
              {ltaClaim.actual === 0 ? (
                <Button variant="outline" size="sm" disabled={isLocked}>
                  <Upload size={14} className="mr-1" /> Upload Travel Proof
                </Button>
              ) : (
                <Badge className="bg-green-100 text-green-700 text-xs">
                  <CheckCircle2 size={10} className="mr-0.5" /> Proof Uploaded
                </Badge>
              )}
            </div>
          </div>
          {ltaClaim.actual === 0 && ltaClaim.declared > 0 && (
            <div className="mt-2 bg-amber-50 rounded p-2 text-xs text-amber-700 flex items-center gap-1">
              <AlertTriangle size={12} />
              Travel proof pending. Submit before proof submission deadline.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Declaration vs Actual Comparison */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText size={18} className="text-teal-600" />
            Declaration vs Actual - Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider pb-2 border-b">
              <span>Section</span>
              <span className="text-right">Declared</span>
              <span className="text-right">Actual</span>
              <span className="text-right">Variance</span>
            </div>
            {allItems.map((item) => {
              const variance = item.actual - item.declared;
              return (
                <div key={item.section} className="grid grid-cols-4 gap-2 text-sm py-1.5">
                  <span className="text-gray-700 font-medium">{item.section}</span>
                  <span className="text-right">{formatCurrency(item.declared)}</span>
                  <span className="text-right">{formatCurrency(item.actual)}</span>
                  <span className={`text-right font-medium ${variance < 0 ? 'text-red-600 bg-red-50' : variance > 0 ? 'text-green-600 bg-green-50' : 'text-gray-500'} rounded px-1`}>
                    {variance !== 0 ? (variance > 0 ? '+' : '') + formatCurrency(variance) : '-'}
                  </span>
                </div>
              );
            })}
            <Separator />
            <div className="grid grid-cols-4 gap-2 text-sm font-semibold pt-1">
              <span>Total</span>
              <span className="text-right">{formatCurrency(totalDeclared)}</span>
              <span className="text-right">{formatCurrency(totalActual)}</span>
              <span className={`text-right ${totalActual - totalDeclared < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {totalActual - totalDeclared !== 0 ? formatCurrency(totalActual - totalDeclared) : '-'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HRA Calculator Dialog */}
      <Dialog open={showHraCalc} onOpenChange={setShowHraCalc}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>HRA Exemption Calculation</DialogTitle>
            <DialogDescription>Minimum of the following three is exempt</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">1. Actual HRA received</span>
              <span className="font-medium">{formatCurrency(actualHRA)}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">2. Rent paid - 10% of Basic</span>
              <span className="font-medium">{formatCurrency(Math.max(0, rentMinus10Basic))}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">3. {hraData.isMetroCity ? '50%' : '40%'} of Basic Salary</span>
              <span className="font-medium">{formatCurrency(percentBasic)}</span>
            </div>
            <Separator />
            <div className="flex justify-between p-2 bg-green-50 rounded font-semibold">
              <span className="text-green-800">HRA Exemption (Minimum)</span>
              <span className="text-green-700">{formatCurrency(Math.round(hraExemption))}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Submit Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Declaration</DialogTitle>
            <DialogDescription>
              Once submitted, you cannot modify the declaration. It will be sent for manager approval.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="bg-amber-50 p-3 rounded text-amber-800 text-xs">
              Please ensure all proofs are uploaded before submitting. Missing proofs may result in rejection.
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Declared Deductions</span>
              <span className="font-semibold">{formatCurrency(totalDeclared)}</span>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
              <Button className="flex-1 bg-teal-600 hover:bg-teal-700" onClick={() => { setIsLocked(true); setShowSubmitDialog(false); }}>
                <Lock size={14} className="mr-1" /> Submit & Lock
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
