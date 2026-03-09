'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { gradeSchema, type GradeInput } from '@sarve-pratibha/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import type { GradeItem } from '@sarve-pratibha/shared';

export default function GradesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'grades'],
    queryFn: () => api.get('/api/admin/grades'),
  });

  const form = useForm<GradeInput>({
    resolver: zodResolver(gradeSchema),
    defaultValues: { level: 0 },
  });

  const createMutation = useMutation({
    mutationFn: (data: GradeInput) => api.post('/api/admin/grades', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'grades'] });
      setShowForm(false);
      form.reset();
    },
  });

  const grades: GradeItem[] = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
          <p className="text-gray-500 mt-1">Manage salary grades and bands</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" /> Add Grade
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>Create Grade</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input {...form.register('name')} placeholder="Grade A" />
                {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Code</Label>
                <Input {...form.register('code')} placeholder="GA" />
                {form.formState.errors.code && <p className="text-sm text-red-500">{form.formState.errors.code.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Level</Label>
                <Input type="number" {...form.register('level', { valueAsNumber: true })} min={0} />
              </div>
              <div className="space-y-2">
                <Label>Min Salary</Label>
                <Input type="number" {...form.register('minSalary', { valueAsNumber: true })} placeholder="30000" />
              </div>
              <div className="space-y-2">
                <Label>Max Salary</Label>
                <Input type="number" {...form.register('maxSalary', { valueAsNumber: true })} placeholder="60000" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input {...form.register('description')} placeholder="Optional" />
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
                <TableHead>Grade</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Salary Range</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">Loading...</TableCell></TableRow>
              ) : grades.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No grades configured</TableCell></TableRow>
              ) : (
                grades.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium">{g.name}</TableCell>
                    <TableCell><code className="text-sm bg-gray-100 px-2 py-0.5 rounded">{g.code}</code></TableCell>
                    <TableCell>{g.level}</TableCell>
                    <TableCell className="text-sm">
                      {g.minSalary != null && g.maxSalary != null
                        ? `${g.minSalary.toLocaleString()} - ${g.maxSalary.toLocaleString()}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={g.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {g.isActive ? 'Active' : 'Inactive'}
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
