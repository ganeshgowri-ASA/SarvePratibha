'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface TeamMember {
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  status: string;
  punchIn?: string;
  punchOut?: string;
  totalHours?: number;
}

const STATUS_COLORS: Record<string, string> = {
  PRESENT: 'bg-green-100 text-green-700',
  ABSENT: 'bg-red-100 text-red-700',
  HALF_DAY: 'bg-yellow-100 text-yellow-700',
  ON_LEAVE: 'bg-blue-100 text-blue-700',
  HOLIDAY: 'bg-purple-100 text-purple-700',
  WEEKEND: 'bg-gray-100 text-gray-500',
  WORK_FROM_HOME: 'bg-teal-100 text-teal-700',
};

function formatTime(isoStr?: string) {
  if (!isoStr) return '-';
  return new Date(isoStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function TeamAttendancePage() {
  const { data: session } = useSession();
  const [teamData, setTeamData] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const token = (session?.user as any)?.accessToken;
  const employeeId = (session?.user as any)?.employeeId;
  const userRole = (session?.user as any)?.role;

  useEffect(() => {
    if (!token || !employeeId) return;

    async function loadTeam() {
      setLoading(true);
      try {
        const res = await apiFetch<TeamMember[]>(
          `/api/attendance/team/${employeeId}?date=${date}`,
          { token },
        );
        setTeamData(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadTeam();
  }, [token, employeeId, date]);

  function changeDate(delta: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    setDate(d.toISOString().split('T')[0]);
  }

  // Stats
  const present = teamData.filter((m) => m.status === 'PRESENT' || m.status === 'WORK_FROM_HOME').length;
  const absent = teamData.filter((m) => m.status === 'ABSENT').length;
  const onLeave = teamData.filter((m) => m.status === 'ON_LEAVE').length;
  const total = teamData.length;

  const dateFormatted = new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/leave-attendance/attendance">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Attendance</h1>
          <p className="text-sm text-gray-500">View your team&apos;s attendance</p>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeDate(-1)}>
            <ChevronLeft size={16} />
          </Button>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-40"
          />
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeDate(1)}>
            <ChevronRight size={16} />
          </Button>
        </div>
        <span className="text-sm text-gray-500">{dateFormatted}</span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-2xl font-bold text-green-600">{present}</p>
            <p className="text-xs text-gray-500">Present</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-2xl font-bold text-red-600">{absent}</p>
            <p className="text-xs text-gray-500">Absent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{onLeave}</p>
            <p className="text-xs text-gray-500">On Leave</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users size={18} className="text-teal-600" />
            Team Members ({total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-sm text-gray-500">Loading...</div>
          ) : teamData.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">No team members found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Punch In</TableHead>
                  <TableHead>Punch Out</TableHead>
                  <TableHead>Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamData.map((member) => (
                  <TableRow key={member.employeeId}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{member.employeeName}</p>
                        <p className="text-xs text-gray-400">{member.employeeId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{member.department}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[member.status] || 'bg-gray-100'}>
                        {member.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{formatTime(member.punchIn)}</TableCell>
                    <TableCell className="text-sm">{formatTime(member.punchOut)}</TableCell>
                    <TableCell className="text-sm">
                      {member.totalHours ? `${member.totalHours.toFixed(1)}h` : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
