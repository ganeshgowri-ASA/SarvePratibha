'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Gift,
  Heart,
  Shield,
  GraduationCap,
  Plus,
  IndianRupee,
  CreditCard,
  Laptop,
  Baby,
  ShoppingBag,
  Wallet,
  Building2,
  Calendar,
  Clock,
  Users,
  FileText,
  ArrowUpDown,
  Star,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

// ─── Existing Benefits Data ────────────────────────────────────────────

const MY_BENEFITS = [
  { id: '1', name: 'Health Insurance - Gold Plan', type: 'HEALTH', provider: 'Star Health', status: 'ACTIVE', coverage: '10 Lakhs', contribution: '1,200/month' },
  { id: '2', name: 'Dental Coverage', type: 'DENTAL', provider: 'DentCare', status: 'ACTIVE', coverage: '50,000/year', contribution: '500/month' },
  { id: '3', name: 'NPS - Retirement Plan', type: 'RETIREMENT', provider: 'NSDL', status: 'ACTIVE', coverage: 'Contribution Based', contribution: '5,000/month' },
];

const AVAILABLE_PLANS = [
  { id: '1', name: 'Vision Care Plus', type: 'VISION', description: 'Comprehensive eye care coverage including frames and lenses', premium: '300/month', employer: '200', employee: '100' },
  { id: '2', name: 'Wellness Program', type: 'WELLNESS', description: 'Gym membership, mental health support, and wellness activities', premium: '500/month', employer: '400', employee: '100' },
  { id: '3', name: 'Education Assistance', type: 'EDUCATION', description: 'Tuition reimbursement for professional certifications', premium: '0/month', employer: 'Up to 50,000/year', employee: '0' },
  { id: '4', name: 'Life Insurance - 20x', type: 'LIFE_INSURANCE', description: '20x annual CTC life cover for employee and spouse', premium: '800/month', employer: '600', employee: '200' },
];

// ─── EPF Data ──────────────────────────────────────────────────────────

const EPF_DATA = {
  accountNo: 'BGBNG00123450000012',
  uan: '101234567890',
  balance: '8,45,320',
  employeeContribution: '4,22,660',
  employerContribution: '4,22,660',
  lastUpdated: '28 Feb 2026',
  interestEarned: '62,450',
  nominations: [
    { name: 'Sunita Kumar', relation: 'Spouse', share: '50%' },
    { name: 'Aarav Kumar', relation: 'Son', share: '25%' },
    { name: 'Ananya Kumar', relation: 'Daughter', share: '25%' },
  ],
};

const EPF_PASSBOOK = [
  { month: 'Feb 2026', employeeShare: '15,000', employerShare: '15,000', interest: '0', balance: '8,45,320' },
  { month: 'Jan 2026', employeeShare: '15,000', employerShare: '15,000', interest: '0', balance: '8,15,320' },
  { month: 'Dec 2025', employeeShare: '15,000', employerShare: '15,000', interest: '5,200', balance: '7,85,320' },
  { month: 'Nov 2025', employeeShare: '15,000', employerShare: '15,000', interest: '0', balance: '7,50,120' },
  { month: 'Oct 2025', employeeShare: '15,000', employerShare: '15,000', interest: '0', balance: '7,20,120' },
  { month: 'Sep 2025', employeeShare: '15,000', employerShare: '15,000', interest: '0', balance: '6,90,120' },
];

const EPF_WITHDRAWALS = [
  { id: 'EPF-W001', reason: 'Housing Loan', amount: '2,50,000', status: 'APPROVED', date: '15 Aug 2025', disbursedOn: '28 Aug 2025' },
  { id: 'EPF-W002', reason: 'Medical Emergency', amount: '1,00,000', status: 'DISBURSED', date: '10 Jan 2025', disbursedOn: '22 Jan 2025' },
];

// ─── Gift Vouchers Data ────────────────────────────────────────────────

