import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { employeeRouter } from './routes/employee';
import { adminRouter } from './routes/admin';
import { travelRouter } from './routes/travel';
import { benefitsRouter } from './routes/benefits';
import { servicesRouter } from './routes/services';
import { assetsRouter } from './routes/assets';
import { helpdeskRouter } from './routes/helpdesk';
import { meetingRoomRouter } from './routes/meeting-room';
import { cabRouter } from './routes/cab';
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
app.use('/api/admin', adminRouter);
app.use('/api/travel', travelRouter);
app.use('/api/benefits', benefitsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/assets', assetsRouter);
app.use('/api/helpdesk', helpdeskRouter);
app.use('/api/meeting-room', meetingRoomRouter);
app.use('/api/cab', cabRouter);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
