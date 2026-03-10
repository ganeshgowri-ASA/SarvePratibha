'use client';

import { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  BarChart3,
  Download,
  Filter,
  Diamond,
  ChevronDown,
  ChevronUp,
  Calendar,
  X,
} from 'lucide-react';

type GoalStatus = 'on_track' | 'at_risk' | 'lagging' | 'completed' | 'not_started';

const STATUS_CONFIG: Record<GoalStatus, { label: string; color: string; bgColor: string; barColor: string }> = {
  on_track: { label: 'On Track', color: 'text-green-700', bgColor: 'bg-green-100', barColor: 'bg-green-500' },
  at_risk: { label: 'At Risk', color: 'text-yellow-700', bgColor: 'bg-yellow-100', barColor: 'bg-yellow-500' },
  lagging: { label: 'Lagging', color: 'text-red-700', bgColor: 'bg-red-100', barColor: 'bg-red-500' },
  completed: { label: 'Completed', color: 'text-blue-700', bgColor: 'bg-blue-100', barColor: 'bg-blue-500' },
  not_started: { label: 'Not Started', color: 'text-gray-700', bgColor: 'bg-gray-100', barColor: 'bg-gray-400' },
};

interface StatusChange {
  date: string;
  from: GoalStatus;
  to: GoalStatus;
  note: string;
}

interface GanttGoal {
  id: string;
  title: string;
  owner: string;
  department: string;
  team: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: GoalStatus;
  justification: string;
  milestones: { date: string; label: string; completed: boolean }[];
  statusHistory: StatusChange[];
}

