'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, IndianRupee, Clock, Plane, Train } from 'lucide-react';
import Link from 'next/link';

const POLICY_SECTIONS = [
  {
    title: 'Per Diem Allowance',
    icon: IndianRupee,
    items: [
      { label: 'Domestic Travel', value: '&#8377;2,500 per day' },
      { label: 'International Travel', value: '&#36;100 per day' },
      { label: 'Metro Cities (Domestic)', value: '&#8377;3,000 per day' },
    ],
  },
  {
    title: 'Hotel Limits',
    icon: IndianRupee,
    items: [
      { label: 'Domestic - Tier 1 Cities', value: '&#8377;6,000 per night' },
      { label: 'Domestic - Tier 2 Cities', value: '&#8377;4,000 per night' },
      { label: 'International', value: '&#36;200 per night' },
    ],
  },
  {
    title: 'Booking Rules',
    icon: Clock,
    items: [
      { label: 'Advance Booking', value: 'At least 7 days before travel' },
      { label: 'Maximum Advance', value: '80% of estimated cost' },
      { label: 'Expense Report Deadline', value: 'Within 7 days of return' },
    ],
  },
  {
    title: 'Travel Class',
    icon: Plane,
    items: [
      { label: 'Air Travel (Domestic)', value: 'Economy Class' },
      { label: 'Air Travel (International)', value: 'Economy / Premium Economy' },
      { label: 'Train Travel', value: 'AC 2-Tier' },
    ],
  },
];

export default function TravelPolicyPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/travel">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Travel Policy</h1>
          <p className="text-sm text-gray-500">Company travel guidelines and reimbursement limits</p>
        </div>
      </div>

      <Card className="bg-teal-50 border-teal-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <FileText size={20} className="text-teal-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-teal-800">Standard Travel Policy</p>
              <p className="text-xs text-teal-600 mt-1">
                Last updated: 1 Jan 2026. Applicable to all employees. For exceptions, contact HR.
              </p>
            </div>
            <Badge className="bg-green-100 text-green-700 ml-auto">Active</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {POLICY_SECTIONS.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <section.icon size={18} className="text-teal-600" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium text-gray-900" dangerouslySetInnerHTML={{ __html: item.value }} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Train size={18} className="text-teal-600" />
            General Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>All travel must be pre-approved by your reporting manager</li>
            <li>Book through the company portal for corporate rates</li>
            <li>Receipts are mandatory for all expenses above &#8377;500</li>
            <li>Personal expenses during travel are not reimbursable</li>
            <li>Travel insurance is provided for all approved trips</li>
            <li>In case of cancellation, inform HR at least 48 hours prior</li>
            <li>Guest house bookings are subject to availability</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
