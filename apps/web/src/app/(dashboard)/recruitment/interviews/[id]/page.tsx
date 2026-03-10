'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  Star,
  Save,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { INTERVIEW_MODE_LABELS } from '@sarve-pratibha/shared';

interface SubCriteria {
  id: string;
  label: string;
  score: number;
}

interface ScoringCategory {
  id: string;
  label: string;
  description: string;
  subCriteria: SubCriteria[];
}

interface InterviewDetail {
  id: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  department: string;
  round: number;
  roundLabel: string;
  scheduledAt: string;
  duration: number;
  interviewerName: string;
  interviewerTitle: string;
  mode: string;
  location?: string;
  meetingLink?: string;
  result: string;
}

const MOCK_INTERVIEWS: Record<string, InterviewDetail> = {
  '1': {
    id: '1', candidateName: 'Arjun Mehta', candidateEmail: 'arjun.mehta@email.com',
    position: 'Senior Software Engineer', department: 'Engineering', round: 2, roundLabel: 'Technical Round',
    scheduledAt: '2026-03-10T10:00:00Z', duration: 60, interviewerName: 'Priya Sharma',
    interviewerTitle: 'Engineering Lead', mode: 'IN_PERSON', location: 'Conference Room A', result: 'PENDING',
  },
  '2': {
    id: '2', candidateName: 'Lakshmi Rao', candidateEmail: 'lakshmi.rao@email.com',
    position: 'Senior Software Engineer', department: 'Engineering', round: 1, roundLabel: 'Screening',
    scheduledAt: '2026-03-10T14:00:00Z', duration: 45, interviewerName: 'Vikram Singh',
    interviewerTitle: 'Tech Architect', mode: 'VIDEO', meetingLink: 'https://meet.google.com/abc-xyz', result: 'PENDING',
  },
  '3': {
    id: '3', candidateName: 'Meera Krishnan', candidateEmail: 'meera.k@email.com',
    position: 'Product Manager', department: 'Product', round: 1, roundLabel: 'Screening',
    scheduledAt: '2026-03-11T11:00:00Z', duration: 60, interviewerName: 'Rajesh Kumar',
    interviewerTitle: 'Section Head', mode: 'VIDEO', meetingLink: 'https://meet.google.com/def-ghi', result: 'PENDING',
  },
  '4': {
    id: '4', candidateName: 'Pooja Shah', candidateEmail: 'pooja.shah@email.com',
    position: 'Senior Software Engineer', department: 'Engineering', round: 1, roundLabel: 'Phone Screen',
    scheduledAt: '2026-03-12T10:30:00Z', duration: 45, interviewerName: 'Priya Sharma',
    interviewerTitle: 'Engineering Lead', mode: 'PHONE', result: 'PENDING',
  },
  '5': {
    id: '5', candidateName: 'Vivek Gupta', candidateEmail: 'vivek.g@email.com',
    position: 'Senior Software Engineer', department: 'Engineering', round: 3, roundLabel: 'HR Round',
    scheduledAt: '2026-03-08T15:00:00Z', duration: 60, interviewerName: 'Vikram Singh',
    interviewerTitle: 'Tech Architect', mode: 'IN_PERSON', location: 'Board Room', result: 'SELECTED',
  },
  '6': {
    id: '6', candidateName: 'Rohit Verma', candidateEmail: 'rohit.v@email.com',
    position: 'DevOps Engineer', department: 'Infrastructure', round: 1, roundLabel: 'Screening',
    scheduledAt: '2026-03-07T11:00:00Z', duration: 45, interviewerName: 'Rajesh Kumar',
    interviewerTitle: 'Section Head', mode: 'VIDEO', result: 'REJECTED',
  },
  '7': {
    id: '7', candidateName: 'Ananya Desai', candidateEmail: 'ananya.d@email.com',
    position: 'UX Designer', department: 'Design', round: 2, roundLabel: 'Design Challenge',
    scheduledAt: '2026-03-09T09:30:00Z', duration: 90, interviewerName: 'Priya Sharma',
    interviewerTitle: 'Engineering Lead', mode: 'IN_PERSON', location: 'Design Lab', result: 'SELECTED',
  },
  '8': {
    id: '8', candidateName: 'Karthik Nair', candidateEmail: 'karthik.n@email.com',
    position: 'Data Analyst', department: 'Analytics', round: 1, roundLabel: 'Technical Round',
    scheduledAt: '2026-03-13T16:00:00Z', duration: 60, interviewerName: 'Vikram Singh',
    interviewerTitle: 'Tech Architect', mode: 'VIDEO', meetingLink: 'https://meet.google.com/jkl-mno', result: 'PENDING',
  },
};

