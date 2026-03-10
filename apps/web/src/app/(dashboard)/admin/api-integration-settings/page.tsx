'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Train,
  Car,
  Hotel,
  Plane,
  Server,
  Key,
  Terminal,
  ShieldCheck,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
} from 'lucide-react';

interface ApiProvider {
  id: string;
  name: string;
  label: string;
  description: string;
  fields: ApiField[];
}

interface ApiField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'select';
  placeholder?: string;
  options?: string[];
}

const TRAVEL_PROVIDERS: ApiProvider[] = [
  {
    id: 'irctc',
    name: 'IRCTC',
    label: 'IRCTC (Indian Railways)',
    description: 'Train booking via Indian Railway Catering and Tourism Corporation API',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'irctc_live_...' },
      { key: 'apiSecret', label: 'API Secret', type: 'password', placeholder: 'sk_...' },
      { key: 'sdkVersion', label: 'SDK Version', type: 'text', placeholder: 'v2.1.0' },
      { key: 'environment', label: 'Environment', type: 'select', options: ['sandbox', 'production'] },
    ],
  },
  {
    id: 'makemytrip',
    name: 'MakeMyTrip',
    label: 'MakeMyTrip (Flights & Hotels)',
    description: 'Flight and hotel booking via MakeMyTrip B2B API',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'mmt_live_...' },
      { key: 'apiSecret', label: 'API Secret', type: 'password', placeholder: 'sk_...' },
      { key: 'sdkVersion', label: 'SDK Version', type: 'text', placeholder: 'v3.0.0' },
      { key: 'partnerId', label: 'Partner ID', type: 'text', placeholder: 'CORP_...' },
      { key: 'environment', label: 'Environment', type: 'select', options: ['sandbox', 'production'] },
    ],
  },
  {
    id: 'paytm',
    name: 'Paytm',
    label: 'Paytm Travel (Flights & Hotels)',
    description: 'Flight and hotel booking via Paytm Travel API',
    fields: [
      { key: 'merchantId', label: 'Merchant ID', type: 'text', placeholder: 'CORPXXX...' },
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'paytm_live_...' },
      { key: 'apiSecret', label: 'API Secret', type: 'password', placeholder: 'sk_...' },
      { key: 'sdkVersion', label: 'SDK Version', type: 'text', placeholder: 'v1.5.0' },
      { key: 'environment', label: 'Environment', type: 'select', options: ['sandbox', 'production'] },
    ],
  },
  {
    id: 'confirmtkt',
    name: 'ConfirmTkt',
    label: 'ConfirmTkt (Train Alternate)',
    description: 'Alternate train booking with Tatkal and waitlist confirmation',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'ctkt_...' },
      { key: 'apiSecret', label: 'API Secret', type: 'password', placeholder: 'sk_...' },
      { key: 'sdkVersion', label: 'SDK Version', type: 'text', placeholder: 'v1.0.0' },
      { key: 'environment', label: 'Environment', type: 'select', options: ['sandbox', 'production'] },
    ],
  },
];

const CAB_PROVIDERS: ApiProvider[] = [
  {
    id: 'ola',
    name: 'Ola',
    label: 'Ola Cabs',
    description: 'Cab booking via Ola Corporate API',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'ola_live_...' },
      { key: 'clientId', label: 'Client ID', type: 'text', placeholder: 'corp_...' },
      { key: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'cs_...' },
      { key: 'sdkVersion', label: 'SDK Version', type: 'text', placeholder: 'v2.0.0' },
      { key: 'environment', label: 'Environment', type: 'select', options: ['sandbox', 'production'] },
    ],
  },
  {
    id: 'uber',
    name: 'Uber',
    label: 'Uber Business',
    description: 'Cab booking via Uber for Business API',
    fields: [
      { key: 'apiKey', label: 'Server Token', type: 'password', placeholder: 'uber_live_...' },
      { key: 'clientId', label: 'Client ID', type: 'text', placeholder: 'cid_...' },
      { key: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'cs_...' },
      { key: 'sdkVersion', label: 'SDK Version', type: 'text', placeholder: 'v1.3.0' },
      { key: 'environment', label: 'Environment', type: 'select', options: ['sandbox', 'production'] },
    ],
  },
  {
    id: 'rapido',
    name: 'Rapido',
    label: 'Rapido Corporate',
    description: 'Bike taxi and cab booking via Rapido Corporate API',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'rpd_live_...' },
      { key: 'apiSecret', label: 'API Secret', type: 'password', placeholder: 'sk_...' },
      { key: 'sdkVersion', label: 'SDK Version', type: 'text', placeholder: 'v1.0.0' },
      { key: 'environment', label: 'Environment', type: 'select', options: ['sandbox', 'production'] },
    ],
  },
];

