import { type UserRole } from '@sarve-pratibha/shared';
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role: UserRole;
      employeeId?: string;
      accessToken?: string;
    };
  }

  interface User {
    role: UserRole;
    employeeId?: string;
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
    employeeId?: string;
    accessToken?: string;
  }
}
