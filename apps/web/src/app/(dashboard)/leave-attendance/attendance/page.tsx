'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import {
  ArrowLeft,
  Clock,
  LogIn,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  firstPunchIn?: string;
  lastPunchOut?: string;
  totalHours?: number;
  remarks?: string;
}

interface PunchStatusData {
  isPunchedIn: boolean;
  lastPunchTime?: string;
  punchInTime?: string;
  todayHours?: number;
}

const STATUS_COLORS: Record<string, string> = {
  PRESENT: 'bg-green-500',
  ABSENT: 'bg-red-500',
  HALF_DAY: 'bg-yellow-500',
  ON_LEAVE: 'bg-blue-500',
  HOLIDAY: 'bg-purple-500',
  WEEKEND: 'bg-gray-300',
  WORK_FROM_HOME: 'bg-teal-500',
};

const STATUS_LABELS: Record<string, string> = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  HALF_DAY: 'Half Day',
  ON_LEAVE: 'On Leave',
  HOLIDAY: 'Holiday',
  WEEKEND: 'Weekend',
  WORK_FROM_HOME: 'WFH',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function AttendancePage() {
  const { data: session } = useSession();
  const [punchStatus, setPunchStatus] = useState<PunchStatusData>({
    isPunchedIn: false,
  });
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [punchLoading, setPunchLoading] = useState(false);

  const token = (session?.user as any)?.accessToken;
  const employeeId = (session?.user as any)?.employeeId;

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load punch status
  const loadPunchStatus = useCallback(async () => {
    if (!token) return;
    try {
      const res = await apiFetch<PunchStatusData>('/api/attendance/status', { token });
      if (res.data) setPunchStatus(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  // Load attendance log
  const loadAttendance = useCallback(async () => {
    if (!token || !employeeId) return;
    setLoading(true);
    try {
      const res = await apiFetch<{ attendances: AttendanceRecord[] }>(
        `/api/attendance/log/${employeeId}?month=${month}&year=${year}`,
        { token },
      );
      setAttendance(res.data?.attendances || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, employeeId, month, year]);

  useEffect(() => {
    loadPunchStatus();
    loadAttendance();
  }, [loadPunchStatus, loadAttendance]);

  // Punch in/out
  async function handlePunch() {
    setPunchLoading(true);
    try {
      const endpoint = punchStatus.isPunchedIn ? '/api/attendance/checkout' : '/api/attendance/checkin';
      await apiFetch(endpoint, {
        method: 'POST',
        token,
        body: JSON.stringify({}),
      });
      await loadPunchStatus();
      await loadAttendance();
    } catch (err) {
      console.error(err);
    } finally {
      setPunchLoading(false);
    }
  }

  // Calculate elapsed time
  const punchInTime = punchStatus.punchInTime ? new Date(punchStatus.punchInTime) : null;
  const elapsedMs = punchInTime && punchStatus.isPunchedIn
    ? currentTime.getTime() - punchInTime.getTime()
    : 0;
  const hours = Math.floor(elapsedMs / 3600000);
  const minutes = Math.floor((elapsedMs % 3600000) / 60000);
  const seconds = Math.floor((elapsedMs % 60000) / 1000);

  // Build calendar grid
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const today = new Date();

  const attendanceMap: Record<number, AttendanceRecord> = {};
  attendance.forEach((a) => {
    const day = new Date(a.date).getDate();
    attendanceMap[day] = a;
  });

  // Stats
  const presentDays = attendance.filter((a) => a.status === 'PRESENT').length;
  const absentDays = attendance.filter((a) => a.status === 'ABSENT').length;
  const halfDays = attendance.filter((a) => a.status === 'HALF_DAY').length;
  const wfhDays = attendance.filter((a) => a.status === 'WORK_FROM_HOME').length;

  function changeMonth(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 1) { m = 12; y--; }
    if (m > 12) { m = 1; y++; }
    setMonth(m);
    setYear(y);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/leave-attendance">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-sm text-gray-500">Track your daily attendance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Punch Widget */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock size={18} className="text-teal-600" />
              Punch In/Out
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-3xl font-mono font-bold text-gray-800">
                {currentTime.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </div>
              {punchStatus.isPunchedIn && (
                <div className="text-sm text-gray-500">
                  Working: {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
              )}
              <Button
                onClick={handlePunch}
                disabled={punchLoading}
                className={
                  punchStatus.isPunchedIn
                    ? 'w-full bg-red-500 hover:bg-red-600'
                    : 'w-full bg-teal-600 hover:bg-teal-700'
                }
                size="lg"
              >
                {punchLoading ? (
                  'Processing...'
                ) : punchStatus.isPunchedIn ? (
                  <>
                    <LogOut className="mr-2" size={18} /> Punch Out
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2" size={18} /> Punch In
                  </>
                )}
              </Button>
              {punchInTime && (
                <p className="text-xs text-gray-500">
                  Punched in at{' '}
                  {punchInTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Stats */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Monthly Summary - {MONTHS[month - 1]} {year}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{presentDays}</p>
                <p className="text-xs text-gray-600">Present</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{absentDays}</p>
                <p className="text-xs text-gray-600">Absent</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{halfDays}</p>
                <p className="text-xs text-gray-600">Half Day</p>
              </div>
              <div className="text-center p-3 bg-teal-50 rounded-lg">
                <p className="text-2xl font-bold text-teal-600">{wfhDays}</p>
                <p className="text-xs text-gray-600">WFH</p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-4">
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-full ${STATUS_COLORS[key]}`} />
                  <span className="text-xs text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Attendance Calendar</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeMonth(-1)}>
                <ChevronLeft size={16} />
              </Button>
              <span className="text-sm font-medium min-w-[140px] text-center">
                {MONTHS[month - 1]} {year}
              </span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeMonth(1)}>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-sm text-gray-500">Loading...</div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {DAYS.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}

              {/* Empty cells before first day */}
              {Array.from({ length: firstDayOfMonth }, (_, i) => (
                <div key={`empty-${i}`} className="h-16" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const record = attendanceMap[day];
                const date = new Date(year, month - 1, day);
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                const isToday =
                  date.getDate() === today.getDate() &&
                  date.getMonth() === today.getMonth() &&
                  date.getFullYear() === today.getFullYear();
                const isFuture = date > today;
                const status = record?.status || (isWeekend ? 'WEEKEND' : isFuture ? '' : '');

                return (
                  <div
                    key={day}
                    className={`h-16 rounded-md border p-1 text-center ${
                      isToday ? 'border-teal-500 border-2' : 'border-gray-100'
                    } ${isFuture && !isWeekend ? 'opacity-40' : ''}`}
                  >
                    <p className={`text-xs font-medium ${isToday ? 'text-teal-600' : 'text-gray-700'}`}>
                      {day}
                    </p>
                    {status && (
                      <div className="mt-1">
                        <div
                          className={`w-6 h-6 rounded-full mx-auto ${STATUS_COLORS[status] || 'bg-gray-200'}`}
                          title={STATUS_LABELS[status] || status}
                        />
                        {record?.totalHours && (
                          <p className="text-[9px] text-gray-500 mt-0.5">
                            {record.totalHours.toFixed(1)}h
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
