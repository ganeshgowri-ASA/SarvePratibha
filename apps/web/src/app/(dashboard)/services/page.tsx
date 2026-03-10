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
  Building2,
  UtensilsCrossed,
  Pencil,
  Truck,
  Wrench,
  Calendar,
  Bus,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
} from 'lucide-react';
import Link from 'next/link';

const CAFETERIA_MENU = [
  { id: '1', day: 'Monday', breakfast: 'Idli, Vada, Sambar', lunch: 'Rice, Dal, Chicken Curry, Salad', snacks: 'Tea, Biscuits, Samosa' },
  { id: '2', day: 'Tuesday', breakfast: 'Poha, Upma, Chutney', lunch: 'Biryani, Raita, Paneer Butter Masala', snacks: 'Coffee, Cake, Pakora' },
  { id: '3', day: 'Wednesday', breakfast: 'Dosa, Chutney, Sambar', lunch: 'Chapati, Rajma, Mixed Veg, Curd Rice', snacks: 'Tea, Sandwich' },
  { id: '4', day: 'Thursday', breakfast: 'Bread Toast, Omelette, Juice', lunch: 'Rice, Sambar, Fish Fry, Papad', snacks: 'Coffee, Biscuits, Bhel' },
  { id: '5', day: 'Friday', breakfast: 'Aloo Paratha, Curd, Pickle', lunch: 'Pulao, Dal Makhani, Paneer Tikka', snacks: 'Tea, Cake, Vada Pav' },
];

const MEAL_BOOKINGS = [
  { id: '1', date: '10 Mar 2026', meal: 'Lunch', preference: 'Veg', status: 'CONFIRMED' },
  { id: '2', date: '11 Mar 2026', meal: 'Lunch', preference: 'Non-Veg', status: 'CONFIRMED' },
  { id: '3', date: '12 Mar 2026', meal: 'Lunch', preference: 'Veg', status: 'PENDING' },
];

const STATIONERY_REQUESTS = [
  { id: '1', items: 'Notebook (3), Pens (5), Stapler (1)', status: 'DELIVERED', requested: '3 Mar 2026', delivered: '5 Mar 2026' },
  { id: '2', items: 'Whiteboard Markers (4), Sticky Notes (2)', status: 'PROCESSING', requested: '8 Mar 2026', delivered: null },
];

const COURIER_SERVICES = [
  { id: '1', type: 'Outgoing', recipient: 'Client - Mumbai Office', tracking: 'CRR-78901', status: 'IN_TRANSIT', date: '9 Mar 2026' },
  { id: '2', type: 'Incoming', sender: 'Vendor - Delhi', tracking: 'CRR-78856', status: 'DELIVERED', date: '7 Mar 2026' },
  { id: '3', type: 'Outgoing', recipient: 'Branch - Pune', tracking: 'CRR-78945', status: 'PENDING_PICKUP', date: '10 Mar 2026' },
];

const MAINTENANCE_REQUESTS = [
  { id: '1', issue: 'AC not cooling in Conference Room 3B', location: 'Floor 3, Block B', priority: 'HIGH', status: 'IN_PROGRESS', created: '8 Mar 2026', assignedTo: 'Facilities Team' },
  { id: '2', issue: 'Broken chair - workstation 4C-12', location: 'Floor 4, Block C', priority: 'LOW', status: 'OPEN', created: '9 Mar 2026', assignedTo: null },
  { id: '3', issue: 'Water leakage in restroom', location: 'Floor 2, Block A', priority: 'HIGH', status: 'RESOLVED', created: '5 Mar 2026', assignedTo: 'Plumbing Team' },
];

const EVENTS = [
  { id: '1', name: 'Annual Day Celebration', date: '25 Mar 2026', time: '5:00 PM', venue: 'Auditorium', organizer: 'HR Team', registrations: 150, capacity: 200 },
  { id: '2', name: 'Tech Talk: AI in HR', date: '15 Mar 2026', time: '3:00 PM', venue: 'Conference Hall A', organizer: 'L&D Team', registrations: 45, capacity: 60 },
  { id: '3', name: 'Cricket Tournament Registration', date: '20 Mar 2026', time: '6:00 AM', venue: 'Sports Ground', organizer: 'Sports Club', registrations: 80, capacity: 100 },
];

