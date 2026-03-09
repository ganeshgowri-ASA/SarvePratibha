'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Cake, Award } from 'lucide-react';

const MOCK_DATA = [
  { name: 'Priya Sharma', type: 'birthday' as const, date: 'Today', image: null },
  { name: 'Rahul Verma', type: 'work_anniversary' as const, date: 'Today', years: 5 },
  { name: 'Anita Singh', type: 'birthday' as const, date: 'Tomorrow', image: null },
  { name: 'Vikram Patel', type: 'work_anniversary' as const, date: '12 Mar', years: 3 },
];

export function BirthdaysWidget() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Cake size={18} className="text-teal-600" />
          Birthdays & Work Anniversaries
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {MOCK_DATA.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">
                  {item.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-500">{item.date}</p>
              </div>
              <Badge variant="secondary" className="text-[10px] shrink-0">
                {item.type === 'birthday' ? (
                  <><Cake size={10} className="mr-1" /> Birthday</>
                ) : (
                  <><Award size={10} className="mr-1" /> {item.years}yr</>
                )}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
