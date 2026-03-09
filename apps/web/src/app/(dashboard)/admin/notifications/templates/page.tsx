'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  FileText,
  Edit2,
  Eye,
  Variable,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { apiFetch } from '@/lib/api';
import { NOTIFICATION_TEMPLATE_VARIABLES } from '@sarve-pratibha/shared';
import type { NotificationTemplateItem, ApiResponse } from '@sarve-pratibha/shared';

const CATEGORIES = [
  { value: 'LEAVE', label: 'Leave' },
  { value: 'ATTENDANCE', label: 'Attendance' },
  { value: 'PAYROLL', label: 'Payroll' },
  { value: 'PERFORMANCE', label: 'Performance' },
  { value: 'RECRUITMENT', label: 'Recruitment' },
  { value: 'SYSTEM', label: 'System' },
  { value: 'GENERAL', label: 'General' },
];

const CHANNELS = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'SMS', label: 'SMS' },
  { value: 'PUSH', label: 'Push' },
  { value: 'IN_APP', label: 'In-App' },
];

const CHANNEL_COLORS: Record<string, string> = {
  EMAIL: 'bg-blue-50 text-blue-700',
  SMS: 'bg-green-50 text-green-700',
  PUSH: 'bg-purple-50 text-purple-700',
  IN_APP: 'bg-orange-50 text-orange-700',
};

interface TemplateForm {
  name: string;
  subject: string;
  body: string;
  category: string;
  channel: string;
  isActive: boolean;
}

const emptyForm: TemplateForm = {
  name: '',
  subject: '',
  body: '',
  category: 'GENERAL',
  channel: 'EMAIL',
  isActive: true,
};

export default function NotificationTemplatesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const token = (session?.user as any)?.accessToken;

  const [templates, setTemplates] = useState<NotificationTemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TemplateForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<NotificationTemplateItem | null>(null);

  const fetchTemplates = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await apiFetch<ApiResponse<NotificationTemplateItem[]>>(
        '/api/notifications/templates',
        { token },
      );
      setTemplates(data.data || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleOpenEdit = (template: NotificationTemplateItem) => {
    setEditingId(template.id);
    setForm({
      name: template.name,
      subject: template.subject,
      body: template.body,
      category: template.category,
      channel: template.channel,
      isActive: template.isActive,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!token) return;
    try {
      setSaving(true);
      if (editingId) {
        await apiFetch(`/api/notifications/templates/${editingId}`, {
          method: 'PUT',
          token,
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch('/api/notifications/templates', {
          method: 'POST',
          token,
          body: JSON.stringify(form),
        });
      }
      setDialogOpen(false);
      fetchTemplates();
    } catch (error) {
      console.error('Failed to save template:', error);
      alert('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const insertVariable = (variable: string) => {
    setForm((prev) => ({
      ...prev,
      body: prev.body + variable,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/admin/notifications')}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notification Templates</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage email, SMS, and push notification templates</p>
          </div>
        </div>
        <Button onClick={handleOpenCreate} className="bg-teal-600 hover:bg-teal-700">
          <Plus size={16} className="mr-1.5" />
          Create Template
        </Button>
      </div>

      {/* Template List */}
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">Loading templates...</CardContent>
        </Card>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No templates yet</p>
            <p className="text-sm text-gray-400 mt-1">Create your first notification template</p>
            <Button onClick={handleOpenCreate} className="mt-4 bg-teal-600 hover:bg-teal-700">
              <Plus size={16} className="mr-1.5" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">{template.subject}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge className={CHANNEL_COLORS[template.channel] || 'bg-gray-50 text-gray-700'} variant="secondary">
                      {template.channel}
                    </Badge>
                    <Badge variant={template.isActive ? 'default' : 'secondary'} className={template.isActive ? 'bg-green-100 text-green-800' : ''}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{template.body}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">{template.category}</Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setPreviewTemplate(template); setPreviewOpen(true); }}
                    >
                      <Eye size={14} className="mr-1" />
                      Preview
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(template)}>
                      <Edit2 size={14} className="mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Template' : 'Create Template'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update the notification template' : 'Create a new notification template with variable placeholders'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Template Name</Label>
              <Input
                placeholder="e.g., Leave Approval Email"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Channel</Label>
                <Select
                  value={form.channel}
                  onChange={(e) => setForm((p) => ({ ...p, channel: e.target.value }))}
                >
                  {CHANNELS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                placeholder="Email subject or notification title"
                value={form.subject}
                onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label>Body</Label>
                <span className="text-xs text-gray-400">Supports {'{{variable}}'} placeholders</span>
              </div>
              <Textarea
                placeholder="Write your template content here..."
                rows={8}
                value={form.body}
                onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
              />
            </div>

            {/* Variable Palette */}
            <div>
              <Label className="flex items-center gap-1.5 mb-2">
                <Variable size={14} />
                Available Variables
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(NOTIFICATION_TEMPLATE_VARIABLES).map(([variable, desc]) => (
                  <button
                    key={variable}
                    type="button"
                    onClick={() => insertVariable(variable)}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-teal-50 hover:text-teal-700 rounded border border-gray-200 transition-colors"
                    title={desc}
                  >
                    {variable}
                  </button>
                ))}
              </div>
            </div>

            {editingId && (
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(checked) => setForm((p) => ({ ...p, isActive: checked }))}
                />
                <Label>{form.isActive ? 'Active' : 'Inactive'}</Label>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.name || !form.subject || !form.body}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {saving ? 'Saving...' : editingId ? 'Update Template' : 'Create Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
            <DialogDescription>{previewTemplate?.name}</DialogDescription>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Badge className={CHANNEL_COLORS[previewTemplate.channel]} variant="secondary">
                  {previewTemplate.channel}
                </Badge>
                <Badge variant="outline">{previewTemplate.category}</Badge>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-gray-500 mb-1">Subject</p>
                <p className="font-medium">{previewTemplate.subject}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Body</p>
                <div className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap">
                  {previewTemplate.body}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