const TRANSPORT_SCHEDULE = [
  { id: '1', route: 'Route 1: Electronic City → Whitefield', departure: '8:00 AM', arrival: '9:15 AM', bus: 'SP-BUS-01', seats: 40, available: 12 },
  { id: '2', route: 'Route 2: Koramangala → Manyata Tech Park', departure: '8:15 AM', arrival: '9:30 AM', bus: 'SP-BUS-02', seats: 40, available: 8 },
  { id: '3', route: 'Route 3: HSR Layout → ITPL', departure: '8:30 AM', arrival: '9:45 AM', bus: 'SP-BUS-03', seats: 40, available: 15 },
  { id: '4', route: 'Route 4: Jayanagar → Electronic City', departure: '7:45 AM', arrival: '9:00 AM', bus: 'SP-BUS-04', seats: 40, available: 5 },
];

const STATUS_STYLES: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  PROCESSING: 'bg-yellow-100 text-yellow-700',
  RESOLVED: 'bg-green-100 text-green-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-700',
  PENDING: 'bg-blue-100 text-blue-700',
  PENDING_PICKUP: 'bg-orange-100 text-orange-700',
  IN_TRANSIT: 'bg-purple-100 text-purple-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const PRIORITY_STYLES: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-blue-100 text-blue-600',
  HIGH: 'bg-orange-100 text-orange-600',
  CRITICAL: 'bg-red-100 text-red-600',
};

