import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { learningEnrollSchema } from '@sarve-pratibha/shared';

export const learningRouter = Router();

learningRouter.use(authenticate);

// Get course catalog
learningRouter.get('/courses', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { category, level, search } = req.query;
    const where: Record<string, unknown> = { status: 'PUBLISHED' };
    if (category) where.category = category;
    if (level) where.level = level;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const courses = await prisma.learningCourse.findMany({
      where: where as any,
      include: {
        _count: { select: { modules: true, enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: courses });
  } catch (err) {
    next(err);
  }
});

// Enroll in course
learningRouter.post('/enroll', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = learningEnrollSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(400, parsed.error.errors[0].message));

    const employee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!employee) return next(new AppError(404, 'Employee not found'));

    const course = await prisma.learningCourse.findUnique({ where: { id: parsed.data.courseId } });
    if (!course || course.status !== 'PUBLISHED') return next(new AppError(400, 'Course not available'));

    const enrollment = await prisma.learningEnrollment.upsert({
      where: {
        courseId_employeeId: { courseId: parsed.data.courseId, employeeId: employee.id },
      },
      update: { status: 'IN_PROGRESS', startedAt: new Date() },
      create: {
        courseId: parsed.data.courseId,
        employeeId: employee.id,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
      include: { course: true },
    });

    res.status(201).json({ success: true, data: enrollment });
  } catch (err) {
    next(err);
  }
});

// Get my enrolled courses
learningRouter.get('/my-courses', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const employee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!employee) return next(new AppError(404, 'Employee not found'));

    const enrollments = await prisma.learningEnrollment.findMany({
      where: { employeeId: employee.id },
      include: {
        course: {
          include: { _count: { select: { modules: true } } },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ success: true, data: enrollments });
  } catch (err) {
    next(err);
  }
});

// Get course detail with modules
learningRouter.get('/course/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const course = await prisma.learningCourse.findUnique({
      where: { id: req.params.id },
      include: {
        modules: { orderBy: { orderIndex: 'asc' } },
        _count: { select: { enrollments: true } },
      },
    });
    if (!course) return next(new AppError(404, 'Course not found'));

    // Get enrollment if exists
    const employee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    let enrollment = null;
    if (employee) {
      enrollment = await prisma.learningEnrollment.findUnique({
        where: { courseId_employeeId: { courseId: req.params.id, employeeId: employee.id } },
      });
    }

    res.json({ success: true, data: { ...course, enrollment } });
  } catch (err) {
    next(err);
  }
});

// Complete a module
learningRouter.post('/course/:id/complete-module', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { moduleId } = req.body;
    if (!moduleId) return next(new AppError(400, 'Module ID required'));

    const employee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!employee) return next(new AppError(404, 'Employee not found'));

    const enrollment = await prisma.learningEnrollment.findUnique({
      where: { courseId_employeeId: { courseId: req.params.id, employeeId: employee.id } },
    });
    if (!enrollment) return next(new AppError(400, 'Not enrolled in this course'));

    const totalModules = await prisma.courseModule.count({ where: { courseId: req.params.id } });
    const completedModules = Array.isArray(enrollment.completedModules) ? enrollment.completedModules as string[] : [];

    if (!completedModules.includes(moduleId)) {
      completedModules.push(moduleId);
    }

    const progress = Math.round((completedModules.length / totalModules) * 100);
    const isCompleted = completedModules.length >= totalModules;

    const updated = await prisma.learningEnrollment.update({
      where: { id: enrollment.id },
      data: {
        completedModules: completedModules,
        progress,
        status: isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
        completedAt: isCompleted ? new Date() : undefined,
      },
      include: { course: true },
    });

    // Issue certificate if completed
    if (isCompleted) {
      const certNum = `CERT-${Date.now()}-${employee.employeeId}`;
      await prisma.certificate.create({
        data: {
          employeeId: employee.id,
          courseId: req.params.id,
          certificateNumber: certNum,
        },
      });
    }

    res.json({ success: true, data: updated, message: isCompleted ? 'Course completed! Certificate issued.' : 'Module completed' });
  } catch (err) {
    next(err);
  }
});

export default learningRouter;
