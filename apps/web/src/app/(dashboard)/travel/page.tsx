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
import {
  Plane,
  Plus,
  MapPin,
  Calendar,
  IndianRupee,
  Home,
  FileText,
  Globe,
  Hotel,
  Clock,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

const TRAVEL_REQUESTS = [
  { id: '1', destination: 'Mumbai', fromCity: 'Bangalore', type: 'Domestic', startDate: '15 Mar 2026', endDate: '18 Mar 2026', purpose: 'Client Meeting', estimatedCost: '25,000', status: 'SUBMITTED' },
  { id: '2', destination: 'Delhi', fromCity: 'Bangalore', type: 'Domestic', startDate: '5 Mar 2026', endDate: '7 Mar 2026', purpose: 'Conference', estimatedCost: '35,000', status: 'MANAGER_APPROVED' },
  { id: '3', destination: 'Singapore', fromCity: 'Bangalore', type: 'International', startDate: '1 Apr 2026', endDate: '5 Apr 2026', purpose: 'Tech Summit', estimatedCost: '1,50,000', status: 'SUBMITTED' },
  { id: '4', destination: 'Hyderabad', fromCity: 'Bangalore', type: 'Domestic', startDate: '20 Feb 2026', endDate: '22 Feb 2026', purpose: 'Team Offsite', estimatedCost: '15,000', status: 'COMPLETED' },
];

const PENDING_APPROVALS = [
  { id: '5', employee: 'Rahul Sharma', destination: 'Chennai', dates: '20-22 Mar 2026', purpose: 'Vendor Visit', cost: '18,000' },
  { id: '6', employee: 'Priya Patel', destination: 'Pune', dates: '25-27 Mar 2026', purpose: 'Training', cost: '22,000' },
];

const GUEST_HOUSE_BOOKINGS = [
  { id: '1', location: 'Mumbai Guest House', address: 'Andheri East, Mumbai', checkIn: '15 Mar 2026', checkOut: '18 Mar 2026', rooms: 1, status: 'CONFIRMED', amenities: ['AC', 'WiFi', 'Breakfast', 'Laundry'] },
  { id: '2', location: 'Delhi Guest House', address: 'Connaught Place, Delhi', checkIn: '5 Mar 2026', checkOut: '7 Mar 2026', rooms: 1, status: 'COMPLETED', amenities: ['AC', 'WiFi', 'Breakfast'] },
];

const EXPENSE_CLAIMS = [
  { id: '1', trip: 'Delhi Conference', totalAmount: '32,450', submittedDate: '8 Mar 2026', status: 'PENDING_REVIEW', items: 5 },
  { id: '2', trip: 'Hyderabad Offsite', totalAmount: '14,200', submittedDate: '25 Feb 2026', status: 'APPROVED', items: 4 },
  { id: '3', trip: 'Mumbai Client Visit (Jan)', totalAmount: '28,900', submittedDate: '20 Jan 2026', status: 'REIMBURSED', items: 6 },
];

const TRAVEL_POLICIES = [
  { id: '1', title: 'Domestic Travel Policy', version: 'v3.2', lastUpdated: '15 Jan 2026', description: 'Guidelines for domestic business travel including per diem rates, hotel limits, and booking procedures.' },
  { id: '2', title: 'International Travel Policy', version: 'v2.1', lastUpdated: '1 Feb 2026', description: 'Guidelines for international travel including visa assistance, forex, insurance, and approval workflows.' },
  { id: '3', title: 'Travel Expense Reimbursement Policy', version: 'v4.0', lastUpdated: '1 Mar 2026', description: 'Expense categories, submission timelines, supporting documents, and reimbursement process.' },
  { id: '4', title: 'Guest House Usage Policy', version: 'v1.5', lastUpdated: '10 Dec 2025', description: 'Booking rules, check-in/check-out times, guest policies, and cancellation terms.' },
];

const VISA_REQUESTS = [
  { id: '1', country: 'Singapore', type: 'Business Visa', travelDate: '1 Apr 2026', status: 'PROCESSING', appliedDate: '1 Mar 2026' },
];

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  SUBMITTED: 'bg-blue-100 text-blue-700',
  MANAGER_APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-700',
  COMPLETED: 'bg-teal-100 text-teal-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  PENDING_REVIEW: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REIMBURSED: 'bg-teal-100 text-teal-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
};

