'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Settings,
  FileText,
  Laptop,
  CreditCard,
  IndianRupee,
  Link2,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Package,
} from 'lucide-react';

const QUICK_LINKS = [
  { label: 'Request Salary Certificate', icon: FileText, category: 'DOCUMENT', color: 'bg-blue-50 text-blue-600' },
  { label: 'Raise IT Ticket', icon: Laptop, category: 'IT_SUPPORT', color: 'bg-purple-50 text-purple-600' },
  { label: 'Request ID Card', icon: CreditCard, category: 'ID_CARD', color: 'bg-teal-50 text-teal-600' },
  { label: 'Request Asset', icon: Package, category: 'ASSET', color: 'bg-orange-50 text-orange-600' },
  { label: 'Salary Advance', icon: IndianRupee, category: 'SALARY_ADVANCE', color: 'bg-green-50 text-green-600' },
  { label: 'Employment Letter', icon: FileText, category: 'DOCUMENT', color: 'bg-pink-50 text-pink-600' },
];

const MY_REQUESTS = [
  { id: '1', type: 'Document Request', subject: 'Salary Certificate - March 2026', status: 'COMPLETED', created: '5 Mar 2026', completedDate: '6 Mar 2026' },
  { id: '2', type: 'IT Support', subject: 'Laptop keyboard replacement', status: 'IN_PROGRESS', created: '8 Mar 2026', assignedTo: 'IT Team' },
  { id: '3', type: 'Asset Request', subject: 'External monitor for WFH', status: 'PENDING_APPROVAL', created: '7 Mar 2026', approver: 'Rajesh Kumar' },
  { id: '4', type: 'ID Card', subject: 'Replacement ID card - lost', status: 'IN_PROGRESS', created: '4 Mar 2026', assignedTo: 'Admin Team' },
  { id: '5', type: 'Salary Advance', subject: 'Advance request - ₹50,000', status: 'APPROVED', created: '1 Mar 2026', approver: 'Finance Team' },
  { id: '6', type: 'Document Request', subject: 'Bonafide Certificate for Visa', status: 'PENDING_APPROVAL', created: '9 Mar 2026', approver: 'HR Team' },
];

const DOCUMENT_TYPES = [
  { value: 'salary_certificate', label: 'Salary Certificate' },
  { value: 'employment_letter', label: 'Employment Letter' },
  { value: 'bonafide_certificate', label: 'Bonafide Certificate' },
  { value: 'experience_letter', label: 'Experience Letter' },
  { value: 'relieving_letter', label: 'Relieving Letter' },
  { value: 'address_proof', label: 'Address Proof Letter' },
];

const STATUS_STYLES: Record<string, string> = {
  PENDING_APPROVAL: 'bg-yellow-100 text-yellow-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  APPROVED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-teal-100 text-teal-700',
  REJECTED: 'bg-red-100 text-red-700',
};

const STATUS_ICONS: Record<string, typeof Clock> = {
  PENDING_APPROVAL: Clock,
  IN_PROGRESS: AlertCircle,
  APPROVED: CheckCircle,
  COMPLETED: CheckCircle,
};

