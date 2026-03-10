'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Building2,
  CreditCard,
  Heart,
  Camera,
  GraduationCap,
  Briefcase,
  AlertCircle,
  LogIn,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface CandidateDocument {
  id: string;
  documentName: string;
  documentKey: string;
  category: string;
  isRequired: boolean;
  status: 'PENDING' | 'UPLOADED' | 'VERIFIED' | 'REJECTED';
  fileName: string | null;
  fileUrl: string | null;
  reviewerComment: string | null;
  uploadedAt: string | null;
}

interface SelfServiceData {
  id?: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  bloodGroup: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  currentAddress: string;
  currentCity: string;
  currentState: string;
  currentPincode: string;
  currentCountry: string;
  permanentAddress: string;
  permanentCity: string;
  permanentState: string;
  permanentPincode: string;
  permanentCountry: string;
  sameAsCurrent: boolean;
  bankAccountNo: string;
  bankIfsc: string;
  bankName: string;
  bankBranch: string;
  uanNumber: string;
  previousPfNumber: string;
  nomineeName: string;
  nomineeRelation: string;
  nomineePercentage: number;
  nominee2Name: string;
  nominee2Relation: string;
  nominee2Percentage: number;
  isSubmitted?: boolean;
}

interface DashboardData {
  portal: {
    id: string;
    fullName: string;
    email: string;
    overallStatus: string;
    expiresAt: string;
  };
  documents: {
    total: number;
    uploaded: number;
    verified: number;
    rejected: number;
    pending: number;
    byCategory: {
      category: string;
      label: string;
      documents: CandidateDocument[];
    }[];
  };
  selfService: SelfServiceData | null;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  PERSONAL: User,
  ACADEMIC: GraduationCap,
  PROFESSIONAL: Briefcase,
  FINANCIAL: CreditCard,
  HEALTH: Heart,
  PHOTOS: Camera,
};

const CATEGORY_COLORS: Record<string, string> = {
  PERSONAL: 'text-blue-600 bg-blue-50',
  ACADEMIC: 'text-purple-600 bg-purple-50',
  PROFESSIONAL: 'text-orange-600 bg-orange-50',
  FINANCIAL: 'text-green-600 bg-green-50',
  HEALTH: 'text-red-600 bg-red-50',
  PHOTOS: 'text-pink-600 bg-pink-50',
};

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  PENDING: { color: 'bg-gray-100 text-gray-700', icon: Clock, label: 'Pending' },
  UPLOADED: { color: 'bg-blue-100 text-blue-700', icon: Upload, label: 'Uploaded' },
  VERIFIED: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Verified' },
  REJECTED: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Rejected' },
};

const emptySelfService: SelfServiceData = {
  fullName: '', dateOfBirth: '', gender: '', maritalStatus: '', bloodGroup: '',
  emergencyName: '', emergencyPhone: '', emergencyRelation: '',
  currentAddress: '', currentCity: '', currentState: '', currentPincode: '', currentCountry: 'India',
  permanentAddress: '', permanentCity: '', permanentState: '', permanentPincode: '', permanentCountry: 'India',
  sameAsCurrent: false,
  bankAccountNo: '', bankIfsc: '', bankName: '', bankBranch: '',
  uanNumber: '', previousPfNumber: '',
  nomineeName: '', nomineeRelation: '', nomineePercentage: 100,
  nominee2Name: '', nominee2Relation: '', nominee2Percentage: 0,
};

