'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Star,
  ExternalLink,
  Tag,
  Plus,
  Target,
  FileText,
  BarChart3,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SOURCE_LABELS, RECOMMENDATION_LABELS } from '@sarve-pratibha/shared';
import { ProfileMatchScore } from '@/components/recruitment/profile-match-score';
import { RadarChart } from '@/components/recruitment/radar-chart';
import { ResumeHighlightsPanel } from '@/components/recruitment/resume-highlights';
import { InterviewVsJD } from '@/components/recruitment/interview-vs-jd';
import {
  SENIOR_SWE_JD,
  getCandidateComparisonData,
} from '@/components/recruitment/jd-comparison-data';

// ─── Mock Candidates ──────────────────────────────────────────────

const MOCK_CANDIDATES: Record<string, typeof MOCK_CANDIDATE_1> = {};

const MOCK_CANDIDATE_1 = {
  id: '1',
  firstName: 'Arjun',
  lastName: 'Mehta',
  email: 'arjun.mehta@email.com',
  phone: '+91-9876543210',
  currentCompany: 'TCS',
  currentTitle: 'Senior Software Engineer',
  totalExp: 5,
  currentSalary: 1200000,
  expectedSalary: 1800000,
  source: 'LINKEDIN',
  linkedinUrl: 'https://linkedin.com/in/arjunmehta',
  skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker', 'MongoDB', 'Python', 'REST APIs', 'Git'],
  location: 'Bangalore',
  notes: 'Strong candidate with excellent communication skills. Previously worked on large-scale distributed systems.',
  tags: [{ id: '1', tag: 'frontend' }, { id: '2', tag: 'fullstack' }, { id: '3', tag: 'top-talent' }],
  applications: [
    {
      id: 'app1',
      stage: 'INTERVIEW',
      status: 'INTERVIEW_SCHEDULED',
      createdAt: '2026-02-20T00:00:00Z',
      jobPosting: { id: 'jp1', title: 'Senior Software Engineer', department: { name: 'Engineering' } },
      interviews: [
        {
          id: 'int1',
          scheduledAt: '2026-03-05T10:00:00Z',
          round: 1,
          mode: 'VIDEO',
          result: 'SELECTED',
          interviewer: { firstName: 'Vikram', lastName: 'Singh' },
          feedbacks: [
            {
              technicalRating: 4,
              communicationRating: 5,
              cultureFitRating: 4,
              overallRating: 4.3,
              recommendation: 'HIRE',
              strengths: 'Strong problem-solving skills, excellent communication',
              weaknesses: 'Could improve on system design patterns',
              comments: 'Good candidate, recommend for next round.',
            },
          ],
        },
        {
          id: 'int2',
          scheduledAt: '2026-03-10T14:00:00Z',
          round: 2,
          mode: 'IN_PERSON',
          result: 'PENDING',
          interviewer: { firstName: 'Priya', lastName: 'Sharma' },
          feedbacks: [],
        },
      ],
      offer: null,
    },
  ],
  talentPools: [{ talentPool: { id: 'tp1', name: 'Engineering Talent' } }],
};
MOCK_CANDIDATES['1'] = MOCK_CANDIDATE_1;

MOCK_CANDIDATES['2'] = {
  id: '2',
  firstName: 'Priya',
  lastName: 'Sharma',
  email: 'priya.sharma@email.com',
  phone: '+91-9876543220',
  currentCompany: 'Flipkart',
  currentTitle: 'Software Engineer II',
  totalExp: 6,
  currentSalary: 1500000,
  expectedSalary: 2200000,
  source: 'NAUKRI',
  linkedinUrl: 'https://linkedin.com/in/priyasharma',
  skills: ['React', 'Node.js', 'TypeScript', 'MySQL', 'GraphQL', 'Redis', 'Docker', 'Angular', 'REST APIs', 'Git', 'CI/CD'],
  location: 'Bangalore',
  notes: 'Solid full-stack developer with good GraphQL experience. Strong frontend focus.',
  tags: [{ id: '4', tag: 'fullstack' }, { id: '5', tag: 'frontend' }],
  applications: [
    {
      id: 'app3',
      stage: 'INTERVIEW',
      status: 'INTERVIEW_SCHEDULED',
      createdAt: '2026-02-25T00:00:00Z',
      jobPosting: { id: 'jp1', title: 'Senior Software Engineer', department: { name: 'Engineering' } },
      interviews: [
        {
          id: 'int4',
          scheduledAt: '2026-03-07T11:00:00Z',
          round: 1,
          mode: 'VIDEO',
          result: 'SELECTED',
          interviewer: { firstName: 'Vikram', lastName: 'Singh' },
          feedbacks: [
            {
              technicalRating: 4,
              communicationRating: 4,
              cultureFitRating: 3,
              overallRating: 3.7,
              recommendation: 'HIRE',
              strengths: 'Good React and frontend skills, GraphQL experience',
              weaknesses: 'Needs improvement in system design and SQL databases',
              comments: 'Solid candidate, can grow into the role.',
            },
          ],
        },
      ],
      offer: null,
    },
  ],
  talentPools: [],
};

