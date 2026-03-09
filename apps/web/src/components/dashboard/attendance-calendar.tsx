'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Mock attendance data for current month
const MOCK_ATTENDANCE: Record<number, 'present' | 'absent' | 'leave' | 'holiday' | 'wfh'> = {
  1: 'holiday', 2: 'present', 3: 'present', 4: 'present', 5: 'present', 6: 'present',
  7: 'present', 8: 'holiday', 9: 'holiday',
};

const STATUS_COLORS = {
  present: 'bg-green-500',
  absent: 'bg-red-500',
  leave: 'bg-yellow-500',
  holiday: 'bg-blue-500',
  wfh: 'bg-purple-500',
};

export function AttendanceCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();

  const monthName = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarDays size={18} className="text-teal-600" />
          Attendance - {monthName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center">
          {DAYS.map((day) => (
            <div key={day} className="text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const status = MOCK_ATTENDANCE[day];
            const isToday = day === today;

            return (
              <div
                key={day}
                className={`relative text-xs py-1.5 rounded ${
                  isToday ? 'ring-2 ring-teal-500 font-bold' : ''
                } ${day > today ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {day}
                {status && (
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${STATUS_COLORS[status]}`}
                  />
                )}
              </div>
            );
          })}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t">
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${color}`} />
              <span className="text-[10px] text-gray-500 capitalize">{status}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
