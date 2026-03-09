'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Headphones, Plus, Clock, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const TICKETS = [
  { id: '1', ticketNumber: 'HD-000042', subject: 'Unable to access email on phone', category: 'EMAIL', priority: 'HIGH', status: 'IN_PROGRESS', created: '8 Mar 2026', assignedTo: 'IT Team', comments: 3 },
  { id: '2', ticketNumber: 'HD-000041', subject: 'Request for additional monitor', category: 'HARDWARE', priority: 'MEDIUM', status: 'OPEN', created: '7 Mar 2026', assignedTo: null, comments: 1 },
  { id: '3', ticketNumber: 'HD-000038', subject: 'VPN connection timeout issue', category: 'NETWORK', priority: 'HIGH', status: 'RESOLVED', created: '5 Mar 2026', assignedTo: 'Network Team', comments: 5, resolution: 'Updated VPN client and reset credentials' },
  { id: '4', ticketNumber: 'HD-000035', subject: 'Software license renewal - Adobe CC', category: 'SOFTWARE', priority: 'MEDIUM', status: 'CLOSED', created: '1 Mar 2026', assignedTo: 'IT Team', comments: 2, rating: 5 },
];

const STATUS_STYLES: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  WAITING_ON_USER: 'bg-purple-100 text-purple-700',
  RESOLVED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-700',
};

const PRIORITY_STYLES: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-blue-100 text-blue-600',
  HIGH: 'bg-orange-100 text-orange-600',
  CRITICAL: 'bg-red-100 text-red-600',
};

const STATUS_ICONS: Record<string, typeof Clock> = {
  OPEN: AlertCircle,
  IN_PROGRESS: Clock,
  RESOLVED: CheckCircle,
  CLOSED: CheckCircle,
};

export default function HelpdeskPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Helpdesk</h1>
          <p className="text-sm text-gray-500">Submit and track your support tickets</p>
        </div>
        <Link href="/helpdesk/new">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus size={16} className="mr-2" /> New Ticket
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Open', value: '1', icon: AlertCircle, color: 'text-blue-600 bg-blue-50' },
          { label: 'In Progress', value: '1', icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Resolved', value: '1', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
          { label: 'Total Tickets', value: '4', icon: Headphones, color: 'text-teal-600 bg-teal-50' },
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Headphones size={18} className="text-teal-600" />
            My Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {TICKETS.map((ticket) => {
              const StatusIcon = STATUS_ICONS[ticket.status] || Clock;
              return (
                <div key={ticket.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-full ${ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? 'bg-green-100' : ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                        <StatusIcon size={16} className={ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? 'text-green-600' : ticket.status === 'IN_PROGRESS' ? 'text-yellow-600' : 'text-blue-600'} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{ticket.subject}</p>
                          <span className="text-xs text-gray-400">{ticket.ticketNumber}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500">{ticket.category}</span>
                          <span className="text-xs text-gray-400">|</span>
                          <span className="text-xs text-gray-500">Created: {ticket.created}</span>
                          {ticket.assignedTo && (
                            <>
                              <span className="text-xs text-gray-400">|</span>
                              <span className="text-xs text-gray-500">Assigned: {ticket.assignedTo}</span>
                            </>
                          )}
                        </div>
                        {ticket.resolution && (
                          <p className="text-xs text-green-600 mt-1">Resolution: {ticket.resolution}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <MessageSquare size={12} />
                        {ticket.comments}
                      </div>
                      <Badge className={PRIORITY_STYLES[ticket.priority] || ''}>{ticket.priority}</Badge>
                      <Badge className={STATUS_STYLES[ticket.status] || ''}>{ticket.status.replace(/_/g, ' ')}</Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
