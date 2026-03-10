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
import {
  CreditCard,
  Plane,
  Users,
  Plus,
  MapPin,
  Calendar,
  IndianRupee,
  CheckCircle,
  Clock,
  Printer,
  Eye,
  RefreshCw,
  Building2,
} from 'lucide-react';
import Link from 'next/link';

// ─── Visiting Card Demo Data ───────────────────────────────────────────

const VISITING_CARD_ORDERS = [
  { id: 'VC-1001', name: 'Rajesh Kumar', designation: 'Senior Software Engineer', department: 'Engineering', template: 'Classic Teal', quantity: 200, status: 'DELIVERED', ordered: '25 Feb 2026', delivered: '2 Mar 2026' },
  { id: 'VC-1002', name: 'Priya Sharma', designation: 'Product Manager', department: 'Product', template: 'Modern Blue', quantity: 100, status: 'PRINTING', ordered: '7 Mar 2026', delivered: null },
  { id: 'VC-1003', name: 'Arun Mehta', designation: 'VP - Sales', department: 'Sales', template: 'Executive Gold', quantity: 500, status: 'PENDING_APPROVAL', ordered: '9 Mar 2026', delivered: null },
];

const CARD_TEMPLATES = [
  { id: 'classic-teal', name: 'Classic Teal', description: 'Standard corporate card with teal accent', preview: 'Minimalist design with company logo' },
  { id: 'modern-blue', name: 'Modern Blue', description: 'Contemporary design with gradient blue', preview: 'Bold typography with blue gradients' },
  { id: 'executive-gold', name: 'Executive Gold', description: 'Premium card for senior leadership', preview: 'Gold foil accents with embossed logo' },
  { id: 'minimal-white', name: 'Minimal White', description: 'Clean white card with subtle branding', preview: 'Whitespace-focused elegant layout' },
];

// ─── Corporate Trips Demo Data ─────────────────────────────────────────

const UPCOMING_TRIPS = [
  {
    id: 'TRIP-301',
    name: 'Engineering Team Offsite - Goa',
    type: 'TEAM_OUTING',
    organizer: 'Rajesh Kumar',
    department: 'Engineering',
    startDate: '20 Mar 2026',
    endDate: '22 Mar 2026',
    participants: 25,
    budget: '5,00,000',
    spent: '3,25,000',
    status: 'APPROVED',
    itinerary: [
      { day: 'Day 1', activities: 'Arrival, Check-in, Team Dinner at Beach Resort' },
      { day: 'Day 2', activities: 'Strategy Workshop, Water Sports, Cultural Night' },
      { day: 'Day 3', activities: 'Retrospective Session, Checkout, Departure' },
    ],
  },
  {
    id: 'TRIP-302',
    name: 'Sales Conference - Mumbai',
    type: 'CONFERENCE',
    organizer: 'Priya Sharma',
    department: 'Sales',
    startDate: '5 Apr 2026',
    endDate: '6 Apr 2026',
    participants: 40,
    budget: '8,00,000',
    spent: '0',
    status: 'PLANNING',
    itinerary: [
      { day: 'Day 1', activities: 'Keynote, Sales Strategy Workshops, Networking Dinner' },
      { day: 'Day 2', activities: 'Client Success Stories, Awards Ceremony, Departure' },
    ],
  },
  {
    id: 'TRIP-303',
    name: 'Leadership Retreat - Udaipur',
    type: 'OFFSITE',
    organizer: 'HR Team',
    department: 'Leadership',
    startDate: '15 Apr 2026',
    endDate: '17 Apr 2026',
    participants: 12,
    budget: '4,50,000',
    spent: '1,80,000',
    status: 'APPROVED',
    itinerary: [
      { day: 'Day 1', activities: 'Arrival, Welcome Dinner at Heritage Hotel' },
      { day: 'Day 2', activities: 'Vision Planning, Team Building, Lake Cruise' },
      { day: 'Day 3', activities: 'Action Items Review, Checkout, Departure' },
    ],
  },
];

const DEPARTMENT_BUDGETS = [
  { department: 'Engineering', allocated: '15,00,000', utilized: '8,25,000', remaining: '6,75,000', trips: 4 },
  { department: 'Sales', allocated: '20,00,000', utilized: '12,00,000', remaining: '8,00,000', trips: 6 },
  { department: 'Product', allocated: '10,00,000', utilized: '4,50,000', remaining: '5,50,000', trips: 3 },
  { department: 'HR', allocated: '8,00,000', utilized: '3,00,000', remaining: '5,00,000', trips: 2 },
  { department: 'Leadership', allocated: '12,00,000', utilized: '6,30,000', remaining: '5,70,000', trips: 3 },
];

