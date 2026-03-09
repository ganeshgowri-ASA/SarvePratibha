'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
  Users,
  Network,
  MapPin,
  Phone,
  Mail,
  Building2,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { EmployeeProfileCard } from '@/components/employee/profile-card';

interface ChainNode {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  designation: string;
  department: string;
  profilePhoto?: string;
  role: string;
}

interface HierarchyData {
  chain: ChainNode[];
  directReports: ChainNode[];
  employee: ChainNode;
}

interface SearchResult {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  personalEmail?: string;
  officialEmail?: string;
  profilePhoto?: string;
  department: string;
  designation: string;
  workLocation?: string;
}

const ROLE_COLORS: Record<string, string> = {
  IT_ADMIN: 'bg-purple-100 text-purple-700 border-purple-300',
  SECTION_HEAD: 'bg-blue-100 text-blue-700 border-blue-300',
  MANAGER: 'bg-teal-100 text-teal-700 border-teal-300',
  EMPLOYEE: 'bg-gray-100 text-gray-700 border-gray-300',
};

function OrgNodeCard({ node, isActive }: { node: ChainNode; isActive: boolean }) {
  const initials = `${node.firstName[0]}${node.lastName[0]}`.toUpperCase();

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
        isActive ? 'border-teal-500 bg-teal-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <Avatar className="h-10 w-10">
        <AvatarFallback className="bg-teal-100 text-teal-700 text-sm">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{node.firstName} {node.lastName}</p>
        <p className="text-xs text-gray-500 truncate">{node.designation}</p>
        <p className="text-xs text-gray-400 truncate">{node.department}</p>
      </div>
      <Badge className={`text-[10px] ${ROLE_COLORS[node.role] || ROLE_COLORS.EMPLOYEE}`}>
        {node.role.replace('_', ' ')}
      </Badge>
    </div>
  );
}

export default function PeoplePage() {
  const [hierarchy, setHierarchy] = useState<HierarchyData | null>(null);
  const [hierarchyLoading, setHierarchyLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'mobile' | 'email'>('name');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<SearchResult | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [myEmployeeId, setMyEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const res = await apiFetch<any>('/api/employees/me/profile');
        if (res.data?.id) setMyEmployeeId(res.data.id);
      } catch {
        // ignore
      }
    };
    fetchMyProfile();
  }, []);

  useEffect(() => {
    if (!myEmployeeId) {
      setHierarchyLoading(false);
      return;
    }
    const fetchHierarchy = async () => {
      try {
        const res = await apiFetch<HierarchyData>(`/api/people/organization/hierarchy/${myEmployeeId}`);
        if (res.data) setHierarchy(res.data);
      } catch {
        // ignore
      } finally {
        setHierarchyLoading(false);
      }
    };
    fetchHierarchy();
  }, [myEmployeeId]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await apiFetch<SearchResult[]>(
        `/api/people/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`
      );
      setSearchResults(res.data || []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, [searchQuery, searchType]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(handleSearch, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, searchType, handleSearch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">People</h1>
        <p className="text-sm text-gray-500">Explore your organization and find colleagues</p>
      </div>

      <Tabs defaultValue="org-tree">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="org-tree" className="gap-2">
            <Network size={16} /> My Organization
          </TabsTrigger>
          <TabsTrigger value="find-people" className="gap-2">
            <Search size={16} /> Find People
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Organization Relationship Tree */}
        <TabsContent value="org-tree">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Network size={18} className="text-teal-600" />
                My Organization Relationship
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hierarchyLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : hierarchy ? (
                <div className="space-y-1">
                  {hierarchy.chain.map((node, idx) => (
                    <div key={node.id}>
                      {idx > 0 && (
                        <div className="flex items-center ml-8 py-1">
                          <div className="w-px h-6 bg-gray-300" />
                        </div>
                      )}
                      <OrgNodeCard node={node} isActive={node.id === hierarchy.employee.id} />
                    </div>
                  ))}

                  {hierarchy.directReports.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center ml-8 py-1">
                        <div className="w-px h-6 bg-gray-300" />
                      </div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 ml-2">
                        Direct Reports ({hierarchy.directReports.length})
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4 pl-4 border-l-2 border-gray-200">
                        {hierarchy.directReports.map((report) => (
                          <OrgNodeCard key={report.id} node={report} isActive={false} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Network size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Organization hierarchy not available</p>
                  <p className="text-sm text-gray-400 mt-1">Contact your HR department for assistance</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Find People */}
        <TabsContent value="find-people">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder={`Search by ${searchType}...`}
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as 'name' | 'mobile' | 'email')}
                  className="w-full sm:w-40"
                >
                  <option value="name">By Name</option>
                  <option value="mobile">By Mobile</option>
                  <option value="email">By Email</option>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {searchLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((emp) => (
                    <EmployeeProfileCard
                      key={emp.id}
                      firstName={emp.firstName}
                      lastName={emp.lastName}
                      employeeId={emp.employeeId}
                      designation={emp.designation}
                      department={emp.department}
                      email={emp.officialEmail}
                      phone={emp.phone}
                      location={emp.workLocation}
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setProfileDialogOpen(true);
                      }}
                    />
                  ))}
                </div>
              ) : searchQuery.trim() ? (
                <div className="text-center py-8">
                  <Users size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No employees found</p>
                  <p className="text-sm text-gray-400 mt-1">Try a different search term or filter</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Search for employees</p>
                  <p className="text-sm text-gray-400 mt-1">Enter a name, mobile number, or email to find people</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Employee Profile</DialogTitle>
            <DialogDescription>Contact details</DialogDescription>
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
                  <p className="text-sm text-gray-500">{selectedEmployee.designation}</p>
                  <Badge variant="secondary" className="mt-1">{selectedEmployee.employeeId}</Badge>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm">
                  <Building2 size={16} className="text-gray-400" />
                  <span>{selectedEmployee.department}</span>
                </div>
                {selectedEmployee.workLocation && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin size={16} className="text-gray-400" />
                    <span>{selectedEmployee.workLocation}</span>
                  </div>
                )}
                {selectedEmployee.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={16} className="text-gray-400" />
                    <span>{selectedEmployee.phone}</span>
                  </div>
                )}
                {selectedEmployee.officialEmail && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={16} className="text-gray-400" />
                    <span className="truncate">{selectedEmployee.officialEmail}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
