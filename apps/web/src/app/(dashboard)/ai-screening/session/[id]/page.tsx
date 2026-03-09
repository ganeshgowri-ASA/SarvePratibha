'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Bot,
  Phone,
  User,
  MessageSquare,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Minus,
} from 'lucide-react';

// Mock session detail data
const mockSession = {
  id: '1',
  candidateName: 'Priya Sharma',
  candidateEmail: 'priya.sharma@example.com',
  candidatePhone: '+91-9876543210',
  jobTitle: 'Senior Software Engineer',
  status: 'COMPLETED',
  language: 'en',
  overallScore: 85,
  recommendation: 'STRONG_SHORTLIST',
  summary: 'Priya demonstrated strong technical skills and excellent communication. She showed deep understanding of distributed systems and microservices architecture. Cultural fit indicators are very positive with strong alignment to company values. Recommended for the next round of interviews.',
  startedAt: '2026-03-08T10:30:00Z',
  completedAt: '2026-03-08T10:48:00Z',
  createdAt: '2026-03-08T10:28:00Z',
  scores: [
    { id: '1', category: 'Technical', score: 88, maxScore: 100, details: 'Strong grasp of system design, algorithms, and modern frameworks.' },
    { id: '2', category: 'Communication', score: 90, maxScore: 100, details: 'Clear, articulate responses with good structure.' },
    { id: '3', category: 'CulturalFit', score: 82, maxScore: 100, details: 'Good alignment with company values, collaborative mindset.' },
    { id: '4', category: 'Confidence', score: 78, maxScore: 100, details: 'Confident delivery with occasional hesitation on edge cases.' },
    { id: '5', category: 'ProblemSolving', score: 87, maxScore: 100, details: 'Systematic approach to problem decomposition.' },
  ],
  questions: [
    { id: 'q1', questionText: 'Can you describe your experience relevant to the Senior Software Engineer role?', questionType: 'BEHAVIORAL', difficulty: 'EASY', orderIndex: 0, maxScore: 10 },
    { id: 'q2', questionText: 'Walk me through a challenging technical problem you solved recently.', questionType: 'TECHNICAL', difficulty: 'MEDIUM', orderIndex: 1, maxScore: 15 },
    { id: 'q3', questionText: 'How do you handle disagreements with team members on technical decisions?', questionType: 'BEHAVIORAL', difficulty: 'MEDIUM', orderIndex: 2, maxScore: 10 },
    { id: 'q4', questionText: 'Describe your approach to learning new technologies or frameworks.', questionType: 'CULTURAL_FIT', difficulty: 'EASY', orderIndex: 3, maxScore: 10 },
    { id: 'q5', questionText: 'Please explain a complex concept from your domain as if I were a non-technical person.', questionType: 'COMMUNICATION', difficulty: 'HARD', orderIndex: 4, maxScore: 15 },
  ],
  responses: [
    { id: 'r1', questionId: 'q1', responseText: 'I have 5 years of experience building scalable backend services using Node.js and Python. At my previous company, I led a team of 4 engineers working on a microservices migration that improved system reliability by 40%.', score: 8.5, sentiment: 'positive', confidence: 0.92, feedback: 'Strong response with concrete metrics and leadership examples.' },
    { id: 'r2', questionId: 'q2', responseText: 'We had a critical database bottleneck causing 500ms+ query times. I profiled the queries, identified N+1 problems, implemented query batching and added Redis caching layer. Reduced p99 latency to under 50ms.', score: 13.5, sentiment: 'positive', confidence: 0.95, feedback: 'Excellent technical depth. Clear problem-solving methodology demonstrated.' },
    { id: 'r3', questionId: 'q3', responseText: 'I believe in data-driven decisions. When disagreements arise, I suggest we prototype both approaches and measure the outcomes. I recently had a discussion about REST vs GraphQL and we agreed to run a small POC.', score: 8.0, sentiment: 'positive', confidence: 0.88, feedback: 'Good collaborative approach. Could have elaborated on specific conflict resolution.' },
    { id: 'r4', questionId: 'q4', responseText: 'I dedicate time weekly for learning. I follow engineering blogs, contribute to open source, and take online courses. Recently completed a course on Kubernetes and applied it to deploy our services.', score: 7.5, sentiment: 'positive', confidence: 0.85, feedback: 'Shows continuous learning mindset with practical application.' },
    { id: 'r5', questionId: 'q5', responseText: 'Think of a load balancer like a restaurant host. When many guests arrive, the host directs them to different tables so no single waiter gets overwhelmed. Similarly, a load balancer distributes incoming requests across multiple servers.', score: 13.0, sentiment: 'positive', confidence: 0.91, feedback: 'Excellent analogy. Clear and accessible explanation.' },
  ],
  voiceCalls: [
    { id: 'vc1', provider: 'VAPI', status: 'COMPLETED', duration: 1080, startedAt: '2026-03-08T10:30:00Z', endedAt: '2026-03-08T10:48:00Z', recordingUrl: '#' },
  ],
  transcripts: [
    { speaker: 'ai', text: 'Hello Priya, thank you for joining this screening call. I\'m an AI assistant conducting the initial screening for the Senior Software Engineer position at SarvePratibha. Shall we begin?', timestamp: 0 },
    { speaker: 'candidate', text: 'Yes, absolutely. Thank you for having me. I\'m excited about this opportunity.', timestamp: 8 },
    { speaker: 'ai', text: 'Great! Let\'s start. Can you describe your experience relevant to the Senior Software Engineer role?', timestamp: 14 },
    { speaker: 'candidate', text: 'I have 5 years of experience building scalable backend services using Node.js and Python. At my previous company, I led a team of 4 engineers working on a microservices migration that improved system reliability by 40%.', timestamp: 20 },
    { speaker: 'ai', text: 'Impressive. Now, walk me through a challenging technical problem you solved recently.', timestamp: 55 },
    { speaker: 'candidate', text: 'We had a critical database bottleneck causing 500ms+ query times. I profiled the queries, identified N+1 problems, implemented query batching and added Redis caching layer. Reduced p99 latency to under 50ms.', timestamp: 62 },
  ],
};

