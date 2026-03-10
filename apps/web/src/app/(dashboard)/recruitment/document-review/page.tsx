'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  FileText,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  Eye,
  Download,
  MessageSquare,
  ChevronLeft,
  AlertCircle,
  User,
  Filter,
  Send,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface CandidatePortalSummary {
  id: string;
  candidateId: string;
  fullName: string;
  email: string;
  phone: string | null;
  overallStatus: string;
  isActive: boolean;
  expiresAt: string;
  lastAccessedAt: string | null;
  candidate: { id: string; firstName: string; lastName: string; currentTitle: string | null };
  documentsTotal: number;
  documentsUploaded: number;
  documentsVerified: number;
  documentsRejected: number;
  selfServiceSubmitted: boolean;
  createdAt: string;
}

interface CandidateDocument {
  id: string;
  documentName: string;
  documentKey: string;
  category: string;
  isRequired: boolean;
  status: 'PENDING' | 'UPLOADED' | 'VERIFIED' | 'REJECTED';
  fileName: string | null;
  fileUrl: string | null;
  fileSize: number | null;
  reviewerComment: string | null;
  reviewedAt: string | null;
  uploadedAt: string | null;
}

interface PortalDetail {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  overallStatus: string;
  candidate: { id: string; firstName: string; lastName: string; email: string; phone: string | null };
  documents: CandidateDocument[];
  selfServiceData: Record<string, unknown> | null;
}

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  INCOMPLETE: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Incomplete' },
  UNDER_REVIEW: { color: 'bg-blue-100 text-blue-800', icon: Eye, label: 'Under Review' },
  VERIFIED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Verified' },
  ISSUES_FOUND: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Issues Found' },
};

const DOC_STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  PENDING: { color: 'bg-gray-100 text-gray-700', icon: Clock, label: 'Pending' },
  UPLOADED: { color: 'bg-blue-100 text-blue-700', icon: Upload, label: 'Uploaded' },
  VERIFIED: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Verified' },
  REJECTED: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Rejected' },
};

