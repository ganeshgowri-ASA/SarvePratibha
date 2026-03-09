import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const DEMO_ACCOUNTS = [
  { email: 'admin@sarvepratibha.com', password: 'admin123', id: 'demo-1', name: 'Admin User', role: 'IT_ADMIN', employeeId: 'EMP001' },
  { email: 'manager@sarvepratibha.com', password: 'manager123', id: 'demo-2', name: 'Manager User', role: 'MANAGER', employeeId: 'EMP002' },
  { email: 'sectionhead@sarvepratibha.com', password: 'sectionhead123', id: 'demo-3', name: 'Section Head', role: 'SECTION_HEAD', employeeId: 'EMP003' },
  { email: 'employee@sarvepratibha.com', password: 'employee123', id: 'demo-4', name: 'Employee User', role: 'EMPLOYEE', employeeId: 'EMP004' },
];

// In production, this would use Prisma client.
// For now, we define the auth options that connect to the Express API.
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        // Demo account check — allows login without a backend server
        const demo = DEMO_ACCOUNTS.find(
          (a) => a.email === credentials.email && a.password === credentials.password,
        );
        if (demo) {
          return {
            id: demo.id,
            email: demo.email,
            name: demo.name,
            role: demo.role,
            employeeId: demo.employeeId,
          };
        }

        try {
          const res = await fetch(`${process.env.API_URL || 'http://localhost:4000'}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
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
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).employeeId = token.employeeId;
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
