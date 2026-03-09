'use client';

import { useState } from 'react';
import { Plus, Search, Send, CheckCircle, XCircle, Eye, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { OFFER_STATUS_LABELS } from '@sarve-pratibha/shared';

interface Offer {
  id: string;
  candidateName: string;
  jobTitle: string;
  designation: string;
  department: string;
  grossSalary: number;
  netSalary: number;
  joiningDate: string;
  status: string;
  validUntil?: string;
  createdBy: string;
  createdAt: string;
}

const MOCK_OFFERS: Offer[] = [
  {
    id: '1', candidateName: 'Vivek Gupta', jobTitle: 'Senior Software Engineer',
    designation: 'SSE', department: 'Engineering', grossSalary: 2000000, netSalary: 1600000,
    joiningDate: '2026-04-01T00:00:00Z', status: 'SENT', validUntil: '2026-03-20T00:00:00Z',
    createdBy: 'Priya Sharma', createdAt: '2026-03-06T00:00:00Z',
  },
  {
    id: '2', candidateName: 'Priyanka Das', jobTitle: 'Senior Software Engineer',
    designation: 'SSE', department: 'Engineering', grossSalary: 1800000, netSalary: 1440000,
    joiningDate: '2026-03-15T00:00:00Z', status: 'ACCEPTED',
    createdBy: 'Priya Sharma', createdAt: '2026-02-20T00:00:00Z',
  },
  {
    id: '3', candidateName: 'Meera Krishnan', jobTitle: 'Product Manager',
    designation: 'PM', department: 'Product', grossSalary: 2500000, netSalary: 2000000,
    joiningDate: '2026-04-15T00:00:00Z', status: 'DRAFT',
    createdBy: 'Amit Patel', createdAt: '2026-03-08T00:00:00Z',
  },
  {
    id: '4', candidateName: 'Karthik Reddy', jobTitle: 'Full Stack Developer',
    designation: 'SDE II', department: 'Engineering', grossSalary: 1500000, netSalary: 1200000,
    joiningDate: '2026-04-01T00:00:00Z', status: 'PENDING_APPROVAL',
    createdBy: 'Vikram Singh', createdAt: '2026-03-07T00:00:00Z',
  },
  {
    id: '5', candidateName: 'Amit Tiwari', jobTitle: 'Junior Developer',
    designation: 'SDE I', department: 'Engineering', grossSalary: 800000, netSalary: 640000,
    joiningDate: '2026-04-01T00:00:00Z', status: 'REJECTED',
    createdBy: 'Priya Sharma', createdAt: '2026-02-25T00:00:00Z',
  },
];

function getOfferStatusVariant(status: string) {
  const map: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    DRAFT: 'secondary',
    PENDING_APPROVAL: 'outline',
    APPROVED: 'default',
    SENT: 'default',
    ACCEPTED: 'default',
    REJECTED: 'destructive',
    WITHDRAWN: 'destructive',
    EXPIRED: 'secondary',
  };
  return map[status] || 'secondary';
}

