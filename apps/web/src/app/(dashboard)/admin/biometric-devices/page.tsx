'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Cpu,
  Wifi,
  WifiOff,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Upload,
  Activity,
  Server,
  AlertCircle,
  CheckCircle,
  Clock,
  Network,
  Loader2,
} from 'lucide-react';
import {
  type BiometricDevice,
  type DeviceBrand,
  type DeviceProtocol,
  type ConnectionStatus,
  type SyncInterval,
  BRAND_DEFAULT_PORTS,
  BRAND_DEFAULT_PROTOCOLS,
  BRAND_MODELS,
  getAllDevices,
  saveDevice,
  deleteDevice,
  updateDeviceStatus,
  connectDevice,
  syncAttendanceLogs,
  generateDeviceId,
} from '@/lib/biometric-service';

const BRANDS: DeviceBrand[] = [
  'ZKTeco',
  'eSSL/Matrix COSEC',
  'HikVision',
  'Suprema BioStar',
  'Mantra',
  'Realtime',
  'Secugen',
];

const PROTOCOLS: DeviceProtocol[] = ['TCP/IP', 'UDP', 'HTTP/REST API', 'PUSH SDK', 'ZK Protocol'];
const SYNC_INTERVALS: SyncInterval[] = [15, 30, 60];

const STATUS_CONFIG: Record<ConnectionStatus, { label: string; color: string; icon: React.ReactNode }> = {
  Online: { label: 'Online', color: 'bg-green-100 text-green-700 border-green-200', icon: <Wifi size={12} /> },
  Offline: { label: 'Offline', color: 'bg-gray-100 text-gray-600 border-gray-200', icon: <WifiOff size={12} /> },
  Error: { label: 'Error', color: 'bg-red-100 text-red-700 border-red-200', icon: <AlertCircle size={12} /> },
  Connecting: { label: 'Connecting', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: <Loader2 size={12} className="animate-spin" /> },
};

const SAMPLE_DEVICES: Omit<BiometricDevice, 'createdAt' | 'updatedAt'>[] = [
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
    lastPing: new Date(Date.now() - 2 * 60000).toISOString(),
    syncInterval: 30,
    isActive: true,
    enrolledUsers: 245,
  },
  {
    id: 'dev_sample_002',
    name: 'IT Department',
    serialNumber: 'ESSL-2024-002',
    brand: 'eSSL/Matrix COSEC',
    modelNumber: 'eSSL X990',
    location: 'IT Department',
    floor: '3rd Floor',
    ipAddress: '192.168.1.202',
    port: 80,
    subnetMask: '255.255.255.0',
    gateway: '192.168.1.1',
    dns: '8.8.8.8',
    macAddress: 'AA:BB:CC:DD:EE:02',
    dhcpEnabled: false,
    protocol: 'HTTP/REST API',
    connectionStatus: 'Offline',
    lastSync: new Date(Date.now() - 2 * 3600000).toISOString(),
    lastPing: new Date(Date.now() - 15 * 60000).toISOString(),
    syncInterval: 60,
    isActive: true,
    enrolledUsers: 87,
  },
  {
    id: 'dev_sample_003',
    name: 'HR & Finance Wing',
    serialNumber: 'HK-2024-003',
    brand: 'HikVision',
    modelNumber: 'HikVision DS-K1T671M',
    location: 'HR Department',
    floor: '2nd Floor',
    ipAddress: '192.168.1.203',
    port: 80,
    subnetMask: '255.255.255.0',
    gateway: '192.168.1.1',
    dns: '8.8.8.8',
    macAddress: 'AA:BB:CC:DD:EE:03',
    dhcpEnabled: true,
    protocol: 'HTTP/REST API',
    connectionStatus: 'Online',
    lastSync: new Date(Date.now() - 15 * 60000).toISOString(),
    lastPing: new Date(Date.now() - 1 * 60000).toISOString(),
    syncInterval: 15,
    isActive: true,
    enrolledUsers: 134,
  },
];

const EMPTY_DEVICE: Partial<BiometricDevice> = {
  name: '',
  serialNumber: '',
  brand: 'ZKTeco',
  modelNumber: '',
  location: '',
  floor: '',
  ipAddress: '',
  port: 4370,
  subnetMask: '255.255.255.0',
  gateway: '',
  dns: '8.8.8.8',
  macAddress: '',
  dhcpEnabled: false,
  protocol: 'ZK Protocol',
  syncInterval: 30,
  isActive: true,
  enrolledUsers: 0,
  connectionStatus: 'Offline',
};

