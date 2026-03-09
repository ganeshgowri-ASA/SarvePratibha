'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Laptop, Wrench, Users, IndianRupee, Truck, UtensilsCrossed, Plus, Clock } from 'lucide-react';
import Link from 'next/link';

const SERVICE_CATEGORIES = [
  { id: '1', name: 'IT Support', category: 'IT_SUPPORT', icon: Laptop, description: 'Hardware, software, and network issues', count: 12 },
  { id: '2', name: 'Facilities', category: 'FACILITIES', icon: Wrench, description: 'Office maintenance and infrastructure', count: 8 },
  { id: '3', name: 'HR Services', category: 'HR_SERVICES', icon: Users, description: 'Letters, certificates, and HR queries', count: 15 },
  { id: '4', name: 'Finance', category: 'FINANCE', icon: IndianRupee, description: 'Salary queries, tax help, reimbursements', count: 6 },
  { id: '5', name: 'Transport', category: 'TRANSPORT', icon: Truck, description: 'Cab booking, parking, travel desk', count: 4 },
  { id: '6', name: 'Catering', category: 'CATERING', icon: UtensilsCrossed, description: 'Cafeteria, meal plans, food coupons', count: 3 },
];

const MY_REQUESTS = [
  { id: '1', service: 'IT Support', subject: 'VPN not connecting', priority: 'HIGH', status: 'IN_PROGRESS', created: '7 Mar 2026', sla: '8 Mar 2026' },
  { id: '2', service: 'Facilities', subject: 'AC not working in meeting room 3B', priority: 'MEDIUM', status: 'OPEN', created: '6 Mar 2026', sla: '8 Mar 2026' },
  { id: '3', service: 'HR Services', subject: 'Experience letter request', priority: 'LOW', status: 'RESOLVED', created: '1 Mar 2026', sla: '4 Mar 2026' },
];

const STATUS_STYLES: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  RESOLVED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const PRIORITY_STYLES: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-blue-100 text-blue-600',
  HIGH: 'bg-orange-100 text-orange-600',
  CRITICAL: 'bg-red-100 text-red-600',
};

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Corporate Services</h1>
          <p className="text-sm text-gray-500">Browse services and raise requests</p>
        </div>
        <Link href="/services/request">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus size={16} className="mr-2" /> New Request
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="catalog">
        <TabsList>
          <TabsTrigger value="catalog">Service Catalog</TabsTrigger>
          <TabsTrigger value="my-requests">My Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICE_CATEGORIES.map((service) => (
              <Card key={service.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-teal-50 rounded-lg">
                      <service.icon size={24} className="text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                      <p className="text-xs text-teal-600 mt-2">{service.count} services available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-requests">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 size={18} className="text-teal-600" />
                My Service Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {MY_REQUESTS.map((req) => (
                  <div key={req.id} className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">{req.subject}</p>
                      <p className="text-xs text-gray-500">
                        {req.service} &middot; Created: {req.created}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        SLA: {req.sla}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={PRIORITY_STYLES[req.priority] || ''}>{req.priority}</Badge>
                      <Badge className={STATUS_STYLES[req.status] || ''}>{req.status.replace(/_/g, ' ')}</Badge>
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
