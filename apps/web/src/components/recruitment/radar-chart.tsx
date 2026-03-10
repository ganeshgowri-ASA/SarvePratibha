'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RadarChartDataPoint } from '@sarve-pratibha/shared';

interface RadarChartProps {
  data: RadarChartDataPoint[];
  title?: string;
}

export function RadarChart({ data, title = 'JD vs Candidate Strengths' }: RadarChartProps) {
  const size = 280;
  const center = size / 2;
  const maxRadius = 110;
  const levels = 5;
  const angleStep = (2 * Math.PI) / data.length;
  const startAngle = -Math.PI / 2;

  function getPoint(index: number, value: number): { x: number; y: number } {
    const angle = startAngle + index * angleStep;
    const radius = (value / 100) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  }

  function getPolygonPoints(values: number[]): string {
    return values.map((v, i) => {
      const p = getPoint(i, v);
      return `${p.x},${p.y}`;
    }).join(' ');
  }

  const gridLevels = Array.from({ length: levels }, (_, i) => ((i + 1) / levels) * 100);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px]">
          {/* Grid levels */}
          {gridLevels.map((level) => (
            <polygon
              key={level}
              points={data.map((_, i) => {
                const p = getPoint(i, level);
                return `${p.x},${p.y}`;
              }).join(' ')}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="0.5"
            />
          ))}

          {/* Axis lines */}
          {data.map((_, i) => {
            const p = getPoint(i, 100);
            return (
              <line
                key={`axis-${i}`}
                x1={center}
                y1={center}
                x2={p.x}
                y2={p.y}
                stroke="#d1d5db"
                strokeWidth="0.5"
              />
            );
          })}

          {/* JD polygon (reference - full) */}
          <polygon
            points={getPolygonPoints(data.map((d) => d.jdScore))}
            fill="rgba(13, 148, 136, 0.08)"
            stroke="#0D9488"
            strokeWidth="1.5"
            strokeDasharray="4,3"
          />

          {/* Candidate polygon */}
          <polygon
            points={getPolygonPoints(data.map((d) => d.candidateScore))}
            fill="rgba(59, 130, 246, 0.15)"
            stroke="#3B82F6"
            strokeWidth="2"
          />

          {/* Data points for candidate */}
          {data.map((d, i) => {
            const p = getPoint(i, d.candidateScore);
            return (
              <circle
                key={`point-${i}`}
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill="#3B82F6"
                stroke="white"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Labels */}
          {data.map((d, i) => {
            const angle = startAngle + i * angleStep;
            const labelRadius = maxRadius + 24;
            const x = center + labelRadius * Math.cos(angle);
            const y = center + labelRadius * Math.sin(angle);

            let textAnchor: 'start' | 'middle' | 'end' = 'middle';
            if (Math.cos(angle) > 0.3) textAnchor = 'start';
            else if (Math.cos(angle) < -0.3) textAnchor = 'end';

            return (
              <g key={`label-${i}`}>
                <text
                  x={x}
                  y={y}
                  textAnchor={textAnchor}
                  dominantBaseline="central"
                  className="fill-gray-600"
                  fontSize="9"
                  fontWeight="500"
                >
                  {d.category}
                </text>
                <text
                  x={x}
                  y={y + 12}
                  textAnchor={textAnchor}
                  dominantBaseline="central"
                  className="fill-blue-600"
                  fontSize="8"
                  fontWeight="600"
                >
                  {d.candidateScore}%
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 border-t-2 border-dashed border-teal-600" />
            <span className="text-xs text-gray-500">JD Requirements</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-blue-500 rounded" />
            <span className="text-xs text-gray-500">Candidate Profile</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
