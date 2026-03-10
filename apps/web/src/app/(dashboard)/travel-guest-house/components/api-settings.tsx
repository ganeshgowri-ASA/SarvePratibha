'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Settings, Key, Webhook, CheckCircle, XCircle, RefreshCw, Activity, AlertTriangle, BarChart3, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApiConfig {
  id: string;
  provider: string;
  category: string;
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
  sdkVersion: string;
  isActive: boolean;
  testStatus: 'SUCCESS' | 'FAILED' | 'PENDING' | null;
  callsToday: number;
  callsThisMonth: number;
  rateLimit: number;
  lastTested?: string;
}

const INITIAL_CONFIGS: ApiConfig[] = [
  {
    id: '1', provider: 'IRCTC', category: 'Rail',
    apiKey: 'irctc_live_••••••••3f9a', secretKey: '••••••••••••••••',
    webhookUrl: 'https://api.sarvepratibha.com/webhooks/irctc',
    sdkVersion: 'v2.4.1', isActive: true, testStatus: 'SUCCESS',
    callsToday: 142, callsThisMonth: 3840, rateLimit: 500,
    lastTested: '10 Mar 2026, 09:14 AM',
  },
  {
    id: '2', provider: 'MakeMyTrip', category: 'Flights & Hotels',
    apiKey: 'mmt_prod_••••••••a12c', secretKey: '••••••••••••••••',
    webhookUrl: 'https://api.sarvepratibha.com/webhooks/mmt',
    sdkVersion: 'v3.1.0', isActive: true, testStatus: 'SUCCESS',
    callsToday: 89, callsThisMonth: 2210, rateLimit: 1000,
    lastTested: '10 Mar 2026, 10:00 AM',
  },
  {
    id: '3', provider: 'Paytm Travel', category: 'Flights & Buses',
    apiKey: 'paytm_travel_••••••7b2d', secretKey: '••••••••••••••••',
    webhookUrl: 'https://api.sarvepratibha.com/webhooks/paytm-travel',
    sdkVersion: 'v1.8.3', isActive: true, testStatus: 'FAILED',
    callsToday: 0, callsThisMonth: 430, rateLimit: 300,
    lastTested: '9 Mar 2026, 03:22 PM',
  },
  {
    id: '4', provider: 'Ola', category: 'Cab',
    apiKey: 'ola_corp_••••••••c44e', secretKey: '••••••••••••••••',
    webhookUrl: 'https://api.sarvepratibha.com/webhooks/ola',
    sdkVersion: 'v2.2.0', isActive: true, testStatus: 'SUCCESS',
    callsToday: 56, callsThisMonth: 1680, rateLimit: 200,
    lastTested: '10 Mar 2026, 08:45 AM',
  },
  {
    id: '5', provider: 'Uber', category: 'Cab',
    apiKey: 'uber_biz_••••••••d77f', secretKey: '••••••••••••••••',
    webhookUrl: 'https://api.sarvepratibha.com/webhooks/uber',
    sdkVersion: 'v3.0.1', isActive: true, testStatus: 'SUCCESS',
    callsToday: 44, callsThisMonth: 1230, rateLimit: 200,
    lastTested: '10 Mar 2026, 08:50 AM',
  },
  {
    id: '6', provider: 'Rapido', category: 'Cab',
    apiKey: 'rapido_b2b_••••••9e1b', secretKey: '••••••••••••••••',
    webhookUrl: 'https://api.sarvepratibha.com/webhooks/rapido',
    sdkVersion: 'v1.5.0', isActive: false, testStatus: null,
    callsToday: 0, callsThisMonth: 0, rateLimit: 100,
  },
  {
    id: '7', provider: 'Meru', category: 'Cab',
    apiKey: 'meru_corp_••••••4a2c', secretKey: '••••••••••••••••',
    webhookUrl: 'https://api.sarvepratibha.com/webhooks/meru',
    sdkVersion: 'v2.0.0', isActive: true, testStatus: 'PENDING',
    callsToday: 12, callsThisMonth: 320, rateLimit: 100,
    lastTested: '8 Mar 2026, 11:00 AM',
  },
  {
    id: '8', provider: 'OhmCabs', category: 'Cab',
    apiKey: 'ohm_ev_••••••••6f3d', secretKey: '••••••••••••••••',
    webhookUrl: 'https://api.sarvepratibha.com/webhooks/ohmcabs',
    sdkVersion: 'v1.2.0', isActive: true, testStatus: 'SUCCESS',
    callsToday: 28, callsThisMonth: 680, rateLimit: 100,
    lastTested: '10 Mar 2026, 07:30 AM',
  },
];

