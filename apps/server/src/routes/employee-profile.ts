import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/rbac';
import { AppError } from '../middleware/error-handler';
import {
  basicInfoSchema,
  contactInfoSchema,
  addressSchema,
  personalDocumentSchema,
  familyMemberSchema,
  nominationSchema,
  bankAccountSchema,
  educationSchema,
  experienceSchema,
} from '@sarve-pratibha/shared';

export const employeeProfileRouter = Router();

employeeProfileRouter.use(authenticate);

// ─── Helper: get employee by user id or param ──────────────────────

async function getEmployeeForUser(userId: string) {
  const employee = await prisma.employee.findFirst({ where: { userId } });
  if (!employee) throw new AppError(404, 'Employee profile not found');
  return employee;
}

// ─── GET /api/employees/:id/profile ────────────────────────────────

employeeProfileRouter.get('/:id/profile', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, role: true, image: true } },
        department: { select: { id: true, name: true } },
        designation: { select: { id: true, name: true } },
        manager: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        dottedLineManager: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        orgUnitChief: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        familyMembers: { orderBy: { createdAt: 'asc' } },
        nominations: { orderBy: { createdAt: 'asc' } },
        personalDocuments: { orderBy: { documentType: 'asc' } },
        educationRecords: { orderBy: { yearOfPassing: 'desc' } },
        experienceRecords: { orderBy: { fromDate: 'desc' } },
      },
    });

    if (!employee) throw new AppError(404, 'Employee not found');

    // Only allow viewing own profile or if user is manager+
    const isOwnProfile = employee.userId === req.user!.id;
    const isManagerOrAbove = ['MANAGER', 'SECTION_HEAD', 'IT_ADMIN'].includes(req.user!.role);
    if (!isOwnProfile && !isManagerOrAbove) {
      throw new AppError(403, 'Access denied');
    }

    res.json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/employees/me/profile ─────────────────────────────────

employeeProfileRouter.get('/me/profile', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const employee = await prisma.employee.findFirst({
      where: { userId: req.user!.id },
      include: {
        user: { select: { email: true, role: true, image: true } },
        department: { select: { id: true, name: true } },
        designation: { select: { id: true, name: true } },
        manager: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        dottedLineManager: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        orgUnitChief: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        familyMembers: { orderBy: { createdAt: 'asc' } },
        nominations: { orderBy: { createdAt: 'asc' } },
        personalDocuments: { orderBy: { documentType: 'asc' } },
        educationRecords: { orderBy: { yearOfPassing: 'desc' } },
        experienceRecords: { orderBy: { fromDate: 'desc' } },
      },
    });

    if (!employee) throw new AppError(404, 'Employee profile not found');

    res.json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/employees/:id/basic-info ─────────────────────────────

employeeProfileRouter.put('/:id/basic-info', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = basicInfoSchema.parse(req.body);

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new AppError(404, 'Employee not found');
    if (employee.userId !== req.user!.id && req.user!.role !== 'IT_ADMIN') {
      throw new AppError(403, 'Can only edit own basic info');
    }

    const updated = await prisma.employee.update({
      where: { id },
      data: {
        title: data.title,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth as string) : undefined,
        maritalStatus: data.maritalStatus,
        maritalSinceDate: data.maritalSinceDate ? new Date(data.maritalSinceDate as string) : undefined,
        nationality: data.nationality,
        bloodGroup: data.bloodGroup,
        placeOfBirth: data.placeOfBirth,
        stateOfBirth: data.stateOfBirth,
        religion: data.religion,
        identificationMark: data.identificationMark,
        heightCm: data.heightCm,
        weightKg: data.weightKg,
        motherTongue: data.motherTongue,
        caste: data.caste,
        gender: data.gender,
      },
    });

    res.json({ success: true, data: updated, message: 'Basic info updated' });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/employees/:id/contact ────────────────────────────────

employeeProfileRouter.put('/:id/contact', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = contactInfoSchema.parse(req.body);

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new AppError(404, 'Employee not found');
    if (employee.userId !== req.user!.id && req.user!.role !== 'IT_ADMIN') {
      throw new AppError(403, 'Can only edit own contact info');
    }

    const updated = await prisma.employee.update({
      where: { id },
      data: {
        corporatePhone: data.corporatePhone,
        personalPhone: data.personalPhone,
        residentialPhone: data.residentialPhone,
        officePhone: data.officePhone,
        officialEmail: data.officialEmail || undefined,
        personalEmail: data.personalEmail || undefined,
      },
    });

    res.json({ success: true, data: updated, message: 'Contact info updated' });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/employees/:id/address ────────────────────────────────

employeeProfileRouter.put('/:id/address', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = addressSchema.parse(req.body);

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new AppError(404, 'Employee not found');
    if (employee.userId !== req.user!.id && req.user!.role !== 'IT_ADMIN') {
      throw new AppError(403, 'Can only edit own address');
    }

    const updated = await prisma.employee.update({
      where: { id },
      data,
    });

    res.json({ success: true, data: updated, message: 'Address updated' });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/employees/:id/bank ───────────────────────────────────

employeeProfileRouter.put('/:id/bank', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = bankAccountSchema.parse(req.body);

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new AppError(404, 'Employee not found');
    if (employee.userId !== req.user!.id && req.user!.role !== 'IT_ADMIN') {
      throw new AppError(403, 'Can only edit own bank details');
    }

    const updated = await prisma.employee.update({
      where: { id },
      data,
    });

    res.json({ success: true, data: updated, message: 'Bank details updated' });
  } catch (err) {
    next(err);
  }
});

// ─── Personal IDs (Documents) CRUD ─────────────────────────────────

employeeProfileRouter.put('/:id/personal-ids', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = personalDocumentSchema.parse(req.body);

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new AppError(404, 'Employee not found');
    if (employee.userId !== req.user!.id && req.user!.role !== 'IT_ADMIN') {
      throw new AppError(403, 'Access denied');
    }

    const doc = await prisma.personalDocument.upsert({
      where: {
        employeeId_documentType: { employeeId: id, documentType: data.documentType },
      },
      update: {
        documentNumber: data.documentNumber,
        expiryDate: data.expiryDate ? new Date(data.expiryDate as string) : undefined,
      },
      create: {
        employeeId: id,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        expiryDate: data.expiryDate ? new Date(data.expiryDate as string) : undefined,
      },
    });

    res.json({ success: true, data: doc, message: 'Document updated' });
  } catch (err) {
    next(err);
  }
});

