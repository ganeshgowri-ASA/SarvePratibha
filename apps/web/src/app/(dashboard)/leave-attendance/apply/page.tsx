'use client';

import { useState } from 'react';
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
import { ArrowLeft, CalendarDays, AlertCircle, Upload, X, FileText, Info } from 'lucide-react';
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
  color: string;
}

const DEFAULT_LEAVE_TYPES: LeaveType[] = [
  { id: 'lt-cl', name: 'Casual Leave', code: 'CL', description: 'For personal matters', defaultDays: 12, isPaidLeave: true },
  { id: 'lt-sl', name: 'Sick Leave', code: 'SL', description: 'For illness/medical reasons', defaultDays: 12, isPaidLeave: true },
  { id: 'lt-el', name: 'Earned Leave', code: 'EL', description: 'Pre-planned leave', defaultDays: 15, isPaidLeave: true },
  { id: 'lt-co', name: 'Comp Off', code: 'CO', description: 'Compensatory off', defaultDays: 0, isPaidLeave: true },
  { id: 'lt-ml', name: 'Maternity Leave', code: 'ML', description: 'Maternity leave', defaultDays: 90, isPaidLeave: true },
  { id: 'lt-pl', name: 'Paternity Leave', code: 'PL', description: 'Paternity leave', defaultDays: 15, isPaidLeave: true },
  { id: 'lt-mrl', name: 'Marriage Leave', code: 'MRL', description: 'Marriage leave', defaultDays: 15, isPaidLeave: true },
  { id: 'lt-bl', name: 'Bereavement Leave', code: 'BL', description: 'Bereavement leave', defaultDays: 5, isPaidLeave: true },
  { id: 'lt-wfh', name: 'Work From Home', code: 'WFH', description: 'Work from home', defaultDays: 0, isPaidLeave: true },
  { id: 'lt-lop', name: 'Loss of Pay', code: 'LOP', description: 'Leave without pay', defaultDays: 0, isPaidLeave: false },
];

