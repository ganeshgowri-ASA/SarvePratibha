import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/rbac';
import { auditLog } from '../middleware/audit';
import { AppError } from '../middleware/error-handler';
import bcrypt from 'bcryptjs';
import os from 'os';

export const adminRouter = Router();

adminRouter.use(authenticate);
adminRouter.use(requireRole('IT_ADMIN'));

// ─── SYSTEM HEALTH ─────────────────────────────────────────────────

adminRouter.get('/system/health', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [userCount, activeEmployees, departments, pendingLeaves] = await Promise.all([
      prisma.user.count(),
      prisma.employee.count({ where: { employmentStatus: 'ACTIVE' } }),
      prisma.department.count(),
      prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
    ]);

    // System metrics
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    const cpuUsage = os.loadavg();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();

    // DB connection check
    let dbStatus = 'OK';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'ERROR';
    }

    // Active sessions
    const activeSessions = await prisma.userSession.count({ where: { isActive: true } }).catch(() => 0);

    res.json({
      success: true,
      data: {
        stats: { totalUsers: userCount, activeEmployees, departments, pendingLeaves },
        system: {
          uptime,
          cpuLoad: cpuUsage,
          memoryUsage: {
            used: totalMemory - freeMemory,
            total: totalMemory,
            percentage: ((totalMemory - freeMemory) / totalMemory * 100).toFixed(1),
            heapUsed: memoryUsage.heapUsed,
            heapTotal: memoryUsage.heapTotal,
          },
          nodeVersion: process.version,
          platform: os.platform(),
        },
        services: {
          database: dbStatus,
          api: 'OK',
          activeSessions,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── SYSTEM STATS (legacy) ─────────────────────────────────────────

adminRouter.get('/stats', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [userCount, activeEmployees, departments, pendingLeaves] = await Promise.all([
      prisma.user.count(),
      prisma.employee.count({ where: { employmentStatus: 'ACTIVE' } }),
      prisma.department.count(),
      prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
    ]);

    res.json({
      success: true,
      data: { totalUsers: userCount, activeEmployees, departments, pendingLeaves },
    });
  } catch (err) {
    next(err);
  }
});

// ─── SYSTEM CONFIGURATION ──────────────────────────────────────────

adminRouter.get('/system/config', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const configs = await prisma.systemConfig.findMany({ orderBy: { category: 'asc' } });
    res.json({ success: true, data: configs });
  } catch (err) {
    next(err);
  }
});

adminRouter.put('/system/config', auditLog('UPDATE', 'SystemConfig'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { configs } = req.body;
    if (!Array.isArray(configs)) {
      return next(new AppError(400, 'configs array is required'));
    }

    const results = await Promise.all(
      configs.map((c: { key: string; value: string }) =>
        prisma.systemConfig.upsert({
          where: { key: c.key },
          update: { value: c.value },
          create: { key: c.key, value: c.value, label: c.key, category: 'GENERAL' },
        }),
      ),
    );

    res.json({ success: true, data: results, message: 'Configuration updated' });
  } catch (err) {
    next(err);
  }
});

// ─── AUDIT LOGS ────────────────────────────────────────────────────

adminRouter.get('/audit-logs', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '50', action, user, from, to } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const where: any = {};
    if (action) where.action = { contains: action as string, mode: 'insensitive' };
    if (user) where.userId = user as string;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from as string);
      if (to) where.createdAt.lte = new Date(to as string);
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: { user: { select: { name: true, email: true, role: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.auditLog.count({ where }),
    ]);

    res.json({
      success: true,
      data: logs,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
});

// ─── USER MANAGEMENT ───────────────────────────────────────────────

adminRouter.get('/users', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', search, role, status } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    if (role) where.role = role;
    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, email: true, name: true, role: true, isActive: true,
          lastLoginAt: true, createdAt: true, image: true,
          employee: { select: { employeeId: true, departmentId: true, department: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
});

adminRouter.post('/users/create', auditLog('CREATE', 'User'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { email, name, password, role, employeeId, departmentId, designationId, dateOfJoining } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return next(new AppError(409, 'User with this email already exists'));

    const passwordHash = await bcrypt.hash(password, 12);
    const org = await prisma.organization.findFirst();
    if (!org) return next(new AppError(500, 'No organization found'));

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: role || 'EMPLOYEE',
        employee: (employeeId && departmentId && designationId) ? {
          create: {
            employeeId,
            firstName: name.split(' ')[0],
            lastName: name.split(' ').slice(1).join(' ') || name.split(' ')[0],
            organizationId: org.id,
            departmentId,
            designationId,
            dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : new Date(),
          },
        } : undefined,
      },
      include: { employee: true },
    });

    res.status(201).json({ success: true, data: user, message: 'User created successfully' });
  } catch (err) {
    next(err);
  }
});

