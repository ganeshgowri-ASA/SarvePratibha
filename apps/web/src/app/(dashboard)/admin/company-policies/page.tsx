'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { companyPolicySchema, type CompanyPolicyInput } from '@sarve-pratibha/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileText } from 'lucide-react';
import type { CompanyPolicyItem } from '@sarve-pratibha/shared';

const POLICY_CATEGORIES = ['HR', 'IT', 'Finance', 'Security', 'Compliance', 'General', 'Leave', 'Travel'];

export default function CompanyPoliciesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'company-policies'],
    queryFn: () => api.get('/api/admin/company-policies'),
  });

  const form = useForm<CompanyPolicyInput>({
    resolver: zodResolver(companyPolicySchema),
    defaultValues: { version: '1.0' },
  });

  const createMutation = useMutation({
    mutationFn: (data: CompanyPolicyInput) => api.post('/api/admin/company-policies', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'company-policies'] });
      setShowForm(false);
      form.reset();
    },
  });

  const policies: CompanyPolicyItem[] = (data?.data as CompanyPolicyItem[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Policies</h1>
          <p className="text-gray-500 mt-1">Manage organizational policies and guidelines</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" /> Add Policy
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>Create Policy</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input {...form.register('title')} placeholder="Policy title" />
                  {form.formState.errors.title && <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select onValueChange={(v) => form.setValue('category', v)}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {POLICY_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea {...form.register('content')} placeholder="Policy content..." rows={6} />
                {form.formState.errors.content && <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Version</Label>
                  <Input {...form.register('version')} placeholder="1.0" />
                </div>
                <div className="space-y-2">
                  <Label>Effective From</Label>
                  <Input type="date" {...form.register('effectiveFrom')} />
                </div>
                <div className="space-y-2">
                  <Label>Effective To (optional)</Label>
                  <Input type="date" {...form.register('effectiveTo')} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create Policy'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <Card><CardContent className="py-8 text-center text-gray-500">Loading...</CardContent></Card>
        ) : policies.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-gray-500">No policies created yet</CardContent></Card>
        ) : (
          policies.map((policy) => (
            <Card key={policy.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-teal-600" />
                      <h3 className="font-semibold">{policy.title}</h3>
                      <Badge variant="outline">{policy.category}</Badge>
                      <Badge className="bg-blue-100 text-blue-800">v{policy.version}</Badge>
                      <Badge className={policy.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {policy.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3 whitespace-pre-wrap">{policy.content}</p>
                    <p className="text-xs text-gray-400 mt-3">
                      Effective: {new Date(policy.effectiveFrom).toLocaleDateString()}
                      {policy.effectiveTo && ` to ${new Date(policy.effectiveTo).toLocaleDateString()}`}
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
