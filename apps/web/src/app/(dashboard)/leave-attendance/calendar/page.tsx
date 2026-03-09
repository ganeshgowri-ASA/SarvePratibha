'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Calendar as CalendarIcon, Sun, Star, Flag } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: string;
  location?: string;
  isOptional: boolean;
}

const TYPE_STYLES: Record<string, { bg: string; icon: typeof Sun }> = {
  NATIONAL: { bg: 'bg-red-100 text-red-700', icon: Flag },
  OPTIONAL: { bg: 'bg-blue-100 text-blue-700', icon: Star },
  RESTRICTED: { bg: 'bg-yellow-100 text-yellow-700', icon: Sun },
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function HolidayCalendarPage() {
  const { data: session } = useSession();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

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

  // Group holidays by month
  const groupedByMonth: Record<number, Holiday[]> = {};
  holidays.forEach((h) => {
    const month = new Date(h.date).getMonth();
    if (!groupedByMonth[month]) groupedByMonth[month] = [];
    groupedByMonth[month].push(h);
  });

  const nationalCount = holidays.filter((h) => h.type === 'NATIONAL').length;
  const optionalCount = holidays.filter((h) => h.type === 'OPTIONAL').length;
  const restrictedCount = holidays.filter((h) => h.type === 'RESTRICTED').length;

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
          <p className="text-sm text-gray-500">National and optional holidays for the year</p>
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

      {/* Summary */}
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

      {/* Holiday List by Month */}
      {loading ? (
        <div className="py-8 text-center text-sm text-gray-500">Loading holidays...</div>
      ) : holidays.length === 0 ? (
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
      )}
    </div>
  );
}
