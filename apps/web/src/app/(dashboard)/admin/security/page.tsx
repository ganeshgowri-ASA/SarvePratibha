'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { securityPolicySchema, type SecurityPolicyInput } from '@sarve-pratibha/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Save, Shield, Key, Lock, Globe } from 'lucide-react';
import { useEffect } from 'react';

export default function SecurityPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'security'],
    queryFn: () => api.get('/api/admin/security/policies'),
  });

  const form = useForm<SecurityPolicyInput>({
    resolver: zodResolver(securityPolicySchema),
  });

  useEffect(() => {
    if (data?.data) {
      const p = data.data as any;
      form.reset({
        minPasswordLength: p.minPasswordLength,
        requireUppercase: p.requireUppercase,
        requireLowercase: p.requireLowercase,
        requireNumbers: p.requireNumbers,
        requireSpecialChars: p.requireSpecialChars,
        passwordExpiryDays: p.passwordExpiryDays,
        maxLoginAttempts: p.maxLoginAttempts,
        lockoutDurationMins: p.lockoutDurationMins,
        sessionTimeoutMins: p.sessionTimeoutMins,
        enable2FA: p.enable2FA,
        ipWhitelist: p.ipWhitelist || '',
        enforceIPWhitelist: p.enforceIPWhitelist,
      });
    }
  }, [data, form]);

  const mutation = useMutation({
    mutationFn: (values: SecurityPolicyInput) => api.put('/api/admin/security/policies', values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'security'] }),
  });

  if (isLoading) return <div className="text-center py-8 text-gray-500">Loading security settings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
          <p className="text-gray-500 mt-1">Configure password policies, 2FA, and session management</p>
        </div>
        <Button
          onClick={form.handleSubmit((v) => mutation.mutate(v))}
          className="bg-teal-600 hover:bg-teal-700"
          disabled={mutation.isPending}
        >
          <Save className="h-4 w-4 mr-2" /> {mutation.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {mutation.isSuccess && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">Security policies updated successfully</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Policy */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-teal-600" />
              <CardTitle>Password Policy</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Minimum Password Length</Label>
              <Input type="number" {...form.register('minPasswordLength', { valueAsNumber: true })} min={6} max={32} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Require Uppercase</Label>
              <Switch checked={form.watch('requireUppercase')} onCheckedChange={(v) => form.setValue('requireUppercase', v)} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Require Lowercase</Label>
              <Switch checked={form.watch('requireLowercase')} onCheckedChange={(v) => form.setValue('requireLowercase', v)} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Require Numbers</Label>
              <Switch checked={form.watch('requireNumbers')} onCheckedChange={(v) => form.setValue('requireNumbers', v)} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Require Special Characters</Label>
              <Switch checked={form.watch('requireSpecialChars')} onCheckedChange={(v) => form.setValue('requireSpecialChars', v)} />
            </div>
            <div className="space-y-2">
              <Label>Password Expiry (days, 0 = never)</Label>
              <Input type="number" {...form.register('passwordExpiryDays', { valueAsNumber: true })} min={0} max={365} />
            </div>
          </CardContent>
        </Card>

        {/* Login Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-teal-600" />
              <CardTitle>Login Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Max Login Attempts</Label>
              <Input type="number" {...form.register('maxLoginAttempts', { valueAsNumber: true })} min={1} max={20} />
            </div>
            <div className="space-y-2">
              <Label>Lockout Duration (minutes)</Label>
              <Input type="number" {...form.register('lockoutDurationMins', { valueAsNumber: true })} min={1} max={1440} />
            </div>
            <div className="space-y-2">
              <Label>Session Timeout (minutes)</Label>
              <Input type="number" {...form.register('sessionTimeoutMins', { valueAsNumber: true })} min={5} max={1440} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-xs text-gray-500 mt-1">Require 2FA for all users</p>
              </div>
              <Switch checked={form.watch('enable2FA')} onCheckedChange={(v) => form.setValue('enable2FA', v)} />
            </div>
          </CardContent>
        </Card>

        {/* IP Whitelist */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-teal-600" />
              <CardTitle>IP Whitelist</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enforce IP Whitelist</Label>
                <p className="text-xs text-gray-500 mt-1">Only allow access from whitelisted IPs</p>
              </div>
              <Switch checked={form.watch('enforceIPWhitelist')} onCheckedChange={(v) => form.setValue('enforceIPWhitelist', v)} />
            </div>
            <div className="space-y-2">
              <Label>Whitelisted IPs (one per line)</Label>
              <Textarea {...form.register('ipWhitelist')} placeholder="192.168.1.0/24&#10;10.0.0.1" rows={4} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