adminRouter.put('/users/:id/deactivate', auditLog('DEACTIVATE', 'User'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return next(new AppError(404, 'User not found'));

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });

    res.json({ success: true, data: updated, message: `User ${updated.isActive ? 'activated' : 'deactivated'}` });
  } catch (err) {
    next(err);
  }
});

adminRouter.put('/users/:id/role', auditLog('CHANGE_ROLE', 'User'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['EMPLOYEE', 'MANAGER', 'SECTION_HEAD', 'IT_ADMIN'].includes(role)) {
      return next(new AppError(400, 'Invalid role'));
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
    });

    res.json({ success: true, data: updated, message: 'Role updated successfully' });
  } catch (err) {
    next(err);
  }
});

adminRouter.get('/users/:id/sessions', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const sessions = await prisma.userSession.findMany({
      where: { userId: req.params.id, isActive: true },
      orderBy: { lastActive: 'desc' },
    });
    res.json({ success: true, data: sessions });
  } catch (err) {
    next(err);
  }
});

adminRouter.post('/users/:id/force-logout', auditLog('FORCE_LOGOUT', 'User'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.userSession.updateMany({
      where: { userId: req.params.id, isActive: true },
      data: { isActive: false },
    });
    res.json({ success: true, message: 'User sessions terminated' });
  } catch (err) {
    next(err);
  }
});

// ─── SECURITY POLICIES ────────────────────────────────────────────

adminRouter.get('/security/policies', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let policy = await prisma.securityPolicy.findFirst();
    if (!policy) {
      policy = await prisma.securityPolicy.create({ data: {} });
    }
    res.json({ success: true, data: policy });
  } catch (err) {
    next(err);
  }
});

adminRouter.put('/security/policies', auditLog('UPDATE', 'SecurityPolicy'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const policy = await prisma.securityPolicy.findFirst();
    const data = req.body;

    const updated = policy
      ? await prisma.securityPolicy.update({ where: { id: policy.id }, data })
      : await prisma.securityPolicy.create({ data });

    res.json({ success: true, data: updated, message: 'Security policies updated' });
  } catch (err) {
    next(err);
  }
});

// ─── BACKUP MANAGEMENT ────────────────────────────────────────────

adminRouter.post('/backup/trigger', auditLog('TRIGGER', 'Backup'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const backup = await prisma.backupLog.create({
      data: {
        type: req.body.type || 'FULL',
        status: 'IN_PROGRESS',
        triggeredBy: req.user!.id,
      },
    });

    // Simulate backup completion (in production, this would be async)
    setTimeout(async () => {
      await prisma.backupLog.update({
        where: { id: backup.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          fileName: `backup_${Date.now()}.sql`,
          fileSize: BigInt(Math.floor(Math.random() * 100000000)),
        },
      }).catch(console.error);
    }, 3000);

    res.json({ success: true, data: backup, message: 'Backup triggered' });
  } catch (err) {
    next(err);
  }
});

adminRouter.get('/backup/logs', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20' } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const [logs, total] = await Promise.all([
      prisma.backupLog.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.backupLog.count(),
    ]);

    // Serialize BigInt
    const serialized = logs.map((log) => ({
      ...log,
      fileSize: log.fileSize ? log.fileSize.toString() : null,
    }));

    res.json({
      success: true,
      data: serialized,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
});

// ─── INTEGRATIONS ──────────────────────────────────────────────────

adminRouter.get('/integrations', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const integrations = await prisma.integrationConfig.findMany({ orderBy: { name: 'asc' } });
    res.json({ success: true, data: integrations });
  } catch (err) {
    next(err);
  }
});