export default function ServicesPage() {
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);
  const [stationeryDialogOpen, setStationeryDialogOpen] = useState(false);
  const [courierDialogOpen, setCourierDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Corporate Services</h1>
          <p className="text-sm text-gray-500">Cafeteria, stationery, courier, maintenance, events, and transport</p>
        </div>
        <Link href="/services/request">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus size={16} className="mr-2" /> New Request
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Requests', value: '3', icon: Building2, color: 'text-teal-600 bg-teal-50' },
          { label: 'Upcoming Events', value: '3', icon: Calendar, color: 'text-purple-600 bg-purple-50' },
          { label: 'Meal Bookings', value: '3', icon: UtensilsCrossed, color: 'text-orange-600 bg-orange-50' },
          { label: 'Pending Maintenance', value: '1', icon: Wrench, color: 'text-yellow-600 bg-yellow-50' },
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

      <Tabs defaultValue="cafeteria">
        <TabsList className="flex-wrap">
          <TabsTrigger value="cafeteria">Cafeteria</TabsTrigger>
          <TabsTrigger value="stationery">Stationery</TabsTrigger>
          <TabsTrigger value="courier">Courier/Mail</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="transport">Transport</TabsTrigger>
        </TabsList>

        {/* Cafeteria Tab */}
        <TabsContent value="cafeteria">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <UtensilsCrossed size={18} className="text-teal-600" />
                  Weekly Menu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4 font-medium text-gray-700">Day</th>
                        <th className="text-left py-2 pr-4 font-medium text-gray-700">Breakfast</th>
                        <th className="text-left py-2 pr-4 font-medium text-gray-700">Lunch</th>
                        <th className="text-left py-2 font-medium text-gray-700">Snacks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CAFETERIA_MENU.map((menu) => (
                        <tr key={menu.id} className="border-b last:border-0">
                          <td className="py-3 pr-4 font-medium text-gray-900">{menu.day}</td>
                          <td className="py-3 pr-4 text-gray-600">{menu.breakfast}</td>
                          <td className="py-3 pr-4 text-gray-600">{menu.lunch}</td>
                          <td className="py-3 text-gray-600">{menu.snacks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar size={18} className="text-teal-600" />
                  My Meal Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {MEAL_BOOKINGS.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between py-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">{booking.date} - {booking.meal}</p>
                        <p className="text-xs text-gray-500">Preference: {booking.preference}</p>
                      </div>
                      <Badge className={STATUS_STYLES[booking.status] || ''}>{booking.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Stationery Tab */}
        <TabsContent value="stationery">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Pencil size={18} className="text-teal-600" />
                  Stationery Requests
                </CardTitle>
                <Dialog open={stationeryDialogOpen} onOpenChange={setStationeryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-teal-600 hover:bg-teal-700">
                      <Plus size={16} className="mr-2" /> New Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request Stationery</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Items Required</Label>
                        <Textarea placeholder="e.g., Notebook x3, Blue Pen x5, Stapler x1" />
                      </div>
                      <div>
                        <Label>Delivery Location</Label>
                        <Input placeholder="e.g., Floor 3, Desk 4C-12" />
                      </div>
                      <div>
                        <Label>Urgency</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Select urgency" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal (2-3 days)</SelectItem>
                            <SelectItem value="urgent">Urgent (Same day)</SelectItem>
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
              <div className="divide-y">
                {STATIONERY_REQUESTS.map((req) => (
                  <div key={req.id} className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">{req.items}</p>
                      <p className="text-xs text-gray-500">
                        Requested: {req.requested}
                        {req.delivered && <> &middot; Delivered: {req.delivered}</>}
                      </p>
                    </div>
                    <Badge className={STATUS_STYLES[req.status] || ''}>{req.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Courier Tab */}
        <TabsContent value="courier">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Truck size={18} className="text-teal-600" />
                  Courier & Mail Services
                </CardTitle>
                <Dialog open={courierDialogOpen} onOpenChange={setCourierDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-teal-600 hover:bg-teal-700">
                      <Plus size={16} className="mr-2" /> Send Courier
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Courier</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Recipient Name</Label>
                        <Input placeholder="Recipient name" />
                      </div>
                      <div>
                        <Label>Delivery Address</Label>
                        <Textarea placeholder="Full delivery address" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Package Type</Label>
                          <Select>
                            <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="document">Document</SelectItem>
                              <SelectItem value="parcel">Parcel</SelectItem>
                              <SelectItem value="fragile">Fragile</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Priority</Label>
                          <Select>
                            <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="express">Express</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Notes</Label>
                        <Input placeholder="Any special instructions" />
                      </div>
                      <Button className="w-full bg-teal-600 hover:bg-teal-700">Submit Request</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {COURIER_SERVICES.map((courier) => (
                  <div key={courier.id} className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{courier.type}</Badge>
                        <p className="text-sm font-medium text-gray-900">
                          {courier.type === 'Outgoing' ? `To: ${courier.recipient}` : `From: ${courier.sender}`}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        Tracking: {courier.tracking} &middot; {courier.date}
                      </p>
                    </div>
                    <Badge className={STATUS_STYLES[courier.status] || ''}>
                      {courier.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Wrench size={18} className="text-teal-600" />
                  Facility Maintenance Requests
                </CardTitle>
                <Dialog open={maintenanceDialogOpen} onOpenChange={setMaintenanceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-teal-600 hover:bg-teal-700">
                      <Plus size={16} className="mr-2" /> Report Issue
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report Maintenance Issue</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Issue Category</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electrical">Electrical</SelectItem>
                            <SelectItem value="plumbing">Plumbing</SelectItem>
                            <SelectItem value="hvac">HVAC / Air Conditioning</SelectItem>
                            <SelectItem value="furniture">Furniture</SelectItem>
                            <SelectItem value="cleaning">Cleaning</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input placeholder="e.g., Floor 3, Conference Room 3B" />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea placeholder="Describe the issue in detail..." />
                      </div>
                      <div>
                        <Label>Priority</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical (Safety Hazard)</SelectItem>
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
              <div className="divide-y">
                {MAINTENANCE_REQUESTS.map((req) => (
                  <div key={req.id} className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">{req.issue}</p>
                      <p className="text-xs text-gray-500">
                        {req.location} &middot; Created: {req.created}
                        {req.assignedTo && <> &middot; Assigned: {req.assignedTo}</>}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={PRIORITY_STYLES[req.priority] || ''}>{req.priority}</Badge>
                      <Badge className={STATUS_STYLES[req.status] || ''}>
                        {req.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar size={18} className="text-teal-600" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {EVENTS.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <p className="text-sm font-medium text-gray-900">{event.name}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} /> {event.date} at {event.time}
                      </p>
                      <p className="text-xs text-gray-500">Venue: {event.venue}</p>
                      <p className="text-xs text-gray-500">Organizer: {event.organizer}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xs text-teal-600">{event.registrations}/{event.capacity} registered</p>
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-xs">Register</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transport Tab */}
        <TabsContent value="transport">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bus size={18} className="text-teal-600" />
                Company Transport Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {TRANSPORT_SCHEDULE.map((route) => (
                  <div key={route.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{route.route}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={12} /> Departure: {route.departure}
                          </p>
                          <p className="text-xs text-gray-500">Arrival: {route.arrival}</p>
                          <p className="text-xs text-gray-500">Bus: {route.bus}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{route.available}/{route.seats} seats available</p>
                        <Button size="sm" className="mt-1 bg-teal-600 hover:bg-teal-700 text-xs" disabled={route.available === 0}>
                          Book Seat
                        </Button>
                      </div>
                    </div>
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
