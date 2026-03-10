'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  CheckCircle2, Circle, User, Calendar, Building2, AlertTriangle,
  Star, ClipboardList, Users, FileCheck, Laptop, CreditCard, Car,
  BookOpen, Bus, DollarSign, Award, FileText,
} from 'lucide-react';

// --- Demo Data ---

const EMPLOYEE = {
  name: 'Rohit Sharma',
  employeeId: 'EMP-2024-012',
  department: 'Sales',
  designation: 'Senior Sales Executive',
  dateOfJoining: '2024-06-15',
  lastWorkingDate: '2026-03-31',
  reason: 'Resignation',
  manager: 'Amit Patel',
  tenure: '1 year 9 months',
};

const TASKS = [
  { id: '1', title: 'Return Company Laptop', category: 'ASSET_RETURN', description: 'Return assigned laptop and accessories to IT', isCompleted: true, completedAt: '2026-03-15' },
  { id: '2', title: 'Return ID Card & Access Card', category: 'ASSET_RETURN', description: 'Return employee ID and building access cards to security', isCompleted: true, completedAt: '2026-03-15' },
  { id: '3', title: 'Knowledge Transfer', category: 'KNOWLEDGE_TRANSFER', description: 'Complete knowledge transfer documentation and handover to team', isCompleted: true, completedAt: '2026-03-20' },
  { id: '4', title: 'Exit Interview', category: 'EXIT_INTERVIEW', description: 'Schedule and complete exit interview with HR', isCompleted: false },
  { id: '5', title: 'Full & Final Settlement', category: 'FINANCE', description: 'Process full and final settlement including leave encashment', isCompleted: false },
  { id: '6', title: 'Revoke System Access', category: 'IT_CLEARANCE', description: 'Revoke all system access (email, VPN, apps)', isCompleted: false },
  { id: '7', title: 'Clear Pending Dues', category: 'FINANCE', description: 'Clear pending reimbursements, travel advances, loans', isCompleted: false },
  { id: '8', title: 'No Objection Certificate', category: 'CLEARANCE', description: 'Obtain NOC from all departments (IT, Finance, Admin, Library)', isCompleted: false },
];

const CATEGORY_LABELS: Record<string, string> = {
  ASSET_RETURN: 'Asset Return',
  KNOWLEDGE_TRANSFER: 'Knowledge Transfer',
  EXIT_INTERVIEW: 'Exit Interview',
  FINANCE: 'Finance & Settlement',
  IT_CLEARANCE: 'IT Clearance',
  CLEARANCE: 'Department Clearance',
};

const CATEGORIES = ['ASSET_RETURN', 'KNOWLEDGE_TRANSFER', 'EXIT_INTERVIEW', 'FINANCE', 'IT_CLEARANCE', 'CLEARANCE'];

// Exit interview demo (pre-filled for Neha Agarwal who completed it)
const EXIT_INTERVIEW_DEMO = {
  reasonForLeaving: 'Better Opportunity',
  ratings: {
    'Work Environment': 4,
    'Management Support': 3,
    'Compensation & Benefits': 2,
    'Career Growth': 3,
    'Work-Life Balance': 4,
    'Team Collaboration': 5,
  },
  likedMost: 'The team culture was fantastic. My colleagues were supportive and collaborative. The flexible work-from-home policy was a great perk.',
  improvements: 'Compensation could be more competitive with market standards. More structured career progression paths would help retain talent.',
  recommend: 'Yes',
  considerReturning: 'Maybe',
  additionalComments: 'Overall a great experience. I learned a lot during my time here and would recommend this company to others.',
};

const LEAVING_REASONS = [
  'Better Opportunity', 'Compensation', 'Work-Life Balance', 'Management',
  'Career Growth', 'Relocation', 'Personal', 'Other',
];

const EXIT_RATING_CATEGORIES = [
  'Work Environment', 'Management Support', 'Compensation & Benefits',
  'Career Growth', 'Work-Life Balance', 'Team Collaboration',
];

