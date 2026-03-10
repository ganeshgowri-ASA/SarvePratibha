'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  FileText, ShieldCheck, IndianRupee, Users, CheckCircle, Clock, XCircle, ChevronRight,
  Plane, Train, Car, Hotel, Plus, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const POLICY_BY_GRADE = [
  {
    grade: 'L1 – Junior',
    flightClass: 'Economy',
    trainClass: '3AC',
    maxHotelPerNight: 2500,
    maxCabPerDay: 500,
    maxDomesticFlight: 8000,
    maxIntlFlight: null,
    perDiemDomestic: 1200,
    perDiemIntl: null,
    requiresPreApproval: false,
    approvalLevels: 1,
    advanceBookingDays: 7,
  },
  {
    grade: 'L2 – Associate',
    flightClass: 'Economy',
    trainClass: '2AC',
    maxHotelPerNight: 3500,
    maxCabPerDay: 700,
    maxDomesticFlight: 10000,
    maxIntlFlight: null,
    perDiemDomestic: 1500,
    perDiemIntl: null,
    requiresPreApproval: false,
    approvalLevels: 1,
    advanceBookingDays: 7,
  },
  {
    grade: 'L3 – Senior',
    flightClass: 'Economy',
    trainClass: '2AC',
    maxHotelPerNight: 5000,
    maxCabPerDay: 1000,
    maxDomesticFlight: 12000,
    maxIntlFlight: 60000,
    perDiemDomestic: 2000,
    perDiemIntl: 5000,
    requiresPreApproval: true,
    approvalLevels: 2,
    advanceBookingDays: 14,
  },
  {
    grade: 'L4 – Lead',
    flightClass: 'Economy / Business*',
    trainClass: '1AC',
    maxHotelPerNight: 8000,
    maxCabPerDay: 1500,
    maxDomesticFlight: 15000,
    maxIntlFlight: 90000,
    perDiemDomestic: 2500,
    perDiemIntl: 7000,
    requiresPreApproval: true,
    approvalLevels: 2,
    advanceBookingDays: 14,
  },
  {
    grade: 'L5 – Manager',
    flightClass: 'Business',
    trainClass: '1AC',
    maxHotelPerNight: 12000,
    maxCabPerDay: 2000,
    maxDomesticFlight: 20000,
    maxIntlFlight: 150000,
    perDiemDomestic: 3500,
    perDiemIntl: 10000,
    requiresPreApproval: true,
    approvalLevels: 2,
    advanceBookingDays: 21,
  },
  {
    grade: 'L6+ – Director & Above',
    flightClass: 'Business / First',
    trainClass: '1AC',
    maxHotelPerNight: 20000,
    maxCabPerDay: 3000,
    maxDomesticFlight: null,
    maxIntlFlight: null,
    perDiemDomestic: 5000,
    perDiemIntl: 15000,
    requiresPreApproval: false,
    approvalLevels: 1,
    advanceBookingDays: 0,
  },
];

const APPROVAL_REQUESTS = [
  {
    id: 'TR-2026-0041',
    requesterName: 'Arjun Mehta',
    department: 'Engineering',
    destination: 'San Francisco, USA',
    fromCity: 'Bengaluru',
    travelDates: '1 Apr – 5 Apr 2026',
    purpose: 'AWS re:Invent 2026',
    estimatedCost: 185000,
    breakdown: [
      { category: 'International Flight', amount: 115000 },
      { category: 'Hotel (4 nights)', amount: 52000 },
      { category: 'Local Transport', amount: 8000 },
      { category: 'Per Diem', amount: 10000 },
    ],
    status: 'MANAGER_APPROVED',
    approvals: [
      { level: 1, approverName: 'Sneha Kapoor', approverRole: 'Manager', status: 'APPROVED', date: '8 Mar 2026', remarks: 'Critical for cloud strategy' },
      { level: 2, approverName: 'Rajiv Nair', approverRole: 'Section Head', status: 'PENDING' },
      { level: 3, approverName: 'Finance Team', approverRole: 'Finance', status: 'PENDING' },
    ],
  },
  {
    id: 'TR-2026-0038',
    requesterName: 'Priya Sharma',
    department: 'Sales',
    destination: 'Delhi',
    fromCity: 'Bengaluru',
    travelDates: '18 Mar – 20 Mar 2026',
    purpose: 'Client Presentation – TechCorp Deal',
    estimatedCost: 32000,
    breakdown: [
      { category: 'Flight', amount: 12000 },
      { category: 'Hotel (2 nights)', amount: 14000 },
      { category: 'Local Transport', amount: 3000 },
      { category: 'Per Diem', amount: 3000 },
    ],
    status: 'SUBMITTED',
    approvals: [
      { level: 1, approverName: 'Kiran Desai', approverRole: 'Manager', status: 'PENDING' },
    ],
  },
  {
    id: 'TR-2026-0035',
    requesterName: 'Vikram Iyer',
    department: 'HR',
    destination: 'Pune',
    fromCity: 'Bengaluru',
    travelDates: '12 Mar – 14 Mar 2026',
    purpose: 'Recruitment Drive – Campus',
    estimatedCost: 18500,
    breakdown: [
      { category: 'Train (2AC)', amount: 3500 },
      { category: 'Hotel (2 nights)', amount: 10000 },
      { category: 'Local Transport', amount: 2000 },
      { category: 'Per Diem', amount: 3000 },
    ],
    status: 'COMPLETED',
    approvals: [
      { level: 1, approverName: 'Sneha Kapoor', approverRole: 'Manager', status: 'APPROVED', date: '5 Mar 2026' },
      { level: 2, approverName: 'HR Head', approverRole: 'Section Head', status: 'APPROVED', date: '6 Mar 2026' },
    ],
  },
];

