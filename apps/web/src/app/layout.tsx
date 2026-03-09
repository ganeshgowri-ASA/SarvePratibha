import type { Metadata } from 'next';
import '@/styles/globals.css';
import { SessionProvider } from '@/components/auth/session-provider';
import { QueryProvider } from '@/components/providers/query-provider';

export const metadata: Metadata = {
  title: 'SarvePratibha - HRMS Portal',
  description: 'Enterprise Human Resource Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SessionProvider>
          <QueryProvider>{children}</QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
