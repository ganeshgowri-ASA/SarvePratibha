'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ArrowLeft,
  MessageSquare,
  Send,
  Star,
  Eye,
  Clock,
  CheckCircle2,
  Users,
} from 'lucide-react';

const PENDING_FEEDBACK = [
  {
    id: 'fb1',
    targetName: 'Rahul Verma',
    targetDesignation: 'Developer',
    requestedBy: 'Manager',
    deadline: '2026-03-25',
    isAnonymous: true,
  },
  {
    id: 'fb2',
    targetName: 'Anita Patel',
    targetDesignation: 'QA Engineer',
    requestedBy: 'Manager',
    deadline: '2026-03-28',
    isAnonymous: true,
  },
];

const RECEIVED_FEEDBACK = [
  {
    id: 'rfb1',
    cycle: 'Annual 2024-25',
    totalResponses: 5,
    submitted: 4,
    averageRatings: {
      'Communication': 4.2,
      'Team Work': 4.5,
      'Technical Skills': 3.8,
      'Problem Solving': 4.0,
      'Leadership': 3.5,
    },
    strengths: [
      'Excellent team player with strong collaboration skills',
      'Quick learner and adapts well to new technologies',
      'Proactive in identifying and solving problems',
    ],
    improvements: [
      'Could improve on documentation practices',
      'Sometimes misses deadlines on low-priority tasks',
    ],
  },
];

const FEEDBACK_AREAS = [
  'Communication',
  'Team Work',
  'Technical Skills',
  'Problem Solving',
  'Leadership',
];

function RatingStars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)} className="focus:outline-none">
          <Star size={18} className={star <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
        </button>
      ))}
    </div>
  );
}

export default function FeedbackPage() {
  const [tab, setTab] = useState('pending');
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>(
    Object.fromEntries(FEEDBACK_AREAS.map((a) => [a, 0])),
  );
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [comments, setComments] = useState('');

  const canSubmit =
    selectedFeedback !== null &&
    FEEDBACK_AREAS.every((a) => ratings[a] > 0) &&
    strengths.trim().length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/performance" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">360 Feedback</h1>
          <p className="text-sm text-gray-500">Give and receive anonymous peer feedback</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="pending">
            <Send size={14} className="mr-1" /> Pending ({PENDING_FEEDBACK.length})
          </TabsTrigger>
          <TabsTrigger value="received">
            <Eye size={14} className="mr-1" /> Received
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              {PENDING_FEEDBACK.map((fb) => (
                <Card
                  key={fb.id}
                  className={`cursor-pointer transition-shadow hover:shadow-md ${
                    selectedFeedback === fb.id ? 'ring-2 ring-teal-600' : ''
                  }`}
                  onClick={() => setSelectedFeedback(fb.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-teal-100 text-teal-700">
                          {fb.targetName.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{fb.targetName}</p>
                        <p className="text-xs text-gray-500">{fb.targetDesignation}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> Due: {new Date(fb.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                      {fb.isAnonymous && (
                        <Badge variant="outline" className="text-[10px]">Anonymous</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-2">
              {selectedFeedback ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Provide Feedback</CardTitle>
                    <p className="text-xs text-gray-500">
                      Your responses are anonymous. Be constructive and specific.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Rating Areas */}
                    <div className="space-y-3">
                      <Label>Rate on each area (1-5) *</Label>
                      {FEEDBACK_AREAS.map((area) => (
                        <div key={area} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{area}</span>
                          <RatingStars
                            value={ratings[area]}
                            onChange={(v) => setRatings({ ...ratings, [area]: v })}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label>Key Strengths *</Label>
                      <Textarea
                        value={strengths}
                        onChange={(e) => setStrengths(e.target.value)}
                        placeholder="What does this person do well? Provide specific examples..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Areas for Improvement</Label>
                      <Textarea
                        value={improvements}
                        onChange={(e) => setImprovements(e.target.value)}
                        placeholder="Where can this person improve? Be constructive..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Additional Comments</Label>
                      <Textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Any other feedback..."
                        rows={2}
                      />
                    </div>

                    <Button
                      className="bg-teal-600 hover:bg-teal-700"
                      disabled={!canSubmit}
                    >
                      <Send size={16} className="mr-2" /> Submit Feedback
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-12 pb-12 text-center">
                    <MessageSquare size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500">Select a feedback request to provide your response</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="received" className="mt-4">
          {RECEIVED_FEEDBACK.map((fb) => (
            <Card key={fb.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{fb.cycle}</CardTitle>
                  <Badge className="bg-green-100 text-green-700">
                    {fb.submitted}/{fb.totalResponses} responses
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Radar-like ratings display */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Average Ratings</h4>
                  <div className="space-y-2">
                    {Object.entries(fb.averageRatings).map(([area, rating]) => (
                      <div key={area} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-32">{area}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                          <div
                            className="bg-teal-600 h-2.5 rounded-full"
                            style={{ width: `${(rating / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-8">{rating.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Key Strengths</h4>
                  <div className="space-y-1.5">
                    {fb.strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-600">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Improvements */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Areas for Improvement</h4>
                  <div className="space-y-1.5">
                    {fb.improvements.map((s, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Star size={14} className="text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-600">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
