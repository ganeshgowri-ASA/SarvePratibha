'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone } from 'lucide-react';

const MOCK_ANNOUNCEMENTS = [
  {
    title: 'Annual Day Celebration',
    content: 'Join us for the annual day celebration on 15th March. Events, performances, and awards ceremony.',
    priority: 'HIGH' as const,
    date: '7 Mar 2026',
  },
  {
    title: 'New Leave Policy Update',
    content: 'Updated leave policy effective from April 2026. Please review the new guidelines in the HR portal.',
    priority: 'MEDIUM' as const,
    date: '5 Mar 2026',
  },
  {
    title: 'IT Maintenance Window',
    content: 'Scheduled maintenance on Saturday 12 AM - 4 AM. Some services may be temporarily unavailable.',
    priority: 'LOW' as const,
    date: '4 Mar 2026',
  },
];

const PRIORITY_STYLES = {
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-blue-100 text-blue-700',
  CRITICAL: 'bg-red-500 text-white',
};

export function AnnouncementsWidget() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Megaphone size={18} className="text-teal-600" />
          Announcements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {MOCK_ANNOUNCEMENTS.map((item, i) => (
            <div key={i} className="p-3 rounded-lg border hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                <Badge className={`text-[10px] shrink-0 ${PRIORITY_STYLES[item.priority]}`}>
                  {item.priority}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.content}</p>
              <p className="text-[10px] text-gray-400 mt-2">{item.date}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
