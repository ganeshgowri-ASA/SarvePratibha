import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error-handler';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/rbac';
import crypto from 'crypto';
import {
  candidatePortalCreateSchema,
  candidateDocumentUploadSchema,
  candidateSelfServiceSchema,
  candidateDocumentReviewSchema,
} from '@sarve-pratibha/shared';

export const candidatePortalRouter = Router();

// ─── DOCUMENT DEFINITIONS ─────────────────────────────────────────

const REQUIRED_DOCUMENTS = [
  // Personal Documents
  { key: 'aadhar_front', name: 'Aadhar Card (Front)', category: 'PERSONAL', required: true },
  { key: 'aadhar_back', name: 'Aadhar Card (Back)', category: 'PERSONAL', required: true },
  { key: 'pan_card', name: 'PAN Card', category: 'PERSONAL', required: true },
  { key: 'passport', name: 'Passport', category: 'PERSONAL', required: false },
  { key: 'driving_license', name: 'Driving License', category: 'PERSONAL', required: false },
  // Academic Documents
  { key: 'marksheet_10th', name: '10th Marksheet', category: 'ACADEMIC', required: true },
  { key: 'marksheet_12th', name: '12th Marksheet', category: 'ACADEMIC', required: true },
  { key: 'graduation_degree', name: 'Graduation Degree', category: 'ACADEMIC', required: true },
  { key: 'post_graduation', name: 'Post-Graduation Degree', category: 'ACADEMIC', required: false },
  { key: 'other_certifications', name: 'Other Certifications', category: 'ACADEMIC', required: false },
  // Professional Documents
  { key: 'prev_employment_letters', name: 'Previous Employment Letters', category: 'PROFESSIONAL', required: true },
  { key: 'relieving_letters', name: 'Relieving Letters', category: 'PROFESSIONAL', required: true },
  { key: 'last_3_payslips', name: 'Last 3 Months Payslips', category: 'PROFESSIONAL', required: true },
  { key: 'experience_certificates', name: 'Experience Certificates', category: 'PROFESSIONAL', required: true },
  { key: 'appointment_letters', name: 'Appointment Letters', category: 'PROFESSIONAL', required: false },
  // Financial Documents
  { key: 'epf_uan', name: 'EPF UAN Number Document', category: 'FINANCIAL', required: true },
  { key: 'cancelled_cheque', name: 'Cancelled Cheque / Bank Details', category: 'FINANCIAL', required: true },
  { key: 'form_16', name: 'Form 16 (Last Employer)', category: 'FINANCIAL', required: false },
  // Health & Compliance
  { key: 'medical_fitness', name: 'Medical Fitness Certificate', category: 'HEALTH', required: true },
  { key: 'blood_group_cert', name: 'Blood Group Certificate', category: 'HEALTH', required: false },
  { key: 'covid_vaccination', name: 'Covid Vaccination Certificate', category: 'HEALTH', required: false },
  // Photos
  { key: 'passport_photo', name: 'Passport Size Photo', category: 'PHOTOS', required: true },
  { key: 'full_size_photo', name: 'Full Size Photo', category: 'PHOTOS', required: false },
] as const;

// ─── CANDIDATE-FACING ROUTES (Token-based auth) ──────────────────

interface CandidateRequest extends Request {
  candidatePortal?: {
    id: string;
    email: string;
    candidateId: string;
    fullName: string;
  };
}

// Middleware to authenticate candidate via token
async function authenticateCandidate(req: CandidateRequest, _res: Response, next: NextFunction) {
  const token = req.headers['x-candidate-token'] as string;
  if (!token) {
    return next(new AppError(401, 'Access token required'));
  }

  const portal = await prisma.candidatePortalAccess.findUnique({
    where: { accessToken: token },
  });

  if (!portal) {
    return next(new AppError(401, 'Invalid access token'));
  }
  if (!portal.isActive) {
    return next(new AppError(403, 'Portal access has been deactivated'));
  }
  if (portal.expiresAt < new Date()) {
    return next(new AppError(403, 'Access token has expired'));
  }

  // Update last accessed
  await prisma.candidatePortalAccess.update({
    where: { id: portal.id },
    data: { lastAccessedAt: new Date() },
  });

  req.candidatePortal = {
    id: portal.id,
    email: portal.email,
    candidateId: portal.candidateId,
    fullName: portal.fullName,
  };
  next();
}

