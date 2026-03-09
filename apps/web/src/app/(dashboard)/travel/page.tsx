'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plane, Plus, MapPin, Calendar, IndianRupee } from 'lucide-react';
import Link from 'next/link';

const TRAVEL_REQUESTS = [
  { id: '1', destination: 'Mumbai', fromCity: 'Bangalore', startDate: '15 Mar 2026', endDate: '18 Mar 2026', purpose: 'Client Meeting', estimatedCost: '25,000', status: 'SUBMITTED' },
  { id: '2', destination: 'Delhi', fromCity: 'Bangalore', startDate: '5 Mar 2026', endDate: '7 Mar 2026', purpose: 'Conference', estimatedCost: '35,000', status: 'MANAGER_APPROVED' },
  { id: '3', destination: 'Hyderabad', fromCity: 'Bangalore', startDate: '20 Feb 2026', endDate: '22 Feb 2026', purpose: 'Team Offsite', estimatedCost: '15,000', status: 'COMPLETED' },
];

const PENDING_APPROVALS = [
  { id: '4', employee: 'Rahul Sharma', destination: 'Chennai', dates: '20-22 Mar 2026', purpose: 'Vendor Visit', cost: '18,000' },
  { id: '5', employee: 'Priya Patel', destination: 'Pune', dates: '25-27 Mar 2026', purpose: 'Training', cost: '22,000' },
];

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  SUBMITTED: 'bg-blue-100 text-blue-700',
  MANAGER_APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-700',
  COMPLETED: 'bg-teal-100 text-teal-700',
};

export default function TravelPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Travel & Guest House</h1>
          <p className="text-sm text-gray-500">Manage travel requests, expenses, and bookings</p>
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
          { label: 'Upcoming Trips', value: '1', icon: MapPin, color: 'text-purple-600 bg-purple-50' },
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
        <TabsList>
          <TabsTrigger value="my-requests">My Requests</TabsTrigger>
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
        </TabsList>

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
                      <p className="text-sm font-medium text-gray-900">
                        {req.fromCity} → {req.destination}
                      </p>
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
      </Tabs>
    </div>
  );
}
