'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Save } from 'lucide-react';

const ROLES = ['EMPLOYEE', 'MANAGER', 'SECTION_HEAD', 'IT_ADMIN'] as const;
const ROLE_LABELS: Record<string, string> = {
  EMPLOYEE: 'Employee',
  MANAGER: 'Manager',
  SECTION_HEAD: 'Section Head',
  IT_ADMIN: 'IT Admin',
};

export default function RolesPage() {
  const queryClient = useQueryClient();
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: () => api.get('/api/admin/roles'),
    onSuccess: (res: any) => {
      if (res?.data?.matrix) setMatrix(res.data.matrix);
    },
  } as any);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(
        ROLES.map((role) => {
          const permissionIds = Object.entries(matrix[role] || {})
            .filter(([, v]) => v)
            .map(([k]) => k);
          return api.put(`/api/admin/roles/${role}/permissions`, { permissionIds });
        }),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] });
      setHasChanges(false);
    },
  });

  const permissions = (data as any)?.data?.permissions || [];
  const modules = [...new Set(permissions.map((p: any) => p.module))];

  const togglePermission = (role: string, permId: string) => {
    setMatrix((prev) => ({
      ...prev,
      [role]: { ...prev[role], [permId]: !prev[role]?.[permId] },
    }));
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role & Permission Matrix</h1>
          <p className="text-gray-500 mt-1">Configure permissions for each role</p>
        </div>
        {hasChanges && (
          <Button onClick={() => saveMutation.mutate()} className="bg-teal-600 hover:bg-teal-700" disabled={saveMutation.isPending}>
            <Save className="h-4 w-4 mr-2" /> {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>

      {isLoading ? (
        <Card><CardContent className="py-8 text-center text-gray-500">Loading permissions...</CardContent></Card>
      ) : permissions.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No permissions configured yet. Permissions will appear here once they are seeded in the database.
          </CardContent>
        </Card>
      ) : (
        modules.map((mod: string) => (
          <Card key={mod}>
            <CardHeader>
              <CardTitle className="text-lg capitalize">{mod}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Permission</TableHead>
                    {ROLES.map((role) => (
                      <TableHead key={role} className="text-center">{ROLE_LABELS[role]}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions
                    .filter((p: any) => p.module === mod)
                    .map((perm: any) => (
                      <TableRow key={perm.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{perm.name}</p>
                            {perm.description && <p className="text-xs text-gray-500">{perm.description}</p>}
                          </div>
                        </TableCell>
                        {ROLES.map((role) => (
                          <TableCell key={role} className="text-center">
                            <Checkbox
                              checked={matrix[role]?.[perm.id] || false}
                              onCheckedChange={() => togglePermission(role, perm.id)}
                              disabled={role === 'IT_ADMIN'}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
