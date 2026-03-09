import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { UserRole } from '@sarve-pratibha/shared';

const ROLE_HIERARCHY: Record<UserRole, number> = {
  EMPLOYEE: 0,
  MANAGER: 1,
  SECTION_HEAD: 2,
  IT_ADMIN: 3,
};

// Route-to-minimum-role mapping
const PROTECTED_ROUTES: Record<string, UserRole> = {
  '/people': 'MANAGER',
  '/talent': 'MANAGER',
  '/ai-screening': 'MANAGER',
  '/admin': 'IT_ADMIN',
};

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const userRole = token.role as UserRole;
    const userLevel = ROLE_HIERARCHY[userRole] ?? 0;

    // Check route-level authorization
    for (const [route, minRole] of Object.entries(PROTECTED_ROUTES)) {
      if (pathname.startsWith(route)) {
        const requiredLevel = ROLE_HIERARCHY[minRole];
        if (userLevel < requiredLevel && userRole !== 'IT_ADMIN') {
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/people/:path*',
    '/personal-details/:path*',
    '/leave-attendance/:path*',
    '/payroll/:path*',
    '/reimbursements/:path*',
    '/benefits/:path*',
    '/self-services/:path*',
    '/corporate-services/:path*',
    '/security-services/:path*',
    '/performance/:path*',
    '/travel/:path*',
    '/engagement/:path*',
    '/talent/:path*',
    '/ai-screening/:path*',
    '/compliance/:path*',
    '/admin/:path*',
  ],
};