export default function SelfServicesPage() {
  const [docDialogOpen, setDocDialogOpen] = useState(false);
  const [itDialogOpen, setItDialogOpen] = useState(false);
  const [assetDialogOpen, setAssetDialogOpen] = useState(false);
  const [idCardDialogOpen, setIdCardDialogOpen] = useState(false);
  const [advanceDialogOpen, setAdvanceDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Self Services</h1>
          <p className="text-sm text-gray-500">Manage your requests for documents, IT support, assets, and more</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: '6', icon: Settings, color: 'text-teal-600 bg-teal-50' },
          { label: 'Pending', value: '2', icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'In Progress', value: '2', icon: AlertCircle, color: 'text-blue-600 bg-blue-50' },
          { label: 'Completed', value: '2', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Link2 size={18} className="text-teal-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {QUICK_LINKS.map((link, index) => (
              <Dialog
                key={index}
                open={
                  link.category === 'DOCUMENT' && link.label.includes('Salary') ? docDialogOpen :
                  link.category === 'IT_SUPPORT' ? itDialogOpen :
                  link.category === 'ID_CARD' ? idCardDialogOpen :
                  link.category === 'ASSET' ? assetDialogOpen :
                  link.category === 'SALARY_ADVANCE' ? advanceDialogOpen :
                  undefined
                }
                onOpenChange={
                  link.category === 'DOCUMENT' && link.label.includes('Salary') ? setDocDialogOpen :
                  link.category === 'IT_SUPPORT' ? setItDialogOpen :
                  link.category === 'ID_CARD' ? setIdCardDialogOpen :
                  link.category === 'ASSET' ? setAssetDialogOpen :
                  link.category === 'SALARY_ADVANCE' ? setAdvanceDialogOpen :
                  undefined
                }
              >
                <DialogTrigger asChild>
                  <button className="flex items-center gap-3 p-3 border rounded-lg hover:shadow-sm transition-shadow text-left w-full">
                    <div className={`p-2 rounded-lg ${link.color}`}>
                      <link.icon size={18} />
                    </div>
                    <span className="text-sm font-medium text-gray-900 flex-1">{link.label}</span>
                    <ArrowRight size={14} className="text-gray-400" />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{link.label}</DialogTitle>
                  </DialogHeader>
                  {link.category === 'DOCUMENT' ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Document Type</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Select document type" /></SelectTrigger>
                          <SelectContent>
                            {DOCUMENT_TYPES.map((doc) => (
                              <SelectItem key={doc.value} value={doc.value}>{doc.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Purpose</Label>
                        <Input placeholder="e.g., Visa application, Bank loan" />
                      </div>
                      <div>
                        <Label>Additional Notes</Label>
                        <Textarea placeholder="Any specific details needed in the document..." />
                      </div>
                      <Button className="w-full bg-teal-600 hover:bg-teal-700">Submit Request</Button>
                    </div>
                  ) : link.category === 'IT_SUPPORT' ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Issue Category</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hardware">Hardware</SelectItem>
                            <SelectItem value="software">Software</SelectItem>
                            <SelectItem value="network">Network</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="access">Access / Permissions</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Subject</Label>
                        <Input placeholder="Brief description of the issue" />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea placeholder="Detailed description of the issue..." />
                      </div>
                      <div>
                        <Label>Priority</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full bg-teal-600 hover:bg-teal-700">Submit Ticket</Button>
                    </div>
                  ) : link.category === 'ID_CARD' ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Request Type</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New ID Card</SelectItem>
                            <SelectItem value="replacement">Replacement (Lost/Damaged)</SelectItem>
                            <SelectItem value="update">Update Details</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Reason</Label>
                        <Textarea placeholder="Reason for the request..." />
                      </div>
                      <Button className="w-full bg-teal-600 hover:bg-teal-700">Submit Request</Button>
                    </div>
                  ) : link.category === 'ASSET' ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Asset Type</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Select asset type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="laptop">Laptop</SelectItem>
                            <SelectItem value="monitor">Monitor</SelectItem>
                            <SelectItem value="keyboard">Keyboard</SelectItem>
                            <SelectItem value="mouse">Mouse</SelectItem>
                            <SelectItem value="headset">Headset</SelectItem>
                            <SelectItem value="phone">Desk Phone</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Justification</Label>
                        <Textarea placeholder="Why do you need this asset?" />
                      </div>
                      <Button className="w-full bg-teal-600 hover:bg-teal-700">Submit Request</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label>Amount (₹)</Label>
                        <Input type="number" placeholder="Enter amount" />
                      </div>
                      <div>
                        <Label>Reason</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="medical">Medical Emergency</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="personal">Personal</SelectItem>
                            <SelectItem value="housing">Housing</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Repayment Tenure (months)</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Select tenure" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3 Months</SelectItem>
                            <SelectItem value="6">6 Months</SelectItem>
                            <SelectItem value="12">12 Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Details</Label>
                        <Textarea placeholder="Additional details..." />
                      </div>
                      <Button className="w-full bg-teal-600 hover:bg-teal-700">Submit Request</Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* My Requests */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="it">IT Support</TabsTrigger>
          <TabsTrigger value="assets">Assets & ID</TabsTrigger>
          <TabsTrigger value="salary">Salary Advance</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings size={18} className="text-teal-600" />
                My Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {MY_REQUESTS.map((req) => {
                  const StatusIcon = STATUS_ICONS[req.status] || Clock;
                  return (
                    <div key={req.id} className="flex items-center justify-between py-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-full ${
                          req.status === 'COMPLETED' || req.status === 'APPROVED' ? 'bg-green-100' :
                          req.status === 'IN_PROGRESS' ? 'bg-blue-100' : 'bg-yellow-100'
                        }`}>
                          <StatusIcon size={16} className={
                            req.status === 'COMPLETED' || req.status === 'APPROVED' ? 'text-green-600' :
                            req.status === 'IN_PROGRESS' ? 'text-blue-600' : 'text-yellow-600'
                          } />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900">{req.subject}</p>
                          <p className="text-xs text-gray-500">
                            {req.type} &middot; Created: {req.created}
                            {req.assignedTo && <> &middot; Assigned: {req.assignedTo}</>}
                            {req.approver && <> &middot; Approver: {req.approver}</>}
                            {req.completedDate && <> &middot; Completed: {req.completedDate}</>}
                          </p>
                        </div>
                      </div>
                      <Badge className={STATUS_STYLES[req.status] || ''}>
                        {req.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText size={18} className="text-teal-600" />
                Document Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {MY_REQUESTS.filter(r => r.type === 'Document Request').map((req) => (
                  <div key={req.id} className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">{req.subject}</p>
                      <p className="text-xs text-gray-500">Created: {req.created}</p>
                    </div>
                    <Badge className={STATUS_STYLES[req.status] || ''}>
                      {req.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="it">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Laptop size={18} className="text-teal-600" />
                IT Support Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {MY_REQUESTS.filter(r => r.type === 'IT Support').map((req) => (
                  <div key={req.id} className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">{req.subject}</p>
                      <p className="text-xs text-gray-500">Created: {req.created} {req.assignedTo && <>&middot; Assigned: {req.assignedTo}</>}</p>
                    </div>
                    <Badge className={STATUS_STYLES[req.status] || ''}>
                      {req.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Package size={18} className="text-teal-600" />
                Asset & ID Card Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {MY_REQUESTS.filter(r => r.type === 'Asset Request' || r.type === 'ID Card').map((req) => (
                  <div key={req.id} className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">{req.subject}</p>
                      <p className="text-xs text-gray-500">Created: {req.created}</p>
                    </div>
                    <Badge className={STATUS_STYLES[req.status] || ''}>
                      {req.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <IndianRupee size={18} className="text-teal-600" />
                Salary Advance Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {MY_REQUESTS.filter(r => r.type === 'Salary Advance').map((req) => (
                  <div key={req.id} className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">{req.subject}</p>
                      <p className="text-xs text-gray-500">Created: {req.created} {req.approver && <>&middot; Approver: {req.approver}</>}</p>
                    </div>
                    <Badge className={STATUS_STYLES[req.status] || ''}>
                      {req.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
