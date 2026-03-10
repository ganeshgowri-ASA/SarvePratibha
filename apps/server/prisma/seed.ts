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
      { name: 'Marriage Leave', code: 'MRL', defaultDays: 15, isPaidLeave: true },
      { name: 'Bereavement Leave', code: 'BL', defaultDays: 5, isPaidLeave: true },
      { name: 'Work From Home', code: 'WFH', defaultDays: 24, isPaidLeave: true },
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

  // Create holiday calendar for 2025
  const holidays2025 = [
    { name: 'Republic Day', date: new Date('2025-01-26'), type: 'NATIONAL', year: 2025 },
    { name: 'Maha Shivaratri', date: new Date('2025-02-26'), type: 'RESTRICTED', year: 2025, isOptional: true },
    { name: 'Holi', date: new Date('2025-03-14'), type: 'NATIONAL', year: 2025 },
    { name: 'Id-ul-Fitr (Eid)', date: new Date('2025-03-31'), type: 'NATIONAL', year: 2025 },
    { name: 'Ram Navami', date: new Date('2025-04-06'), type: 'RESTRICTED', year: 2025, isOptional: true },
    { name: 'Mahavir Jayanti', date: new Date('2025-04-10'), type: 'RESTRICTED', year: 2025, isOptional: true },
    { name: 'Good Friday', date: new Date('2025-04-18'), type: 'OPTIONAL', year: 2025, isOptional: true },
    { name: 'Dr. Ambedkar Jayanti', date: new Date('2025-04-14'), type: 'NATIONAL', year: 2025 },
    { name: 'May Day', date: new Date('2025-05-01'), type: 'NATIONAL', year: 2025 },
    { name: 'Buddha Purnima', date: new Date('2025-05-12'), type: 'RESTRICTED', year: 2025, isOptional: true },
    { name: 'Id-ul-Zuha (Bakrid)', date: new Date('2025-06-07'), type: 'OPTIONAL', year: 2025, isOptional: true },
    { name: 'Muharram', date: new Date('2025-07-06'), type: 'RESTRICTED', year: 2025, isOptional: true },
    { name: 'Independence Day', date: new Date('2025-08-15'), type: 'NATIONAL', year: 2025 },
    { name: 'Janmashtami', date: new Date('2025-08-16'), type: 'RESTRICTED', year: 2025, isOptional: true },
    { name: 'Milad-un-Nabi', date: new Date('2025-09-05'), type: 'RESTRICTED', year: 2025, isOptional: true },
    { name: 'Mahatma Gandhi Jayanti', date: new Date('2025-10-02'), type: 'NATIONAL', year: 2025 },
    { name: 'Dussehra', date: new Date('2025-10-02'), type: 'NATIONAL', year: 2025, location: 'North India' },
    { name: 'Diwali', date: new Date('2025-10-20'), type: 'NATIONAL', year: 2025 },
    { name: 'Diwali (Day 2)', date: new Date('2025-10-21'), type: 'OPTIONAL', year: 2025, isOptional: true },
    { name: 'Guru Nanak Jayanti', date: new Date('2025-11-05'), type: 'RESTRICTED', year: 2025, isOptional: true },
    { name: 'Christmas', date: new Date('2025-12-25'), type: 'NATIONAL', year: 2025 },
  ];

  // Create holiday calendar for 2026
  const holidays2026 = [
    { name: 'Republic Day', date: new Date('2026-01-26'), type: 'NATIONAL', year: 2026 },
    { name: 'Maha Shivaratri', date: new Date('2026-02-15'), type: 'RESTRICTED', year: 2026, isOptional: true },
    { name: 'Holi', date: new Date('2026-03-14'), type: 'NATIONAL', year: 2026 },
    { name: 'Id-ul-Fitr (Eid)', date: new Date('2026-03-20'), type: 'NATIONAL', year: 2026 },
    { name: 'Ram Navami', date: new Date('2026-03-26'), type: 'RESTRICTED', year: 2026, isOptional: true },
    { name: 'Good Friday', date: new Date('2026-04-03'), type: 'OPTIONAL', year: 2026, isOptional: true },
    { name: 'Mahavir Jayanti', date: new Date('2026-04-05'), type: 'RESTRICTED', year: 2026, isOptional: true },
    { name: 'Dr. Ambedkar Jayanti', date: new Date('2026-04-14'), type: 'NATIONAL', year: 2026 },
    { name: 'May Day', date: new Date('2026-05-01'), type: 'NATIONAL', year: 2026 },
    { name: 'Buddha Purnima', date: new Date('2026-05-31'), type: 'RESTRICTED', year: 2026, isOptional: true },
    { name: 'Id-ul-Zuha (Bakrid)', date: new Date('2026-05-27'), type: 'OPTIONAL', year: 2026, isOptional: true },
    { name: 'Muharram', date: new Date('2026-06-25'), type: 'RESTRICTED', year: 2026, isOptional: true },
    { name: 'Independence Day', date: new Date('2026-08-15'), type: 'NATIONAL', year: 2026 },
    { name: 'Janmashtami', date: new Date('2026-08-25'), type: 'RESTRICTED', year: 2026, isOptional: true },
    { name: 'Ganesh Chaturthi', date: new Date('2026-08-27'), type: 'RESTRICTED', year: 2026, isOptional: true },
    { name: 'Milad-un-Nabi', date: new Date('2026-08-26'), type: 'RESTRICTED', year: 2026, isOptional: true },
    { name: 'Mahatma Gandhi Jayanti', date: new Date('2026-10-02'), type: 'NATIONAL', year: 2026 },
    { name: 'Dussehra', date: new Date('2026-10-19'), type: 'NATIONAL', year: 2026 },
    { name: 'Diwali', date: new Date('2026-11-08'), type: 'NATIONAL', year: 2026 },
    { name: 'Diwali (Day 2)', date: new Date('2026-11-09'), type: 'OPTIONAL', year: 2026, isOptional: true },
    { name: 'Guru Nanak Jayanti', date: new Date('2026-11-24'), type: 'RESTRICTED', year: 2026, isOptional: true },
    { name: 'Christmas', date: new Date('2026-12-25'), type: 'NATIONAL', year: 2026 },
  ];

  const allHolidays = [...holidays2025, ...holidays2026];
  for (const h of allHolidays) {
    await prisma.holidayCalendar.upsert({
      where: { date_location: { date: h.date, location: h.location || null } },
      update: {},
      create: {
        name: h.name,
        date: h.date,
        type: h.type,
        year: h.year,
        location: h.location || null,
        isOptional: h.isOptional || false,
      },
    });
  }

  // Create a sample job requisition
  const adminEmployee = await prisma.employee.findUnique({ where: { employeeId: 'SP-ADMIN-001' } });
  if (adminEmployee) {
    await prisma.jobRequisition.upsert({
      where: { id: 'seed-req-001' },
      update: {},
      create: {
        id: 'seed-req-001',
        title: 'Senior Full Stack Developer',
        departmentId: engDept.id,
        description: 'We are looking for a Senior Full Stack Developer with 5+ years of experience in React, Node.js, and PostgreSQL.',
        requirements: '5+ years experience, React, Node.js, TypeScript, PostgreSQL',
        skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
        location: 'Mumbai',
        positions: 2,
        minExp: 5,
        maxExp: 10,
        minSalary: 2000000,
        maxSalary: 3500000,
        status: 'OPEN',
        priority: 'HIGH',
        createdById: adminEmployee.id,
        closingDate: new Date('2026-04-30'),
      },
    });
  }

  // Create leave balances for all employees (2026)
  const leaveTypes = await prisma.leaveType.findMany({ where: { isActive: true } });
  for (const emp of allEmployees) {
    for (const lt of leaveTypes) {
      if (lt.defaultDays > 0) {
        await prisma.leaveBalance.upsert({
          where: { employeeId_leaveTypeId_year: { employeeId: emp.id, leaveTypeId: lt.id, year: 2026 } },
          update: {},
          create: {
            employeeId: emp.id,
            leaveTypeId: lt.id,
            year: 2026,
            allocated: lt.defaultDays,
            used: 0,
            carried: 0,
            balance: lt.defaultDays,
          },
        });
      }
    }
  }

  // ─── CANDIDATE PORTAL SEED DATA ──────────────────────────────

  const REQUIRED_DOCUMENTS = [
    { key: 'aadhar_front', name: 'Aadhar Card (Front)', category: 'PERSONAL', required: true },
    { key: 'aadhar_back', name: 'Aadhar Card (Back)', category: 'PERSONAL', required: true },
    { key: 'pan_card', name: 'PAN Card', category: 'PERSONAL', required: true },
    { key: 'passport', name: 'Passport', category: 'PERSONAL', required: false },
    { key: 'driving_license', name: 'Driving License', category: 'PERSONAL', required: false },
    { key: 'marksheet_10th', name: '10th Marksheet', category: 'ACADEMIC', required: true },
    { key: 'marksheet_12th', name: '12th Marksheet', category: 'ACADEMIC', required: true },
    { key: 'graduation_degree', name: 'Graduation Degree', category: 'ACADEMIC', required: true },
    { key: 'post_graduation', name: 'Post-Graduation Degree', category: 'ACADEMIC', required: false },
    { key: 'other_certifications', name: 'Other Certifications', category: 'ACADEMIC', required: false },
    { key: 'prev_employment_letters', name: 'Previous Employment Letters', category: 'PROFESSIONAL', required: true },
    { key: 'relieving_letters', name: 'Relieving Letters', category: 'PROFESSIONAL', required: true },
    { key: 'last_3_payslips', name: 'Last 3 Months Payslips', category: 'PROFESSIONAL', required: true },
    { key: 'experience_certificates', name: 'Experience Certificates', category: 'PROFESSIONAL', required: true },
    { key: 'appointment_letters', name: 'Appointment Letters', category: 'PROFESSIONAL', required: false },
    { key: 'epf_uan', name: 'EPF UAN Number Document', category: 'FINANCIAL', required: true },
    { key: 'cancelled_cheque', name: 'Cancelled Cheque / Bank Details', category: 'FINANCIAL', required: true },
    { key: 'form_16', name: 'Form 16 (Last Employer)', category: 'FINANCIAL', required: false },
    { key: 'medical_fitness', name: 'Medical Fitness Certificate', category: 'HEALTH', required: true },
    { key: 'blood_group_cert', name: 'Blood Group Certificate', category: 'HEALTH', required: false },
    { key: 'covid_vaccination', name: 'Covid Vaccination Certificate', category: 'HEALTH', required: false },
    { key: 'passport_photo', name: 'Passport Size Photo', category: 'PHOTOS', required: true },
    { key: 'full_size_photo', name: 'Full Size Photo', category: 'PHOTOS', required: false },
  ] as const;

  // Create 3 demo candidates with portal access
  const candidateSeedData = [
    {
      id: 'seed-candidate-001',
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@gmail.com',
      phone: '+91 98765 43210',
      currentCompany: 'TCS',
      currentTitle: 'Senior Software Engineer',
      totalExp: 6,
      skills: ['Java', 'Spring Boot', 'React', 'PostgreSQL'],
      location: 'Pune',
      portalToken: 'demo-token-priya-001',
      status: 'UNDER_REVIEW' as const,
      uploadedDocs: 18,
      verifiedDocs: 10,
    },
    {
      id: 'seed-candidate-002',
      firstName: 'Arjun',
      lastName: 'Mehta',
      email: 'arjun.mehta@outlook.com',
      phone: '+91 87654 32109',
      currentCompany: 'Infosys',
      currentTitle: 'Product Manager',
      totalExp: 8,
      skills: ['Product Management', 'Agile', 'Jira', 'Data Analysis'],
      location: 'Bangalore',
      portalToken: 'demo-token-arjun-002',
      status: 'INCOMPLETE' as const,
      uploadedDocs: 8,
      verifiedDocs: 0,
    },
    {
      id: 'seed-candidate-003',
      firstName: 'Neha',
      lastName: 'Patel',
      email: 'neha.patel@yahoo.com',
      phone: '+91 76543 21098',
      currentCompany: 'Wipro',
      currentTitle: 'UI/UX Designer',
      totalExp: 4,
      skills: ['Figma', 'Adobe XD', 'HTML/CSS', 'React'],
      location: 'Mumbai',
      portalToken: 'demo-token-neha-003',
      status: 'VERIFIED' as const,
      uploadedDocs: 23,
      verifiedDocs: 23,
    },
  ];

  for (const cData of candidateSeedData) {
    const candidate = await prisma.candidate.upsert({
      where: { email: cData.email },
      update: {},
      create: {
        id: cData.id,
        firstName: cData.firstName,
        lastName: cData.lastName,
        email: cData.email,
        phone: cData.phone,
        currentCompany: cData.currentCompany,
        currentTitle: cData.currentTitle,
        totalExp: cData.totalExp,
        skills: cData.skills,
        location: cData.location,
        source: 'CAREER_PAGE',
      },
    });

    // Check if portal already exists
    const existingPortal = await prisma.candidatePortalAccess.findUnique({
      where: { accessToken: cData.portalToken },
    });

    if (!existingPortal) {
      const portal = await prisma.candidatePortalAccess.create({
        data: {
          candidateId: candidate.id,
          email: cData.email,
          accessToken: cData.portalToken,
          fullName: `${cData.firstName} ${cData.lastName}`,
          phone: cData.phone,
          isActive: true,
          expiresAt: new Date('2026-06-30'),
          overallStatus: cData.status,
          lastAccessedAt: new Date(),
        },
      });

      // Create document slots with varying upload states
      for (let i = 0; i < REQUIRED_DOCUMENTS.length; i++) {
        const doc = REQUIRED_DOCUMENTS[i];
        const isUploaded = i < cData.uploadedDocs;
        const isVerified = i < cData.verifiedDocs;

        let status: 'PENDING' | 'UPLOADED' | 'VERIFIED' | 'REJECTED' = 'PENDING';
        if (isVerified) status = 'VERIFIED';
        else if (isUploaded) status = 'UPLOADED';

        // Make one doc rejected for Priya (the UNDER_REVIEW candidate)
        if (cData.id === 'seed-candidate-001' && i === 12) {
          status = 'REJECTED';
        }

        await prisma.candidateDocument.create({
          data: {
            portalAccessId: portal.id,
            documentName: doc.name,
            documentKey: doc.key,
            category: doc.category,
            isRequired: doc.required,
            status,
            fileName: isUploaded ? `${doc.key}_${cData.firstName.toLowerCase()}.pdf` : null,
            fileUrl: isUploaded ? `/uploads/candidate/${doc.key}_${cData.firstName.toLowerCase()}.pdf` : null,
            fileSize: isUploaded ? Math.floor(Math.random() * 500000) + 50000 : null,
            mimeType: isUploaded ? 'application/pdf' : null,
            uploadedAt: isUploaded ? new Date() : null,
            reviewerComment: status === 'REJECTED' ? 'Document is not clearly legible. Please re-upload a clearer copy.' : null,
            reviewedAt: (isVerified || status === 'REJECTED') ? new Date() : null,
          },
        });
      }

      // Create self-service data for Priya and Neha
      if (cData.id !== 'seed-candidate-002') {
        await prisma.candidateSelfService.create({
          data: {
            portalAccessId: portal.id,
            fullName: `${cData.firstName} ${cData.lastName}`,
            dateOfBirth: new Date('1996-05-15'),
            gender: cData.id === 'seed-candidate-001' ? 'FEMALE' : 'FEMALE',
            maritalStatus: 'SINGLE',
            bloodGroup: 'B+',
            emergencyName: 'Rajesh Sharma',
            emergencyPhone: '+91 98765 00000',
            emergencyRelation: 'Father',
            currentAddress: '42, Green Valley Apartments',
            currentCity: cData.location,
            currentState: 'Maharashtra',
            currentPincode: '411001',
            currentCountry: 'India',
            sameAsCurrent: true,
            permanentAddress: '42, Green Valley Apartments',
            permanentCity: cData.location,
            permanentState: 'Maharashtra',
            permanentPincode: '411001',
            permanentCountry: 'India',
            bankAccountNo: '1234567890123',
            bankIfsc: 'SBIN0001234',
            bankName: 'State Bank of India',
            bankBranch: `${cData.location} Main Branch`,
            uanNumber: '100123456789',
            nomineeName: 'Rajesh Sharma',
            nomineeRelation: 'Father',
            nomineePercentage: 100,
            isSubmitted: true,
            submittedAt: new Date(),
          },
        });
      }
    }
  }

  console.log('Seed completed successfully!');
  console.log('Default login credentials:');
  console.log('  IT Admin:      admin@sarvepratibha.com / Password@123');
  console.log('  Section Head:  section.head@sarvepratibha.com / Password@123');
  console.log('  Manager:       manager@sarvepratibha.com / Password@123');
  console.log('  Employee:      employee@sarvepratibha.com / Password@123');
  console.log('');
  console.log('Candidate Portal Demo Access:');
  console.log('  Priya Sharma (Under Review):');
  console.log('    Email: priya.sharma@gmail.com | Token: demo-token-priya-001');
  console.log('  Arjun Mehta (Incomplete):');
  console.log('    Email: arjun.mehta@outlook.com | Token: demo-token-arjun-002');
  console.log('  Neha Patel (Verified):');
  console.log('    Email: neha.patel@yahoo.com | Token: demo-token-neha-003');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
