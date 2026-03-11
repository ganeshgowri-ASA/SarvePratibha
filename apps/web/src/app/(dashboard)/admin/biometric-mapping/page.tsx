'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import {
  UserCheck,
  UserMinus,
  Fingerprint,
  Scan,
  Search,
  Loader2,
  RefreshCw,
  Users,
  Cpu,
} from 'lucide-react';
import {
  type BiometricDevice,
  type DeviceUser,
  getAllDevices,
  enrollUser,
  deleteUser,
  getDeviceUsers,
  saveDevice,
  generateDeviceId,
} from '@/lib/biometric-service';

// Mock employee master data
const MOCK_EMPLOYEES = [
  { id: 'emp001', name: 'Rajesh Kumar', code: 'EMP001', department: 'Engineering' },
  { id: 'emp002', name: 'Priya Sharma', code: 'EMP002', department: 'HR' },
  { id: 'emp003', name: 'Anil Singh', code: 'EMP003', department: 'Finance' },
  { id: 'emp004', name: 'Sunita Patel', code: 'EMP004', department: 'Operations' },
  { id: 'emp005', name: 'Vikram Mehta', code: 'EMP005', department: 'IT' },
  { id: 'emp006', name: 'Deepa Nair', code: 'EMP006', department: 'Marketing' },
  { id: 'emp007', name: 'Arjun Reddy', code: 'EMP007', department: 'Sales' },
  { id: 'emp008', name: 'Kavita Joshi', code: 'EMP008', department: 'Legal' },
  { id: 'emp009', name: 'Rohit Gupta', code: 'EMP009', department: 'Engineering' },
  { id: 'emp010', name: 'Meena Iyer', code: 'EMP010', department: 'HR' },
];

const SAMPLE_DEVICES_FALLBACK: Omit<BiometricDevice, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'dev_sample_001',
    name: 'Main Gate Entry',
    serialNumber: 'ZK-2024-001',
    brand: 'ZKTeco',
    modelNumber: 'ZKTeco K40',
    location: 'Main Lobby',
    floor: 'Ground Floor',
    ipAddress: '192.168.1.201',
    port: 4370,
    subnetMask: '255.255.255.0',
    gateway: '192.168.1.1',
    dns: '8.8.8.8',
    macAddress: 'AA:BB:CC:DD:EE:01',
    dhcpEnabled: false,
    protocol: 'ZK Protocol',
    connectionStatus: 'Online',
    lastSync: new Date(Date.now() - 30 * 60000).toISOString(),
    syncInterval: 30,
    isActive: true,
    enrolledUsers: 245,
  },
];

