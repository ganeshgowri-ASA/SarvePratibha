'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { locationSchema, type LocationInput } from '@sarve-pratibha/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, MapPin } from 'lucide-react';
import type { LocationItem } from '@sarve-pratibha/shared';

export default function LocationsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'locations'],
    queryFn: () => api.get('/api/admin/locations'),
  });

  const form = useForm<LocationInput>({ resolver: zodResolver(locationSchema) });

  const createMutation = useMutation({
    mutationFn: (data: LocationInput) => api.post('/api/admin/locations', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'locations'] });
      setShowForm(false);
      form.reset();
    },
  });

  const locations: LocationItem[] = (data?.data as LocationItem[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
          <p className="text-gray-500 mt-1">Manage office locations</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" /> Add Location
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>Create Location</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input {...form.register('name')} placeholder="Head Office" />
                {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Code</Label>
                <Input {...form.register('code')} placeholder="HQ" />
                {form.formState.errors.code && <p className="text-sm text-red-500">{form.formState.errors.code.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input {...form.register('address')} placeholder="123 Main Street" />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input {...form.register('city')} placeholder="Mumbai" />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input {...form.register('state')} placeholder="Maharashtra" />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input {...form.register('country')} placeholder="India" />
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
                <TableHead>Location</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>City</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">Loading...</TableCell></TableRow>
              ) : locations.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No locations</TableCell></TableRow>
              ) : (
                locations.map((loc) => (
                  <TableRow key={loc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-teal-600" />
                        <span className="font-medium">{loc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell><code className="text-sm bg-gray-100 px-2 py-0.5 rounded">{loc.code}</code></TableCell>
                    <TableCell className="text-sm">{loc.city || '-'}</TableCell>
                    <TableCell className="text-sm">{loc.state || '-'}</TableCell>
                    <TableCell className="text-sm">{loc.country || '-'}</TableCell>
                    <TableCell>
                      <Badge className={loc.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {loc.isActive ? 'Active' : 'Inactive'}
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
