'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2, Circle, User, Calendar, Building2,
  Home, Plane, Laptop, Users, MapPin, Hotel, Car,
  Wifi, CreditCard, Mail, Shield, Phone, Clock,
  Star, Coffee, UtensilsCrossed, BedDouble,
} from 'lucide-react';

// --- Demo Data ---

const EMPLOYEE = {
  name: 'Arjun Reddy',
  employeeId: 'EMP-2026-045',
  department: 'Engineering',
  designation: 'Software Engineer',
  dateOfJoining: '2026-03-01',
  manager: 'Priya Sharma',
  relocatingFrom: 'Hyderabad',
  relocatingTo: 'Bengaluru',
};

const TASKS = [
  { id: '1', title: 'Welcome Kit Distribution', category: 'IT_SETUP', description: 'Laptop, headset, mouse, keyboard', isCompleted: true, completedAt: '2026-03-01' },
  { id: '2', title: 'ID Card & Access Badge', category: 'IT_SETUP', description: 'Employee ID card and building access', isCompleted: true, completedAt: '2026-03-01' },
  { id: '3', title: 'System Account Setup', category: 'IT_SETUP', description: 'Email, Slack, Jira, GitHub access', isCompleted: true, completedAt: '2026-03-01' },
  { id: '4', title: 'HR Document Submission', category: 'HR_DOCS', description: 'Aadhaar, PAN, bank details, photo', isCompleted: true, completedAt: '2026-03-02' },
  { id: '5', title: 'Benefits Enrollment', category: 'HR_DOCS', description: 'Health insurance, PF nomination', isCompleted: true, completedAt: '2026-03-03' },
  { id: '6', title: 'Policy Acknowledgement', category: 'COMPLIANCE', description: 'Read and acknowledge all company policies', isCompleted: true, completedAt: '2026-03-03' },
  { id: '7', title: 'Team Introduction', category: 'ORIENTATION', description: 'Meet the team and key stakeholders', isCompleted: false },
  { id: '8', title: 'Product Walkthrough', category: 'TRAINING', description: 'Comprehensive product and architecture overview', isCompleted: false },
  { id: '9', title: 'Development Environment Setup', category: 'TRAINING', description: 'Set up local dev environment and run the app', isCompleted: false },
  { id: '10', title: '30-Day Check-in', category: 'REVIEW', description: 'First month review with manager', isCompleted: false, dueDate: '2026-04-01' },
];

const CATEGORIES = ['IT_SETUP', 'HR_DOCS', 'COMPLIANCE', 'ORIENTATION', 'TRAINING', 'REVIEW'];
const CATEGORY_LABELS: Record<string, string> = {
  IT_SETUP: 'IT Setup',
  HR_DOCS: 'HR Documents',
  COMPLIANCE: 'Compliance',
  ORIENTATION: 'Orientation',
  TRAINING: 'Training',
  REVIEW: 'Review',
};

const RELOCATION_DATA = {
  allowance: '₹1,50,000',
  status: 'Approved',
  movingCompanies: [
    { name: 'Agarwal Packers & Movers', phone: '+91 98765 43210', rating: 4.5 },
    { name: 'Leo Packers', phone: '+91 87654 32109', rating: 4.2 },
  ],
  cityGuide: {
    city: 'Bengaluru',
    neighborhoods: ['Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield'],
    avgRent: '₹20,000 - ₹35,000/month (2BHK)',
    transport: 'Metro (Purple & Green lines), BMTC buses, Namma Yatri',
    highlights: 'IT hub, pleasant weather, vibrant food scene',
  },
  tempAccommodation: [
    { name: 'Company Guest House - Koramangala', type: 'Guest House', available: true },
    { name: 'OYO Townhouse - HSR Layout', type: 'Service Apartment', available: true },
    { name: 'Staybridge Suites - Whitefield', type: 'Hotel', available: false },
  ],
};

const GUEST_HOUSE_DATA = {
  bookingStatus: 'Confirmed',
  property: 'Company Guest House - Koramangala',
  roomType: 'Single Occupancy - AC',
  checkIn: '2026-02-28',
  checkOut: '2026-03-15',
  mealPlan: 'Full Board (Breakfast + Lunch + Dinner)',
  roomTypes: ['Single Occupancy - AC', 'Double Occupancy - AC', 'Suite'],
  mealPlans: ['Breakfast Only', 'Half Board (Breakfast + Dinner)', 'Full Board (Breakfast + Lunch + Dinner)'],
};

