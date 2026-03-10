'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

type LoginMode = 'email' | 'eccode' | 'domainid';

const DEMO_ACCOUNTS = [
  { email: 'admin@sarvepratibha.com', password: 'admin123', ecCode: 'EC10001', domainId: 'admin.sp', role: 'IT Admin', color: 'bg-red-100 text-red-700 border-red-200' },
  { email: 'sectionhead@sarvepratibha.com', password: 'sectionhead123', ecCode: 'EC10002', domainId: 'sectionhead.sp', role: 'Section Head', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { email: 'manager@sarvepratibha.com', password: 'manager123', ecCode: 'EC10003', domainId: 'manager.sp', role: 'Manager', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { email: 'employee@sarvepratibha.com', password: 'employee123', ecCode: 'EC10004', domainId: 'employee.sp', role: 'Employee', color: 'bg-green-100 text-green-700 border-green-200' },
];

const MODE_CONFIG: Record<LoginMode, { label: string; placeholder: string; hint: string }> = {
  email: {
    label: 'Email Address',
    placeholder: 'name@sarvepratibha.com',
    hint: 'Use your registered corporate email',
  },
  eccode: {
    label: 'EC Code',
    placeholder: 'e.g., EC12345',
    hint: 'Your Employee Code (EC) from HR letter',
  },
  domainid: {
    label: 'Domain ID',
    placeholder: 'e.g., firstname.lastname',
    hint: 'Your Windows / SSO domain ID',
  },
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<LoginMode>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const cfg = MODE_CONFIG[mode];

  const handleModeChange = (newMode: LoginMode) => {
    setMode(newMode);
    setIdentifier('');
    setError('');
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Pass both identifier and mode so auth.ts can handle EC code / domain ID lookup
      const result = await signIn('credentials', {
        email: identifier,
        password,
        loginMode: mode,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Please check your ' + cfg.label.toLowerCase() + ' and password.');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  const fillDemo = (account: (typeof DEMO_ACCOUNTS)[0]) => {
    if (mode === 'email') setIdentifier(account.email);
    else if (mode === 'eccode') setIdentifier(account.ecCode);
    else setIdentifier(account.domainId);
    setPassword(account.password);
  };

  return (
    <Card className="shadow-2xl border-0 w-full">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-teal-600 rounded-xl flex items-center justify-center mb-2">
          <span className="text-white font-bold text-2xl">SP</span>
        </div>
        <CardTitle className="text-2xl font-bold">SarvePratibha</CardTitle>
        <CardDescription>Sign in to your HRMS account</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>
          )}

          {/* Login mode selector */}
          <div>
            <Label className="text-xs text-gray-500 mb-1.5 block">Sign in with</Label>
            <Tabs value={mode} onValueChange={(v) => handleModeChange(v as LoginMode)}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="email" className="text-xs">Email</TabsTrigger>
                <TabsTrigger value="eccode" className="text-xs">EC Code</TabsTrigger>
                <TabsTrigger value="domainid" className="text-xs">Domain ID</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Identifier input */}
          <div className="space-y-1.5">
            <Label htmlFor="identifier">{cfg.label}</Label>
            <Input
              id="identifier"
              type={mode === 'email' ? 'email' : 'text'}
              placeholder={cfg.placeholder}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoComplete={mode === 'email' ? 'email' : 'username'}
            />
            <p className="text-xs text-gray-400">{cfg.hint}</p>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs text-teal-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {/* EC Code / Domain ID info banner */}
          {mode !== 'email' && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-xs text-teal-800 space-y-1">
              {mode === 'eccode' ? (
                <>
                  <p className="font-medium">About EC Code</p>
                  <p>Your EC (Employee Code) is issued by HR during onboarding. It appears on your offer letter and ID card (e.g., EC12345).</p>
                </>
              ) : (
                <>
                  <p className="font-medium">About Domain ID</p>
                  <p>Your Domain ID is your Windows / Active Directory login username (e.g., firstname.lastname). Contact IT if you don&apos;t know yours.</p>
                </>
              )}
            </div>
          )}

          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => signIn('google', { callbackUrl })}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>
        </CardContent>
      </form>

      <CardFooter className="flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-teal-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>

        {/* Demo Accounts */}
        <div className="w-full">
          <div className="relative mb-3">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Demo Accounts</span>
            </div>
          </div>

          <div className="mb-2 flex items-center justify-center gap-2">
            {(['email', 'eccode', 'domainid'] as LoginMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleModeChange(m)}
                className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                  mode === m
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-teal-300'
                }`}
              >
                {m === 'email' ? 'Email' : m === 'eccode' ? 'EC Code' : 'Domain ID'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                className={`rounded-lg border p-2 text-left transition-colors hover:opacity-80 ${account.color}`}
                onClick={() => fillDemo(account)}
              >
                <p className="text-xs font-semibold">{account.role}</p>
                <p className="text-xs opacity-75 truncate">
                  {mode === 'email'
                    ? account.email
                    : mode === 'eccode'
                    ? account.ecCode
                    : account.domainId}
                </p>
              </button>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