export default function CandidatePortalPage() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [selfService, setSelfService] = useState<SelfServiceData>(emptySelfService);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['PERSONAL']));
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/candidate-portal/candidate/dashboard`, {
        headers: { 'x-candidate-token': token },
      });
      const json = await res.json();
      if (json.success) {
        setDashboard(json.data);
        if (json.data.selfService) {
          setSelfService({
            ...emptySelfService,
            ...json.data.selfService,
            dateOfBirth: json.data.selfService.dateOfBirth
              ? new Date(json.data.selfService.dateOfBirth).toISOString().split('T')[0]
              : '',
          });
        }
      }
    } catch {
      // silently fail, dashboard will show empty
    }
  }, [token]);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/candidate-portal/candidate/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, accessToken: token }),
      });
      const json = await res.json();
      if (json.success) {
        setIsLoggedIn(true);
      } else {
        setError(json.message || 'Login failed');
      }
    } catch {
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchDashboard();
    }
  }, [isLoggedIn, token, fetchDashboard]);

  // Auto-login if token and email are in URL
  useEffect(() => {
    if (token && email && !isLoggedIn) {
      handleLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDocumentUpload = async (documentKey: string, file: File) => {
    // Simulate file upload - in production, upload to S3/cloud storage
    const fakeUrl = `/uploads/candidate/${Date.now()}-${file.name}`;

    try {
      const res = await fetch(`${API_BASE}/api/candidate-portal/candidate/document/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-candidate-token': token,
        },
        body: JSON.stringify({
          documentKey,
          fileName: file.name,
          fileUrl: fakeUrl,
          fileSize: file.size,
          mimeType: file.type,
        }),
      });
      const json = await res.json();
      if (json.success) {
        fetchDashboard();
      }
    } catch {
      // handle error
    }
  };

  const handleSelfServiceSubmit = async () => {
    setSubmitting(true);
    setFormSuccess('');
    setError('');
    try {
      const payload = {
        ...selfService,
        nomineePercentage: Number(selfService.nomineePercentage),
        nominee2Percentage: selfService.nominee2Percentage ? Number(selfService.nominee2Percentage) : undefined,
      };
      const res = await fetch(`${API_BASE}/api/candidate-portal/candidate/self-service`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-candidate-token': token,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setFormSuccess('Personal details submitted successfully!');
        fetchDashboard();
      } else {
        setError(json.message || 'Submission failed');
      }
    } catch {
      setError('Unable to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  // ─── LOGIN SCREEN ────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-teal-100 flex items-center justify-center mb-3">
              <LogIn className="h-7 w-7 text-teal-600" />
            </div>
            <CardTitle className="text-xl">Candidate Portal Access</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Enter your email and access token to view your onboarding documents
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="token">Access Token</Label>
              <Input
                id="token"
                type="text"
                placeholder="Enter your access token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>
            <Button
              className="w-full bg-teal-600 hover:bg-teal-700"
              onClick={handleLogin}
              disabled={loading || !email || !token}
            >
              {loading ? 'Verifying...' : 'Access Portal'}
            </Button>
            <p className="text-xs text-gray-400 text-center">
              Your access token was sent to your email along with the offer letter.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── MAIN PORTAL DASHBOARD ──────────────────────────────────
  if (!dashboard) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">Loading your portal...</p>
        </div>
      </div>
    );
  }

  const progressPercent = dashboard.documents.total > 0
    ? Math.round((dashboard.documents.uploaded / dashboard.documents.total) * 100)
    : 0;

  const overallStatusConfig: Record<string, { color: string; label: string }> = {
    INCOMPLETE: { color: 'bg-yellow-100 text-yellow-800', label: 'Incomplete' },
    UNDER_REVIEW: { color: 'bg-blue-100 text-blue-800', label: 'Under Review' },
    VERIFIED: { color: 'bg-green-100 text-green-800', label: 'Verified' },
    ISSUES_FOUND: { color: 'bg-red-100 text-red-800', label: 'Issues Found' },
  };

  const statusInfo = overallStatusConfig[dashboard.portal.overallStatus] || overallStatusConfig.INCOMPLETE;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-teal-600 to-blue-700 text-white">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Welcome, {dashboard.portal.fullName}</h2>
              <p className="text-teal-100 mt-1">
                Please upload all required documents and fill in your personal details to complete onboarding.
              </p>
            </div>
            <Badge className={`${statusInfo.color} text-sm px-3 py-1 self-start`}>
              {statusInfo.label}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Progress Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{dashboard.documents.uploaded}</p>
            <p className="text-sm text-gray-500">/ {dashboard.documents.total} Uploaded</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-3xl font-bold text-green-600">{dashboard.documents.verified}</p>
            <p className="text-sm text-gray-500">Verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-3xl font-bold text-red-600">{dashboard.documents.rejected}</p>
            <p className="text-sm text-gray-500">Rejected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">{dashboard.documents.pending}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-medium text-gray-700">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents">Document Upload</TabsTrigger>
          <TabsTrigger value="personal">Personal Details</TabsTrigger>
        </TabsList>

        {/* ─── DOCUMENTS TAB ────────────────────────────── */}
        <TabsContent value="documents" className="space-y-4">
          {dashboard.documents.byCategory.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.category] || FileText;
            const color = CATEGORY_COLORS[cat.category] || 'text-gray-600 bg-gray-50';
            const isExpanded = expandedCategories.has(cat.category);
            const catUploaded = cat.documents.filter((d) => d.status !== 'PENDING').length;

            return (
              <Card key={cat.category}>
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleCategory(cat.category)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{cat.label} Documents</CardTitle>
                        <p className="text-sm text-gray-500">
                          {catUploaded}/{cat.documents.length} uploaded
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={(catUploaded / cat.documents.length) * 100} className="w-24 h-2" />
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="space-y-3 pt-0">
                    <Separator />
                    {cat.documents.map((doc) => (
                      <DocumentUploadRow
                        key={doc.id}
                        doc={doc}
                        onUpload={(file) => handleDocumentUpload(doc.documentKey, file)}
                      />
                    ))}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </TabsContent>

        {/* ─── PERSONAL DETAILS TAB ─────────────────────── */}
        <TabsContent value="personal" className="space-y-4">
          {formSuccess && (
            <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {formSuccess}
            </div>
          )}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Personal Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-teal-600" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label>Full Name *</Label>
                <Input
                  value={selfService.fullName}
                  onChange={(e) => setSelfService({ ...selfService, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Date of Birth *</Label>
                <Input
                  type="date"
                  value={selfService.dateOfBirth}
                  onChange={(e) => setSelfService({ ...selfService, dateOfBirth: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Gender *</Label>
                <Select
                  value={selfService.gender}
                  onValueChange={(v) => setSelfService({ ...selfService, gender: v })}
                >
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Marital Status *</Label>
                <Select
                  value={selfService.maritalStatus}
                  onValueChange={(v) => setSelfService({ ...selfService, maritalStatus: v })}
                >
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SINGLE">Single</SelectItem>
                    <SelectItem value="MARRIED">Married</SelectItem>
                    <SelectItem value="DIVORCED">Divorced</SelectItem>
                    <SelectItem value="WIDOWED">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Blood Group</Label>
                <Select
                  value={selfService.bloodGroup}
                  onValueChange={(v) => setSelfService({ ...selfService, bloodGroup: v })}
                >
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Emergency Contact Name *</Label>
                <Input
                  value={selfService.emergencyName}
                  onChange={(e) => setSelfService({ ...selfService, emergencyName: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Emergency Phone *</Label>
                <Input
                  value={selfService.emergencyPhone}
                  onChange={(e) => setSelfService({ ...selfService, emergencyPhone: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Relationship *</Label>
                <Input
                  value={selfService.emergencyRelation}
                  onChange={(e) => setSelfService({ ...selfService, emergencyRelation: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Address Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-teal-600" />
                Address Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm font-medium text-gray-700">Current Address</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <Label>Address *</Label>
                  <Input
                    value={selfService.currentAddress}
                    onChange={(e) => setSelfService({ ...selfService, currentAddress: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>City *</Label>
                  <Input
                    value={selfService.currentCity}
                    onChange={(e) => setSelfService({ ...selfService, currentCity: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>State *</Label>
                  <Input
                    value={selfService.currentState}
                    onChange={(e) => setSelfService({ ...selfService, currentState: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Pincode *</Label>
                  <Input
                    value={selfService.currentPincode}
                    onChange={(e) => setSelfService({ ...selfService, currentPincode: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Country</Label>
                  <Input
                    value={selfService.currentCountry}
                    onChange={(e) => setSelfService({ ...selfService, currentCountry: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sameAddress"
                  checked={selfService.sameAsCurrent}
                  onChange={(e) => {
                    const same = e.target.checked;
                    setSelfService({
                      ...selfService,
                      sameAsCurrent: same,
                      permanentAddress: same ? selfService.currentAddress : '',
                      permanentCity: same ? selfService.currentCity : '',
                      permanentState: same ? selfService.currentState : '',
                      permanentPincode: same ? selfService.currentPincode : '',
                      permanentCountry: same ? selfService.currentCountry : '',
                    });
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="sameAddress" className="text-sm font-medium text-gray-700">
                  Permanent address same as current
                </label>
              </div>

              {!selfService.sameAsCurrent && (
                <>
                  <p className="text-sm font-medium text-gray-700">Permanent Address</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 md:col-span-2">
                      <Label>Address</Label>
                      <Input
                        value={selfService.permanentAddress}
                        onChange={(e) => setSelfService({ ...selfService, permanentAddress: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>City</Label>
                      <Input
                        value={selfService.permanentCity}
                        onChange={(e) => setSelfService({ ...selfService, permanentCity: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>State</Label>
                      <Input
                        value={selfService.permanentState}
                        onChange={(e) => setSelfService({ ...selfService, permanentState: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Pincode</Label>
                      <Input
                        value={selfService.permanentPincode}
                        onChange={(e) => setSelfService({ ...selfService, permanentPincode: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Country</Label>
                      <Input
                        value={selfService.permanentCountry}
                        onChange={(e) => setSelfService({ ...selfService, permanentCountry: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-teal-600" />
                Bank & EPF Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Account Number *</Label>
                <Input
                  value={selfService.bankAccountNo}
                  onChange={(e) => setSelfService({ ...selfService, bankAccountNo: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>IFSC Code *</Label>
                <Input
                  value={selfService.bankIfsc}
                  onChange={(e) => setSelfService({ ...selfService, bankIfsc: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Bank Name *</Label>
                <Input
                  value={selfService.bankName}
                  onChange={(e) => setSelfService({ ...selfService, bankName: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Branch</Label>
                <Input
                  value={selfService.bankBranch}
                  onChange={(e) => setSelfService({ ...selfService, bankBranch: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>UAN Number</Label>
                <Input
                  value={selfService.uanNumber}
                  onChange={(e) => setSelfService({ ...selfService, uanNumber: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Previous PF Number</Label>
                <Input
                  value={selfService.previousPfNumber}
                  onChange={(e) => setSelfService({ ...selfService, previousPfNumber: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Nominee Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-teal-600" />
                Nominee Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm font-medium text-gray-700">Primary Nominee</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label>Name *</Label>
                  <Input
                    value={selfService.nomineeName}
                    onChange={(e) => setSelfService({ ...selfService, nomineeName: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Relationship *</Label>
                  <Input
                    value={selfService.nomineeRelation}
                    onChange={(e) => setSelfService({ ...selfService, nomineeRelation: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Percentage *</Label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={selfService.nomineePercentage}
                    onChange={(e) => setSelfService({ ...selfService, nomineePercentage: Number(e.target.value) })}
                  />
                </div>
              </div>
              <Separator />
              <p className="text-sm font-medium text-gray-700">Secondary Nominee (Optional)</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input
                    value={selfService.nominee2Name}
                    onChange={(e) => setSelfService({ ...selfService, nominee2Name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Relationship</Label>
                  <Input
                    value={selfService.nominee2Relation}
                    onChange={(e) => setSelfService({ ...selfService, nominee2Relation: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Percentage</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={selfService.nominee2Percentage}
                    onChange={(e) => setSelfService({ ...selfService, nominee2Percentage: Number(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              className="bg-teal-600 hover:bg-teal-700 px-8"
              onClick={handleSelfServiceSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : selfService.isSubmitted ? 'Update Details' : 'Submit Details'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── DOCUMENT UPLOAD ROW COMPONENT ────────────────────────────

function DocumentUploadRow({
  doc,
  onUpload,
}: {
  doc: CandidateDocument;
  onUpload: (file: File) => void;
}) {
  const statusCfg = STATUS_CONFIG[doc.status];
  const StatusIcon = statusCfg.icon;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900 truncate">{doc.documentName}</p>
            {doc.isRequired && (
              <span className="text-xs text-red-500 flex-shrink-0">*Required</span>
            )}
          </div>
          {doc.fileName && (
            <p className="text-xs text-gray-500 truncate">{doc.fileName}</p>
          )}
          {doc.reviewerComment && (
            <p className="text-xs text-red-600 mt-0.5">
              Comment: {doc.reviewerComment}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <Badge className={`${statusCfg.color} flex items-center gap-1`}>
          <StatusIcon className="h-3 w-3" />
          {statusCfg.label}
        </Badge>

        {doc.status !== 'VERIFIED' && (
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileChange}
            />
            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors">
              <Upload className="h-3 w-3" />
              {doc.status === 'PENDING' ? 'Upload' : 'Re-upload'}
            </span>
          </label>
        )}
      </div>
    </div>
  );
}