const TRAVEL_DATA = {
  flight: {
    type: 'Flight',
    route: 'Hyderabad (HYD) → Bengaluru (BLR)',
    date: '2026-02-28',
    time: '10:30 AM',
    airline: 'IndiGo 6E-204',
    status: 'Booked',
    pnr: 'ABC123',
  },
  airportPickup: {
    arranged: true,
    driver: 'Ramesh Kumar',
    phone: '+91 99887 76655',
    vehicleType: 'Sedan',
  },
  transportCard: {
    type: 'Namma Metro Smart Card',
    status: 'Ready for Collection',
    balance: '₹500 (pre-loaded)',
  },
  reimbursement: {
    maxAmount: '₹15,000',
    status: 'Form Pending',
    documentsRequired: ['Flight tickets', 'Taxi receipts', 'Luggage transport bills'],
  },
};

const IT_SETUP_DATA = [
  { item: 'Laptop Provisioning', description: 'MacBook Pro 14" M3 Pro', status: 'Delivered', icon: Laptop },
  { item: 'Email Account', description: 'arjun.reddy@sarvepratibha.com', status: 'Active', icon: Mail },
  { item: 'Software Access', description: 'Jira, GitHub, Slack, Figma, AWS Console', status: 'Granted', icon: Shield },
  { item: 'VPN Setup', description: 'GlobalProtect VPN configured', status: 'Configured', icon: Wifi },
  { item: 'Badge / ID Card', description: 'Employee ID + Building Access', status: 'Pending Collection', icon: CreditCard },
];

const BUDDY_DATA = {
  name: 'Kavitha Sundaram',
  employeeId: 'EMP-2024-023',
  designation: 'Senior Software Engineer',
  department: 'Engineering',
  email: 'kavitha.s@sarvepratibha.com',
  phone: '+91 98765 12345',
  introMeeting: { date: '2026-03-01', time: '11:00 AM', location: 'Meeting Room - Orchid' },
  checkIns: [
    { label: '30-Day Check-in', date: '2026-04-01', status: 'Scheduled' },
    { label: '60-Day Check-in', date: '2026-05-01', status: 'Upcoming' },
    { label: '90-Day Check-in', date: '2026-06-01', status: 'Upcoming' },
  ],
};

const MILESTONES = [
  {
    phase: 'Day 1',
    items: [
      { task: 'Welcome & office tour', completed: true },
      { task: 'IT setup & system access', completed: true },
      { task: 'Meet your buddy', completed: true },
      { task: 'HR document submission', completed: true },
    ],
  },
  {
    phase: 'Week 1',
    items: [
      { task: 'Team introductions complete', completed: false },
      { task: 'Product walkthrough attended', completed: false },
      { task: 'Dev environment setup', completed: false },
      { task: 'First standup participation', completed: false },
    ],
  },
  {
    phase: 'Month 1',
    items: [
      { task: 'First code commit / deliverable', completed: false },
      { task: 'Complete all compliance trainings', completed: false },
      { task: '30-day check-in with manager', completed: false },
      { task: 'Buddy feedback session', completed: false },
    ],
  },
  {
    phase: 'Month 3',
    items: [
      { task: 'Independent task ownership', completed: false },
      { task: 'Cross-team collaboration initiated', completed: false },
      { task: '90-day performance review', completed: false },
      { task: 'Probation confirmation', completed: false },
    ],
  },
];

// --- Helper Components ---

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Approved: 'bg-green-100 text-green-700',
    Confirmed: 'bg-green-100 text-green-700',
    Booked: 'bg-green-100 text-green-700',
    Active: 'bg-green-100 text-green-700',
    Delivered: 'bg-green-100 text-green-700',
    Granted: 'bg-green-100 text-green-700',
    Configured: 'bg-blue-100 text-blue-700',
    Scheduled: 'bg-blue-100 text-blue-700',
    Upcoming: 'bg-gray-100 text-gray-600',
    'Ready for Collection': 'bg-yellow-100 text-yellow-700',
    'Pending Collection': 'bg-yellow-100 text-yellow-700',
    'Form Pending': 'bg-orange-100 text-orange-700',
  };
  return <Badge className={colors[status] || 'bg-gray-100 text-gray-600'}>{status}</Badge>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

