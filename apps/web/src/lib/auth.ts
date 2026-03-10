import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

interface DemoAccount {
  email: string;
  password: string;
  id: string;
  name: string;
  role: string;
  employeeId: string;
  ecCode: string;
  domainId: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'admin@sarvepratibha.com',
    password: 'admin123',
    id: 'demo-1',
    name: 'Admin User',
    role: 'IT_ADMIN',
    employeeId: 'EMP001',
    ecCode: 'EC10001',
    domainId: 'admin.sp',
  },
  {
    email: 'manager@sarvepratibha.com',
    password: 'manager123',
    id: 'demo-2',
    name: 'Manager User',
    role: 'MANAGER',
    employeeId: 'EMP002',
    ecCode: 'EC10003',
    domainId: 'manager.sp',
  },
  {
    email: 'sectionhead@sarvepratibha.com',
    password: 'sectionhead123',
    id: 'demo-3',
    name: 'Section Head',
    role: 'SECTION_HEAD',
    employeeId: 'EMP003',
    ecCode: 'EC10002',
    domainId: 'sectionhead.sp',
  },
  {
    email: 'employee@sarvepratibha.com',
    password: 'employee123',
    id: 'demo-4',
    name: 'Employee User',
    role: 'EMPLOYEE',
    employeeId: 'EMP004',
    ecCode: 'EC10004',
    domainId: 'employee.sp',
  },
];

/**
 * Resolve a demo account by email, EC code, or domain ID.
 * loginMode comes from the credentials payload set by the login form.
 */
function findDemoAccount(identifier: string, password: string, loginMode?: string): DemoAccount | null {
  const id = identifier.trim().toLowerCase();

  let account: DemoAccount | undefined;

  if (loginMode === 'eccode') {
    account = DEMO_ACCOUNTS.find(
      (a) => a.ecCode.toLowerCase() === id && a.password === password,
    );
  } else if (loginMode === 'domainid') {
    account = DEMO_ACCOUNTS.find(
      (a) => a.domainId.toLowerCase() === id && a.password === password,
    );
  } else {
    // Default: email login — also try EC code and domain ID as fallback
    account =
      DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === id && a.password === password) ??
      DEMO_ACCOUNTS.find((a) => a.ecCode.toLowerCase() === id && a.password === password) ??
      DEMO_ACCOUNTS.find((a) => a.domainId.toLowerCase() === id && a.password === password);
  }

  return account ?? null;
}

// In production, this would use Prisma client.
// For now, we define the auth options that connect to the Express API.
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email / EC Code / Domain ID', type: 'text' },
        password: { label: 'Password', type: 'password' },
        loginMode: { label: 'Login Mode', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Identifier and password are required');
        }

        // Demo account check — allows login without a backend server
        const demo = findDemoAccount(
          credentials.email,
          credentials.password,
          credentials.loginMode,
        );
        if (demo) {
          return {
            id: demo.id,
            email: demo.email,
            name: demo.name,
            role: demo.role,
            employeeId: demo.employeeId,
            ecCode: demo.ecCode,
            domainId: demo.domainId,
          };
        }

        try {
          const res = await fetch(`${process.env.API_URL || 'http://localhost:4000'}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              loginMode: credentials.loginMode ?? 'email',
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data.message || 'Invalid credentials');
          }

          return {
            id: data.data.user.id,
            email: data.data.user.email,
            name: data.data.user.name,
            role: data.data.user.role,
            image: data.data.user.image,
            employeeId: data.data.user.employeeId,
            ecCode: data.data.user.ecCode,
            domainId: data.data.user.domainId,
            accessToken: data.data.token,
          };
        } catch (error) {
          if (error instanceof Error) throw error;
          throw new Error('Authentication failed');
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
          }),
        ]
      : []),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.employeeId = (user as any).employeeId;
        token.ecCode = (user as any).ecCode;
        token.domainId = (user as any).domainId;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).employeeId = token.employeeId;
        (session.user as any).ecCode = token.ecCode;
        (session.user as any).domainId = token.domainId;
        (session.user as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
