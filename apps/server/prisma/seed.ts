import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create organization
  const org = await prisma.organization.upsert({
    where: { code: 'SP-HQ' },
    update: {},
    create: {
      name: 'SarvePratibha Technologies',
      code: 'SP-HQ',
      website: 'https://sarvepratibha.com',
      address: '123 Tech Park, Sector 5',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400001',
      email: 'info@sarvepratibha.com',
    },
  });

  // Create departments
  const departments = await Promise.all(
    [
      { name: 'Engineering', code: 'ENG' },
      { name: 'Human Resources', code: 'HR' },
      { name: 'Finance', code: 'FIN' },
      { name: 'Sales', code: 'SALES' },
      { name: 'Operations', code: 'OPS' },
      { name: 'Marketing', code: 'MKT' },
    ].map((dept) =>
      prisma.department.upsert({
        where: { code: dept.code },
        update: {},
        create: { ...dept, organizationId: org.id },
      }),
    ),
  );

  // Create designations
  const designations = await Promise.all(
    [
      { name: 'Software Developer', code: 'SDE', level: 1, band: 'L1' },
      { name: 'Senior Developer', code: 'SR-SDE', level: 2, band: 'L2' },
      { name: 'Tech Lead', code: 'TL', level: 3, band: 'L3' },
      { name: 'Engineering Manager', code: 'EM', level: 4, band: 'L4' },
      { name: 'Director', code: 'DIR', level: 5, band: 'L5' },
      { name: 'HR Executive', code: 'HR-EXEC', level: 1, band: 'L1' },
      { name: 'HR Manager', code: 'HR-MGR', level: 3, band: 'L3' },
    ].map((d) =>
      prisma.designation.upsert({
        where: { code: d.code },
        update: {},
        create: d,
      }),
    ),
  );

  // Create leave types
  await Promise.all(
    [
      { name: 'Casual Leave', code: 'CL', defaultDays: 12, carryForwardLimit: 3 },
      { name: 'Sick Leave', code: 'SL', defaultDays: 12, carryForwardLimit: 0 },
      { name: 'Earned Leave', code: 'EL', defaultDays: 15, carryForwardLimit: 10, isEncashable: true },
      { name: 'Comp Off', code: 'CO', defaultDays: 0, carryForwardLimit: 0 },
      { name: 'Maternity Leave', code: 'ML', defaultDays: 182, isPaidLeave: true },
      { name: 'Paternity Leave', code: 'PL', defaultDays: 15, isPaidLeave: true },
      { name: 'Loss of Pay', code: 'LOP', defaultDays: 0, isPaidLeave: false },
    ].map((lt) =>
      prisma.leaveType.upsert({
        where: { code: lt.code },
        update: {},
        create: lt,
      }),
    ),
  );

  // Create users with different roles
  const passwordHash = await bcrypt.hash('Password@123', 12);
  const engDept = departments.find((d) => d.code === 'ENG')!;
  const hrDept = departments.find((d) => d.code === 'HR')!;

  const users: Array<{
    email: string;
    name: string;
    role: UserRole;
    empId: string;
    deptId: string;
    desigCode: string;
  }> = [
    { email: 'admin@sarvepratibha.com', name: 'System Admin', role: 'IT_ADMIN', empId: 'SP-ADMIN-001', deptId: engDept.id, desigCode: 'DIR' },
    { email: 'section.head@sarvepratibha.com', name: 'Rajesh Kumar', role: 'SECTION_HEAD', empId: 'SP-ENG-001', deptId: engDept.id, desigCode: 'DIR' },
    { email: 'manager@sarvepratibha.com', name: 'Vikram Patel', role: 'MANAGER', empId: 'SP-ENG-002', deptId: engDept.id, desigCode: 'EM' },
    { email: 'employee@sarvepratibha.com', name: 'Priya Sharma', role: 'EMPLOYEE', empId: 'SP-ENG-003', deptId: engDept.id, desigCode: 'SR-SDE' },
  ];

  for (const u of users) {
    const desig = designations.find((d) => d.code === u.desigCode)!;

    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        passwordHash,
        role: u.role,
        isActive: true,
        emailVerified: new Date(),
      },
    });

    await prisma.employee.upsert({
      where: { employeeId: u.empId },
      update: {},
      create: {
        employeeId: u.empId,
        userId: user.id,
        organizationId: org.id,
        departmentId: u.deptId,
        designationId: desig.id,
        firstName: u.name.split(' ')[0],
        lastName: u.name.split(' ').slice(1).join(' '),
        dateOfJoining: new Date('2021-04-01'),
        employmentStatus: 'ACTIVE',
        employmentType: 'FULL_TIME',
      },
    });
  }

  // Create claim types
  await Promise.all(
    [
      { name: 'Travel', code: 'TRAVEL', maxAmount: 50000 },
      { name: 'Medical', code: 'MEDICAL', maxAmount: 25000 },
      { name: 'Food', code: 'FOOD', maxAmount: 5000 },
      { name: 'Communication', code: 'COMM', maxAmount: 3000 },
    ].map((ct) =>
      prisma.claimType.upsert({
        where: { code: ct.code },
        update: {},
        create: ct,
      }),
    ),
  );

  console.log('Seed completed successfully!');
  console.log('Default login credentials:');
  console.log('  IT Admin:      admin@sarvepratibha.com / Password@123');
  console.log('  Section Head:  section.head@sarvepratibha.com / Password@123');
  console.log('  Manager:       manager@sarvepratibha.com / Password@123');
  console.log('  Employee:      employee@sarvepratibha.com / Password@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