function getSentimentIcon(sentiment: string) {
  switch (sentiment) {
    case 'positive': return <ThumbsUp className="h-4 w-4 text-green-500" />;
    case 'negative': return <ThumbsDown className="h-4 w-4 text-red-500" />;
    default: return <Minus className="h-4 w-4 text-gray-400" />;
  }
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'EASY': return 'bg-green-100 text-green-800';
    case 'MEDIUM': return 'bg-amber-100 text-amber-800';
    case 'HARD': return 'bg-red-100 text-red-800';
    case 'EXPERT': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case 'TECHNICAL': return 'bg-blue-100 text-blue-800';
    case 'BEHAVIORAL': return 'bg-indigo-100 text-indigo-800';
    case 'SITUATIONAL': return 'bg-cyan-100 text-cyan-800';
    case 'CULTURAL_FIT': return 'bg-pink-100 text-pink-800';
    case 'COMMUNICATION': return 'bg-teal-100 text-teal-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export default function ScreeningSessionDetailPage() {
  const params = useParams();
  const session = mockSession; // Would fetch by params.id

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/ai-screening/sessions">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{session.candidateName}</h1>
            <Badge className={session.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} variant="secondary">
              {session.status.replace('_', ' ')}
            </Badge>
            {session.recommendation && (
              <Badge className={session.recommendation.includes('SHORTLIST') ? 'bg-green-100 text-green-800' : session.recommendation === 'HOLD' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'} variant="secondary">
                {session.recommendation.replace('_', ' ')}
              </Badge>
            )}
          </div>
          <p className="text-gray-500">{session.candidateEmail} | {session.jobTitle}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-teal-600">{session.overallScore}%</p>
          <p className="text-sm text-gray-500">Overall Score</p>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {session.scores.map((score) => (
          <Card key={score.id}>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-sm font-medium text-gray-500 mb-1">{score.category}</p>
              <p className="text-2xl font-bold text-gray-900">{score.score}</p>
              <Progress value={score.score} className="mt-2 h-1.5" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="responses" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="responses">
            <MessageSquare className="h-4 w-4 mr-2" /> Responses
          </TabsTrigger>
          <TabsTrigger value="transcript">
            <Bot className="h-4 w-4 mr-2" /> Transcript
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <BarChart3 className="h-4 w-4 mr-2" /> Analysis
          </TabsTrigger>
          <TabsTrigger value="call">
            <Phone className="h-4 w-4 mr-2" /> Voice Call
          </TabsTrigger>
        </TabsList>

        {/* Responses Tab */}
        <TabsContent value="responses">
          <div className="space-y-4">
            {session.questions.map((question, idx) => {
              const response = session.responses.find((r) => r.questionId === question.id);
              return (
                <Card key={question.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-400">Q{idx + 1}</span>
                        <Badge className={getTypeColor(question.questionType)} variant="secondary">
                          {question.questionType.replace('_', ' ')}
                        </Badge>
                        <Badge className={getDifficultyColor(question.difficulty)} variant="secondary">
                          {question.difficulty}
                        </Badge>
                      </div>
                      {response && (
                        <div className="flex items-center gap-2">
                          {getSentimentIcon(response.sentiment)}
                          <span className="text-sm font-semibold">
                            {response.score}/{question.maxScore}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-gray-900 mb-3">{question.questionText}</p>
                    {response && (
                      <>
                        <div className="bg-gray-50 rounded-lg p-4 mb-3">
                          <p className="text-sm text-gray-700">{response.responseText}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-500">
                            Confidence: <span className="font-medium text-gray-700">{Math.round(response.confidence * 100)}%</span>
                          </span>
                          <Separator orientation="vertical" className="h-4" />
                          <span className="text-gray-500">{response.feedback}</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Transcript Tab */}
        <TabsContent value="transcript">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Call Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {session.transcripts.map((entry, idx) => (
                  <div key={idx} className={`flex gap-3 ${entry.speaker === 'ai' ? '' : 'flex-row-reverse'}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${entry.speaker === 'ai' ? 'bg-teal-100' : 'bg-blue-100'}`}>
                      {entry.speaker === 'ai' ? <Bot className="h-4 w-4 text-teal-600" /> : <User className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className={`max-w-[80%] rounded-lg p-3 ${entry.speaker === 'ai' ? 'bg-teal-50 text-teal-900' : 'bg-blue-50 text-blue-900'}`}>
                      <p className="text-sm">{entry.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{Math.floor(entry.timestamp / 60)}:{String(entry.timestamp % 60).padStart(2, '0')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">{session.summary}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {session.scores.map((score) => (
                    <div key={score.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{score.category}</span>
                        <span className="text-sm font-bold text-gray-900">{score.score}%</span>
                      </div>
                      <Progress value={score.score} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">{score.details}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Session Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Started</p>
                    <p className="font-medium">{new Date(session.startedAt).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Completed</p>
                    <p className="font-medium">{new Date(session.completedAt).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="font-medium">18 minutes</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Language</p>
                    <p className="font-medium">{session.language === 'en' ? 'English' : session.language}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Voice Call Tab */}
        <TabsContent value="call">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Voice Call Details</CardTitle>
            </CardHeader>
            <CardContent>
              {session.voiceCalls.length > 0 ? (
                <div className="space-y-4">
                  {session.voiceCalls.map((call) => (
                    <div key={call.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-teal-600" />
                          <div>
                            <p className="font-medium">Provider: {call.provider}</p>
                            <p className="text-sm text-gray-500">Duration: {Math.floor(call.duration / 60)} min {call.duration % 60} sec</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800" variant="secondary">{call.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Started</p>
                          <p className="font-medium">{new Date(call.startedAt).toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Ended</p>
                          <p className="font-medium">{new Date(call.endedAt).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No voice calls for this session</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