export default function BiometricMappingPage() {
  const [devices, setDevices] = useState<BiometricDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [deviceUsers, setDeviceUsers] = useState<DeviceUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [enrollingEmployee, setEnrollingEmployee] = useState<(typeof MOCK_EMPLOYEES)[0] | null>(
    null,
  );
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkEnrolling, setBulkEnrolling] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);

  const loadDevices = useCallback(() => {
    let stored = getAllDevices();
    if (stored.length === 0) {
      const now = new Date().toISOString();
      stored = SAMPLE_DEVICES_FALLBACK.map((d) => ({
        ...d,
        createdAt: now,
        updatedAt: now,
        id: d.id || generateDeviceId(),
      }));
      stored.forEach(saveDevice);
    }
    setDevices(stored);
    if (!selectedDeviceId && stored.length > 0) {
      setSelectedDeviceId(stored[0].id);
    }
  }, [selectedDeviceId]);

  const loadDeviceUsers = useCallback(async () => {
    const device = devices.find((d) => d.id === selectedDeviceId);
    if (!device) return;
    setLoadingUsers(true);
    try {
      const users = await getDeviceUsers(device);
      setDeviceUsers(users);
    } finally {
      setLoadingUsers(false);
    }
  }, [devices, selectedDeviceId]);

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  useEffect(() => {
    if (selectedDeviceId) {
      loadDeviceUsers();
    }
  }, [selectedDeviceId, loadDeviceUsers]);

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);

  const handleEnroll = async () => {
    if (!selectedDevice || !enrollingEmployee) return;
    setEnrollingId(enrollingEmployee.id);
    setEnrollDialogOpen(false);
    try {
      await enrollUser(selectedDevice, enrollingEmployee);
      await loadDeviceUsers();
    } finally {
      setEnrollingId(null);
      setEnrollingEmployee(null);
    }
  };

  const handleRemove = async (employeeId: string) => {
    if (!selectedDevice) return;
    setRemovingId(employeeId);
    try {
      await deleteUser(selectedDevice, employeeId);
      await loadDeviceUsers();
    } finally {
      setRemovingId(null);
    }
  };

  const handleBulkEnroll = async () => {
    if (!selectedDevice) return;
    setBulkEnrolling(true);
    setBulkProgress(0);
    const notEnrolled = MOCK_EMPLOYEES.filter(
      (emp) => !deviceUsers.some((du) => du.employeeId === emp.id),
    );
    for (let i = 0; i < notEnrolled.length; i++) {
      await enrollUser(selectedDevice, notEnrolled[i]);
      setBulkProgress(Math.round(((i + 1) / notEnrolled.length) * 100));
    }
    await loadDeviceUsers();
    setBulkEnrolling(false);
    setBulkDialogOpen(false);
  };

  const enrolledIds = new Set(deviceUsers.map((u) => u.employeeId));
  const filteredEmployees = MOCK_EMPLOYEES.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Device Mapping</h1>
          <p className="text-sm text-gray-500">
            Map employees to biometric devices and manage enrollments
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => loadDeviceUsers()}
            disabled={loadingUsers}
          >
            {loadingUsers ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <RefreshCw size={16} className="mr-2" />
            )}
            Refresh
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700"
            onClick={() => setBulkDialogOpen(true)}
            disabled={!selectedDeviceId}
          >
            <Users size={16} className="mr-2" />
            Bulk Enroll
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Device Selector */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Cpu size={16} className="text-teal-600" />
                Select Device
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {devices.map((device) => (
                <button
                  key={device.id}
                  onClick={() => setSelectedDeviceId(device.id)}
                  className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
                    selectedDeviceId === device.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{device.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{device.location}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        device.connectionStatus === 'Online'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-50 text-gray-500 border-gray-200'
                      }`}
                    >
                      {device.connectionStatus}
                    </Badge>
                    <span className="text-xs text-gray-400">{device.enrolledUsers} users</span>
                  </div>
                </button>
              ))}
              {devices.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  No devices found. Add devices first.
                </p>
              )}
            </CardContent>
          </Card>

          {selectedDevice && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-gray-500 uppercase tracking-wide">
                  Device Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Brand</span>
                  <span className="font-medium">{selectedDevice.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">IP</span>
                  <code className="text-xs bg-gray-100 px-1 rounded">
                    {selectedDevice.ipAddress}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Enrolled</span>
                  <span className="font-medium text-teal-600">{deviceUsers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Available</span>
                  <span className="font-medium">
                    {MOCK_EMPLOYEES.length - deviceUsers.length}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Employee List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                placeholder="Search employees by name, code, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Enrolled
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
                Not enrolled
              </span>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Fingerprints</TableHead>
                    <TableHead>Face Templates</TableHead>
                    <TableHead>Enrolled On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((emp) => {
                    const isEnrolled = enrolledIds.has(emp.id);
                    const deviceUser = deviceUsers.find((du) => du.employeeId === emp.id);
                    return (
                      <TableRow key={emp.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm text-gray-900">{emp.name}</p>
                            <p className="text-xs text-gray-400">{emp.code}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{emp.department}</span>
                        </TableCell>
                        <TableCell>
                          {isEnrolled ? (
                            <div className="flex items-center gap-1.5">
                              <Fingerprint size={14} className="text-teal-600" />
                              <span className="text-sm font-medium">
                                {deviceUser?.fingerprintCount ?? 0}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {isEnrolled ? (
                            <div className="flex items-center gap-1.5">
                              <Scan size={14} className="text-blue-600" />
                              <span className="text-sm font-medium">
                                {deviceUser?.faceTemplateCount ?? 0}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {isEnrolled && deviceUser?.enrolledAt ? (
                            <span className="text-xs text-gray-500">
                              {new Date(deviceUser.enrolledAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              isEnrolled
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-gray-50 text-gray-500 border-gray-200'
                            }`}
                          >
                            {isEnrolled ? 'Enrolled' : 'Not Enrolled'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {isEnrolled ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
                              onClick={() => handleRemove(emp.id)}
                              disabled={removingId === emp.id || !selectedDeviceId}
                            >
                              {removingId === emp.id ? (
                                <Loader2 size={12} className="animate-spin mr-1" />
                              ) : (
                                <UserMinus size={12} className="mr-1" />
                              )}
                              Remove
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs text-teal-600 hover:text-teal-700"
                              onClick={() => {
                                setEnrollingEmployee(emp);
                                setEnrollDialogOpen(true);
                              }}
                              disabled={enrollingId === emp.id || !selectedDeviceId}
                            >
                              {enrollingId === emp.id ? (
                                <Loader2 size={12} className="animate-spin mr-1" />
                              ) : (
                                <UserCheck size={12} className="mr-1" />
                              )}
                              Enroll
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enroll Confirm Dialog */}
      <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Enroll Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              Enroll <strong>{enrollingEmployee?.name}</strong> ({enrollingEmployee?.code}) on
              device <strong>{selectedDevice?.name}</strong>?
            </p>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-700">
              This will register the employee&apos;s biometric data (fingerprint/face) on the
              selected device. The employee must be physically present at the device.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEnrollDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleEnroll}>
              <Fingerprint size={14} className="mr-2" />
              Enroll Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Enroll Dialog */}
      <Dialog open={bulkDialogOpen} onOpenChange={(o) => !bulkEnrolling && setBulkDialogOpen(o)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Bulk Enroll Employees</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Enroll all employees from the master list onto{' '}
              <strong>{selectedDevice?.name}</strong>. Currently{' '}
              <strong>
                {MOCK_EMPLOYEES.filter((e) => !enrolledIds.has(e.id)).length} employees
              </strong>{' '}
              are not enrolled.
            </p>
            {bulkEnrolling && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Enrolling...</span>
                  <span>{bulkProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full transition-all"
                    style={{ width: `${bulkProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBulkDialogOpen(false)}
              disabled={bulkEnrolling}
            >
              Cancel
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700"
              onClick={handleBulkEnroll}
              disabled={bulkEnrolling}
            >
              {bulkEnrolling ? (
                <Loader2 size={14} className="mr-2 animate-spin" />
              ) : (
                <Users size={14} className="mr-2" />
              )}
              {bulkEnrolling ? 'Enrolling...' : 'Start Bulk Enroll'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
