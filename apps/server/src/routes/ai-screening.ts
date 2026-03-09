import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import {
  initiateScreeningSchema,
  evaluateScreeningSchema,
  screeningTemplateSchema,
  resumeParseSchema,
  candidateRankSchema,
} from '@sarve-pratibha/shared';
import {
  generateScreeningQuestions,
  evaluateResponses,
  parseResume,
  rankCandidates,
} from '../services/ai-screening';

export const aiScreeningRouter = Router();

aiScreeningRouter.use(authenticate);
aiScreeningRouter.use(authorize('MANAGER'));

// ─── POST /api/ai/screening/initiate ─────────────────────────────

aiScreeningRouter.post('/screening/initiate', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = initiateScreeningSchema.parse(req.body);

    // Verify application and job posting exist
    const application = await prisma.application.findUnique({
      where: { id: data.applicationId },
      include: { jobPosting: true },
    });
    if (!application) {
      throw new AppError(404, 'Application not found');
    }

    // Generate questions from JD if no template provided
    let questions;
    if (data.templateId) {
      const template = await prisma.screeningTemplate.findUnique({ where: { id: data.templateId } });
      if (!template) throw new AppError(404, 'Template not found');
      questions = template.questions as any[];
    } else {
      questions = await generateScreeningQuestions(
        application.jobPosting.title,
        application.jobPosting.description,
        application.jobPosting.requirements || undefined,
      );
    }

    // Create screening session
    const session = await prisma.aIScreeningSession.create({
      data: {
        applicationId: data.applicationId,
        jobPostingId: data.jobPostingId,
        candidateName: data.candidateName,
        candidateEmail: data.candidateEmail,
        candidatePhone: data.candidatePhone,
        templateId: data.templateId,
        language: data.language,
        status: 'PENDING',
        initiatedById: req.user?.id,
        questions: {
          create: questions.map((q: any, index: number) => ({
            questionText: q.text,
            questionType: q.type || 'TECHNICAL',
            difficulty: q.difficulty || 'MEDIUM',
            orderIndex: index,
            expectedAnswer: q.expectedAnswer || null,
            maxScore: q.maxScore || 10,
          })),
        },
      },
      include: {
        questions: { orderBy: { orderIndex: 'asc' } },
      },
    });

    res.status(201).json({
      success: true,
      data: session,
      message: 'AI screening session initiated successfully',
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(err);
  }
});

// ─── GET /api/ai/screening/session/:id ───────────────────────────

aiScreeningRouter.get('/screening/session/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const session = await prisma.aIScreeningSession.findUnique({
      where: { id: req.params.id },
      include: {
        questions: { orderBy: { orderIndex: 'asc' } },
        responses: true,
        scores: true,
        voiceCalls: {
          include: { transcripts: { orderBy: { timestamp: 'asc' } } },
        },
        jobPosting: { select: { title: true, description: true } },
        template: { select: { name: true } },
      },
    });

    if (!session) {
      throw new AppError(404, 'Screening session not found');
    }

    res.json({ success: true, data: session });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(err);
  }
});

// ─── POST /api/ai/screening/evaluate ─────────────────────────────

aiScreeningRouter.post('/screening/evaluate', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = evaluateScreeningSchema.parse(req.body);

    const session = await prisma.aIScreeningSession.findUnique({
      where: { id: data.sessionId },
      include: { questions: true },
    });
    if (!session) throw new AppError(404, 'Session not found');

    // Update session status to in-progress
    await prisma.aIScreeningSession.update({
      where: { id: data.sessionId },
      data: { status: 'IN_PROGRESS', startedAt: session.startedAt || new Date() },
    });

    // Evaluate responses using AI service
    const evaluation = await evaluateResponses(
      session.questions.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        expectedAnswer: q.expectedAnswer,
        maxScore: q.maxScore,
        questionType: q.questionType,
      })),
      data.responses as { questionId: string; responseText?: string; audioUrl?: string }[],
    );

    // Save responses
    for (const resp of data.responses) {
      const evalResult = evaluation.responses.find((e) => e.questionId === resp.questionId);
      await prisma.aIScreeningResponse.create({
        data: {
          sessionId: data.sessionId,
          questionId: resp.questionId,
          responseText: resp.responseText,
          audioUrl: resp.audioUrl,
          duration: resp.duration,
          score: evalResult?.score,
          sentiment: evalResult?.sentiment,
          confidence: evalResult?.confidence,
          feedback: evalResult?.feedback,
          evaluatedAt: new Date(),
        },
      });
    }

    // Save category scores
    for (const catScore of evaluation.categoryScores) {
      await prisma.aIScreeningScore.create({
        data: {
          sessionId: data.sessionId,
          category: catScore.category,
          score: catScore.score,
          maxScore: catScore.maxScore,
          details: catScore.details,
        },
      });
    }

    // Update session with results
    const updatedSession = await prisma.aIScreeningSession.update({
      where: { id: data.sessionId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        overallScore: evaluation.overallScore,
        recommendation: evaluation.recommendation,
        summary: evaluation.summary,
      },
      include: {
        questions: { orderBy: { orderIndex: 'asc' } },
        responses: true,
        scores: true,
      },
    });

    res.json({
      success: true,
      data: updatedSession,
      message: 'Screening evaluation completed',
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(err);
  }
});

// ─── GET /api/ai/screening/results/:candidateId ─────────────────