const INITIAL_SCORING: ScoringCategory[] = [
  {
    id: 'technical',
    label: 'Technical Skills',
    description: 'Domain knowledge, problem solving, and coding ability',
    subCriteria: [
      { id: 'domain_knowledge', label: 'Domain Knowledge', score: 0 },
      { id: 'problem_solving', label: 'Problem Solving', score: 0 },
      { id: 'coding_ability', label: 'Coding Ability', score: 0 },
    ],
  },
  {
    id: 'communication',
    label: 'Communication Skills',
    description: 'Verbal clarity, articulation, and listening',
    subCriteria: [
      { id: 'verbal_clarity', label: 'Verbal Clarity', score: 0 },
      { id: 'articulation', label: 'Articulation', score: 0 },
      { id: 'listening', label: 'Active Listening', score: 0 },
    ],
  },
  {
    id: 'cultural_fit',
    label: 'Cultural Fit',
    description: 'Values alignment, team compatibility, and attitude',
    subCriteria: [
      { id: 'values_alignment', label: 'Values Alignment', score: 0 },
      { id: 'team_compatibility', label: 'Team Compatibility', score: 0 },
      { id: 'attitude', label: 'Positive Attitude', score: 0 },
    ],
  },
  {
    id: 'experience',
    label: 'Experience Relevance',
    description: 'Past experience match and project relevance',
    subCriteria: [
      { id: 'experience_match', label: 'Past Experience Match', score: 0 },
      { id: 'project_relevance', label: 'Project Relevance', score: 0 },
    ],
  },
  {
    id: 'leadership',
    label: 'Leadership Potential',
    description: 'Initiative, decision making, and vision',
    subCriteria: [
      { id: 'initiative', label: 'Initiative', score: 0 },
      { id: 'decision_making', label: 'Decision Making', score: 0 },
      { id: 'vision', label: 'Vision & Strategy', score: 0 },
    ],
  },
];

