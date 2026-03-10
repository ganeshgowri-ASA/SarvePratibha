// Demo data for the Visitor Entry Pass system

export interface Visitor {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  photo: string | null;
  aadhaarMasked: string;
  aadhaarPhoto: string | null;
  purpose: string;
  materials: { type: string; description: string }[];
  area: { building: string; floor: string; wing: string };
  department: string;
  hostEmployee: string;
  approver: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  expectedEntry: string;
  expectedExit: string;
  actualCheckIn: string | null;
  actualCheckOut: string | null;
  vehicle: { number: string; type: string } | null;
  status: 'EXPECTED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'BLACKLISTED';
  badge: string;
  visitorType: 'outsider' | 'relative';
  passId: string;
  createdAt: string;
}

export interface GatePassEntry {
  id: string;
  visitorName: string;
  passId: string;
  action: string;
  timestamp: string;
  performedBy: string;
  gate: string;
  notes: string;
}

export interface BlacklistEntry {
  id: string;
  name: string;
  phone: string;
  company: string;
  reason: string;
  blacklistedOn: string;
  blacklistedBy: string;
}

export const EMPLOYEES = [
  'Rajesh Kumar', 'Priya Patel', 'Suresh Menon', 'Anita Singh',
  'Vikram Sharma', 'Deepika Rao', 'Arjun Nair', 'Kavitha Reddy',
  'Sanjay Gupta', 'Meera Iyer', 'Anil Verma', 'Pooja Joshi',
];

export const DEPARTMENTS = [
  'Engineering', 'Human Resources', 'Finance', 'Marketing',
  'Operations', 'Legal', 'IT Support', 'Administration',
  'Research & Development', 'Quality Assurance', 'Sales', 'Procurement',
];

export const BUILDINGS = [
  { name: 'Main Building', floors: ['Ground', '1st', '2nd', '3rd', '4th', '5th'], wings: ['A', 'B', 'C'] },
  { name: 'Block B', floors: ['Ground', '1st', '2nd', '3rd'], wings: ['East', 'West'] },
  { name: 'Block C', floors: ['Ground', '1st', '2nd'], wings: ['North', 'South'] },
  { name: 'Annex', floors: ['Ground', '1st'], wings: ['Main'] },
];