export default function TravelPage() {
  const [guestHouseDialogOpen, setGuestHouseDialogOpen] = useState(false);
  const [visaDialogOpen, setVisaDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Travel & Guest House</h1>
          <p className="text-sm text-gray-500">Manage travel requests, guest house bookings, expenses, and visa assistance</p>
        </div>
        <div className="flex gap-2">
          <Link href="/travel/policy">
            <Button variant="outline">Travel Policy</Button>
          </Link>
          <Link href="/travel/request">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus size={16} className="mr-2" /> New Request
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Trips', value: '12', icon: Plane, color: 'text-teal-600 bg-teal-50' },
          { label: 'Pending Approval', value: '2', icon: Calendar, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'This Month Expenses', value: '45,000', icon: IndianRupee, color: 'text-blue-600 bg-blue-50' },
          { label: 'Upcoming Trips', value: '2', icon: MapPin, color: 'text-purple-600 bg-purple-50' },
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

      <Tabs defaultValue="my-requests">
        <TabsList className="flex-wrap">
          <TabsTrigger value="my-requests">My Requests</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="guest-house">Guest House</TabsTrigger>
          <TabsTrigger value="expenses">Expense Claims</TabsTrigger>
          <TabsTrigger value="policies">Travel Policies</TabsTrigger>
          <TabsTrigger value="visa">Visa Assistance</TabsTrigger>
        </TabsList>

        {/* My Requests Tab */}
        <TabsContent value="my-requests">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Plane size={18} className="text-teal-600" />
                My Travel Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {TRAVEL_REQUESTS.map((req) => (
                  <div key={req.id} className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {req.fromCity} → {req.destination}
                        </p>
                        <Badge variant="outline" className="text-xs">{req.type}</Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        {req.startDate} - {req.endDate} &middot; {req.purpose}
                      </p>
                      <p className="text-xs text-gray-500">Estimated: &#8377;{req.estimatedCost}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={STATUS_STYLES[req.status] || ''}>
                        {req.status.replace(/_/g, ' ')}
                      </Badge>
                      <Link href="/travel/expenses">
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {PENDING_APPROVALS.map((req) => (
                  <div key={req.id} className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">{req.employee}</p>
                      <p className="text-xs text-gray-500">
                        {req.destination} &middot; {req.dates} &middot; {req.purpose}
                      </p>
                      <p className="text-xs text-gray-500">Estimated: &#8377;{req.cost}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Reject</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guest House Tab */}
        <TabsContent value="guest-house">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Home size={18} className="text-teal-600" />
                  Guest House Bookings
                </CardTitle>
                <Dialog open={guestHouseDialogOpen} onOpenChange={setGuestHouseDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-teal-600 hover:bg-teal-700">
                      <Plus size={16} className="mr-2" /> Book Guest House
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book Guest House</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Location</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Select guest house" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mumbai">Mumbai Guest House</SelectItem>
                            <SelectItem value="delhi">Delhi Guest House</SelectItem>
                            <SelectItem value="chennai">Chennai Guest House</SelectItem>
                            <SelectItem value="pune">Pune Guest House</SelectItem>
                            <SelectItem value="hyderabad">Hyderabad Guest House</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Check-in Date</Label>
                          <Input type="date" />
                        </div>
                        <div>
                          <Label>Check-out Date</Label>
                          <Input type="date" />
                        </div>
                      </div>
                      <div>
                        <Label>Number of Rooms</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Rooms" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Purpose / Travel Request ID</Label>
                        <Input placeholder="e.g., Client meeting or TR-001" />
                      </div>
                      <div>
                        <Label>Special Requirements</Label>
                        <Textarea placeholder="Any dietary needs, accessibility requirements, etc." />
                      </div>
                      <Button className="w-full bg-teal-600 hover:bg-teal-700">Book Now</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {GUEST_HOUSE_BOOKINGS.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{booking.location}</p>
                        <p className="text-xs text-gray-500">{booking.address}</p>
                      </div>
                      <Badge className={STATUS_STYLES[booking.status] || ''}>{booking.status}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
                      <div>
                        <p className="font-medium text-gray-700">Check-in</p>
                        <p>{booking.checkIn}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Check-out</p>
                        <p>{booking.checkOut}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Rooms</p>
                        <p>{booking.rooms}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1">Amenities:</p>
                      <div className="flex flex-wrap gap-1">
                        {booking.amenities.map((a) => (
                          <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expense Claims Tab */}
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <IndianRupee size={18} className="text-teal-600" />
                  Travel Expense Claims
                </CardTitle>
                <Link href="/travel/expenses">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    <Plus size={16} className="mr-2" /> New Claim
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {EXPENSE_CLAIMS.map((claim) => (
                  <div key={claim.id} className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">{claim.trip}</p>
                      <p className="text-xs text-gray-500">
                        &#8377;{claim.totalAmount} &middot; {claim.items} items &middot; Submitted: {claim.submittedDate}
                      </p>
                    </div>
                    <Badge className={STATUS_STYLES[claim.status] || ''}>
                      {claim.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Travel Policies Tab */}
        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText size={18} className="text-teal-600" />
                Travel Policy Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {TRAVEL_POLICIES.map((policy) => (
                  <div key={policy.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{policy.title}</p>
                          <Badge variant="outline" className="text-xs">{policy.version}</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{policy.description}</p>
                        <p className="text-xs text-gray-400 mt-1">Last updated: {policy.lastUpdated}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileText size={14} className="mr-1" /> View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visa Assistance Tab */}
        <TabsContent value="visa">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe size={18} className="text-teal-600" />
                  Visa Assistance Requests
                </CardTitle>
                <Dialog open={visaDialogOpen} onOpenChange={setVisaDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-teal-600 hover:bg-teal-700">
                      <Plus size={16} className="mr-2" /> New Visa Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Visa Assistance Request</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Destination Country</Label>
                        <Input placeholder="e.g., Singapore, USA, UK" />
                      </div>
                      <div>
                        <Label>Visa Type</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Select visa type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="business">Business Visa</SelectItem>
                            <SelectItem value="conference">Conference Visa</SelectItem>
                            <SelectItem value="work">Work Visa</SelectItem>
                            <SelectItem value="transit">Transit Visa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Travel Start Date</Label>
                          <Input type="date" />
                        </div>
                        <div>
                          <Label>Travel End Date</Label>
                          <Input type="date" />
                        </div>
                      </div>
                      <div>
                        <Label>Purpose of Travel</Label>
                        <Textarea placeholder="Brief description of the purpose..." />
                      </div>
                      <div>
                        <Label>Related Travel Request ID (optional)</Label>
                        <Input placeholder="e.g., TR-003" />
                      </div>
                      <Button className="w-full bg-teal-600 hover:bg-teal-700">Submit Request</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {VISA_REQUESTS.map((req) => (
                  <div key={req.id} className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">{req.country} - {req.type}</p>
                      <p className="text-xs text-gray-500">
                        Travel: {req.travelDate} &middot; Applied: {req.appliedDate}
                      </p>
                    </div>
                    <Badge className={STATUS_STYLES[req.status] || ''}>
                      {req.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                ))}
                {VISA_REQUESTS.length === 0 && (
                  <p className="text-sm text-gray-500 py-4">No visa requests found.</p>
                )}
              </div>

              {/* Hotel/Flight Booking Placeholder */}
              <div className="mt-6 border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                <Hotel size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">Hotel & Flight Booking Integration</p>
                <p className="text-xs text-gray-500 mt-1">Coming soon - Direct booking through preferred travel partners</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