// --- Main Page ---

export default function OnboardingDetailPage() {
  const completed = TASKS.filter((t) => t.isCompleted).length;
  const progress = Math.round((completed / TASKS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Employee Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-teal-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{EMPLOYEE.name}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                <span>{EMPLOYEE.employeeId}</span>
                <span className="flex items-center gap-1"><Building2 size={12} /> {EMPLOYEE.department}</span>
                <span>{EMPLOYEE.designation}</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> Joined {EMPLOYEE.dateOfJoining}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Onboarding Progress</span>
            <span className="text-sm font-bold text-teal-600">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-gray-500 mt-2">{completed} of {TASKS.length} tasks completed</p>
        </CardContent>
      </Card>

      {/* Tabbed Sections */}
      <Tabs defaultValue="checklist" className="w-full">
        <TabsList className="w-full grid grid-cols-4 md:grid-cols-7">
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="relocation">Relocation</TabsTrigger>
          <TabsTrigger value="guesthouse">Guest House</TabsTrigger>
          <TabsTrigger value="travel">Travel</TabsTrigger>
          <TabsTrigger value="itsetup">IT Setup</TabsTrigger>
          <TabsTrigger value="buddy">Buddy</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>

        {/* Checklist Tab */}
        <TabsContent value="checklist" className="space-y-4">
          {CATEGORIES.map((cat) => {
            const catTasks = TASKS.filter((t) => t.category === cat);
            if (catTasks.length === 0) return null;
            return (
              <Card key={cat}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{CATEGORY_LABELS[cat]}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {catTasks.map((task) => (
                    <div key={task.id} className={`flex items-center justify-between p-3 rounded-lg border ${task.isCompleted ? 'bg-green-50/50 border-green-200' : 'hover:bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        {task.isCompleted ? (
                          <CheckCircle2 size={20} className="text-green-500" fill="currentColor" />
                        ) : (
                          <Circle size={20} className="text-gray-300" />
                        )}
                        <div>
                          <p className={`text-sm ${task.isCompleted ? 'text-gray-500 line-through' : 'font-medium text-gray-900'}`}>
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-400">{task.description}</p>
                        </div>
                      </div>
                      {task.isCompleted ? (
                        <span className="text-xs text-green-600">{task.completedAt}</span>
                      ) : (
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Complete</Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Relocation Assistance Tab */}
        <TabsContent value="relocation" className="space-y-4">
          {/* Allowance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Home size={18} className="text-teal-600" /> Relocation Allowance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-teal-50 border border-teal-200">
                <div>
                  <p className="text-2xl font-bold text-teal-700">{RELOCATION_DATA.allowance}</p>
                  <p className="text-sm text-teal-600">Relocation package approved</p>
                </div>
                <StatusBadge status={RELOCATION_DATA.status} />
              </div>
              <div className="mt-4">
                <InfoRow label="Relocating From" value={EMPLOYEE.relocatingFrom} />
                <InfoRow label="Relocating To" value={EMPLOYEE.relocatingTo} />
              </div>
            </CardContent>
          </Card>

          {/* Moving Companies */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Car size={18} className="text-teal-600" /> Moving Company Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {RELOCATION_DATA.movingCompanies.map((company) => (
                <div key={company.name} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{company.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1"><Phone size={10} /> {company.phone}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{company.rating}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* City Guide */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin size={18} className="text-teal-600" /> City Guide — {RELOCATION_DATA.cityGuide.city}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Recommended Neighborhoods</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {RELOCATION_DATA.cityGuide.neighborhoods.map((n) => (
                      <Badge key={n} variant="outline">{n}</Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <InfoRow label="Avg. Rent" value={RELOCATION_DATA.cityGuide.avgRent} />
                <InfoRow label="Transport" value={RELOCATION_DATA.cityGuide.transport} />
                <InfoRow label="Highlights" value={RELOCATION_DATA.cityGuide.highlights} />
              </div>
            </CardContent>
          </Card>

          {/* Temporary Accommodation */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BedDouble size={18} className="text-teal-600" /> Temporary Accommodation Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {RELOCATION_DATA.tempAccommodation.map((acc) => (
                <div key={acc.name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{acc.name}</p>
                    <p className="text-xs text-gray-500">{acc.type}</p>
                  </div>
                  <Badge className={acc.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                    {acc.available ? 'Available' : 'Fully Booked'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guest House Booking Tab */}
        <TabsContent value="guesthouse" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Hotel size={18} className="text-teal-600" /> Guest House Booking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200 mb-4">
                <div>
                  <p className="text-sm font-medium text-green-800">Booking {GUEST_HOUSE_DATA.bookingStatus}</p>
                  <p className="text-xs text-green-600">{GUEST_HOUSE_DATA.property}</p>
                </div>
                <StatusBadge status={GUEST_HOUSE_DATA.bookingStatus} />
              </div>
              <div className="space-y-0">
                <InfoRow label="Room Type" value={GUEST_HOUSE_DATA.roomType} />
                <Separator />
                <InfoRow label="Check-in Date" value={GUEST_HOUSE_DATA.checkIn} />
                <Separator />
                <InfoRow label="Check-out Date" value={GUEST_HOUSE_DATA.checkOut} />
                <Separator />
                <InfoRow label="Duration" value="15 nights (first 15 days covered by company)" />
                <Separator />
                <InfoRow label="Meal Plan" value={GUEST_HOUSE_DATA.mealPlan} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Room Types Available</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {GUEST_HOUSE_DATA.roomTypes.map((room) => (
                <div key={room} className={`flex items-center justify-between p-3 rounded-lg border ${room === GUEST_HOUSE_DATA.roomType ? 'bg-teal-50 border-teal-200' : ''}`}>
                  <div className="flex items-center gap-2">
                    <BedDouble size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">{room}</span>
                  </div>
                  {room === GUEST_HOUSE_DATA.roomType && (
                    <Badge className="bg-teal-100 text-teal-700">Selected</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <UtensilsCrossed size={18} className="text-teal-600" /> Meal Plans
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {GUEST_HOUSE_DATA.mealPlans.map((plan) => (
                <div key={plan} className={`flex items-center justify-between p-3 rounded-lg border ${plan === GUEST_HOUSE_DATA.mealPlan ? 'bg-teal-50 border-teal-200' : ''}`}>
                  <div className="flex items-center gap-2">
                    <Coffee size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">{plan}</span>
                  </div>
                  {plan === GUEST_HOUSE_DATA.mealPlan && (
                    <Badge className="bg-teal-100 text-teal-700">Selected</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Travel Arrangement Tab */}
        <TabsContent value="travel" className="space-y-4">
          {/* Flight/Train */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Plane size={18} className="text-teal-600" /> Travel Booking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">{TRAVEL_DATA.flight.airline}</p>
                    <p className="text-xs text-blue-600">{TRAVEL_DATA.flight.route}</p>
                  </div>
                  <StatusBadge status={TRAVEL_DATA.flight.status} />
                </div>
              </div>
              <InfoRow label="Type" value={TRAVEL_DATA.flight.type} />
              <InfoRow label="Date" value={TRAVEL_DATA.flight.date} />
              <InfoRow label="Time" value={TRAVEL_DATA.flight.time} />
              <InfoRow label="PNR" value={TRAVEL_DATA.flight.pnr} />
            </CardContent>
          </Card>

          {/* Airport Pickup */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Car size={18} className="text-teal-600" /> Airport Pickup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200 mb-3">
                <span className="text-sm text-green-700">Pickup Arranged</span>
                <CheckCircle2 size={18} className="text-green-500" />
              </div>
              <InfoRow label="Driver" value={TRAVEL_DATA.airportPickup.driver} />
              <InfoRow label="Phone" value={TRAVEL_DATA.airportPickup.phone} />
              <InfoRow label="Vehicle" value={TRAVEL_DATA.airportPickup.vehicleType} />
            </CardContent>
          </Card>

          {/* Local Transport Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard size={18} className="text-teal-600" /> Local Transport Card
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="Type" value={TRAVEL_DATA.transportCard.type} />
              <InfoRow label="Status" value={TRAVEL_DATA.transportCard.status} />
              <InfoRow label="Balance" value={TRAVEL_DATA.transportCard.balance} />
            </CardContent>
          </Card>

          {/* Travel Reimbursement */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard size={18} className="text-teal-600" /> Travel Reimbursement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="Max Amount" value={TRAVEL_DATA.reimbursement.maxAmount} />
              <div className="flex items-center justify-between py-1.5">
                <span className="text-sm text-gray-500">Status</span>
                <StatusBadge status={TRAVEL_DATA.reimbursement.status} />
              </div>
              <Separator className="my-2" />
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Documents Required</p>
              <div className="space-y-1">
                {TRAVEL_DATA.reimbursement.documentsRequired.map((doc) => (
                  <div key={doc} className="flex items-center gap-2 text-sm text-gray-700">
                    <Circle size={6} className="text-gray-400" />
                    {doc}
                  </div>
                ))}
              </div>
              <Button className="mt-4 bg-teal-600 hover:bg-teal-700 w-full" size="sm">
                Submit Reimbursement Form
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IT Setup Checklist Tab */}
        <TabsContent value="itsetup" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Laptop size={18} className="text-teal-600" /> IT Setup Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {IT_SETUP_DATA.map((item) => {
                const Icon = item.icon;
                const isComplete = ['Delivered', 'Active', 'Granted', 'Configured'].includes(item.status);
                return (
                  <div key={item.item} className={`flex items-center justify-between p-3 rounded-lg border ${isComplete ? 'bg-green-50/50 border-green-200' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isComplete ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Icon size={16} className={isComplete ? 'text-green-600' : 'text-gray-500'} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.item}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Buddy Assignment Tab */}
        <TabsContent value="buddy" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users size={18} className="text-teal-600" /> Assigned Buddy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-teal-50 border border-teal-200">
                <div className="w-12 h-12 bg-teal-200 rounded-full flex items-center justify-center">
                  <User size={20} className="text-teal-700" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{BUDDY_DATA.name}</p>
                  <p className="text-xs text-gray-500">{BUDDY_DATA.designation} | {BUDDY_DATA.department}</p>
                  <p className="text-xs text-gray-500">{BUDDY_DATA.employeeId}</p>
                </div>
              </div>
              <div className="mt-4">
                <InfoRow label="Email" value={BUDDY_DATA.email} />
                <InfoRow label="Phone" value={BUDDY_DATA.phone} />
              </div>
            </CardContent>
          </Card>

          {/* Intro Meeting */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar size={18} className="text-teal-600" /> Buddy Introduction Meeting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <InfoRow label="Date" value={BUDDY_DATA.introMeeting.date} />
                <InfoRow label="Time" value={BUDDY_DATA.introMeeting.time} />
                <InfoRow label="Location" value={BUDDY_DATA.introMeeting.location} />
              </div>
            </CardContent>
          </Card>

          {/* Check-in Plan */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock size={18} className="text-teal-600" /> 30-60-90 Day Check-in Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {BUDDY_DATA.checkIns.map((ci) => (
                <div key={ci.label} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{ci.label}</p>
                    <p className="text-xs text-gray-500">{ci.date}</p>
                  </div>
                  <StatusBadge status={ci.status} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Milestones / Progress Tracker Tab */}
        <TabsContent value="milestones" className="space-y-4">
          {MILESTONES.map((milestone) => {
            const completedCount = milestone.items.filter((i) => i.completed).length;
            const phaseProgress = Math.round((completedCount / milestone.items.length) * 100);
            return (
              <Card key={milestone.phase}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{milestone.phase}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{completedCount}/{milestone.items.length}</span>
                      <Badge className={phaseProgress === 100 ? 'bg-green-100 text-green-700' : phaseProgress > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}>
                        {phaseProgress === 100 ? 'Complete' : phaseProgress > 0 ? 'In Progress' : 'Upcoming'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={phaseProgress} className="h-2 mb-3" />
                  <div className="space-y-2">
                    {milestone.items.map((item) => (
                      <div key={item.task} className="flex items-center gap-3 py-1">
                        {item.completed ? (
                          <CheckCircle2 size={18} className="text-green-500" fill="currentColor" />
                        ) : (
                          <Circle size={18} className="text-gray-300" />
                        )}
                        <span className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {item.task}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