export const VISITORS_DATA: Visitor[] = [
  {
    id: '1', name: 'Amit Verma', phone: '+91 98765 43210', email: 'amit.verma@tcs.com',
    company: 'TCS', photo: null, aadhaarMasked: 'XXXX XXXX 4521', aadhaarPhoto: null,
    purpose: 'Meeting', materials: [{ type: 'Laptop', description: 'Dell Latitude 5520' }],
    area: { building: 'Main Building', floor: '3rd', wing: 'A' },
    department: 'Engineering', hostEmployee: 'Rajesh Kumar',
    approver: 'Vikram Sharma', approvalStatus: 'APPROVED',
    expectedEntry: '10 Mar 2026, 09:00', expectedExit: '10 Mar 2026, 12:00',
    actualCheckIn: '10 Mar 2026, 09:30', actualCheckOut: '10 Mar 2026, 11:00',
    vehicle: { number: 'KA-01-AB-1234', type: 'Car' },
    status: 'CHECKED_OUT', badge: 'V-1042', visitorType: 'outsider',
    passId: 'VP-2026-1042', createdAt: '10 Mar 2026, 08:45',
  },
  {
    id: '2', name: 'Sneha Reddy', phone: '+91 87654 32109', email: 'sneha.r@infosys.com',
    company: 'Infosys', photo: null, aadhaarMasked: 'XXXX XXXX 7893', aadhaarPhoto: null,
    purpose: 'Interview', materials: [{ type: 'Documents', description: 'Resume & certificates' }],
    area: { building: 'Main Building', floor: '2nd', wing: 'B' },
    department: 'Human Resources', hostEmployee: 'Priya Patel',
    approver: 'Anita Singh', approvalStatus: 'APPROVED',
    expectedEntry: '10 Mar 2026, 10:00', expectedExit: '10 Mar 2026, 13:00',
    actualCheckIn: '10 Mar 2026, 10:05', actualCheckOut: null,
    vehicle: null,
    status: 'CHECKED_IN', badge: 'V-1043', visitorType: 'outsider',
    passId: 'VP-2026-1043', createdAt: '10 Mar 2026, 09:15',
  },
  {
    id: '3', name: 'Ravi Shankar', phone: '+91 76543 21098', email: 'ravi@wipro.com',
    company: 'Wipro', photo: null, aadhaarMasked: 'XXXX XXXX 3456', aadhaarPhoto: null,
    purpose: 'Vendor', materials: [{ type: 'Equipment', description: 'Network switch for installation' }],
    area: { building: 'Block B', floor: '1st', wing: 'East' },
    department: 'IT Support', hostEmployee: 'Suresh Menon',
    approver: 'Sanjay Gupta', approvalStatus: 'APPROVED',
    expectedEntry: '10 Mar 2026, 14:00', expectedExit: '10 Mar 2026, 17:00',
    actualCheckIn: null, actualCheckOut: null,
    vehicle: { number: 'KA-05-MN-9876', type: 'Van' },
    status: 'EXPECTED', badge: 'V-1044', visitorType: 'outsider',
    passId: 'VP-2026-1044', createdAt: '10 Mar 2026, 11:00',
  },
  {
    id: '4', name: 'Deepa Nair', phone: '+91 65432 10987', email: 'deepa@hcl.com',
    company: 'HCL', photo: null, aadhaarMasked: 'XXXX XXXX 6789', aadhaarPhoto: null,
    purpose: 'Meeting', materials: [],
    area: { building: 'Main Building', floor: '4th', wing: 'C' },
    department: 'Marketing', hostEmployee: 'Anita Singh',
    approver: 'Meera Iyer', approvalStatus: 'APPROVED',
    expectedEntry: '9 Mar 2026, 09:00', expectedExit: '9 Mar 2026, 18:00',
    actualCheckIn: '9 Mar 2026, 09:15', actualCheckOut: '9 Mar 2026, 17:30',
    vehicle: null,
    status: 'CHECKED_OUT', badge: 'V-1041', visitorType: 'outsider',
    passId: 'VP-2026-1041', createdAt: '8 Mar 2026, 16:00',
  },
  {
    id: '5', name: 'Sunil Kumar (Father)', phone: '+91 54321 09876', email: '',
    company: 'Personal', photo: null, aadhaarMasked: 'XXXX XXXX 1122', aadhaarPhoto: null,
    purpose: 'Personal', materials: [],
    area: { building: 'Main Building', floor: 'Ground', wing: 'A' },
    department: 'Engineering', hostEmployee: 'Rajesh Kumar',
    approver: 'Rajesh Kumar', approvalStatus: 'APPROVED',
    expectedEntry: '10 Mar 2026, 12:00', expectedExit: '10 Mar 2026, 13:00',
    actualCheckIn: '10 Mar 2026, 12:10', actualCheckOut: null,
    vehicle: null,
    status: 'CHECKED_IN', badge: 'V-1045', visitorType: 'relative',
    passId: 'VP-2026-1045', createdAt: '10 Mar 2026, 11:30',
  },
  {
    id: '6', name: 'Pradeep Mishra', phone: '+91 43210 98765', email: 'pradeep@gov.in',
    company: 'Labour Department', photo: null, aadhaarMasked: 'XXXX XXXX 4455', aadhaarPhoto: null,
    purpose: 'Government', materials: [{ type: 'Documents', description: 'Inspection documents' }],
    area: { building: 'Main Building', floor: '5th', wing: 'A' },
    department: 'Legal', hostEmployee: 'Pooja Joshi',
    approver: 'Vikram Sharma', approvalStatus: 'PENDING',
    expectedEntry: '11 Mar 2026, 10:00', expectedExit: '11 Mar 2026, 16:00',
    actualCheckIn: null, actualCheckOut: null,
    vehicle: { number: 'DL-01-CG-5566', type: 'Car' },
    status: 'EXPECTED', badge: 'V-1046', visitorType: 'outsider',
    passId: 'VP-2026-1046', createdAt: '10 Mar 2026, 14:00',
  },
];

