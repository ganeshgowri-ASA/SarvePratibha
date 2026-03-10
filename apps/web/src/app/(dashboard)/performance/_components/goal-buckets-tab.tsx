'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Target,
  Code2,
  Brain,
  Crown,
  Lightbulb,
  Star,
  ArrowUp,
  ArrowDown,
  Minus,
  Users,
  ChevronRight,
} from 'lucide-react';

type GoalCategory = 'Technical' | 'Behavioral' | 'Leadership' | 'Innovation';

const CATEGORY_CONFIG: Record<GoalCategory, { icon: React.ElementType; color: string; bgColor: string; borderColor: string }> = {
  Technical: { icon: Code2, color: 'text-blue-700', bgColor: 'bg-blue-100', borderColor: 'border-blue-200' },
  Behavioral: { icon: Brain, color: 'text-orange-700', bgColor: 'bg-orange-100', borderColor: 'border-orange-200' },
  Leadership: { icon: Crown, color: 'text-purple-700', bgColor: 'bg-purple-100', borderColor: 'border-purple-200' },
  Innovation: { icon: Lightbulb, color: 'text-teal-700', bgColor: 'bg-teal-100', borderColor: 'border-teal-200' },
};

interface KpiItem {
  name: string;
  target: string;
  actual: string;
  weightage: number;
  score: number;
}

interface GoalBucket {
  id: string;
  category: GoalCategory;
  kra: string;
  kpis: KpiItem[];
  selfScore: number;
  managerScore: number;
  weightage: number;
  status: 'On Track' | 'At Risk' | 'Completed' | 'Not Started';
}

const SAMPLE_GOAL_BUCKETS: GoalBucket[] = [
  {
    id: 'gb1', category: 'Technical', kra: 'API Platform Modernization', weightage: 25,
    selfScore: 4.2, managerScore: 4.0, status: 'On Track',
    kpis: [
      { name: 'Endpoint migration completion', target: '100%', actual: '75%', weightage: 40, score: 75 },
      { name: 'API response time improvement', target: '30% reduction', actual: '23% reduction', weightage: 30, score: 77 },
      { name: 'Zero downtime deployments', target: '100%', actual: '100%', weightage: 30, score: 100 },
    ],
  },
  {
    id: 'gb2', category: 'Technical', kra: 'Code Quality & Testing', weightage: 15,
    selfScore: 3.5, managerScore: 3.0, status: 'At Risk',
    kpis: [
      { name: 'Test coverage', target: '80%', actual: '62%', weightage: 50, score: 78 },
      { name: 'Code review turnaround', target: '<4 hours', actual: '3.5 hours', weightage: 25, score: 88 },
      { name: 'Bug escape rate', target: '<5%', actual: '7%', weightage: 25, score: 60 },
    ],
  },
  {
    id: 'gb3', category: 'Technical', kra: 'Cloud Architecture & Certification', weightage: 10,
    selfScore: 3.8, managerScore: 3.5, status: 'On Track',
    kpis: [
      { name: 'AWS SA certification', target: 'Pass', actual: 'In Progress (82%)', weightage: 60, score: 82 },
      { name: 'Cloud cost optimization', target: '15% reduction', actual: '10% reduction', weightage: 40, score: 67 },
    ],
  },
  {
    id: 'gb4', category: 'Behavioral', kra: 'Cross-Team Collaboration', weightage: 15,
    selfScore: 4.0, managerScore: 4.2, status: 'On Track',
    kpis: [
      { name: 'Cross-team initiatives led', target: '3', actual: '2', weightage: 40, score: 67 },
      { name: 'Stakeholder satisfaction', target: '4.5/5', actual: '4.3/5', weightage: 30, score: 96 },
      { name: 'Knowledge sharing sessions', target: '6', actual: '4', weightage: 30, score: 67 },
    ],
  },
  {
    id: 'gb5', category: 'Behavioral', kra: 'Communication & Stakeholder Management', weightage: 10,
    selfScore: 4.5, managerScore: 4.0, status: 'Completed',
    kpis: [
      { name: 'Sprint demo presentations', target: '100%', actual: '100%', weightage: 50, score: 100 },
      { name: 'Documentation completeness', target: '90%', actual: '85%', weightage: 50, score: 94 },
    ],
  },
  {
    id: 'gb6', category: 'Leadership', kra: 'Mentoring & Team Development', weightage: 10,
    selfScore: 4.0, managerScore: 3.8, status: 'On Track',
    kpis: [
      { name: 'Mentees progressed to next level', target: '2', actual: '1', weightage: 50, score: 50 },
      { name: 'Weekly mentoring sessions', target: '100%', actual: '90%', weightage: 30, score: 90 },
      { name: 'Mentee satisfaction score', target: '4.5/5', actual: '4.7/5', weightage: 20, score: 100 },
    ],
  },
  {
    id: 'gb7', category: 'Leadership', kra: 'Technical Decision Making', weightage: 5,
    selfScore: 3.5, managerScore: 3.5, status: 'On Track',
    kpis: [
      { name: 'Architecture decisions documented', target: '5 ADRs', actual: '3 ADRs', weightage: 60, score: 60 },
      { name: 'Tech debt reduction', target: '20%', actual: '12%', weightage: 40, score: 60 },
    ],
  },
  {
    id: 'gb8', category: 'Innovation', kra: 'Process & Tool Innovation', weightage: 5,
    selfScore: 4.5, managerScore: 4.0, status: 'Completed',
    kpis: [
      { name: 'Deployment time reduction', target: '40%', actual: '39%', weightage: 50, score: 98 },
      { name: 'Developer productivity improvement', target: '20%', actual: '15%', weightage: 50, score: 75 },
    ],
  },
  {
    id: 'gb9', category: 'Innovation', kra: 'R&D and Experimentation', weightage: 5,
    selfScore: 3.0, managerScore: 2.5, status: 'Not Started',
    kpis: [
      { name: 'POCs completed', target: '2', actual: '0', weightage: 50, score: 0 },
      { name: 'Innovation proposals submitted', target: '3', actual: '1', weightage: 50, score: 33 },
    ],
  },
];

