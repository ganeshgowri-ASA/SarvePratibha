import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { initiateVoiceCallSchema, aiAssistantConfigSchema } from '@sarve-pratibha/shared';
import { getVoiceProvider } from '../services/voice-providers';

export const aiVoiceRouter = Router();

aiVoiceRouter.use(authenticate);
aiVoiceRouter.use(authorize('MANAGER'));

// ─── POST /api/ai/voice/call/initiate ────────────────────────────

aiVoiceRouter.post('/voice/call/initiate', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = initiateVoiceCallSchema.parse(req.body);

    const provider = getVoiceProvider(data.provider);
    const result = await provider.initiateCall({
      candidatePhone: data.candidatePhone,
      candidateName: data.candidateName,
    });

    const callLog = await prisma.voiceCallLog.create({
      data: {
        sessionId: data.sessionId,
        provider: data.provider,
        providerCallId: result.providerCallId,
        candidateName: data.candidateName,
        candidatePhone: data.candidatePhone,
        status: 'QUEUED',
        direction: 'outbound',
      },
    });

    res.status(201).json({
      success: true,
      data: callLog,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/ai/voice/call/:id/status ───────────────────────────

aiVoiceRouter.get('/voice/call/:id/status', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const call = await prisma.voiceCallLog.findUnique({
      where: { id: req.params.id },
    });
    if (!call) throw new AppError(404, 'Voice call not found');

    // If call has a provider call ID, check with provider for latest status
    if (call.providerCallId && call.status !== 'COMPLETED' && call.status !== 'FAILED') {
      const provider = getVoiceProvider(call.provider);
      const providerStatus = await provider.getCallStatus(call.providerCallId);

      const statusMap: Record<string, any> = {
        completed: 'COMPLETED',
        in_progress: 'IN_PROGRESS',
        ringing: 'RINGING',
        failed: 'FAILED',
        no_answer: 'NO_ANSWER',
        busy: 'BUSY',
        queued: 'QUEUED',
      };

      const newStatus = statusMap[providerStatus.status] || call.status;

      if (newStatus !== call.status) {
        await prisma.voiceCallLog.update({
          where: { id: call.id },
          data: {
            status: newStatus,
            duration: providerStatus.duration,
            ...(newStatus === 'COMPLETED' ? { endedAt: new Date() } : {}),
            ...(newStatus === 'IN_PROGRESS' && !call.startedAt ? { startedAt: new Date() } : {}),
          },
        });
      }
    }

    const updatedCall = await prisma.voiceCallLog.findUnique({
      where: { id: req.params.id },
    });

    res.json({ success: true, data: updatedCall });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(err);
  }
});

// ─── GET /api/ai/voice/call/:id/transcript ───────────────────────

aiVoiceRouter.get('/voice/call/:id/transcript', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const call = await prisma.voiceCallLog.findUnique({
      where: { id: req.params.id },
      include: { transcripts: { orderBy: { timestamp: 'asc' } } },
    });
    if (!call) throw new AppError(404, 'Voice call not found');

    // If no transcripts stored yet and call is completed, fetch from provider
    if (call.transcripts.length === 0 && call.providerCallId && call.status === 'COMPLETED') {
      const provider = getVoiceProvider(call.provider);
      const transcription = await provider.getCallTranscript(call.providerCallId);

      // Store transcripts
      for (const segment of transcription.segments) {
        await prisma.voiceCallTranscript.create({
          data: {
            callId: call.id,
            speaker: segment.speaker,
            text: segment.text,
            timestamp: segment.timestamp,
            confidence: segment.confidence,
          },
        });
      }

      // Re-fetch with transcripts
      const updated = await prisma.voiceCallLog.findUnique({
        where: { id: req.params.id },
        include: { transcripts: { orderBy: { timestamp: 'asc' } } },
      });

      return res.json({ success: true, data: updated });
    }

    res.json({ success: true, data: call });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(err);
  }
});

// ─── POST /api/ai/voice/call/:id/end ────────────────────────────

aiVoiceRouter.post('/voice/call/:id/end', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const call = await prisma.voiceCallLog.findUnique({
      where: { id: req.params.id },
    });
    if (!call) throw new AppError(404, 'Voice call not found');

    if (call.providerCallId) {
      const provider = getVoiceProvider(call.provider);
      await provider.endCall(call.providerCallId);
    }

    const updatedCall = await prisma.voiceCallLog.update({
      where: { id: req.params.id },
      data: {
        status: 'COMPLETED',
        endedAt: new Date(),
      },
    });

    res.json({
      success: true,
      data: updatedCall,
      message: 'Voice call ended',
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(err);
  }
});

// ─── GET /api/ai/voice/calls ────────────────────────────────────

aiVoiceRouter.get('/voice/calls', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { candidateId, status, page = '1', limit = '20' } = req.query;

    const where: any = {};
    if (candidateId) where.sessionId = candidateId as string;
    if (status) where.status = status as string;

    const [calls, total] = await Promise.all([
      prisma.voiceCallLog.findMany({
        where,
        include: { session: { select: { candidateName: true, candidateEmail: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.voiceCallLog.count({ where }),
    ]);

    res.json({
      success: true,
      data: calls,
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

// ─── POST /api/ai/assistant/config ──────────────────────────────

aiVoiceRouter.post('/assistant/config', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = aiAssistantConfigSchema.parse(req.body);

    const config = await prisma.aIAssistantConfig.create({
      data: {
        name: data.name,
        voiceProvider: data.voiceProvider,
        voiceId: data.voiceId,
        personality: data.personality,
        companyContext: data.companyContext,
        language: data.language,
        supportedLanguages: data.supportedLanguages,
        maxCallDuration: data.maxCallDuration,
        evaluationCriteria: data.evaluationCriteria as any,
        isActive: data.isActive,
        createdById: req.user?.id,
      },
    });

    res.status(201).json({
      success: true,
      data: config,
      message: 'AI assistant configuration saved',
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/ai/assistant/config ───────────────────────────────

aiVoiceRouter.get('/assistant/config', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const config = await prisma.aIAssistantConfig.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: config });
  } catch (err) {
    next(err);
  }
});
