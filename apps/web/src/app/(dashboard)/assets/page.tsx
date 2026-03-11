'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Laptop, Monitor, Smartphone, Headphones, Package, Search,
  GitBranch, CheckCircle2, XCircle, Clock, Users, Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  loadApprovals,
  saveApprovals,
  addApproval,
  updateApprovalStep,
  buildAssetRequestChain,
  generateId,
  formatTimestamp,
} from '@/lib/approval-store';
import type { ApprovalRequest, ApprovalStatus } from '@/lib/approval-store';
import { ApprovalTimeline } from '@/components/approvals/approval-timeline';
import { ApprovalChainBadges } from '@/components/approvals/approval-timeline';
import Link from 'next/link';

const MY_ASSETS = [
  { id: '1', name: 'MacBook Pro 14"', assetTag: 'AST-LAP-001', category: 'Laptop', make: 'Apple', serial: 'C02XR1Z3JHD5', assignedDate: '15 Jan 2024', condition: 'Good' },
  { id: '2', name: 'Dell Monitor 27"', assetTag: 'AST-MON-015', category: 'Monitor', make: 'Dell', serial: 'DL2742HJ83', assignedDate: '15 Jan 2024', condition: 'Good' },
  { id: '3', name: 'iPhone 15 Pro', assetTag: 'AST-PHN-042', category: 'Phone', make: 'Apple', serial: 'AP15PR0823', assignedDate: '1 Mar 2025', condition: 'New' },
  { id: '4', name: 'Jabra Headset', assetTag: 'AST-ACC-110', category: 'Accessory', make: 'Jabra', serial: 'JB85H2023', assignedDate: '15 Jan 2024', condition: 'Good' },
];

const INVENTORY = [
  { id: '1', name: 'MacBook Pro 14"', assetTag: 'AST-LAP-050', category: 'Laptop', status: 'AVAILABLE', condition: 'NEW' },
  { id: '2', name: 'Dell Monitor 27"', assetTag: 'AST-MON-051', category: 'Monitor', status: 'AVAILABLE', condition: 'NEW' },
  { id: '3', name: 'ThinkPad X1 Carbon', assetTag: 'AST-LAP-048', category: 'Laptop', status: 'ASSIGNED', condition: 'GOOD', assignedTo: 'Rahul S.' },
  { id: '4', name: 'iPhone 15', assetTag: 'AST-PHN-045', category: 'Phone', status: 'UNDER_MAINTENANCE', condition: 'FAIR' },
  { id: '5', name: 'Dell XPS 15', assetTag: 'AST-LAP-030', category: 'Laptop', status: 'RETIRED', condition: 'POOR' },
];

const TEAM_ASSET_REQUESTS = [
  { id: 'tar1', employee: 'Amit Verma', empId: 'SP-ENG-004', assetType: 'Laptop', assetName: 'MacBook Pro 14"', reason: 'Current laptop failing', urgency: 'HIGH' },
  { id: 'tar2', employee: 'Sneha Gupta', empId: 'SP-ENG-005', assetType: 'Monitor', assetName: 'Dell 27" Monitor', reason: 'New workstation setup', urgency: 'MEDIUM' },
];

const CATEGORY_ICONS: Record<string, typeof Laptop> = {
  Laptop: Laptop,
  Monitor: Monitor,
  Phone: Smartphone,
  Accessory: Headphones,
};

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-700',
  ASSIGNED: 'bg-blue-100 text-blue-700',
  UNDER_MAINTENANCE: 'bg-yellow-100 text-yellow-700',
  RETIRED: 'bg-gray-100 text-gray-700',
  LOST: 'bg-red-100 text-red-700',
};

const APPROVAL_STATUS_STYLE: Record<ApprovalStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  APPROVED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
  ESCALATED: 'bg-orange-100 text-orange-700 border-orange-200',
};