// Pre-populated scores for completed interviews
const SAVED_SCORES: Record<string, { scoring: ScoringCategory[]; recommendation: string; feedback: string; strengths: string; weaknesses: string }> = {
  '5': {
    scoring: [
      { id: 'technical', label: 'Technical Skills', description: '', subCriteria: [
        { id: 'domain_knowledge', label: 'Domain Knowledge', score: 5 },
        { id: 'problem_solving', label: 'Problem Solving', score: 4 },
        { id: 'coding_ability', label: 'Coding Ability', score: 5 },
      ]},
      { id: 'communication', label: 'Communication Skills', description: '', subCriteria: [
        { id: 'verbal_clarity', label: 'Verbal Clarity', score: 4 },
        { id: 'articulation', label: 'Articulation', score: 4 },
        { id: 'listening', label: 'Active Listening', score: 5 },
      ]},
      { id: 'cultural_fit', label: 'Cultural Fit', description: '', subCriteria: [
        { id: 'values_alignment', label: 'Values Alignment', score: 5 },
        { id: 'team_compatibility', label: 'Team Compatibility', score: 4 },
        { id: 'attitude', label: 'Positive Attitude', score: 5 },
      ]},
      { id: 'experience', label: 'Experience Relevance', description: '', subCriteria: [
        { id: 'experience_match', label: 'Past Experience Match', score: 5 },
        { id: 'project_relevance', label: 'Project Relevance', score: 4 },
      ]},
      { id: 'leadership', label: 'Leadership Potential', description: '', subCriteria: [
        { id: 'initiative', label: 'Initiative', score: 4 },
        { id: 'decision_making', label: 'Decision Making', score: 4 },
        { id: 'vision', label: 'Vision & Strategy', score: 3 },
      ]},
    ],
    recommendation: 'STRONG_HIRE',
    feedback: 'Vivek demonstrated exceptional technical depth and clear communication throughout the interview. His system design approach was thorough and well-structured. He showed strong ownership mentality and collaborative spirit.',
    strengths: 'Deep understanding of distributed systems, excellent problem decomposition skills, strong cultural alignment with our engineering values.',
    weaknesses: 'Could improve on articulating long-term technical vision. Some hesitation on newer cloud-native patterns.',
  },
  '6': {
    scoring: [
      { id: 'technical', label: 'Technical Skills', description: '', subCriteria: [
        { id: 'domain_knowledge', label: 'Domain Knowledge', score: 2 },
        { id: 'problem_solving', label: 'Problem Solving', score: 2 },
        { id: 'coding_ability', label: 'Coding Ability', score: 3 },
      ]},
      { id: 'communication', label: 'Communication Skills', description: '', subCriteria: [
        { id: 'verbal_clarity', label: 'Verbal Clarity', score: 3 },
        { id: 'articulation', label: 'Articulation', score: 3 },
        { id: 'listening', label: 'Active Listening', score: 2 },
      ]},
      { id: 'cultural_fit', label: 'Cultural Fit', description: '', subCriteria: [
        { id: 'values_alignment', label: 'Values Alignment', score: 3 },
        { id: 'team_compatibility', label: 'Team Compatibility', score: 2 },
        { id: 'attitude', label: 'Positive Attitude', score: 3 },
      ]},
      { id: 'experience', label: 'Experience Relevance', description: '', subCriteria: [
        { id: 'experience_match', label: 'Past Experience Match', score: 2 },
        { id: 'project_relevance', label: 'Project Relevance', score: 1 },
      ]},
      { id: 'leadership', label: 'Leadership Potential', description: '', subCriteria: [
        { id: 'initiative', label: 'Initiative', score: 2 },
        { id: 'decision_making', label: 'Decision Making', score: 2 },
        { id: 'vision', label: 'Vision & Strategy', score: 1 },
      ]},
    ],
    recommendation: 'NO_HIRE',
    feedback: 'Rohit showed basic understanding of DevOps concepts but lacked depth in container orchestration and CI/CD pipeline design. He struggled with scenario-based questions about incident management.',
    strengths: 'Familiar with basic Linux administration and shell scripting. Showed willingness to learn.',
    weaknesses: 'Limited hands-on experience with Kubernetes and Terraform. Weak understanding of monitoring and observability practices. Could not articulate past project contributions clearly.',
  },
  '7': {
    scoring: [
      { id: 'technical', label: 'Technical Skills', description: '', subCriteria: [
        { id: 'domain_knowledge', label: 'Domain Knowledge', score: 5 },
        { id: 'problem_solving', label: 'Problem Solving', score: 4 },
        { id: 'coding_ability', label: 'Coding Ability', score: 4 },
      ]},
      { id: 'communication', label: 'Communication Skills', description: '', subCriteria: [
        { id: 'verbal_clarity', label: 'Verbal Clarity', score: 5 },
        { id: 'articulation', label: 'Articulation', score: 5 },
        { id: 'listening', label: 'Active Listening', score: 4 },
      ]},
      { id: 'cultural_fit', label: 'Cultural Fit', description: '', subCriteria: [
        { id: 'values_alignment', label: 'Values Alignment', score: 4 },
        { id: 'team_compatibility', label: 'Team Compatibility', score: 5 },
        { id: 'attitude', label: 'Positive Attitude', score: 5 },
      ]},
      { id: 'experience', label: 'Experience Relevance', description: '', subCriteria: [
        { id: 'experience_match', label: 'Past Experience Match', score: 4 },
        { id: 'project_relevance', label: 'Project Relevance', score: 4 },
      ]},
      { id: 'leadership', label: 'Leadership Potential', description: '', subCriteria: [
        { id: 'initiative', label: 'Initiative', score: 4 },
        { id: 'decision_making', label: 'Decision Making', score: 3 },
        { id: 'vision', label: 'Vision & Strategy', score: 4 },
      ]},
    ],
    recommendation: 'HIRE',
    feedback: 'Ananya presented an outstanding design portfolio with clear articulation of her design process. Her design challenge solution was creative and user-centered. Strong collaboration skills evident from past project discussions.',
    strengths: 'Excellent visual design skills, strong user research methodology, great presentation and storytelling ability. Portfolio showed consistent quality.',
    weaknesses: 'Limited experience with design systems at scale. Could benefit from more exposure to data-driven design decisions.',
  },
};

