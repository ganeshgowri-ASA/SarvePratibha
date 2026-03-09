import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import {
  surveyCreateSchema,
  surveyResponseSchema,
  pollCreateSchema,
  pollVoteSchema,
} from '@sarve-pratibha/shared';

export const engagementRouter = Router();

engagementRouter.use(authenticate);

// ─── Surveys ───────────────────────────────────────────────────────

// Create survey (Manager+)
engagementRouter.post('/survey/create', authorize('MANAGER'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = surveyCreateSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(400, parsed.error.errors[0].message));

    const { questions, ...surveyData } = parsed.data;
    const survey = await prisma.survey.create({
      data: {
        ...surveyData,
        createdById: req.user!.id,
        questions: {
          create: questions.map((q: any, idx: number) => ({
            text: q.text,
            type: q.type,
            options: q.options,
            isRequired: q.isRequired ?? true,
            orderIndex: idx,
          })),
        },
      },
      include: { questions: { orderBy: { orderIndex: 'asc' } } },
    });

    res.status(201).json({ success: true, data: survey });
  } catch (err) {
    next(err);
  }
});

// Get all surveys
engagementRouter.get('/surveys', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const surveys = await prisma.survey.findMany({
      where,
      include: {
        questions: { orderBy: { orderIndex: 'asc' } },
        _count: { select: { responses: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: surveys });
  } catch (err) {
    next(err);
  }
});

// Respond to survey
engagementRouter.post('/survey/:id/respond', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = surveyResponseSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(400, parsed.error.errors[0].message));

    const employee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!employee) return next(new AppError(404, 'Employee not found'));

    const survey = await prisma.survey.findUnique({ where: { id: req.params.id } });
    if (!survey || survey.status !== 'ACTIVE') return next(new AppError(400, 'Survey is not active'));

    const responses = await prisma.$transaction(
      parsed.data.answers.map((a: any) =>
        prisma.surveyResponse.upsert({
          where: {
            surveyId_questionId_employeeId: {
              surveyId: req.params.id,
              questionId: a.questionId,
              employeeId: employee.id,
            },
          },
          update: { answer: a.answer, rating: a.rating },
          create: {
            surveyId: req.params.id,
            questionId: a.questionId,
            employeeId: employee.id,
            answer: a.answer,
            rating: a.rating,
          },
        })
      )
    );

    res.json({ success: true, data: responses, message: 'Survey response submitted' });
  } catch (err) {
    next(err);
  }
});

// Get survey results (Manager+)
engagementRouter.get('/survey/:id/results', authorize('MANAGER'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const survey = await prisma.survey.findUnique({
      where: { id: req.params.id },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
          include: {
            responses: true,
          },
        },
      },
    });
    if (!survey) return next(new AppError(404, 'Survey not found'));

    const results = survey.questions.map((q) => {
      const responses = q.responses;
      const ratings = responses.filter((r) => r.rating !== null).map((r) => r.rating!);
      return {
        questionId: q.id,
        text: q.text,
        type: q.type,
        totalResponses: responses.length,
        avgRating: ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null,
        answers: survey.isAnonymous ? responses.map((r) => ({ answer: r.answer, rating: r.rating })) : responses,
      };
    });

    res.json({ success: true, data: { survey: { id: survey.id, title: survey.title, status: survey.status }, results } });
  } catch (err) {
    next(err);
  }
});

// ─── Polls ─────────────────────────────────────────────────────────

// Create poll (Manager+)
engagementRouter.post('/poll/create', authorize('MANAGER'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = pollCreateSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(400, parsed.error.errors[0].message));

    const { options, ...pollData } = parsed.data;
    const poll = await prisma.poll.create({
      data: {
        ...pollData,
        createdById: req.user!.id,
        options: {
          create: options.map((text: string) => ({ text })),
        },
      },
      include: { options: true },
    });

    res.status(201).json({ success: true, data: poll });
  } catch (err) {
    next(err);
  }
});

// Vote on a poll
engagementRouter.post('/poll/:id/vote', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = pollVoteSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(400, parsed.error.errors[0].message));

    const employee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!employee) return next(new AppError(404, 'Employee not found'));

    const poll = await prisma.poll.findUnique({ where: { id: req.params.id } });
    if (!poll || poll.status !== 'ACTIVE') return next(new AppError(400, 'Poll is not active'));

    const vote = await prisma.pollVote.upsert({
      where: { pollId_employeeId: { pollId: req.params.id, employeeId: employee.id } },
      update: { optionId: parsed.data.optionId },
      create: { pollId: req.params.id, optionId: parsed.data.optionId, employeeId: employee.id },
    });

    res.json({ success: true, data: vote, message: 'Vote recorded' });
  } catch (err) {
    next(err);
  }
});

// Get polls
engagementRouter.get('/polls', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const polls = await prisma.poll.findMany({
      include: {
        options: {
          include: { _count: { select: { votes: true } } },
        },
        _count: { select: { votes: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: polls });
  } catch (err) {
    next(err);
  }
});

// ─── Engagement Score & Analytics ──────────────────────────────────

// Get engagement score for employee
engagementRouter.get('/score/:employeeId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const scores = await prisma.engagementScore.findMany({
      where: { employeeId: req.params.employeeId },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      take: 12,
    });

    res.json({ success: true, data: scores });
  } catch (err) {
    next(err);
  }
});

// Get engagement analytics (Manager+)
engagementRouter.get('/analytics', authorize('MANAGER'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { dept, year } = req.query;
    const currentYear = year ? Number(year) : new Date().getFullYear();

    const [surveyCount, activeSurveys, pollCount, avgScores] = await Promise.all([
      prisma.survey.count(),
      prisma.survey.count({ where: { status: 'ACTIVE' } }),
      prisma.poll.count(),
      prisma.engagementScore.aggregate({
        _avg: { overallScore: true, npsScore: true, pulseScore: true },
        where: { year: currentYear },
      }),
    ]);

    // Get department-wise scores
    const departmentScores = await prisma.$queryRawUnsafe(`
      SELECT e."departmentId", d.name as department, AVG(es."overallScore") as avg_score
      FROM engagement_scores es
      JOIN employees e ON es."employeeId" = e.id
      JOIN departments d ON e."departmentId" = d.id
      WHERE es.year = $1
      ${dept ? `AND d.name = '${dept}'` : ''}
      GROUP BY e."departmentId", d.name
      ORDER BY avg_score DESC
    `, currentYear);

    res.json({
      success: true,
      data: {
        totalSurveys: surveyCount,
        activeSurveys,
        totalPolls: pollCount,
        avgNPS: avgScores._avg.npsScore,
        avgPulse: avgScores._avg.pulseScore,
        avgOverall: avgScores._avg.overallScore,
        departmentScores,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default engagementRouter;
