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

  // Create reimbursement categories
  await Promise.all(
    [
      { name: 'Travel', code: 'REIMB-TRAVEL', maxAmount: 50000, requiresReceipt: true },
      { name: 'Medical', code: 'REIMB-MEDICAL', maxAmount: 25000, requiresReceipt: true },
      { name: 'Food & Entertainment', code: 'REIMB-FOOD', maxAmount: 5000, requiresReceipt: true },
      { name: 'Communication', code: 'REIMB-COMM', maxAmount: 3000, requiresReceipt: false },
      { name: 'Stationery & Supplies', code: 'REIMB-STATIONERY', maxAmount: 2000, requiresReceipt: true },
      { name: 'Other', code: 'REIMB-OTHER', maxAmount: 10000, requiresReceipt: true },
    ].map((cat) =>
      prisma.reimbursementCategory.upsert({
        where: { code: cat.code },
        update: {},
        create: cat,
      }),
    ),
  );

  // Create salary components
  await Promise.all(
    [
      { name: 'Basic Salary', code: 'BASIC', type: 'EARNING', isFixed: true, isTaxable: true },
      { name: 'House Rent Allowance', code: 'HRA', type: 'EARNING', isFixed: true, isTaxable: true },
      { name: 'Conveyance Allowance', code: 'CONV', type: 'EARNING', isFixed: true, isTaxable: true },
      { name: 'Medical Allowance', code: 'MED', type: 'EARNING', isFixed: true, isTaxable: true },
      { name: 'Special Allowance', code: 'SPECIAL', type: 'EARNING', isFixed: true, isTaxable: true },
      { name: 'Other Allowances', code: 'OTHER_ALLOW', type: 'EARNING', isFixed: true, isTaxable: true },
      { name: 'Provident Fund', code: 'PF', type: 'DEDUCTION', isFixed: true, isTaxable: false },
      { name: 'ESI', code: 'ESI_COMP', type: 'DEDUCTION', isFixed: true, isTaxable: false },
      { name: 'Professional Tax', code: 'PTAX', type: 'DEDUCTION', isFixed: true, isTaxable: false },
      { name: 'TDS', code: 'TDS', type: 'DEDUCTION', isFixed: false, isTaxable: false },
    ].map((comp) =>
      prisma.salaryComponent.upsert({
        where: { code: comp.code },
        update: {},
        create: comp,
      }),
    ),
  );

  // Create payroll config for current FY
  await prisma.payrollConfig.upsert({
    where: { financialYear: '2025-2026' },
    update: {},
    create: {
      financialYear: '2025-2026',
      pfEmployeePercent: 12,
      pfEmployerPercent: 12,
      pfCeiling: 15000,
      esiEmployeePercent: 0.75,
      esiEmployerPercent: 3.25,
      esiCeiling: 21000,
      professionalTax: 200,
      standardDeduction: 50000,
      section80CLimit: 150000,
      section80DLimit: 75000,
    },
  });

  // Create payroll structures for seeded employees
  const allEmployees = await prisma.employee.findMany({
    where: { employmentStatus: 'ACTIVE' },
  });

  const salaryData: Record<string, { basic: number; hra: number; conv: number; med: number; special: number; other: number }> = {
    'SP-ADMIN-001': { basic: 75000, hra: 30000, conv: 1600, med: 1250, special: 30150, other: 12000 },
    'SP-ENG-001': { basic: 62500, hra: 25000, conv: 1600, med: 1250, special: 22150, other: 10000 },
    'SP-ENG-002': { basic: 50000, hra: 20000, conv: 1600, med: 1250, special: 18650, other: 8500 },
    'SP-ENG-003': { basic: 42500, hra: 17000, conv: 1600, med: 1250, special: 15150, other: 7500 },
  };

  for (const emp of allEmployees) {
    const sd = salaryData[emp.employeeId];
    if (!sd) continue;

    const gross = sd.basic + sd.hra + sd.conv + sd.med + sd.special + sd.other;
    const pf = Math.round(Math.min(sd.basic, 15000) * 0.12);
    const esi = gross <= 21000 ? Math.round(gross * 0.0075) : 0;
    const profTax = 200;
    const annualGross = gross * 12;
    const annualTaxable = Math.max(annualGross - 50000, 0); // New regime: only standard deduction
    let annualTax = 0;
    if (annualTaxable > 300000) annualTax += Math.min(annualTaxable - 300000, 300000) * 0.05;
    if (annualTaxable > 600000) annualTax += Math.min(annualTaxable - 600000, 300000) * 0.1;
    if (annualTaxable > 900000) annualTax += Math.min(annualTaxable - 900000, 300000) * 0.15;
    if (annualTaxable > 1200000) annualTax += Math.min(annualTaxable - 1200000, 300000) * 0.2;
    if (annualTaxable > 1500000) annualTax += (annualTaxable - 1500000) * 0.3;
    if (annualTaxable <= 700000) annualTax = 0;
    const tds = Math.round((annualTax * 1.04) / 12);
    const net = gross - pf - esi - profTax - tds;

    await prisma.payrollStructure.upsert({
      where: { employeeId: emp.id },
      update: {},
      create: {
        employeeId: emp.id,
        basicSalary: sd.basic,
        hra: sd.hra,
        conveyance: sd.conv,
        medicalAllow: sd.med,
        specialAllow: sd.special,
        otherAllow: sd.other,
        pfContribution: pf,
        esiContribution: esi,
        professionalTax: profTax,
        tds,
        grossSalary: gross,
        netSalary: net,
        effectiveFrom: new Date('2025-04-01'),
      },
    });

    // Create payslips for last 3 months
    for (const { m, y } of [{ m: 12, y: 2025 }, { m: 1, y: 2026 }, { m: 2, y: 2026 }]) {
      await prisma.payslip.upsert({
        where: { employeeId_month_year: { employeeId: emp.id, month: m, year: y } },
        update: {},
        create: {
          employeeId: emp.id,
          month: m,
          year: y,
          basicSalary: sd.basic,
          hra: sd.hra,
          conveyance: sd.conv,
          medicalAllow: sd.med,
          specialAllow: sd.special,
          otherAllow: sd.other,
          pfDeduction: pf,
          esiDeduction: esi,
          profTax,
          tds,
          grossEarnings: gross,
          totalDeductions: pf + esi + profTax + tds,
          netPay: net,
          status: 'PAID',
          generatedAt: new Date(y, m - 1, 28),
          publishedAt: new Date(y, m - 1, 28),
        },
      });
    }

    // Create tax declaration for current FY
    await prisma.taxDeclaration.upsert({
      where: { employeeId_financialYear: { employeeId: emp.id, financialYear: '2025-2026' } },
      update: {},
      create: {
        employeeId: emp.id,
        financialYear: '2025-2026',
        regime: 'NEW',
        section80C: 0,
        section80D: 0,
        totalDeclared: 0,
      },
    });
  }

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