const DEFAULT_BALANCES: LeaveBalance[] = [
  { id: 'b-cl', leaveType: 'Casual Leave', code: 'CL', allocated: 12, used: 0, balance: 12, color: 'text-teal-600 border-teal-200 bg-teal-50' },
  { id: 'b-sl', leaveType: 'Sick Leave', code: 'SL', allocated: 12, used: 0, balance: 12, color: 'text-blue-600 border-blue-200 bg-blue-50' },
  { id: 'b-el', leaveType: 'Earned Leave', code: 'EL', allocated: 15, used: 0, balance: 15, color: 'text-purple-600 border-purple-200 bg-purple-50' },
  { id: 'b-co', leaveType: 'Comp Off', code: 'CO', allocated: 0, used: 0, balance: 0, color: 'text-orange-600 border-orange-200 bg-orange-50' },
  { id: 'b-ml', leaveType: 'Maternity Leave', code: 'ML', allocated: 90, used: 0, balance: 90, color: 'text-pink-600 border-pink-200 bg-pink-50' },
  { id: 'b-pl', leaveType: 'Paternity Leave', code: 'PL', allocated: 15, used: 0, balance: 15, color: 'text-indigo-600 border-indigo-200 bg-indigo-50' },
  { id: 'b-mrl', leaveType: 'Marriage Leave', code: 'MRL', allocated: 15, used: 0, balance: 15, color: 'text-rose-600 border-rose-200 bg-rose-50' },
  { id: 'b-wfh', leaveType: 'Work From Home', code: 'WFH', allocated: 0, used: 0, balance: 0, color: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
];

const LEAVE_TYPE_INFO: Record<string, { description: string; requiresAttachment?: boolean }> = {
  CL: { description: 'For personal matters, short absences. Max 3 consecutive days.' },
  SL: { description: 'For illness/medical reasons. Attachment required for 2+ days.', requiresAttachment: true },
  EL: { description: 'Pre-planned leave. Apply at least 15 days in advance. Encashable.' },
  CO: { description: 'Leave earned for working on holidays/weekends.' },
  ML: { description: 'Maternity leave as per the Maternity Benefit Act. Up to 26 weeks.', requiresAttachment: true },
  PL: { description: 'Paternity leave for new fathers. Up to 15 days.' },
  LOP: { description: 'Leave without pay. Applied when other balances are exhausted.' },
  MRL: { description: 'Marriage leave for the employee\'s own marriage. Once in service.' },
  BL: { description: 'In case of death of an immediate family member.' },
  WFH: { description: 'Work from home. Regular working hours apply.' },
};

export default function ApplyLeavePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const leaveTypes = DEFAULT_LEAVE_TYPES;
  const balances = DEFAULT_BALANCES;
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
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const token = (session?.user as any)?.accessToken;

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

  const selectedType = leaveTypes.find((t) => t.id === leaveTypeId);
  const selectedBalance = balances.find((b) => selectedType && b.code === selectedType.code);
  const typeInfo = selectedType ? LEAVE_TYPE_INFO[selectedType.code] : null;
  const showAttachment = typeInfo?.requiresAttachment || (selectedType?.code === 'SL');

  const estimatedDays = calcDays();
  const hasInsufficientBalance = selectedBalance && selectedType?.code !== 'LOP' && estimatedDays > selectedBalance.balance;

  function getBalanceForType(code: string): LeaveBalance | undefined {
    return balances.find((b) => b.code === code);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Max 5MB
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setAttachmentFile(file);
      setError('');
    }
  }

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
          attachmentUrl: attachmentFile ? attachmentFile.name : undefined,
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

      {/* Leave Balance Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Leave Balance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {balances.map((b) => (
              <div
                key={b.id}
                className={`rounded-lg border px-3 py-2 text-center cursor-pointer transition-colors ${
                  selectedType?.code === b.code ? 'border-teal-500 ring-2 ring-teal-200 bg-teal-50' : `${b.color} hover:opacity-90`
                }`}
                onClick={() => {
                  const lt = leaveTypes.find((t) => t.code === b.code);
                  if (lt) setLeaveTypeId(lt.id);
                }}
              >
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">{b.code}</p>
                <p className="text-lg font-bold text-gray-900">
                  {b.code === 'WFH' ? 'Flex' : b.balance}
                </p>
                <p className="text-[10px] text-gray-400">
                  {b.code === 'WFH' ? 'Flexible' : `${b.used}/${b.allocated} used`}
                </p>
              </div>
            ))}
            {/* LOP always available */}
            <div
              className={`rounded-lg border px-3 py-2 text-center cursor-pointer transition-colors ${
                selectedType?.code === 'LOP' ? 'border-teal-500 ring-2 ring-teal-200 bg-teal-50' : 'text-red-600 border-red-200 bg-red-50 hover:opacity-90'
              }`}
              onClick={() => {
                const lt = leaveTypes.find((t) => t.code === 'LOP');
                if (lt) setLeaveTypeId(lt.id);
              }}
            >
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">LOP</p>
              <p className="text-lg font-bold text-gray-900">&infin;</p>
              <p className="text-[10px] text-gray-400">Unpaid</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  {leaveTypes.map((type) => {
                    const bal = getBalanceForType(type.code);
                    return (
                      <SelectItem key={type.id} value={type.id}>
                        <span className="flex items-center gap-2">
                          {type.name} ({type.code})
                          {!type.isPaidLeave ? (
                            <span className="text-red-500 text-[10px]">Unpaid</span>
                          ) : null}
                          {bal ? (
                            <span className="text-gray-400 text-[10px]">
                              Bal: {bal.balance}
                            </span>
                          ) : type.code === 'LOP' ? (
                            <span className="text-gray-400 text-[10px]">No limit</span>
                          ) : null}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {/* Type description & balance */}
              {selectedType && (
                <div className="space-y-1">
                  {typeInfo && (
                    <p className="text-xs text-gray-500 flex items-start gap-1">
                      <Info size={12} className="mt-0.5 shrink-0 text-gray-400" />
                      {typeInfo.description}
                    </p>
                  )}
                  {selectedBalance && (
                    <p className="text-xs text-gray-500">
                      Available balance: <span className="font-semibold text-teal-600">{selectedBalance.balance} days</span>
                      {' '}(Used: {selectedBalance.used} / {selectedBalance.allocated})
                    </p>
                  )}
                </div>
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
                Insufficient balance. Available: {selectedBalance?.balance} days. Consider applying for LOP instead.
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

            {/* File Attachment */}
            {showAttachment && (
              <div className="space-y-2">
                <Label>
                  Attachment {selectedType?.code === 'SL' && estimatedDays >= 2 ? '*' : '(Optional)'}
                </Label>
                <p className="text-xs text-gray-500">
                  {selectedType?.code === 'SL'
                    ? 'Medical certificate required for 2 or more days of sick leave.'
                    : 'Upload supporting documents (medical certificate, etc.)'}
                </p>

                {!attachmentFile ? (
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload size={20} className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Click to upload (PDF, JPG, PNG — max 5MB)</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 border">
                    <FileText size={18} className="text-teal-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{attachmentFile.name}</p>
                      <p className="text-xs text-gray-400">{(attachmentFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachmentFile(null)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

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