function formatTime(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BiometricDevicesPage() {
  const [devices, setDevices] = useState<BiometricDevice[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [connectionDialogOpen, setConnectionDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Partial<BiometricDevice>>(EMPTY_DEVICE);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [connectionResult, setConnectionResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null);
  const [csvData, setCsvData] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  const loadDevices = useCallback(() => {
    let stored = getAllDevices();
    if (stored.length === 0) {
      const now = new Date().toISOString();
      stored = SAMPLE_DEVICES.map((d) => ({ ...d, createdAt: now, updatedAt: now }));
      stored.forEach(saveDevice);
    }
    setDevices(stored);
  }, []);

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  const handleBrandChange = (brand: DeviceBrand) => {
    setEditingDevice((prev) => ({
      ...prev,
      brand,
      port: BRAND_DEFAULT_PORTS[brand],
      protocol: BRAND_DEFAULT_PROTOCOLS[brand],
      modelNumber: BRAND_MODELS[brand][0] || '',
    }));
  };

  const handleSave = () => {
    if (!editingDevice.name || !editingDevice.ipAddress || !editingDevice.brand) return;
    const device: BiometricDevice = {
      id: editingDevice.id || generateDeviceId(),
      name: editingDevice.name || '',
      serialNumber: editingDevice.serialNumber || '',
      brand: editingDevice.brand as DeviceBrand,
      modelNumber: editingDevice.modelNumber || '',
      location: editingDevice.location || '',
      floor: editingDevice.floor || '',
      ipAddress: editingDevice.ipAddress || '',
      port: editingDevice.port || 4370,
      subnetMask: editingDevice.subnetMask || '255.255.255.0',
      gateway: editingDevice.gateway || '',
      dns: editingDevice.dns || '8.8.8.8',
      macAddress: editingDevice.macAddress || '',
      dhcpEnabled: editingDevice.dhcpEnabled || false,
      protocol: editingDevice.protocol as DeviceProtocol,
      connectionStatus: editingDevice.connectionStatus || 'Offline',
      lastSync: editingDevice.lastSync,
      lastPing: editingDevice.lastPing,
      syncInterval: editingDevice.syncInterval as SyncInterval || 30,
      isActive: editingDevice.isActive ?? true,
      enrolledUsers: editingDevice.enrolledUsers || 0,
      createdAt: editingDevice.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveDevice(device);
    loadDevices();
    setDialogOpen(false);
    setEditingDevice(EMPTY_DEVICE);
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteDevice(deletingId);
      loadDevices();
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const handleTestConnection = async (device: BiometricDevice) => {
    setTestingId(device.id);
    updateDeviceStatus(device.id, 'Connecting');
    loadDevices();
    try {
      const result = await connectDevice(device);
      updateDeviceStatus(device.id, result.success ? 'Online' : 'Error');
      setConnectionResult(result);
      setConnectionDialogOpen(true);
      loadDevices();
    } finally {
      setTestingId(null);
    }
  };

  const handleSync = async (device: BiometricDevice) => {
    setSyncingId(device.id);
    try {
      const result = await syncAttendanceLogs(device);
      if (result.success) {
        updateDeviceStatus(device.id, 'Online', result.timestamp);
        loadDevices();
      }
    } finally {
      setSyncingId(null);
    }
  };

  const handleCsvImport = () => {
    const lines = csvData.trim().split('\n').slice(1); // skip header
    const now = new Date().toISOString();
    lines.forEach((line) => {
      const parts = line.split(',').map((p) => p.trim());
      if (parts.length >= 6) {
        const brand = parts[2] as DeviceBrand;
        const device: BiometricDevice = {
          id: generateDeviceId(),
          name: parts[0],
          serialNumber: parts[1],
          brand,
          modelNumber: parts[3],
          location: parts[4],
          floor: parts[5] || 'Ground Floor',
          ipAddress: parts[6] || '192.168.1.100',
          port: parseInt(parts[7]) || BRAND_DEFAULT_PORTS[brand] || 4370,
          subnetMask: '255.255.255.0',
          gateway: '192.168.1.1',
          dns: '8.8.8.8',
          macAddress: '',
          dhcpEnabled: false,
          protocol: BRAND_DEFAULT_PROTOCOLS[brand] || 'TCP/IP',
          connectionStatus: 'Offline',
          syncInterval: 30,
          isActive: true,
          enrolledUsers: 0,
          createdAt: now,
          updatedAt: now,
        };
        saveDevice(device);
      }
    });
    loadDevices();
    setCsvDialogOpen(false);
    setCsvData('');
  };

  const onlineCount = devices.filter((d) => d.connectionStatus === 'Online').length;
  const offlineCount = devices.filter((d) => d.connectionStatus === 'Offline').length;
  const errorCount = devices.filter((d) => d.connectionStatus === 'Error').length;
  const lastGlobalSync = devices.reduce<string | undefined>((latest, d) => {
    if (!d.lastSync) return latest;
    if (!latest) return d.lastSync;
    return d.lastSync > latest ? d.lastSync : latest;
  }, undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Biometric Devices</h1>
          <p className="text-sm text-gray-500">Manage biometric attendance machines across all locations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCsvDialogOpen(true)}>
            <Upload size={16} className="mr-2" />
            Import CSV
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700"
            onClick={() => {
              setEditingDevice({ ...EMPTY_DEVICE });
              setActiveTab('basic');
              setDialogOpen(true);
            }}
          >
            <Plus size={16} className="mr-2" />
            Add Device
          </Button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Server size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{devices.length}</p>
              <p className="text-xs text-gray-500">Total Devices</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Wifi size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{onlineCount}</p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <WifiOff size={20} className="text-gray-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">{offlineCount + errorCount}</p>
              <p className="text-xs text-gray-500">Offline / Error</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Clock size={20} className="text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{formatTime(lastGlobalSync)}</p>
              <p className="text-xs text-gray-500">Last Global Sync</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Devices Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Cpu size={18} className="text-teal-600" />
            Device Registry
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Brand / Model</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>IP / Port</TableHead>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Sync</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-gray-400">
                      No biometric devices configured. Click &quot;Add Device&quot; to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  devices.map((device) => {
                    const statusCfg = STATUS_CONFIG[device.connectionStatus];
                    return (
                      <TableRow key={device.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm text-gray-900">{device.name}</p>
                            <p className="text-xs text-gray-400">SN: {device.serialNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{device.brand}</p>
                            <p className="text-xs text-gray-400">{device.modelNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{device.location}</p>
                            <p className="text-xs text-gray-400">{device.floor}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                            {device.ipAddress}:{device.port}
                          </code>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-gray-600">{device.protocol}</span>
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
                        <TableCell>
                          <span className="text-xs text-gray-500">{formatTime(device.lastSync)}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{device.enrolledUsers}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs"
                              onClick={() => handleTestConnection(device)}
                              disabled={testingId === device.id}
                            >
                              {testingId === device.id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Activity size={12} />
                              )}
                              <span className="ml-1">Ping</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs"
                              onClick={() => handleSync(device)}
                              disabled={syncingId === device.id}
                            >
                              {syncingId === device.id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <RefreshCw size={12} />
                              )}
                              <span className="ml-1">Sync</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={() => {
                                setEditingDevice({ ...device });
                                setActiveTab('basic');
                                setDialogOpen(true);
                              }}
                            >
                              <Edit size={12} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                              onClick={() => {
                                setDeletingId(device.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 size={12} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Device Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDevice.id ? 'Edit Device' : 'Add Biometric Device'}</DialogTitle>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="network">Network Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Device Name *</Label>
                  <Input
                    id="name"
                    value={editingDevice.name || ''}
                    onChange={(e) => setEditingDevice((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g., Main Gate Entry"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="serial">Serial Number</Label>
                  <Input
                    id="serial"
                    value={editingDevice.serialNumber || ''}
                    onChange={(e) => setEditingDevice((p) => ({ ...p, serialNumber: e.target.value }))}
                    placeholder="e.g., ZK-2024-001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Brand / Make *</Label>
                  <Select
                    value={editingDevice.brand}
                    onValueChange={(v) => handleBrandChange(v as DeviceBrand)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANDS.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Model Number</Label>
                  <Select
                    value={editingDevice.modelNumber}
                    onValueChange={(v) => setEditingDevice((p) => ({ ...p, modelNumber: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {(BRAND_MODELS[editingDevice.brand as DeviceBrand] || []).map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="location">Location / Area</Label>
                  <Input
                    id="location"
                    value={editingDevice.location || ''}
                    onChange={(e) => setEditingDevice((p) => ({ ...p, location: e.target.value }))}
                    placeholder="e.g., Main Lobby"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="floor">Floor</Label>
                  <Input
                    id="floor"
                    value={editingDevice.floor || ''}
                    onChange={(e) => setEditingDevice((p) => ({ ...p, floor: e.target.value }))}
                    placeholder="e.g., Ground Floor"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Communication Protocol</Label>
                  <Select
                    value={editingDevice.protocol}
                    onValueChange={(v) => setEditingDevice((p) => ({ ...p, protocol: v as DeviceProtocol }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROTOCOLS.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Auto Sync Interval</Label>
                  <Select
                    value={String(editingDevice.syncInterval)}
                    onValueChange={(v) => setEditingDevice((p) => ({ ...p, syncInterval: parseInt(v) as SyncInterval }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SYNC_INTERVALS.map((i) => (
                        <SelectItem key={i} value={String(i)}>{i} minutes</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="active"
                  checked={editingDevice.isActive ?? true}
                  onCheckedChange={(v) => setEditingDevice((p) => ({ ...p, isActive: v }))}
                />
                <Label htmlFor="active">Device Active</Label>
              </div>
            </TabsContent>

            <TabsContent value="network" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Network size={16} className="text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">Network Configuration</span>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="dhcp"
                  checked={editingDevice.dhcpEnabled || false}
                  onCheckedChange={(v) => setEditingDevice((p) => ({ ...p, dhcpEnabled: v }))}
                />
                <Label htmlFor="dhcp">Enable DHCP (auto-assign IP)</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="ip">IP Address *</Label>
                  <Input
                    id="ip"
                    value={editingDevice.ipAddress || ''}
                    onChange={(e) => setEditingDevice((p) => ({ ...p, ipAddress: e.target.value }))}
                    placeholder="192.168.1.201"
                    disabled={editingDevice.dhcpEnabled}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    type="number"
                    value={editingDevice.port || 4370}
                    onChange={(e) => setEditingDevice((p) => ({ ...p, port: parseInt(e.target.value) }))}
                    placeholder="4370"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="subnet">Subnet Mask</Label>
                  <Input
                    id="subnet"
                    value={editingDevice.subnetMask || ''}
                    onChange={(e) => setEditingDevice((p) => ({ ...p, subnetMask: e.target.value }))}
                    placeholder="255.255.255.0"
                    disabled={editingDevice.dhcpEnabled}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="gateway">Gateway</Label>
                  <Input
                    id="gateway"
                    value={editingDevice.gateway || ''}
                    onChange={(e) => setEditingDevice((p) => ({ ...p, gateway: e.target.value }))}
                    placeholder="192.168.1.1"
                    disabled={editingDevice.dhcpEnabled}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="dns">DNS Server</Label>
                  <Input
                    id="dns"
                    value={editingDevice.dns || ''}
                    onChange={(e) => setEditingDevice((p) => ({ ...p, dns: e.target.value }))}
                    placeholder="8.8.8.8"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="mac">MAC Address</Label>
                  <Input
                    id="mac"
                    value={editingDevice.macAddress || ''}
                    onChange={(e) => setEditingDevice((p) => ({ ...p, macAddress: e.target.value }))}
                    placeholder="AA:BB:CC:DD:EE:FF"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSave}>
              {editingDevice.id ? 'Save Changes' : 'Add Device'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Device</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to remove this device? This will also clear all synced logs from this device.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Connection Result Dialog */}
      <Dialog open={connectionDialogOpen} onOpenChange={setConnectionDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Connection Test Result</DialogTitle>
          </DialogHeader>
          {connectionResult && (
            <div className={`p-4 rounded-lg ${connectionResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {connectionResult.success ? (
                  <CheckCircle size={18} className="text-green-600" />
                ) : (
                  <AlertCircle size={18} className="text-red-600" />
                )}
                <span className={`font-medium text-sm ${connectionResult.success ? 'text-green-700' : 'text-red-700'}`}>
                  {connectionResult.success ? 'Connected Successfully' : 'Connection Failed'}
                </span>
              </div>
              <p className="text-sm text-gray-600">{connectionResult.message}</p>
              {connectionResult.latency && (
                <p className="text-xs text-gray-500 mt-1">Latency: {connectionResult.latency}ms</p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setConnectionDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSV Import Dialog */}
      <Dialog open={csvDialogOpen} onOpenChange={setCsvDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Import Devices via CSV</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-xs text-gray-500">
              CSV format: Name, SerialNumber, Brand, Model, Location, Floor, IPAddress, Port
            </p>
            <p className="text-xs font-mono bg-gray-100 p-2 rounded text-gray-600">
              Name,SerialNumber,Brand,Model,Location,Floor,IPAddress,Port<br />
              Main Gate,ZK-001,ZKTeco,ZKTeco K40,Lobby,Ground,192.168.1.201,4370
            </p>
            <textarea
              className="w-full h-40 text-sm font-mono border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Paste CSV data here..."
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCsvDialogOpen(false)}>Cancel</Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleCsvImport} disabled={!csvData.trim()}>
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