// ─── Family Members CRUD ───────────────────────────────────────────

employeeProfileRouter.get('/:id/family', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const members = await prisma.familyMember.findMany({
      where: { employeeId: id },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ success: true, data: members });
  } catch (err) {
    next(err);
  }
});

employeeProfileRouter.post('/:id/family', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = familyMemberSchema.parse(req.body);

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new AppError(404, 'Employee not found');
    if (employee.userId !== req.user!.id && req.user!.role !== 'IT_ADMIN') {
      throw new AppError(403, 'Access denied');
    }

    const member = await prisma.familyMember.create({
      data: {
        employeeId: id,
        name: data.name,
        relationship: data.relationship,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth as string) : undefined,
        gender: data.gender,
        occupation: data.occupation,
        phone: data.phone,
        isDependent: data.isDependent,
      },
    });

    res.status(201).json({ success: true, data: member, message: 'Family member added' });
  } catch (err) {
    next(err);
  }
});

employeeProfileRouter.put('/:id/family/:memberId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id, memberId } = req.params;
    const data = familyMemberSchema.parse(req.body);

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new AppError(404, 'Employee not found');
    if (employee.userId !== req.user!.id && req.user!.role !== 'IT_ADMIN') {
      throw new AppError(403, 'Access denied');
    }

    const member = await prisma.familyMember.update({
      where: { id: memberId },
      data: {
        name: data.name,
        relationship: data.relationship,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth as string) : undefined,
        gender: data.gender,
        occupation: data.occupation,
        phone: data.phone,
        isDependent: data.isDependent,
      },
    });

    res.json({ success: true, data: member, message: 'Family member updated' });
  } catch (err) {
    next(err);
  }
});

employeeProfileRouter.delete('/:id/family/:memberId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id, memberId } = req.params;

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new AppError(404, 'Employee not found');
    if (employee.userId !== req.user!.id && req.user!.role !== 'IT_ADMIN') {
      throw new AppError(403, 'Access denied');
    }

    await prisma.familyMember.delete({ where: { id: memberId } });

    res.json({ success: true, message: 'Family member removed' });
  } catch (err) {
    next(err);
  }
});

// ─── Nominations CRUD ──────────────────────────────────────────────

employeeProfileRouter.get('/:id/nominations', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const nominations = await prisma.nomination.findMany({
      where: { employeeId: id },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ success: true, data: nominations });
  } catch (err) {
    next(err);
  }
});

employeeProfileRouter.post('/:id/nominations', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = nominationSchema.parse(req.body);

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new AppError(404, 'Employee not found');
    if (employee.userId !== req.user!.id && req.user!.role !== 'IT_ADMIN') {
      throw new AppError(403, 'Access denied');
    }

    const nomination = await prisma.nomination.create({
      data: {
        employeeId: id,
        type: data.type,
        nomineeName: data.nomineeName,
        relationship: data.relationship,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth as string) : undefined,
        percentage: data.percentage,
        address: data.address,
      },
    });

    res.status(201).json({ success: true, data: nomination, message: 'Nomination added' });
  } catch (err) {
    next(err);
  }
});