adminRouter.put('/integrations/:id', auditLog('UPDATE', 'Integration'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updated = await prisma.integrationConfig.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: updated, message: 'Integration updated' });
  } catch (err) {
    next(err);
  }
});

// ─── DATA IMPORT / EXPORT ──────────────────────────────────────────

adminRouter.post('/data/import', auditLog('IMPORT', 'Data'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { module, fileName, totalRows, columnMapping } = req.body;
    const dataImport = await prisma.dataImport.create({
      data: {
        module,
        fileName,
        totalRows: totalRows || 0,
        columnMapping: columnMapping || {},
        importedBy: req.user!.id,
        status: 'VALIDATING',
      },
    });
    res.status(201).json({ success: true, data: dataImport, message: 'Import started' });
  } catch (err) {
    next(err);
  }
});

adminRouter.post('/data/export', auditLog('EXPORT', 'Data'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { module, format, filters } = req.body;
    const dataExport = await prisma.dataExport.create({
      data: {
        module,
        format: format || 'CSV',
        filters: filters || {},
        exportedBy: req.user!.id,
        status: 'GENERATING',
      },
    });

    // Simulate export completion
    setTimeout(async () => {
      await prisma.dataExport.update({
        where: { id: dataExport.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          fileName: `${module}_export_${Date.now()}.${(format || 'csv').toLowerCase()}`,
        },
      }).catch(console.error);
    }, 2000);

    res.status(201).json({ success: true, data: dataExport, message: 'Export started' });
  } catch (err) {
    next(err);
  }
});

// ─── ROLES & PERMISSIONS ──────────────────────────────────────────

adminRouter.get('/roles', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const permissions = await prisma.permission.findMany({
      include: { rolePermissions: true },
      orderBy: [{ module: 'asc' }, { action: 'asc' }],
    });

    const rolePermissions = await prisma.rolePermission.findMany({
      include: { permission: true },
    });

    const matrix: Record<string, Record<string, boolean>> = {
      EMPLOYEE: {},
      MANAGER: {},
      SECTION_HEAD: {},
      IT_ADMIN: {},
    };

    rolePermissions.forEach((rp) => {
      matrix[rp.role][rp.permissionId] = true;
    });

    res.json({ success: true, data: { permissions, matrix } });
  } catch (err) {
    next(err);
  }
});

adminRouter.put('/roles/:role/permissions', auditLog('UPDATE', 'RolePermission'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { role } = req.params;
    const { permissionIds } = req.body;

    if (!['EMPLOYEE', 'MANAGER', 'SECTION_HEAD', 'IT_ADMIN'].includes(role)) {
      return next(new AppError(400, 'Invalid role'));
    }

    // Delete existing permissions for the role
    await prisma.rolePermission.deleteMany({ where: { role: role as any } });

    // Create new permissions
    if (Array.isArray(permissionIds) && permissionIds.length > 0) {
      await prisma.rolePermission.createMany({
        data: permissionIds.map((pid: string) => ({
          role: role as any,
          permissionId: pid,
        })),
      });
    }

    res.json({ success: true, message: 'Permissions updated' });
  } catch (err) {
    next(err);
  }
});

// ─── CUSTOM FIELDS ─────────────────────────────────────────────────

adminRouter.post('/custom-fields', auditLog('CREATE', 'CustomField'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const field = await prisma.customField.create({ data: req.body });
    res.status(201).json({ success: true, data: field, message: 'Custom field created' });
  } catch (err) {
    next(err);
  }
});

adminRouter.get('/custom-fields', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { module } = req.query;
    const where: any = {};
    if (module) where.module = module;

    const fields = await prisma.customField.findMany({ where, orderBy: { displayOrder: 'asc' } });
    res.json({ success: true, data: fields });
  } catch (err) {
    next(err);
  }
});

// ─── WORKFLOWS ─────────────────────────────────────────────────────

