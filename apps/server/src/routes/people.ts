import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';

export const peopleRouter = Router();

peopleRouter.use(authenticate);

// ─── GET /api/people/search?q=&type=name|mobile|email ──────────────

peopleRouter.get('/search', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { q, type = 'name', page = '1', limit = '20' } = req.query;

    if (!q || (q as string).trim().length === 0) {
      return res.json({ success: true, data: [] });
    }

    const searchTerm = (q as string).trim();
    const where: Record<string, unknown> = { employmentStatus: 'ACTIVE' };

    switch (type) {
      case 'mobile':
        where.OR = [
          { phone: { contains: searchTerm, mode: 'insensitive' } },
          { personalPhone: { contains: searchTerm, mode: 'insensitive' } },
          { corporatePhone: { contains: searchTerm, mode: 'insensitive' } },
        ];
        break;
      case 'email':
        where.OR = [
          { personalEmail: { contains: searchTerm, mode: 'insensitive' } },
          { officialEmail: { contains: searchTerm, mode: 'insensitive' } },
          { user: { email: { contains: searchTerm, mode: 'insensitive' } } },
        ];
        break;
      default: // name
        where.OR = [
          { firstName: { contains: searchTerm, mode: 'insensitive' } },
          { lastName: { contains: searchTerm, mode: 'insensitive' } },
          { employeeId: { contains: searchTerm, mode: 'insensitive' } },
        ];
        break;
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        select: {
          id: true,
          employeeId: true,
          firstName: true,
          lastName: true,
          phone: true,
          personalEmail: true,
          officialEmail: true,
          profilePhoto: true,
          workLocation: true,
          department: { select: { name: true } },
          designation: { select: { name: true } },
          user: { select: { email: true } },
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { firstName: 'asc' },
      }),
      prisma.employee.count({ where }),
    ]);

    const results = employees.map((emp) => ({
      id: emp.id,
      employeeId: emp.employeeId,
      firstName: emp.firstName,
      lastName: emp.lastName,
      phone: emp.phone,
      personalEmail: emp.personalEmail,
      officialEmail: emp.officialEmail || emp.user.email,
      profilePhoto: emp.profilePhoto,
      department: emp.department.name,
      designation: emp.designation.name,
      workLocation: emp.workLocation,
    }));

    res.json({
      success: true,
      data: results,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/organization/hierarchy/:employeeId ───────────────────

peopleRouter.get('/organization/hierarchy/:employeeId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        department: { select: { name: true } },
        designation: { select: { name: true } },
        user: { select: { role: true } },
        manager: {
          include: {
            department: { select: { name: true } },
            designation: { select: { name: true } },
            user: { select: { role: true } },
            manager: {
              include: {
                department: { select: { name: true } },
                designation: { select: { name: true } },
                user: { select: { role: true } },
                manager: {
                  include: {
                    department: { select: { name: true } },
                    designation: { select: { name: true } },
                    user: { select: { role: true } },
                  },
                },
              },
            },
          },
        },
        directReports: {
          include: {
            department: { select: { name: true } },
            designation: { select: { name: true } },
            user: { select: { role: true } },
          },
          where: { employmentStatus: 'ACTIVE' },
        },
      },
    });

    if (!employee) throw new AppError(404, 'Employee not found');

    // Build upward chain
    const chain: Array<{
      id: string;
      employeeId: string;
      firstName: string;
      lastName: string;
      designation: string;
      department: string;
      profilePhoto?: string | null;
      role: string;
    }> = [];

    let current: any = employee;
    while (current) {
      chain.unshift({
        id: current.id,
        employeeId: current.employeeId,
        firstName: current.firstName,
        lastName: current.lastName,
        designation: current.designation.name,
        department: current.department.name,
        profilePhoto: current.profilePhoto,
        role: current.user.role,
      });
      current = current.manager;
    }

    // Add direct reports as children of the target employee
    const directReports = employee.directReports.map((dr) => ({
      id: dr.id,
      employeeId: dr.employeeId,
      firstName: dr.firstName,
      lastName: dr.lastName,
      designation: dr.designation.name,
      department: dr.department.name,
      profilePhoto: dr.profilePhoto,
      role: dr.user.role,
    }));

    res.json({
      success: true,
      data: {
        chain,
        directReports,
        employee: {
          id: employee.id,
          employeeId: employee.employeeId,
          firstName: employee.firstName,
          lastName: employee.lastName,
          designation: employee.designation.name,
          department: employee.department.name,
          profilePhoto: employee.profilePhoto,
          role: employee.user.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/organization/directory ───────────────────────────────

peopleRouter.get('/organization/directory', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { dept, designation, location, search, page = '1', limit = '20' } = req.query;

    const where: Record<string, unknown> = { employmentStatus: 'ACTIVE' };

    if (dept) where.departmentId = dept;
    if (designation) where.designationId = designation;
    if (location) where.workLocation = { contains: location as string, mode: 'insensitive' };
    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { employeeId: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [employees, total, departments, designations] = await Promise.all([
      prisma.employee.findMany({
        where,
        select: {
          id: true,
          employeeId: true,
          firstName: true,
          lastName: true,
          phone: true,
          officialEmail: true,
          personalEmail: true,
          profilePhoto: true,
          workLocation: true,
          department: { select: { id: true, name: true } },
          designation: { select: { id: true, name: true } },
          user: { select: { email: true } },
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { firstName: 'asc' },
      }),
      prisma.employee.count({ where }),
      prisma.department.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: 'asc' } }),
      prisma.designation.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    ]);

    res.json({
      success: true,
      data: employees,
      filters: { departments, designations },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
});

export default peopleRouter;