const VOUCHER_TYPES = [
  { id: '1', name: 'Sodexo Meal Card', icon: '🍽️', balance: '3,500', provider: 'Sodexo', color: 'bg-orange-50 border-orange-200' },
  { id: '2', name: 'Amazon Gift Card', icon: '📦', balance: '2,000', provider: 'Amazon', color: 'bg-yellow-50 border-yellow-200' },
  { id: '3', name: 'Flipkart Voucher', icon: '🛒', balance: '1,500', provider: 'Flipkart', color: 'bg-blue-50 border-blue-200' },
  { id: '4', name: 'Paytm Voucher', icon: '💳', balance: '1,000', provider: 'Paytm', color: 'bg-cyan-50 border-cyan-200' },
];

const VOUCHER_HISTORY = [
  { id: 'GV-1001', type: 'Amazon Gift Card', amount: '2,000', occasion: 'Birthday', issued: '15 Feb 2026', status: 'ACTIVE', expiry: '15 Feb 2027' },
  { id: 'GV-1002', type: 'Sodexo Meal Card', amount: '5,000', occasion: 'Diwali', issued: '20 Oct 2025', status: 'ACTIVE', expiry: '20 Oct 2026' },
  { id: 'GV-1003', type: 'Flipkart Voucher', amount: '3,000', occasion: 'Achievement Award', issued: '1 Dec 2025', status: 'PARTIALLY_USED', expiry: '1 Dec 2026' },
  { id: 'GV-1004', type: 'Paytm Voucher', amount: '1,000', occasion: 'Diwali', issued: '20 Oct 2025', status: 'REDEEMED', expiry: '20 Oct 2026' },
  { id: 'GV-1005', type: 'Amazon Gift Card', amount: '5,000', occasion: 'Marriage Gift', issued: '10 Jan 2026', status: 'ACTIVE', expiry: '10 Jan 2027' },
];

// ─── Childcare/Nanny Data ──────────────────────────────────────────────

const CRECHE_DATA = {
  registered: true,
  childName: 'Aarav Kumar',
  age: '2 years',
  facility: 'SarvePratibha Creche - Building A, Ground Floor',
  slot: '9:00 AM - 6:00 PM',
  monthlyFee: '5,000',
  nextBillingDate: '1 Apr 2026',
  emergencyContacts: [
    { name: 'Sunita Kumar (Mother)', phone: '+91 98765 43211' },
    { name: 'Rajesh Kumar (Father)', phone: '+91 98765 43210' },
    { name: 'Meera Kumar (Grandmother)', phone: '+91 98765 43212' },
  ],
};

const NANNY_BOOKINGS = [
  { id: 'NB-101', date: '11 Mar 2026', slot: '9:00 AM - 1:00 PM', nanny: 'Laxmi Devi', status: 'CONFIRMED', child: 'Aarav Kumar' },
  { id: 'NB-102', date: '12 Mar 2026', slot: '9:00 AM - 6:00 PM', nanny: 'Laxmi Devi', status: 'CONFIRMED', child: 'Aarav Kumar' },
  { id: 'NB-103', date: '14 Mar 2026', slot: '2:00 PM - 6:00 PM', nanny: 'Geeta Bai', status: 'PENDING', child: 'Aarav Kumar' },
];

const FACILITY_AVAILABILITY = [
  { day: 'Monday', slots: 20, booked: 18, available: 2 },
  { day: 'Tuesday', slots: 20, booked: 16, available: 4 },
  { day: 'Wednesday', slots: 20, booked: 19, available: 1 },
  { day: 'Thursday', slots: 20, booked: 15, available: 5 },
  { day: 'Friday', slots: 20, booked: 17, available: 3 },
];

// ─── Credit Card Data ──────────────────────────────────────────────────