// Radar chart dimensions
const RADAR_CATEGORIES: GoalCategory[] = ['Technical', 'Behavioral', 'Leadership', 'Innovation'];
const RADAR_SIZE = 240;
const RADAR_CENTER = RADAR_SIZE / 2;
const RADAR_RADIUS = 90;

function RadarChart({ data }: { data: { category: GoalCategory; selfAvg: number; managerAvg: number }[] }) {
  const levels = [1, 2, 3, 4, 5];
  const angleStep = (2 * Math.PI) / data.length;

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 5) * RADAR_RADIUS;
    return { x: RADAR_CENTER + r * Math.cos(angle), y: RADAR_CENTER + r * Math.sin(angle) };
  };

  const selfPoints = data.map((d, i) => getPoint(i, d.selfAvg));
  const managerPoints = data.map((d, i) => getPoint(i, d.managerAvg));

  const toPath = (points: { x: number; y: number }[]) =>
    points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="flex flex-col items-center">
      <svg width={RADAR_SIZE} height={RADAR_SIZE} viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}>
        {/* Grid levels */}
        {levels.map((level) => {
          const points = data.map((_, i) => getPoint(i, level));
          return <polygon key={level} points={points.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#e5e7eb" strokeWidth="1" />;
        })}

        {/* Axis lines */}
        {data.map((_, i) => {
          const end = getPoint(i, 5);
          return <line key={`axis-${i}`} x1={RADAR_CENTER} y1={RADAR_CENTER} x2={end.x} y2={end.y} stroke="#e5e7eb" strokeWidth="1" />;
        })}

        {/* Self assessment polygon */}
        <path d={toPath(selfPoints)} fill="rgba(13, 148, 136, 0.15)" stroke="#0D9488" strokeWidth="2" />

        {/* Manager assessment polygon */}
        <path d={toPath(managerPoints)} fill="rgba(59, 130, 246, 0.15)" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 4" />

        {/* Data points */}
        {selfPoints.map((p, i) => (<circle key={`self-${i}`} cx={p.x} cy={p.y} r="4" fill="#0D9488" stroke="white" strokeWidth="2" />))}
        {managerPoints.map((p, i) => (<circle key={`mgr-${i}`} cx={p.x} cy={p.y} r="4" fill="#3B82F6" stroke="white" strokeWidth="2" />))}

        {/* Labels */}
        {data.map((d, i) => {
          const labelPoint = getPoint(i, 5.8);
          return (
            <text key={`label-${i}`} x={labelPoint.x} y={labelPoint.y} textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-medium fill-gray-700">
              {d.category}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-teal-500" />
          <span className="text-[10px] text-gray-600">Self Assessment</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-blue-500 border-dashed border-t" />
          <span className="text-[10px] text-gray-600">Manager Assessment</span>
        </div>
      </div>
    </div>
  );
}

function GapIndicator({ gap }: { gap: number }) {
  if (Math.abs(gap) < 0.1) return <span className="text-xs text-gray-400 flex items-center gap-0.5"><Minus size={12} /> Aligned</span>;
  if (gap > 0) return <span className="text-xs text-green-600 flex items-center gap-0.5"><ArrowUp size={12} /> +{gap.toFixed(1)}</span>;
  return <span className="text-xs text-red-500 flex items-center gap-0.5"><ArrowDown size={12} /> {gap.toFixed(1)}</span>;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={12} className={star <= Math.round(rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-200'} />
      ))}
      <span className="text-xs font-medium text-gray-700 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function GoalBucketsTab() {
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory | 'All'>('All');

  const categoryAverages = useMemo(() => {
    return RADAR_CATEGORIES.map((cat) => {
      const items = SAMPLE_GOAL_BUCKETS.filter((g) => g.category === cat);
      const totalWeight = items.reduce((sum, g) => sum + g.weightage, 0);
      const selfAvg = totalWeight > 0 ? items.reduce((sum, g) => sum + g.selfScore * g.weightage, 0) / totalWeight : 0;
      const managerAvg = totalWeight > 0 ? items.reduce((sum, g) => sum + g.managerScore * g.weightage, 0) / totalWeight : 0;
      return { category: cat, selfAvg, managerAvg, goalCount: items.length, totalWeight };
    });
  }, []);

  const overallSelf = useMemo(() => {
    const totalWeight = SAMPLE_GOAL_BUCKETS.reduce((s, g) => s + g.weightage, 0);
    return (SAMPLE_GOAL_BUCKETS.reduce((s, g) => s + g.selfScore * g.weightage, 0) / totalWeight).toFixed(1);
  }, []);

  const overallManager = useMemo(() => {
    const totalWeight = SAMPLE_GOAL_BUCKETS.reduce((s, g) => s + g.weightage, 0);
    return (SAMPLE_GOAL_BUCKETS.reduce((s, g) => s + g.managerScore * g.weightage, 0) / totalWeight).toFixed(1);
  }, []);

  const filteredBuckets = selectedCategory === 'All' ? SAMPLE_GOAL_BUCKETS : SAMPLE_GOAL_BUCKETS.filter((g) => g.category === selectedCategory);

  const statusStyles: Record<string, string> = {
    'On Track': 'bg-green-100 text-green-700',
    'At Risk': 'bg-yellow-100 text-yellow-700',
    'Completed': 'bg-blue-100 text-blue-700',
    'Not Started': 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Target size={20} className="text-teal-600" />
            Goal Buckets
          </h2>
          <p className="text-sm text-gray-500">KRA-KPI mapping with self vs manager assessment comparison</p>
        </div>
      </div>

      {/* Overview: Radar Chart + Category Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Radar Chart */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Self vs Manager Assessment</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <RadarChart data={categoryAverages} />
          </CardContent>
        </Card>

        {/* Overall Scores */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Overall Scores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-teal-50">
                <p className="text-2xl font-bold text-teal-600">{overallSelf}</p>
                <p className="text-[10px] text-gray-500">Self Assessment</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-blue-50">
                <p className="text-2xl font-bold text-blue-600">{overallManager}</p>
                <p className="text-[10px] text-gray-500">Manager Assessment</p>
              </div>
            </div>
            <div className="space-y-2">
              {categoryAverages.map((ca) => {
                const config = CATEGORY_CONFIG[ca.category];
                const Icon = config.icon;
                return (
                  <div key={ca.category} className="flex items-center justify-between p-2 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full ${config.bgColor} flex items-center justify-center`}><Icon size={14} className={config.color} /></div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">{ca.category}</p>
                        <p className="text-[10px] text-gray-400">{ca.goalCount} KRAs &middot; {ca.totalWeight}% weight</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-gray-900">{ca.managerAvg.toFixed(1)}/5</p>
                      <GapIndicator gap={ca.selfAvg - ca.managerAvg} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 360-Degree Feedback Placeholder */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users size={16} className="text-teal-600" />
              360-Degree Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Users size={28} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">Coming Soon</p>
              <p className="text-xs text-gray-500 mb-4">360-degree feedback collection from peers, subordinates, and cross-functional stakeholders will be integrated here.</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs p-2 rounded border border-dashed">
                  <span className="text-gray-500">Peer Feedback</span>
                  <Badge variant="outline" className="text-[10px]">Pending Setup</Badge>
                </div>
                <div className="flex items-center justify-between text-xs p-2 rounded border border-dashed">
                  <span className="text-gray-500">Subordinate Feedback</span>
                  <Badge variant="outline" className="text-[10px]">Pending Setup</Badge>
                </div>
                <div className="flex items-center justify-between text-xs p-2 rounded border border-dashed">
                  <span className="text-gray-500">Cross-functional Feedback</span>
                  <Badge variant="outline" className="text-[10px]">Pending Setup</Badge>
                </div>
                <div className="flex items-center justify-between text-xs p-2 rounded border border-dashed">
                  <span className="text-gray-500">External Stakeholder</span>
                  <Badge variant="outline" className="text-[10px]">Pending Setup</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Tabs & KRA-KPI Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">KRA-KPI Breakdown by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="All" onValueChange={(v) => setSelectedCategory(v as GoalCategory | 'All')}>
            <TabsList className="mb-4">
              <TabsTrigger value="All">All Categories</TabsTrigger>
              {RADAR_CATEGORIES.map((cat) => {
                const Icon = CATEGORY_CONFIG[cat].icon;
                return (
                  <TabsTrigger key={cat} value={cat} className="gap-1.5">
                    <Icon size={14} />{cat}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* All content rendered by filtering */}
            <div className="space-y-4">
              {filteredBuckets.map((bucket) => {
                const config = CATEGORY_CONFIG[bucket.category];
                const Icon = config.icon;
                const gap = bucket.selfScore - bucket.managerScore;
                const kpiAvg = bucket.kpis.reduce((sum, k) => sum + k.score * k.weightage, 0) / bucket.kpis.reduce((sum, k) => sum + k.weightage, 0);

                return (
                  <div key={bucket.id} className={`p-4 rounded-lg border ${config.borderColor} hover:shadow-md transition-shadow`}>
                    {/* KRA Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center`}><Icon size={16} className={config.color} /></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900">{bucket.kra}</p>
                            <Badge className={`text-[10px] px-1.5 py-0 ${config.bgColor} ${config.color}`}>{bucket.category}</Badge>
                          </div>
                          <p className="text-[10px] text-gray-500">Weight: {bucket.weightage}% &middot; {bucket.kpis.length} KPIs</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`text-[10px] px-1.5 py-0 ${statusStyles[bucket.status]}`}>{bucket.status}</Badge>
                      </div>
                    </div>

                    {/* Scores Row */}
                    <div className="flex items-center gap-6 mb-3 p-2 rounded bg-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500">Self:</span>
                        <StarRating rating={bucket.selfScore} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500">Manager:</span>
                        <StarRating rating={bucket.managerScore} />
                      </div>
                      <GapIndicator gap={gap} />
                      <div className="ml-auto flex items-center gap-1">
                        <span className="text-[10px] text-gray-500">KPI Avg:</span>
                        <span className="text-xs font-bold text-gray-900">{kpiAvg.toFixed(0)}%</span>
                      </div>
                    </div>

                    {/* KPI Table */}
                    <div className="space-y-2">
                      {bucket.kpis.map((kpi, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-medium text-gray-700 truncate">{kpi.name}</span>
                              <span className="text-[10px] text-gray-400 shrink-0 ml-2">W: {kpi.weightage}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={kpi.score} className="h-1.5 flex-1" />
                              <span className="text-[10px] font-medium text-gray-600 w-8">{kpi.score}%</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0 w-32">
                            <p className="text-[10px] text-gray-500">Target: {kpi.target}</p>
                            <p className="text-[10px] font-medium text-gray-700">Actual: {kpi.actual}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