export default function DocumentReviewPage() {
  const { data: session } = useSession();
  const token = (session as unknown as Record<string, unknown>)?.accessToken as string;

  const [candidates, setCandidates] = useState<CandidatePortalSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPortal, setSelectedPortal] = useState<PortalDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean;
    docId: string;
    action: 'VERIFY' | 'REJECT';
    docName: string;
  }>({ open: false, docId: '', action: 'VERIFY', docName: '' });
  const [reviewComment, setReviewComment] = useState('');
  const [queryDialog, setQueryDialog] = useState(false);
  const [queryMessage, setQueryMessage] = useState('');

  useEffect(() => {
    fetchCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, statusFilter]);

  const fetchCandidates = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
      if (search) params.set('search', search);

      const res = await fetch(`${API_BASE}/api/candidate-portal/portal/candidates?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setCandidates(json.data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = async (portalId: string) => {
    if (!token) return;
    setDetailLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/candidate-portal/portal/${portalId}/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setSelectedPortal(json.data);
      }
    } catch {
      // silently fail
    } finally {
      setDetailLoading(false);
    }
  };

  const handleReview = async () => {
    if (!token) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/candidate-portal/portal/document/${reviewDialog.docId}/review`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            action: reviewDialog.action,
            comment: reviewComment || undefined,
          }),
        },
      );
      const json = await res.json();
      if (json.success && selectedPortal) {
        fetchDetail(selectedPortal.id);
        fetchCandidates();
      }
    } catch {
      // handle error
    } finally {
      setReviewDialog({ open: false, docId: '', action: 'VERIFY', docName: '' });
      setReviewComment('');
    }
  };

  const handleRaiseQuery = async () => {
    if (!token || !selectedPortal) return;
    try {
      await fetch(`${API_BASE}/api/candidate-portal/portal/${selectedPortal.id}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: queryMessage }),
      });
      fetchCandidates();
    } catch {
      // handle error
    } finally {
      setQueryDialog(false);
      setQueryMessage('');
    }
  };

  // ─── CANDIDATE LIST VIEW ──────────────────────────────────────
  if (!selectedPortal) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Document Review</h1>
            <p className="text-gray-500 mt-1">Review candidate documents and manage onboarding submissions</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Candidates', value: candidates.length, color: 'text-gray-900' },
            { label: 'Under Review', value: candidates.filter((c) => c.overallStatus === 'UNDER_REVIEW').length, color: 'text-blue-600' },
            { label: 'Verified', value: candidates.filter((c) => c.overallStatus === 'VERIFIED').length, color: 'text-green-600' },
            { label: 'Issues Found', value: candidates.filter((c) => c.overallStatus === 'ISSUES_FOUND').length, color: 'text-red-600' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-4 pb-4 text-center">
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-9"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchCandidates()}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="INCOMPLETE">Incomplete</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="VERIFIED">Verified</SelectItem>
                  <SelectItem value="ISSUES_FOUND">Issues Found</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Candidate List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">Loading candidates...</p>
          </div>
        ) : candidates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No candidates with portal access found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {candidates.map((c) => {
              const statusCfg = STATUS_CONFIG[c.overallStatus] || STATUS_CONFIG.INCOMPLETE;
              const StatusIcon = statusCfg.icon;
              const progressPct = c.documentsTotal > 0
                ? Math.round((c.documentsUploaded / c.documentsTotal) * 100)
                : 0;

              return (
                <Card
                  key={c.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => fetchDetail(c.id)}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{c.fullName}</p>
                          <p className="text-sm text-gray-500">{c.email}</p>
                          {c.candidate?.currentTitle && (
                            <p className="text-xs text-gray-400">{c.candidate.currentTitle}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {c.documentsUploaded}/{c.documentsTotal} documents
                          </p>
                          <Progress value={progressPct} className="w-32 h-1.5 mt-1" />
                        </div>
                        <div className="flex items-center gap-2">
                          {c.selfServiceSubmitted && (
                            <Badge className="bg-teal-100 text-teal-700">Form Submitted</Badge>
                          )}
                          <Badge className={`${statusCfg.color} flex items-center gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusCfg.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ─── CANDIDATE DETAIL VIEW ────────────────────────────────────

  if (detailLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-500">Loading candidate details...</p>
      </div>
    );
  }

  const portal = selectedPortal;
  const statusCfg = STATUS_CONFIG[portal.overallStatus] || STATUS_CONFIG.INCOMPLETE;
  const StatusIcon = statusCfg.icon;

  // Group documents by category
  const categories = ['PERSONAL', 'ACADEMIC', 'PROFESSIONAL', 'FINANCIAL', 'HEALTH', 'PHOTOS'];
  const docsByCategory = categories.map((cat) => ({
    category: cat,
    label: cat.charAt(0) + cat.slice(1).toLowerCase(),
    docs: portal.documents.filter((d) => d.category === cat),
  }));

  const uploaded = portal.documents.filter((d) => d.status !== 'PENDING').length;
  const verified = portal.documents.filter((d) => d.status === 'VERIFIED').length;

  return (
    <div className="space-y-6">
      {/* Back button & header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedPortal(null)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{portal.fullName}</h1>
            <Badge className={`${statusCfg.color} flex items-center gap-1`}>
              <StatusIcon className="h-3 w-3" />
              {statusCfg.label}
            </Badge>
          </div>
          <p className="text-gray-500">{portal.email}</p>
        </div>
        <Button
          variant="outline"
          className="text-orange-600 border-orange-300 hover:bg-orange-50"
          onClick={() => setQueryDialog(true)}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Raise Query
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-2xl font-bold">{uploaded}/{portal.documents.length}</p>
            <p className="text-sm text-gray-500">Uploaded</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-2xl font-bold text-green-600">{verified}</p>
            <p className="text-sm text-gray-500">Verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-2xl font-bold text-red-600">
              {portal.documents.filter((d) => d.status === 'REJECTED').length}
            </p>
            <p className="text-sm text-gray-500">Rejected</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="documents">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents">Documents ({portal.documents.length})</TabsTrigger>
          <TabsTrigger value="selfservice">
            Self-Service Data {portal.selfServiceData ? '(Submitted)' : '(Pending)'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4 mt-4">
          {docsByCategory.map((cat) => (
            <Card key={cat.category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-700 uppercase tracking-wider">
                  {cat.label} Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {cat.docs.map((doc) => {
                  const dStatus = DOC_STATUS_CONFIG[doc.status];
                  const DIcon = dStatus.icon;

                  return (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-white"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">{doc.documentName}</p>
                            {doc.isRequired && <span className="text-xs text-red-500">*</span>}
                          </div>
                          {doc.fileName && (
                            <p className="text-xs text-gray-500 truncate">{doc.fileName}</p>
                          )}
                          {doc.reviewerComment && (
                            <p className="text-xs text-orange-600 mt-0.5">
                              Comment: {doc.reviewerComment}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className={`${dStatus.color} flex items-center gap-1`}>
                          <DIcon className="h-3 w-3" />
                          {dStatus.label}
                        </Badge>

                        {doc.status === 'UPLOADED' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-300 hover:bg-green-50 h-8"
                              onClick={() =>
                                setReviewDialog({
                                  open: true,
                                  docId: doc.id,
                                  action: 'VERIFY',
                                  docName: doc.documentName,
                                })
                              }
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verify
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-300 hover:bg-red-50 h-8"
                              onClick={() =>
                                setReviewDialog({
                                  open: true,
                                  docId: doc.id,
                                  action: 'REJECT',
                                  docName: doc.documentName,
                                })
                              }
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}

                        {doc.fileUrl && (
                          <Button size="sm" variant="ghost" className="h-8">
                            <Download className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {cat.docs.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-2">No documents in this category</p>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="selfservice" className="mt-4">
          {portal.selfServiceData ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Candidate Self-Service Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(portal.selfServiceData)
                    .filter(
                      ([key]) =>
                        !['id', 'portalAccessId', 'createdAt', 'updatedAt', 'isSubmitted', 'submittedAt'].includes(key),
                    )
                    .map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <Label className="text-xs text-gray-500 uppercase">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <p className="text-sm font-medium">
                          {value === null || value === '' ? (
                            <span className="text-gray-400">Not provided</span>
                          ) : typeof value === 'boolean' ? (
                            value ? 'Yes' : 'No'
                          ) : (
                            String(value)
                          )}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Candidate has not yet submitted their personal details</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={reviewDialog.open} onOpenChange={(open) => !open && setReviewDialog({ ...reviewDialog, open: false })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewDialog.action === 'VERIFY' ? 'Verify' : 'Reject'} Document
            </DialogTitle>
            <DialogDescription>
              {reviewDialog.action === 'VERIFY'
                ? `Confirm verification of "${reviewDialog.docName}"`
                : `Provide a reason for rejecting "${reviewDialog.docName}"`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>{reviewDialog.action === 'REJECT' ? 'Rejection Reason *' : 'Comment (optional)'}</Label>
              <Textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder={
                  reviewDialog.action === 'REJECT'
                    ? 'Please explain why this document is being rejected...'
                    : 'Add any notes...'
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialog({ ...reviewDialog, open: false })}>
              Cancel
            </Button>
            <Button
              className={
                reviewDialog.action === 'VERIFY'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
              onClick={handleReview}
              disabled={reviewDialog.action === 'REJECT' && !reviewComment.trim()}
            >
              {reviewDialog.action === 'VERIFY' ? 'Confirm Verify' : 'Confirm Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Query Dialog */}
      <Dialog open={queryDialog} onOpenChange={setQueryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Raise Query</DialogTitle>
            <DialogDescription>
              Send a notification to {portal.fullName} about their document submission.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Message *</Label>
              <Textarea
                value={queryMessage}
                onChange={(e) => setQueryMessage(e.target.value)}
                placeholder="Describe the issue or request for the candidate..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQueryDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700"
              onClick={handleRaiseQuery}
              disabled={!queryMessage.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Query
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
