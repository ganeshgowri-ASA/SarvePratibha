'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { designationSchema, type DesignationInput } from '@sarve-pratibha/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Briefcase, Users } from 'lucide-react';
import type { DesignationItem } from '@sarve-pratibha/shared';

export default function DesignationsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'designations'],
    queryFn: () => api.get('/api/admin/designations'),
  });

  const form = useForm<DesignationInput>({
    resolver: zodResolver(designationSchema),
    defaultValues: { level: 0 },
  });

  const createMutation = useMutation({
    mutationFn: (data: DesignationInput) => api.post('/api/admin/designations', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'designations'] });
      setShowForm(false);
      form.reset();
    },
  });

  const designations: DesignationItem[] = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Designations</h1>
          <p className="text-gray-500 mt-1">Manage job titles and levels</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" /> Add Designation
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>Create Designation</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input {...form.register('name')} placeholder="Software Engineer" />
                {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Code</Label>
                <Input {...form.register('code')} placeholder="SWE" />
                {form.formState.errors.code && <p className="text-sm text-red-500">{form.formState.errors.code.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Level</Label>
                <Input type="number" {...form.register('level', { valueAsNumber: true })} min={0} />
              </div>
              <div className="space-y-2">
                <Label>Band</Label>
                <Input {...form.register('band')} placeholder="L3" />
              </div>
              <div className="col-span-full flex gap-2">
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Designation</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Band</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">Loading...</TableCell></TableRow>
              ) : designations.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No designations</TableCell></TableRow>
              ) : (
                designations.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-teal-600" />
                        <span className="font-medium">{d.name}</span>
                      </div>
                    </TableCell>
                    <TableCell><code className="text-sm bg-gray-100 px-2 py-0.5 rounded">{d.code}</code></TableCell>
                    <TableCell>{d.level}</TableCell>
                    <TableCell>{d.band || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm">{d._count?.employees || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={d.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {d.isActive ? 'Active' : 'Inactive'}
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
