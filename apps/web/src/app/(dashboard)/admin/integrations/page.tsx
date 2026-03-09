'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plug, Mail, MessageSquare, Calendar, CreditCard, Cloud, Database, Globe } from 'lucide-react';
import type { IntegrationItem } from '@sarve-pratibha/shared';

const INTEGRATION_ICONS: Record<string, any> = {
  email: Mail,
  slack: MessageSquare,
  calendar: Calendar,
  payment: CreditCard,
  cloud: Cloud,
  database: Database,
  default: Globe,
};

// Predefined integrations to show even if none exist in DB
const DEFAULT_INTEGRATIONS = [
  { name: 'Google Workspace', provider: 'google', description: 'Google OAuth, Calendar, and Drive integration', icon: 'calendar' },
  { name: 'Slack', provider: 'slack', description: 'Team notifications and alerts', icon: 'slack' },
  { name: 'SMTP Email', provider: 'smtp', description: 'Email delivery for notifications', icon: 'email' },
  { name: 'Payment Gateway', provider: 'razorpay', description: 'Salary disbursement and reimbursements', icon: 'payment' },
  { name: 'Cloud Backup', provider: 'aws-s3', description: 'Automated cloud backup storage', icon: 'cloud' },
  { name: 'Biometric System', provider: 'biometric', description: 'Attendance hardware integration', icon: 'database' },
];

export default function IntegrationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'integrations'],
    queryFn: () => api.get('/api/admin/integrations'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isEnabled }: { id: string; isEnabled: boolean }) =>
      api.put(`/api/admin/integrations/${id}`, { isEnabled }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'integrations'] }),
  });

  const integrations: IntegrationItem[] = data?.data || [];

  // Merge DB integrations with defaults
  const displayIntegrations = DEFAULT_INTEGRATIONS.map((def) => {
    const existing = integrations.find((i) => i.provider === def.provider);
    return existing
      ? { ...existing, icon: def.icon }
      : { id: '', name: def.name, provider: def.provider, description: def.description, isEnabled: false, icon: def.icon };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-500 mt-1">Manage third-party service connections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <Card className="col-span-full"><CardContent className="py-8 text-center text-gray-500">Loading...</CardContent></Card>
        ) : (
          displayIntegrations.map((integration: any) => {
            const IconComp = INTEGRATION_ICONS[integration.icon] || INTEGRATION_ICONS.default;
            return (
              <Card key={integration.provider}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-teal-50 rounded-lg">
                        <IconComp className="h-6 w-6 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{integration.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{integration.description}</p>
                        {integration.lastSyncAt && (
                          <p className="text-xs text-gray-400 mt-2">
                            Last sync: {new Date(integration.lastSyncAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {integration.id ? (
                        <>
                          <Switch
                            checked={integration.isEnabled}
                            onCheckedChange={(v) => toggleMutation.mutate({ id: integration.id, isEnabled: v })}
                          />
                          <Badge className={integration.isEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {integration.isEnabled ? 'Active' : 'Inactive'}
                          </Badge>
                        </>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-500">Not Configured</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
