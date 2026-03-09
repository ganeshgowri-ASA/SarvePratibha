'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  UserCircle,
  Phone,
  MapPin,
  CreditCard,
  Users,
  Shield,
  Landmark,
  Calendar,
  Network,
  GraduationCap,
  Briefcase,
  Edit,
  Plus,
  Trash2,
  Download,
  Check,
  Upload,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface EmployeeData {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  title?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  maritalSinceDate?: string;
  nationality?: string;
  bloodGroup?: string;
  placeOfBirth?: string;
  stateOfBirth?: string;
  religion?: string;
  identificationMark?: string;
  heightCm?: number;
  weightKg?: number;
  motherTongue?: string;
  caste?: string;
  phone?: string;
  personalEmail?: string;
  corporatePhone?: string;
  personalPhone?: string;
  residentialPhone?: string;
  officePhone?: string;
  officialEmail?: string;
  workLocation?: string;
  permanentAddress?: string;
  permanentCity?: string;
  permanentState?: string;
  permanentCountry?: string;
  permanentPincode?: string;
  panNumber?: string;
  aadharNumber?: string;
  passportNumber?: string;
  drivingLicense?: string;
  voterIdNumber?: string;
  bankAccountNo?: string;
  ifscCode?: string;
  bankName?: string;
  bankBranch?: string;
  dateOfJoining?: string;
  confirmationDate?: string;
  lastPromotionDate?: string;
  lastCertifiedDate?: string;
  profilePhoto?: string;
  employmentStatus: string;
  employmentType: string;
  department: { id: string; name: string };
  designation: { id: string; name: string };
  manager?: { id: string; firstName: string; lastName: string; employeeId: string };
  dottedLineManager?: { id: string; firstName: string; lastName: string; employeeId: string };
  orgUnitChief?: { id: string; firstName: string; lastName: string; employeeId: string };
  user: { email: string; role: string; image?: string };
  familyMembers?: Array<{
    id: string;
    name: string;
    relationship: string;
    dateOfBirth?: string;
    gender?: string;
    occupation?: string;
    phone?: string;
    isDependent: boolean;
  }>;
  nominations?: Array<{
    id: string;
    type: string;
    nomineeName: string;
    relationship: string;
    dateOfBirth?: string;
    percentage: number;
    address?: string;
  }>;
  personalDocuments?: Array<{
    id: string;
    documentType: string;
    documentNumber: string;
    fileUrl?: string;
    fileName?: string;
    isVerified: boolean;
    expiryDate?: string;
  }>;
  educationRecords?: Array<{
    id: string;
    degree: string;
    institution: string;
    university?: string;
    yearOfPassing?: number;
    percentage?: number;
    grade?: string;
    specialization?: string;
  }>;
  experienceRecords?: Array<{
    id: string;
    companyName: string;
    designation: string;
    fromDate: string;
    toDate?: string;
    isCurrent: boolean;
    reasonForLeaving?: string;
    lastDrawnSalary?: number;
    location?: string;
  }>;
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function InfoRow({ label, value }: { label: string; value: string | number | undefined | null }) {
  return (
    <div className="flex justify-between text-sm py-1.5">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900 text-right ml-4">{value || 'N/A'}</span>
    </div>
  );
}

function calculateProfileCompleteness(data: EmployeeData | null): number {
  if (!data) return 0;
  const fields = [
    data.firstName, data.lastName, data.dateOfBirth, data.gender, data.maritalStatus,
    data.nationality, data.bloodGroup, data.phone || data.personalPhone,
    data.permanentAddress, data.aadharNumber || data.panNumber,
    data.bankAccountNo, data.dateOfJoining,
    data.familyMembers?.length ? 'yes' : null,
    data.educationRecords?.length ? 'yes' : null,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

export default function PersonalDetailsPage() {
  const { data: session } = useSession();
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<string>('');
  const [editItemId, setEditItemId] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await apiFetch<EmployeeData>('/api/employees/me/profile');
      if (res.data) setEmployee(res.data);
    } catch {
      // fallback to session data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async (section: string, data: Record<string, any>) => {
    if (!employee) return;
    setSaving(true);
    try {
      await apiFetch(`/api/employees/${employee.id}/${section}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      await fetchProfile();
      setEditSection(null);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = async (type: string, data: Record<string, any>) => {
    if (!employee) return;
    setSaving(true);
    try {
      const method = editItemId ? 'PUT' : 'POST';
      const path = editItemId
        ? `/api/employees/${employee.id}/${type}/${editItemId}`
        : `/api/employees/${employee.id}/${type}`;
      await apiFetch(path, { method, body: JSON.stringify(data) });
      await fetchProfile();
      setDialogOpen(false);
      setEditItemId(null);
      setFormData({});
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (type: string, itemId: string) => {
    if (!employee) return;
    try {
      await apiFetch(`/api/employees/${employee.id}/${type}/${itemId}`, { method: 'DELETE' });
      await fetchProfile();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const openAddDialog = (type: string, item?: any) => {
    setDialogType(type);
    setFormData(item || {});
    setEditItemId(item?.id || null);
    setDialogOpen(true);
  };

  const completeness = calculateProfileCompleteness(employee);
  const initials = employee
    ? `${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase()
    : session?.user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U';

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personal Details</h1>
          <p className="text-sm text-gray-500">View and manage your personal information</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download size={16} /> Download Profile PDF
        </Button>
      </div>

      {/* Profile Summary Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-teal-600 text-white text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900">
                {employee ? `${employee.title ? employee.title + ' ' : ''}${employee.firstName} ${employee.lastName}` : session?.user?.name}
              </h2>
              <p className="text-gray-500">{employee?.designation.name || 'N/A'}</p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                <Badge className="bg-teal-100 text-teal-700">{employee?.employeeId || 'N/A'}</Badge>
                <Badge className="bg-green-100 text-green-700">{employee?.employmentStatus || 'Active'}</Badge>
                <Badge variant="secondary">{employee?.department.name || 'N/A'}</Badge>
              </div>
            </div>
            <div className="w-full sm:w-48 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Profile Completeness</span>
                <span className="font-medium text-teal-600">{completeness}%</span>
              </div>
              <Progress value={completeness} className="h-2" />
              {employee?.lastCertifiedDate && (
                <p className="text-xs text-gray-400">
                  Last certified: {formatDate(employee.lastCertifiedDate)}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accordion Sections */}
      <Accordion type="multiple" defaultValue={['basic-info']}>
        {/* a) Basic Information */}
        <AccordionItem value="basic-info">
          <AccordionTrigger className="px-4">
            <div className="flex items-center gap-2">
              <UserCircle size={18} className="text-teal-600" />
              <span>Basic Information</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <Card>
              <CardContent className="pt-4">
                {editSection === 'basic-info' ? (
                  <BasicInfoForm
                    data={employee}
                    onSave={(data) => handleSave('basic-info', data)}
                    onCancel={() => setEditSection(null)}
                    saving={saving}
                  />
                ) : (
                  <>
                    <div className="flex justify-end mb-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditSection('basic-info')}>
                        <Edit size={14} className="mr-1" /> Edit
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                      <InfoRow label="Title" value={employee?.title} />
                      <InfoRow label="First Name" value={employee?.firstName} />
                      <InfoRow label="Last Name" value={employee?.lastName} />
                      <InfoRow label="Date of Birth" value={formatDate(employee?.dateOfBirth)} />
                      <InfoRow label="Marital Status" value={employee?.maritalStatus} />
                      <InfoRow label="Since Date" value={formatDate(employee?.maritalSinceDate)} />
                      <InfoRow label="Nationality" value={employee?.nationality} />
                      <InfoRow label="Blood Group" value={employee?.bloodGroup} />
                      <InfoRow label="Place of Birth" value={employee?.placeOfBirth} />
                      <InfoRow label="State of Birth" value={employee?.stateOfBirth} />
                      <InfoRow label="Religion" value={employee?.religion} />
                      <InfoRow label="Identification Mark" value={employee?.identificationMark} />
                      <InfoRow label="Height (cm)" value={employee?.heightCm} />
                      <InfoRow label="Weight (kg)" value={employee?.weightKg} />
                      <InfoRow label="Mother Tongue" value={employee?.motherTongue} />
                      <InfoRow label="Caste" value={employee?.caste} />
                      <InfoRow label="Gender" value={employee?.gender} />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* b) Contact Information */}
        <AccordionItem value="contact-info">
          <AccordionTrigger className="px-4">
            <div className="flex items-center gap-2">
              <Phone size={18} className="text-teal-600" />
              <span>Contact Information</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <Card>
              <CardContent className="pt-4">
                {editSection === 'contact' ? (
                  <ContactForm
                    data={employee}
                    onSave={(data) => handleSave('contact', data)}
                    onCancel={() => setEditSection(null)}
                    saving={saving}
                  />
                ) : (
                  <>
                    <div className="flex justify-end mb-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditSection('contact')}>
                        <Edit size={14} className="mr-1" /> Edit
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                      <InfoRow label="Corporate No" value={employee?.corporatePhone} />
                      <InfoRow label="Personal Phone" value={employee?.personalPhone || employee?.phone} />
                      <InfoRow label="Residential Phone" value={employee?.residentialPhone} />
                      <InfoRow label="Office Phone" value={employee?.officePhone} />
                      <InfoRow label="Official Email" value={employee?.officialEmail || employee?.user.email} />
                      <InfoRow label="Personal Email" value={employee?.personalEmail} />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* c) Address */}
        <AccordionItem value="address">
          <AccordionTrigger className="px-4">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-teal-600" />
              <span>Address</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <Card>
              <CardContent className="pt-4">
                {editSection === 'address' ? (
                  <AddressForm
                    data={employee}
                    onSave={(data) => handleSave('address', data)}
                    onCancel={() => setEditSection(null)}
                    saving={saving}
                  />
                ) : (
                  <>
                    <div className="flex justify-end mb-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditSection('address')}>
                        <Edit size={14} className="mr-1" /> Edit
                      </Button>
                    </div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Work Location</h4>
                    <p className="text-sm text-gray-600 mb-4">{employee?.workLocation || 'Not set'}</p>
                    <Separator className="my-3" />
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Permanent Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                      <InfoRow label="Address" value={employee?.permanentAddress} />
                      <InfoRow label="City" value={employee?.permanentCity} />
                      <InfoRow label="State" value={employee?.permanentState} />
                      <InfoRow label="Country" value={employee?.permanentCountry} />
                      <InfoRow label="Pincode" value={employee?.permanentPincode} />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* d) Personal IDs */}
        <AccordionItem value="personal-ids">
          <AccordionTrigger className="px-4">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-teal-600" />
              <span>Personal IDs</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {[
                    { type: 'AADHAAR', label: 'Aadhaar Number', value: employee?.aadharNumber },
                    { type: 'PAN', label: 'PAN Number', value: employee?.panNumber },
                    { type: 'PASSPORT', label: 'Passport Number', value: employee?.passportNumber },
                    { type: 'DRIVING_LICENSE', label: 'Driving License', value: employee?.drivingLicense },
                    { type: 'VOTER_ID', label: 'Voter ID', value: employee?.voterIdNumber },
                  ].map((doc) => {
                    const uploaded = employee?.personalDocuments?.find(
                      (d) => d.documentType === doc.type
                    );
                    return (
                      <div
                        key={doc.type}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.label}</p>
                          <p className="text-xs text-gray-500">
                            {uploaded?.documentNumber || doc.value || 'Not provided'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {uploaded?.isVerified && (
                            <Badge className="bg-green-100 text-green-700 text-[10px]">
                              <Check size={10} className="mr-1" /> Verified
                            </Badge>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              openAddDialog('personal-ids', {
                                documentType: doc.type,
                                documentNumber: uploaded?.documentNumber || doc.value || '',
                              })
                            }
                          >
                            <Upload size={12} className="mr-1" /> Upload
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* e) Family Members */}
        <AccordionItem value="family">
          <AccordionTrigger className="px-4">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-teal-600" />
              <span>Family ({employee?.familyMembers?.length || 0})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex justify-end mb-3">
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => openAddDialog('family')}>
                    <Plus size={14} className="mr-1" /> Add Member
                  </Button>
                </div>
                {employee?.familyMembers?.length ? (
                  <div className="space-y-3">
                    {employee.familyMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-500">
                            {member.relationship} {member.dateOfBirth ? `| DOB: ${formatDate(member.dateOfBirth)}` : ''}
                            {member.occupation ? ` | ${member.occupation}` : ''}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openAddDialog('family', member)}>
                            <Edit size={14} />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteItem('family', member.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">No family members added</p>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* f) Nominations */}
        <AccordionItem value="nominations">
          <AccordionTrigger className="px-4">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-teal-600" />
              <span>Nominations ({employee?.nominations?.length || 0})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex justify-end mb-3">
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => openAddDialog('nominations')}>
                    <Plus size={14} className="mr-1" /> Add Nominee
                  </Button>
                </div>
                {employee?.nominations?.length ? (
                  <div className="space-y-3">
                    {employee.nominations.map((nom) => (
                      <div key={nom.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900">{nom.nomineeName}</p>
                            <Badge variant="secondary" className="text-[10px]">{nom.type}</Badge>
                          </div>
                          <p className="text-xs text-gray-500">{nom.relationship} | {nom.percentage}%</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openAddDialog('nominations', nom)}>
                            <Edit size={14} />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteItem('nominations', nom.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">No nominations added</p>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* g) Bank Account */}
        <AccordionItem value="bank">
          <AccordionTrigger className="px-4">
            <div className="flex items-center gap-2">
              <Landmark size={18} className="text-teal-600" />
              <span>Bank Account</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <Card>
              <CardContent className="pt-4">
                {editSection === 'bank' ? (
                  <BankForm
                    data={employee}
                    onSave={(data) => handleSave('bank', data)}
                    onCancel={() => setEditSection(null)}
                    saving={saving}
                  />
                ) : (
                  <>
                    <div className="flex justify-end mb-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditSection('bank')}>
                        <Edit size={14} className="mr-1" /> Edit
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                      <InfoRow label="Account Number" value={employee?.bankAccountNo ? `****${employee.bankAccountNo.slice(-4)}` : undefined} />
                      <InfoRow label="IFSC Code" value={employee?.ifscCode} />
                      <InfoRow label="Bank Name" value={employee?.bankName} />
                      <InfoRow label="Branch" value={employee?.bankBranch} />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* h) Important Dates */}
        <AccordionItem value="dates">
          <AccordionTrigger className="px-4">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-teal-600" />
              <span>Important Dates</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <Card>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <InfoRow label="Date of Joining" value={formatDate(employee?.dateOfJoining)} />
                  <InfoRow label="Confirmation Date" value={formatDate(employee?.confirmationDate)} />
                  <InfoRow label="Last Promotion" value={formatDate(employee?.lastPromotionDate)} />
                  <InfoRow label="Last Certified" value={formatDate(employee?.lastCertifiedDate)} />
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* i) My Team */}
        <AccordionItem value="team">
          <AccordionTrigger className="px-4">
            <div className="flex items-center gap-2">
              <Network size={18} className="text-teal-600" />
              <span>My Team</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {[
                    { label: 'Reporting Manager', person: employee?.manager, color: 'teal' },
                    { label: 'Dotted Line Manager', person: employee?.dottedLineManager, color: 'blue' },
                    { label: 'Org Unit Chief', person: employee?.orgUnitChief, color: 'purple' },
                  ].map(({ label, person, color }) => (
                    <div key={label} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={`bg-${color}-100 text-${color}-700 text-sm`}>
                          {person ? `${person.firstName[0]}${person.lastName[0]}` : 'N/A'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs text-gray-500">{label}</p>
                        <p className="text-sm font-medium text-gray-900">
                          {person ? `${person.firstName} ${person.lastName}` : 'Not assigned'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* j) Educational */}
        <AccordionItem value="education">
          <AccordionTrigger className="px-4">
            <div className="flex items-center gap-2">
              <GraduationCap size={18} className="text-teal-600" />
              <span>Educational ({employee?.educationRecords?.length || 0})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex justify-end mb-3">
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => openAddDialog('education')}>
                    <Plus size={14} className="mr-1" /> Add Education
                  </Button>
                </div>
                {employee?.educationRecords?.length ? (
                  <div className="space-y-3">
                    {employee.educationRecords.map((edu) => (
                      <div key={edu.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {edu.degree}{edu.specialization ? ` - ${edu.specialization}` : ''}
                          </p>
                          <p className="text-xs text-gray-500">
                            {edu.institution}
                            {edu.yearOfPassing ? ` | ${edu.yearOfPassing}` : ''}
                            {edu.percentage ? ` | ${edu.percentage}%` : ''}
                            {edu.grade ? ` | Grade: ${edu.grade}` : ''}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openAddDialog('education', edu)}>
                            <Edit size={14} />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteItem('education', edu.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">No education records added</p>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* k) Experience */}
        <AccordionItem value="experience">
          <AccordionTrigger className="px-4">
            <div className="flex items-center gap-2">
              <Briefcase size={18} className="text-teal-600" />
              <span>Experience ({employee?.experienceRecords?.length || 0})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex justify-end mb-3">
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => openAddDialog('experience')}>
                    <Plus size={14} className="mr-1" /> Add Experience
                  </Button>
                </div>
                {employee?.experienceRecords?.length ? (
                  <div className="space-y-3">
                    {employee.experienceRecords.map((exp) => (
                      <div key={exp.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900">{exp.designation}</p>
                            {exp.isCurrent && <Badge className="bg-green-100 text-green-700 text-[10px]">Current</Badge>}
                          </div>
                          <p className="text-xs text-gray-500">
                            {exp.companyName}{exp.location ? ` | ${exp.location}` : ''}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(exp.fromDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.toDate)}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openAddDialog('experience', exp)}>
                            <Edit size={14} />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteItem('experience', exp.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">No experience records added</p>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Dialog for adding/editing items */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editItemId ? 'Edit' : 'Add'}{' '}
              {dialogType === 'family' ? 'Family Member'
                : dialogType === 'nominations' ? 'Nomination'
                : dialogType === 'education' ? 'Education Record'
                : dialogType === 'experience' ? 'Experience Record'
                : dialogType === 'personal-ids' ? 'Document'
                : ''}
            </DialogTitle>
            <DialogDescription>Fill in the details below.</DialogDescription>
          </DialogHeader>

          {dialogType === 'family' && (
            <FamilyMemberForm data={formData} onSave={(data) => handleAddItem('family', data)} saving={saving} />
          )}
          {dialogType === 'nominations' && (
            <NominationForm data={formData} onSave={(data) => handleAddItem('nominations', data)} saving={saving} />
          )}
          {dialogType === 'education' && (
            <EducationForm data={formData} onSave={(data) => handleAddItem('education', data)} saving={saving} />
          )}
          {dialogType === 'experience' && (
            <ExperienceForm data={formData} onSave={(data) => handleAddItem('experience', data)} saving={saving} />
          )}
          {dialogType === 'personal-ids' && (
            <PersonalIdForm data={formData} onSave={(data) => handleAddItem('personal-ids', data)} saving={saving} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Inline Edit Forms ─────────────────────────────────────────────

function BasicInfoForm({ data, onSave, onCancel, saving }: { data: EmployeeData | null; onSave: (d: Record<string, any>) => void; onCancel: () => void; saving: boolean }) {
  const [form, setForm] = useState({
    title: data?.title || '', firstName: data?.firstName || '', lastName: data?.lastName || '',
    dateOfBirth: data?.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
    maritalStatus: data?.maritalStatus || '',
    maritalSinceDate: data?.maritalSinceDate ? new Date(data.maritalSinceDate).toISOString().split('T')[0] : '',
    nationality: data?.nationality || '', bloodGroup: data?.bloodGroup || '',
    placeOfBirth: data?.placeOfBirth || '', stateOfBirth: data?.stateOfBirth || '',
    religion: data?.religion || '', identificationMark: data?.identificationMark || '',
    heightCm: data?.heightCm?.toString() || '', weightKg: data?.weightKg?.toString() || '',
    motherTongue: data?.motherTongue || '', caste: data?.caste || '', gender: data?.gender || '',
  });
  const u = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>Title</Label><Select value={form.title} onChange={(e) => u('title', e.target.value)}><option value="">Select</option><option value="Mr">Mr</option><option value="Mrs">Mrs</option><option value="Ms">Ms</option><option value="Dr">Dr</option></Select></div>
        <div><Label>First Name *</Label><Input value={form.firstName} onChange={(e) => u('firstName', e.target.value)} /></div>
        <div><Label>Last Name *</Label><Input value={form.lastName} onChange={(e) => u('lastName', e.target.value)} /></div>
        <div><Label>Date of Birth</Label><Input type="date" value={form.dateOfBirth} onChange={(e) => u('dateOfBirth', e.target.value)} /></div>
        <div><Label>Gender</Label><Select value={form.gender} onChange={(e) => u('gender', e.target.value)}><option value="">Select</option><option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option></Select></div>
        <div><Label>Marital Status</Label><Select value={form.maritalStatus} onChange={(e) => u('maritalStatus', e.target.value)}><option value="">Select</option><option value="SINGLE">Single</option><option value="MARRIED">Married</option><option value="DIVORCED">Divorced</option><option value="WIDOWED">Widowed</option></Select></div>
        <div><Label>Since Date</Label><Input type="date" value={form.maritalSinceDate} onChange={(e) => u('maritalSinceDate', e.target.value)} /></div>
        <div><Label>Nationality</Label><Input value={form.nationality} onChange={(e) => u('nationality', e.target.value)} /></div>
        <div><Label>Blood Group</Label><Select value={form.bloodGroup} onChange={(e) => u('bloodGroup', e.target.value)}><option value="">Select</option>{['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg=><option key={bg} value={bg}>{bg}</option>)}</Select></div>
        <div><Label>Place of Birth</Label><Input value={form.placeOfBirth} onChange={(e) => u('placeOfBirth', e.target.value)} /></div>
        <div><Label>State of Birth</Label><Input value={form.stateOfBirth} onChange={(e) => u('stateOfBirth', e.target.value)} /></div>
        <div><Label>Religion</Label><Input value={form.religion} onChange={(e) => u('religion', e.target.value)} /></div>
        <div><Label>Identification Mark</Label><Input value={form.identificationMark} onChange={(e) => u('identificationMark', e.target.value)} /></div>
        <div><Label>Height (cm)</Label><Input type="number" value={form.heightCm} onChange={(e) => u('heightCm', e.target.value)} /></div>
        <div><Label>Weight (kg)</Label><Input type="number" value={form.weightKg} onChange={(e) => u('weightKg', e.target.value)} /></div>
        <div><Label>Mother Tongue</Label><Input value={form.motherTongue} onChange={(e) => u('motherTongue', e.target.value)} /></div>
        <div><Label>Caste</Label><Input value={form.caste} onChange={(e) => u('caste', e.target.value)} /></div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="bg-teal-600 hover:bg-teal-700" disabled={saving || !form.firstName || !form.lastName}
          onClick={() => onSave({ ...form, heightCm: form.heightCm ? Number(form.heightCm) : undefined, weightKg: form.weightKg ? Number(form.weightKg) : undefined, dateOfBirth: form.dateOfBirth || undefined, maritalSinceDate: form.maritalSinceDate || undefined, maritalStatus: form.maritalStatus || undefined, gender: form.gender || undefined })}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}

function ContactForm({ data, onSave, onCancel, saving }: { data: EmployeeData | null; onSave: (d: Record<string, any>) => void; onCancel: () => void; saving: boolean }) {
  const [form, setForm] = useState({
    corporatePhone: data?.corporatePhone || '', personalPhone: data?.personalPhone || data?.phone || '',
    residentialPhone: data?.residentialPhone || '', officePhone: data?.officePhone || '',
    officialEmail: data?.officialEmail || data?.user.email || '', personalEmail: data?.personalEmail || '',
  });
  const u = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>Corporate No</Label><Input value={form.corporatePhone} onChange={(e) => u('corporatePhone', e.target.value)} /></div>
        <div><Label>Personal Phone</Label><Input value={form.personalPhone} onChange={(e) => u('personalPhone', e.target.value)} /></div>
        <div><Label>Residential Phone</Label><Input value={form.residentialPhone} onChange={(e) => u('residentialPhone', e.target.value)} /></div>
        <div><Label>Office Phone</Label><Input value={form.officePhone} onChange={(e) => u('officePhone', e.target.value)} /></div>
        <div><Label>Official Email</Label><Input type="email" value={form.officialEmail} onChange={(e) => u('officialEmail', e.target.value)} /></div>
        <div><Label>Personal Email</Label><Input type="email" value={form.personalEmail} onChange={(e) => u('personalEmail', e.target.value)} /></div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="bg-teal-600 hover:bg-teal-700" disabled={saving} onClick={() => onSave(form)}>{saving ? 'Saving...' : 'Save'}</Button>
      </div>
    </div>
  );
}

function AddressForm({ data, onSave, onCancel, saving }: { data: EmployeeData | null; onSave: (d: Record<string, any>) => void; onCancel: () => void; saving: boolean }) {
  const [form, setForm] = useState({
    permanentAddress: data?.permanentAddress || '', permanentCity: data?.permanentCity || '',
    permanentState: data?.permanentState || '', permanentCountry: data?.permanentCountry || 'India',
    permanentPincode: data?.permanentPincode || '',
  });
  const u = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  return (
    <div className="space-y-4">
      <div className="p-3 bg-gray-50 rounded-lg mb-4">
        <p className="text-xs text-gray-500">Work Location</p>
        <p className="text-sm font-medium">{data?.workLocation || 'Not set'}</p>
      </div>
      <h4 className="text-sm font-medium text-gray-700">Permanent Address</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2"><Label>Address</Label><Textarea value={form.permanentAddress} onChange={(e) => u('permanentAddress', e.target.value)} rows={2} /></div>
        <div><Label>Pincode</Label><Input value={form.permanentPincode} onChange={(e) => u('permanentPincode', e.target.value)} placeholder="Enter pincode" /></div>
        <div><Label>City</Label><Input value={form.permanentCity} onChange={(e) => u('permanentCity', e.target.value)} /></div>
        <div><Label>State</Label><Input value={form.permanentState} onChange={(e) => u('permanentState', e.target.value)} /></div>
        <div><Label>Country</Label><Input value={form.permanentCountry} onChange={(e) => u('permanentCountry', e.target.value)} /></div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="bg-teal-600 hover:bg-teal-700" disabled={saving} onClick={() => onSave(form)}>{saving ? 'Saving...' : 'Save'}</Button>
      </div>
    </div>
  );
}

function BankForm({ data, onSave, onCancel, saving }: { data: EmployeeData | null; onSave: (d: Record<string, any>) => void; onCancel: () => void; saving: boolean }) {
  const [form, setForm] = useState({
    bankAccountNo: data?.bankAccountNo || '', ifscCode: data?.ifscCode || '',
    bankName: data?.bankName || '', bankBranch: data?.bankBranch || '',
  });
  const u = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>Account Number</Label><Input value={form.bankAccountNo} onChange={(e) => u('bankAccountNo', e.target.value)} /></div>
        <div><Label>IFSC Code</Label><Input value={form.ifscCode} onChange={(e) => u('ifscCode', e.target.value)} /></div>
        <div><Label>Bank Name</Label><Input value={form.bankName} onChange={(e) => u('bankName', e.target.value)} /></div>
        <div><Label>Branch</Label><Input value={form.bankBranch} onChange={(e) => u('bankBranch', e.target.value)} /></div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="bg-teal-600 hover:bg-teal-700" disabled={saving} onClick={() => onSave(form)}>{saving ? 'Saving...' : 'Save'}</Button>
      </div>
    </div>
  );
}

// ─── Dialog Forms ──────────────────────────────────────────────────

function FamilyMemberForm({ data, onSave, saving }: { data: Record<string, any>; onSave: (d: Record<string, any>) => void; saving: boolean }) {
  const [form, setForm] = useState({
    name: data.name || '', relationship: data.relationship || '',
    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
    gender: data.gender || '', occupation: data.occupation || '', phone: data.phone || '',
    isDependent: data.isDependent ?? true,
  });
  const u = (f: string, v: any) => setForm((p) => ({ ...p, [f]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>Name *</Label><Input value={form.name} onChange={(e) => u('name', e.target.value)} /></div>
        <div><Label>Relationship *</Label><Select value={form.relationship} onChange={(e) => u('relationship', e.target.value)}><option value="">Select</option>{['FATHER','MOTHER','SPOUSE','SON','DAUGHTER','BROTHER','SISTER','OTHER'].map(r=><option key={r} value={r}>{r}</option>)}</Select></div>
        <div><Label>Date of Birth</Label><Input type="date" value={form.dateOfBirth} onChange={(e) => u('dateOfBirth', e.target.value)} /></div>
        <div><Label>Gender</Label><Select value={form.gender} onChange={(e) => u('gender', e.target.value)}><option value="">Select</option><option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option></Select></div>
        <div><Label>Occupation</Label><Input value={form.occupation} onChange={(e) => u('occupation', e.target.value)} /></div>
        <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => u('phone', e.target.value)} /></div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={form.isDependent} onChange={(e) => u('isDependent', e.target.checked)} className="rounded" />
        <Label>Is Dependent</Label>
      </div>
      <DialogFooter>
        <Button className="bg-teal-600 hover:bg-teal-700" disabled={saving || !form.name || !form.relationship}
          onClick={() => onSave({ ...form, dateOfBirth: form.dateOfBirth || undefined, gender: form.gender || undefined })}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </div>
  );
}

function NominationForm({ data, onSave, saving }: { data: Record<string, any>; onSave: (d: Record<string, any>) => void; saving: boolean }) {
  const [form, setForm] = useState({
    type: data.type || '', nomineeName: data.nomineeName || '', relationship: data.relationship || '',
    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
    percentage: data.percentage?.toString() || '', address: data.address || '',
  });
  const u = (f: string, v: any) => setForm((p) => ({ ...p, [f]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>Type *</Label><Select value={form.type} onChange={(e) => u('type', e.target.value)}><option value="">Select</option><option value="PF">Provident Fund</option><option value="GRATUITY">Gratuity</option><option value="INSURANCE">Insurance</option></Select></div>
        <div><Label>Nominee Name *</Label><Input value={form.nomineeName} onChange={(e) => u('nomineeName', e.target.value)} /></div>
        <div><Label>Relationship *</Label><Select value={form.relationship} onChange={(e) => u('relationship', e.target.value)}><option value="">Select</option>{['FATHER','MOTHER','SPOUSE','SON','DAUGHTER','BROTHER','SISTER','OTHER'].map(r=><option key={r} value={r}>{r}</option>)}</Select></div>
        <div><Label>Date of Birth</Label><Input type="date" value={form.dateOfBirth} onChange={(e) => u('dateOfBirth', e.target.value)} /></div>
        <div><Label>Percentage *</Label><Input type="number" min="0" max="100" value={form.percentage} onChange={(e) => u('percentage', e.target.value)} /></div>
        <div className="md:col-span-2"><Label>Address</Label><Textarea value={form.address} onChange={(e) => u('address', e.target.value)} rows={2} /></div>
      </div>
      <DialogFooter>
        <Button className="bg-teal-600 hover:bg-teal-700" disabled={saving || !form.type || !form.nomineeName || !form.relationship || !form.percentage}
          onClick={() => onSave({ ...form, percentage: Number(form.percentage), dateOfBirth: form.dateOfBirth || undefined })}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </div>
  );
}

function EducationForm({ data, onSave, saving }: { data: Record<string, any>; onSave: (d: Record<string, any>) => void; saving: boolean }) {
  const [form, setForm] = useState({
    degree: data.degree || '', institution: data.institution || '', university: data.university || '',
    yearOfPassing: data.yearOfPassing?.toString() || '', percentage: data.percentage?.toString() || '',
    grade: data.grade || '', specialization: data.specialization || '',
  });
  const u = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>Degree *</Label><Input value={form.degree} onChange={(e) => u('degree', e.target.value)} /></div>
        <div><Label>Specialization</Label><Input value={form.specialization} onChange={(e) => u('specialization', e.target.value)} /></div>
        <div><Label>Institution *</Label><Input value={form.institution} onChange={(e) => u('institution', e.target.value)} /></div>
        <div><Label>University</Label><Input value={form.university} onChange={(e) => u('university', e.target.value)} /></div>
        <div><Label>Year of Passing</Label><Input type="number" value={form.yearOfPassing} onChange={(e) => u('yearOfPassing', e.target.value)} /></div>
        <div><Label>Percentage</Label><Input type="number" step="0.01" value={form.percentage} onChange={(e) => u('percentage', e.target.value)} /></div>
        <div><Label>Grade</Label><Input value={form.grade} onChange={(e) => u('grade', e.target.value)} /></div>
      </div>
      <DialogFooter>
        <Button className="bg-teal-600 hover:bg-teal-700" disabled={saving || !form.degree || !form.institution}
          onClick={() => onSave({ ...form, yearOfPassing: form.yearOfPassing ? Number(form.yearOfPassing) : undefined, percentage: form.percentage ? Number(form.percentage) : undefined })}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </div>
  );
}

function ExperienceForm({ data, onSave, saving }: { data: Record<string, any>; onSave: (d: Record<string, any>) => void; saving: boolean }) {
  const [form, setForm] = useState({
    companyName: data.companyName || '', designation: data.designation || '',
    fromDate: data.fromDate ? new Date(data.fromDate).toISOString().split('T')[0] : '',
    toDate: data.toDate ? new Date(data.toDate).toISOString().split('T')[0] : '',
    isCurrent: data.isCurrent || false, reasonForLeaving: data.reasonForLeaving || '',
    lastDrawnSalary: data.lastDrawnSalary?.toString() || '', location: data.location || '',
  });
  const u = (f: string, v: any) => setForm((p) => ({ ...p, [f]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>Company Name *</Label><Input value={form.companyName} onChange={(e) => u('companyName', e.target.value)} /></div>
        <div><Label>Designation *</Label><Input value={form.designation} onChange={(e) => u('designation', e.target.value)} /></div>
        <div><Label>From Date *</Label><Input type="date" value={form.fromDate} onChange={(e) => u('fromDate', e.target.value)} /></div>
        <div><Label>To Date</Label><Input type="date" value={form.toDate} onChange={(e) => u('toDate', e.target.value)} disabled={form.isCurrent} /></div>
        <div><Label>Location</Label><Input value={form.location} onChange={(e) => u('location', e.target.value)} /></div>
        <div><Label>Last Drawn Salary</Label><Input type="number" value={form.lastDrawnSalary} onChange={(e) => u('lastDrawnSalary', e.target.value)} /></div>
        <div className="md:col-span-2"><Label>Reason for Leaving</Label><Input value={form.reasonForLeaving} onChange={(e) => u('reasonForLeaving', e.target.value)} /></div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={form.isCurrent} onChange={(e) => u('isCurrent', e.target.checked)} className="rounded" />
        <Label>Currently working here</Label>
      </div>
      <DialogFooter>
        <Button className="bg-teal-600 hover:bg-teal-700" disabled={saving || !form.companyName || !form.designation || !form.fromDate}
          onClick={() => onSave({ ...form, toDate: form.toDate || undefined, lastDrawnSalary: form.lastDrawnSalary ? Number(form.lastDrawnSalary) : undefined })}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </div>
  );
}

function PersonalIdForm({ data, onSave, saving }: { data: Record<string, any>; onSave: (d: Record<string, any>) => void; saving: boolean }) {
  const DOC_LABELS: Record<string, string> = { AADHAAR: 'Aadhaar Number', PAN: 'PAN Number', PASSPORT: 'Passport Number', DRIVING_LICENSE: 'Driving License Number', VOTER_ID: 'Voter ID Number' };
  const [form, setForm] = useState({
    documentType: data.documentType || '', documentNumber: data.documentNumber || '',
    expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString().split('T')[0] : '',
  });
  const u = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div><Label>Document Type</Label><Select value={form.documentType} onChange={(e) => u('documentType', e.target.value)} disabled={!!data.documentType}><option value="">Select</option>{Object.entries(DOC_LABELS).map(([k,l])=><option key={k} value={k}>{l}</option>)}</Select></div>
        <div><Label>{DOC_LABELS[form.documentType] || 'Document Number'} *</Label><Input value={form.documentNumber} onChange={(e) => u('documentNumber', e.target.value)} /></div>
        {(form.documentType === 'PASSPORT' || form.documentType === 'DRIVING_LICENSE') && (
          <div><Label>Expiry Date</Label><Input type="date" value={form.expiryDate} onChange={(e) => u('expiryDate', e.target.value)} /></div>
        )}
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          <Upload size={24} className="mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">Drag & drop or click to upload document</p>
          <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 5MB</p>
        </div>
      </div>
      <DialogFooter>
        <Button className="bg-teal-600 hover:bg-teal-700" disabled={saving || !form.documentType || !form.documentNumber}
          onClick={() => onSave({ ...form, expiryDate: form.expiryDate || undefined })}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </div>
  );
}
