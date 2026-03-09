# SarvePratibha (सर्वे प्रतिभा)

> **Enterprise HRMS** - All-in-one HR, Payroll, Recruitment, Performance & Employee Management Platform

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui |
| Backend | Node.js + Express.js + Prisma ORM |
| Database | PostgreSQL (Railway) + Redis |
| Auth | NextAuth.js (RBAC - 4 roles) |
| Email | Resend / SendGrid |
| SMS | Twilio / MSG91 |
| Storage | Cloudflare R2 / AWS S3 |
| Deploy | Vercel (frontend) + Railway (backend) |
| Real-time | Socket.io |

## Role-Based Access (4 Interfaces)

- **Employee** - Self-service portal
- **Manager (L1)** - Team oversight & approvals
- **Section Head (L2)** - Department control & analytics
- **IT Admin** - Full system administration

## Modules (30+)

### Core HR
1. Employee Management & Personal Details
2. Organization Directory & People Search
3. Buddy/Reporting Manager Allocation

### Leave & Attendance
4. Leave Management (Apply/Approve/Regularize)
5. Attendance Calendar (Punch In-Out, Weekly Hours)
6. Shift Change/Planning
7. Time Report - Team View

### Payroll & Finance
8. Compensation Details & Payslips
9. Investment Declaration (ITR - 80C/80D)
10. Tax Calculator (Old/New Regime)
11. Bank Details Management
12. Salary Deducted & Payback Dates

### Reimbursements
13. Create/Track Claims
14. Expense Report (Self/Team)
15. Eligibility Checker
16. Reimbursement Dashboard
17. Household Goods Relocation

### Benefits
18. Health & Wellness (Medibuddy)
19. Marriage/Maternity/Paternity Benefits
20. Vehicle & Mobile Services
21. Retail Gift Voucher
22. Loan & Advances
23. Educational Support
24. Retiral Benefits (PF Balance)
25. Coverage Claims (GHP/MMP)

### Self Services
26. R-Performance
27. Bonafide Letter Generation
28. Separation/Exit Management
29. ID Card Request
30. Vehicle Log Book
31. Visiting Card Request
32. Competency Assurance System
33. POA Management

### Corporate Services
34. Car Pool Management & Approvals
35. Conference Room Booking
36. Help Desk & JioDesk
37. Corporate Services Survey

### Security Services
38. Vehicle Access Pass
39. Visitor Management System
40. Gate Pass (Returnable/Non-Returnable Challans)

### Performance Management
41. Goal Setting (OKR/KRA)
42. Competency Evaluation
43. 360-Degree Feedback
44. Bell Curve Rating

### Travel & Guest House
45. Travel Plan & Request Creation
46. Trip Management (Upcoming/History)
47. Guest House Booking

### Employee Engagement
48. Rewards & Recognition
49. Survey Management
50. Social Connect
51. R-Volunteer

### Talent Management
52. Competency Toolkit
53. Career Aspirations
54. Talent Form (Manager View)

### Talent Acquisition (ATS)
55. Multi-Platform Sourcing (Naukri/LinkedIn/Indeed/Glassdoor)
56. Job Postings & Candidate Pipeline
57. Interview Scheduling & Assessment Sheets
58. Onboarding Workflow

### Compliance Management
59. IRCMS (Regulatory Compliance)
60. Company Policies & Documents
61. Statutory Compliance Tracking

### D&I (Diversity & Inclusion)
62. Leadership/Gallery/Program/Policies/Resources/Support
63. D&I Events & Important Days
64. R-Aadya Program

### Communication & Notifications
65. Live Announcements & Dynamic Banners
66. News & Updates Feed
67. Email + SMS + In-App + Push Notifications
68. HR Buddy (Query Management Chatbot)
69. Emergency Contacts & REFERS Helpline

### Dashboard Features
70. Greeting Banner with Avatar
71. Punch In-Out Widget
72. Actionables (Special Days)
73. Calendar (Monthly Attendance)
74. Birthdays & Work Anniversaries
75. Quick Links Panel

## Project Structure

```
SarvePratibha/
├── apps/
│   ├── web/                    # Next.js Frontend (Vercel)
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   ├── (employee)/
│   │   │   ├── (manager)/
│   │   │   ├── (section-head)/
│   │   │   └── (admin)/
│   │   ├── components/
│   │   └── lib/
│   └── server/                 # Express Backend (Railway)
│       ├── src/modules/
│       ├── prisma/
│       └── jobs/
├── packages/
│   ├── shared/
│   └── email-templates/
├── docker-compose.yml
├── turbo.json
└── package.json
```

## Development Phases

| Phase | Focus | Timeline |
|-------|-------|----------|
| 1 | Auth + RBAC + Dashboard | Week 1-2 |
| 2 | Leave + Attendance + Payroll | Week 3-4 |
| 3 | Reimbursements + Benefits + Loans | Week 5-6 |
| 4 | Performance + Talent + L&D | Week 7-8 |
| 5 | Recruitment ATS + Onboarding | Week 9-10 |
| 6 | Security + IT + Compliance | Week 11-12 |
| 7 | Engagement + Notifications | Week 13-14 |
| 8 | Testing + Polish + Deploy | Week 15-16 |

## Claude Code IDE Sessions

| Session | Branch | Modules |
|---------|--------|---------|
| 1 | feat/auth-rbac | Auth, RBAC, 4 role interfaces |
| 2 | feat/employee-core | Personal details, People, Org directory |
| 3 | feat/leave-attendance | Leave, attendance, calendar, shift |
| 4 | feat/payroll-finance | Payroll, reimbursements, loans, tax |
| 5 | feat/benefits-services | Benefits, self/corporate services |
| 6 | feat/performance-talent | Performance, talent, L&D |
| 7 | feat/recruitment-ats | ATS, multi-platform sourcing |
| 8 | feat/security-it | Security, IT services, compliance |
| 9 | feat/engagement-comms | Engagement, announcements, notifications |

## API Keys Required

- DATABASE_URL (PostgreSQL - Railway)
- NEXTAUTH_SECRET
- RESEND_API_KEY (Email)
- TWILIO_SID + AUTH_TOKEN (SMS)
- CLOUDFLARE_R2 credentials (Storage)
- RAPIDAPI_KEY (Job board APIs)

## License

MIT