export default function OffersPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const filtered = MOCK_OFFERS.filter((o) => !statusFilter || o.status === statusFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offer Management</h1>
          <p className="text-gray-500 mt-1">Create, track, and manage offer letters</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Offer
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Draft', count: MOCK_OFFERS.filter((o) => o.status === 'DRAFT').length, color: 'text-gray-600' },
          { label: 'Pending', count: MOCK_OFFERS.filter((o) => o.status === 'PENDING_APPROVAL').length, color: 'text-yellow-600' },
          { label: 'Sent', count: MOCK_OFFERS.filter((o) => o.status === 'SENT').length, color: 'text-blue-600' },
          { label: 'Accepted', count: MOCK_OFFERS.filter((o) => o.status === 'ACCEPTED').length, color: 'text-green-600' },
          { label: 'Rejected', count: MOCK_OFFERS.filter((o) => o.status === 'REJECTED').length, color: 'text-red-600' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-4 pb-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
          <SelectTrigger className="w-48"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {Object.entries(OFFER_STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label as string}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Offers Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Candidate</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Position</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">CTC</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Joining Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Created</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((offer) => (
                  <tr key={offer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium">{offer.candidateName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{offer.designation}</p>
                      <p className="text-xs text-gray-400">{offer.department}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">₹{(offer.grossSalary / 100000).toFixed(1)}L</p>
                      <p className="text-xs text-gray-400">Net: ₹{(offer.netSalary / 100000).toFixed(1)}L</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(offer.joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getOfferStatusVariant(offer.status)}>
                        {OFFER_STATUS_LABELS[offer.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(offer.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      <br />{offer.createdBy}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setSelectedOffer(offer); setShowDetailDialog(true); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {offer.status === 'APPROVED' && (
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        {offer.status === 'PENDING_APPROVAL' && (
                          <>
                            <Button variant="ghost" size="sm" className="text-green-600">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Offer Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Offer Letter</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); setShowCreateDialog(false); }}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2">
                <Label>Application *</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select Application" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="app1">Arjun Mehta - Senior SE</SelectItem>
                    <SelectItem value="app2">Lakshmi Rao - Senior SE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Designation *</Label>
                <Input required placeholder="e.g. Senior Software Engineer" />
              </div>
              <div>
                <Label>Department *</Label>
                <Input required placeholder="e.g. Engineering" />
              </div>
              <div>
                <Label>Joining Date *</Label>
                <Input type="date" required />
              </div>
              <div>
                <Label>Valid Until</Label>
                <Input type="date" />
              </div>
              <div className="col-span-2 border-t pt-4">
                <p className="font-medium text-sm mb-3">CTC Breakup (Annual)</p>
              </div>
              <div>
                <Label>Basic Salary *</Label>
                <Input type="number" min="0" required placeholder="0" />
              </div>
              <div>
                <Label>HRA</Label>
                <Input type="number" min="0" defaultValue="0" />
              </div>
              <div>
                <Label>Conveyance</Label>
                <Input type="number" min="0" defaultValue="0" />
              </div>
              <div>
                <Label>Special Allowance</Label>
                <Input type="number" min="0" defaultValue="0" />
              </div>
              <div className="col-span-2 border-t pt-4">
                <p className="font-medium text-sm mb-3">Deductions</p>
              </div>
              <div>
                <Label>PF Contribution</Label>
                <Input type="number" min="0" defaultValue="0" />
              </div>
              <div>
                <Label>Professional Tax</Label>
                <Input type="number" min="0" defaultValue="0" />
              </div>
              <div className="col-span-2">
                <Label>Benefits / Notes</Label>
                <Textarea rows={2} placeholder="Medical insurance, stock options, etc." />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button type="submit" variant="outline">Save Draft</Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">Submit for Approval</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Offer Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Offer Details</DialogTitle>
          </DialogHeader>
          {selectedOffer && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400">Candidate</p>
                  <p className="font-medium">{selectedOffer.candidateName}</p>
                </div>
                <div>
                  <p className="text-gray-400">Position</p>
                  <p className="font-medium">{selectedOffer.designation} · {selectedOffer.department}</p>
                </div>
                <div>
                  <p className="text-gray-400">Gross CTC</p>
                  <p className="font-medium">₹{(selectedOffer.grossSalary / 100000).toFixed(1)} LPA</p>
                </div>
                <div>
                  <p className="text-gray-400">Net CTC</p>
                  <p className="font-medium">₹{(selectedOffer.netSalary / 100000).toFixed(1)} LPA</p>
                </div>
                <div>
                  <p className="text-gray-400">Joining Date</p>
                  <p className="font-medium">{new Date(selectedOffer.joiningDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <Badge variant={getOfferStatusVariant(selectedOffer.status)}>
                    {OFFER_STATUS_LABELS[selectedOffer.status]}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
