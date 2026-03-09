'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { announcementSchema, type AnnouncementInput } from '@sarve-pratibha/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Bell, Pin } from 'lucide-react';
import type { AnnouncementItem } from '@sarve-pratibha/shared';

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
};

export default function AnnouncementsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'announcements'],
    queryFn: () => api.get('/api/admin/announcements'),
  });

  const form = useForm<AnnouncementInput>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { priority: 'MEDIUM', isPinned: false },
  });

  const createMutation = useMutation({
    mutationFn: (data: AnnouncementInput) => api.post('/api/admin/announcement', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] });
      setShowForm(false);
      form.reset();
    },
  });

  const announcements: AnnouncementItem[] = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-500 mt-1">Create and manage company announcements</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" /> New Announcement
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>Create Announcement</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input {...form.register('title')} placeholder="Announcement title" />
                  {form.formState.errors.title && <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select onValueChange={(v) => form.setValue('priority', v as any)} defaultValue="MEDIUM">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea {...form.register('content')} placeholder="Announcement content..." rows={4} />
                {form.formState.errors.content && <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Select onValueChange={(v) => form.setValue('targetRole', v === 'ALL' ? undefined : v as any)}>
                    <SelectTrigger><SelectValue placeholder="All users" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Users</SelectItem>
                      <SelectItem value="EMPLOYEE">Employees Only</SelectItem>
                      <SelectItem value="MANAGER">Managers Only</SelectItem>
                      <SelectItem value="SECTION_HEAD">Section Heads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Publish At</Label>
                  <Input type="datetime-local" {...form.register('publishAt')} />
                </div>
                <div className="space-y-2">
                  <Label>Expires At</Label>
                  <Input type="datetime-local" {...form.register('expiresAt')} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.watch('isPinned')} onCheckedChange={(v) => form.setValue('isPinned', v)} />
                <Label>Pin this announcement</Label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Publishing...' : 'Publish'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card><CardContent className="py-8 text-center text-gray-500">Loading...</CardContent></Card>
        ) : announcements.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-gray-500">No announcements yet</CardContent></Card>
        ) : (
          announcements.map((ann) => (
            <Card key={ann.id} className={ann.isPinned ? 'border-teal-200 bg-teal-50/30' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {ann.isPinned && <Pin className="h-4 w-4 text-teal-600" />}
                      <h3 className="font-semibold text-lg">{ann.title}</h3>
                      <Badge className={PRIORITY_COLORS[ann.priority]}>{ann.priority}</Badge>
                      {ann.targetRole && <Badge variant="outline">{ann.targetRole}</Badge>}
                    </div>
                    <p className="text-gray-600 whitespace-pre-wrap">{ann.content}</p>
                    <p className="text-xs text-gray-400 mt-3">
                      Published: {new Date(ann.publishAt).toLocaleDateString()}
                      {ann.expiresAt && ` | Expires: ${new Date(ann.expiresAt).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
