import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { offboardingInitiateSchema } from '@sarve-pratibha/shared';

export const offboardingRouter = Router();

offboardingRouter.use(authenticate);

// Initiate offboarding (Manager+)
offboardingRouter.post('/initiate', authorize('MANAGER'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = offboardingInitiateSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(400, parsed.error.errors[0].message));

    const { employeeId, reason, lastWorkingDate, tasks } = parsed.data;

    const defaultTasks = tasks && tasks.length > 0 ? tasks : [
      { title: 'Return Company Laptop', category: 'ASSET_RETURN', description: 'Return assigned laptop and accessories' },
      { title: 'Return ID Card & Access Card', category: 'ASSET_RETURN', description: 'Return employee ID and building access cards' },
      { title: 'Knowledge Transfer', category: 'KNOWLEDGE_TRANSFER', description: 'Complete knowledge transfer documentation' },
      { title: 'Exit Interview', category: 'EXIT_INTERVIEW', description: 'Schedule and complete exit interview with HR' },
      { title: 'Full & Final Settlement', category: 'FINANCE', description: 'Process full and final settlement' },
      { title: 'Revoke System Access', category: 'IT_CLEARANCE', description: 'Revoke all system and email access' },
      { title: 'Clear Pending Dues', category: 'FINANCE', description: 'Clear any pending reimbursements or loans' },
      { title: 'No Objection Certificate', category: 'CLEARANCE', description: 'Obtain NOC from all departments' },
    ];

    const checklist = await prisma.offboardingChecklist.create({
      data: {
        employeeId,
        reason,
        lastWorkingDate: lastWorkingDate ? new Date(lastWorkingDate) : undefined,
        initiatedById: req.user!.id,
        status: 'NOT_STARTED',
        tasks: {
          create: defaultTasks.map((t: any, idx: number) => ({
            title: t.title,
            description: t.description,
            category: t.category,
            orderIndex: idx,
          })),
        },
      },
      include: {
        tasks: { orderBy: { orderIndex: 'asc' } },
        employee: { select: { firstName: true, lastName: true, employeeId: true } },
      },
    });

    res.status(201).json({ success: true, data: checklist });
  } catch (err) {
    next(err);
  }
});

// Get offboarding for employee
offboardingRouter.get('/:employeeId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const checklists = await prisma.offboardingChecklist.findMany({
      where: { employeeId: req.params.employeeId },
      include: {
        tasks: { orderBy: { orderIndex: 'asc' } },
        employee: { select: { firstName: true, lastName: true, employeeId: true, dateOfJoining: true } },
      },
    });

    res.json({ success: true, data: checklists });
  } catch (err) {
    next(err);
  }
});

// Complete offboarding task
offboardingRouter.put('/task/:id/complete', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const task = await prisma.offboardingTask.update({
      where: { id: req.params.id },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        completedBy: req.user!.id,
      },
    });

    // Update checklist status
    const allTasks = await prisma.offboardingTask.findMany({ where: { checklistId: task.checklistId } });
    const allDone = allTasks.every((t) => t.isCompleted || t.id === task.id);
    const anyDone = allTasks.some((t) => t.isCompleted) || true;

    await prisma.offboardingChecklist.update({
      where: { id: task.checklistId },
      data: {
        status: allDone ? 'COMPLETED' : anyDone ? 'IN_PROGRESS' : 'NOT_STARTED',
        completedAt: allDone ? new Date() : undefined,
      },
    });

    res.json({ success: true, data: task, message: 'Task completed' });
  } catch (err) {
    next(err);
  }
});

export default offboardingRouter;