const SAMPLE_GANTT_GOALS: GanttGoal[] = [
  {
    id: 'gg1', title: 'Complete API migration to v2', owner: 'Arjun Mehta', department: 'Engineering', team: 'Backend',
    startDate: '2026-01-15', endDate: '2026-04-30', progress: 75, status: 'on_track',
    justification: 'Progressing well. 35 of 47 endpoints migrated. Authentication module completed this week.',
    milestones: [
      { date: '2026-02-15', label: 'Auth module complete', completed: true },
      { date: '2026-03-15', label: 'Core APIs migrated', completed: false },
      { date: '2026-04-30', label: 'Full migration', completed: false },
    ],
    statusHistory: [
      { date: '2026-01-15', from: 'not_started', to: 'on_track', note: 'Started migration planning' },
      { date: '2026-02-01', from: 'on_track', to: 'at_risk', note: 'Delayed due to auth complexity' },
      { date: '2026-02-20', from: 'at_risk', to: 'on_track', note: 'Auth module resolved, back on track' },
    ],
  },
  {
    id: 'gg2', title: 'Mentor 2 junior developers', owner: 'Arjun Mehta', department: 'Engineering', team: 'Backend',
    startDate: '2026-01-01', endDate: '2026-06-30', progress: 50, status: 'on_track',
    justification: 'Regular weekly sessions with both mentees. Rahul showing strong progress on React patterns.',
    milestones: [
      { date: '2026-03-31', label: 'Mid-cycle review', completed: false },
      { date: '2026-06-30', label: 'Final assessment', completed: false },
    ],
    statusHistory: [{ date: '2026-01-01', from: 'not_started', to: 'on_track', note: 'Mentoring sessions started' }],
  },
  {
    id: 'gg3', title: 'Reduce deployment time by 40%', owner: 'Arjun Mehta', department: 'Engineering', team: 'DevOps',
    startDate: '2026-02-01', endDate: '2026-05-31', progress: 55, status: 'at_risk',
    justification: 'Pipeline parallelization done (39% reduction). Docker layer caching blocked by infra team approval.',
    milestones: [
      { date: '2026-03-01', label: 'CI parallelization', completed: true },
      { date: '2026-04-15', label: 'Docker caching', completed: false },
      { date: '2026-05-31', label: 'Target achieved', completed: false },
    ],
    statusHistory: [
      { date: '2026-02-01', from: 'not_started', to: 'on_track', note: 'Pipeline analysis started' },
      { date: '2026-03-05', from: 'on_track', to: 'at_risk', note: 'Docker caching blocked by infra approval' },
    ],
  },
  {
    id: 'gg4', title: 'Complete AWS certification', owner: 'Arjun Mehta', department: 'Engineering', team: 'Backend',
    startDate: '2026-01-10', endDate: '2026-04-15', progress: 20, status: 'lagging',
    justification: 'Limited study time due to API migration priority. Need to allocate dedicated study hours.',
    milestones: [
      { date: '2026-02-28', label: 'Complete courses', completed: false },
      { date: '2026-03-31', label: 'Practice exams', completed: false },
      { date: '2026-04-15', label: 'Exam date', completed: false },
    ],
    statusHistory: [
      { date: '2026-01-10', from: 'not_started', to: 'on_track', note: 'Started online course' },
      { date: '2026-02-15', from: 'on_track', to: 'lagging', note: 'Falling behind due to project priorities' },
    ],
  },
  {
    id: 'gg5', title: 'Improve test coverage to 80%', owner: 'Neha Patel', department: 'Engineering', team: 'QA',
    startDate: '2026-03-01', endDate: '2026-06-30', progress: 0, status: 'not_started',
    justification: 'Scheduled to begin after API migration reaches 90% completion.',
    milestones: [
      { date: '2026-04-15', label: 'Test strategy defined', completed: false },
      { date: '2026-05-31', label: '60% coverage', completed: false },
      { date: '2026-06-30', label: '80% coverage target', completed: false },
    ],
    statusHistory: [],
  },
  {
    id: 'gg6', title: 'Improve cross-team collaboration', owner: 'Arjun Mehta', department: 'Engineering', team: 'Backend',
    startDate: '2026-01-15', endDate: '2026-06-30', progress: 60, status: 'on_track',
    justification: 'Cross-team standups initiated. Shared Jira board created. Positive feedback from stakeholders.',
    milestones: [
      { date: '2026-02-28', label: 'Shared processes defined', completed: true },
      { date: '2026-04-30', label: 'Cross-team retro', completed: false },
      { date: '2026-06-30', label: 'Survey results', completed: false },
    ],
    statusHistory: [{ date: '2026-01-15', from: 'not_started', to: 'on_track', note: 'Started cross-team initiative' }],
  },
  {
    id: 'gg7', title: 'Launch customer feedback portal', owner: 'Sneha Kapoor', department: 'Product', team: 'Product Management',
    startDate: '2026-02-01', endDate: '2026-04-30', progress: 100, status: 'completed',
    justification: 'Portal launched on March 1. 200+ responses collected. NPS score tracking active.',
    milestones: [
      { date: '2026-02-15', label: 'Design complete', completed: true },
      { date: '2026-03-01', label: 'Portal launch', completed: true },
      { date: '2026-03-31', label: '100 responses', completed: true },
    ],
    statusHistory: [
      { date: '2026-02-01', from: 'not_started', to: 'on_track', note: 'Design phase started' },
      { date: '2026-03-01', from: 'on_track', to: 'completed', note: 'Launched successfully' },
    ],
  },
  {
    id: 'gg8', title: 'Implement SOC 2 compliance controls', owner: 'Rajesh Kumar', department: 'IT Security', team: 'Compliance',
    startDate: '2026-01-01', endDate: '2026-06-30', progress: 40, status: 'at_risk',
    justification: 'Access control policies defined. Audit logging in progress. Vendor assessment delayed by 2 weeks.',
    milestones: [
      { date: '2026-02-28', label: 'Policies documented', completed: true },
      { date: '2026-04-30', label: 'Controls implemented', completed: false },
      { date: '2026-06-30', label: 'Audit ready', completed: false },
    ],
    statusHistory: [
      { date: '2026-01-01', from: 'not_started', to: 'on_track', note: 'Compliance project kickoff' },
      { date: '2026-03-01', from: 'on_track', to: 'at_risk', note: 'Vendor assessment delayed' },
    ],
  },
  {
    id: 'gg9', title: 'AWS Solutions Architect certification', owner: 'Arjun Mehta', department: 'Engineering', team: 'Backend',
    startDate: '2026-01-20', endDate: '2026-05-15', progress: 80, status: 'on_track',
    justification: 'Practice exam scores improving (82% latest). Target exam date set for April.',
    milestones: [
      { date: '2026-02-28', label: 'Core modules done', completed: true },
      { date: '2026-03-31', label: 'Practice exams 85%+', completed: false },
      { date: '2026-04-30', label: 'Certification exam', completed: false },
    ],
    statusHistory: [{ date: '2026-01-20', from: 'not_started', to: 'on_track', note: 'Started SAA-C03 preparation' }],
  },
  {
    id: 'gg10', title: 'Master React performance optimization', owner: 'Arjun Mehta', department: 'Engineering', team: 'Frontend',
    startDate: '2026-02-01', endDate: '2026-05-31', progress: 50, status: 'on_track',
    justification: 'Profiling tools mastered. useMemo/React.memo patterns implemented. Bundle analysis pending.',
    milestones: [
      { date: '2026-03-15', label: 'Profiling complete', completed: false },
      { date: '2026-04-30', label: 'Bundle optimization', completed: false },
      { date: '2026-05-31', label: 'Team workshop', completed: false },
    ],
    statusHistory: [{ date: '2026-02-01', from: 'not_started', to: 'on_track', note: 'Started with React Profiler' }],
  },
];