// 360 Peer Survey demo data
const PEER_SURVEYS = [
  {
    id: '1',
    peerName: 'Ananya Desai',
    relationship: 'Team Member',
    ratings: { Collaboration: 5, Communication: 4, 'Technical Competence': 4, Reliability: 5, 'Knowledge Sharing': 4, Initiative: 3 },
    strengths: 'Rohit was always willing to help team members with client presentations. His deep understanding of the product made him invaluable during demos.',
    improvements: 'Could have been more proactive in sharing market intelligence with the broader team.',
    workAgain: 'Yes',
  },
  {
    id: '2',
    peerName: 'Vikram Joshi',
    relationship: 'Cross-team',
    ratings: { Collaboration: 4, Communication: 5, 'Technical Competence': 4, Reliability: 4, 'Knowledge Sharing': 3, Initiative: 4 },
    strengths: 'Excellent communicator who bridged the gap between sales and product teams effectively.',
    improvements: 'Sometimes could follow up more consistently on cross-team action items.',
    workAgain: 'Yes',
  },
  {
    id: '3',
    peerName: 'Meera Iyer',
    relationship: 'Team Member',
    ratings: { Collaboration: 4, Communication: 4, 'Technical Competence': 5, Reliability: 4, 'Knowledge Sharing': 5, Initiative: 4 },
    strengths: 'Rohit\'s product knowledge was exceptional. He mentored junior sales reps very well.',
    improvements: 'Could have delegated more tasks to junior team members to help them grow.',
    workAgain: 'Yes',
  },
];

const PEER_RATING_CATEGORIES = [
  'Collaboration', 'Communication', 'Technical Competence',
  'Reliability', 'Knowledge Sharing', 'Initiative',
];

// Full & Final Settlement data
const FNF_DATA = {
  assets: [
    { item: 'Laptop (Dell Latitude 5540)', status: 'Returned', date: '2026-03-15', icon: Laptop },
    { item: 'Employee ID Card', status: 'Returned', date: '2026-03-15', icon: CreditCard },
    { item: 'Access Card', status: 'Returned', date: '2026-03-15', icon: CreditCard },
    { item: 'Parking Card', status: 'Pending', date: null, icon: Car },
  ],
  noDues: [
    { department: 'IT', status: 'Cleared', clearedBy: 'Suresh K.', date: '2026-03-16' },
    { department: 'Finance', status: 'Cleared', clearedBy: 'Ravi M.', date: '2026-03-18' },
    { department: 'Admin', status: 'Pending', clearedBy: null, date: null },
    { department: 'Library', status: 'Cleared', clearedBy: 'Lakshmi P.', date: '2026-03-17' },
    { department: 'Transport', status: 'Not Applicable', clearedBy: null, date: null },
  ],
  leaveEncashment: {
    earnedLeaveBalance: 12,
    perDaySalary: '₹3,200',
    totalAmount: '₹38,400',
    status: 'Calculation Complete',
  },
  gratuity: {
    eligible: false,
    reason: 'Minimum 5 years of continuous service required (current tenure: 1 year 9 months)',
    amount: '₹0',
  },
  pfTransfer: {
    uanNumber: 'UAN-1234-5678-9012',
    currentBalance: '₹1,85,000',
    transferStatus: 'Transfer Form Pending',
    newEmployerDetails: 'To be updated by employee',
  },
  experienceLetter: {
    status: 'Draft Ready',
    generatedOn: '2026-03-20',
    approvedBy: null,
  },
};

// --- Helper Components ---

