# SarvePratibha - Enterprise HRMS Platform

## Project Overview
SarvePratibha is a comprehensive Human Resource Management System (HRMS) inspired by PeopleFirst (Reliance). It covers the full employee lifecycle including recruitment, onboarding, attendance, leave, payroll, performance, and more.

## Architecture

### Monorepo Structure (Turborepo)
```
├── apps/
│   ├── web/          # Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui
│   └── server/       # Express.js + TypeScript + Prisma ORM
├── packages/
│   ├── shared/       # Shared types, constants, Zod validations
│   └── email-templates/  # React Email templates
├── turbo.json
├── docker-compose.yml   # PostgreSQL + Redis
└── package.json         # npm workspaces
```

### Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Lucide icons
- **Backend**: Express.js, TypeScript, Prisma ORM
- **Database**: PostgreSQL (via Docker)
- **Cache**: Redis (via Docker)
- **Auth**: NextAuth.js (Credentials + Google OAuth, JWT sessions)
- **Validation**: Zod (shared between frontend/backend)
- **Email**: React Email

## Commands
- `npm run dev` — Start all apps in dev mode (via Turborepo)
- `npm run build` — Build all apps
- `npm run db:generate` — Generate Prisma client
- `npm run db:push` — Push schema to database
- `npm run db:migrate` — Run migrations
- `npm run db:seed` — Seed the database

## Development Setup
1. `docker-compose up -d` — Start PostgreSQL + Redis
2. Copy `.env.example` to `.env` in root and apps/server and apps/web
3. `npm install`
4. `npm run db:push && npm run db:seed`
5. `npm run dev`

## Code Conventions

### File Naming
- **Components**: PascalCase (`GreetingBanner.tsx`) or kebab-case (`greeting-banner.tsx`)
- **Utilities/libs**: kebab-case (`auth-types.ts`, `error-handler.ts`)
- **API routes**: kebab-case directory names

### Component Patterns
- Use `'use client'` directive only when needed (state, effects, event handlers)
- Server components by default in App Router
- All UI built with shadcn/ui components from `@/components/ui/`
- Use `cn()` utility for conditional class merging
- Lucide React for icons (consistent with shadcn/ui)

### Styling
- Tailwind CSS with shadcn/ui CSS variables
- Primary color: teal-600 (`#0D9488`) — matches PeopleFirst branding
- Secondary color: blue-800 (`#1E40AF`)
- Always use responsive classes (mobile-first)
- Use `bg-gray-50` as page background
- Cards with `rounded-lg border shadow-sm`

### Authentication & RBAC
- 4 roles: `EMPLOYEE`, `MANAGER`, `SECTION_HEAD`, `IT_ADMIN`
- Role hierarchy: IT_ADMIN > SECTION_HEAD > MANAGER > EMPLOYEE
- Higher roles inherit all lower role permissions
- IT_ADMIN always has full access
- Use `authorize()` middleware for role-based route protection on the server
- Use Next.js middleware for client-side route protection
- JWT strategy for sessions (24hr expiry)

### Database (Prisma)
- All models use `cuid()` for IDs
- All models have `createdAt` and `updatedAt` timestamps
- Use `@@map("snake_case_table_name")` for all models
- Add `@@index()` on frequently queried fields
- Self-referential relationships for org hierarchy (Employee.managerId)

### API Patterns
- RESTful endpoints under `/api/`
- Standard response format: `{ success: boolean, data?: T, message?: string }`
- Paginated responses include `pagination: { page, limit, total, totalPages }`
- Express error handler middleware for consistent error responses
- Zod validation schemas shared via `@sarve-pratibha/shared`

### Git Conventions
- Branch naming: `feat/<feature>`, `fix/<bug>`, `chore/<task>`
- Commit messages: imperative mood ("Add auth middleware", "Fix leave calculation")

## Default Seed Credentials
- **IT Admin**: admin@sarvepratibha.com / Password@123
- **Section Head**: section.head@sarvepratibha.com / Password@123
- **Manager**: manager@sarvepratibha.com / Password@123
- **Employee**: employee@sarvepratibha.com / Password@123

## Key Design Decisions
1. **Monorepo with Turborepo** — Shared types ensure type safety across frontend/backend
2. **Prisma** — Type-safe ORM with excellent migration support
3. **shadcn/ui** — Copy-paste components, no vendor lock-in, fully customizable
4. **NextAuth.js** — Flexible auth with multiple providers, JWT for stateless sessions
5. **Role hierarchy** — Simple numeric levels enable inherited permissions without complex ACL tables
6. **Docker Compose** — Consistent dev environment for PostgreSQL and Redis