const DEPARTMENTS = ['All', 'Engineering', 'Product', 'IT Security'];
const TEAMS = ['All', 'Backend', 'Frontend', 'DevOps', 'QA', 'Product Management', 'Compliance'];

function getMonthsBetween(start: string, end: string): { label: string; year: number; month: number }[] {
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  const months: { label: string; year: number; month: number }[] = [];
  const current = new Date(s.getFullYear(), s.getMonth(), 1);
  while (current <= e) {
    months.push({ label: current.toLocaleDateString('en-IN', { month: 'short' }), year: current.getFullYear(), month: current.getMonth() });
    current.setMonth(current.getMonth() + 1);
  }
  return months;
}

function daysBetween(a: string, b: string): number {
  return Math.ceil((new Date(b + 'T00:00:00').getTime() - new Date(a + 'T00:00:00').getTime()) / 86400000);
}

export default function GanttChartTab() {
  const [filterDept, setFilterDept] = useState('All');
  const [filterTeam, setFilterTeam] = useState('All');
  const [filterOwner, setFilterOwner] = useState('All');
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [justifications, setJustifications] = useState<Record<string, string>>(
    Object.fromEntries(SAMPLE_GANTT_GOALS.map((g) => [g.id, g.justification])),
  );
  const [tooltip, setTooltip] = useState<{ goal: GanttGoal; x: number; y: number } | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const filteredGoals = useMemo(() => {
    return SAMPLE_GANTT_GOALS.filter((g) => {
      if (filterDept !== 'All' && g.department !== filterDept) return false;
      if (filterTeam !== 'All' && g.team !== filterTeam) return false;
      if (filterOwner !== 'All' && g.owner !== filterOwner) return false;
      return true;
    });
  }, [filterDept, filterTeam, filterOwner]);

  const owners = useMemo(() => ['All', ...Array.from(new Set(SAMPLE_GANTT_GOALS.map((g) => g.owner)))], []);

  const timelineStart = '2026-01-01';
  const timelineEnd = '2026-06-30';
  const months = getMonthsBetween(timelineStart, timelineEnd);
  const totalDays = daysBetween(timelineStart, timelineEnd);

  const getPosition = (date: string): number => {
    const days = daysBetween(timelineStart, date);
    return Math.max(0, Math.min(100, (days / totalDays) * 100));
  };

  const statusSummary = useMemo(() => {
    const counts: Record<GoalStatus, number> = { on_track: 0, at_risk: 0, lagging: 0, completed: 0, not_started: 0 };
    filteredGoals.forEach((g) => counts[g.status]++);
    return counts;
  }, [filteredGoals]);

  const handleExportPDF = () => {
    alert('PDF export would be triggered here. In production, this uses jsPDF to generate a PDF of the Gantt chart.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 size={20} className="text-teal-600" />
            Goal Timeline
          </h2>
          <p className="text-sm text-gray-500">Interactive Gantt chart for tracking goals across teams</p>
        </div>
        <Button size="sm" variant="outline" onClick={handleExportPDF}>
          <Download size={16} className="mr-1" /> Export PDF
        </Button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-5 gap-3">
        {(Object.keys(STATUS_CONFIG) as GoalStatus[]).map((status) => {
          const config = STATUS_CONFIG[status];
          return (
            <Card key={status}>
              <CardContent className="pt-3 pb-2 px-3 text-center">
                <div className={`inline-flex w-3 h-3 rounded-full ${config.barColor} mb-1`} />
                <p className="text-lg font-bold text-gray-900">{statusSummary[status]}</p>
                <p className="text-[10px] text-gray-500">{config.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Filter size={14} className="text-gray-500" />
              <span className="text-xs font-medium text-gray-600">Filters:</span>
            </div>
            <Select value={filterDept} onValueChange={setFilterDept}>
              <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>{DEPARTMENTS.map((d) => (<SelectItem key={d} value={d}>{d === 'All' ? 'All Departments' : d}</SelectItem>))}</SelectContent>
            </Select>
            <Select value={filterTeam} onValueChange={setFilterTeam}>
              <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="Team" /></SelectTrigger>
              <SelectContent>{TEAMS.map((t) => (<SelectItem key={t} value={t}>{t === 'All' ? 'All Teams' : t}</SelectItem>))}</SelectContent>
            </Select>
            <Select value={filterOwner} onValueChange={setFilterOwner}>
              <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="Individual" /></SelectTrigger>
              <SelectContent>{owners.map((o) => (<SelectItem key={o} value={o}>{o === 'All' ? 'All Individuals' : o}</SelectItem>))}</SelectContent>
            </Select>
            {(filterDept !== 'All' || filterTeam !== 'All' || filterOwner !== 'All') && (
              <Button variant="ghost" size="sm" className="text-xs text-gray-500 h-8" onClick={() => { setFilterDept('All'); setFilterTeam('All'); setFilterOwner('All'); }}>
                <X size={12} className="mr-1" /> Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gantt Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar size={18} className="text-teal-600" />
            Timeline View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={chartRef} className="relative">
            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              {(Object.keys(STATUS_CONFIG) as GoalStatus[]).map((status) => {
                const config = STATUS_CONFIG[status];
                return (<div key={status} className="flex items-center gap-1.5"><div className={`w-3 h-3 rounded-sm ${config.barColor}`} /><span className="text-[10px] text-gray-600">{config.label}</span></div>);
              })}
              <div className="flex items-center gap-1.5"><Diamond size={10} className="text-teal-600 fill-teal-600" /><span className="text-[10px] text-gray-600">Milestone</span></div>
            </div>

            {/* Month Headers */}
            <div className="flex border-b pb-2 mb-2">
              <div className="w-56 shrink-0 text-xs font-medium text-gray-600 pr-3">Goal</div>
              <div className="flex-1 flex">
                {months.map((m) => (
                  <div key={`${m.year}-${m.month}`} className="flex-1 text-center text-[10px] font-medium text-gray-500 border-l border-gray-100 first:border-l-0">
                    {m.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Today indicator */}
            <div className="relative">
              <div className="absolute top-0 bottom-0 w-px bg-red-400 z-10 pointer-events-none" style={{ left: `calc(224px + (100% - 224px) * ${getPosition('2026-03-10') / 100})` }}>
                <span className="absolute -top-5 -translate-x-1/2 text-[9px] text-red-500 font-medium whitespace-nowrap">Today</span>
              </div>
            </div>

            {/* Goal Rows */}
            <div className="space-y-1">
              {filteredGoals.map((goal) => {
                const startPos = getPosition(goal.startDate);
                const endPos = getPosition(goal.endDate);
                const width = endPos - startPos;
                const config = STATUS_CONFIG[goal.status];
                const daysRemaining = daysBetween('2026-03-10', goal.endDate);
                const isExpanded = expandedGoal === goal.id;

                return (
                  <div key={goal.id}>
                    <div className={`flex items-center py-2 rounded-lg cursor-pointer transition-colors ${isExpanded ? 'bg-gray-50' : 'hover:bg-gray-50'}`} onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}>
                      {/* Goal Title */}
                      <div className="w-56 shrink-0 pr-3">
                        <div className="flex items-center gap-1.5">
                          {isExpanded ? <ChevronUp size={12} className="text-gray-400" /> : <ChevronDown size={12} className="text-gray-400" />}
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">{goal.title}</p>
                            <p className="text-[10px] text-gray-400 truncate">{goal.owner}</p>
                          </div>
                        </div>
                      </div>

                      {/* Timeline Bar */}
                      <div className="flex-1 relative h-8">
                        {months.map((m, idx) => (
                          <div key={`grid-${m.year}-${m.month}`} className="absolute top-0 bottom-0 border-l border-gray-50" style={{ left: `${(idx / months.length) * 100}%` }} />
                        ))}
                        <div
                          className={`absolute top-1 h-6 rounded-md ${config.barColor} opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
                          style={{ left: `${startPos}%`, width: `${Math.max(width, 1)}%` }}
                          onMouseEnter={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setTooltip({ goal, x: rect.left + rect.width / 2, y: rect.top }); }}
                          onMouseLeave={() => setTooltip(null)}
                        >
                          <div className="h-full rounded-md bg-white/30" style={{ width: `${100 - goal.progress}%`, marginLeft: 'auto' }} />
                          {width > 8 && (<span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-sm">{goal.progress}%</span>)}
                        </div>
                        {goal.milestones.map((ms, idx) => {
                          const msPos = getPosition(ms.date);
                          return (<div key={idx} className="absolute top-0 -translate-x-1/2" style={{ left: `${msPos}%` }} title={`${ms.label} (${ms.date})`}><Diamond size={10} className={`${ms.completed ? 'text-teal-600 fill-teal-600' : 'text-gray-400 fill-gray-200'}`} /></div>);
                        })}
                      </div>

                      {/* Status Badge */}
                      <div className="w-24 shrink-0 text-right pl-2">
                        <Badge className={`text-[10px] px-1.5 py-0 ${config.bgColor} ${config.color}`}>{config.label}</Badge>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="ml-56 mr-24 py-3 px-4 bg-gray-50 rounded-lg mb-2 space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div><span className="text-gray-500">Progress</span><p className="font-semibold text-gray-900">{goal.progress}%</p></div>
                          <div><span className="text-gray-500">Days Remaining</span><p className="font-semibold text-gray-900">{daysRemaining > 0 ? daysRemaining : 'Overdue'}</p></div>
                          <div><span className="text-gray-500">Department</span><p className="font-semibold text-gray-900">{goal.department}</p></div>
                          <div><span className="text-gray-500">Team</span><p className="font-semibold text-gray-900">{goal.team}</p></div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">Justification Notes</label>
                          <Textarea className="text-xs resize-none" rows={2} value={justifications[goal.id] || ''} onChange={(e) => setJustifications((prev) => ({ ...prev, [goal.id]: e.target.value }))} />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">Milestones</label>
                          <div className="flex gap-3 flex-wrap">
                            {goal.milestones.map((ms, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-xs">
                                <Diamond size={10} className={ms.completed ? 'text-teal-600 fill-teal-600' : 'text-gray-400 fill-gray-200'} />
                                <span className={ms.completed ? 'text-teal-700 line-through' : 'text-gray-700'}>{ms.label}</span>
                                <span className="text-[10px] text-gray-400">({ms.date})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {goal.statusHistory.length > 0 && (
                          <div>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">Status Change History</label>
                            <div className="space-y-1">
                              {goal.statusHistory.map((change, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-[11px]">
                                  <span className="text-gray-400 w-20 shrink-0">{change.date}</span>
                                  <Badge className={`text-[9px] px-1 py-0 ${STATUS_CONFIG[change.from].bgColor} ${STATUS_CONFIG[change.from].color}`}>{STATUS_CONFIG[change.from].label}</Badge>
                                  <span className="text-gray-400">&rarr;</span>
                                  <Badge className={`text-[9px] px-1 py-0 ${STATUS_CONFIG[change.to].bgColor} ${STATUS_CONFIG[change.to].color}`}>{STATUS_CONFIG[change.to].label}</Badge>
                                  <span className="text-gray-500 truncate">{change.note}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredGoals.length === 0 && (<div className="text-center py-12 text-sm text-gray-500">No goals match the selected filters.</div>)}
          </div>
        </CardContent>
      </Card>

      {/* Floating Tooltip */}
      {tooltip && (
        <div className="fixed z-50 bg-white border rounded-lg shadow-lg p-3 pointer-events-none" style={{ left: Math.min(tooltip.x, typeof window !== 'undefined' ? window.innerWidth - 280 : 800), top: tooltip.y - 120, maxWidth: 260 }}>
          <p className="text-xs font-semibold text-gray-900 mb-1">{tooltip.goal.title}</p>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between"><span className="text-gray-500">Progress</span><span className="font-medium">{tooltip.goal.progress}%</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Days Remaining</span><span className="font-medium">{Math.max(0, daysBetween('2026-03-10', tooltip.goal.endDate))}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Status</span><Badge className={`text-[9px] px-1 py-0 ${STATUS_CONFIG[tooltip.goal.status].bgColor} ${STATUS_CONFIG[tooltip.goal.status].color}`}>{STATUS_CONFIG[tooltip.goal.status].label}</Badge></div>
            <p className="text-gray-500 mt-1 pt-1 border-t">{tooltip.goal.justification}</p>
          </div>
        </div>
      )}
    </div>
  );
}
