'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Calendar as CalendarIcon, Sun, Star, Flag, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: string;
  location?: string;
  isOptional: boolean;
}

const TYPE_STYLES: Record<string, { bg: string; dot: string; text: string; icon: typeof Sun; label: string }> = {
  NATIONAL: { bg: 'bg-red-100 text-red-700', dot: 'bg-red-500', text: 'text-red-600', icon: Flag, label: 'National Holiday' },
  OPTIONAL: { bg: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500', text: 'text-blue-600', icon: Star, label: 'Optional Holiday' },
  RESTRICTED: { bg: 'bg-yellow-100 text-yellow-700', dot: 'bg-amber-500', text: 'text-amber-600', icon: Sun, label: 'Restricted Holiday' },
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function HolidayCalendarPage() {
  const { data: session } = useSession();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const token = (session?.user as any)?.accessToken;

  useEffect(() => {
    if (!token) return;

    async function loadHolidays() {
      setLoading(true);
      try {
        const res = await apiFetch<Holiday[]>(`/api/holidays?year=${year}`, { token });
        setHolidays(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadHolidays();
  }, [token, year]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear + i - 1);

  // Create a map of date -> holidays for quick lookup
  const holidayMap = useMemo(() => {
    const map: Record<string, Holiday[]> = {};
    holidays.forEach((h) => {
      const d = new Date(h.date);
      const key = formatDateKey(d.getFullYear(), d.getMonth(), d.getDate());
      if (!map[key]) map[key] = [];
      map[key].push(h);
    });
    return map;
  }, [holidays]);

  // Group holidays by month for list view
  const groupedByMonth: Record<number, Holiday[]> = {};
  holidays.forEach((h) => {
    const month = new Date(h.date).getMonth();
    if (!groupedByMonth[month]) groupedByMonth[month] = [];
    groupedByMonth[month].push(h);
  });

  const nationalCount = holidays.filter((h) => h.type === 'NATIONAL').length;
  const optionalCount = holidays.filter((h) => h.type === 'OPTIONAL').length;
  const restrictedCount = holidays.filter((h) => h.type === 'RESTRICTED').length;

  const selectedHolidays = selectedDate ? holidayMap[selectedDate] || [] : [];

  const today = new Date();
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/leave-attendance">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Holiday Calendar</h1>
          <p className="text-sm text-gray-500">National, optional, and restricted holidays for the year</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-xs font-medium ${viewMode === 'calendar' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-medium ${viewMode === 'list' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              List
            </button>
          </div>
          <Select value={String(year)} onValueChange={(value) => setYear(Number(value))}>
            <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Flag size={20} className="mx-auto text-red-500 mb-1" />
            <p className="text-2xl font-bold text-gray-900">{nationalCount}</p>
            <p className="text-xs text-gray-500">National Holidays</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Star size={20} className="mx-auto text-blue-500 mb-1" />
            <p className="text-2xl font-bold text-gray-900">{optionalCount}</p>
            <p className="text-xs text-gray-500">Optional Holidays</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Sun size={20} className="mx-auto text-yellow-500 mb-1" />
            <p className="text-2xl font-bold text-gray-900">{restrictedCount}</p>
            <p className="text-xs text-gray-500">Restricted Holidays</p>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="font-medium text-gray-600">Legend:</span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              National Holiday (Mandatory)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              Optional Holiday
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              Restricted Holiday (Opt-in)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-gray-200" />
              Weekend
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border-2 border-teal-500" />
              Today
            </span>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="py-8 text-center text-sm text-gray-500">Loading holidays...</div>
      ) : viewMode === 'calendar' ? (
        <>
          {/* Full Year Calendar Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MONTHS.map((monthName, monthIndex) => {
              const daysInMonth = getDaysInMonth(year, monthIndex);
              const firstDay = getFirstDayOfMonth(year, monthIndex);

              return (
                <Card key={monthIndex} className="overflow-hidden">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-sm font-semibold text-gray-800">
                      {monthName} {year}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 mb-1">
                      {WEEKDAYS.map((day) => (
                        <div key={day} className="text-center text-[10px] font-medium text-gray-400 py-1">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7">
                      {/* Empty cells for days before month starts */}
                      {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-8" />
                      ))}

                      {/* Days of the month */}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateKey = formatDateKey(year, monthIndex, day);
                        const dayOfWeek = new Date(year, monthIndex, day).getDay();
                        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                        const dayHolidays = holidayMap[dateKey] || [];
                        const isToday = dateKey === todayKey;
                        const isSelected = dateKey === selectedDate;

                        // Determine holiday type priority: NATIONAL > OPTIONAL > RESTRICTED
                        const primaryHoliday = dayHolidays.find((h) => h.type === 'NATIONAL')
                          || dayHolidays.find((h) => h.type === 'OPTIONAL')
                          || dayHolidays[0];

                        let bgClass = '';
                        let textClass = 'text-gray-700';

                        if (primaryHoliday) {
                          const style = TYPE_STYLES[primaryHoliday.type];
                          if (primaryHoliday.type === 'NATIONAL') {
                            bgClass = 'bg-red-100';
                            textClass = 'text-red-700 font-semibold';
                          } else if (primaryHoliday.type === 'OPTIONAL') {
                            bgClass = 'bg-blue-50';
                            textClass = 'text-blue-700 font-semibold';
                          } else {
                            bgClass = 'bg-amber-50';
                            textClass = 'text-amber-700 font-semibold';
                          }
                        } else if (isWeekend) {
                          bgClass = 'bg-gray-100';
                          textClass = 'text-gray-400';
                        }

                        return (
                          <button
                            key={day}
                            onClick={() => dayHolidays.length > 0 && setSelectedDate(isSelected ? null : dateKey)}
                            className={`
                              h-8 w-full flex items-center justify-center text-xs rounded-md relative
                              ${bgClass} ${textClass}
                              ${isToday ? 'ring-2 ring-teal-500 ring-offset-1' : ''}
                              ${isSelected ? 'ring-2 ring-gray-900 ring-offset-1' : ''}
                              ${dayHolidays.length > 0 ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}
                            `}
                          >
                            {day}
                            {dayHolidays.length > 0 && (
                              <span className={`absolute bottom-0.5 w-1 h-1 rounded-full ${TYPE_STYLES[primaryHoliday!.type]?.dot || 'bg-gray-400'}`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Selected date detail */}
          {selectedDate && selectedHolidays.length > 0 && (
            <Card className="border-teal-200 bg-teal-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Info size={16} className="text-teal-600" />
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedHolidays.map((holiday) => {
                    const style = TYPE_STYLES[holiday.type] || TYPE_STYLES.NATIONAL;
                    return (
                      <div key={holiday.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{holiday.name}</p>
                          {holiday.location && (
                            <p className="text-xs text-gray-400">{holiday.location}</p>
                          )}
                        </div>
                        <Badge className={style.bg}>{style.label}</Badge>
                      </div>
                    );
                  })}
                  {selectedHolidays.some((h) => h.type === 'RESTRICTED') && (
                    <p className="text-xs text-amber-600 flex items-center gap-1 mt-2">
                      <Info size={12} />
                      Restricted holidays can be opted for by employees. Contact HR to opt in.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Holidays */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Upcoming Holidays
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const upcoming = holidays
                  .filter((h) => new Date(h.date) >= today)
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5);

                if (upcoming.length === 0) {
                  return <p className="text-sm text-gray-500">No upcoming holidays this year</p>;
                }

                return (
                  <div className="divide-y">
                    {upcoming.map((holiday) => {
                      const style = TYPE_STYLES[holiday.type] || TYPE_STYLES.NATIONAL;
                      const holidayDate = new Date(holiday.date);
                      const diffDays = Math.ceil((holidayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                      return (
                        <div key={holiday.id} className="flex items-center justify-between py-2.5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 text-center">
                              <p className="text-lg font-bold text-gray-900">{holidayDate.getDate()}</p>
                              <p className="text-[10px] text-gray-500 uppercase">
                                {holidayDate.toLocaleDateString('en-IN', { month: 'short' })}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{holiday.name}</p>
                              <p className="text-xs text-gray-400">
                                {holidayDate.toLocaleDateString('en-IN', { weekday: 'long' })}
                                {diffDays === 0 ? ' — Today' : diffDays === 1 ? ' — Tomorrow' : ` — in ${diffDays} days`}
                              </p>
                            </div>
                          </div>
                          <Badge className={style.bg}>{holiday.type}</Badge>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </>
      ) : (
        /* List View */
        holidays.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-gray-500">
              No holidays found for {year}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {MONTHS.map((monthName, index) => {
              const monthHolidays = groupedByMonth[index];
              if (!monthHolidays || monthHolidays.length === 0) return null;

              return (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-gray-700">
                      {monthName} {year}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y">
                      {monthHolidays.map((holiday) => {
                        const style = TYPE_STYLES[holiday.type] || TYPE_STYLES.NATIONAL;
                        return (
                          <div key={holiday.id} className="flex items-center justify-between py-2.5">
                            <div className="flex items-center gap-3">
                              <div className="w-12 text-center">
                                <p className="text-lg font-bold text-gray-900">
                                  {new Date(holiday.date).getDate()}
                                </p>
                                <p className="text-[10px] text-gray-500 uppercase">
                                  {new Date(holiday.date).toLocaleDateString('en-IN', { weekday: 'short' })}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{holiday.name}</p>
                                {holiday.location && (
                                  <p className="text-xs text-gray-400">{holiday.location}</p>
                                )}
                                {holiday.type === 'RESTRICTED' && (
                                  <p className="text-[10px] text-amber-600">Employees can opt for this holiday</p>
                                )}
                              </div>
                            </div>
                            <Badge className={style.bg}>{holiday.type}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
