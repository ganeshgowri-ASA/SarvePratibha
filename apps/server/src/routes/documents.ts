import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import { documentUploadSchema, documentSignSchema } from '@sarve-pratibha/shared';

export const documentsRouter = Router();

documentsRouter.use(authenticate);

// Upload document
documentsRouter.post('/upload', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = documentUploadSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(400, parsed.error.errors[0].message));

    const employee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!employee) return next(new AppError(404, 'Employee not found'));

    const document = await prisma.document.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        categoryId: parsed.data.categoryId,
        fileUrl: parsed.data.fileUrl,
        fileName: parsed.data.fileName,
        fileSize: parsed.data.fileSize,
        mimeType: parsed.data.mimeType,
        tags: parsed.data.tags || [],
        uploadedById: employee.id,
      },
      include: { category: true },
    });

    res.status(201).json({ success: true, data: document });
  } catch (err) {
    next(err);
  }
});

// Get documents
documentsRouter.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { category, search, page = '1', limit = '20' } = req.query;
    const where: Record<string, unknown> = { status: 'PUBLISHED' };
    if (category) where.categoryId = category;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where: where as any,
        include: {
          category: true,
          uploadedBy: { select: { firstName: true, lastName: true } },
          _count: { select: { versions: true, signatures: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.document.count({ where: where as any }),
    ]);

    res.json({
      success: true,
      data: documents,
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

// Get document versions
documentsRouter.get('/:id/versions', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const versions = await prisma.documentVersion.findMany({
      where: { documentId: req.params.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: versions });
  } catch (err) {
    next(err);
  }
});

// Request signature on document
documentsRouter.post('/:id/sign', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = documentSignSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(400, parsed.error.errors[0].message));

    const employee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!employee) return next(new AppError(404, 'Employee not found'));

    const document = await prisma.document.findUnique({ where: { id: req.params.id } });
    if (!document) return next(new AppError(404, 'Document not found'));

    // If signing
    if (parsed.data.action === 'sign') {
      const signature = await prisma.digitalSignature.upsert({
        where: {
          documentId_employeeId: { documentId: req.params.id, employeeId: employee.id },
        },
        update: {
          status: 'SIGNED',
          signedAt: new Date(),
          ipAddress: req.ip,
          signatureData: parsed.data.signatureData,
        },
        create: {
          documentId: req.params.id,
          employeeId: employee.id,
          status: 'SIGNED',
          signedAt: new Date(),
          ipAddress: req.ip,
          signatureData: parsed.data.signatureData,
          requestedById: employee.id,
        },
      });
      return res.json({ success: true, data: signature, message: 'Document signed' });
    }

    // If requesting signature from others
    if (parsed.data.signerIds) {
      const sigs = await prisma.$transaction(
        parsed.data.signerIds.map((signerId: string) =>
          prisma.digitalSignature.upsert({
            where: {
              documentId_employeeId: { documentId: req.params.id, employeeId: signerId },
            },
            update: {},
            create: {
              documentId: req.params.id,
              employeeId: signerId,
              requestedById: employee.id,
              reason: parsed.data.reason,
            },
          })
        )
      );
      return res.json({ success: true, data: sigs, message: 'Signature requests sent' });
    }

    return next(new AppError(400, 'Invalid sign request'));
  } catch (err) {
    next(err);
  }
});

// Get my signatures
documentsRouter.get('/my-signatures', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const employee = await prisma.employee.findFirst({ where: { userId: req.user!.id } });
    if (!employee) return next(new AppError(404, 'Employee not found'));

    const signatures = await prisma.digitalSignature.findMany({
      where: { employeeId: employee.id },
      include: {
        document: { select: { id: true, title: true, fileName: true, fileUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: signatures });
  } catch (err) {
    next(err);
  }
});

export default documentsRouter;
