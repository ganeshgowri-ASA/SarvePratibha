'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Send,
  Users,
  FileText,
  BarChart3,
  Mail,
  MessageSquare,
  BellRing,
  Monitor,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { apiClient } from '@/lib/api';
import type { UserRole } from '@sarve-pratibha/shared';

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'EMPLOYEE', label: 'Employee' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'SECTION_HEAD', label: 'Section Head' },
  { value: 'IT_ADMIN', label: 'IT Admin' },
];

const CATEGORIES = [
  { value: 'GENERAL', label: 'General' },
  { value: 'LEAVE', label: 'Leave' },
  { value: 'ATTENDANCE', label: 'Attendance' },
  { value: 'PAYROLL', label: 'Payroll' },
  { value: 'PERFORMANCE', label: 'Performance' },
  { value: 'RECRUITMENT', label: 'Recruitment' },
  { value: 'SYSTEM', label: 'System' },
];

const TYPES = [
  { value: 'INFO', label: 'Info' },
  { value: 'WARNING', label: 'Warning' },
  { value: 'ACTION_REQUIRED', label: 'Action Required' },
  { value: 'APPROVAL', label: 'Approval' },
  { value: 'SYSTEM', label: 'System' },
];

export default function AdminNotificationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const token = (session?.user as any)?.accessToken;

  // Single notification state
  const [singleForm, setSingleForm] = useState({
    userId: '',
    title: '',
    message: '',
    type: 'INFO',
    category: 'GENERAL',
    link: '',
  });
  const [singleSending, setSingleSending] = useState(false);

  // Bulk notification state
  const [bulkForm, setBulkForm] = useState({
    title: '',
    message: '',
    type: 'INFO',
    category: 'GENERAL',
    targetRoles: [] as string[],
    channels: { inApp: true, email: false, sms: false, push: false },
  });
  const [bulkSending, setBulkSending] = useState(false);

  const handleSendSingle = async () => {
    if (!token || !singleForm.userId || !singleForm.title || !singleForm.message) return;
    try {
      setSingleSending(true);
      await apiClient('/api/notifications/send', {
        method: 'POST',
        token,
        body: JSON.stringify({
          userId: singleForm.userId,
          title: singleForm.title,
          message: singleForm.message,
          type: singleForm.type,
          category: singleForm.category,
          link: singleForm.link || undefined,
        }),
      });
      alert('Notification sent successfully!');
      setSingleForm({ userId: '', title: '', message: '', type: 'INFO', category: 'GENERAL', link: '' });
    } catch (error) {
      console.error('Failed to send notification:', error);
      alert('Failed to send notification');
    } finally {
      setSingleSending(false);
    }
  };

  const handleSendBulk = async () => {
    if (!token || !bulkForm.title || !bulkForm.message) return;
    try {
      setBulkSending(true);
      const channels = Object.entries(bulkForm.channels)
        .filter(([, v]) => v)
        .map(([k]) => k === 'inApp' ? 'IN_APP' : k.toUpperCase());

      await apiClient('/api/notifications/bulk', {
        method: 'POST',
        token,
        body: JSON.stringify({
          title: bulkForm.title,
          message: bulkForm.message,
          type: bulkForm.type,
          category: bulkForm.category,
          targetRoles: bulkForm.targetRoles.length > 0 ? bulkForm.targetRoles : undefined,
          channels: channels.length > 0 ? channels : undefined,
        }),
      });
      alert('Bulk notification sent successfully!');
      setBulkForm({ title: '', message: '', type: 'INFO', category: 'GENERAL', targetRoles: [], channels: { inApp: true, email: false, sms: false, push: false } });
    } catch (error) {
      console.error('Failed to send bulk notification:', error);
      alert('Failed to send bulk notification');
    } finally {
      setBulkSending(false);
    }
  };

  const toggleRole = (role: string) => {
    setBulkForm((prev) => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter((r) => r !== role)
        : [...prev.targetRoles, role],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notification Management</h1>
          <p className="text-sm text-gray-500 mt-1">Send notifications and manage templates</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/notifications/templates')}>
            <FileText size={16} className="mr-1.5" />
            Templates
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/notifications/logs')}>
            <BarChart3 size={16} className="mr-1.5" />
            Delivery Logs
          </Button>
        </div>
      </div>

      <Tabs defaultValue="single">
        <TabsList>
          <TabsTrigger value="single">
            <Send size={14} className="mr-1.5" />
            Send to User
          </TabsTrigger>
          <TabsTrigger value="bulk">
            <Users size={14} className="mr-1.5" />
            Bulk Send
          </TabsTrigger>
        </TabsList>

        {/* Single Notification */}
        <TabsContent value="single">
          <Card>
            <CardHeader>
              <CardTitle>Send Custom Notification</CardTitle>
              <CardDescription>Send a notification to a specific user</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>User ID</Label>
                <Input
                  placeholder="Enter user ID"
                  value={singleForm.userId}
                  onChange={(e) => setSingleForm((p) => ({ ...p, userId: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select
                    value={singleForm.type}
                    onChange={(e) => setSingleForm((p) => ({ ...p, type: e.target.value }))}
                  >
                    {TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={singleForm.category}
                    onChange={(e) => setSingleForm((p) => ({ ...p, category: e.target.value }))}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </Select>
                </div>
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  placeholder="Notification title"
                  value={singleForm.title}
                  onChange={(e) => setSingleForm((p) => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea
                  placeholder="Notification message..."
                  rows={3}
                  value={singleForm.message}
                  onChange={(e) => setSingleForm((p) => ({ ...p, message: e.target.value }))}
                />
              </div>
              <div>
                <Label>Link (optional)</Label>
                <Input
                  placeholder="/leave-attendance or external URL"
                  value={singleForm.link}
                  onChange={(e) => setSingleForm((p) => ({ ...p, link: e.target.value }))}
                />
              </div>
              <Button
                onClick={handleSendSingle}
                disabled={singleSending || !singleForm.userId || !singleForm.title || !singleForm.message}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Send size={16} className="mr-1.5" />
                {singleSending ? 'Sending...' : 'Send Notification'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Notification */}
        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Notification</CardTitle>
              <CardDescription>Send a notification to multiple users at once</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select
                    value={bulkForm.type}
                    onChange={(e) => setBulkForm((p) => ({ ...p, type: e.target.value }))}
                  >
                    {TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={bulkForm.category}
                    onChange={(e) => setBulkForm((p) => ({ ...p, category: e.target.value }))}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </Select>
                </div>
              </div>

              <div>
                <Label>Target Roles</Label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {ROLES.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => toggleRole(role.value)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        bulkForm.targetRoles.includes(role.value)
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {bulkForm.targetRoles.length === 0 ? 'All roles (no filter)' : `Selected: ${bulkForm.targetRoles.join(', ')}`}
                </p>
              </div>

              <div>
                <Label>Title</Label>
                <Input
                  placeholder="Notification title"
                  value={bulkForm.title}
                  onChange={(e) => setBulkForm((p) => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea
                  placeholder="Notification message..."
                  rows={4}
                  value={bulkForm.message}
                  onChange={(e) => setBulkForm((p) => ({ ...p, message: e.target.value }))}
                />
              </div>

              <div>
                <Label className="mb-2 block">Delivery Channels</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { key: 'inApp' as const, label: 'In-App', icon: Monitor },
                    { key: 'email' as const, label: 'Email', icon: Mail },
                    { key: 'sms' as const, label: 'SMS', icon: MessageSquare },
                    { key: 'push' as const, label: 'Push', icon: BellRing },
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key} className="flex items-center gap-2 p-2 rounded-lg border border-gray-200">
                      <Switch
                        checked={bulkForm.channels[key]}
                        onCheckedChange={(checked) =>
                          setBulkForm((p) => ({ ...p, channels: { ...p.channels, [key]: checked } }))
                        }
                      />
                      <Icon size={14} className="text-gray-500" />
                      <span className="text-sm">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSendBulk}
                disabled={bulkSending || !bulkForm.title || !bulkForm.message}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Users size={16} className="mr-1.5" />
                {bulkSending ? 'Sending...' : 'Send Bulk Notification'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
