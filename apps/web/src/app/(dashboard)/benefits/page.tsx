'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, Heart, Shield, GraduationCap, Plus } from 'lucide-react';
import Link from 'next/link';

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
};

export default function BenefitsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Benefits</h1>
          <p className="text-sm text-gray-500">View and manage your benefit enrollments</p>
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
        <TabsList>
          <TabsTrigger value="enrolled">My Benefits</TabsTrigger>
          <TabsTrigger value="available">Available Plans</TabsTrigger>
        </TabsList>

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
      </Tabs>
    </div>
  );
}