function getModeIcon(mode: string) {
  switch (mode) {
    case 'VIDEO': return <Video className="h-4 w-4" />;
    case 'PHONE': return <Phone className="h-4 w-4" />;
    default: return <MapPin className="h-4 w-4" />;
  }
}

function StarRating({ value, onChange, readonly }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star === value ? 0 : star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <Star
            className={`h-5 w-5 ${star <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
          />
        </button>
      ))}
    </div>
  );
}

function getCategoryAverage(subCriteria: SubCriteria[]): number {
  const scored = subCriteria.filter((s) => s.score > 0);
  if (scored.length === 0) return 0;
  return scored.reduce((sum, s) => sum + s.score, 0) / scored.length;
}

function getOverallScore(categories: ScoringCategory[]): number {
  const averages = categories.map((c) => getCategoryAverage(c.subCriteria)).filter((a) => a > 0);
  if (averages.length === 0) return 0;
  return averages.reduce((sum, a) => sum + a, 0) / averages.length;
}

function getScoreColor(score: number): string {
  if (score >= 4) return 'text-green-600';
  if (score >= 3) return 'text-amber-600';
  if (score >= 2) return 'text-orange-600';
  if (score > 0) return 'text-red-600';
  return 'text-gray-400';
}

function getRecommendationStyle(rec: string): string {
  switch (rec) {
    case 'STRONG_HIRE': return 'bg-green-100 text-green-800 border-green-200';
    case 'HIRE': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'MAYBE': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'NO_HIRE': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-gray-50 text-gray-600 border-gray-200';
  }
}

const RECOMMENDATION_OPTIONS = [
  { value: 'STRONG_HIRE', label: 'Strong Hire' },
  { value: 'HIRE', label: 'Hire' },
  { value: 'MAYBE', label: 'Maybe' },
  { value: 'NO_HIRE', label: 'No Hire' },
];

export default function InterviewAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.id as string;
  const interview = MOCK_INTERVIEWS[interviewId];

  const saved = SAVED_SCORES[interviewId];
  const [scoring, setScoring] = useState<ScoringCategory[]>(
    saved ? saved.scoring : JSON.parse(JSON.stringify(INITIAL_SCORING))
  );
  const [recommendation, setRecommendation] = useState(saved?.recommendation || '');
  const [feedback, setFeedback] = useState(saved?.feedback || '');
  const [strengths, setStrengths] = useState(saved?.strengths || '');
  const [weaknesses, setWeaknesses] = useState(saved?.weaknesses || '');
  const [submitted, setSubmitted] = useState(!!saved);

  if (!interview) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push('/recruitment/interviews')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Interviews
        </Button>
        <div className="text-center py-12 text-gray-500">Interview not found.</div>
      </div>
    );
  }

  const updateScore = (categoryId: string, subId: string, score: number) => {
    setScoring((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              subCriteria: cat.subCriteria.map((sub) =>
                sub.id === subId ? { ...sub, score } : sub
              ),
            }
          : cat
      )
    );
  };

  const overallScore = getOverallScore(scoring);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.push('/recruitment/interviews')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Interviews
      </Button>

      {/* Candidate Info Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg shrink-0">
                {interview.candidateName.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{interview.candidateName}</h1>
                <p className="text-sm text-gray-500">{interview.candidateEmail}</p>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" /> {interview.position}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" /> {interview.department}
                  </span>
                </div>
                <Badge variant="secondary" className="mt-2">
                  Round {interview.round} - {interview.roundLabel}
                </Badge>
              </div>
            </div>

            {/* Interview Details */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 lg:text-right">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-400" />
                {new Date(interview.scheduledAt).toLocaleDateString('en-IN', {
                  weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-gray-400" />
                {new Date(interview.scheduledAt).toLocaleTimeString('en-IN', {
                  hour: '2-digit', minute: '2-digit', hour12: true,
                })}
                <span className="text-gray-400">({interview.duration} min)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-gray-400" />
                {interview.interviewerName}
                <span className="text-gray-400">({interview.interviewerTitle})</span>
              </div>
              <div className="flex items-center gap-1.5">
                {getModeIcon(interview.mode)}
                {INTERVIEW_MODE_LABELS[interview.mode]}
                {interview.location && <span className="text-gray-400">- {interview.location}</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scoring Rubric - Left 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Scoring Rubric</h2>
            {scoring.map((category) => {
              const avg = getCategoryAverage(category.subCriteria);
              return (
                <Card key={category.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{category.label}</CardTitle>
                        <p className="text-xs text-gray-500 mt-0.5">{category.description}</p>
                      </div>
                      {avg > 0 && (
                        <div className={`text-lg font-bold ${getScoreColor(avg)}`}>
                          {avg.toFixed(1)}/5.0
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.subCriteria.map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between">
                          <Label className="text-sm text-gray-700 font-normal">{sub.label}</Label>
                          <StarRating
                            value={sub.score}
                            onChange={(v) => updateScore(category.id, sub.id, v)}
                            readonly={submitted}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Right Sidebar - Summary & Feedback */}
          <div className="space-y-4">
            {/* Overall Score */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Overall Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore > 0 ? overallScore.toFixed(1) : '--'}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">out of 5.0</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className="bg-teal-600 h-2 rounded-full transition-all"
                      style={{ width: `${(overallScore / 5) * 100}%` }}
                    />
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  {scoring.map((cat) => {
                    const avg = getCategoryAverage(cat.subCriteria);
                    return (
                      <div key={cat.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{cat.label}</span>
                        <span className={`font-medium ${getScoreColor(avg)}`}>
                          {avg > 0 ? avg.toFixed(1) : '--'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recommendation */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className={`text-center py-3 rounded-lg border font-semibold ${getRecommendationStyle(recommendation)}`}>
                    {RECOMMENDATION_OPTIONS.find((o) => o.value === recommendation)?.label || 'Not set'}
                  </div>
                ) : (
                  <Select value={recommendation} onValueChange={setRecommendation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recommendation" />
                    </SelectTrigger>
                    <SelectContent>
                      {RECOMMENDATION_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </CardContent>
            </Card>

            {/* Strengths */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={3}
                  placeholder="Key strengths observed..."
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  readOnly={submitted}
                  className={submitted ? 'bg-gray-50' : ''}
                />
              </CardContent>
            </Card>

            {/* Weaknesses */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Weaknesses</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={3}
                  placeholder="Areas for improvement..."
                  value={weaknesses}
                  onChange={(e) => setWeaknesses(e.target.value)}
                  readOnly={submitted}
                  className={submitted ? 'bg-gray-50' : ''}
                />
              </CardContent>
            </Card>

            {/* Detailed Feedback */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Detailed Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={4}
                  placeholder="Provide detailed interview feedback..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  readOnly={submitted}
                  className={submitted ? 'bg-gray-50' : ''}
                />
              </CardContent>
            </Card>

            {/* Submit */}
            {!submitted ? (
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                <Save className="mr-2 h-4 w-4" /> Submit Assessment
              </Button>
            ) : (
              <div className="flex items-center justify-center gap-2 text-green-600 py-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Assessment Submitted</span>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