const CREDIT_CARD_DATA = {
  cardNumber: 'XXXX XXXX XXXX 4521',
  cardType: 'Corporate Platinum',
  bank: 'HDFC Bank',
  status: 'ACTIVE',
  spendingLimit: '2,00,000',
  utilized: '85,400',
  available: '1,14,600',
  grade: 'Band 5 (Senior)',
  rewardPoints: 12450,
  statementDate: '1st of every month',
  dueDate: '15th of every month',
};

const CREDIT_CARD_STATEMENTS = [
  { id: 'TXN-901', date: '8 Mar 2026', merchant: 'Taj Hotels - Client Meeting', amount: '12,500', category: 'Entertainment', status: 'POSTED' },
  { id: 'TXN-902', date: '5 Mar 2026', merchant: 'IndiGo Airlines - BLR to DEL', amount: '8,750', category: 'Travel', status: 'POSTED' },
  { id: 'TXN-903', date: '3 Mar 2026', merchant: 'Amazon Business - Office Supplies', amount: '3,200', category: 'Supplies', status: 'POSTED' },
  { id: 'TXN-904', date: '1 Mar 2026', merchant: 'Uber Business - Cab', amount: '1,450', category: 'Transport', status: 'POSTED' },
  { id: 'TXN-905', date: '28 Feb 2026', merchant: 'WeWork - Conference Room', amount: '5,000', category: 'Office', status: 'POSTED' },
];

const REWARD_HISTORY = [
  { date: 'Mar 2026', earned: 450, redeemed: 0, balance: 12450 },
  { date: 'Feb 2026', earned: 820, redeemed: 500, balance: 12000 },
  { date: 'Jan 2026', earned: 650, redeemed: 0, balance: 11680 },
  { date: 'Dec 2025', earned: 1200, redeemed: 2000, balance: 11030 },
];

// ─── Laptop & Assets Data ──────────────────────────────────────────────

const MY_ASSETS = [
  { id: 'AST-001', name: 'MacBook Pro 16" M3', type: 'Laptop', serialNo: 'C02X1234HKJD', assigned: '15 Jan 2024', condition: 'Good', amcExpiry: '15 Jan 2027', status: 'ACTIVE' },
  { id: 'AST-002', name: 'Dell 27" 4K Monitor', type: 'Monitor', serialNo: 'CN0KX123DEL4', assigned: '15 Jan 2024', condition: 'Good', amcExpiry: '15 Jan 2026', status: 'ACTIVE' },
  { id: 'AST-003', name: 'Logitech MX Master 3S', type: 'Peripheral', serialNo: 'LGT2345MX3S', assigned: '20 Feb 2024', condition: 'Good', amcExpiry: 'N/A', status: 'ACTIVE' },
  { id: 'AST-004', name: 'iPhone 15 Pro', type: 'Mobile', serialNo: 'F4GDN1234HGK', assigned: '1 Apr 2025', condition: 'Good', amcExpiry: '1 Apr 2027', status: 'ACTIVE' },
];

const ASSET_REQUESTS = [
  { id: 'AR-201', item: 'Standing Desk Converter', type: 'Furniture', status: 'APPROVED', requested: '5 Mar 2026', notes: 'Ergonomic recommendation from health checkup' },
  { id: 'AR-202', item: 'External SSD 1TB', type: 'Storage', status: 'PENDING', requested: '9 Mar 2026', notes: 'For project data backup' },
];

const ASSET_RETURN_EXCHANGE = [
  { id: 'RET-101', asset: 'Logitech Keyboard K380', action: 'EXCHANGE', reason: 'Keys not responsive', status: 'COMPLETED', date: '20 Feb 2026', replacement: 'Logitech MX Keys Mini' },
  { id: 'RET-102', asset: 'Dell 24" Monitor (Old)', action: 'RETURN', reason: 'Upgraded to 27" 4K', status: 'COMPLETED', date: '15 Jan 2024', replacement: null },
];

// ─── Shared Styles ─────────────────────────────────────────────────────