const EXPENSE_RECONCILIATION = [
  { id: 'EXP-401', trip: 'Engineering Offsite - Coorg (Feb)', totalBudget: '4,00,000', actualSpend: '3,78,500', savings: '21,500', status: 'RECONCILED', submittedBy: 'Rajesh Kumar', date: '28 Feb 2026' },
  { id: 'EXP-402', trip: 'Sales Workshop - Pune (Jan)', totalBudget: '2,50,000', actualSpend: '2,65,000', savings: '-15,000', status: 'OVERBUDGET', submittedBy: 'Priya Sharma', date: '20 Jan 2026' },
  { id: 'EXP-403', trip: 'Product Sprint - Bangalore (Feb)', totalBudget: '1,50,000', actualSpend: '1,42,000', savings: '8,000', status: 'RECONCILED', submittedBy: 'Arun Mehta', date: '15 Feb 2026' },
];

const STATUS_STYLES: Record<string, string> = {
  DELIVERED: 'bg-green-100 text-green-700',
  PRINTING: 'bg-blue-100 text-blue-700',
  PENDING_APPROVAL: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  PLANNING: 'bg-blue-100 text-blue-700',
  RECONCILED: 'bg-green-100 text-green-700',
  OVERBUDGET: 'bg-red-100 text-red-700',
  PENDING_REVIEW: 'bg-yellow-100 text-yellow-700',
};

const TRIP_TYPE_STYLES: Record<string, string> = {
  TEAM_OUTING: 'bg-purple-100 text-purple-700',
  CONFERENCE: 'bg-blue-100 text-blue-700',
  OFFSITE: 'bg-teal-100 text-teal-700',
};

