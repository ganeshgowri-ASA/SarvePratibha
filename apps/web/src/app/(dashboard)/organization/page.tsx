'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Users,
  Network,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { EmployeeProfileCard } from '@/components/employee/profile-card';

interface DirectoryEmployee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  officialEmail?: string;
  personalEmail?: string;
  profilePhoto?: string;
  workLocation?: string;
  department: { id: string; name: string };
  designation: { id: string; name: string };
  user: { email: string };
}

interface FilterOption {
  id: string;
  name: string;
}

interface OrgTreeNode {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  designation: string;
  department: string;
  profilePhoto?: string;
  role: string;
  children?: OrgTreeNode[];
}

export default function OrganizationDirectoryPage() {
  const [employees, setEmployees] = useState<DirectoryEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [desigFilter, setDesigFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [departments, setDepartments] = useState<FilterOption[]>([]);
  const [designations, setDesignations] = useState<FilterOption[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<DirectoryEmployee | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'directory' | 'tree'>('directory');
  const [treeData, setTreeData] = useState<any>(null);
  const [treeLoading, setTreeLoading] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const fetchDirectory = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (deptFilter) params.set('dept', deptFilter);
      if (desigFilter) params.set('designation', desigFilter);
      if (locationFilter) params.set('location', locationFilter);
      params.set('page', page.toString());
      params.set('limit', '20');

      const res = await apiFetch<DirectoryEmployee[]>(
        `/api/organization/directory?${params.toString()}`
      );

      if (res.data) setEmployees(res.data);
      if ((res as any).filters) {
        setDepartments((res as any).filters.departments || []);
        setDesignations((res as any).filters.designations || []);
      }
      if ((res as any).pagination) {
        setTotalPages((res as any).pagination.totalPages);
        setTotal((res as any).pagination.total);
      }
    } catch {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [search, deptFilter, desigFilter, locationFilter, page]);

  useEffect(() => {
    const timeout = setTimeout(fetchDirectory, 300);
    return () => clearTimeout(timeout);
  }, [fetchDirectory]);

  const fetchTree = useCallback(async (employeeId: string) => {
    setTreeLoading(true);
    try {
      const res = await apiFetch<any>(`/api/people/organization/hierarchy/${employeeId}`);
      if (res.data) setTreeData(res.data);
    } catch {
      // ignore
    } finally {
      setTreeLoading(false);
    }
  }, []);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  const handleEmployeeClick = (emp: DirectoryEmployee) => {
    setSelectedEmployee(emp);
    setProfileDialogOpen(true);
  };

  const handleViewTree = (emp: DirectoryEmployee) => {
    setViewMode('tree');
    fetchTree(emp.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organization Directory</h1>
          <p className="text-sm text-gray-500">
            {total} employees found
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'directory' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('directory')}
            className={viewMode === 'directory' ? 'bg-teal-600 hover:bg-teal-700' : ''}
          >
            <Users size={16} className="mr-1" /> Directory
          </Button>
          <Button
            variant={viewMode === 'tree' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setViewMode('tree');
              if (employees.length > 0 && !treeData) fetchTree(employees[0].id);
            }}
            className={viewMode === 'tree' ? 'bg-teal-600 hover:bg-teal-700' : ''}
          >
            <Network size={16} className="mr-1" /> Org Tree
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by name or employee ID..."
                className="pl-10"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter size={16} />
              Filters
              {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Department</label>
                <Select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}>
                  <option value="">All Departments</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Designation</label>
                <Select value={desigFilter} onChange={(e) => { setDesigFilter(e.target.value); setPage(1); }}>
                  <option value="">All Designations</option>
                  {designations.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Location</label>
                <Input
                  placeholder="Filter by location..."
                  value={locationFilter}
                  onChange={(e) => { setLocationFilter(e.target.value); setPage(1); }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Directory View */}
      {viewMode === 'directory' && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : employees.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {employees.map((emp) => (
                  <Card
                    key={emp.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleEmployeeClick(emp)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-teal-100 text-teal-700">
                            {emp.firstName[0]}{emp.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {emp.firstName} {emp.lastName}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">{emp.designation.name}</p>
                          <p className="text-xs text-gray-400 truncate">{emp.department.name}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {emp.workLocation && (
                              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                <MapPin size={10} /> {emp.workLocation}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge className="bg-teal-50 text-teal-600 text-[10px]">{emp.employeeId}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Page {page} of {totalPages} ({total} employees)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <ChevronLeft size={16} /> Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Users size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No employees found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Org Tree View */}
      {viewMode === 'tree' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Network size={18} className="text-teal-600" />
              Organization Hierarchy
            </CardTitle>
          </CardHeader>
          <CardContent>
            {treeLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : treeData ? (
              <div className="space-y-2">
                {treeData.chain.map((node: any, idx: number) => (
                  <div key={node.id} style={{ marginLeft: idx * 24 }}>
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        node.id === treeData.employee.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        toggleNode(node.id);
                        fetchTree(node.id);
                      }}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">
                          {node.firstName[0]}{node.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {node.firstName} {node.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {node.designation} &middot; {node.department}
                        </p>
                      </div>
                      <Badge className={`text-[10px] ${
                        node.role === 'IT_ADMIN' ? 'bg-purple-100 text-purple-700'
                        : node.role === 'SECTION_HEAD' ? 'bg-blue-100 text-blue-700'
                        : node.role === 'MANAGER' ? 'bg-teal-100 text-teal-700'
                        : 'bg-gray-100 text-gray-700'
                      }`}>
                        {node.role.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}

                {treeData.directReports.length > 0 && (
                  <div style={{ marginLeft: treeData.chain.length * 24 }}>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 mt-3">
                      Direct Reports ({treeData.directReports.length})
                    </p>
                    <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                      {treeData.directReports.map((report: any) => (
                        <div
                          key={report.id}
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer"
                          onClick={() => fetchTree(report.id)}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">
                              {report.firstName[0]}{report.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {report.firstName} {report.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {report.designation} &middot; {report.department}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Network size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Select an employee to view their hierarchy</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setViewMode('directory')}
                >
                  Go to Directory
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Mini-profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Employee Profile</DialogTitle>
            <DialogDescription>Quick view</DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-teal-100 text-teal-700 text-lg">
                    {selectedEmployee.firstName[0]}{selectedEmployee.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedEmployee.designation.name}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge className="bg-teal-50 text-teal-600">{selectedEmployee.employeeId}</Badge>
                    <Badge variant="secondary">{selectedEmployee.department.name}</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-3 pt-2 border-t">
                {selectedEmployee.workLocation && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin size={16} className="text-gray-400 shrink-0" />
                    <span>{selectedEmployee.workLocation}</span>
                  </div>
                )}
                {selectedEmployee.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={16} className="text-gray-400 shrink-0" />
                    <span>{selectedEmployee.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-gray-400 shrink-0" />
                  <span className="truncate">{selectedEmployee.officialEmail || selectedEmployee.user.email}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setProfileDialogOpen(false);
                    setViewMode('tree');
                    fetchTree(selectedEmployee.id);
                  }}
                >
                  <Network size={14} className="mr-1" /> View in Org Tree
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
