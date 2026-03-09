'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { workflowSchema, type WorkflowInput } from '@sarve-pratibha/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ArrowDown, GitBranch } from 'lucide-react';
import type { WorkflowItem } from '@sarve-pratibha/shared';

const MODULES = ['Leave', 'Claims', 'Loans', 'Assets', 'Payroll', 'Performance', 'Recruitment'];

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  DRAFT: 'bg-yellow-100 text-yellow-800',
};

export default function WorkflowsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'workflows'],
    queryFn: () => api.get('/api/admin/workflows'),
  });

  const form = useForm<WorkflowInput>({
    resolver: zodResolver(workflowSchema),
    defaultValues: { steps: [{ name: 'Manager Approval', isRequired: true, autoApprove: false }] },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'steps' });

  const createMutation = useMutation({
    mutationFn: (data: WorkflowInput) => api.post('/api/admin/workflow/create', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'workflows'] });
      setShowForm(false);
      form.reset();
    },
  });

  const workflows: WorkflowItem[] = (data?.data as WorkflowItem[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflow Builder</h1>
          <p className="text-gray-500 mt-1">Create and manage approval workflows</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" /> Create Workflow
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>New Workflow</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input {...form.register('name')} placeholder="Leave Approval Workflow" />
                  {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Module</Label>
                  <Select onValueChange={(v) => form.setValue('module', v)}>
                    <SelectTrigger><SelectValue placeholder="Select module" /></SelectTrigger>
                    <SelectContent>
                      {MODULES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.module && <p className="text-sm text-red-500">{form.formState.errors.module.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input {...form.register('description')} placeholder="Optional description" />
                </div>
              </div>

              {/* Workflow Steps */}
              <div>
                <Label className="text-base font-semibold">Approval Steps</Label>
                <div className="space-y-3 mt-3">
                  {fields.map((field, idx) => (
                    <div key={field.id}>
                      {idx > 0 && (
                        <div className="flex justify-center py-1">
                          <ArrowDown className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-semibold text-sm">
                          {idx + 1}
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                          <Input {...form.register(`steps.${idx}.name`)} placeholder="Step name" />
                          <Select onValueChange={(v) => form.setValue(`steps.${idx}.approverRole`, v as any)}>
                            <SelectTrigger><SelectValue placeholder="Approver role" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MANAGER">Manager</SelectItem>
                              <SelectItem value="SECTION_HEAD">Section Head</SelectItem>
                              <SelectItem value="IT_ADMIN">IT Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={form.watch(`steps.${idx}.autoApprove`)}
                                onCheckedChange={(v) => form.setValue(`steps.${idx}.autoApprove`, v)}
                              />
                              <span className="text-sm">Auto</span>
                            </div>
                            {fields.length > 1 && (
                              <Button type="button" variant="ghost" size="sm" onClick={() => remove(idx)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => append({ name: '', isRequired: true, autoApprove: false })}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Step
                </Button>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create Workflow'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Existing Workflows */}
      <div className="space-y-4">
        {isLoading ? (
          <Card><CardContent className="py-8 text-center text-gray-500">Loading...</CardContent></Card>
        ) : workflows.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-gray-500">No workflows created yet</CardContent></Card>
        ) : (
          workflows.map((wf) => (
            <Card key={wf.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-teal-600" />
                      <h3 className="font-semibold text-lg">{wf.name}</h3>
                      <Badge className={STATUS_COLORS[wf.status]}>{wf.status}</Badge>
                      <Badge variant="outline">{wf.module}</Badge>
                    </div>
                    {wf.description && <p className="text-sm text-gray-500 mt-1">{wf.description}</p>}
                  </div>
                </div>
                {/* Visual Steps */}
                <div className="flex items-center gap-2 flex-wrap">
                  {wf.steps.map((step, idx) => (
                    <div key={step.id} className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border rounded-lg text-sm">
                        <span className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-xs font-bold">
                          {step.stepOrder}
                        </span>
                        <span>{step.name}</span>
                        {step.approverRole && <Badge variant="outline" className="text-xs">{step.approverRole}</Badge>}
                        {step.autoApprove && <Badge className="bg-yellow-100 text-yellow-800 text-xs">Auto</Badge>}
                      </div>
                      {idx < wf.steps.length - 1 && <ArrowDown className="h-4 w-4 text-gray-300 rotate-[-90deg]" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
