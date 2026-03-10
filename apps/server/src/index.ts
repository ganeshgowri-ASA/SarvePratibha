import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { employeeRouter } from './routes/employee';
import { employeeProfileRouter } from './routes/employee-profile';
import { peopleRouter } from './routes/people';
import { adminRouter } from './routes/admin';
import { leaveRouter } from './routes/leave';
import { attendanceRouter } from './routes/attendance';
import { holidayRouter } from './routes/holiday';
import { goalsRouter } from './routes/goals';
import { performanceRouter } from './routes/performance';
import { payrollRouter } from './routes/payroll';
import { taxRouter } from './routes/tax';
import { reimbursementRouter } from './routes/reimbursement';
import { recruitmentRouter } from './routes/recruitment';
import { aiScreeningRouter } from './routes/ai-screening';
import { aiVoiceRouter } from './routes/ai-voice';
import { travelRouter } from './routes/travel';
import { benefitsRouter } from './routes/benefits';
import { servicesRouter } from './routes/services';
import { assetsRouter } from './routes/assets';
import { helpdeskRouter } from './routes/helpdesk';
import { meetingRoomRouter } from './routes/meeting-room';
import { cabRouter } from './routes/cab';
import { notificationRouter } from './routes/notifications';
import { engagementRouter } from './routes/engagement';
import { diRouter } from './routes/di';
import { complianceRouter as complianceModuleRouter } from './routes/compliance';
import { documentsRouter } from './routes/documents';
import { talentRouter } from './routes/talent';
import { learningRouter } from './routes/learning';
import { onboardingRouter } from './routes/onboarding';
import { offboardingRouter } from './routes/offboarding';
import { candidatePortalRouter } from './routes/candidate-portal';
import { errorHandler } from './middleware/error-handler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/employees', employeeRouter);
app.use('/api/employees', employeeProfileRouter);
app.use('/api/people', peopleRouter);
app.use('/api', peopleRouter);
app.use('/api/admin', adminRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api', holidayRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/performance', performanceRouter);
app.use('/api/payroll', payrollRouter);
app.use('/api/tax', taxRouter);
app.use('/api/reimbursement', reimbursementRouter);
app.use('/api/recruitment', recruitmentRouter);
app.use('/api/ai', aiScreeningRouter);
app.use('/api/ai', aiVoiceRouter);
app.use('/api/travel', travelRouter);
app.use('/api/benefits', benefitsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/assets', assetsRouter);
app.use('/api/helpdesk', helpdeskRouter);
app.use('/api/meeting-room', meetingRoomRouter);
app.use('/api/cab', cabRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/engagement', engagementRouter);
app.use('/api/di', diRouter);
app.use('/api/compliance', complianceModuleRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/talent', talentRouter);
app.use('/api/learning', learningRouter);
app.use('/api/onboarding', onboardingRouter);
app.use('/api/offboarding', offboardingRouter);
app.use('/api/candidate-portal', candidatePortalRouter);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
