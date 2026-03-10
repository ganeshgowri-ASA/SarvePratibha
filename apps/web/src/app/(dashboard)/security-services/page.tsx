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
  Shield,
  UserPlus,
  CreditCard,
  Car,
  Phone,
  AlertTriangle,
  Video,
  Plus,
  Clock,
  CheckCircle,
  Users,
  Eye,
  CalendarDays,
} from 'lucide-react';

const VISITORS = [
  { id: '1', name: 'Amit Verma', company: 'TCS', host: 'Rajesh Kumar', purpose: 'Business Meeting', checkIn: '10 Mar 2026, 09:30', checkOut: '10 Mar 2026, 11:00', status: 'CHECKED_OUT', badge: 'V-1042' },
  { id: '2', name: 'Sneha Reddy', company: 'Infosys', host: 'Priya Patel', purpose: 'Interview', checkIn: '10 Mar 2026, 10:00', checkOut: null, status: 'CHECKED_IN', badge: 'V-1043' },
  { id: '3', name: 'Ravi Shankar', company: 'Wipro', host: 'Suresh Menon', purpose: 'Vendor Discussion', checkIn: '10 Mar 2026, 14:00', checkOut: null, status: 'EXPECTED', badge: 'V-1044' },
  { id: '4', name: 'Deepa Nair', company: 'HCL', host: 'Anita Singh', purpose: 'Training', checkIn: '9 Mar 2026, 09:00', checkOut: '9 Mar 2026, 17:30', status: 'CHECKED_OUT', badge: 'V-1041' },
];

const ACCESS_CARDS = [
  { id: '1', employee: 'You', cardNumber: 'AC-5678', zones: ['Main Building', 'Lab', 'Parking'], status: 'ACTIVE', validUntil: '31 Dec 2026' },
];

const PARKING_SLOTS = [
  { id: '1', slot: 'P-234', zone: 'Basement 1', vehicle: 'KA-01-AB-1234', type: 'Car', status: 'ALLOCATED', validUntil: '31 Mar 2026' },
];

const EMERGENCY_CONTACTS = [
  { id: '1', name: 'Security Control Room', phone: '080-1234-5678', ext: '100', available: '24/7' },
  { id: '2', name: 'Fire Emergency', phone: '101', ext: '101', available: '24/7' },
  { id: '3', name: 'Medical Emergency', phone: '108', ext: '108', available: '24/7' },
  { id: '4', name: 'Police', phone: '100', ext: null, available: '24/7' },
  { id: '5', name: 'Facility Manager', phone: '080-1234-5680', ext: '200', available: '9 AM - 6 PM' },
  { id: '6', name: 'IT Helpdesk', phone: '080-1234-5681', ext: '300', available: '9 AM - 9 PM' },
];

const INCIDENTS = [
  { id: '1', type: 'Unauthorized Access', location: 'Server Room - Block B', reportedBy: 'Security Team', date: '8 Mar 2026', status: 'INVESTIGATING', priority: 'HIGH' },
  { id: '2', type: 'Fire Alarm Drill', location: 'Main Building', reportedBy: 'Admin', date: '5 Mar 2026', status: 'RESOLVED', priority: 'MEDIUM' },
  { id: '3', type: 'Tailgating Incident', location: 'Main Entrance', reportedBy: 'Guard', date: '3 Mar 2026', status: 'RESOLVED', priority: 'LOW' },
];

const CCTV_REQUESTS = [
  { id: '1', location: 'Parking Lot - Gate 2', dateRange: '5 Mar - 5 Mar 2026', reason: 'Vehicle damage investigation', status: 'APPROVED', requestedBy: 'You' },
  { id: '2', location: 'Floor 3 - Corridor', dateRange: '7 Mar - 7 Mar 2026', reason: 'Lost property', status: 'PENDING', requestedBy: 'You' },
];

