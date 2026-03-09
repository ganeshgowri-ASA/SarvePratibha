# SarvePratibha (सर्वे प्रतिभा)

> **Enterprise HRMS** - All-in-one HR, Payroll, Recruitment, Performance & Employee Management Platform

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui |
| Backend | Node.js + Express.js + TypeScript + Prisma ORM |
| Database | PostgreSQL 16 + Redis 7 (Docker) |
| Auth | NextAuth.js (Credentials + Google OAuth, JWT sessions) |
| Validation | Zod (shared between frontend/backend) |
| Email | Nodemailer / SendGrid |
| SMS | Twilio |
| AI Voice | Vapi.ai / ElevenLabs / Sarvam AI |
| Monorepo | Turborepo + npm workspaces |
| Deploy | Vercel (frontend) + Railway (backend) |

## Quick Start

### Prerequisites

- Node.js >= 18
- Docker & Docker Compose
- npm >= 10

### Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd SarvePratibha
npm install

# 2. Start PostgreSQL & Redis
docker-compose up -d postgres redis

# 3. Configure environment
cp .env.example .env
# Edit .env with your values (defaults work for local dev)

# 4. Setup database
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:seed        # Seed with demo data

# 5. Start development
npm run dev            # Starts web (port 3000) + server (port 4000)
```

### Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| IT Admin | admin@sarvepratibha.com | Password@123 |
| Section Head | section.head@sarvepratibha.com | Password@123 |
| Manager | manager@sarvepratibha.com | Password@123 |
| Employee | employee@sarvepratibha.com | Password@123 |

## Project Structure

```
SarvePratibha/
├── apps/
│   ├── web/                    # Next.js 14 Frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/     # Login, Register
│   │   │   │   └── (dashboard)/ # All dashboard pages
│   │   │   ├── components/
│   │   │   │   ├── ui/         # shadcn/ui components
│   │   │   │   ├── layout/     # Sidebar, Navbar
│   │   │   │   └── dashboard/  # Dashboard widgets
│   │   │   └── lib/            # Utils, auth, API client
│   │   └── package.json
│   └── server/                 # Express.js Backend
│       ├── src/
│       │   ├── routes/         # 24 API route files
│       │   ├── middleware/     # Auth, RBAC, error handling
│       │   ├── services/       # Email, SMS, notifications
│       │   └── lib/            # Prisma client
│       ├── prisma/
│       │   ├── schema.prisma   # 70+ models
│       │   └── seed.ts         # Demo data
│       └── package.json
├── packages/
│   ├── shared/                 # Shared types, constants, Zod validations
│   └── email-templates/        # React Email templates
├── docker-compose.yml          # PostgreSQL + Redis + app services
├── turbo.json                  # Turborepo pipeline config
├── .env.example                # Environment variable template
└── package.json                # Root workspaces config
```

## Role-Based Access Control (RBAC)

4 roles with hierarchical permissions:

| Role | Level | Access |
|------|-------|--------|
| Employee | 0 | Self-service portal |
| Manager | 1 | Team oversight & approvals |
| Section Head | 2 | Department control & analytics |
| IT Admin | 3 | Full system administration |

Higher roles inherit all lower role permissions. IT_ADMIN always has full access.

## Modules (30+)

### Core HR
- Employee Management & Personal Details
- Organization Directory & People Search
- Family, Education, Experience, Nomination records

### Leave & Attendance
- Leave Management (Apply/Approve/Regularize)
- Attendance Calendar (Punch In-Out, Weekly Hours)
- Shift Scheduling, Comp-Off, Work From Home, On Duty
- Holiday Calendar Management

### Payroll & Finance
- Salary Structure & Payslips
- Tax Declaration (Old/New Regime)
- Tax Computation & Form 16
- Investment Proof Management
- Reimbursement Claims
- Employee Loans

### Performance Management
- Goal Setting (OKR/KRA/KPI)
- Performance Reviews (Self + Manager)
- Competency Framework & Ratings
- 360-Degree Feedback
- PIP (Performance Improvement Plan)
- Department Analytics & Bell Curve

### Recruitment (ATS)
- Job Requisitions & Postings
- Multi-Platform Sourcing (Naukri/LinkedIn/Indeed/Glassdoor)
- Candidate Pipeline with Kanban View
- Interview Scheduling & Feedback
- Offer Letter Management
- Talent Pool Management

### AI Screening
- AI-powered candidate screening sessions
- Voice call integration (Vapi / ElevenLabs / Sarvam AI)
- Automated scoring & recommendations
- Screening templates
- Multi-language support

### Travel & Expenses
- Travel Request & Approval
- Itinerary Management
- Expense Tracking & Settlement
- Travel Policy Configuration

### Benefits
- Benefit Plan Management
- Employee Enrollment
- Insurance Policies

### Corporate Services
- Service Request Management
- IT Asset Management & Requests
- Helpdesk Ticketing System
- Meeting Room Booking
- Cab Booking

### Security Services
- Security Pass Management
- Visitor Log Management

### Admin Panel
- User & Role Management
- Department, Designation, Location, Grade Management
- System Configuration & Health
- Security Policies
- Audit Logs
- Announcements & Company Policies
- Workflow Management
- Custom Fields
- Data Import/Export
- Notification Templates

## API Overview

All API endpoints are under `/api/` prefix. Standard response format:

```json
{
  "success": true,
  "data": {},
  "message": "Optional message",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Route Groups

| Prefix | Routes | Description |
|--------|--------|-------------|
| `/api/auth` | login, register, me | Authentication |
| `/api/employees` | CRUD, profile, search | Employee management |
| `/api/people` | directory, hierarchy | People directory |
| `/api/leave` | apply, approve, balance | Leave management |
| `/api/attendance` | punch, calendar, team | Attendance tracking |
| `/api/holidays` | CRUD, calendar | Holiday management |
| `/api/payroll` | structure, payslips, run | Payroll processing |
| `/api/tax` | declaration, computation | Tax management |
| `/api/reimbursement` | submit, approve | Reimbursements |
| `/api/performance` | goals, reviews, KRA | Performance management |
| `/api/goals` | CRUD, progress | Goal management |
| `/api/recruitment` | requisitions, pipeline | Recruitment ATS |
| `/api/ai` | screening, voice-calls | AI screening |
| `/api/travel` | requests, expenses | Travel management |
| `/api/benefits` | plans, enrollment | Benefits management |
| `/api/services` | requests, catalog | Corporate services |
| `/api/assets` | inventory, assignments | Asset management |
| `/api/helpdesk` | tickets, comments | Helpdesk |
| `/api/meeting-room` | rooms, bookings | Meeting room booking |
| `/api/cab` | requests, booking | Cab booking |
| `/api/notifications` | CRUD, preferences | Notifications |
| `/api/admin` | config, users, health | Administration |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all apps in development mode |
| `npm run build` | Build all apps for production |
| `npm run lint` | Lint all apps |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with demo data |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |
| `npm run db:reset` | Reset database and re-apply migrations |
| `npm run format` | Format code with Prettier |

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repo to Vercel
2. Set root directory to `apps/web`
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL` - Backend API URL
   - `NEXTAUTH_URL` - Production URL
   - `NEXTAUTH_SECRET` - Random secret
   - `API_URL` - Backend API URL (server-side)
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (optional)

### Backend (Railway)

1. Create a new Railway project
2. Add PostgreSQL and Redis services
3. Deploy the server app:
   - Set root directory to `apps/server`
   - Build command: `npm run build`
   - Start command: `npm run start`
4. Add environment variables:
   - `DATABASE_URL` - Railway PostgreSQL URL
   - `REDIS_URL` - Railway Redis URL
   - `JWT_SECRET` - Random secret
   - `FRONTEND_URL` - Vercel frontend URL
   - SMTP, Twilio, AI provider keys as needed

### Docker (Self-hosted)

```bash
# Start all services
docker-compose up -d

# Run migrations and seed
docker-compose exec server npx prisma migrate deploy
docker-compose exec server npx tsx prisma/seed.ts
```

## Environment Variables

See `.env.example` for the complete list. Key variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | NextAuth session encryption |
| `NEXTAUTH_URL` | Yes | Frontend URL |
| `JWT_SECRET` | Yes | JWT token signing |
| `SMTP_HOST/USER/PASS` | No | Email sending |
| `TWILIO_SID/AUTH_TOKEN` | No | SMS sending |
| `VAPI_API_KEY` | No | AI voice screening |
| `SENDGRID_API_KEY` | No | Alternative email |

## License

MIT
