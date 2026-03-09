'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

export default function ServiceRequestPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/services">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Service Request</h1>
          <p className="text-sm text-gray-500">Raise a new corporate service request</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Send size={18} className="text-teal-600" />
            Request Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Service Category</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="it">IT Support</SelectItem>
                <SelectItem value="facilities">Facilities</SelectItem>
                <SelectItem value="hr">HR Services</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="catering">Catering</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Subject</Label>
            <Input placeholder="Brief title for your request" />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="Describe your request in detail" rows={5} />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low - No urgency</SelectItem>
                <SelectItem value="MEDIUM">Medium - Normal priority</SelectItem>
                <SelectItem value="HIGH">High - Urgent</SelectItem>
                <SelectItem value="CRITICAL">Critical - Immediate attention needed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="bg-teal-600 hover:bg-teal-700">Submit Request</Button>
            <Link href="/services">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