aiScreeningRouter.get('/screening/results/:candidateId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // candidateId here is the applicationId
    const sessions = await prisma.aIScreeningSession.findMany({
      where: { applicationId: req.params.candidateId },
      include: {
        scores: true,
        jobPosting: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const aiScore = await prisma.candidateAIScore.findFirst({
      where: { applicationId: req.params.candidateId },
    });

    res.json({
      success: true,
      data: { sessions, aiScore },
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/ai/screening/template/create ──────────────────────

aiScreeningRouter.post('/screening/template/create', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = screeningTemplateSchema.parse(req.body);

    const template = await prisma.screeningTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        roleTitle: data.roleTitle,
        department: data.department,
        questions: data.questions as any,
        createdById: req.user?.id,
      },
    });

    res.status(201).json({
      success: true,
      data: template,
      message: 'Screening template created successfully',
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/ai/screening/templates ─────────────────────────────

aiScreeningRouter.get('/screening/templates', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const templates = await prisma.screeningTemplate.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: templates });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/ai/analytics/screening-effectiveness ───────────────

aiScreeningRouter.get('/analytics/screening-effectiveness', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [totalSessions, completedSessions, allSessions] = await Promise.all([
      prisma.aIScreeningSession.count(),
      prisma.aIScreeningSession.count({ where: { status: 'COMPLETED' } }),
      prisma.aIScreeningSession.findMany({
        where: { status: 'COMPLETED', overallScore: { not: null } },
        select: {
          overallScore: true,
          recommendation: true,
          completedAt: true,
          startedAt: true,
          candidateName: true,
          candidateEmail: true,
          id: true,
          status: true,
          createdAt: true,
          jobPosting: { select: { title: true } },
        },
        orderBy: { overallScore: 'desc' },
      }),
    ]);

    const voiceCallStats = await prisma.voiceCallLog.groupBy({
      by: ['provider'],
      _count: true,
    });

    const scores = allSessions.map((s) => s.overallScore || 0);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    const shortlisted = allSessions.filter((s) => s.recommendation === 'SHORTLIST' || s.recommendation === 'STRONG_SHORTLIST').length;
    const shortlistRate = completedSessions > 0 ? Math.round((shortlisted / completedSessions) * 100) : 0;

    const durations = allSessions
      .filter((s) => s.startedAt && s.completedAt)
      .map((s) => (new Date(s.completedAt!).getTime() - new Date(s.startedAt!).getTime()) / 1000);
    const avgDuration = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

    // Score distribution
    const ranges = ['0-20', '21-40', '41-60', '61-80', '81-100'];
    const scoreDistribution = ranges.map((range) => {
      const [min, max] = range.split('-').map(Number);
      return {
        range,
        count: scores.filter((s) => s >= min && s <= max).length,
      };
    });

    const providerBreakdown: Record<string, number> = {};
    voiceCallStats.forEach((stat) => {
      providerBreakdown[stat.provider] = stat._count;
    });

    const topCandidates = allSessions.slice(0, 10).map((s) => ({
      id: s.id,
      candidateName: s.candidateName,
      candidateEmail: s.candidateEmail,
      status: s.status,
      jobTitle: s.jobPosting.title,
      overallScore: s.overallScore,
      recommendation: s.recommendation,
      startedAt: s.startedAt?.toISOString() || null,
      completedAt: s.completedAt?.toISOString() || null,
      createdAt: s.createdAt.toISOString(),
    }));

    res.json({
      success: true,
      data: {
        totalSessions,
        completedSessions,
        avgScore,
        shortlistRate,
        avgDuration,
        providerBreakdown,
        scoreDistribution,
        topCandidates,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/ai/resume/parse ──────────────────────────────────

aiScreeningRouter.post('/resume/parse', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = resumeParseSchema.parse(req.body);
    const parsed = await parseResume(data.resumeText, data.resumeUrl);

    res.json({
      success: true,
      data: parsed,
      message: 'Resume parsed successfully',
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/ai/candidate/rank ────────────────────────────────

aiScreeningRouter.post('/candidate/rank', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = candidateRankSchema.parse(req.body);

    const jobPosting = await prisma.jobPosting.findUnique({
      where: { id: data.jobPostingId },
    });
    if (!jobPosting) throw new AppError(404, 'Job posting not found');

    const applications = await prisma.application.findMany({
      where: { id: { in: data.applicationIds } },
    });

    const rankings = await rankCandidates(
      jobPosting.description,
      applications.map((app) => ({
        applicationId: app.id,
        resumeText: app.coverLetter || undefined,
      })),
    );

    // Save AI scores
    for (const ranking of rankings) {
      await prisma.candidateAIScore.upsert({
        where: {
          applicationId_jobPostingId: {
            applicationId: ranking.applicationId,
            jobPostingId: data.jobPostingId,
          },
        },
        update: {
          technicalScore: ranking.technicalScore,
          communicationScore: ranking.communicationScore,
          culturalFitScore: ranking.culturalFitScore,
          confidenceScore: ranking.confidenceScore,
          resumeScore: ranking.resumeScore,
          overallScore: ranking.overallScore,
          recommendation: ranking.recommendation,
          reasoning: ranking.reasoning,
        },
        create: {
          applicationId: ranking.applicationId,
          jobPostingId: data.jobPostingId,
          technicalScore: ranking.technicalScore,
          communicationScore: ranking.communicationScore,
          culturalFitScore: ranking.culturalFitScore,
          confidenceScore: ranking.confidenceScore,
          resumeScore: ranking.resumeScore,
          overallScore: ranking.overallScore,
          recommendation: ranking.recommendation,
          reasoning: ranking.reasoning,
        },
      });
    }

    // Sort by overall score descending and assign rankings
    rankings.sort((a, b) => b.overallScore - a.overallScore);

    res.json({
      success: true,
      data: rankings.map((r, i) => ({ ...r, ranking: i + 1 })),
      message: 'Candidates ranked successfully',
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(err);
  }
});