MOCK_CANDIDATES['3'] = {
  id: '3',
  firstName: 'Vikram',
  lastName: 'Desai',
  email: 'vikram.desai@email.com',
  phone: '+91-9876543230',
  currentCompany: 'Amazon',
  currentTitle: 'SDE-2',
  totalExp: 8,
  currentSalary: 2500000,
  expectedSalary: 3500000,
  source: 'LINKEDIN',
  linkedinUrl: 'https://linkedin.com/in/vikramdesai',
  skills: ['Java', 'Spring Boot', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Kafka', 'Redis', 'REST APIs', 'Git', 'CI/CD'],
  location: 'Hyderabad',
  notes: 'Backend-heavy profile but extremely strong in distributed systems and cloud infra.',
  tags: [{ id: '6', tag: 'backend' }, { id: '7', tag: 'cloud' }],
  applications: [
    {
      id: 'app4',
      stage: 'INTERVIEW',
      status: 'INTERVIEW_COMPLETED',
      createdAt: '2026-02-18T00:00:00Z',
      jobPosting: { id: 'jp1', title: 'Senior Software Engineer', department: { name: 'Engineering' } },
      interviews: [
        {
          id: 'int5',
          scheduledAt: '2026-03-01T10:00:00Z',
          round: 1,
          mode: 'VIDEO',
          result: 'SELECTED',
          interviewer: { firstName: 'Rajesh', lastName: 'Kumar' },
          feedbacks: [
            {
              technicalRating: 4,
              communicationRating: 3,
              cultureFitRating: 3,
              overallRating: 3.5,
              recommendation: 'HIRE',
              strengths: 'Excellent backend and system design skills, strong AWS knowledge',
              weaknesses: 'No frontend (React) experience, communication could be better',
              comments: 'Great for backend role but this position needs full-stack.',
            },
          ],
        },
      ],
      offer: null,
    },
  ],
  talentPools: [{ talentPool: { id: 'tp2', name: 'Backend Specialists' } }],
};

MOCK_CANDIDATES['4'] = {
  id: '4',
  firstName: 'Sneha',
  lastName: 'Patel',
  email: 'sneha.patel@email.com',
  phone: '+91-9876543240',
  currentCompany: 'Razorpay',
  currentTitle: 'ML Engineer',
  totalExp: 3,
  currentSalary: 1800000,
  expectedSalary: 2400000,
  source: 'CAREER_PAGE',
  linkedinUrl: 'https://linkedin.com/in/snehapatel',
  skills: ['Python', 'Django', 'TensorFlow', 'PyTorch', 'Machine Learning', 'REST APIs', 'SQL', 'Git', 'Pandas', 'NumPy'],
  location: 'Pune',
  notes: 'ML background with strong academics. Misaligned with SWE role requirements.',
  tags: [{ id: '8', tag: 'ml-engineer' }],
  applications: [
    {
      id: 'app5',
      stage: 'INTERVIEW',
      status: 'INTERVIEW_COMPLETED',
      createdAt: '2026-03-01T00:00:00Z',
      jobPosting: { id: 'jp1', title: 'Senior Software Engineer', department: { name: 'Engineering' } },
      interviews: [
        {
          id: 'int6',
          scheduledAt: '2026-03-08T14:00:00Z',
          round: 1,
          mode: 'VIDEO',
          result: 'REJECTED',
          interviewer: { firstName: 'Vikram', lastName: 'Singh' },
          feedbacks: [
            {
              technicalRating: 2,
              communicationRating: 4,
              cultureFitRating: 4,
              overallRating: 3.0,
              recommendation: 'NO_HIRE',
              strengths: 'Excellent academics, strong problem-solving ability, good communication',
              weaknesses: 'No React/Node.js/TypeScript experience, insufficient web dev background',
              comments: 'Not suitable for this SWE role. Would be great for ML Engineer position.',
            },
          ],
        },
      ],
      offer: null,
    },
  ],
  talentPools: [],
};

// ─── Helper Components ────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
      <span className="ml-1 text-sm text-gray-600">{rating}</span>
    </div>
  );
}

