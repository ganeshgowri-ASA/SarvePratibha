'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Star,
  ClipboardList,
  Target,
  Send,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const RATING_LABELS: Record<number, string> = {
  1: 'Needs Improvement',
  2: 'Below Expectations',
  3: 'Meets Expectations',
  4: 'Exceeds Expectations',
  5: 'Outstanding',
};

const SAMPLE_KRAS = [
  { id: '1', title: 'Technical Delivery', weightage: 40, description: 'Quality and timeliness of technical deliverables' },
  { id: '2', title: 'Team Collaboration', weightage: 25, description: 'Working effectively with cross-functional teams' },
  { id: '3', title: 'Innovation & Initiative', weightage: 20, description: 'Proactive problem-solving and process improvements' },
  { id: '4', title: 'Learning & Growth', weightage: 15, description: 'Continuous skill development and knowledge sharing' },
];

const SAMPLE_COMPETENCIES = [
  { id: 'c1', name: 'Communication', category: 'Core' },
  { id: 'c2', name: 'Problem Solving', category: 'Core' },
  { id: 'c3', name: 'Leadership', category: 'Behavioral' },
  { id: 'c4', name: 'Technical Expertise', category: 'Functional' },
  { id: 'c5', name: 'Adaptability', category: 'Core' },
];

function RatingStars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <Star
            size={20}
            className={star <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-xs text-gray-500">{RATING_LABELS[value]}</span>
      )}
    </div>
  );
}

export default function SelfAssessmentPage() {
  const [overallRating, setOverallRating] = useState(0);
  const [overallComments, setOverallComments] = useState('');
  const [kraRatings, setKraRatings] = useState<Record<string, { rating: number; comment: string }>>(
    Object.fromEntries(SAMPLE_KRAS.map((k) => [k.id, { rating: 0, comment: '' }])),
  );
  const [competencyRatings, setCompetencyRatings] = useState<Record<string, number>>(
    Object.fromEntries(SAMPLE_COMPETENCIES.map((c) => [c.id, 0])),
  );
  const [expandedKra, setExpandedKra] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    overallRating > 0 &&
    overallComments.trim().length > 0 &&
    SAMPLE_KRAS.every((k) => kraRatings[k.id].rating > 0);

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    // In real app: await apiFetch('/api/performance/review/self', { method: 'POST', body: ... });
    setTimeout(() => {
      setIsSubmitting(false);
      // Show success
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/performance" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Self Assessment</h1>
          <p className="text-sm text-gray-500">Annual Review 2025-26 - Rate your own performance</p>
        </div>
      </div>

      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-start gap-3">
            <ClipboardList size={20} className="text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Instructions</p>
              <p className="text-xs text-amber-700 mt-1">
                Rate yourself honestly on each KRA and competency (1-5 scale). Provide specific examples
                and evidence to support your ratings. Your self-assessment will be reviewed by your manager.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Star size={18} className="text-teal-600" />
            Overall Self Rating
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>How would you rate your overall performance? *</Label>
            <div className="mt-2">
              <RatingStars value={overallRating} onChange={setOverallRating} />
            </div>
          </div>
          <div>
            <Label htmlFor="overall-comments">Overall Comments *</Label>
            <Textarea
              id="overall-comments"
              value={overallComments}
              onChange={(e) => setOverallComments(e.target.value)}
              placeholder="Summarize your key achievements, challenges, and areas for growth..."
              rows={4}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* KRA Ratings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target size={18} className="text-teal-600" />
            KRA Ratings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {SAMPLE_KRAS.map((kra) => {
            const isExpanded = expandedKra === kra.id;
            const rating = kraRatings[kra.id];
            return (
              <div key={kra.id} className="border rounded-lg p-4">
                <button
                  type="button"
                  onClick={() => setExpandedKra(isExpanded ? null : kra.id)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{kra.title}</p>
                      <Badge variant="outline" className="text-[10px]">
                        {kra.weightage}%
                      </Badge>
                      {rating.rating > 0 && (
                        <Badge className="bg-teal-100 text-teal-700 text-[10px]">
                          Rated: {rating.rating}/5
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{kra.description}</p>
                  </div>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {isExpanded && (
                  <div className="mt-4 space-y-3 pt-3 border-t">
                    <div>
                      <Label>Rating *</Label>
                      <div className="mt-1">
                        <RatingStars
                          value={rating.rating}
                          onChange={(v) =>
                            setKraRatings({ ...kraRatings, [kra.id]: { ...rating, rating: v } })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Comments & Evidence</Label>
                      <Textarea
                        value={rating.comment}
                        onChange={(e) =>
                          setKraRatings({ ...kraRatings, [kra.id]: { ...rating, comment: e.target.value } })
                        }
                        placeholder="Provide specific examples and evidence..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Competency Ratings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Competency Self-Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {SAMPLE_COMPETENCIES.map((comp) => (
              <div key={comp.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{comp.name}</p>
                  <p className="text-xs text-gray-500">{comp.category}</p>
                </div>
                <RatingStars
                  value={competencyRatings[comp.id]}
                  onChange={(v) => setCompetencyRatings({ ...competencyRatings, [comp.id]: v })}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Once submitted, your self-assessment will be sent to your manager for review.
              </p>
              {!isFormValid && (
                <p className="text-xs text-red-500 mt-1">
                  Please complete all required fields (overall rating, comments, and KRA ratings).
                </p>
              )}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Send size={16} className="mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