const STATUS_STYLES: Record<string, string> = {
  SUBMITTED: 'bg-blue-100 text-blue-700',
  MANAGER_APPROVED: 'bg-green-100 text-green-700',
  SH_APPROVED: 'bg-teal-100 text-teal-700',
  FINANCE_APPROVED: 'bg-purple-100 text-purple-700',
  REJECTED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-gray-100 text-gray-700',
  APPROVED: 'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
};

const APPROVAL_ICON = {
  APPROVED: <CheckCircle size={14} className="text-green-600" />,
  PENDING: <Clock size={14} className="text-yellow-600" />,
  REJECTED: <XCircle size={14} className="text-red-600" />,
};

function NewRequestForm({ onClose }: { onClose: () => void }) {
  return (
    <Card className="border-teal-200 bg-teal-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-teal-800 flex items-center gap-2">
            <Plus size={16} />New Travel Request
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">From City</Label>
            <Input placeholder="Bengaluru" defaultValue="Bengaluru" />
          </div>
          <div>
            <Label className="text-xs">To City / Country</Label>
            <Input placeholder="Mumbai" />
          </div>
          <div>
            <Label className="text-xs">Travel Start Date</Label>
            <Input type="date" />
          </div>
          <div>
            <Label className="text-xs">Travel End Date</Label>
            <Input type="date" />
          </div>
          <div>
            <Label className="text-xs">Mode of Travel</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="flight">Flight</SelectItem>
                <SelectItem value="train">Train</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="cab">Cab only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Estimated Cost (₹)</Label>
            <Input type="number" placeholder="25000" />
          </div>
        </div>
        <div>
          <Label className="text-xs">Purpose of Travel</Label>
          <Textarea placeholder="Describe the business purpose..." rows={2} />
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-start gap-2">
          <AlertCircle size={14} className="text-yellow-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-yellow-700">
            Based on your grade (L3 – Senior), this request will require <strong>2-level approval</strong> before booking. International travel requires Finance approval.
          </p>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Submit for Approval</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function TravelPolicy() {
  const [showNewForm, setShowNewForm] = useState(false);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Corporate Travel Policy Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck size={18} className="text-teal-600" />
            Corporate Travel Policy — Budget Limits by Grade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Grade</TableHead>
                  <TableHead className="text-center"><Plane size={13} className="inline mr-1" />Flight Class</TableHead>
                  <TableHead className="text-center"><Train size={13} className="inline mr-1" />Train Class</TableHead>
                  <TableHead className="text-center"><Hotel size={13} className="inline mr-1" />Max Hotel/Night</TableHead>
                  <TableHead className="text-center"><Car size={13} className="inline mr-1" />Max Cab/Day</TableHead>
                  <TableHead className="text-center"><IndianRupee size={13} className="inline mr-1" />Per Diem (Dom.)</TableHead>
                  <TableHead className="text-center">Approval Levels</TableHead>
                  <TableHead className="text-center">Advance Booking</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {POLICY_BY_GRADE.map((p) => (
                  <TableRow key={p.grade}>
                    <TableCell className="font-medium text-sm">{p.grade}</TableCell>
                    <TableCell className="text-center text-sm">
                      <Badge variant="outline" className="text-xs">{p.flightClass}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-xs">{p.trainClass}</Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {p.maxHotelPerNight ? `₹${p.maxHotelPerNight.toLocaleString()}` : <span className="text-gray-400">No limit</span>}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {p.maxCabPerDay ? `₹${p.maxCabPerDay.toLocaleString()}` : <span className="text-gray-400">No limit</span>}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      ₹{p.perDiemDomestic.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={p.approvalLevels === 1 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                        {p.approvalLevels} level{p.approvalLevels > 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm text-gray-600">
                      {p.advanceBookingDays === 0 ? 'No min' : `${p.advanceBookingDays} days`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-gray-400 mt-2">* Business class for flights &gt;4 hours | International per diem available for L3+</p>
        </CardContent>
      </Card>

      {/* Policy rules summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: 'General Rules',
            icon: FileText,
            rules: [
              'Submit requests at least 7 days in advance (14 days for international)',
              'All bookings must be made through the corporate travel portal',
              'Highest-rated corporate partner hotels preferred',
              'Economy class for domestic flights under 4 hours',
              'Original receipts required for all expenses above ₹500',
            ],
          },
          {
            title: 'Approval Workflow',
            icon: Users,
            rules: [
              'L1–L2: Direct manager approval only',
              'L3–L4: Manager + Section Head approval',
              'L5+: Manager + CFO approval for intl. travel',
              'Finance pre-approval for expenses >₹1,00,000',
              'Emergency travel: 24-hour approval track available',
            ],
          },
          {
            title: 'Expense Reimbursement',
            icon: IndianRupee,
            rules: [
              'Submit expense claims within 7 days of return',
              'Advance up to 75% of estimated cost available',
              'Foreign currency: official exchange rate applies',
              'Alcohol not reimbursable under any circumstances',
              'Personal upgrades (flight, hotel) not reimbursable',
            ],
          },
        ].map((section) => (
          <Card key={section.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <section.icon size={15} className="text-teal-600" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <ChevronRight size={12} className="text-teal-500 mt-0.5 flex-shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Travel Request & Approval Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText size={18} className="text-teal-600" />
              Travel Requests & Approvals
            </CardTitle>
            <Button
              className="bg-teal-600 hover:bg-teal-700"
              size="sm"
              onClick={() => setShowNewForm(!showNewForm)}
            >
              <Plus size={14} className="mr-1" /> New Request
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showNewForm && <NewRequestForm onClose={() => setShowNewForm(false)} />}

          {APPROVAL_REQUESTS.map((req) => {
            const isExpanded = expandedRequest === req.id;
            const approvedCount = req.approvals.filter((a) => a.status === 'APPROVED').length;
            const progress = Math.round((approvedCount / req.approvals.length) * 100);

            return (
              <div key={req.id} className="border rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
                {/* Request header */}
                <div
                  className="flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedRequest(isExpanded ? null : req.id)}
                >
                  <Avatar className="w-9 h-9 flex-shrink-0">
                    <AvatarFallback className="text-xs bg-teal-100 text-teal-700 font-semibold">
                      {req.requesterName.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-gray-900">{req.requesterName}</p>
                      <Badge variant="outline" className="text-xs">{req.department}</Badge>
                      <Badge className={`text-xs ${STATUS_STYLES[req.status] || 'bg-gray-100'}`}>
                        {req.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {req.fromCity} → {req.destination} · {req.travelDates}
                    </p>
                    <p className="text-xs text-gray-500">{req.purpose}</p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">₹{req.estimatedCost.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{req.id}</p>
                    <div className="flex items-center gap-1 mt-1 justify-end">
                      <span className="text-xs text-gray-500">{approvedCount}/{req.approvals.length} approved</span>
                    </div>
                  </div>
                </div>

                {/* Approval progress bar */}
                <div className="px-4 pb-2">
                  <Progress
                    value={progress}
                    className={cn(
                      'h-1',
                      req.status === 'COMPLETED' ? '[&>div]:bg-teal-500' :
                      req.status === 'REJECTED' ? '[&>div]:bg-red-500' :
                      '[&>div]:bg-yellow-500'
                    )}
                  />
                </div>

                {/* Expanded approval chain */}
                {isExpanded && (
                  <div className="px-4 pb-4 bg-gray-50 border-t">
                    <div className="pt-3 space-y-3">
                      {/* Cost breakdown */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {req.breakdown.map((item) => (
                          <div key={item.category} className="bg-white rounded p-2 border text-center">
                            <p className="text-xs text-gray-500">{item.category}</p>
                            <p className="text-sm font-semibold text-gray-800">₹{item.amount.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* Approval chain */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">Approval Chain</p>
                        <div className="flex flex-col gap-2">
                          {req.approvals.map((approval, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="flex items-center gap-1 w-5 flex-shrink-0">
                                {APPROVAL_ICON[approval.status as keyof typeof APPROVAL_ICON] || <Clock size={14} />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-gray-800">{approval.approverName}</p>
                                  <Badge variant="outline" className="text-xs">{approval.approverRole}</Badge>
                                  <Badge className={`text-xs ${STATUS_STYLES[approval.status] || 'bg-gray-100'}`}>
                                    {approval.status}
                                  </Badge>
                                </div>
                                {approval.date && (
                                  <p className="text-xs text-gray-400">{approval.date}</p>
                                )}
                                {approval.remarks && (
                                  <p className="text-xs text-gray-500 italic">"{approval.remarks}"</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      {req.approvals.some((a) => a.status === 'PENDING') && (
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle size={13} className="mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                            <XCircle size={13} className="mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