export const GATE_PASS_HISTORY: GatePassEntry[] = [
  { id: '1', visitorName: 'Amit Verma', passId: 'VP-2026-1042', action: 'Pass Generated', timestamp: '10 Mar 2026, 08:50', performedBy: 'Security Desk', gate: '-', notes: 'Pre-approved by Vikram Sharma' },
  { id: '2', visitorName: 'Amit Verma', passId: 'VP-2026-1042', action: 'Check-In', timestamp: '10 Mar 2026, 09:30', performedBy: 'Guard - Gate 1', gate: 'Gate 1', notes: 'ID verified, laptop serial noted' },
  { id: '3', visitorName: 'Amit Verma', passId: 'VP-2026-1042', action: 'Check-Out', timestamp: '10 Mar 2026, 11:00', performedBy: 'Guard - Gate 1', gate: 'Gate 1', notes: 'Materials verified at exit' },
  { id: '4', visitorName: 'Sneha Reddy', passId: 'VP-2026-1043', action: 'Pass Generated', timestamp: '10 Mar 2026, 09:20', performedBy: 'Security Desk', gate: '-', notes: 'Interview candidate - HR dept' },
  { id: '5', visitorName: 'Sneha Reddy', passId: 'VP-2026-1043', action: 'Check-In', timestamp: '10 Mar 2026, 10:05', performedBy: 'Guard - Gate 2', gate: 'Gate 2', notes: 'Escorted to HR floor' },
  { id: '6', visitorName: 'Sunil Kumar (Father)', passId: 'VP-2026-1045', action: 'Pass Generated', timestamp: '10 Mar 2026, 11:35', performedBy: 'Security Desk', gate: '-', notes: 'Employee relative - blue pass issued' },
  { id: '7', visitorName: 'Sunil Kumar (Father)', passId: 'VP-2026-1045', action: 'Check-In', timestamp: '10 Mar 2026, 12:10', performedBy: 'Guard - Gate 1', gate: 'Gate 1', notes: 'Relative pass, cafeteria access only' },
  { id: '8', visitorName: 'Deepa Nair', passId: 'VP-2026-1041', action: 'Pass Generated', timestamp: '8 Mar 2026, 16:10', performedBy: 'Security Desk', gate: '-', notes: 'Full-day visit approved' },
  { id: '9', visitorName: 'Deepa Nair', passId: 'VP-2026-1041', action: 'Check-In', timestamp: '9 Mar 2026, 09:15', performedBy: 'Guard - Gate 1', gate: 'Gate 1', notes: '' },
  { id: '10', visitorName: 'Deepa Nair', passId: 'VP-2026-1041', action: 'Check-Out', timestamp: '9 Mar 2026, 17:30', performedBy: 'Guard - Gate 1', gate: 'Gate 1', notes: 'Overstayed by 30 minutes - noted' },
];

export const BLACKLIST: BlacklistEntry[] = [
  { id: '1', name: 'Manoj Tiwari', phone: '+91 99887 76655', company: 'Unknown', reason: 'Unauthorized photography in restricted area', blacklistedOn: '15 Feb 2026', blacklistedBy: 'Security Head' },
  { id: '2', name: 'Rakesh Pandey', phone: '+91 88776 65544', company: 'ABC Vendors', reason: 'Aggressive behavior towards staff', blacklistedOn: '28 Jan 2026', blacklistedBy: 'Admin Manager' },
];

export const ACCESS_CARDS = [
  { id: '1', employee: 'You', cardNumber: 'AC-5678', zones: ['Main Building', 'Lab', 'Parking'], status: 'ACTIVE', validUntil: '31 Dec 2026' },
];

export const PARKING_SLOTS = [
  { id: '1', slot: 'P-234', zone: 'Basement 1', vehicle: 'KA-01-AB-1234', type: 'Car', status: 'ALLOCATED', validUntil: '31 Mar 2026' },
];

export const EMERGENCY_CONTACTS = [
  { id: '1', name: 'Security Control Room', phone: '080-1234-5678', ext: '100', available: '24/7' },
  { id: '2', name: 'Fire Emergency', phone: '101', ext: '101', available: '24/7' },
  { id: '3', name: 'Medical Emergency', phone: '108', ext: '108', available: '24/7' },
  { id: '4', name: 'Police', phone: '100', ext: null, available: '24/7' },
  { id: '5', name: 'Facility Manager', phone: '080-1234-5680', ext: '200', available: '9 AM - 6 PM' },
  { id: '6', name: 'IT Helpdesk', phone: '080-1234-5681', ext: '300', available: '9 AM - 9 PM' },
];

export const INCIDENTS = [
  { id: '1', type: 'Unauthorized Access', location: 'Server Room - Block B', reportedBy: 'Security Team', date: '8 Mar 2026', status: 'INVESTIGATING', priority: 'HIGH' },
  { id: '2', type: 'Fire Alarm Drill', location: 'Main Building', reportedBy: 'Admin', date: '5 Mar 2026', status: 'RESOLVED', priority: 'MEDIUM' },
  { id: '3', type: 'Tailgating Incident', location: 'Main Entrance', reportedBy: 'Guard', date: '3 Mar 2026', status: 'RESOLVED', priority: 'LOW' },
];

export const CCTV_REQUESTS = [
  { id: '1', location: 'Parking Lot - Gate 2', dateRange: '5 Mar - 5 Mar 2026', reason: 'Vehicle damage investigation', status: 'APPROVED', requestedBy: 'You' },
  { id: '2', location: 'Floor 3 - Corridor', dateRange: '7 Mar - 7 Mar 2026', reason: 'Lost property', status: 'PENDING', requestedBy: 'You' },
];