const SERVER_CONFIGS: ApiProvider[] = [
  {
    id: 'mcp-server',
    name: 'MCP Server',
    label: 'MCP Server Configuration',
    description: 'Model Context Protocol server for AI-powered travel and booking assistance',
    fields: [
      { key: 'host', label: 'Host', type: 'text', placeholder: 'mcp.internal.sarvepratibha.com' },
      { key: 'port', label: 'Port', type: 'text', placeholder: '8080' },
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'mcp_sk_...' },
      { key: 'protocol', label: 'Protocol', type: 'select', options: ['https', 'http', 'grpc'] },
      { key: 'timeout', label: 'Timeout (ms)', type: 'text', placeholder: '30000' },
    ],
  },
  {
    id: 'ssh-server',
    name: 'SSH Server',
    label: 'SSH Server Settings',
    description: 'SSH tunnel configuration for secure API gateway access',
    fields: [
      { key: 'host', label: 'SSH Host', type: 'text', placeholder: 'bastion.internal.sarvepratibha.com' },
      { key: 'port', label: 'SSH Port', type: 'text', placeholder: '22' },
      { key: 'user', label: 'SSH User', type: 'text', placeholder: 'sarvepratibha-svc' },
      { key: 'privateKey', label: 'Private Key (PEM)', type: 'password', placeholder: '-----BEGIN RSA PRIVATE KEY-----' },
      { key: 'knownHostsFingerprint', label: 'Known Host Fingerprint', type: 'text', placeholder: 'SHA256:...' },
    ],
  },
];

function ProviderConfigCard({ provider }: { provider: ApiProvider }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});
  const [enabled, setEnabled] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In production this would call an API endpoint
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{provider.label}</CardTitle>
            <CardDescription className="mt-1">{provider.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor={`enable-${provider.id}`} className="text-sm text-gray-500">
              {enabled ? 'Enabled' : 'Disabled'}
            </Label>
            <Switch
              id={`enable-${provider.id}`}
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {provider.fields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <Label htmlFor={`${provider.id}-${field.key}`} className="text-sm font-medium">
                {field.label}
              </Label>
              {field.type === 'select' ? (
                <select
                  id={`${provider.id}-${field.key}`}
                  value={values[field.key] || ''}
                  onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Select...</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="relative">
                  <Input
                    id={`${provider.id}-${field.key}`}
                    type={field.type === 'password' && !showSecret[field.key] ? 'password' : 'text'}
                    placeholder={field.placeholder}
                    value={values[field.key] || ''}
                    onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                    className={field.type === 'password' ? 'pr-9' : ''}
                  />
                  {field.type === 'password' && (
                    <button
                      type="button"
                      onClick={() => setShowSecret((s) => ({ ...s, [field.key]: !s[field.key] }))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={showSecret[field.key] ? 'Hide' : 'Show'}
                    >
                      {showSecret[field.key] ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
              <CheckCircle size={14} />
              Saved!
            </span>
          )}
          <Button size="sm" onClick={handleSave} disabled={!enabled}>
            <Save size={14} className="mr-1.5" />
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ApiIntegrationSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-teal-50 rounded-lg">
          <Key className="h-6 w-6 text-teal-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Integration Settings</h1>
          <p className="text-gray-500 mt-0.5">
            Configure API keys, SDK versions, and server settings for travel and transport providers
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline" className="gap-1.5">
          <ShieldCheck size={12} className="text-teal-600" />
          All secrets are encrypted at rest
        </Badge>
        <Badge variant="outline" className="gap-1.5">
          <Server size={12} className="text-blue-600" />
          Changes take effect immediately
        </Badge>
      </div>

      <Tabs defaultValue="travel">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
          <TabsTrigger value="travel" className="gap-2">
            <Train size={14} />
            Travel Providers
          </TabsTrigger>
          <TabsTrigger value="cab" className="gap-2">
            <Car size={14} />
            Cab Providers
          </TabsTrigger>
          <TabsTrigger value="servers" className="gap-2">
            <Server size={14} />
            Server Config
          </TabsTrigger>
        </TabsList>

        <TabsContent value="travel" className="mt-6 space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Plane size={15} className="text-teal-600" />
            <span>Configure train, flight, and hotel booking provider APIs</span>
          </div>
          {TRAVEL_PROVIDERS.map((provider) => (
            <ProviderConfigCard key={provider.id} provider={provider} />
          ))}
        </TabsContent>

        <TabsContent value="cab" className="mt-6 space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Car size={15} className="text-teal-600" />
            <span>Configure cab booking provider APIs (Ola, Uber, Rapido)</span>
          </div>
          {CAB_PROVIDERS.map((provider) => (
            <ProviderConfigCard key={provider.id} provider={provider} />
          ))}
        </TabsContent>

        <TabsContent value="servers" className="mt-6 space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Terminal size={15} className="text-teal-600" />
            <span>Configure MCP server and SSH tunnel settings for secure API gateway access</span>
          </div>
          {SERVER_CONFIGS.map((provider) => (
            <ProviderConfigCard key={provider.id} provider={provider} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