employeeProfileRouter.put('/:id/nominations/:nomId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id, nomId } = req.params;
    const data = nominationSchema.parse(req.body);

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new AppError(404, 'Employee not found');
    if (employee.userId !== req.user!.id && req.user!.role !== 'IT_ADMIN') {
      throw new AppError(403, 'Access denied');
    }

    const nomination = await prisma.nomination.update({
      where: { id: nomId },
      data: {
        type: data.type,
        nomineeName: data.nomineeName,
        relationship: data.relationship,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth as string) : undefined,
        percentage: data.percentage,
        address: data.address,
      },
    });

    res.json({ success: true, data: nomination, message: 'Nomination updated' });
  } catch (err) {
    next(err);
  }
});

employeeProfileRouter.delete('/:id/nominations/:nomId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id, nomId } = req.params;

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new AppError(404, 'Employee not found');
    if (employee.userId !== req.user!.id && req.user!.role !== 'IT_ADMIN') {
      throw new AppError(403, 'Access denied');
    }

    await prisma.nomination.delete({ where: { id: nomId } });
    res.json({ success: true, message: 'Nomination removed' });
  } catch (err) {
    next(err);
  }
});

// ─── Education CRUD ────────────────────────────────────────────────

employeeProfileRouter.post('/:id/education', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = educationSchema.parse(req.body);

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new AppError(404, 'Employee not found');
    if (employee.userId !== req.user!.id && req.user!.role !== 'IT_ADMIN') {
      throw new AppError(403, 'Access denied');
    }

    const record = await prisma.educationRecord.create({
      data: { employeeId: id, ...data },
    });

    res.status(201).json({ success: true, data: record, message: 'Education record added' });
  } catch (err) {
    next(err);
  }
});

employeeProfileRouter.put('/:id/education/:eduId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id, eduId } = req.params;
    const data = educationSchema.parse(req.body);

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new AppError(404, 'Employee not found');
    if (employee.userId !== req.user!.id && req.user!.role !== 'IT_ADMIN') {
      throw new AppError(403, 'Access denied');
    }

    const record = await prisma.educationRecord.update({
      where: { id: eduId },
      data,
    });

    res.json({ success: true, data: record, message: 'Education record updated' });
  } catch (err) {
    next(err);
  }
});

employeeProfileRouter.delete('/:id/education/:eduId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id, eduId } = req.params;

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new AppError(404, 'Employee not found');
    if (employee.userId !== req.user!.id && req.user!.role !== 'IT_ADMIN') {
      throw new AppError(403, 'Access denied');
    }

    await prisma.educationRecord.delete({ where: { id: eduId } });
    res.json({ success: true, message: 'Education record removed' });
  } catch (err) {
    next(err);
  }
});

// ─── Experience CRUD ───────────────────────────────────────────────

employeeProfileRouter.post('/:id/experience', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = experienceSchema.parse(req.body);

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new AppError(404, 'Employee not found');
    if (employee.userId !== req.user!.id && req.user!.role !== 'IT_ADMIN') {
      throw new AppError(403, 'Access denied');
    }

    const record = await prisma.experienceRecord.create({
      data: {
        employeeId: id,
        companyName: data.companyName,
        designation: data.designation,
        fromDate: new Date(data.fromDate as string),
        toDate: data.toDate ? new Date(data.toDate as string) : undefined,
        isCurrent: data.isCurrent,
        reasonForLeaving: data.reasonForLeaving,
        lastDrawnSalary: data.lastDrawnSalary,
        location: data.location,
      },
    });

    res.status(201).json({ success: true, data: record, message: 'Experience record added' });
  } catch (err) {
    next(err);
  }
});

employeeProfileRouter.put('/:id/experience/:expId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id, expId } = req.params;
    const data = experienceSchema.parse(req.body);

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new AppError(404, 'Employee not found');
    if (employee.userId !== req.user!.id && req.user!.role !== 'IT_ADMIN') {
      throw new AppError(403, 'Access denied');
    }

    const record = await prisma.experienceRecord.update({
      where: { id: expId },
      data: {
        companyName: data.companyName,
        designation: data.designation,
        fromDate: new Date(data.fromDate as string),
        toDate: data.toDate ? new Date(data.toDate as string) : undefined,
        isCurrent: data.isCurrent,
        reasonForLeaving: data.reasonForLeaving,
        lastDrawnSalary: data.lastDrawnSalary,
        location: data.location,
      },
    });

    res.json({ success: true, data: record, message: 'Experience record updated' });
  } catch (err) {
    next(err);
  }
});

employeeProfileRouter.delete('/:id/experience/:expId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id, expId } = req.params;

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new AppError(404, 'Employee not found');
    if (employee.userId !== req.user!.id && req.user!.role !== 'IT_ADMIN') {
      throw new AppError(403, 'Access denied');
    }

    await prisma.experienceRecord.delete({ where: { id: expId } });
    res.json({ success: true, message: 'Experience record removed' });
  } catch (err) {
    next(err);
  }
});

export default employeeProfileRouter;