export default function AssetsPage() {
  const { data: session } = useSession();
  const userName = (session?.user as any)?.name ?? 'Employee';
  const userRole = (session?.user as any)?.role as string | undefined;
  const isManager = userRole === 'MANAGER' || userRole === 'SECTION_HEAD' || userRole === 'IT_ADMIN';

  // Request form state
  const [assetType, setAssetType] = useState('Laptop');
  const [assetName, setAssetName] = useState('');
  const [reason, setReason] = useState('');
  const [urgency, setUrgency] = useState('MEDIUM');
  const [success, setSuccess] = useState('');

  const [assetApprovals, setAssetApprovals] = useState<ApprovalRequest[]>([]);
  const [teamApprovalMap, setTeamApprovalMap] = useState<Record<string, ApprovalRequest>>({});
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [actionComment, setActionComment] = useState('');

  useEffect(() => {
    const all = loadApprovals();
    const assets = all.filter((r) => r.type === 'ASSET_REQUEST');
    setAssetApprovals(assets);

    let updated = false;
    const existingIds = new Set(assets.map((r) => r.metadata?.reqId as string));
    TEAM_ASSET_REQUESTS.forEach((item) => {
      if (!existingIds.has(item.id)) {
        const req: ApprovalRequest = {
          id: generateId(),
          type: 'ASSET_REQUEST',
          title: `Asset Request — ${item.assetType}: ${item.assetName}`,
          description: item.reason,
          requestedBy: item.empId,
          requestedByName: item.employee,
          requestedAt: new Date().toISOString(),
          status: 'PENDING',
          steps: buildAssetRequestChain(),
          metadata: { reqId: item.id, assetType: item.assetType, assetName: item.assetName, urgency: item.urgency, employee: item.employee },
        };
        all.unshift(req);
        updated = true;
      }
    });

    if (updated) {
      saveApprovals(all);
      const updatedAssets = loadApprovals().filter((r) => r.type === 'ASSET_REQUEST');
      setAssetApprovals(updatedAssets);
      const map: Record<string, ApprovalRequest> = {};
      TEAM_ASSET_REQUESTS.forEach((item) => {
        const found = updatedAssets.find((r) => r.metadata?.reqId === item.id);
        if (found) map[item.id] = found;
      });
      setTeamApprovalMap(map);
    } else {
      const map: Record<string, ApprovalRequest> = {};
      TEAM_ASSET_REQUESTS.forEach((item) => {
        const found = assets.find((r) => r.metadata?.reqId === item.id);
        if (found) map[item.id] = found;
      });
      setTeamApprovalMap(map);
    }
  }, []);

  function handleSubmitRequest() {
    if (!assetType || !assetName || !reason) return;

    const req: ApprovalRequest = {
      id: generateId(),
      type: 'ASSET_REQUEST',
      title: `Asset Request — ${assetType}: ${assetName}`,
      description: reason,
      requestedBy: 'self',
      requestedByName: userName,
      requestedAt: new Date().toISOString(),
      status: 'PENDING',
      steps: buildAssetRequestChain(),
      metadata: { assetType, assetName, urgency, reason },
    };
    addApproval(req);
    setAssetApprovals(loadApprovals().filter((r) => r.type === 'ASSET_REQUEST'));
    setSelectedApproval(req);
    setSuccess(`Asset request for ${assetType} submitted. Pending L1 Manager + IT/Admin approval.`);
    setAssetName('');
    setReason('');
  }

  function handleTeamAction(approvalId: string, stepId: string, action: 'APPROVED' | 'REJECTED') {
    updateApprovalStep(approvalId, stepId, action, userName, actionComment || undefined);
    const all = loadApprovals();
    setAssetApprovals(all.filter((r) => r.type === 'ASSET_REQUEST'));
    const updated = all.find((r) => r.id === approvalId);
    const newMap = { ...teamApprovalMap };
    const key = Object.keys(newMap).find((k) => newMap[k].id === approvalId);
    if (key && updated) newMap[key] = updated;
    setTeamApprovalMap(newMap);
    setActionComment('');
  }

  const pendingTeam = Object.values(teamApprovalMap).filter((r) => r.status === 'PENDING');
  const myRequests = assetApprovals.filter((r) => r.requestedByName === userName);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asset Management</h1>
          <p className="text-sm text-gray-500">View your assigned assets and request new ones</p>
        </div>
      </div>

      <Tabs defaultValue="my-assets">
        <TabsList>
          <TabsTrigger value="my-assets">My Assets</TabsTrigger>
          <TabsTrigger value="request">
            Request Asset
            {myRequests.length > 0 && (
              <span className="ml-1 bg-teal-500 text-white text-[10px] font-bold px-1.5 rounded-full">{myRequests.length}</span>
            )}
          </TabsTrigger>
          {isManager && (
            <TabsTrigger value="approvals">
              Approvals
              {pendingTeam.length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">{pendingTeam.length}</span>
              )}
            </TabsTrigger>
          )}
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        {/* My Assets */}
        <TabsContent value="my-assets">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MY_ASSETS.map((asset) => {
              const Icon = CATEGORY_ICONS[asset.category] || Package;
              return (
                <Card key={asset.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-teal-50 rounded-lg">
                        <Icon size={24} className="text-teal-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium text-gray-900">{asset.name}</p>
                        <p className="text-xs text-gray-500">{asset.make} &middot; {asset.category}</p>
                        <div className="flex gap-4 text-xs text-gray-500 mt-2">
                          <span>Tag: {asset.assetTag}</span>
                          <span>S/N: {asset.serial}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">Assigned: {asset.assignedDate}</span>
                          <Badge className="bg-green-100 text-green-700">{asset.condition}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Request Asset */}
        <TabsContent value="request">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Package size={18} className="text-teal-600" />
                  New Asset Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                    <CheckCircle2 size={14} /> {success}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Asset Type *</Label>
                  <Select value={assetType} onValueChange={setAssetType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laptop">Laptop</SelectItem>
                      <SelectItem value="Monitor">Monitor</SelectItem>
                      <SelectItem value="Phone">Mobile Phone</SelectItem>
                      <SelectItem value="ID Card">ID Card</SelectItem>
                      <SelectItem value="Keyboard">Keyboard</SelectItem>
                      <SelectItem value="Mouse">Mouse</SelectItem>
                      <SelectItem value="Headset">Headset</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assetName">Specific Asset / Model</Label>
                  <Input id="assetName" placeholder="e.g. MacBook Pro M3, Dell 27 inch" value={assetName} onChange={(e) => setAssetName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Urgency</Label>
                  <Select value={urgency} onValueChange={setUrgency}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low — Can wait 2+ weeks</SelectItem>
                      <SelectItem value="MEDIUM">Medium — Needed within 1 week</SelectItem>
                      <SelectItem value="HIGH">High — Needed within 2 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assetReason">Reason / Justification *</Label>
                  <Textarea
                    id="assetReason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Why do you need this asset?"
                    rows={3}
                  />
                </div>

                {/* Approval chain */}
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                    <GitBranch size={12} /> Approval Chain
                  </p>
                  <ApprovalChainBadges steps={buildAssetRequestChain()} />
                  <p className="text-[10px] text-gray-400 mt-1">L1 Manager → IT / Admin team approval</p>
                </div>

                <Button
                  className="bg-teal-600 hover:bg-teal-700 w-full"
                  disabled={!assetType || !assetName || !reason}
                  onClick={handleSubmitRequest}
                >
                  Submit Asset Request
                </Button>
              </CardContent>
            </Card>

            {/* My requests list */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock size={16} className="text-teal-600" />
                  My Pending Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {myRequests.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-6">No asset requests yet</p>
                ) : (
                  <div className="space-y-3">
                    {myRequests.map((req) => (
                      <div key={req.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium">{req.title}</p>
                          <Badge className={cn('border text-xs', APPROVAL_STATUS_STYLE[req.status])}>
                            {req.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{req.description}</p>
                        <ApprovalChainBadges steps={req.steps} />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-xs text-teal-600 mt-1"
                          onClick={() => setSelectedApproval(selectedApproval?.id === req.id ? null : req)}
                        >
                          <GitBranch size={12} className="mr-1" />
                          {selectedApproval?.id === req.id ? 'Hide Timeline' : 'Show Timeline'}
                        </Button>
                        {selectedApproval?.id === req.id && (
                          <div className="mt-2 pt-2 border-t">
                            <ApprovalTimeline steps={req.steps} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Manager Approvals */}
        {isManager && (
          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users size={18} className="text-teal-600" />
                  Team Asset Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {TEAM_ASSET_REQUESTS.map((item) => {
                    const approvalReq = teamApprovalMap[item.id];
                    const activeStep = approvalReq?.steps.find((s) => s.status === 'PENDING');
                    const urgencyColors = { HIGH: 'text-red-600 bg-red-50', MEDIUM: 'text-orange-600 bg-orange-50', LOW: 'text-green-600 bg-green-50' };

                    return (
                      <div key={item.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">{item.employee} <span className="text-xs text-gray-400 font-normal">({item.empId})</span></p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded font-medium">{item.assetType}</span>
                              <span className={cn('text-xs px-2 py-0.5 rounded font-medium', urgencyColors[item.urgency as keyof typeof urgencyColors])}>
                                {item.urgency}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-0.5">{item.assetName}</p>
                            <p className="text-xs text-gray-400 italic">{item.reason}</p>
                          </div>
                          <Badge className={cn('border text-xs', approvalReq ? APPROVAL_STATUS_STYLE[approvalReq.status] : 'bg-yellow-100 text-yellow-700 border-yellow-200')}>
                            {approvalReq?.status || 'PENDING'}
                          </Badge>
                        </div>

                        {approvalReq && <ApprovalChainBadges steps={approvalReq.steps} />}

                        <div className="space-y-2">
                          <Textarea placeholder="Add comment..." rows={1} className="text-xs" value={actionComment} onChange={(e) => setActionComment(e.target.value)} />
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8 gap-1" disabled={!activeStep} onClick={() => approvalReq && activeStep && handleTeamAction(approvalReq.id, activeStep.stepId, 'APPROVED')}>
                              <CheckCircle2 size={14} /> Approve
                            </Button>
                            <Button size="sm" variant="destructive" className="h-8 gap-1" disabled={!activeStep} onClick={() => approvalReq && activeStep && handleTeamAction(approvalReq.id, activeStep.stepId, 'REJECTED')}>
                              <XCircle size={14} /> Reject
                            </Button>
                            {approvalReq && (
                              <Button size="sm" variant="outline" className="h-8 gap-1 text-teal-600 border-teal-200" onClick={() => setSelectedApproval(selectedApproval?.id === approvalReq.id ? null : approvalReq)}>
                                <GitBranch size={14} /> Timeline
                              </Button>
                            )}
                          </div>
                        </div>

                        {selectedApproval?.id === approvalReq?.id && approvalReq && (
                          <div className="border-t pt-3">
                            <ApprovalTimeline steps={approvalReq.steps} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {TEAM_ASSET_REQUESTS.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-6">No pending asset requests</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Inventory */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Asset Inventory</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input placeholder="Search assets..." className="pl-9 w-60" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All</SelectItem>
                      <SelectItem value="AVAILABLE">Available</SelectItem>
                      <SelectItem value="ASSIGNED">Assigned</SelectItem>
                      <SelectItem value="UNDER_MAINTENANCE">Maintenance</SelectItem>
                      <SelectItem value="RETIRED">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-2 font-medium">Asset</th>
                      <th className="pb-2 font-medium">Tag</th>
                      <th className="pb-2 font-medium">Category</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium">Condition</th>
                      <th className="pb-2 font-medium">Assigned To</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {INVENTORY.map((asset) => (
                      <tr key={asset.id}>
                        <td className="py-3 font-medium text-gray-900">{asset.name}</td>
                        <td className="py-3 text-gray-600">{asset.assetTag}</td>
                        <td className="py-3 text-gray-600">{asset.category}</td>
                        <td className="py-3">
                          <Badge className={STATUS_STYLES[asset.status] || ''}>{asset.status.replace(/_/g, ' ')}</Badge>
                        </td>
                        <td className="py-3 text-gray-600">{asset.condition}</td>
                        <td className="py-3 text-gray-600">{(asset as Record<string, unknown>).assignedTo as string || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