// Candidate login (verify email + token)
candidatePortalRouter.post('/candidate/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, accessToken } = req.body;

    if (!email || !accessToken) {
      throw new AppError(400, 'Email and access token are required');
    }

    const portal = await prisma.candidatePortalAccess.findUnique({
      where: { accessToken },
      include: {
        documents: { select: { id: true, status: true } },
        selfServiceData: { select: { isSubmitted: true } },
      },
    });

    if (!portal || portal.email !== email) {
      throw new AppError(401, 'Invalid credentials');
    }
    if (!portal.isActive) {
      throw new AppError(403, 'Portal access has been deactivated');
    }
    if (portal.expiresAt < new Date()) {
      throw new AppError(403, 'Access token has expired');
    }

    await prisma.candidatePortalAccess.update({
      where: { id: portal.id },
      data: { lastAccessedAt: new Date() },
    });

    res.json({
      success: true,
      data: {
        id: portal.id,
        email: portal.email,
        fullName: portal.fullName,
        phone: portal.phone,
        overallStatus: portal.overallStatus,
        expiresAt: portal.expiresAt,
        documentsTotal: portal.documents.length,
        documentsUploaded: portal.documents.filter((d) => d.status !== 'PENDING').length,
        selfServiceSubmitted: portal.selfServiceData?.isSubmitted ?? false,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Get portal dashboard (documents + status)
candidatePortalRouter.get(
  '/candidate/dashboard',
  authenticateCandidate,
  async (req: CandidateRequest, res: Response, next: NextFunction) => {
    try {
      const portal = await prisma.candidatePortalAccess.findUnique({
        where: { id: req.candidatePortal!.id },
        include: {
          documents: {
            orderBy: { createdAt: 'asc' },
          },
          selfServiceData: true,
        },
      });

      if (!portal) throw new AppError(404, 'Portal not found');

      // Group documents by category
      const documentsByCategory = REQUIRED_DOCUMENTS.map((doc) => doc.category)
        .filter((v, i, a) => a.indexOf(v) === i)
        .map((category) => {
          const categoryDocs = portal.documents.filter((d) => d.category === category);
          return {
            category,
            label: category.charAt(0) + category.slice(1).toLowerCase(),
            documents: categoryDocs,
          };
        });

      const uploaded = portal.documents.filter((d) => d.status !== 'PENDING').length;
      const verified = portal.documents.filter((d) => d.status === 'VERIFIED').length;
      const rejected = portal.documents.filter((d) => d.status === 'REJECTED').length;

      res.json({
        success: true,
        data: {
          portal: {
            id: portal.id,
            fullName: portal.fullName,
            email: portal.email,
            overallStatus: portal.overallStatus,
            expiresAt: portal.expiresAt,
          },
          documents: {
            total: portal.documents.length,
            uploaded,
            verified,
            rejected,
            pending: portal.documents.length - uploaded,
            byCategory: documentsByCategory,
          },
          selfService: portal.selfServiceData,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

// Upload document
candidatePortalRouter.post(
  '/candidate/document/upload',
  authenticateCandidate,
  async (req: CandidateRequest, res: Response, next: NextFunction) => {
    try {
      const data = candidateDocumentUploadSchema.parse(req.body);

      const doc = await prisma.candidateDocument.findUnique({
        where: {
          portalAccessId_documentKey: {
            portalAccessId: req.candidatePortal!.id,
            documentKey: data.documentKey,
          },
        },
      });

      if (!doc) throw new AppError(404, 'Document slot not found');
      if (doc.status === 'VERIFIED') {
        throw new AppError(400, 'Document already verified, cannot re-upload');
      }

      const updated = await prisma.candidateDocument.update({
        where: { id: doc.id },
        data: {
          fileName: data.fileName,
          fileUrl: data.fileUrl,
          fileSize: data.fileSize,
          mimeType: data.mimeType,
          status: 'UPLOADED',
          uploadedAt: new Date(),
          reviewerComment: null,
        },
      });

      // Recalculate overall status
      await recalculatePortalStatus(req.candidatePortal!.id);

      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },
);

// Submit self-service form
candidatePortalRouter.post(
  '/candidate/self-service',
  authenticateCandidate,
  async (req: CandidateRequest, res: Response, next: NextFunction) => {
    try {
      const data = candidateSelfServiceSchema.parse(req.body);

      const selfService = await prisma.candidateSelfService.upsert({
        where: { portalAccessId: req.candidatePortal!.id },
        create: {
          portalAccessId: req.candidatePortal!.id,
          ...data,
          dateOfBirth: new Date(data.dateOfBirth),
          isSubmitted: true,
          submittedAt: new Date(),
        },
        update: {
          ...data,
          dateOfBirth: new Date(data.dateOfBirth),
          isSubmitted: true,
          submittedAt: new Date(),
        },
      });

      res.json({ success: true, data: selfService });
    } catch (err) {
      next(err);
    }
  },
);

// Get self-service form data
candidatePortalRouter.get(
  '/candidate/self-service',
  authenticateCandidate,
  async (req: CandidateRequest, res: Response, next: NextFunction) => {
    try {
      const data = await prisma.candidateSelfService.findUnique({
        where: { portalAccessId: req.candidatePortal!.id },
      });

      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
);

// ─── HR-FACING ROUTES (Authenticated + RBAC) ─────────────────────

// Create portal access for a candidate (HR action)
candidatePortalRouter.post(
  '/portal/create',
  authenticate,
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const data = candidatePortalCreateSchema.parse(req.body);

      // Check if candidate exists
      const candidate = await prisma.candidate.findUnique({
        where: { id: data.candidateId },
      });
      if (!candidate) throw new AppError(404, 'Candidate not found');

      // Check for existing active portal
      const existing = await prisma.candidatePortalAccess.findFirst({
        where: { candidateId: data.candidateId, isActive: true },
      });
      if (existing) {
        throw new AppError(409, 'Active portal access already exists for this candidate');
      }

      const accessToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (data.expiresInDays || 30));

      const portal = await prisma.candidatePortalAccess.create({
        data: {
          candidateId: data.candidateId,
          email: data.email,
          accessToken,
          fullName: data.fullName,
          phone: data.phone,
          expiresAt,
        },
      });

      // Create document slots
      await prisma.candidateDocument.createMany({
        data: REQUIRED_DOCUMENTS.map((doc) => ({
          portalAccessId: portal.id,
          documentName: doc.name,
          documentKey: doc.key,
          category: doc.category,
          isRequired: doc.required,
        })),
      });

      res.status(201).json({
        success: true,
        data: {
          ...portal,
          accessToken,
          portalUrl: `/candidate-portal?token=${accessToken}&email=${data.email}`,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

// List all candidates with portal access (HR view)
candidatePortalRouter.get(
  '/portal/candidates',
  authenticate,
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { status, search, page = '1', limit = '10' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: Record<string, unknown> = {};
      if (status) where.overallStatus = status;
      if (search) {
        where.OR = [
          { fullName: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const [portals, total] = await Promise.all([
        prisma.candidatePortalAccess.findMany({
          where,
          include: {
            candidate: {
              select: { id: true, firstName: true, lastName: true, currentTitle: true },
            },
            documents: {
              select: { id: true, status: true, category: true },
            },
            selfServiceData: {
              select: { isSubmitted: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit),
        }),
        prisma.candidatePortalAccess.count({ where }),
      ]);

      const data = portals.map((p) => ({
        id: p.id,
        candidateId: p.candidateId,
        fullName: p.fullName,
        email: p.email,
        phone: p.phone,
        overallStatus: p.overallStatus,
        isActive: p.isActive,
        expiresAt: p.expiresAt,
        lastAccessedAt: p.lastAccessedAt,
        candidate: p.candidate,
        documentsTotal: p.documents.length,
        documentsUploaded: p.documents.filter((d) => d.status !== 'PENDING').length,
        documentsVerified: p.documents.filter((d) => d.status === 'VERIFIED').length,
        documentsRejected: p.documents.filter((d) => d.status === 'REJECTED').length,
        selfServiceSubmitted: p.selfServiceData?.isSubmitted ?? false,
        createdAt: p.createdAt,
      }));

      res.json({
        success: true,
        data,
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
  },
);

// Get candidate documents for review (HR view)
candidatePortalRouter.get(
  '/portal/:portalId/documents',
  authenticate,
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { portalId } = req.params;

      const portal = await prisma.candidatePortalAccess.findUnique({
        where: { id: portalId },
        include: {
          candidate: {
            select: { id: true, firstName: true, lastName: true, email: true, phone: true },
          },
          documents: {
            orderBy: { createdAt: 'asc' },
          },
          selfServiceData: true,
        },
      });

      if (!portal) throw new AppError(404, 'Portal access not found');

      res.json({ success: true, data: portal });
    } catch (err) {
      next(err);
    }
  },
);

// Review a document (verify/reject)
candidatePortalRouter.put(
  '/portal/document/:documentId/review',
  authenticate,
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { documentId } = req.params;
      const { action, comment } = candidateDocumentReviewSchema.parse(req.body);
      const employeeId = req.user!.employeeId;

      const doc = await prisma.candidateDocument.findUnique({
        where: { id: documentId },
      });
      if (!doc) throw new AppError(404, 'Document not found');
      if (doc.status === 'PENDING') {
        throw new AppError(400, 'Cannot review a document that has not been uploaded');
      }

      const updated = await prisma.candidateDocument.update({
        where: { id: documentId },
        data: {
          status: action === 'VERIFY' ? 'VERIFIED' : 'REJECTED',
          reviewerComment: comment || null,
          reviewedBy: employeeId,
          reviewedAt: new Date(),
        },
      });

      // Recalculate overall status
      await recalculatePortalStatus(doc.portalAccessId);

      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },
);

// Raise query / send notification to candidate
candidatePortalRouter.post(
  '/portal/:portalId/query',
  authenticate,
  authorize('MANAGER'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { portalId } = req.params;
      const { message } = req.body;

      const portal = await prisma.candidatePortalAccess.findUnique({
        where: { id: portalId },
      });
      if (!portal) throw new AppError(404, 'Portal access not found');

      // Update portal status to issues found
      await prisma.candidatePortalAccess.update({
        where: { id: portalId },
        data: { overallStatus: 'ISSUES_FOUND' },
      });

      // In production, this would send an email notification
      res.json({
        success: true,
        data: {
          message: `Query sent to ${portal.email}`,
          queryText: message,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

// ─── HELPERS ──────────────────────────────────────────────────────

async function recalculatePortalStatus(portalAccessId: string) {
  const docs = await prisma.candidateDocument.findMany({
    where: { portalAccessId },
  });

  const requiredDocs = docs.filter((d) => d.isRequired);
  const allUploaded = requiredDocs.every((d) => d.status !== 'PENDING');
  const allVerified = requiredDocs.every((d) => d.status === 'VERIFIED');
  const hasRejected = docs.some((d) => d.status === 'REJECTED');

  let overallStatus: 'INCOMPLETE' | 'UNDER_REVIEW' | 'VERIFIED' | 'ISSUES_FOUND';

  if (allVerified) {
    overallStatus = 'VERIFIED';
  } else if (hasRejected) {
    overallStatus = 'ISSUES_FOUND';
  } else if (allUploaded) {
    overallStatus = 'UNDER_REVIEW';
  } else {
    overallStatus = 'INCOMPLETE';
  }

  await prisma.candidatePortalAccess.update({
    where: { id: portalAccessId },
    data: { overallStatus },
  });
}
