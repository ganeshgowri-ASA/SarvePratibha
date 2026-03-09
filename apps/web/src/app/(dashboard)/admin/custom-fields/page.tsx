'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { customFieldSchema, type CustomFieldInput } from '@sarve-pratibha/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Settings } from 'lucide-react';
import type { CustomFieldItem } from '@sarve-pratibha/shared';

const MODULES = ['Employee', 'Leave', 'Attendance', 'Payroll', 'Claims', 'Performance', 'Recruitment'];
const FIELD_TYPES = ['TEXT', 'NUMBER', 'DATE', 'BOOLEAN', 'SELECT', 'MULTI_SELECT', 'FILE', 'URL', 'EMAIL', 'PHONE'];

export default function CustomFieldsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [selectedModule, setSelectedModule] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'custom-fields', selectedModule],
    queryFn: () => {
      const params = selectedModule ? `?module=${selectedModule}` : '';
      return api.get(`/api/admin/custom-fields${params}`);
    },
  });

  const form = useForm<CustomFieldInput>({
    resolver: zodResolver(customFieldSchema),
    defaultValues: { fieldType: 'TEXT', isRequired: false, displayOrder: 0 },
  });

  const createMutation = useMutation({
    mutationFn: (data: CustomFieldInput) => api.post('/api/admin/custom-fields', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'custom-fields'] });
      setShowForm(false);
      form.reset();
    },
  });

  const fields: CustomFieldItem[] = (data?.data as CustomFieldItem[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Fields</h1>
          <p className="text-gray-500 mt-1">Add custom fields to any module</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" /> Add Custom Field
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>Create Custom Field</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <Label>Field Name</Label>
                <Input {...form.register('fieldName')} placeholder="custom_field_name" />
                {form.formState.errors.fieldName && <p className="text-sm text-red-500">{form.formState.errors.fieldName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Field Label</Label>
                <Input {...form.register('fieldLabel')} placeholder="Custom Field Label" />
                {form.formState.errors.fieldLabel && <p className="text-sm text-red-500">{form.formState.errors.fieldLabel.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Field Type</Label>
                <Select onValueChange={(v) => form.setValue('fieldType', v as any)} defaultValue="TEXT">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FIELD_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" {...form.register('displayOrder', { valueAsNumber: true })} min={0} />
              </div>
              <div className="flex items-center gap-2 pt-7">
                <Switch checked={form.watch('isRequired')} onCheckedChange={(v) => form.setValue('isRequired', v)} />
                <Label>Required field</Label>
              </div>
              <div className="col-span-full flex gap-2">
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create Field'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Module Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedModule === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedModule('')}
              className={selectedModule === '' ? 'bg-teal-600 hover:bg-teal-700' : ''}
            >
              All
            </Button>
            {MODULES.map((m) => (
              <Button
                key={m}
                variant={selectedModule === m ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedModule(m)}
                className={selectedModule === m ? 'bg-teal-600 hover:bg-teal-700' : ''}
              >
                {m}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead>Field Name</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">Loading...</TableCell></TableRow>
              ) : fields.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No custom fields</TableCell></TableRow>
              ) : (
                fields.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell><Badge variant="outline">{f.module}</Badge></TableCell>
                    <TableCell><code className="text-sm bg-gray-100 px-2 py-0.5 rounded">{f.fieldName}</code></TableCell>
                    <TableCell className="font-medium">{f.fieldLabel}</TableCell>
                    <TableCell><Badge className="bg-blue-100 text-blue-800">{f.fieldType}</Badge></TableCell>
                    <TableCell>{f.isRequired ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <Badge className={f.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {f.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