function StarRating({ value, onChange, readOnly = false }: { value: number; onChange?: (v: number) => void; readOnly?: boolean }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <Star
            size={18}
            className={star <= value ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Returned: 'bg-green-100 text-green-700',
    Cleared: 'bg-green-100 text-green-700',
    Pending: 'bg-orange-100 text-orange-700',
    'Not Applicable': 'bg-gray-100 text-gray-500',
    'Calculation Complete': 'bg-green-100 text-green-700',
    'Draft Ready': 'bg-blue-100 text-blue-700',
    'Transfer Form Pending': 'bg-orange-100 text-orange-700',
  };
  return <Badge className={colors[status] || 'bg-gray-100 text-gray-600'}>{status}</Badge>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

function AggregateRatingBar({ label, value }: { label: string; value: number }) {
  const percentage = (value / 5) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <span className="text-sm text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-900">{value.toFixed(1)}/5</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-teal-500 h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// --- Main Page ---

export default function OffboardingDetailPage() {
  const completed = TASKS.filter((t) => t.isCompleted).length;
  const progress = Math.round((completed / TASKS.length) * 100);

  // Exit interview form state
  const [exitReason, setExitReason] = useState(EXIT_INTERVIEW_DEMO.reasonForLeaving);
  const [exitRatings, setExitRatings] = useState<Record<string, number>>(EXIT_INTERVIEW_DEMO.ratings);
  const [likedMost, setLikedMost] = useState(EXIT_INTERVIEW_DEMO.likedMost);
  const [improvements, setImprovements] = useState(EXIT_INTERVIEW_DEMO.improvements);
  const [recommend, setRecommend] = useState(EXIT_INTERVIEW_DEMO.recommend);
  const [considerReturning, setConsiderReturning] = useState(EXIT_INTERVIEW_DEMO.considerReturning);
  const [additionalComments, setAdditionalComments] = useState(EXIT_INTERVIEW_DEMO.additionalComments);

  // Compute aggregate peer ratings
  const aggregateRatings: Record<string, number> = {};
  PEER_RATING_CATEGORIES.forEach((cat) => {
    const sum = PEER_SURVEYS.reduce((acc, s) => acc + (s.ratings[cat as keyof typeof s.ratings] || 0), 0);
    aggregateRatings[cat] = sum / PEER_SURVEYS.length;
  });

  return (
    <div className="space-y-6">
      {/* Employee Info */}
      <Card className="border-orange-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-orange-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{EMPLOYEE.name}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                <span>{EMPLOYEE.employeeId}</span>
                <span className="flex items-center gap-1"><Building2 size={12} /> {EMPLOYEE.department}</span>
                <span>{EMPLOYEE.designation}</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <Badge className="bg-orange-100 text-orange-700">
                  <Calendar size={10} className="mr-1" /> Last Day: {EMPLOYEE.lastWorkingDate}
                </Badge>
                <Badge variant="outline">{EMPLOYEE.reason}</Badge>
                <Badge variant="outline">Tenure: {EMPLOYEE.tenure}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Clearance Progress</span>
            <span className="text-sm font-bold text-orange-600">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-gray-500 mt-2">{completed} of {TASKS.length} tasks completed</p>
          {progress < 100 && (
            <div className="flex items-center gap-1 mt-2 text-yellow-600">
              <AlertTriangle size={14} />
              <span className="text-xs">Pending clearance items need attention before last working day</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabbed Sections */}
      <Tabs defaultValue="clearance" className="w-full">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="clearance">Clearance</TabsTrigger>
          <TabsTrigger value="exit-interview">Exit Interview</TabsTrigger>
          <TabsTrigger value="peer-survey">360° Peer Survey</TabsTrigger>
          <TabsTrigger value="fnf">F&F Settlement</TabsTrigger>
        </TabsList>

        {/* Clearance Tasks Tab */}
        <TabsContent value="clearance" className="space-y-4">
          {CATEGORIES.map((cat) => {
            const catTasks = TASKS.filter((t) => t.category === cat);
            if (catTasks.length === 0) return null;
            return (
              <Card key={cat}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{CATEGORY_LABELS[cat]}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {catTasks.map((task) => (
                    <div key={task.id} className={`flex items-center justify-between p-3 rounded-lg border ${task.isCompleted ? 'bg-green-50/50 border-green-200' : 'hover:bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        {task.isCompleted ? (
                          <CheckCircle2 size={20} className="text-green-500" fill="currentColor" />
                        ) : (
                          <Circle size={20} className="text-gray-300" />
                        )}
                        <div>
                          <p className={`text-sm ${task.isCompleted ? 'text-gray-500 line-through' : 'font-medium text-gray-900'}`}>
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-400">{task.description}</p>
                        </div>
                      </div>
                      {task.isCompleted ? (
                        <span className="text-xs text-green-600">{task.completedAt}</span>
                      ) : (
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Complete</Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Exit Interview Tab */}
        <TabsContent value="exit-interview" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList size={18} className="text-orange-600" /> Exit Interview Form
              </CardTitle>
              <p className="text-xs text-gray-500">Filled by the departing employee</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Reason for Leaving */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Reason for Leaving</Label>
                <Select value={exitReason} onValueChange={setExitReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAVING_REASONS.map((reason) => (
                      <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Ratings */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Rate your experience (1-5)</Label>
                {EXIT_RATING_CATEGORIES.map((cat) => (
                  <div key={cat} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{cat}</span>
                    <StarRating
                      value={exitRatings[cat] || 0}
                      onChange={(v) => setExitRatings((prev) => ({ ...prev, [cat]: v }))}
                    />
                  </div>
                ))}
              </div>

              <Separator />

              {/* Text Fields */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">What did you like most about working here?</Label>
                <Textarea
                  value={likedMost}
                  onChange={(e) => setLikedMost(e.target.value)}
                  rows={3}
                  placeholder="Share what you enjoyed..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">What could we improve?</Label>
                <Textarea
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  rows={3}
                  placeholder="Share your suggestions..."
                />
              </div>

              <Separator />

              {/* Yes/No/Maybe Questions */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Would you recommend this company?</Label>
                  <Select value={recommend} onValueChange={setRecommend}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Maybe">Maybe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Would you consider returning?</Label>
                  <Select value={considerReturning} onValueChange={setConsiderReturning}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Maybe">Maybe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Additional Comments */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Additional Comments</Label>
                <Textarea
                  value={additionalComments}
                  onChange={(e) => setAdditionalComments(e.target.value)}
                  rows={3}
                  placeholder="Any other feedback..."
                />
              </div>

              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                Submit Exit Interview
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 360 Peer Survey Tab */}
        <TabsContent value="peer-survey" className="space-y-4">
          {/* Aggregate Results */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users size={18} className="text-teal-600" /> Aggregate Peer Feedback
              </CardTitle>
              <p className="text-xs text-gray-500">{PEER_SURVEYS.length} peer responses (anonymized for HR view)</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {PEER_RATING_CATEGORIES.map((cat) => (
                <AggregateRatingBar key={cat} label={cat} value={aggregateRatings[cat]} />
              ))}
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Overall Average</span>
                <span className="text-lg font-bold text-teal-600">
                  {(Object.values(aggregateRatings).reduce((a, b) => a + b, 0) / PEER_RATING_CATEGORIES.length).toFixed(1)}/5
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Would work with again</span>
                <span className="text-sm font-medium text-green-600">
                  {PEER_SURVEYS.filter((s) => s.workAgain === 'Yes').length}/{PEER_SURVEYS.length} said Yes
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Individual Peer Surveys (anonymized) */}
          {PEER_SURVEYS.map((survey, index) => (
            <Card key={survey.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Peer Response #{index + 1}</CardTitle>
                  <Badge variant="outline">{survey.relationship}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PEER_RATING_CATEGORIES.map((cat) => (
                    <div key={cat} className="text-center p-2 rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-500 mb-1">{cat}</p>
                      <StarRating value={survey.ratings[cat as keyof typeof survey.ratings]} readOnly />
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Key Strengths</p>
                    <p className="text-sm text-gray-700 mt-1">{survey.strengths}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Areas for Improvement</p>
                    <p className="text-sm text-gray-700 mt-1">{survey.improvements}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Would work with again:</p>
                    <Badge className={survey.workAgain === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                      {survey.workAgain}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Full & Final Settlement Tab */}
        <TabsContent value="fnf" className="space-y-4">
          {/* Assets Returned */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Laptop size={18} className="text-orange-600" /> Assets Return Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {FNF_DATA.assets.map((asset) => {
                const Icon = asset.icon;
                return (
                  <div key={asset.item} className={`flex items-center justify-between p-3 rounded-lg border ${asset.status === 'Returned' ? 'bg-green-50/50 border-green-200' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${asset.status === 'Returned' ? 'bg-green-100' : 'bg-orange-100'}`}>
                        <Icon size={16} className={asset.status === 'Returned' ? 'text-green-600' : 'text-orange-600'} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{asset.item}</p>
                        {asset.date && <p className="text-xs text-gray-500">Returned on {asset.date}</p>}
                      </div>
                    </div>
                    <StatusBadge status={asset.status} />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* No Dues */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileCheck size={18} className="text-orange-600" /> No Dues Certificate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {FNF_DATA.noDues.map((dept) => (
                <div key={dept.department} className={`flex items-center justify-between p-3 rounded-lg border ${dept.status === 'Cleared' ? 'bg-green-50/50 border-green-200' : ''}`}>
                  <div className="flex items-center gap-3">
                    {dept.status === 'Cleared' ? (
                      <CheckCircle2 size={18} className="text-green-500" fill="currentColor" />
                    ) : dept.status === 'Pending' ? (
                      <Circle size={18} className="text-orange-400" />
                    ) : (
                      <Circle size={18} className="text-gray-300" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{dept.department}</p>
                      {dept.clearedBy && <p className="text-xs text-gray-500">Cleared by {dept.clearedBy} on {dept.date}</p>}
                    </div>
                  </div>
                  <StatusBadge status={dept.status} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Leave Encashment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign size={18} className="text-orange-600" /> Leave Encashment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-green-50 border border-green-200 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-700">{FNF_DATA.leaveEncashment.totalAmount}</p>
                    <p className="text-xs text-green-600">Total encashment amount</p>
                  </div>
                  <StatusBadge status={FNF_DATA.leaveEncashment.status} />
                </div>
              </div>
              <InfoRow label="Earned Leave Balance" value={`${FNF_DATA.leaveEncashment.earnedLeaveBalance} days`} />
              <InfoRow label="Per Day Salary" value={FNF_DATA.leaveEncashment.perDaySalary} />
              <InfoRow label="Total Amount" value={FNF_DATA.leaveEncashment.totalAmount} />
            </CardContent>
          </Card>

          {/* Gratuity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Award size={18} className="text-orange-600" /> Gratuity Eligibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg border ${FNF_DATA.gratuity.eligible ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {FNF_DATA.gratuity.eligible ? (
                    <CheckCircle2 size={18} className="text-green-600" />
                  ) : (
                    <AlertTriangle size={18} className="text-yellow-600" />
                  )}
                  <span className={`text-sm font-medium ${FNF_DATA.gratuity.eligible ? 'text-green-700' : 'text-yellow-700'}`}>
                    {FNF_DATA.gratuity.eligible ? 'Eligible' : 'Not Eligible'}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{FNF_DATA.gratuity.reason}</p>
              </div>
            </CardContent>
          </Card>

          {/* PF Transfer */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen size={18} className="text-orange-600" /> PF Transfer Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="UAN Number" value={FNF_DATA.pfTransfer.uanNumber} />
              <InfoRow label="Current Balance" value={FNF_DATA.pfTransfer.currentBalance} />
              <div className="flex items-center justify-between py-1.5">
                <span className="text-sm text-gray-500">Transfer Status</span>
                <StatusBadge status={FNF_DATA.pfTransfer.transferStatus} />
              </div>
              <InfoRow label="New Employer" value={FNF_DATA.pfTransfer.newEmployerDetails} />
              <Button className="mt-4 w-full bg-teal-600 hover:bg-teal-700" size="sm">
                Initiate PF Transfer
              </Button>
            </CardContent>
          </Card>

          {/* Experience Letter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText size={18} className="text-orange-600" /> Experience Letter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div>
                  <p className="text-sm font-medium text-blue-800">Experience Letter</p>
                  <p className="text-xs text-blue-600">Generated on {FNF_DATA.experienceLetter.generatedOn}</p>
                </div>
                <StatusBadge status={FNF_DATA.experienceLetter.status} />
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1" size="sm">
                  Preview Letter
                </Button>
                <Button className="flex-1 bg-teal-600 hover:bg-teal-700" size="sm">
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
