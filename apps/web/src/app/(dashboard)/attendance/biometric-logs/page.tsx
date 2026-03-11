'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Fingerprint,
  Scan,
  CreditCard,
  Hash,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  LogIn,
  LogOut,
  Activity,
  Loader2,
} from 'lucide-react';
import {
  type AttendanceLog,
  type PairedPunch,
  type PunchType,
  type VerifyMethod,
  getAllLogs,
  getAllDevices,
  pairPunches,
  syncAttendanceLogs,
  updateDeviceStatus,
} from '@/lib/biometric-service';

const VERIFY_METHOD_CONFIG: Record<VerifyMethod, { label: string; icon: React.ReactNode; color: string }> = {
  fingerprint: {
    label: 'Fingerprint',
    icon: <Fingerprint size={12} />,
    color: 'bg-teal-100 text-teal-700 border-teal-200',
  },
  face: {
    label: 'Face',
    icon: <Scan size={12} />,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  card: {
    label: 'Card',
    icon: <CreditCard size={12} />,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  pin: {
    label: 'PIN',
    icon: <Hash size={12} />,
    color: 'bg-orange-100 text-orange-700 border-orange-200',
  },
};

const PUNCH_TYPE_CONFIG: Record<PunchType, { label: string; icon: React.ReactNode; color: string }> = {
  IN: {
    label: 'IN',
    icon: <LogIn size={12} />,
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  OUT: {
    label: 'OUT',
    icon: <LogOut size={12} />,
    color: 'bg-red-100 text-red-700 border-red-200',
  },
};

const PAIRED_STATUS_CONFIG = {
  complete: { label: 'Complete', color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle size={12} /> },
  missing_out: { label: 'Missing Out', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: <AlertTriangle size={12} /> },
  missing_in: { label: 'Missing In', color: 'bg-red-100 text-red-700 border-red-200', icon: <AlertTriangle size={12} /> },
  late: { label: 'Late', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: <Clock size={12} /> },
  early_departure: { label: 'Early Departure', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: <Clock size={12} /> },
};

function formatDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

function formatTime(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function exportToCsv(logs: AttendanceLog[], filename: string) {
  const headers = ['Date', 'Time', 'Employee', 'Code', 'Device', 'Punch Type', 'Verify Method', 'Status'];
  const rows = logs.map((l) => {
    const { date, time } = formatDateTime(l.punchTime);
    return [date, time, l.employeeName, l.employeeCode, l.deviceName, l.punchType, l.verifyMethod, l.status];
  });
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPairedToCsv(paired: PairedPunch[], filename: string) {
  const headers = ['Date', 'Employee', 'Code', 'First In', 'Last Out', 'Total Hours', 'Status'];
  const rows = paired.map((p) => [
    p.date,
    p.employeeName,
    p.employeeCode,
    formatTime(p.firstIn),
    formatTime(p.lastOut),
    p.totalHours ? p.totalHours.toFixed(2) : '—',
    p.status,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function BiometricLogsPage() {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [paired, setPaired] = useState<PairedPunch[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterDevice, setFilterDevice] = useState('all');
  const [filterPunchType, setFilterPunchType] = useState<'all' | PunchType>('all');
  const [filterMethod, setFilterMethod] = useState<'all' | VerifyMethod>('all');

  const [devices, setDevices] = useState<{ id: string; name: string }[]>([]);

  const loadData = useCallback(() => {
    setLoading(true);
    try {
      const allLogs = getAllLogs();
      setLogs(allLogs);
      setPaired(pairPunches(allLogs));

      const devs = getAllDevices();
      setDevices(devs.map((d) => ({ id: d.id, name: d.name })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSyncAll = async () => {
    setSyncing(true);
    try {
      const devs = getAllDevices();
      for (const device of devs) {
        const result = await syncAttendanceLogs(device);
        if (result.success) {
          updateDeviceStatus(device.id, 'Online', result.timestamp);
        }
      }
      loadData();
    } finally {
      setSyncing(false);
    }
  };

  // Apply filters to raw logs
  const filteredLogs = logs.filter((log) => {
    const logDate = log.punchTime.split('T')[0];
    if (dateFrom && logDate < dateFrom) return false;
    if (dateTo && logDate > dateTo) return false;
    if (
      filterEmployee &&
      !log.employeeName.toLowerCase().includes(filterEmployee.toLowerCase()) &&
      !log.employeeCode.toLowerCase().includes(filterEmployee.toLowerCase())
    )
      return false;
    if (filterDevice !== 'all' && log.deviceId !== filterDevice) return false;
    if (filterPunchType !== 'all' && log.punchType !== filterPunchType) return false;
    if (filterMethod !== 'all' && log.verifyMethod !== filterMethod) return false;
    return true;
  });

  // Apply filters to paired punches
  const filteredPaired = paired.filter((p) => {
    if (dateFrom && p.date < dateFrom) return false;
    if (dateTo && p.date > dateTo) return false;
    if (
      filterEmployee &&
      !p.employeeName.toLowerCase().includes(filterEmployee.toLowerCase()) &&
      !p.employeeCode.toLowerCase().includes(filterEmployee.toLowerCase())
    )
      return false;
    return true;
  });

  const mismatchCount = paired.filter(
    (p) => p.status === 'missing_in' || p.status === 'missing_out',
  ).length;
  const lateCount = paired.filter((p) => p.status === 'late').length;
  const earlyCount = paired.filter((p) => p.status === 'early_departure').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/leave-attendance">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Biometric Logs</h1>
            <p className="text-sm text-gray-500">Raw punch logs from biometric devices</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSyncAll}
            disabled={syncing}
          >
            {syncing ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <RefreshCw size={16} className="mr-2" />
            )}
            Sync All Devices
          </Button>
          <Button
            variant="outline"
            onClick={() => exportToCsv(filteredLogs, `biometric-logs-${new Date().toISOString().split('T')[0]}.csv`)}
            disabled={filteredLogs.length === 0}
          >
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Activity size={20} className="text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
              <p className="text-xs text-gray-500">Total Punches</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{mismatchCount}</p>
              <p className="text-xs text-gray-500">Missing Punches</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
              <p className="text-xs text-gray-500">Late Arrivals</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{earlyCount}</p>
              <p className="text-xs text-gray-500">Early Departures</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">From Date</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">To Date</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Employee</label>
              <Input
                placeholder="Name or code..."
                value={filterEmployee}
                onChange={(e) => setFilterEmployee(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Device</label>
              <Select value={filterDevice} onValueChange={setFilterDevice}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  {devices.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Punch Type</label>
              <Select
                value={filterPunchType}
                onValueChange={(v) => setFilterPunchType(v as 'all' | PunchType)}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="IN">IN</SelectItem>
                  <SelectItem value="OUT">OUT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Verify Method</label>
              <Select
                value={filterMethod}
                onValueChange={(v) => setFilterMethod(v as 'all' | VerifyMethod)}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="fingerprint">Fingerprint</SelectItem>
                  <SelectItem value="face">Face</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="pin">PIN</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {(dateFrom || dateTo || filterEmployee || filterDevice !== 'all' || filterPunchType !== 'all' || filterMethod !== 'all') && (
            <div className="mt-2 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-gray-500"
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                  setFilterEmployee('');
                  setFilterDevice('all');
                  setFilterPunchType('all');
                  setFilterMethod('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="raw">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="raw">Raw Punch Logs ({filteredLogs.length})</TabsTrigger>
            <TabsTrigger value="paired">Paired Hours ({filteredPaired.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="paired" className="m-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                exportPairedToCsv(
                  filteredPaired,
                  `biometric-hours-${new Date().toISOString().split('T')[0]}.csv`,
                )
              }
              disabled={filteredPaired.length === 0}
            >
              <Download size={14} className="mr-1.5" />
              Export Hours CSV
            </Button>
          </TabsContent>
        </div>

        <TabsContent value="raw" className="mt-4">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="py-12 text-center text-gray-400">
                  <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                  Loading logs...
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Activity size={32} className="mx-auto text-gray-300" />
                  <p className="text-sm text-gray-400">
                    No punch logs found. Sync devices to load attendance data.
                  </p>
                  <Button
                    size="sm"
                    className="bg-teal-600 hover:bg-teal-700"
                    onClick={handleSyncAll}
                    disabled={syncing}
                  >
                    {syncing ? (
                      <Loader2 size={14} className="mr-2 animate-spin" />
                    ) : (
                      <RefreshCw size={14} className="mr-2" />
                    )}
                    Sync Now
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Employee</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>Punch</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs
                        .slice()
                        .sort(
                          (a, b) =>
                            new Date(b.punchTime).getTime() - new Date(a.punchTime).getTime(),
                        )
                        .slice(0, 200)
                        .map((log) => {
                          const { date, time } = formatDateTime(log.punchTime);
                          const punchCfg = PUNCH_TYPE_CONFIG[log.punchType];
                          const methodCfg = VERIFY_METHOD_CONFIG[log.verifyMethod];
                          return (
                            <TableRow key={log.id}>
                              <TableCell>
                                <span className="text-sm text-gray-600">{date}</span>
                              </TableCell>
                              <TableCell>
                                <span className="font-mono text-sm font-medium">{time}</span>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium text-sm text-gray-900">
                                    {log.employeeName}
                                  </p>
                                  <p className="text-xs text-gray-400">{log.employeeCode}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-gray-600">{log.deviceName}</span>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={`text-xs flex items-center gap-1 w-fit ${punchCfg.color}`}
                                >
                                  {punchCfg.icon}
                                  {punchCfg.label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={`text-xs flex items-center gap-1 w-fit ${methodCfg.color}`}
                                >
                                  {methodCfg.icon}
                                  {methodCfg.label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`text-xs ${
                                    log.status === 'valid'
                                      ? 'text-green-600'
                                      : log.status === 'duplicate'
                                        ? 'text-yellow-600'
                                        : 'text-red-600'
                                  }`}
                                >
                                  {log.status}
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                  {filteredLogs.length > 200 && (
                    <div className="py-3 text-center text-xs text-gray-400">
                      Showing 200 of {filteredLogs.length} records. Export to CSV for all data.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paired" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">
                Auto-paired IN/OUT punches — work hours computed per employee per day
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredPaired.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <p className="text-sm">No paired records. Sync devices first.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Employee</TableHead>
                        <TableHead>First In</TableHead>
                        <TableHead>Last Out</TableHead>
                        <TableHead>Total Hours</TableHead>
                        <TableHead>Punches</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPaired.slice(0, 200).map((p, idx) => {
                        const statusCfg = PAIRED_STATUS_CONFIG[p.status];
                        return (
                          <TableRow key={`${p.employeeId}-${p.date}-${idx}`}>
                            <TableCell>
                              <span className="text-sm text-gray-600">
                                {new Date(p.date).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm text-gray-900">
                                  {p.employeeName}
                                </p>
                                <p className="text-xs text-gray-400">{p.employeeCode}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {p.firstIn ? (
                                <span className="font-mono text-sm text-green-700">
                                  {formatTime(p.firstIn)}
                                </span>
                              ) : (
                                <span className="text-xs text-red-400">Missing</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {p.lastOut ? (
                                <span className="font-mono text-sm text-red-700">
                                  {formatTime(p.lastOut)}
                                </span>
                              ) : (
                                <span className="text-xs text-red-400">Missing</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {p.totalHours !== undefined ? (
                                <span
                                  className={`font-medium text-sm ${
                                    p.totalHours >= 8
                                      ? 'text-green-600'
                                      : p.totalHours >= 4
                                        ? 'text-yellow-600'
                                        : 'text-red-600'
                                  }`}
                                >
                                  {p.totalHours.toFixed(1)}h
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-500">{p.punches.length}</span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`text-xs flex items-center gap-1 w-fit ${statusCfg.color}`}
                              >
                                {statusCfg.icon}
                                {statusCfg.label}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
