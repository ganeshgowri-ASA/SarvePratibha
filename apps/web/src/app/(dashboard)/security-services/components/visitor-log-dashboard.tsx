'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  UserCheck,
  Clock,
  LogIn,
  LogOut,
  Search,
  Download,
  AlertOctagon,
  Shield,
  Eye,
  Ban,
  Filter,
} from 'lucide-react';
import { type Visitor, type BlacklistEntry, VISITORS_DATA, BLACKLIST, DEPARTMENTS } from './demo-data';

const VISITOR_STATUS_STYLES: Record<string, string> = {
  CHECKED_IN: 'bg-green-100 text-green-700',
  CHECKED_OUT: 'bg-gray-100 text-gray-700',
  EXPECTED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
  BLACKLISTED: 'bg-red-100 text-red-700',
};

const APPROVAL_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export function VisitorLogDashboard() {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [showBlacklist, setShowBlacklist] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);

  const currentlyIn = VISITORS_DATA.filter((v) => v.status === 'CHECKED_IN').length;
  const totalToday = VISITORS_DATA.filter((v) => v.createdAt.includes('10 Mar 2026')).length;
  const expected = VISITORS_DATA.filter((v) => v.status === 'EXPECTED').length;
  const checkedOut = VISITORS_DATA.filter((v) => v.status === 'CHECKED_OUT').length;

  const filtered = VISITORS_DATA.filter((v) => {
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) &&
        !v.company.toLowerCase().includes(search.toLowerCase()) &&
        !v.passId.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterDept !== 'all' && v.department !== filterDept) return false;
    if (filterStatus !== 'all' && v.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Real-time stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <UserCheck size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-green-600 font-medium">Currently In</p>
                <p className="text-2xl font-bold text-green-700">{currentlyIn}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Users size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-blue-600 font-medium">Total Today</p>
                <p className="text-2xl font-bold text-blue-700">{totalToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Clock size={18} className="text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-orange-600 font-medium">Expected</p>
                <p className="text-2xl font-bold text-orange-700">{expected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-gray-50/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <LogOut size={18} className="text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Checked Out</p>
                <p className="text-2xl font-bold text-gray-700">{checkedOut}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield size={18} className="text-teal-600" />
              Visitor Log
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setShowBlacklist(true)}
              >
                <Ban size={14} className="mr-1" /> Blacklist ({BLACKLIST.length})
              </Button>
              <Button variant="outline" size="sm">
                <Download size={14} className="mr-1" /> Emergency List
              </Button>
              <Button variant="outline" size="sm">
                <Download size={14} className="mr-1" /> Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & filter row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name, company, or pass ID..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <Select value={filterDept} onValueChange={setFilterDept}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="CHECKED_IN">Checked In</SelectItem>
                  <SelectItem value="CHECKED_OUT">Checked Out</SelectItem>
                  <SelectItem value="EXPECTED">Expected</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                className="w-40"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
          </div>

          {/* Visitor table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor</TableHead>
                  <TableHead>Pass ID</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>Check-In</TableHead>
                  <TableHead>Check-Out</TableHead>
                  <TableHead>Approval</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{visitor.name}</p>
                        <p className="text-xs text-gray-500">{visitor.company}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs font-medium text-teal-700">{visitor.passId}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{visitor.purpose}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{visitor.hostEmployee}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-600">
                        {visitor.actualCheckIn || <span className="text-gray-400">—</span>}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-600">
                        {visitor.actualCheckOut || <span className="text-gray-400">—</span>}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={APPROVAL_STYLES[visitor.approvalStatus] || ''}>
                        {visitor.approvalStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={VISITOR_STATUS_STYLES[visitor.status] || ''}>
                        {visitor.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => setSelectedVisitor(visitor)}
                        >
                          <Eye size={14} />
                        </Button>
                        {visitor.status === 'EXPECTED' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-green-600 hover:text-green-700"
                          >
                            <LogIn size={14} />
                          </Button>
                        )}
                        {visitor.status === 'CHECKED_IN' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-orange-600 hover:text-orange-700"
                          >
                            <LogOut size={14} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Users size={36} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No visitors match your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visitor detail dialog */}
      {selectedVisitor && (
        <Dialog open onOpenChange={() => setSelectedVisitor(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Visitor Details - {selectedVisitor.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-gray-400">Name</Label>
                  <p className="font-medium">{selectedVisitor.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Company</Label>
                  <p>{selectedVisitor.company}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Phone</Label>
                  <p>{selectedVisitor.phone}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Email</Label>
                  <p>{selectedVisitor.email || '—'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Aadhaar</Label>
                  <p className="font-mono">{selectedVisitor.aadhaarMasked}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Pass ID</Label>
                  <p className="font-mono font-medium text-teal-700">{selectedVisitor.passId}</p>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-xs text-gray-400 mb-2">Visit Information</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-gray-400">Purpose</Label>
                    <p>{selectedVisitor.purpose}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400">Department</Label>
                    <p>{selectedVisitor.department}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400">Host</Label>
                    <p>{selectedVisitor.hostEmployee}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400">Approver</Label>
                    <p>{selectedVisitor.approver} <Badge className={`ml-1 text-[10px] ${APPROVAL_STYLES[selectedVisitor.approvalStatus]}`}>{selectedVisitor.approvalStatus}</Badge></p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400">Area</Label>
                    <p>{selectedVisitor.area.building}, {selectedVisitor.area.floor} Floor, Wing {selectedVisitor.area.wing}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400">Category</Label>
                    <Badge className={selectedVisitor.visitorType === 'relative' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}>
                      {selectedVisitor.visitorType === 'relative' ? 'Employee Relative' : 'External Visitor'}
                    </Badge>
                  </div>
                </div>
              </div>

              {selectedVisitor.materials.length > 0 && (
                <div className="border-t pt-3">
                  <p className="text-xs text-gray-400 mb-2">Accompanied Materials</p>
                  <div className="space-y-1">
                    {selectedVisitor.materials.map((m, i) => (
                      <div key={i} className="text-sm bg-gray-50 px-3 py-1.5 rounded">
                        <span className="font-medium">{m.type}</span> — {m.description}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedVisitor.vehicle && (
                <div className="border-t pt-3">
                  <p className="text-xs text-gray-400 mb-2">Vehicle</p>
                  <p className="text-sm">{selectedVisitor.vehicle.type} — {selectedVisitor.vehicle.number}</p>
                </div>
              )}

              <div className="border-t pt-3">
                <p className="text-xs text-gray-400 mb-2">Timestamps</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-gray-400">Expected Entry</Label>
                    <p>{selectedVisitor.expectedEntry}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400">Expected Exit</Label>
                    <p>{selectedVisitor.expectedExit}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400">Actual Check-In</Label>
                    <p>{selectedVisitor.actualCheckIn || '—'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400">Actual Check-Out</Label>
                    <p>{selectedVisitor.actualCheckOut || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Blacklist dialog */}
      {showBlacklist && (
        <Dialog open onOpenChange={() => setShowBlacklist(false)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertOctagon size={18} className="text-red-600" />
                Blacklisted Visitors
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {BLACKLIST.map((entry) => (
                <div key={entry.id} className="border border-red-200 rounded-lg p-3 bg-red-50/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{entry.name}</p>
                      <p className="text-xs text-gray-500">{entry.phone} &middot; {entry.company}</p>
                    </div>
                    <Badge className="bg-red-100 text-red-700">Blacklisted</Badge>
                  </div>
                  <p className="text-xs text-red-600 mt-2"><span className="font-medium">Reason:</span> {entry.reason}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Blacklisted on {entry.blacklistedOn} by {entry.blacklistedBy}
                  </p>
                </div>
              ))}
              {BLACKLIST.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-4">No blacklisted visitors</p>
              )}
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                <Ban size={14} className="mr-2" /> Add to Blacklist
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
