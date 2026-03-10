'use client';

import { Check, X, Plus, Award, BookOpen, Briefcase, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { JDCandidateComparison, JDRequirements } from '@sarve-pratibha/shared';
import { MATCH_SCORE_THRESHOLDS } from '@sarve-pratibha/shared';

function getScoreColor(score: number) {
  if (score >= MATCH_SCORE_THRESHOLDS.high) return { bg: 'bg-green-100', text: 'text-green-700', ring: 'ring-green-500', fill: 'bg-green-500' };
  if (score >= MATCH_SCORE_THRESHOLDS.medium) return { bg: 'bg-yellow-100', text: 'text-yellow-700', ring: 'ring-yellow-500', fill: 'bg-yellow-500' };
  return { bg: 'bg-red-100', text: 'text-red-700', ring: 'ring-red-500', fill: 'bg-red-500' };
}

function CircularScore({ score, size = 'lg' }: { score: number; size?: 'sm' | 'lg' }) {
  const color = getScoreColor(score);
  const dimensions = size === 'lg' ? 'w-28 h-28' : 'w-16 h-16';
  const textSize = size === 'lg' ? 'text-3xl' : 'text-lg';
  const labelSize = size === 'lg' ? 'text-xs' : 'text-[10px]';

  return (
    <div className={`${dimensions} rounded-full ${color.bg} flex flex-col items-center justify-center ring-4 ${color.ring}`}>
      <span className={`${textSize} font-bold ${color.text}`}>{score}%</span>
      {size === 'lg' && <span className={`${labelSize} ${color.text} font-medium`}>Match</span>}
    </div>
  );
}

interface ProfileMatchScoreProps {
  jd: JDRequirements;
  comparison: JDCandidateComparison;
}

export function ProfileMatchScore({ jd, comparison }: ProfileMatchScoreProps) {
  const matched = comparison.skillsMatch.filter((s) => s.status === 'matched');
  const missing = comparison.skillsMatch.filter((s) => s.status === 'missing');
  const additional = comparison.skillsMatch.filter((s) => s.status === 'additional');

  const certMatched = comparison.certificationMatch.filter((c) => c.status === 'matched');
  const certMissing = comparison.certificationMatch.filter((c) => c.status === 'missing');
  const certAdditional = comparison.certificationMatch.filter((c) => c.status === 'additional');

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Profile Match</CardTitle>
          <Badge variant="outline" className="text-xs">vs {jd.title}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="flex items-center gap-6">
          <CircularScore score={comparison.overallMatchScore} />
          <div className="flex-1 space-y-2">
            <ScoreBar label="Skills" score={comparison.skillsScore} icon={<Shield className="h-3.5 w-3.5" />} />
            <ScoreBar label="Experience" score={comparison.experienceScore} icon={<Briefcase className="h-3.5 w-3.5" />} />
            <ScoreBar label="Education" score={comparison.educationScore} icon={<BookOpen className="h-3.5 w-3.5" />} />
            <ScoreBar label="Certifications" score={comparison.certificationScore} icon={<Award className="h-3.5 w-3.5" />} />
          </div>
        </div>

        {/* Skills Match */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Skills Comparison</p>
          <div className="space-y-1.5">
            {matched.map((s) => (
              <div key={s.skill} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">{s.skill}</span>
                {s.isRequired && <Badge variant="outline" className="text-[10px] px-1 py-0">Required</Badge>}
              </div>
            ))}
            {missing.map((s) => (
              <div key={s.skill} className="flex items-center gap-2 text-sm">
                <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span className="text-gray-500">{s.skill}</span>
                {s.isRequired && <Badge variant="destructive" className="text-[10px] px-1 py-0">Required</Badge>}
              </div>
            ))}
            {additional.map((s) => (
              <div key={s.skill} className="flex items-center gap-2 text-sm">
                <Plus className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-blue-700">{s.skill}</span>
                <Badge className="text-[10px] px-1 py-0 bg-blue-100 text-blue-700 hover:bg-blue-100">Extra</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Match */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Experience</p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Required: {comparison.experienceMatch.requiredMin}-{comparison.experienceMatch.requiredMax} yrs</span>
                <span>Candidate: {comparison.experienceMatch.candidateYears} yrs</span>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full ${getScoreColor(comparison.experienceMatch.matchPercentage).fill}`}
                  style={{ width: `${Math.min(comparison.experienceMatch.matchPercentage, 100)}%` }}
                />
              </div>
            </div>
            <span className={`text-sm font-semibold ${getScoreColor(comparison.experienceMatch.matchPercentage).text}`}>
              {comparison.experienceMatch.matchPercentage}%
            </span>
          </div>
        </div>

        {/* Education Match */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Education</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Required</p>
              <p className="text-gray-600">{comparison.educationMatch.required}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Candidate</p>
              <p className="text-gray-600">{comparison.educationMatch.candidate}</p>
            </div>
          </div>
          <div className="mt-1.5">
            {comparison.educationMatch.isMatch ? (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                <Check className="h-3 w-3 mr-1" /> Meets requirement
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-xs">
                <X className="h-3 w-3 mr-1" /> Does not meet requirement
              </Badge>
            )}
          </div>
        </div>

        {/* Certifications Match */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Certifications</p>
          <div className="space-y-1.5">
            {certMatched.map((c) => (
              <div key={c.certification} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">{c.certification}</span>
              </div>
            ))}
            {certMissing.map((c) => (
              <div key={c.certification} className="flex items-center gap-2 text-sm">
                <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span className="text-gray-500">{c.certification}</span>
              </div>
            ))}
            {certAdditional.map((c) => (
              <div key={c.certification} className="flex items-center gap-2 text-sm">
                <Plus className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-blue-700">{c.certification}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ScoreBar({ label, score, icon }: { label: string; score: number; icon: React.ReactNode }) {
  const color = getScoreColor(score);
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400">{icon}</span>
      <span className="text-xs text-gray-600 w-24">{label}</span>
      <div className="flex-1">
        <Progress value={score} className="h-2" />
      </div>
      <span className={`text-xs font-semibold w-8 text-right ${color.text}`}>{score}%</span>
    </div>
  );
}
