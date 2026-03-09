'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CalendarDays, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface LeaveType {
  id: string;
  name: string;
  code: string;
  description?: string;
  defaultDays: number;
  isPaidLeave: boolean;
}

interface LeaveBalance {
  id: string;
  leaveType: string;
  code: string;
  allocated: number;
  used: number;
  balance: number;
}

export default function ApplyLeavePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form state
  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDayType, setStartDayType] = useState('FULL');
  const [endDayType, setEndDayType] = useState('FULL');
  const [reason, setReason] = useState('');
  const [isHalfDay, setIsHalfDay] = useState(false);

  const token = (session?.user as any)?.accessToken;
  const employeeId = (session?.user as any)?.employeeId;

  useEffect(() => {
    if (!token || !employeeId) return;

    async function loadData() {
      try {
        const [typesRes, balanceRes] = await Promise.all([
          apiFetch<LeaveType[]>('/api/leave/types', { token }),
          apiFetch<LeaveBalance[]>(`/api/leave/balance/${employeeId}`, { token }),
        ]);
        setLeaveTypes(typesRes.data || []);
        setBalances(balanceRes.data || []);
      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, [token, employeeId]);

  // Calculate days
  const calcDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 0;

    let days = 0;
    const current = new Date(start);
    while (current <= end) {
      if (current.getDay() !== 0 && current.getDay() !== 6) days++;
      current.setDate(current.getDate() + 1);
    }

    if (startDayType === 'FIRST_HALF' || startDayType === 'SECOND_HALF') days -= 0.5;
    if (startDate !== endDate && (endDayType === 'FIRST_HALF' || endDayType === 'SECOND_HALF')) days -= 0.5;

    return Math.max(0, days);
  };

  const selectedBalance = balances.find((b) => {
    const selectedType = leaveTypes.find((t) => t.id === leaveTypeId);
    return selectedType && b.code === selectedType.code;
  });

  const estimatedDays = calcDays();
  const hasInsufficientBalance = selectedBalance && estimatedDays > selectedBalance.balance;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiFetch('/api/leave/apply', {
        method: 'POST',
        token,
        body: JSON.stringify({
          leaveTypeId,
          startDate,
          endDate,
          startDayType: isHalfDay ? startDayType : 'FULL',
          endDayType: isHalfDay ? endDayType : 'FULL',
          reason,
        }),
      });

      setSuccess(true);
      setTimeout(() => router.push('/leave-attendance'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply leave');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/leave-attendance">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Apply Leave</h1>
          <p className="text-sm text-gray-500">Submit a new leave request</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          Leave request submitted successfully! Redirecting...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays size={18} className="text-teal-600" />
            Leave Request Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Leave Type */}
            <div className="space-y-2">
              <Label htmlFor="leaveType">Leave Type *</Label>
              <Select value={leaveTypeId} onValueChange={(value) => setLeaveTypeId(value)}>
                <SelectTrigger id="leaveType"><SelectValue placeholder="Select leave type" /></SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} ({type.code})
                      {!type.isPaidLeave ? ' - Unpaid' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedBalance && (
                <p className="text-xs text-gray-500">
                  Available balance: <span className="font-semibold text-teal-600">{selectedBalance.balance} days</span>
                  {' '}(Used: {selectedBalance.used} / {selectedBalance.allocated})
                </p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  required
                />
              </div>
            </div>

            {/* Half Day Toggle */}
            <div className="flex items-center gap-3">
              <Switch checked={isHalfDay} onCheckedChange={setIsHalfDay} />
              <Label>Half-day leave</Label>
            </div>

            {isHalfDay && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Day</Label>
                  <Select value={startDayType} onValueChange={(value) => setStartDayType(value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL">Full Day</SelectItem>
                      <SelectItem value="FIRST_HALF">First Half</SelectItem>
                      <SelectItem value="SECOND_HALF">Second Half</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {startDate !== endDate && (
                  <div className="space-y-2">
                    <Label>End Day</Label>
                    <Select value={endDayType} onValueChange={(value) => setEndDayType(value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FULL">Full Day</SelectItem>
                        <SelectItem value="FIRST_HALF">First Half</SelectItem>
                        <SelectItem value="SECOND_HALF">Second Half</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {/* Estimated Days */}
            {estimatedDays > 0 && (
              <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">Estimated Leave Days</span>
                <Badge className={hasInsufficientBalance ? 'bg-red-100 text-red-700' : 'bg-teal-100 text-teal-700'}>
                  {estimatedDays} {estimatedDays === 1 ? 'day' : 'days'}
                </Badge>
              </div>
            )}

            {hasInsufficientBalance && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle size={14} />
                Insufficient balance. Available: {selectedBalance?.balance} days
              </div>
            )}

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason *</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for your leave..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                maxLength={500}
                rows={3}
              />
              <p className="text-xs text-gray-400">{reason.length}/500</p>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700"
                disabled={loading || !leaveTypeId || !startDate || !endDate || !reason}
              >
                {loading ? 'Submitting...' : 'Submit Leave Request'}
              </Button>
              <Link href="/leave-attendance">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
