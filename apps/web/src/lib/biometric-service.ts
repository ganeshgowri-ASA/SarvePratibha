// Biometric Attendance Machine Integration Service
// Mock SDK integration for ZKTeco, eSSL/Matrix COSEC, HikVision, Suprema BioStar, Mantra, Realtime, Secugen

export type DeviceBrand = 'ZKTeco' | 'eSSL/Matrix COSEC' | 'HikVision' | 'Suprema BioStar' | 'Mantra' | 'Realtime' | 'Secugen';
export type DeviceProtocol = 'TCP/IP' | 'UDP' | 'HTTP/REST API' | 'PUSH SDK' | 'ZK Protocol';
export type ConnectionStatus = 'Online' | 'Offline' | 'Error' | 'Connecting';
export type PunchType = 'IN' | 'OUT';
export type VerifyMethod = 'fingerprint' | 'face' | 'card' | 'pin';
export type SyncInterval = 15 | 30 | 60;

export interface BiometricDevice {
  id: string;
  name: string;
  serialNumber: string;
  brand: DeviceBrand;
  modelNumber: string;
  location: string;
  floor: string;
  ipAddress: string;
  port: number;
  subnetMask: string;
  gateway: string;
  dns: string;
  macAddress: string;
  dhcpEnabled: boolean;
  protocol: DeviceProtocol;
  connectionStatus: ConnectionStatus;
  lastSync?: string;
  lastPing?: string;
  syncInterval: SyncInterval;
  isActive: boolean;
  enrolledUsers: number;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceLog {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  punchTime: string;
  punchType: PunchType;
  deviceId: string;
  deviceName: string;
  verifyMethod: VerifyMethod;
  status: 'valid' | 'duplicate' | 'error';
  rawData?: string;
}

export interface PairedPunch {
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  date: string;
  firstIn?: string;
  lastOut?: string;
  totalHours?: number;
  status: 'complete' | 'missing_out' | 'missing_in' | 'late' | 'early_departure';
  punches: AttendanceLog[];
}

export interface DeviceUser {
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  fingerprintCount: number;
  faceTemplateCount: number;
  cardNumber?: string;
  enrolledAt: string;
}

export interface DeviceInfo {
  firmwareVersion: string;
  serialNumber: string;
  deviceName: string;
  totalUsers: number;
  totalLogs: number;
  freeSpace: number;
  platform: string;
}

export interface ConnectionResult {
  success: boolean;
  message: string;
  latency?: number;
  deviceInfo?: DeviceInfo;
}

export interface SyncResult {
  success: boolean;
  message: string;
  logsCount: number;
  newLogs: number;
  duplicates: number;
  errors: number;
  timestamp: string;
}

const STORAGE_KEY_DEVICES = 'biometric_devices';
const STORAGE_KEY_LOGS = 'biometric_attendance_logs';
const STORAGE_KEY_MAPPINGS = 'biometric_employee_mappings';

function getStorage<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// Brand-specific default ports
export const BRAND_DEFAULT_PORTS: Record<DeviceBrand, number> = {
  'ZKTeco': 4370,
  'eSSL/Matrix COSEC': 80,
  'HikVision': 80,
  'Suprema BioStar': 443,
  'Mantra': 80,
  'Realtime': 4370,
  'Secugen': 80,
};

// Brand-specific default protocols
export const BRAND_DEFAULT_PROTOCOLS: Record<DeviceBrand, DeviceProtocol> = {
  'ZKTeco': 'ZK Protocol',
  'eSSL/Matrix COSEC': 'HTTP/REST API',
  'HikVision': 'HTTP/REST API',
  'Suprema BioStar': 'HTTP/REST API',
  'Mantra': 'TCP/IP',
  'Realtime': 'ZK Protocol',
  'Secugen': 'TCP/IP',
};

// Common model numbers by brand
export const BRAND_MODELS: Record<DeviceBrand, string[]> = {
  'ZKTeco': ['ZKTeco K40', 'ZKTeco K80', 'ZKTeco MB360', 'ZKTeco MB10VL', 'ZKTeco SpeedFace V5L', 'ZKTeco ProFace X'],
  'eSSL/Matrix COSEC': ['eSSL X990', 'eSSL X990-C', 'Matrix COSEC DOOR FMX', 'Matrix COSEC DOOR VEGA', 'eSSL E9C'],
  'HikVision': ['HikVision DS-K1T671M', 'HikVision DS-K1T671TM', 'HikVision DS-K1T804MF', 'HikVision DS-K1T643MWX'],
  'Suprema BioStar': ['Suprema BioEntry W2', 'Suprema BioStation 2', 'Suprema FaceStation 2', 'Suprema BioStation L2'],
  'Mantra': ['Mantra MFS100', 'Mantra MFS500', 'Mantra MAD11'],
  'Realtime': ['Realtime T101', 'Realtime T501', 'Realtime B6', 'Realtime RS20'],
  'Secugen': ['Secugen HU20', 'Secugen Hamster Pro', 'Secugen FDU04'],
};

// --- Mock SDK implementations ---

function simulateNetworkDelay(min = 100, max = 800): Promise<void> {
  const delay = Math.random() * (max - min) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function generateMockLogs(deviceId: string, deviceName: string, count: number): AttendanceLog[] {
  const methods: VerifyMethod[] = ['fingerprint', 'face', 'card', 'pin'];
  const employees = [
    { id: 'emp001', name: 'Rajesh Kumar', code: 'EMP001' },
    { id: 'emp002', name: 'Priya Sharma', code: 'EMP002' },
    { id: 'emp003', name: 'Anil Singh', code: 'EMP003' },
    { id: 'emp004', name: 'Sunita Patel', code: 'EMP004' },
    { id: 'emp005', name: 'Vikram Mehta', code: 'EMP005' },
  ];

  const logs: AttendanceLog[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const emp = employees[Math.floor(Math.random() * employees.length)];
    const hoursAgo = Math.random() * 24;
    const punchTime = new Date(now.getTime() - hoursAgo * 3600000);

    logs.push({
      id: `log_${deviceId}_${Date.now()}_${i}`,
      employeeId: emp.id,
      employeeName: emp.name,
      employeeCode: emp.code,
      punchTime: punchTime.toISOString(),
      punchType: Math.random() > 0.5 ? 'IN' : 'OUT',
      deviceId,
      deviceName,
      verifyMethod: methods[Math.floor(Math.random() * methods.length)],
      status: 'valid',
    });
  }

  return logs.sort((a, b) => new Date(a.punchTime).getTime() - new Date(b.punchTime).getTime());
}

// ZKTeco ZK Protocol simulation (port 4370)
async function zktecoConnect(device: BiometricDevice): Promise<ConnectionResult> {
  await simulateNetworkDelay(200, 600);
  const success = Math.random() > 0.2; // 80% success rate
  if (success) {
    return {
      success: true,
      message: `ZK Protocol connection established to ${device.ipAddress}:${device.port}`,
      latency: Math.floor(Math.random() * 50) + 5,
      deviceInfo: {
        firmwareVersion: '6.60 Sep 19 2019',
        serialNumber: device.serialNumber,
        deviceName: device.modelNumber,
        totalUsers: Math.floor(Math.random() * 500) + 50,
        totalLogs: Math.floor(Math.random() * 10000) + 1000,
        freeSpace: Math.floor(Math.random() * 30) + 60,
        platform: 'ZKTeco ZK7.0',
      },
    };
  }
  return { success: false, message: `Connection timeout to ${device.ipAddress}:${device.port} (ZK Protocol)` };
}

// eSSL/Matrix COSEC API simulation
async function esslConnect(device: BiometricDevice): Promise<ConnectionResult> {
  await simulateNetworkDelay(300, 700);
  const success = Math.random() > 0.15;
  if (success) {
    return {
      success: true,
      message: `COSEC API connected to http://${device.ipAddress}:${device.port}`,
      latency: Math.floor(Math.random() * 80) + 10,
      deviceInfo: {
        firmwareVersion: '2.8.1.24',
        serialNumber: device.serialNumber,
        deviceName: device.modelNumber,
        totalUsers: Math.floor(Math.random() * 1000) + 100,
        totalLogs: Math.floor(Math.random() * 50000) + 5000,
        freeSpace: Math.floor(Math.random() * 40) + 50,
        platform: 'COSEC Platform 3.0',
      },
    };
  }
  return { success: false, message: `COSEC API unreachable at ${device.ipAddress}:${device.port}` };
}

// HikVision ISAPI simulation
async function hikvisionConnect(device: BiometricDevice): Promise<ConnectionResult> {
  await simulateNetworkDelay(150, 500);
  const success = Math.random() > 0.1;
  if (success) {
    return {
      success: true,
      message: `HikVision ISAPI connected to ${device.ipAddress}`,
      latency: Math.floor(Math.random() * 40) + 8,
      deviceInfo: {
        firmwareVersion: 'V1.3.1 build 210901',
        serialNumber: device.serialNumber,
        deviceName: device.modelNumber,
        totalUsers: Math.floor(Math.random() * 3000) + 200,
        totalLogs: Math.floor(Math.random() * 100000) + 10000,
        freeSpace: Math.floor(Math.random() * 50) + 40,
        platform: 'HikVision DS Platform',
      },
    };
  }
  return { success: false, message: `HikVision ISAPI auth failed at ${device.ipAddress}` };
}

// Suprema BioStar 2 REST API simulation
async function supremaConnect(device: BiometricDevice): Promise<ConnectionResult> {
  await simulateNetworkDelay(200, 600);
  const success = Math.random() > 0.15;
  if (success) {
    return {
      success: true,
      message: `BioStar 2 API connected to ${device.ipAddress}:${device.port}`,
      latency: Math.floor(Math.random() * 60) + 15,
      deviceInfo: {
        firmwareVersion: 'BS2-OIPW V2.9.7',
        serialNumber: device.serialNumber,
        deviceName: device.modelNumber,
        totalUsers: Math.floor(Math.random() * 5000) + 500,
        totalLogs: Math.floor(Math.random() * 200000) + 20000,
        freeSpace: Math.floor(Math.random() * 60) + 30,
        platform: 'BioStar 2 Platform',
      },
    };
  }
  return { success: false, message: `BioStar 2 REST API connection failed for ${device.ipAddress}` };
}

// Generic connection for other brands
async function genericConnect(device: BiometricDevice): Promise<ConnectionResult> {
  await simulateNetworkDelay(100, 500);
  const success = Math.random() > 0.2;
  if (success) {
    return {
      success: true,
      message: `Connected to ${device.brand} device at ${device.ipAddress}:${device.port}`,
      latency: Math.floor(Math.random() * 70) + 10,
      deviceInfo: {
        firmwareVersion: '1.0.0',
        serialNumber: device.serialNumber,
        deviceName: device.modelNumber,
        totalUsers: Math.floor(Math.random() * 200) + 20,
        totalLogs: Math.floor(Math.random() * 5000) + 500,
        freeSpace: Math.floor(Math.random() * 40) + 50,
        platform: `${device.brand} Platform`,
      },
    };
  }
  return { success: false, message: `Connection failed to ${device.ipAddress}:${device.port}` };
}

// --- Public API ---

export async function connectDevice(device: BiometricDevice): Promise<ConnectionResult> {
  switch (device.brand) {
    case 'ZKTeco':
    case 'Realtime':
      return zktecoConnect(device);
    case 'eSSL/Matrix COSEC':
      return esslConnect(device);
    case 'HikVision':
      return hikvisionConnect(device);
    case 'Suprema BioStar':
      return supremaConnect(device);
    default:
      return genericConnect(device);
  }
}

export async function disconnectDevice(deviceId: string): Promise<{ success: boolean; message: string }> {
  await simulateNetworkDelay(100, 300);
  return { success: true, message: `Device ${deviceId} disconnected successfully` };
}

export async function syncAttendanceLogs(device: BiometricDevice): Promise<SyncResult> {
  await simulateNetworkDelay(500, 2000);

  const existingLogs = getStorage<AttendanceLog>(STORAGE_KEY_LOGS);
  const deviceLogs = existingLogs.filter((l) => l.deviceId === device.id);
  const newLogsCount = Math.floor(Math.random() * 20) + 5;
  const newLogs = generateMockLogs(device.id, device.name, newLogsCount);
  const duplicates = Math.floor(Math.random() * 3);

  const allLogs = [...existingLogs, ...newLogs];
  setStorage(STORAGE_KEY_LOGS, allLogs);

  return {
    success: true,
    message: `Synced ${newLogsCount} new logs from ${device.name}`,
    logsCount: deviceLogs.length + newLogsCount,
    newLogs: newLogsCount,
    duplicates,
    errors: 0,
    timestamp: new Date().toISOString(),
  };
}

export async function getDeviceInfo(device: BiometricDevice): Promise<DeviceInfo | null> {
  const result = await connectDevice(device);
  return result.success ? result.deviceInfo || null : null;
}

export async function getDeviceUsers(device: BiometricDevice): Promise<DeviceUser[]> {
  await simulateNetworkDelay(300, 800);
  const mappings = getStorage<{ deviceId: string; deviceUser: DeviceUser }>(STORAGE_KEY_MAPPINGS);
  return mappings.filter((m) => m.deviceId === device.id).map((m) => m.deviceUser);
}

export async function enrollUser(device: BiometricDevice, employee: { id: string; name: string; code: string }): Promise<{ success: boolean; message: string }> {
  await simulateNetworkDelay(1000, 3000);
  const mappings = getStorage<{ deviceId: string; deviceUser: DeviceUser }>(STORAGE_KEY_MAPPINGS);
  const exists = mappings.some((m) => m.deviceId === device.id && m.deviceUser.employeeId === employee.id);

  if (exists) {
    return { success: false, message: 'Employee already enrolled on this device' };
  }

  const newUser: DeviceUser = {
    employeeId: employee.id,
    employeeName: employee.name,
    employeeCode: employee.code,
    fingerprintCount: Math.floor(Math.random() * 3),
    faceTemplateCount: Math.floor(Math.random() * 2),
    enrolledAt: new Date().toISOString(),
  };

  mappings.push({ deviceId: device.id, deviceUser: newUser });
  setStorage(STORAGE_KEY_MAPPINGS, mappings);

  return { success: true, message: `${employee.name} enrolled successfully on ${device.name}` };
}

export async function deleteUser(device: BiometricDevice, employeeId: string): Promise<{ success: boolean; message: string }> {
  await simulateNetworkDelay(500, 1500);
  const mappings = getStorage<{ deviceId: string; deviceUser: DeviceUser }>(STORAGE_KEY_MAPPINGS);
  const filtered = mappings.filter((m) => !(m.deviceId === device.id && m.deviceUser.employeeId === employeeId));
  setStorage(STORAGE_KEY_MAPPINGS, filtered);
  return { success: true, message: 'Employee removed from device successfully' };
}

// Device CRUD
export function getAllDevices(): BiometricDevice[] {
  return getStorage<BiometricDevice>(STORAGE_KEY_DEVICES);
}

export function saveDevice(device: BiometricDevice): void {
  const devices = getAllDevices();
  const idx = devices.findIndex((d) => d.id === device.id);
  if (idx >= 0) {
    devices[idx] = { ...device, updatedAt: new Date().toISOString() };
  } else {
    devices.push({ ...device, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  setStorage(STORAGE_KEY_DEVICES, devices);
}

export function deleteDevice(deviceId: string): void {
  const devices = getAllDevices().filter((d) => d.id !== deviceId);
  setStorage(STORAGE_KEY_DEVICES, devices);
}

export function updateDeviceStatus(deviceId: string, status: ConnectionStatus, lastSync?: string): void {
  const devices = getAllDevices();
  const idx = devices.findIndex((d) => d.id === deviceId);
  if (idx >= 0) {
    devices[idx].connectionStatus = status;
    if (lastSync) devices[idx].lastSync = lastSync;
    devices[idx].lastPing = new Date().toISOString();
    devices[idx].updatedAt = new Date().toISOString();
    setStorage(STORAGE_KEY_DEVICES, devices);
  }
}

// Logs CRUD
export function getAllLogs(): AttendanceLog[] {
  return getStorage<AttendanceLog>(STORAGE_KEY_LOGS);
}

export function clearDeviceLogs(deviceId: string): void {
  const logs = getAllLogs().filter((l) => l.deviceId !== deviceId);
  setStorage(STORAGE_KEY_LOGS, logs);
}

// Pair IN/OUT punches
export function pairPunches(logs: AttendanceLog[]): PairedPunch[] {
  const byEmployee: Record<string, Record<string, AttendanceLog[]>> = {};

  logs.forEach((log) => {
    const dateKey = new Date(log.punchTime).toISOString().split('T')[0];
    if (!byEmployee[log.employeeId]) byEmployee[log.employeeId] = {};
    if (!byEmployee[log.employeeId][dateKey]) byEmployee[log.employeeId][dateKey] = [];
    byEmployee[log.employeeId][dateKey].push(log);
  });

  const paired: PairedPunch[] = [];

  Object.entries(byEmployee).forEach(([employeeId, byDate]) => {
    Object.entries(byDate).forEach(([date, dayLogs]) => {
      const sorted = dayLogs.sort((a, b) => new Date(a.punchTime).getTime() - new Date(b.punchTime).getTime());
      const inPunches = sorted.filter((l) => l.punchType === 'IN');
      const outPunches = sorted.filter((l) => l.punchType === 'OUT');

      const firstIn = inPunches[0];
      const lastOut = outPunches[outPunches.length - 1];

      let totalHours: number | undefined;
      let status: PairedPunch['status'] = 'complete';

      if (firstIn && lastOut) {
        totalHours = (new Date(lastOut.punchTime).getTime() - new Date(firstIn.punchTime).getTime()) / 3600000;
        const firstInHour = new Date(firstIn.punchTime).getHours();
        const lastOutHour = new Date(lastOut.punchTime).getHours();
        if (firstInHour > 9) status = 'late';
        else if (lastOutHour < 17) status = 'early_departure';
      } else if (firstIn && !lastOut) {
        status = 'missing_out';
      } else if (!firstIn && lastOut) {
        status = 'missing_in';
      }

      paired.push({
        employeeId,
        employeeName: sorted[0].employeeName,
        employeeCode: sorted[0].employeeCode,
        date,
        firstIn: firstIn?.punchTime,
        lastOut: lastOut?.punchTime,
        totalHours,
        status,
        punches: sorted,
      });
    });
  });

  return paired.sort((a, b) => b.date.localeCompare(a.date));
}

// Auto-sync scheduler
let syncTimers: Record<string, ReturnType<typeof setInterval>> = {};

export function startAutoSync(device: BiometricDevice, onSync: (result: SyncResult) => void): void {
  stopAutoSync(device.id);
  const intervalMs = device.syncInterval * 60 * 1000;
  syncTimers[device.id] = setInterval(async () => {
    const result = await syncAttendanceLogs(device);
    if (result.success) {
      updateDeviceStatus(device.id, 'Online', result.timestamp);
    }
    onSync(result);
  }, intervalMs);
}

export function stopAutoSync(deviceId: string): void {
  if (syncTimers[deviceId]) {
    clearInterval(syncTimers[deviceId]);
    delete syncTimers[deviceId];
  }
}

export function generateDeviceId(): string {
  return `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