function getStageBadgeColor(stage: string) {
  const map: Record<string, string> = {
    APPLIED: 'bg-blue-100 text-blue-800',
    SCREENING: 'bg-yellow-100 text-yellow-800',
    INTERVIEW: 'bg-purple-100 text-purple-800',
    OFFERED: 'bg-orange-100 text-orange-800',
    HIRED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };
  return map[stage] || 'bg-gray-100 text-gray-800';
}

// ─── Main Page ────────────────────────────────────────────────────

export default function CandidateProfilePage({ params }: { params: { id: string } }) {
  const candidateId = params.id;
  const candidate = MOCK_CANDIDATES[candidateId] || MOCK_CANDIDATES['1'];
  const comparisonData = getCandidateComparisonData(candidateId);
  const [activeTab, setActiveTab] = useState('profile-match');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/recruitment/candidates">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <div className="flex-1" />
        {/* Quick Match Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
          comparisonData.comparison.overallMatchScore >= 80
            ? 'bg-green-100 text-green-800'
            : comparisonData.comparison.overallMatchScore >= 60
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          <Target className="h-4 w-4" />
          {comparisonData.comparison.overallMatchScore}% JD Match
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile Info */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="w-20 h-20 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto text-2xl font-bold">
                  {candidate.firstName[0]}{candidate.lastName[0]}
                </div>
                <h2 className="text-xl font-bold mt-3">{candidate.firstName} {candidate.lastName}</h2>
                <p className="text-gray-500">{candidate.currentTitle}</p>
                <p className="text-sm text-gray-400">{candidate.currentCompany}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a href={`mailto:${candidate.email}`} className="hover:text-teal-600">{candidate.email}</a>
                </div>
                {candidate.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {candidate.phone}
                  </div>
                )}
                {candidate.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {candidate.location}
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  {candidate.totalExp} years experience
                </div>
                {candidate.linkedinUrl && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                    <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>

              <div className="border-t mt-4 pt-4">
                <p className="text-xs text-gray-400 mb-1">Source</p>
                <Badge variant="outline">{SOURCE_LABELS[candidate.source]}</Badge>
              </div>

              {candidate.currentSalary && (
                <div className="border-t mt-4 pt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Current CTC</p>
                    <p className="font-medium">&#8377;{(candidate.currentSalary / 100000).toFixed(1)}L</p>
                  </div>
                  {candidate.expectedSalary && (
                    <div>
                      <p className="text-xs text-gray-400">Expected CTC</p>
                      <p className="font-medium">&#8377;{(candidate.expectedSalary / 100000).toFixed(1)}L</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills.map((skill) => {
                  const isJDMatch = comparisonData.resume.jdMatchedKeywords.some(
                    (k) => k.toLowerCase() === skill.toLowerCase()
                  );
                  return (
                    <span
                      key={skill}
                      className={`px-2.5 py-1 rounded-full text-xs border ${
                        isJDMatch
                          ? 'bg-teal-50 text-teal-700 border-teal-200 font-medium'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Highlighted skills match JD requirements</p>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500">Tags</CardTitle>
                <Button variant="ghost" size="sm"><Plus className="h-3 w-3" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {candidate.tags.map((t) => (
                  <Badge key={t.id} variant="secondary" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {t.tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Talent Pools */}
          {candidate.talentPools.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Talent Pools</CardTitle>
              </CardHeader>
              <CardContent>
                {candidate.talentPools.map((tp) => (
                  <Badge key={tp.talentPool.id} variant="outline" className="text-xs">
                    {tp.talentPool.name}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Tabbed Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100">
              <TabsTrigger value="profile-match" className="text-xs sm:text-sm">
                <Target className="h-3.5 w-3.5 mr-1 hidden sm:inline" />
                Profile Match
              </TabsTrigger>
              <TabsTrigger value="resume" className="text-xs sm:text-sm">
                <FileText className="h-3.5 w-3.5 mr-1 hidden sm:inline" />
                Resume
              </TabsTrigger>
              <TabsTrigger value="interview-jd" className="text-xs sm:text-sm">
                <BarChart3 className="h-3.5 w-3.5 mr-1 hidden sm:inline" />
                Interview vs JD
              </TabsTrigger>
              <TabsTrigger value="applications" className="text-xs sm:text-sm">
                <MessageSquare className="h-3.5 w-3.5 mr-1 hidden sm:inline" />
                Applications ({candidate.applications.length})
              </TabsTrigger>
              <TabsTrigger value="notes" className="text-xs sm:text-sm">
                Notes
              </TabsTrigger>
            </TabsList>

            {/* Profile Match Tab */}
            <TabsContent value="profile-match" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <ProfileMatchScore jd={SENIOR_SWE_JD} comparison={comparisonData.comparison} />
                <RadarChart data={comparisonData.comparison.radarData} />
              </div>
            </TabsContent>

            {/* Resume Highlights Tab */}
            <TabsContent value="resume" className="mt-4">
              <ResumeHighlightsPanel resume={comparisonData.resume} />
            </TabsContent>

            {/* Interview vs JD Tab */}
            <TabsContent value="interview-jd" className="mt-4">
              <InterviewVsJD
                assessments={comparisonData.interviewVsJD}
                recommendation={comparisonData.recommendation}
              />
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="applications" className="space-y-4 mt-4">
              {candidate.applications.map((app) => (
                <Card key={app.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{app.jobPosting.title}</CardTitle>
                        <p className="text-sm text-gray-500">{app.jobPosting.department.name}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStageBadgeColor(app.stage)}`}>
                        {app.stage}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-400 mb-3">
                      Applied on {new Date(app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>

                    {/* Interview Timeline */}
                    {app.interviews.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Interview History</p>
                        {app.interviews.map((interview) => (
                          <div key={interview.id} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium">Round {interview.round}</span>
                                <Badge variant="outline" className="text-xs">{interview.mode}</Badge>
                              </div>
                              <Badge
                                variant={interview.result === 'SELECTED' ? 'default' : interview.result === 'REJECTED' ? 'destructive' : 'outline'}
                                className="text-xs"
                              >
                                {interview.result}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(interview.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                              {' · Interviewer: '}{interview.interviewer.firstName} {interview.interviewer.lastName}
                            </p>

                            {/* Feedback */}
                            {interview.feedbacks.map((fb, idx) => (
                              <div key={idx} className="mt-3 border-t pt-3">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                                  <div>
                                    <p className="text-xs text-gray-400">Technical</p>
                                    <StarRating rating={fb.technicalRating || 0} />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400">Communication</p>
                                    <StarRating rating={fb.communicationRating || 0} />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400">Culture Fit</p>
                                    <StarRating rating={fb.cultureFitRating || 0} />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400">Overall</p>
                                    <StarRating rating={Math.round(fb.overallRating || 0)} />
                                  </div>
                                </div>
                                {fb.recommendation && (
                                  <p className="text-sm">
                                    <span className="text-gray-400">Recommendation: </span>
                                    <span className="font-medium">{RECOMMENDATION_LABELS[fb.recommendation]}</span>
                                  </p>
                                )}
                                {fb.strengths && (
                                  <p className="text-sm mt-1">
                                    <span className="text-gray-400">Strengths: </span>{fb.strengths}
                                  </p>
                                )}
                                {fb.weaknesses && (
                                  <p className="text-sm mt-1">
                                    <span className="text-gray-400">Areas to improve: </span>{fb.weaknesses}
                                  </p>
                                )}
                                {fb.comments && (
                                  <p className="text-sm mt-1 italic text-gray-500">&quot;{fb.comments}&quot;</p>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="notes" className="mt-4">
              <Card>
                <CardContent className="pt-4">
                  {candidate.notes ? (
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{candidate.notes}</p>
                  ) : (
                    <p className="text-sm text-gray-400">No notes added yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
