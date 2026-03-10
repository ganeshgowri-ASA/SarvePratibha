'use client';

import { TrendingUp, TrendingDown, Minus, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { InterviewVsJDComparison, JDFitRecommendation } from '@sarve-pratibha/shared';
import { JD_FIT_LABELS, JD_FIT_COLORS } from '@sarve-pratibha/shared';

interface InterviewVsJDProps {
  assessments: InterviewVsJDComparison[];
  recommendation: JDFitRecommendation;
}

function getStatusIcon(status: InterviewVsJDComparison['status']) {
  switch (status) {
    case 'exceeds':
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'meets':
      return <Minus className="h-4 w-4 text-blue-600" />;
    case 'below':
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    case 'not_assessed':
      return <HelpCircle className="h-4 w-4 text-gray-400" />;
  }
}

function getStatusColor(status: InterviewVsJDComparison['status']) {
  switch (status) {
    case 'exceeds': return 'bg-green-100 text-green-800';
    case 'meets': return 'bg-blue-100 text-blue-800';
    case 'below': return 'bg-red-100 text-red-800';
    case 'not_assessed': return 'bg-gray-100 text-gray-600';
  }
}

function getStatusLabel(status: InterviewVsJDComparison['status']) {
  switch (status) {
    case 'exceeds': return 'Exceeds';
    case 'meets': return 'Meets';
    case 'below': return 'Below';
    case 'not_assessed': return 'N/A';
  }
}

export function InterviewVsJD({ assessments, recommendation }: InterviewVsJDProps) {
  return (
    <div className="space-y-4">
      {/* Assessment Grid */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Interview Assessment vs JD Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assessments.map((item) => (
              <div key={item.jdSkill} className="flex items-center gap-3">
                {getStatusIcon(item.status)}
                <span className="text-sm text-gray-700 w-36 flex-shrink-0">{item.jdSkill}</span>
                <div className="flex-1 relative">
                  <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.status === 'exceeds'
                          ? 'bg-green-400'
                          : item.status === 'meets'
                          ? 'bg-blue-400'
                          : item.status === 'below'
                          ? 'bg-red-400'
                          : 'bg-gray-300'
                      }`}
                      style={{ width: `${((item.interviewScore || 0) / item.maxScore) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium w-10 text-right">
                  {item.interviewScore !== null ? `${item.interviewScore}/${item.maxScore}` : '-'}
                </span>
                <Badge className={`text-[10px] w-16 justify-center ${getStatusColor(item.status)}`}>
                  {getStatusLabel(item.status)}
                </Badge>
              </div>
            ))}
          </div>

          {/* Gap Analysis Summary */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium text-gray-700 mb-2">Gap Analysis</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 rounded-lg bg-green-50">
                <p className="text-lg font-bold text-green-700">
                  {assessments.filter((a) => a.status === 'exceeds').length}
                </p>
                <p className="text-xs text-green-600">Exceeds</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-blue-50">
                <p className="text-lg font-bold text-blue-700">
                  {assessments.filter((a) => a.status === 'meets').length}
                </p>
                <p className="text-xs text-blue-600">Meets</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-red-50">
                <p className="text-lg font-bold text-red-700">
                  {assessments.filter((a) => a.status === 'below').length}
                </p>
                <p className="text-xs text-red-600">Below</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Hiring Recommendation</CardTitle>
            <Badge className={`${JD_FIT_COLORS[recommendation.overallFit]} text-xs`}>
              {JD_FIT_LABELS[recommendation.overallFit]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Score Breakdown */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg border">
              <p className="text-2xl font-bold text-teal-600">{recommendation.jdMatchScore}%</p>
              <p className="text-xs text-gray-500">JD Match</p>
            </div>
            <div className="text-center p-3 rounded-lg border">
              <p className="text-2xl font-bold text-blue-600">{recommendation.interviewScore}%</p>
              <p className="text-xs text-gray-500">Interview</p>
            </div>
            <div className="text-center p-3 rounded-lg border">
              <p className="text-2xl font-bold text-purple-600">{recommendation.combinedScore}%</p>
              <p className="text-xs text-gray-500">Combined</p>
            </div>
          </div>

          {/* Strengths */}
          <div>
            <p className="text-sm font-medium text-green-700 mb-1.5">Strengths</p>
            <ul className="space-y-1">
              {recommendation.strengths.map((s, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                  <span className="text-green-500 mt-0.5">+</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Gaps */}
          <div>
            <p className="text-sm font-medium text-red-700 mb-1.5">Gaps</p>
            <ul className="space-y-1">
              {recommendation.gaps.map((g, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                  <span className="text-red-500 mt-0.5">-</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>

          {/* Final Recommendation */}
          <div className="p-3 rounded-lg bg-gray-50 border">
            <p className="text-sm font-medium text-gray-700 mb-1">Final Assessment</p>
            <p className="text-sm text-gray-600">{recommendation.recommendation}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
