'use client';

import {
  Briefcase,
  GraduationCap,
  Award,
  FolderOpen,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ResumeHighlights as ResumeHighlightsType } from '@sarve-pratibha/shared';

interface ResumeHighlightsPanelProps {
  resume: ResumeHighlightsType;
}

export function ResumeHighlightsPanel({ resume }: ResumeHighlightsPanelProps) {
  return (
    <div className="space-y-4">
      {/* Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 leading-relaxed">
            <HighlightText text={resume.summary} keywords={resume.jdMatchedKeywords} />
          </p>
        </CardContent>
      </Card>

      {/* Work Experience Timeline */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> Work Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {resume.workExperience.map((exp, idx) => (
              <div key={idx} className="relative pl-6 pb-5 last:pb-0">
                {/* Timeline line */}
                {idx < resume.workExperience.length - 1 && (
                  <div className="absolute left-[9px] top-5 bottom-0 w-0.5 bg-gray-200" />
                )}
                {/* Timeline dot */}
                <div className="absolute left-0 top-1.5 w-[18px] h-[18px] rounded-full bg-teal-100 border-2 border-teal-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                </div>
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{exp.role}</p>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {exp.duration}
                    </div>
                  </div>
                  <ul className="mt-1.5 space-y-0.5">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="text-xs text-gray-500 flex items-start gap-1.5">
                        <span className="text-teal-500 mt-1">&#8226;</span>
                        <HighlightText text={h} keywords={resume.jdMatchedKeywords} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <GraduationCap className="h-4 w-4" /> Education
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {resume.education.map((edu, idx) => (
              <div key={idx} className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{edu.degree}</p>
                  <p className="text-xs text-gray-500">{edu.institution}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{edu.year}</p>
                  {edu.grade && <p className="text-xs font-medium text-teal-600">{edu.grade}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Award className="h-4 w-4" /> Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {resume.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{cert.name}</p>
                    <p className="text-xs text-gray-500">{cert.issuer}</p>
                  </div>
                  <p className="text-xs text-gray-400">{cert.year}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <FolderOpen className="h-4 w-4" /> Key Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resume.projects.map((proj, idx) => (
                <div key={idx}>
                  <p className="text-sm font-medium text-gray-800">{proj.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{proj.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {proj.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className={`text-[10px] px-1.5 py-0 ${
                          resume.jdMatchedKeywords.some((k) => k.toLowerCase() === tech.toLowerCase())
                            ? 'bg-teal-50 text-teal-700 border border-teal-200'
                            : ''
                        }`}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matched Keywords */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">JD Matched Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {resume.jdMatchedKeywords.map((kw) => (
              <span
                key={kw}
                className="px-2 py-0.5 rounded-full text-xs bg-teal-50 text-teal-700 border border-teal-200 font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function HighlightText({ text, keywords }: { text: string; keywords: string[] }) {
  if (!keywords.length) return <>{text}</>;

  const pattern = keywords
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  const regex = new RegExp(`(${pattern})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const isMatch = keywords.some((k) => k.toLowerCase() === part.toLowerCase());
        return isMatch ? (
          <span key={i} className="bg-teal-100 text-teal-800 rounded px-0.5 font-medium">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}
