'use client';

import { useState, useRef } from 'react';
import {
  Plus,
  Send,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Download,
  Building2,
  MapPin,
  Calendar as CalendarIcon,
  User,
  IndianRupee,
  Printer,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { OFFER_STATUS_LABELS } from '@sarve-pratibha/shared';

// ── Types ────────────────────────────────────────────────────────────────────

interface OfferCTC {
  basic: number;
  hra: number;
  specialAllowance: number;
  conveyance: number;
  otherAllowance: number;
  pfContribution: number;
  gratuity: number;
  variablePay: number;
  professionalTax: number;
  tds: number;
}

interface Offer {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  designation: string;
  department: string;
  grossSalary: number;
  netSalary: number;
  joiningDate: string;
  status: string;
  validUntil?: string;
  createdBy: string;
  createdAt: string;
  reportingManager: string;
  workLocation: string;
  ctc: OfferCTC;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_OFFERS: Offer[] = [
  {
    id: '1',
    candidateName: 'Vivek Gupta',
    candidateEmail: 'vivek.gupta@email.com',
    jobTitle: 'Senior Software Engineer',
    designation: 'SSE',
    department: 'Engineering',
    grossSalary: 2000000,
    netSalary: 1600000,
    joiningDate: '2026-04-01T00:00:00Z',
    status: 'SENT',
    validUntil: '2026-03-20T00:00:00Z',
    createdBy: 'Priya Sharma',
    createdAt: '2026-03-06T00:00:00Z',
    reportingManager: 'Priya Sharma',
    workLocation: 'Mumbai, Maharashtra',
    ctc: {
      basic: 800000,
      hra: 400000,
      specialAllowance: 360000,
      conveyance: 19200,
      otherAllowance: 20800,
      pfContribution: 96000,
      gratuity: 38462,
      variablePay: 200000,
      professionalTax: 2400,
      tds: 340000,
    },
  },
  {
    id: '2',
    candidateName: 'Priyanka Das',
    candidateEmail: 'priyanka.das@email.com',
    jobTitle: 'Senior Software Engineer',
    designation: 'SSE',
    department: 'Engineering',
    grossSalary: 1800000,
    netSalary: 1440000,
    joiningDate: '2026-03-15T00:00:00Z',
    status: 'ACCEPTED',
    createdBy: 'Priya Sharma',
    createdAt: '2026-02-20T00:00:00Z',
    reportingManager: 'Vikram Singh',
    workLocation: 'Pune, Maharashtra',
    ctc: {
      basic: 720000,
      hra: 360000,
      specialAllowance: 324000,
      conveyance: 19200,
      otherAllowance: 16800,
      pfContribution: 86400,
      gratuity: 34615,
      variablePay: 180000,
      professionalTax: 2400,
      tds: 280000,
    },
  },
  {
    id: '3',
    candidateName: 'Meera Krishnan',
    candidateEmail: 'meera.krishnan@email.com',
    jobTitle: 'Product Manager',
    designation: 'PM',
    department: 'Product',
    grossSalary: 2500000,
    netSalary: 2000000,
    joiningDate: '2026-04-15T00:00:00Z',
    status: 'DRAFT',
    createdBy: 'Amit Patel',
    createdAt: '2026-03-08T00:00:00Z',
    reportingManager: 'Rajesh Kumar',
    workLocation: 'Mumbai, Maharashtra',
    ctc: {
      basic: 1000000,
      hra: 500000,
      specialAllowance: 450000,
      conveyance: 19200,
      otherAllowance: 30800,
      pfContribution: 120000,
      gratuity: 48077,
      variablePay: 250000,
      professionalTax: 2400,
      tds: 450000,
    },
  },
  {
    id: '4',
    candidateName: 'Karthik Reddy',
    candidateEmail: 'karthik.reddy@email.com',
    jobTitle: 'Full Stack Developer',
    designation: 'SDE II',
    department: 'Engineering',
    grossSalary: 1500000,
    netSalary: 1200000,
    joiningDate: '2026-04-01T00:00:00Z',
    status: 'PENDING_APPROVAL',
    createdBy: 'Vikram Singh',
    createdAt: '2026-03-07T00:00:00Z',
    reportingManager: 'Priya Sharma',
    workLocation: 'Bangalore, Karnataka',
    ctc: {
      basic: 600000,
      hra: 300000,
      specialAllowance: 270000,
      conveyance: 19200,
      otherAllowance: 10800,
      pfContribution: 72000,
      gratuity: 28846,
      variablePay: 150000,
      professionalTax: 2400,
      tds: 200000,
    },
  },
  {
    id: '5',
    candidateName: 'Amit Tiwari',
    candidateEmail: 'amit.tiwari@email.com',
    jobTitle: 'Junior Developer',
    designation: 'SDE I',
    department: 'Engineering',
    grossSalary: 800000,
    netSalary: 640000,
    joiningDate: '2026-04-01T00:00:00Z',
    status: 'REJECTED',
    createdBy: 'Priya Sharma',
    createdAt: '2026-02-25T00:00:00Z',
    reportingManager: 'Vikram Singh',
    workLocation: 'Pune, Maharashtra',
    ctc: {
      basic: 320000,
      hra: 160000,
      specialAllowance: 144000,
      conveyance: 19200,
      otherAllowance: 6800,
      pfContribution: 38400,
      gratuity: 15385,
      variablePay: 80000,
      professionalTax: 2400,
      tds: 60000,
    },
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getOfferStatusVariant(status: string) {
  const map: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    DRAFT: 'secondary',
    PENDING_APPROVAL: 'outline',
    APPROVED: 'default',
    SENT: 'default',
    ACCEPTED: 'default',
    REJECTED: 'destructive',
    WITHDRAWN: 'destructive',
    EXPIRED: 'secondary',
  };
  return map[status] || 'secondary';
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatLPA(amount: number): string {
  return `₹${(amount / 100000).toFixed(1)}L`;
}

// ── Offer Letter PDF Template ────────────────────────────────────────────────

function OfferLetterTemplate({ offer }: { offer: Offer }) {
  const totalEarnings = offer.ctc.basic + offer.ctc.hra + offer.ctc.specialAllowance +
    offer.ctc.conveyance + offer.ctc.otherAllowance;
  const totalBenefits = offer.ctc.pfContribution + offer.ctc.gratuity;
  const totalDeductions = offer.ctc.professionalTax + offer.ctc.tds;
  const totalCtc = totalEarnings + totalBenefits + offer.ctc.variablePay;

  return (
    <div className="bg-white p-8 max-w-3xl mx-auto font-serif text-gray-900" id="offer-letter-content">
      {/* Company Header */}
      <div className="border-b-4 border-teal-600 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-lg bg-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">SP</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-teal-700">SarvePratibha Technologies</h1>
              <p className="text-sm text-gray-500">Excellence in Human Capital Management</p>
            </div>
          </div>
          <div className="text-right text-xs text-gray-500">
            <p>CIN: U72200MH2024PTC123456</p>
            <p>Plot No. 42, Sector 15, BKC</p>
            <p>Mumbai, Maharashtra 400051</p>
          </div>
        </div>
      </div>

      {/* Date & Ref */}
      <div className="flex justify-between mb-6 text-sm">
        <p>
          <span className="font-semibold">Date:</span>{' '}
          {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
        <p>
          <span className="font-semibold">Ref:</span> SP/OFFER/{new Date().getFullYear()}/{offer.id.padStart(4, '0')}
        </p>
      </div>

      {/* Recipient */}
      <div className="mb-6">
        <p className="font-semibold mb-1">Dear {offer.candidateName},</p>
        <p className="text-sm leading-relaxed">
          We are pleased to extend this offer of employment for the position of{' '}
          <strong>{offer.jobTitle}</strong> in the <strong>{offer.department}</strong> department at
          SarvePratibha Technologies. Based on our interview process, we believe your skills and
          experience will be a valuable addition to our team.
        </p>
      </div>

      {/* Employment Details */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-teal-700 border-b border-gray-200 pb-1 mb-3">
          Employment Details
        </h2>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-teal-600" />
            <span className="text-gray-500">Position:</span>
          </div>
          <p className="font-medium">{offer.jobTitle} ({offer.designation})</p>

          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-teal-600" />
            <span className="text-gray-500">Department:</span>
          </div>
          <p className="font-medium">{offer.department}</p>

          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-teal-600" />
            <span className="text-gray-500">Joining Date:</span>
          </div>
          <p className="font-medium">
            {new Date(offer.joiningDate).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'long', year: 'numeric',
            })}
          </p>

          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-teal-600" />
            <span className="text-gray-500">Reporting Manager:</span>
          </div>
          <p className="font-medium">{offer.reportingManager}</p>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-teal-600" />
            <span className="text-gray-500">Work Location:</span>
          </div>
          <p className="font-medium">{offer.workLocation}</p>
        </div>
      </div>

      {/* CTC Breakdown */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-teal-700 border-b border-gray-200 pb-1 mb-3">
          Compensation Details (Annual)
        </h2>
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-teal-50">
              <th className="text-left px-4 py-2 font-semibold border-b">Component</th>
              <th className="text-right px-4 py-2 font-semibold border-b">Annual (₹)</th>
              <th className="text-right px-4 py-2 font-semibold border-b">Monthly (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-50">
              <td colSpan={3} className="px-4 py-1.5 font-semibold text-teal-700 border-b">Earnings</td>
            </tr>
            {[
              { label: 'Basic Salary', amount: offer.ctc.basic },
              { label: 'House Rent Allowance (HRA)', amount: offer.ctc.hra },
              { label: 'Special Allowance', amount: offer.ctc.specialAllowance },
              { label: 'Conveyance Allowance', amount: offer.ctc.conveyance },
              { label: 'Other Allowance', amount: offer.ctc.otherAllowance },
            ].map((item) => (
              <tr key={item.label} className="border-b">
                <td className="px-4 py-1.5">{item.label}</td>
                <td className="text-right px-4 py-1.5">{formatCurrency(item.amount)}</td>
                <td className="text-right px-4 py-1.5">{formatCurrency(Math.round(item.amount / 12))}</td>
              </tr>
            ))}
            <tr className="border-b font-semibold bg-gray-50">
              <td className="px-4 py-1.5">Total Earnings (A)</td>
              <td className="text-right px-4 py-1.5">{formatCurrency(totalEarnings)}</td>
              <td className="text-right px-4 py-1.5">{formatCurrency(Math.round(totalEarnings / 12))}</td>
            </tr>

            <tr className="bg-gray-50">
              <td colSpan={3} className="px-4 py-1.5 font-semibold text-teal-700 border-b">Employer Benefits</td>
            </tr>
            {[
              { label: 'Provident Fund (Employer)', amount: offer.ctc.pfContribution },
              { label: 'Gratuity', amount: offer.ctc.gratuity },
            ].map((item) => (
              <tr key={item.label} className="border-b">
                <td className="px-4 py-1.5">{item.label}</td>
                <td className="text-right px-4 py-1.5">{formatCurrency(item.amount)}</td>
                <td className="text-right px-4 py-1.5">{formatCurrency(Math.round(item.amount / 12))}</td>
              </tr>
            ))}
            <tr className="border-b font-semibold bg-gray-50">
              <td className="px-4 py-1.5">Total Benefits (B)</td>
              <td className="text-right px-4 py-1.5">{formatCurrency(totalBenefits)}</td>
              <td className="text-right px-4 py-1.5">{formatCurrency(Math.round(totalBenefits / 12))}</td>
            </tr>

            <tr className="bg-gray-50">
              <td colSpan={3} className="px-4 py-1.5 font-semibold text-teal-700 border-b">Variable Pay</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-1.5">Performance Bonus / Variable Pay</td>
              <td className="text-right px-4 py-1.5">{formatCurrency(offer.ctc.variablePay)}</td>
              <td className="text-right px-4 py-1.5">-</td>
            </tr>

            <tr className="bg-teal-50 font-bold text-teal-800">
              <td className="px-4 py-2">Total CTC (A + B + Variable)</td>
              <td className="text-right px-4 py-2">{formatCurrency(totalCtc)}</td>
              <td className="text-right px-4 py-2">{formatCurrency(Math.round(totalCtc / 12))}</td>
            </tr>

            <tr className="bg-gray-50">
              <td colSpan={3} className="px-4 py-1.5 font-semibold text-red-700 border-b border-t">Deductions (Estimated)</td>
            </tr>
            {[
              { label: 'Professional Tax', amount: offer.ctc.professionalTax },
              { label: 'Tax Deducted at Source (TDS)', amount: offer.ctc.tds },
            ].map((item) => (
              <tr key={item.label} className="border-b">
                <td className="px-4 py-1.5">{item.label}</td>
                <td className="text-right px-4 py-1.5">{formatCurrency(item.amount)}</td>
                <td className="text-right px-4 py-1.5">{formatCurrency(Math.round(item.amount / 12))}</td>
              </tr>
            ))}
            <tr className="border-b font-semibold bg-red-50 text-red-800">
              <td className="px-4 py-1.5">Total Deductions</td>
              <td className="text-right px-4 py-1.5">{formatCurrency(totalDeductions)}</td>
              <td className="text-right px-4 py-1.5">{formatCurrency(Math.round(totalDeductions / 12))}</td>
            </tr>

            <tr className="bg-green-50 font-bold text-green-800">
              <td className="px-4 py-2">Estimated In-Hand (Monthly)</td>
              <td className="text-right px-4 py-2">-</td>
              <td className="text-right px-4 py-2">
                {formatCurrency(Math.round((totalEarnings - totalDeductions - offer.ctc.pfContribution) / 12))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Terms */}
      <div className="mb-6 text-sm leading-relaxed space-y-2">
        <h2 className="text-lg font-bold text-teal-700 border-b border-gray-200 pb-1 mb-3">
          Terms & Conditions
        </h2>
        <p>1. This offer is valid until{' '}
          {offer.validUntil
            ? new Date(offer.validUntil).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
            : '15 days from the date of this letter'
          }.
        </p>
        <p>2. Your employment will be governed by the company&#39;s policies and procedures as amended from time to time.</p>
        <p>3. You will be on probation for a period of 6 months from the date of joining.</p>
        <p>4. During probation, either party may terminate employment with 30 days written notice.</p>
        <p>5. This offer is contingent upon successful completion of background verification.</p>
        <p>6. You agree to maintain confidentiality of all company information and trade secrets.</p>
      </div>

      {/* Signature */}
      <div className="grid grid-cols-2 gap-8 mt-10">
        <div>
          <div className="border-t border-gray-300 pt-2">
            <p className="font-semibold text-sm">For SarvePratibha Technologies</p>
            <p className="text-xs text-gray-500 mt-4">Authorized Signatory</p>
            <p className="text-sm mt-1">{offer.createdBy}</p>
            <p className="text-xs text-gray-500">HR Department</p>
          </div>
        </div>
        <div>
          <div className="border-t border-gray-300 pt-2">
            <p className="font-semibold text-sm">Candidate Acceptance</p>
            <p className="text-xs text-gray-500 mt-4">Signature & Date</p>
            <p className="text-sm mt-1">{offer.candidateName}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-400 text-center">
        <p>SarvePratibha Technologies Pvt. Ltd. | CIN: U72200MH2024PTC123456</p>
        <p>Plot No. 42, Sector 15, BKC, Mumbai, Maharashtra 400051 | hr@sarvepratibha.com | +91-22-4000-1234</p>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function OffersPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showOfferLetter, setShowOfferLetter] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const filtered = MOCK_OFFERS.filter((o) => !statusFilter || statusFilter === 'ALL' || o.status === statusFilter);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Offer Letter - ${selectedOffer?.candidateName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Georgia, 'Times New Roman', serif; color: #111; padding: 40px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { padding: 6px 12px; border: 1px solid #e5e7eb; font-size: 12px; }
            th { background: #f0fdfa; font-weight: 600; }
            h1 { font-size: 22px; color: #0d9488; }
            h2 { font-size: 16px; color: #0d9488; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 10px; }
            .header { border-bottom: 4px solid #0d9488; padding-bottom: 16px; margin-bottom: 20px; }
            .logo { display: inline-flex; align-items: center; justify-content: center; width: 50px; height: 50px; background: #0d9488; color: white; font-weight: bold; font-size: 18px; border-radius: 8px; margin-right: 12px; float: left; }
            .section { margin-bottom: 20px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
            .label { color: #6b7280; }
            .bold { font-weight: 600; }
            .total-row { background: #f0fdfa; font-weight: bold; color: #115e59; }
            .deduction-row { background: #fef2f2; font-weight: 600; color: #991b1b; }
            .inhand-row { background: #f0fdf4; font-weight: bold; color: #166534; }
            .signature { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin-top: 60px; }
            .signature > div { border-top: 1px solid #d1d5db; padding-top: 8px; }
            .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 10px; color: #9ca3af; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <script>window.print(); window.close();<\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offer Management</h1>
          <p className="text-gray-500 mt-1">Create, track, and manage offer letters</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Offer
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Draft', count: MOCK_OFFERS.filter((o) => o.status === 'DRAFT').length, color: 'text-gray-600' },
          { label: 'Pending', count: MOCK_OFFERS.filter((o) => o.status === 'PENDING_APPROVAL').length, color: 'text-yellow-600' },
          { label: 'Sent', count: MOCK_OFFERS.filter((o) => o.status === 'SENT').length, color: 'text-blue-600' },
          { label: 'Accepted', count: MOCK_OFFERS.filter((o) => o.status === 'ACCEPTED').length, color: 'text-green-600' },
          { label: 'Rejected', count: MOCK_OFFERS.filter((o) => o.status === 'REJECTED').length, color: 'text-red-600' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-4 pb-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
          <SelectTrigger className="w-48"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {Object.entries(OFFER_STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label as string}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Offers Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Candidate</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Position</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">CTC</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Joining Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Created</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((offer) => (
                  <tr key={offer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium">{offer.candidateName}</p>
                      <p className="text-xs text-gray-400">{offer.candidateEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{offer.designation}</p>
                      <p className="text-xs text-gray-400">{offer.department}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{formatLPA(offer.grossSalary)}</p>
                      <p className="text-xs text-gray-400">Net: {formatLPA(offer.netSalary)}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(offer.joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getOfferStatusVariant(offer.status)}>
                        {OFFER_STATUS_LABELS[offer.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(offer.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      <br />{offer.createdBy}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="View Details"
                          onClick={() => { setSelectedOffer(offer); setShowDetailDialog(true); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-teal-600"
                          title="View Offer Letter"
                          onClick={() => { setSelectedOffer(offer); setShowOfferLetter(true); }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        {offer.status === 'APPROVED' && (
                          <Button variant="ghost" size="sm" className="text-blue-600" title="Send Offer">
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        {offer.status === 'PENDING_APPROVAL' && (
                          <>
                            <Button variant="ghost" size="sm" className="text-green-600" title="Approve">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600" title="Reject">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Offer Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Offer Letter</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); setShowCreateDialog(false); }}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2">
                <Label>Application *</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select Application" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="app1">Arjun Mehta - Senior SE</SelectItem>
                    <SelectItem value="app2">Lakshmi Rao - Senior SE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Designation *</Label>
                <Input required placeholder="e.g. Senior Software Engineer" />
              </div>
              <div>
                <Label>Department *</Label>
                <Input required placeholder="e.g. Engineering" />
              </div>
              <div>
                <Label>Reporting Manager *</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select Manager" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emp1">Priya Sharma</SelectItem>
                    <SelectItem value="emp2">Vikram Singh</SelectItem>
                    <SelectItem value="emp3">Rajesh Kumar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Work Location *</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select Location" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mumbai">Mumbai, Maharashtra</SelectItem>
                    <SelectItem value="pune">Pune, Maharashtra</SelectItem>
                    <SelectItem value="bangalore">Bangalore, Karnataka</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad, Telangana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Joining Date *</Label>
                <Input type="date" required />
              </div>
              <div>
                <Label>Valid Until</Label>
                <Input type="date" />
              </div>

              {/* CTC Breakup */}
              <div className="col-span-2 border-t pt-4">
                <p className="font-medium text-sm mb-1 flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-teal-600" />
                  CTC Breakup (Annual)
                </p>
                <p className="text-xs text-gray-500 mb-3">Enter annual amounts. Monthly equivalents will be calculated automatically.</p>
              </div>

              <div className="col-span-2 bg-gray-50 rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide">Earnings</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Basic Salary *</Label>
                    <Input type="number" min="0" required placeholder="e.g. 800000" />
                  </div>
                  <div>
                    <Label className="text-xs">HRA</Label>
                    <Input type="number" min="0" defaultValue="0" />
                  </div>
                  <div>
                    <Label className="text-xs">Special Allowance</Label>
                    <Input type="number" min="0" defaultValue="0" />
                  </div>
                  <div>
                    <Label className="text-xs">Conveyance Allowance</Label>
                    <Input type="number" min="0" defaultValue="19200" />
                  </div>
                </div>
              </div>

              <div className="col-span-2 bg-gray-50 rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide">Benefits & Variable</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">PF Contribution (Employer)</Label>
                    <Input type="number" min="0" defaultValue="0" />
                  </div>
                  <div>
                    <Label className="text-xs">Gratuity</Label>
                    <Input type="number" min="0" defaultValue="0" />
                  </div>
                  <div>
                    <Label className="text-xs">Variable Pay / Bonus</Label>
                    <Input type="number" min="0" defaultValue="0" />
                  </div>
                </div>
              </div>

              <div className="col-span-2 bg-gray-50 rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">Deductions (Estimated)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Professional Tax</Label>
                    <Input type="number" min="0" defaultValue="2400" />
                  </div>
                  <div>
                    <Label className="text-xs">TDS (Estimated)</Label>
                    <Input type="number" min="0" defaultValue="0" />
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <Label>Additional Benefits / Notes</Label>
                <Textarea rows={2} placeholder="Medical insurance, stock options, relocation allowance, etc." />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button type="submit" variant="outline">Save Draft</Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">Submit for Approval</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Offer Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Offer Details</DialogTitle>
          </DialogHeader>
          {selectedOffer && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400">Candidate</p>
                  <p className="font-medium">{selectedOffer.candidateName}</p>
                  <p className="text-xs text-gray-500">{selectedOffer.candidateEmail}</p>
                </div>
                <div>
                  <p className="text-gray-400">Position</p>
                  <p className="font-medium">{selectedOffer.designation} · {selectedOffer.department}</p>
                </div>
                <div>
                  <p className="text-gray-400">Reporting Manager</p>
                  <p className="font-medium">{selectedOffer.reportingManager}</p>
                </div>
                <div>
                  <p className="text-gray-400">Work Location</p>
                  <p className="font-medium">{selectedOffer.workLocation}</p>
                </div>
                <div>
                  <p className="text-gray-400">Joining Date</p>
                  <p className="font-medium">{new Date(selectedOffer.joiningDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <Badge variant={getOfferStatusVariant(selectedOffer.status)}>
                    {OFFER_STATUS_LABELS[selectedOffer.status]}
                  </Badge>
                </div>
              </div>

              {/* CTC Summary */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-sm mb-3">CTC Breakdown (Annual)</h4>
                <div className="space-y-1.5 text-sm">
                  {[
                    { label: 'Basic', amount: selectedOffer.ctc.basic },
                    { label: 'HRA', amount: selectedOffer.ctc.hra },
                    { label: 'Special Allowance', amount: selectedOffer.ctc.specialAllowance },
                    { label: 'Conveyance', amount: selectedOffer.ctc.conveyance },
                    { label: 'PF (Employer)', amount: selectedOffer.ctc.pfContribution },
                    { label: 'Gratuity', amount: selectedOffer.ctc.gratuity },
                    { label: 'Variable Pay', amount: selectedOffer.ctc.variablePay },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-medium">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t pt-2 font-semibold text-teal-700">
                    <span>Gross CTC</span>
                    <span>{formatCurrency(selectedOffer.grossSalary)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => { setShowDetailDialog(false); setShowOfferLetter(true); }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Offer Letter
                </Button>
                <Button
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                  onClick={() => {
                    setShowDetailDialog(false);
                    setShowOfferLetter(true);
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Generate PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Offer Letter View Dialog */}
      <Dialog open={showOfferLetter} onOpenChange={setShowOfferLetter}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Offer Letter Preview</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                >
                  <Printer className="mr-1 h-4 w-4" />
                  Print / Save PDF
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedOffer && (
            <div ref={printRef}>
              <OfferLetterTemplate offer={selectedOffer} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