const TYPE_ICONS: Record<string, typeof Heart> = {
  HEALTH: Heart,
  DENTAL: Shield,
  VISION: Shield,
  LIFE_INSURANCE: Shield,
  RETIREMENT: Gift,
  WELLNESS: Heart,
  EDUCATION: GraduationCap,
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  ACTIVE: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-700',
  EXPIRED: 'bg-red-100 text-red-700',
  APPROVED: 'bg-green-100 text-green-700',
  DISBURSED: 'bg-green-100 text-green-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  REDEEMED: 'bg-gray-100 text-gray-600',
  PARTIALLY_USED: 'bg-yellow-100 text-yellow-700',
  POSTED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

export default function BenefitsPage() {
  const [epfWithdrawDialogOpen, setEpfWithdrawDialogOpen] = useState(false);
  const [assetRequestDialogOpen, setAssetRequestDialogOpen] = useState(false);
  const [creditCardRequestDialogOpen, setCreditCardRequestDialogOpen] = useState(false);
  const [nannyBookingDialogOpen, setNannyBookingDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Benefits</h1>
          <p className="text-sm text-gray-500">View and manage your benefit enrollments, EPF, vouchers, and more</p>
        </div>
        <div className="flex gap-2">
          <Link href="/benefits/insurance">
            <Button variant="outline">Insurance Details</Button>
          </Link>
          <Link href="/benefits/enroll">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus size={16} className="mr-2" /> Enroll Now
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="enrolled">
        <TabsList className="flex-wrap">
          <TabsTrigger value="enrolled">My Benefits</TabsTrigger>
          <TabsTrigger value="available">Available Plans</TabsTrigger>
          <TabsTrigger value="epf">EPF</TabsTrigger>
          <TabsTrigger value="vouchers">Gift Vouchers</TabsTrigger>
          <TabsTrigger value="childcare">Childcare</TabsTrigger>
          <TabsTrigger value="credit-card">Credit Card</TabsTrigger>
          <TabsTrigger value="assets">Laptop & Assets</TabsTrigger>
        </TabsList>

        {/* ─── My Benefits Tab ──────────────────────────────── */}
        <TabsContent value="enrolled">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MY_BENEFITS.map((benefit) => {
              const Icon = TYPE_ICONS[benefit.type] || Gift;
              return (
                <Card key={benefit.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-teal-50 rounded-lg">
                          <Icon size={18} className="text-teal-600" />
                        </div>
                        <div>
                          <CardTitle className="text-sm">{benefit.name}</CardTitle>
                          <p className="text-xs text-gray-500">{benefit.provider}</p>
                        </div>
                      </div>
                      <Badge className={STATUS_STYLES[benefit.status] || ''}>{benefit.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Coverage</span>
                        <span className="font-medium">{benefit.coverage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Your Contribution</span>
                        <span className="font-medium">&#8377;{benefit.contribution}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ─── Available Plans Tab ──────────────────────────── */}
        <TabsContent value="available">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AVAILABLE_PLANS.map((plan) => {
              const Icon = TYPE_ICONS[plan.type] || Gift;
              return (
                <Card key={plan.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Icon size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">{plan.name}</CardTitle>
                        <Badge className="bg-blue-100 text-blue-700 mt-1">{plan.type.replace(/_/g, ' ')}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">{plan.description}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Premium</span>
                        <span className="font-medium">&#8377;{plan.premium}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Employer Pays</span>
                        <span className="font-medium text-green-600">&#8377;{plan.employer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">You Pay</span>
                        <span className="font-medium">&#8377;{plan.employee}</span>
                      </div>
                    </div>
                    <Link href="/benefits/enroll">
                      <Button className="w-full bg-teal-600 hover:bg-teal-700 mt-2">Enroll</Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ─── EPF Tab ──────────────────────────────────────── */}
        <TabsContent value="epf">
          <div className="space-y-4">
            {/* EPF Balance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <IndianRupee size={18} className="text-teal-600" />
                    EPF Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-3xl font-bold text-gray-900">&#8377;{EPF_DATA.balance}</span>
                    <span className="text-sm text-gray-500 mb-1">as of {EPF_DATA.lastUpdated}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-teal-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Employee Share</p>
                      <p className="text-sm font-bold text-gray-900">&#8377;{EPF_DATA.employeeContribution}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Employer Share</p>
                      <p className="text-sm font-bold text-gray-900">&#8377;{EPF_DATA.employerContribution}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Interest Earned</p>
                      <p className="text-sm font-bold text-green-600">&#8377;{EPF_DATA.interestEarned}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">UAN</p>
                      <p className="text-sm font-bold text-gray-900">{EPF_DATA.uan}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">Account No: {EPF_DATA.accountNo}</p>
                </CardContent>
              </Card>

              {/* Nomination Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users size={18} className="text-teal-600" />
                    Nominations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {EPF_DATA.nominations.map((nom, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{nom.name}</p>
                          <p className="text-xs text-gray-500">{nom.relation}</p>
                        </div>
                        <Badge variant="outline">{nom.share}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Passbook */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText size={18} className="text-teal-600" />
                    Passbook
                  </CardTitle>
                  <Dialog open={epfWithdrawDialogOpen} onOpenChange={setEpfWithdrawDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-teal-600 hover:bg-teal-700">
                        <Plus size={16} className="mr-2" /> Partial Withdrawal
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>EPF Partial Withdrawal Request</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Withdrawal Reason</Label>
                          <Select>
                            <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="medical">Medical Emergency</SelectItem>
                              <SelectItem value="housing">Housing / Home Loan</SelectItem>
                              <SelectItem value="education">Children&apos;s Education</SelectItem>
                              <SelectItem value="marriage">Marriage (Self/Sibling/Children)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Amount (&#8377;)</Label>
                          <Input type="number" placeholder="Enter withdrawal amount" />
                        </div>
                        <div>
                          <Label>Supporting Documents</Label>
                          <Input type="file" />
                          <p className="text-xs text-gray-400 mt-1">Upload medical bills, admission letter, or property documents</p>
                        </div>
                        <div>
                          <Label>Remarks</Label>
                          <Textarea placeholder="Provide additional details..." />
                        </div>
                        <Button className="w-full bg-teal-600 hover:bg-teal-700">Submit Request</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4 font-medium text-gray-700">Month</th>
                        <th className="text-right py-2 pr-4 font-medium text-gray-700">Employee</th>
                        <th className="text-right py-2 pr-4 font-medium text-gray-700">Employer</th>
                        <th className="text-right py-2 pr-4 font-medium text-gray-700">Interest</th>
                        <th className="text-right py-2 font-medium text-gray-700">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {EPF_PASSBOOK.map((entry, idx) => (
                        <tr key={idx} className="border-b last:border-0">
                          <td className="py-3 pr-4 font-medium text-gray-900">{entry.month}</td>
                          <td className="py-3 pr-4 text-right text-gray-600">&#8377;{entry.employeeShare}</td>
                          <td className="py-3 pr-4 text-right text-gray-600">&#8377;{entry.employerShare}</td>
                          <td className="py-3 pr-4 text-right text-green-600">{entry.interest !== '0' ? `₹${entry.interest}` : '-'}</td>
                          <td className="py-3 text-right font-medium text-gray-900">&#8377;{entry.balance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Past Withdrawals */}
            {EPF_WITHDRAWALS.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Withdrawal History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {EPF_WITHDRAWALS.map((w) => (
                      <div key={w.id} className="flex items-center justify-between py-3">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900">{w.reason} - &#8377;{w.amount}</p>
                          <p className="text-xs text-gray-500">
                            Requested: {w.date} &middot; Disbursed: {w.disbursedOn}
                          </p>
                        </div>
                        <Badge className={STATUS_STYLES[w.status] || ''}>{w.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* ─── Gift Vouchers Tab ────────────────────────────── */}
        <TabsContent value="vouchers">
          <div className="space-y-4">
            {/* Voucher Balances */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {VOUCHER_TYPES.map((voucher) => (
                <Card key={voucher.id} className={`border ${voucher.color}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{voucher.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{voucher.name}</p>
                        <p className="text-xs text-gray-500">{voucher.provider}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-gray-500">Available Balance</p>
                      <p className="text-lg font-bold text-gray-900">&#8377;{voucher.balance}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Voucher History */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShoppingBag size={18} className="text-teal-600" />
                    Voucher History
                  </CardTitle>
                  <Button variant="outline" size="sm">Request Voucher</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {VOUCHER_HISTORY.map((v) => (
                    <div key={v.id} className="flex items-center justify-between py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{v.type}</p>
                          <Badge variant="outline" className="text-xs">{v.occasion}</Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          Issued: {v.issued} &middot; Expires: {v.expiry} &middot; {v.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">&#8377;{v.amount}</p>
                        <Badge className={STATUS_STYLES[v.status] || ''} >
                          {v.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── Childcare Tab ────────────────────────────────── */}
        <TabsContent value="childcare">
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Registration Card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Baby size={18} className="text-teal-600" />
                    Creche Registration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Child Name</p>
                      <p className="font-medium text-gray-900">{CRECHE_DATA.childName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Age</p>
                      <p className="font-medium text-gray-900">{CRECHE_DATA.age}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Facility</p>
                      <p className="font-medium text-gray-900">{CRECHE_DATA.facility}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Slot</p>
                      <p className="font-medium text-gray-900">{CRECHE_DATA.slot}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Monthly Fee</p>
                      <p className="font-medium text-gray-900">&#8377;{CRECHE_DATA.monthlyFee}</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Emergency Contacts</p>
                    <div className="space-y-2">
                      {CRECHE_DATA.emergencyContacts.map((contact, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{contact.name}</span>
                          <span className="text-gray-900">{contact.phone}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <p className="text-xs text-gray-400">Next billing: {CRECHE_DATA.nextBillingDate} &middot; Status: <span className="text-green-600 font-medium">Active</span></p>
                </CardContent>
              </Card>

              {/* Facility Availability */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar size={18} className="text-teal-600" />
                    Weekly Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {FACILITY_AVAILABILITY.map((day) => (
                      <div key={day.day}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-700">{day.day}</span>
                          <span className={`text-xs font-medium ${day.available <= 2 ? 'text-red-600' : 'text-green-600'}`}>
                            {day.available} slots
                          </span>
                        </div>
                        <Progress value={(day.booked / day.slots) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Nanny Bookings */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock size={18} className="text-teal-600" />
                    Nanny Bookings
                  </CardTitle>
                  <Dialog open={nannyBookingDialogOpen} onOpenChange={setNannyBookingDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-teal-600 hover:bg-teal-700">
                        <Plus size={16} className="mr-2" /> Book Nanny
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Book Nanny Service</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Date</Label>
                          <Input type="date" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Start Time</Label>
                            <Select>
                              <SelectTrigger><SelectValue placeholder="From" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="9">9:00 AM</SelectItem>
                                <SelectItem value="10">10:00 AM</SelectItem>
                                <SelectItem value="11">11:00 AM</SelectItem>
                                <SelectItem value="12">12:00 PM</SelectItem>
                                <SelectItem value="14">2:00 PM</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>End Time</Label>
                            <Select>
                              <SelectTrigger><SelectValue placeholder="To" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="13">1:00 PM</SelectItem>
                                <SelectItem value="14">2:00 PM</SelectItem>
                                <SelectItem value="16">4:00 PM</SelectItem>
                                <SelectItem value="18">6:00 PM</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label>Child Name</Label>
                          <Input defaultValue={CRECHE_DATA.childName} />
                        </div>
                        <div>
                          <Label>Special Instructions</Label>
                          <Textarea placeholder="Any dietary restrictions, allergies, or special needs..." />
                        </div>
                        <Button className="w-full bg-teal-600 hover:bg-teal-700">Submit Booking</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {NANNY_BOOKINGS.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between py-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">{booking.date} &middot; {booking.slot}</p>
                        <p className="text-xs text-gray-500">Nanny: {booking.nanny} &middot; Child: {booking.child} &middot; {booking.id}</p>
                      </div>
                      <Badge className={STATUS_STYLES[booking.status] || ''}>{booking.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── Credit Card Tab ──────────────────────────────── */}
        <TabsContent value="credit-card">
          <div className="space-y-4">
            {/* Card Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CreditCard size={18} className="text-teal-600" />
                    Corporate Credit Card
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Card Visual */}
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 text-white mb-4 max-w-md">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs opacity-60">{CREDIT_CARD_DATA.bank}</span>
                      <Badge className="bg-white/20 text-white border-0">{CREDIT_CARD_DATA.cardType}</Badge>
                    </div>
                    <p className="text-lg font-mono tracking-wider">{CREDIT_CARD_DATA.cardNumber}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <p className="text-[10px] opacity-60">CARD HOLDER</p>
                        <p className="text-sm">Rajesh Kumar</p>
                      </div>
                      <div>
                        <p className="text-[10px] opacity-60">GRADE</p>
                        <p className="text-sm">{CREDIT_CARD_DATA.grade}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Spending Limit</p>
                      <p className="text-sm font-bold text-gray-900">&#8377;{CREDIT_CARD_DATA.spendingLimit}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Utilized</p>
                      <p className="text-sm font-bold text-red-600">&#8377;{CREDIT_CARD_DATA.utilized}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Available</p>
                      <p className="text-sm font-bold text-green-600">&#8377;{CREDIT_CARD_DATA.available}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    Statement: {CREDIT_CARD_DATA.statementDate} &middot; Due: {CREDIT_CARD_DATA.dueDate}
                  </p>
                </CardContent>
              </Card>

              {/* Reward Points */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Star size={18} className="text-teal-600" />
                    Reward Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-teal-600">{CREDIT_CARD_DATA.rewardPoints.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total Points</p>
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-2">
                    {REWARD_HISTORY.map((r, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{r.date}</span>
                        <div className="flex gap-3">
                          <span className="text-green-600">+{r.earned}</span>
                          {r.redeemed > 0 && <span className="text-red-500">-{r.redeemed}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Statement */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText size={18} className="text-teal-600" />
                    Recent Transactions
                  </CardTitle>
                  <Dialog open={creditCardRequestDialogOpen} onOpenChange={setCreditCardRequestDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">Request New Card</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Corporate Credit Card</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Card Type</Label>
                          <Select>
                            <SelectTrigger><SelectValue placeholder="Select card type" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard (Limit: ₹50,000)</SelectItem>
                              <SelectItem value="gold">Gold (Limit: ₹1,00,000)</SelectItem>
                              <SelectItem value="platinum">Platinum (Limit: ₹2,00,000)</SelectItem>
                              <SelectItem value="business">Business (Limit: ₹5,00,000)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Reason for Request</Label>
                          <Textarea placeholder="Explain business need for corporate credit card..." />
                        </div>
                        <div>
                          <Label>Manager Approval</Label>
                          <Input defaultValue="Auto-routed to reporting manager" disabled />
                        </div>
                        <Button className="w-full bg-teal-600 hover:bg-teal-700">Submit Request</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4 font-medium text-gray-700">Date</th>
                        <th className="text-left py-2 pr-4 font-medium text-gray-700">Merchant</th>
                        <th className="text-left py-2 pr-4 font-medium text-gray-700">Category</th>
                        <th className="text-right py-2 pr-4 font-medium text-gray-700">Amount</th>
                        <th className="text-right py-2 font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CREDIT_CARD_STATEMENTS.map((txn) => (
                        <tr key={txn.id} className="border-b last:border-0">
                          <td className="py-3 pr-4 text-gray-600">{txn.date}</td>
                          <td className="py-3 pr-4 font-medium text-gray-900">{txn.merchant}</td>
                          <td className="py-3 pr-4"><Badge variant="outline" className="text-xs">{txn.category}</Badge></td>
                          <td className="py-3 pr-4 text-right font-medium text-gray-900">&#8377;{txn.amount}</td>
                          <td className="py-3 text-right"><Badge className={STATUS_STYLES[txn.status] || ''}>{txn.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── Laptop & Assets Tab ──────────────────────────── */}
        <TabsContent value="assets">
          <div className="space-y-4">
            {/* My Assets */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Laptop size={18} className="text-teal-600" />
                    My Assets
                  </CardTitle>
                  <Dialog open={assetRequestDialogOpen} onOpenChange={setAssetRequestDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-teal-600 hover:bg-teal-700">
                        <Plus size={16} className="mr-2" /> Request Asset
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request New Asset</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Asset Type</Label>
                          <Select>
                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="laptop">Laptop</SelectItem>
                              <SelectItem value="monitor">Monitor</SelectItem>
                              <SelectItem value="mobile">Mobile Phone</SelectItem>
                              <SelectItem value="peripheral">Peripheral (Mouse/Keyboard)</SelectItem>
                              <SelectItem value="furniture">Furniture (Chair/Desk)</SelectItem>
                              <SelectItem value="storage">Storage Device</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Specific Item (if known)</Label>
                          <Input placeholder="e.g., MacBook Pro 16 M3, Dell 27 4K Monitor" />
                        </div>
                        <div>
                          <Label>Business Justification</Label>
                          <Textarea placeholder="Why do you need this asset?" />
                        </div>
                        <div>
                          <Label>Urgency</Label>
                          <Select>
                            <SelectTrigger><SelectValue placeholder="Select urgency" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Normal (5-7 days)</SelectItem>
                              <SelectItem value="urgent">Urgent (1-2 days)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full bg-teal-600 hover:bg-teal-700">Submit Request</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MY_ASSETS.map((asset) => (
                    <div key={asset.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900">{asset.name}</p>
                          <p className="text-xs text-gray-500">
                            {asset.type} &middot; Serial: {asset.serialNo}
                          </p>
                        </div>
                        <Badge className={STATUS_STYLES[asset.status] || ''}>{asset.status}</Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-gray-400">Assigned</p>
                          <p className="text-gray-600">{asset.assigned}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Condition</p>
                          <p className="text-gray-600">{asset.condition}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">AMC Expiry</p>
                          <p className={`${asset.amcExpiry === 'N/A' ? 'text-gray-400' : 'text-gray-600'}`}>{asset.amcExpiry}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock size={18} className="text-teal-600" />
                  Asset Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {ASSET_REQUESTS.map((req) => (
                    <div key={req.id} className="flex items-center justify-between py-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">{req.item}</p>
                        <p className="text-xs text-gray-500">
                          {req.type} &middot; Requested: {req.requested} &middot; {req.notes}
                        </p>
                      </div>
                      <Badge className={STATUS_STYLES[req.status] || ''}>{req.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Return/Exchange History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ArrowUpDown size={18} className="text-teal-600" />
                  Return / Exchange History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {ASSET_RETURN_EXCHANGE.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{item.asset}</p>
                          <Badge variant="outline" className="text-xs">{item.action}</Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          Reason: {item.reason} &middot; {item.date}
                          {item.replacement && <> &middot; Replaced with: {item.replacement}</>}
                        </p>
                      </div>
                      <Badge className={STATUS_STYLES[item.status] || ''}>{item.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