adminRouter.post('/workflow/create', auditLog('CREATE', 'Workflow'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, module, description, triggerEvent, steps } = req.body;

    const workflow = await prisma.workflow.create({
      data: {
        name,
        module,
        description,
        triggerEvent,
        createdBy: req.user!.id,
        steps: steps ? {
          create: steps.map((s: any, idx: number) => ({
            stepOrder: idx + 1,
            name: s.name,
            approverRole: s.approverRole || null,
            approverId: s.approverId || null,
            condition: s.condition || null,
            isRequired: s.isRequired !== false,
            autoApprove: s.autoApprove || false,
            timeoutHours: s.timeoutHours || null,
          })),
        } : undefined,
      },
      include: { steps: { orderBy: { stepOrder: 'asc' } } },
    });

    res.status(201).json({ success: true, data: workflow, message: 'Workflow created' });
  } catch (err) {
    next(err);
  }
});

adminRouter.get('/workflows', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const workflows = await prisma.workflow.findMany({
      include: { steps: { orderBy: { stepOrder: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: workflows });
  } catch (err) {
    next(err);
  }
});

// ─── DEPARTMENTS ───────────────────────────────────────────────────

adminRouter.get('/departments', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        organization: { select: { name: true } },
        parent: { select: { name: true } },
        _count: { select: { employees: true } },
      },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: departments });
  } catch (err) {
    next(err);
  }
});

adminRouter.post('/departments', auditLog('CREATE', 'Department'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, code, description, parentId } = req.body;
    const org = await prisma.organization.findFirst();
    if (!org) return next(new AppError(500, 'No organization found'));

    const dept = await prisma.department.create({
      data: { name, code, description, organizationId: org.id, parentId },
    });

    res.status(201).json({ success: true, data: dept, message: 'Department created' });
  } catch (err) {
    next(err);
  }
});

// ─── LOCATIONS ─────────────────────────────────────────────────────

adminRouter.get('/locations', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const locations = await prisma.location.findMany({ orderBy: { name: 'asc' } });
    res.json({ success: true, data: locations });
  } catch (err) {
    next(err);
  }
});

adminRouter.post('/locations', auditLog('CREATE', 'Location'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const location = await prisma.location.create({ data: req.body });
    res.status(201).json({ success: true, data: location, message: 'Location created' });
  } catch (err) {
    next(err);
  }
});

// ─── DESIGNATIONS ──────────────────────────────────────────────────

adminRouter.get('/designations', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const designations = await prisma.designation.findMany({
      include: { _count: { select: { employees: true } } },
      orderBy: { level: 'asc' },
    });
    res.json({ success: true, data: designations });
  } catch (err) {
    next(err);
  }
});

adminRouter.post('/designations', auditLog('CREATE', 'Designation'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const designation = await prisma.designation.create({ data: req.body });
    res.status(201).json({ success: true, data: designation, message: 'Designation created' });
  } catch (err) {
    next(err);
  }
});

// ─── GRADES ────────────────────────────────────────────────────────

adminRouter.get('/grades', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const grades = await prisma.grade.findMany({ orderBy: { level: 'asc' } });
    res.json({ success: true, data: grades });
  } catch (err) {
    next(err);
  }
});

adminRouter.post('/grades', auditLog('CREATE', 'Grade'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const grade = await prisma.grade.create({ data: req.body });
    res.status(201).json({ success: true, data: grade, message: 'Grade created' });
  } catch (err) {
    next(err);
  }
});

// ─── ANNOUNCEMENTS ─────────────────────────────────────────────────

adminRouter.post('/announcement', auditLog('CREATE', 'Announcement'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const announcement = await prisma.announcementBoard.create({
      data: { ...req.body, createdBy: req.user!.id },
    });
    res.status(201).json({ success: true, data: announcement, message: 'Announcement created' });
  } catch (err) {
    next(err);
  }
});

adminRouter.get('/announcements', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20' } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const [announcements, total] = await Promise.all([
      prisma.announcementBoard.findMany({
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.announcementBoard.count(),
    ]);

    res.json({
      success: true,
      data: announcements,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
});

// ─── COMPANY POLICIES ──────────────────────────────────────────────

adminRouter.get('/company-policies', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const policies = await prisma.companyPolicy.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: policies });
  } catch (err) {
    next(err);
  }
});

adminRouter.post('/company-policies', auditLog('CREATE', 'CompanyPolicy'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const policy = await prisma.companyPolicy.create({
      data: { ...req.body, createdBy: req.user!.id },
    });
    res.status(201).json({ success: true, data: policy, message: 'Policy created' });
  } catch (err) {
    next(err);
  }
});