export default function CorporateServicesPage() {
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [tripDialogOpen, setTripDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<typeof UPCOMING_TRIPS[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Corporate Services</h1>
          <p className="text-sm text-gray-500">Visiting cards, corporate trips, and more</p>
        </div>
        <div className="flex gap-2">
          <Link href="/services">
            <Button variant="outline">All Services</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Card Orders', value: '3', icon: CreditCard, color: 'text-teal-600 bg-teal-50' },
          { label: 'Upcoming Trips', value: '3', icon: Plane, color: 'text-purple-600 bg-purple-50' },
          { label: 'Total Participants', value: '77', icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Trip Budget (FY)', value: '65L', icon: IndianRupee, color: 'text-orange-600 bg-orange-50' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="visiting-cards">
        <TabsList className="flex-wrap">
          <TabsTrigger value="visiting-cards">Visiting Cards</TabsTrigger>
          <TabsTrigger value="trip-planner">Trip Planner</TabsTrigger>
          <TabsTrigger value="budgets">Department Budgets</TabsTrigger>
          <TabsTrigger value="reconciliation">Expense Reconciliation</TabsTrigger>
        </TabsList>

        {/* ─── Visiting Cards Tab ─────────────────────────────── */}
        <TabsContent value="visiting-cards">
          <div className="space-y-4">
            {/* Card Templates */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CreditCard size={18} className="text-teal-600" />
                    Design Templates
                  </CardTitle>
                  <Dialog open={cardDialogOpen} onOpenChange={setCardDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-teal-600 hover:bg-teal-700">
                        <Plus size={16} className="mr-2" /> Request Cards
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Request Visiting Cards</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Employee Name</Label>
                            <Input defaultValue="Rajesh Kumar" />
                          </div>
                          <div>
                            <Label>Designation</Label>
                            <Input defaultValue="Senior Software Engineer" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Department</Label>
                            <Input defaultValue="Engineering" />
                          </div>
                          <div>
                            <Label>Phone Number</Label>
                            <Input defaultValue="+91 98765 43210" />
                          </div>
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input defaultValue="rajesh.kumar@sarvepratibha.com" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Design Template</Label>
                            <Select>
                              <SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger>
                              <SelectContent>
                                {CARD_TEMPLATES.map((t) => (
                                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Quantity</Label>
                            <Select>
                              <SelectTrigger><SelectValue placeholder="Qty" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="100">100</SelectItem>
                                <SelectItem value="200">200</SelectItem>
                                <SelectItem value="500">500</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label>Additional Notes</Label>
                          <Textarea placeholder="Any special requests (e.g., include LinkedIn URL, QR code)" />
                        </div>
                        <Button className="w-full bg-teal-600 hover:bg-teal-700">Submit Request</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {CARD_TEMPLATES.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      {/* Card Preview - Front */}
                      <div className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-lg p-4 text-white mb-3 aspect-[1.75/1] flex flex-col justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                            <span className="text-[8px] font-bold">SP</span>
                          </div>
                          <span className="text-[9px] font-semibold">SarvePratibha</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold">Employee Name</p>
                          <p className="text-[8px] opacity-80">Designation</p>
                        </div>
                      </div>
                      {/* Card Preview - Back */}
                      <div className="bg-gray-50 border rounded-lg p-4 mb-3 aspect-[1.75/1] flex flex-col justify-center items-center text-center">
                        <Building2 size={16} className="text-teal-600 mb-1" />
                        <p className="text-[8px] text-gray-600">SarvePratibha Technologies Pvt. Ltd.</p>
                        <p className="text-[7px] text-gray-400 mt-1">Bangalore, India | www.sarvepratibha.com</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{template.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Printer size={18} className="text-teal-600" />
                  Order Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {VISITING_CARD_ORDERS.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{order.name}</p>
                          <span className="text-xs text-gray-400">{order.id}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {order.designation}, {order.department} &middot; Template: {order.template} &middot; Qty: {order.quantity}
                        </p>
                        <p className="text-xs text-gray-400">
                          Ordered: {order.ordered}
                          {order.delivered && <> &middot; Delivered: {order.delivered}</>}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={STATUS_STYLES[order.status] || ''}>
                          {order.status.replace(/_/g, ' ')}
                        </Badge>
                        {order.status === 'DELIVERED' && (
                          <Button size="sm" variant="outline" className="text-xs">
                            <RefreshCw size={12} className="mr-1" /> Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Printer size={12} />
                    Print Vendor: QuickPrint Solutions Pvt. Ltd. &middot; TAT: 3-5 working days &middot; Contact: vendor@quickprint.in
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── Trip Planner Tab ───────────────────────────────── */}
        <TabsContent value="trip-planner">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Plane size={18} className="text-teal-600" />
                    Upcoming Corporate Trips
                  </CardTitle>
                  <Dialog open={tripDialogOpen} onOpenChange={setTripDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-teal-600 hover:bg-teal-700">
                        <Plus size={16} className="mr-2" /> Plan New Trip
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Plan Corporate Trip</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Trip Name</Label>
                          <Input placeholder="e.g., Engineering Team Offsite - Goa" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Trip Type</Label>
                            <Select>
                              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="team_outing">Team Outing</SelectItem>
                                <SelectItem value="conference">Conference</SelectItem>
                                <SelectItem value="offsite">Offsite / Retreat</SelectItem>
                                <SelectItem value="training">Training Program</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Department</Label>
                            <Select>
                              <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="engineering">Engineering</SelectItem>
                                <SelectItem value="sales">Sales</SelectItem>
                                <SelectItem value="product">Product</SelectItem>
                                <SelectItem value="hr">HR</SelectItem>
                                <SelectItem value="cross-functional">Cross-Functional</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Start Date</Label>
                            <Input type="date" />
                          </div>
                          <div>
                            <Label>End Date</Label>
                            <Input type="date" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Destination</Label>
                            <Input placeholder="e.g., Goa" />
                          </div>
                          <div>
                            <Label>Expected Participants</Label>
                            <Input type="number" placeholder="e.g., 25" />
                          </div>
                        </div>
                        <div>
                          <Label>Estimated Budget (&#8377;)</Label>
                          <Input placeholder="e.g., 5,00,000" />
                        </div>
                        <div>
                          <Label>Itinerary Notes</Label>
                          <Textarea placeholder="Brief itinerary or agenda for the trip..." />
                        </div>
                        <Button className="w-full bg-teal-600 hover:bg-teal-700">Submit for Approval</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {UPCOMING_TRIPS.map((trip) => (
                    <div key={trip.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900">{trip.name}</p>
                            <Badge className={TRIP_TYPE_STYLES[trip.type] || ''}>
                              {trip.type.replace(/_/g, ' ')}
                            </Badge>
                            <Badge className={STATUS_STYLES[trip.status] || ''}>{trip.status}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {trip.startDate} - {trip.endDate}</span>
                            <span className="flex items-center gap-1"><Users size={12} /> {trip.participants} participants</span>
                            <span className="flex items-center gap-1"><MapPin size={12} /> {trip.department}</span>
                            <span>Organizer: {trip.organizer}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-gray-500">Budget: <span className="font-medium text-gray-900">&#8377;{trip.budget}</span></span>
                            <span className="text-gray-500">Spent: <span className="font-medium text-gray-900">&#8377;{trip.spent}</span></span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => { setSelectedTrip(trip); setPreviewDialogOpen(true); }}
                        >
                          <Eye size={12} className="mr-1" /> Itinerary
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Group Booking Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users size={18} className="text-teal-600" />
                  Group Booking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { type: 'Travel', desc: 'Flight/Train group bookings', icon: Plane, count: '2 upcoming', color: 'bg-blue-50 text-blue-600' },
                    { type: 'Accommodation', desc: 'Hotel block bookings', icon: Building2, count: '3 reserved', color: 'bg-purple-50 text-purple-600' },
                    { type: 'Venue', desc: 'Conference hall / resort', icon: MapPin, count: '1 confirmed', color: 'bg-teal-50 text-teal-600' },
                  ].map((item) => (
                    <div key={item.type} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${item.color}`}>
                          <item.icon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.type}</p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                      </div>
                      <p className="text-xs font-medium text-teal-600 mt-3">{item.count}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Itinerary Dialog */}
          <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedTrip?.name}</DialogTitle>
              </DialogHeader>
              {selectedTrip && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {selectedTrip.startDate} - {selectedTrip.endDate}</span>
                    <span className="flex items-center gap-1"><Users size={14} /> {selectedTrip.participants} people</span>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-900">Itinerary</p>
                    {selectedTrip.itinerary.map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-medium">{idx + 1}</div>
                          {idx < selectedTrip.itinerary.length - 1 && <div className="w-px h-full bg-teal-200 mt-1" />}
                        </div>
                        <div className="pb-3">
                          <p className="text-sm font-medium text-gray-900">{item.day}</p>
                          <p className="text-xs text-gray-500">{item.activities}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Budget: &#8377;{selectedTrip.budget}</span>
                    <span className="text-gray-500">Spent: &#8377;{selectedTrip.spent}</span>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* ─── Department Budgets Tab ─────────────────────────── */}
        <TabsContent value="budgets">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <IndianRupee size={18} className="text-teal-600" />
                Department Trip Budgets (FY 2025-26)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-medium text-gray-700">Department</th>
                      <th className="text-right py-2 pr-4 font-medium text-gray-700">Allocated</th>
                      <th className="text-right py-2 pr-4 font-medium text-gray-700">Utilized</th>
                      <th className="text-right py-2 pr-4 font-medium text-gray-700">Remaining</th>
                      <th className="text-right py-2 font-medium text-gray-700">Trips</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEPARTMENT_BUDGETS.map((dept) => (
                      <tr key={dept.department} className="border-b last:border-0">
                        <td className="py-3 pr-4 font-medium text-gray-900">{dept.department}</td>
                        <td className="py-3 pr-4 text-right text-gray-600">&#8377;{dept.allocated}</td>
                        <td className="py-3 pr-4 text-right text-gray-600">&#8377;{dept.utilized}</td>
                        <td className="py-3 pr-4 text-right font-medium text-green-600">&#8377;{dept.remaining}</td>
                        <td className="py-3 text-right text-gray-600">{dept.trips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Expense Reconciliation Tab ─────────────────────── */}
        <TabsContent value="reconciliation">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle size={18} className="text-teal-600" />
                Post-Trip Expense Reconciliation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {EXPENSE_RECONCILIATION.map((exp) => (
                  <div key={exp.id} className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">{exp.trip}</p>
                        <span className="text-xs text-gray-400">{exp.id}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Budget: &#8377;{exp.totalBudget} &middot; Actual: &#8377;{exp.actualSpend} &middot;
                        {exp.savings.startsWith('-') ? (
                          <span className="text-red-600"> Over by &#8377;{exp.savings.replace('-', '')}</span>
                        ) : (
                          <span className="text-green-600"> Saved &#8377;{exp.savings}</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400">Submitted by {exp.submittedBy} on {exp.date}</p>
                    </div>
                    <Badge className={STATUS_STYLES[exp.status] || ''}>
                      {exp.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
