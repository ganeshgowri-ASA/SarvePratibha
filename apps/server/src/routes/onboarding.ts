import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { onboardingChecklistCreateSchema } from '@sarve-pratibha/shared';

export const onboardingRouter = Router();

onboardingRouter.use(authenticate);

// Create onboarding checklist (Manager+)
onboardingRouter.post('/checklist/create', authorize('MANAGER'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = onboardingChecklistCreateSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(400, parsed.error.errors[0].message));

    const { employeeId, tasks } = parsed.data;

    const checklist = await prisma.onboardingChecklist.create({
      data: {
        employeeId,
        assignedById: req.user!.id,
        status: 'NOT_STARTED',
        tasks: {
          create: tasks.map((t: any, idx: number) => ({
            title: t.title,
            description: t.description,
            category: t.category,
            dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
            orderIndex: idx,
          })),
        },
      },
      include: { tasks: { orderBy: { orderIndex: 'asc' } } },
    });

    res.status(201).json({ success: true, data: checklist });
  } catch (err) {
    next(err);
  }
});

// Get onboarding for employee
onboardingRouter.get('/:employeeId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const checklists = await prisma.onboardingChecklist.findMany({
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

// Complete onboarding task
onboardingRouter.put('/task/:id/complete', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const task = await prisma.onboardingTask.update({
      where: { id: req.params.id },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        completedBy: req.user!.id,
      },
    });

    // Update checklist status
    const allTasks = await prisma.onboardingTask.findMany({ where: { checklistId: task.checklistId } });
    const allDone = allTasks.every((t) => t.isCompleted || t.id === task.id);
    const anyDone = allTasks.some((t) => t.isCompleted) || true;

    await prisma.onboardingChecklist.update({
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

export default onboardingRouter;
