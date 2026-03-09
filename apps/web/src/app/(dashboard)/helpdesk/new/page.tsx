'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Headphones } from 'lucide-react';
import Link from 'next/link';

export default function NewTicketPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/helpdesk">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Helpdesk Ticket</h1>
          <p className="text-sm text-gray-500">Submit a new support request</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Headphones size={18} className="text-teal-600" />
            Ticket Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HARDWARE">Hardware</SelectItem>
                <SelectItem value="SOFTWARE">Software</SelectItem>
                <SelectItem value="NETWORK">Network</SelectItem>
                <SelectItem value="ACCESS">Access / Permissions</SelectItem>
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="GENERAL">General</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Subject</Label>
            <Input placeholder="Brief description of your issue" />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="Provide detailed information about your issue. Include error messages, steps to reproduce, and any troubleshooting you've already tried." rows={6} />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low - No impact on work</SelectItem>
                <SelectItem value="MEDIUM">Medium - Can work with workaround</SelectItem>
                <SelectItem value="HIGH">High - Significant impact on work</SelectItem>
                <SelectItem value="CRITICAL">Critical - Cannot work at all</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">SLA: Critical (4h), High (24h), Medium (48h), Low (72h)</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="bg-teal-600 hover:bg-teal-700">Submit Ticket</Button>
            <Link href="/helpdesk">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