const SDK_VERSIONS: Record<string, string[]> = {
  IRCTC: ['v2.4.1', 'v2.3.0', 'v2.2.5'],
  MakeMyTrip: ['v3.1.0', 'v3.0.2', 'v2.9.1'],
  'Paytm Travel': ['v1.8.3', 'v1.7.0', 'v1.6.2'],
  Ola: ['v2.2.0', 'v2.1.0', 'v2.0.3'],
  Uber: ['v3.0.1', 'v2.9.0', 'v2.8.5'],
  Rapido: ['v1.5.0', 'v1.4.1', 'v1.3.0'],
  Meru: ['v2.0.0', 'v1.9.2', 'v1.8.0'],
  OhmCabs: ['v1.2.0', 'v1.1.0', 'v1.0.5'],
};

const CATEGORY_COLORS: Record<string, string> = {
  Rail: 'bg-blue-100 text-blue-700',
  'Flights & Hotels': 'bg-purple-100 text-purple-700',
  'Flights & Buses': 'bg-orange-100 text-orange-700',
  Cab: 'bg-teal-100 text-teal-700',
};

export function ApiSettings() {
  const [configs, setConfigs] = useState<ApiConfig[]>(INITIAL_CONFIGS);
  const [testing, setTesting] = useState<string | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<ApiConfig | null>(null);
  const [editForm, setEditForm] = useState<Partial<ApiConfig>>({});

  const toggleActive = (id: string) => {
    setConfigs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleTest = (id: string) => {
    setTesting(id);
    setTimeout(() => {
      setConfigs((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, testStatus: Math.random() > 0.2 ? 'SUCCESS' : 'FAILED', lastTested: 'Just now' }
            : c
        )
      );
      setTesting(null);
    }, 1800);
  };

  const openEdit = (config: ApiConfig) => {
    setSelectedConfig(config);
    setEditForm(config);
  };

  const totalCallsToday = configs.reduce((s, c) => s + c.callsToday, 0);
  const totalCallsMonth = configs.reduce((s, c) => s + c.callsThisMonth, 0);
  const activeCount = configs.filter((c) => c.isActive).length;
  const failedCount = configs.filter((c) => c.testStatus === 'FAILED').length;

  return (
    <div className="space-y-4">
      {/* Stats overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Active Integrations', value: activeCount, icon: Zap, color: 'text-green-600 bg-green-50' },
          { label: 'API Calls Today', value: totalCallsToday, icon: Activity, color: 'text-blue-600 bg-blue-50' },
          { label: 'Calls This Month', value: totalCallsMonth.toLocaleString(), icon: BarChart3, color: 'text-purple-600 bg-purple-50' },
          { label: 'Failed Tests', value: failedCount, icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* API Configuration Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings size={18} className="text-teal-600" />
            API Integration Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>SDK Version</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead className="text-center">Usage (Today)</TableHead>
                  <TableHead className="text-center">Rate Limit</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Active</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configs.map((config) => {
                  const usagePct = Math.round((config.callsToday / config.rateLimit) * 100);
                  return (
                    <TableRow key={config.id} className={!config.isActive ? 'opacity-50' : ''}>
                      <TableCell>
                        <p className="text-sm font-medium text-gray-900">{config.provider}</p>
                        {config.lastTested && (
                          <p className="text-xs text-gray-400">Tested: {config.lastTested}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${CATEGORY_COLORS[config.category] || 'bg-gray-100'}`}>
                          {config.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{config.sdkVersion}</code>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs text-gray-600">{config.apiKey}</code>
                      </TableCell>
                      <TableCell>
                        <div className="w-24 mx-auto">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{config.callsToday}</span>
                            <span>{config.rateLimit}</span>
                          </div>
                          <Progress
                            value={usagePct}
                            className={cn('h-1.5', usagePct > 80 ? '[&>div]:bg-red-500' : usagePct > 50 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-teal-500')}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-600">
                        {config.rateLimit}/day
                      </TableCell>
                      <TableCell className="text-center">
                        {config.testStatus === 'SUCCESS' && (
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            <CheckCircle size={10} className="mr-1" />OK
                          </Badge>
                        )}
                        {config.testStatus === 'FAILED' && (
                          <Badge className="bg-red-100 text-red-700 text-xs">
                            <XCircle size={10} className="mr-1" />Error
                          </Badge>
                        )}
                        {config.testStatus === 'PENDING' && (
                          <Badge className="bg-yellow-100 text-yellow-700 text-xs">Pending</Badge>
                        )}
                        {!config.testStatus && (
                          <Badge variant="outline" className="text-xs text-gray-400">—</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={config.isActive}
                          onCheckedChange={() => toggleActive(config.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTest(config.id)}
                            disabled={testing === config.id || !config.isActive}
                          >
                            {testing === config.id ? (
                              <RefreshCw size={12} className="animate-spin" />
                            ) : (
                              <Zap size={12} />
                            )}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => openEdit(config)}>
                            <Key size={12} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit API Config Panel */}
      {selectedConfig && (
        <Card className="border-teal-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Key size={18} className="text-teal-600" />
                Configure: {selectedConfig.provider}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedConfig(null)}>✕</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">API Key</Label>
                <div className="relative">
                  <Key size={14} className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    className="pl-8 font-mono text-sm"
                    value={editForm.apiKey || ''}
                    onChange={(e) => setEditForm({ ...editForm, apiKey: e.target.value })}
                    placeholder="Enter API key"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Secret Key</Label>
                <Input
                  type="password"
                  className="font-mono text-sm"
                  value={editForm.secretKey || ''}
                  onChange={(e) => setEditForm({ ...editForm, secretKey: e.target.value })}
                  placeholder="Enter secret key"
                />
              </div>
              <div>
                <Label className="text-xs">Webhook URL</Label>
                <div className="relative">
                  <Webhook size={14} className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    className="pl-8 text-sm"
                    value={editForm.webhookUrl || ''}
                    onChange={(e) => setEditForm({ ...editForm, webhookUrl: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">SDK Version</Label>
                <Select
                  value={editForm.sdkVersion}
                  onValueChange={(v) => setEditForm({ ...editForm, sdkVersion: v })}
                >
                  <SelectTrigger className="font-mono text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(SDK_VERSIONS[selectedConfig.provider] || [selectedConfig.sdkVersion]).map((v) => (
                      <SelectItem key={v} value={v} className="font-mono">
                        {v} {v === SDK_VERSIONS[selectedConfig.provider]?.[0] && '(latest)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs">Custom Headers (JSON)</Label>
              <Textarea
                className="font-mono text-xs"
                rows={3}
                defaultValue={`{\n  "X-Corp-ID": "SARVE_001",\n  "X-Environment": "production"\n}`}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => handleTest(selectedConfig.id)}
                disabled={testing === selectedConfig.id}
              >
                {testing === selectedConfig.id ? (
                  <><RefreshCw size={14} className="mr-2 animate-spin" />Testing...</>
                ) : (
                  <><Zap size={14} className="mr-2" />Test Connection</>
                )}
              </Button>
              <Button
                className="bg-teal-600 hover:bg-teal-700"
                onClick={() => {
                  setConfigs((prev) =>
                    prev.map((c) => (c.id === selectedConfig.id ? { ...c, ...editForm } : c))
                  );
                  setSelectedConfig(null);
                }}
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Usage Dashboard */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 size={16} className="text-teal-600" />
            API Usage Dashboard — Current Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {configs
              .filter((c) => c.isActive && c.callsThisMonth > 0)
              .sort((a, b) => b.callsThisMonth - a.callsThisMonth)
              .map((config) => {
                const monthlyLimit = config.rateLimit * 30;
                const pct = Math.round((config.callsThisMonth / monthlyLimit) * 100);
                return (
                  <div key={config.id} className="flex items-center gap-3">
                    <div className="w-24 text-xs text-gray-600 truncate font-medium flex-shrink-0">
                      {config.provider}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={pct}
                          className={cn(
                            'h-2 flex-1',
                            pct > 80 ? '[&>div]:bg-red-500' :
                            pct > 60 ? '[&>div]:bg-yellow-500' :
                            '[&>div]:bg-teal-500'
                          )}
                        />
                        <span className="text-xs text-gray-500 w-16 text-right flex-shrink-0">
                          {config.callsThisMonth.toLocaleString()} / {monthlyLimit.toLocaleString()}
                        </span>
                        <span className={cn(
                          'text-xs font-medium w-8 text-right flex-shrink-0',
                          pct > 80 ? 'text-red-600' : pct > 60 ? 'text-yellow-600' : 'text-teal-600'
                        )}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
