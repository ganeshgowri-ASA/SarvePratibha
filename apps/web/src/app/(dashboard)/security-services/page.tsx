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
  Users,
  History,
  UserCheck,
  LogOut,
} from 'lucide-react';
import { VisitorRegistrationForm } from './components/visitor-registration-form';
import { IdCardIssuance } from './components/id-card-issuance';
import { VisitorLogDashboard } from './components/visitor-log-dashboard';
import { GatePassHistory } from './components/gate-pass-history';
import {
  ACCESS_CARDS,
  PARKING_SLOTS,
  EMERGENCY_CONTACTS,
  INCIDENTS,
  CCTV_REQUESTS,
  VISITORS_DATA,
} from './components/demo-data';

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

  const currentlyIn = VISITORS_DATA.filter((v) => v.status === 'CHECKED_IN').length;
  const totalToday = VISITORS_DATA.filter((v) => v.createdAt.includes('10 Mar 2026')).length;
  const expected = VISITORS_DATA.filter((v) => v.status === 'EXPECTED').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Services</h1>
          <p className="text-sm text-gray-500">Visitor management, entry passes, access control, and security operations</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Currently In', value: String(currentlyIn), icon: UserCheck, color: 'text-green-600 bg-green-50' },
          { label: 'Total Today', value: String(totalToday), icon: Users, color: 'text-teal-600 bg-teal-50' },
          { label: 'Expected', value: String(expected), icon: Clock, color: 'text-blue-600 bg-blue-50' },
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

      <Tabs defaultValue="visitor-pass">
        <TabsList className="flex-wrap">
          <TabsTrigger value="visitor-pass">
            <UserPlus size={14} className="mr-1.5" /> Visitor Entry Pass
          </TabsTrigger>
          <TabsTrigger value="id-cards">
            <CreditCard size={14} className="mr-1.5" /> ID Card Issuance
          </TabsTrigger>
          <TabsTrigger value="visitor-log">
            <Users size={14} className="mr-1.5" /> Visitor Log
          </TabsTrigger>
          <TabsTrigger value="gate-history">
            <History size={14} className="mr-1.5" /> Gate Pass History
          </TabsTrigger>
          <TabsTrigger value="access">Access Cards</TabsTrigger>
          <TabsTrigger value="parking">Parking</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="cctv">CCTV</TabsTrigger>
        </TabsList>

        {/* Visitor Entry Pass Tab */}
        <TabsContent value="visitor-pass">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <UserPlus size={18} className="text-teal-600" />
                  Visitor Entry Pass Registration
                </CardTitle>
                <VisitorRegistrationForm open={visitorDialogOpen} onOpenChange={setVisitorDialogOpen} />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Register new visitors with comprehensive details including ID verification, material declaration, and area access.
              </p>
            </CardHeader>
            <CardContent>
              {/* Quick overview of recent registrations */}
              <div className="space-y-3">
                {VISITORS_DATA.slice(0, 4).map((visitor) => (
                  <div key={visitor.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        visitor.visitorType === 'relative' ? 'bg-blue-100' : 'bg-red-100'
                      }`}>
                        <UserPlus size={16} className={
                          visitor.visitorType === 'relative' ? 'text-blue-600' : 'text-red-600'
                        } />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{visitor.name}</p>
                          <Badge className={visitor.visitorType === 'relative' ? 'bg-blue-100 text-blue-700 text-[10px]' : 'bg-red-100 text-red-700 text-[10px]'}>
                            {visitor.visitorType === 'relative' ? 'Relative' : 'External'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {visitor.company} &middot; Purpose: {visitor.purpose} &middot; Host: {visitor.hostEmployee}
                        </p>
                        <p className="text-xs text-gray-500">
                          Pass: <span className="font-mono font-medium text-teal-700">{visitor.passId}</span> &middot;
                          Area: {visitor.area.building}, {visitor.area.floor} Floor, Wing {visitor.area.wing}
                        </p>
                        {visitor.materials.length > 0 && (
                          <p className="text-xs text-gray-400">
                            Materials: {visitor.materials.map((m) => m.type).join(', ')}
                          </p>
                        )}
                        {visitor.vehicle && (
                          <p className="text-xs text-gray-400">
                            Vehicle: {visitor.vehicle.type} — {visitor.vehicle.number}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={
                        visitor.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        visitor.approvalStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }>
                        {visitor.approvalStatus}
                      </Badge>
                      <Badge className={
                        visitor.status === 'CHECKED_IN' ? 'bg-green-100 text-green-700' :
                        visitor.status === 'EXPECTED' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {visitor.status.replace(/_/g, ' ')}
                      </Badge>
                      <span className="text-[10px] text-gray-400">
                        Registered: {visitor.createdAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ID Card Issuance Tab */}
        <TabsContent value="id-cards">
          <IdCardIssuance />
        </TabsContent>

        {/* Visitor Log Dashboard Tab */}
        <TabsContent value="visitor-log">
          <VisitorLogDashboard />
        </TabsContent>

        {/* Gate Pass History Tab */}
        <TabsContent value="gate-history">
          <GatePassHistory />
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