const VISITOR_STATUS_STYLES: Record<string, string> = {
  CHECKED_IN: 'bg-green-100 text-green-700',
  CHECKED_OUT: 'bg-gray-100 text-gray-700',
  EXPECTED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const INCIDENT_STATUS_STYLES: Record<string, string> = {
  REPORTED: 'bg-blue-100 text-blue-700',
  INVESTIGATING: 'bg-yellow-100 text-yellow-700',
  RESOLVED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-700',
};

const PRIORITY_STYLES: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-blue-100 text-blue-600',
  HIGH: 'bg-orange-100 text-orange-600',
  CRITICAL: 'bg-red-100 text-red-600',
};

export default function SecurityServicesPage() {
  const [visitorDialogOpen, setVisitorDialogOpen] = useState(false);
  const [incidentDialogOpen, setIncidentDialogOpen] = useState(false);
  const [cctvDialogOpen, setCctvDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Services</h1>
          <p className="text-sm text-gray-500">Visitor management, access control, and security operations</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Visitors Today', value: '3', icon: Users, color: 'text-teal-600 bg-teal-50' },
          { label: 'Active Access Cards', value: '1', icon: CreditCard, color: 'text-blue-600 bg-blue-50' },
          { label: 'Open Incidents', value: '1', icon: AlertTriangle, color: 'text-orange-600 bg-orange-50' },
          { label: 'CCTV Requests', value: '1', icon: Video, color: 'text-purple-600 bg-purple-50' },
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

      <Tabs defaultValue="visitors">
        <TabsList>
          <TabsTrigger value="visitors">Visitor Management</TabsTrigger>
          <TabsTrigger value="access">Access Cards</TabsTrigger>
          <TabsTrigger value="parking">Parking</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="cctv">CCTV Access</TabsTrigger>
        </TabsList>

        {/* Visitors Tab */}
        <TabsContent value="visitors">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <UserPlus size={18} className="text-teal-600" />
                  Visitor Log
                </CardTitle>
                <Dialog open={visitorDialogOpen} onOpenChange={setVisitorDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-teal-600 hover:bg-teal-700">
                      <Plus size={16} className="mr-2" /> Register Visitor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Register Visitor</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Visitor Name</Label>
                          <Input placeholder="Full name" />
                        </div>
                        <div>
                          <Label>Company</Label>
                          <Input placeholder="Company name" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Phone</Label>
                          <Input placeholder="Mobile number" />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input type="email" placeholder="Email address" />
                        </div>
                      </div>
                      <div>
                        <Label>Purpose of Visit</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Select purpose" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="meeting">Business Meeting</SelectItem>
                            <SelectItem value="interview">Interview</SelectItem>
                            <SelectItem value="vendor">Vendor Visit</SelectItem>
                            <SelectItem value="delivery">Delivery</SelectItem>
                            <SelectItem value="personal">Personal</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Expected Date</Label>
                          <Input type="date" />
                        </div>
                        <div>
                          <Label>Expected Time</Label>
                          <Input type="time" />
                        </div>
                      </div>
                      <div>
                        <Label>Additional Notes</Label>
                        <Textarea placeholder="Any special requirements or notes..." />
                      </div>
                      <Button className="w-full bg-teal-600 hover:bg-teal-700">Register Visitor</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {VISITORS.map((visitor) => (
                  <div key={visitor.id} className="flex items-center justify-between py-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-full ${
                        visitor.status === 'CHECKED_IN' ? 'bg-green-100' :
                        visitor.status === 'EXPECTED' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Eye size={16} className={
                          visitor.status === 'CHECKED_IN' ? 'text-green-600' :
                          visitor.status === 'EXPECTED' ? 'text-blue-600' : 'text-gray-600'
                        } />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">{visitor.name}</p>
                        <p className="text-xs text-gray-500">
                          {visitor.company} &middot; Host: {visitor.host} &middot; {visitor.purpose}
                        </p>
                        <p className="text-xs text-gray-500">
                          Badge: {visitor.badge} &middot; In: {visitor.checkIn}
                          {visitor.checkOut && <> &middot; Out: {visitor.checkOut}</>}
                        </p>
                      </div>
                    </div>
                    <Badge className={VISITOR_STATUS_STYLES[visitor.status] || ''}>
                      {visitor.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access Cards Tab */}
        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard size={18} className="text-teal-600" />
                My Access Cards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ACCESS_CARDS.map((card) => (
                  <div key={card.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Card: {card.cardNumber}</p>
                        <p className="text-xs text-gray-500">Valid until: {card.validUntil}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">{card.status}</Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Authorized Zones:</p>
                      <div className="flex flex-wrap gap-2">
                        {card.zones.map((zone) => (
                          <Badge key={zone} variant="outline" className="text-xs">{zone}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parking Tab */}
        <TabsContent value="parking">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Car size={18} className="text-teal-600" />
                Parking Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {PARKING_SLOTS.map((slot) => (
                  <div key={slot.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Slot: {slot.slot}</p>
                        <p className="text-xs text-gray-500">Zone: {slot.zone}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">{slot.status}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
                      <div>
                        <p className="font-medium text-gray-700">Vehicle</p>
                        <p>{slot.vehicle}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Type</p>
                        <p>{slot.type}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Valid Until</p>
                        <p>{slot.validUntil}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Contacts Tab */}
        <TabsContent value="emergency">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Phone size={18} className="text-teal-600" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {EMERGENCY_CONTACTS.map((contact) => (
                  <div key={contact.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                    <p className="text-sm text-teal-600 font-medium mt-1">{contact.phone}</p>
                    {contact.ext && <p className="text-xs text-gray-500">Ext: {contact.ext}</p>}
                    <div className="flex items-center gap-1 mt-2">
                      <Clock size={12} className="text-gray-400" />
                      <p className="text-xs text-gray-500">{contact.available}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Incidents Tab */}
        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle size={18} className="text-teal-600" />
                  Security Incidents
                </CardTitle>
                <Dialog open={incidentDialogOpen} onOpenChange={setIncidentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-teal-600 hover:bg-teal-700">
                      <Plus size={16} className="mr-2" /> Report Incident
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report Security Incident</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Incident Type</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unauthorized_access">Unauthorized Access</SelectItem>
                            <SelectItem value="theft">Theft / Missing Property</SelectItem>
                            <SelectItem value="fire">Fire / Fire Alarm</SelectItem>
                            <SelectItem value="accident">Accident / Injury</SelectItem>
                            <SelectItem value="suspicious">Suspicious Activity</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input placeholder="e.g., Floor 3, Block B" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Date</Label>
                          <Input type="date" />
                        </div>
                        <div>
                          <Label>Time</Label>
                          <Input type="time" />
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea placeholder="Detailed description of the incident..." />
                      </div>
                      <div>
                        <Label>Priority</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full bg-teal-600 hover:bg-teal-700">Submit Report</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {INCIDENTS.map((incident) => (
                  <div key={incident.id} className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">{incident.type}</p>
                      <p className="text-xs text-gray-500">
                        {incident.location} &middot; Reported by: {incident.reportedBy} &middot; {incident.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={PRIORITY_STYLES[incident.priority] || ''}>{incident.priority}</Badge>
                      <Badge className={INCIDENT_STATUS_STYLES[incident.status] || ''}>
                        {incident.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CCTV Tab */}
        <TabsContent value="cctv">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Video size={18} className="text-teal-600" />
                  CCTV Access Requests
                </CardTitle>
                <Dialog open={cctvDialogOpen} onOpenChange={setCctvDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-teal-600 hover:bg-teal-700">
                      <Plus size={16} className="mr-2" /> Request Access
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request CCTV Access</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Camera Location</Label>
                        <Input placeholder="e.g., Parking Lot - Gate 2" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>From Date</Label>
                          <Input type="date" />
                        </div>
                        <div>
                          <Label>To Date</Label>
                          <Input type="date" />
                        </div>
                      </div>
                      <div>
                        <Label>Time Range</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <Input type="time" />
                          <Input type="time" />
                        </div>
                      </div>
                      <div>
                        <Label>Reason</Label>
                        <Textarea placeholder="Reason for requesting CCTV footage..." />
                      </div>
                      <Button className="w-full bg-teal-600 hover:bg-teal-700">Submit Request</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {CCTV_REQUESTS.map((req) => (
                  <div key={req.id} className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">{req.location}</p>
                      <p className="text-xs text-gray-500">
                        {req.dateRange} &middot; {req.reason}
                      </p>
                    </div>
                    <Badge className={req.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                      {req.status}
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
