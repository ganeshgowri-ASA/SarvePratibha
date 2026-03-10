'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BookOpen,
  Calendar,
  MessageSquare,
  Plus,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  ListTodo,
  Send,
  User,
} from 'lucide-react';

type DiaryTag = 'Achievement' | 'Blocker' | 'Learning' | 'Task';
type SummaryView = 'weekly' | 'monthly';

const TAG_STYLES: Record<DiaryTag, string> = {
  Achievement: 'bg-green-100 text-green-700 border-green-200',
  Blocker: 'bg-red-100 text-red-700 border-red-200',
  Learning: 'bg-purple-100 text-purple-700 border-purple-200',
  Task: 'bg-blue-100 text-blue-700 border-blue-200',
};

const TAG_ICONS: Record<DiaryTag, React.ElementType> = {
  Achievement: CheckCircle2,
  Blocker: AlertTriangle,
  Learning: Lightbulb,
  Task: ListTodo,
};

interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  tags: DiaryTag[];
  linkedGoal: string;
  managerComment?: string;
  managerName?: string;
  managerCommentDate?: string;
}

const GOAL_OPTIONS = [
  { id: 'g1', title: 'Complete API migration' },
  { id: 'g2', title: 'Mentor 2 junior developers' },
  { id: 'g3', title: 'Reduce deployment time by 40%' },
  { id: 'g4', title: 'Complete AWS certification' },
  { id: 'g5', title: 'Improve test coverage to 80%' },
  { id: 'g6', title: 'Improve cross-team collaboration' },
  { id: 'g7', title: 'Develop leadership skills through mentoring' },
  { id: 'g8', title: 'AWS Solutions Architect certification' },
  { id: 'g9', title: 'Master React performance optimization' },
];

const SAMPLE_DIARY_ENTRIES: DiaryEntry[] = [
  {
    id: '1', date: '2026-03-10',
    content: 'Completed the user authentication module migration from REST v1 to v2 API. All 47 endpoints now use the new auth middleware. Performance benchmarks show 23% improvement in response times.',
    tags: ['Achievement', 'Task'], linkedGoal: 'Complete API migration',
    managerComment: 'Excellent progress! The performance improvement is a great bonus. Make sure to document the migration steps for the team wiki.',
    managerName: 'Priya Sharma', managerCommentDate: '2026-03-10',
  },
  {
    id: '2', date: '2026-03-09',
    content: 'Ran into a CORS issue with the new API gateway configuration. Cross-origin requests from the mobile app are being blocked. Need to coordinate with the DevOps team to update the gateway policies.',
    tags: ['Blocker'], linkedGoal: 'Complete API migration',
  },
  {
    id: '3', date: '2026-03-08',
    content: 'Had a productive mentoring session with Rahul on React state management patterns. Covered useReducer, context optimization, and when to reach for external state management.',
    tags: ['Achievement', 'Learning'], linkedGoal: 'Mentor 2 junior developers',
    managerComment: 'Great initiative! Consider documenting these sessions as a knowledge base article.',
    managerName: 'Priya Sharma', managerCommentDate: '2026-03-09',
  },
  {
    id: '4', date: '2026-03-07',
    content: 'Learned about AWS Lambda cold start optimization techniques. Key takeaway: provisioned concurrency can reduce cold starts by 90%, but costs need to be evaluated.',
    tags: ['Learning'], linkedGoal: 'Complete AWS certification',
  },
  {
    id: '5', date: '2026-03-07',
    content: 'Set up the CI/CD pipeline parallelization. Build time reduced from 18 minutes to 11 minutes. Next step: implement caching for node_modules and Docker layers.',
    tags: ['Achievement', 'Task'], linkedGoal: 'Reduce deployment time by 40%',
    managerComment: 'Good progress on the deployment optimization. Keep tracking the metrics weekly.',
    managerName: 'Priya Sharma', managerCommentDate: '2026-03-08',
  },
  {
    id: '6', date: '2026-03-06',
    content: 'Organized a cross-team standup with the QA and design teams to align on Q2 sprint priorities. Identified 3 shared dependencies that need coordination.',
    tags: ['Task', 'Achievement'], linkedGoal: 'Improve cross-team collaboration',
  },
  {
    id: '7', date: '2026-03-05',
    content: 'Completed AWS Solutions Architect practice exam #3. Scored 82% - improving from 74% last week. Weak areas: advanced networking (VPC peering, Transit Gateway).',
    tags: ['Learning', 'Task'], linkedGoal: 'AWS Solutions Architect certification',
  },
  {
    id: '8', date: '2026-03-04',
    content: 'Reviewed Anita\'s PR on the payment processing module. Provided detailed feedback on error handling patterns and suggested using discriminated unions for payment states.',
    tags: ['Task', 'Achievement'], linkedGoal: 'Develop leadership skills through mentoring',
  },
  {
    id: '9', date: '2026-03-03',
    content: 'Investigated React profiler results for the dashboard. Found that the KPI widget re-renders 12 times per data fetch due to missing memoization. Created a fix with useMemo and React.memo.',
    tags: ['Learning', 'Task'], linkedGoal: 'Master React performance optimization',
    managerComment: 'Please share the profiling approach with the team in the next tech talk.',
    managerName: 'Priya Sharma', managerCommentDate: '2026-03-04',
  },
  {
    id: '10', date: '2026-03-02',
    content: 'Blocker: Test environment database is running out of disk space. Existing tests are creating too many fixtures without cleanup. Need to implement a test data teardown strategy.',
    tags: ['Blocker'], linkedGoal: 'Improve test coverage to 80%',
  },
];

const WORD_CLOUD_DATA = [
  { word: 'API', count: 12 }, { word: 'migration', count: 9 }, { word: 'React', count: 8 },
  { word: 'performance', count: 7 }, { word: 'mentoring', count: 7 }, { word: 'testing', count: 6 },
  { word: 'AWS', count: 6 }, { word: 'deployment', count: 5 }, { word: 'optimization', count: 5 },
  { word: 'collaboration', count: 4 }, { word: 'pipeline', count: 4 }, { word: 'authentication', count: 3 },
  { word: 'code-review', count: 3 }, { word: 'CI/CD', count: 3 }, { word: 'leadership', count: 2 },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

function WordCloud({ data }: { data: { word: string; count: number }[] }) {
  const maxCount = Math.max(...data.map((d) => d.count));
  const minCount = Math.min(...data.map((d) => d.count));
  const colors = ['text-teal-400', 'text-blue-500', 'text-purple-500', 'text-teal-600', 'text-blue-600', 'text-orange-500'];

  return (
    <div className="flex flex-wrap gap-2 items-center justify-center py-4">
      {data.map((item, i) => {
        const scale = minCount === maxCount ? 1 : (item.count - minCount) / (maxCount - minCount);
        const fontSize = 0.75 + scale * 1.0;
        const fontWeight = scale > 0.5 ? 700 : scale > 0.25 ? 600 : 400;
        return (
          <span
            key={item.word}
            className={`${colors[i % colors.length]} transition-transform hover:scale-110 cursor-default`}
            style={{ fontSize: `${fontSize}rem`, fontWeight }}
            title={`${item.word}: ${item.count} mentions`}
          >
            {item.word}
          </span>
        );
      })}
    </div>
  );
}

export default function DailyDiaryTab() {
  const [entries, setEntries] = useState<DiaryEntry[]>(SAMPLE_DIARY_ENTRIES);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState<DiaryTag[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [summaryView, setSummaryView] = useState<SummaryView>('weekly');
  const [selectedDate, setSelectedDate] = useState('2026-03-10');
  const [managerReply, setManagerReply] = useState<Record<string, string>>({});

  const entriesByDate = useMemo(() => {
    const grouped: Record<string, DiaryEntry[]> = {};
    entries.forEach((entry) => {
      if (!grouped[entry.date]) grouped[entry.date] = [];
      grouped[entry.date].push(entry);
    });
    return grouped;
  }, [entries]);

  const sortedDates = useMemo(
    () => Object.keys(entriesByDate).sort((a, b) => b.localeCompare(a)),
    [entriesByDate],
  );

  const tagCounts = useMemo(() => {
    const counts: Record<DiaryTag, number> = { Achievement: 0, Blocker: 0, Learning: 0, Task: 0 };
    entries.forEach((e) => e.tags.forEach((t) => counts[t]++));
    return counts;
  }, [entries]);

  const toggleTag = (tag: DiaryTag) => {
    setNewTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const addEntry = () => {
    if (!newContent.trim()) return;
    const entry: DiaryEntry = {
      id: `new-${Date.now()}`,
      date: selectedDate,
      content: newContent,
      tags: newTags.length > 0 ? newTags : ['Task'],
      linkedGoal: newGoal || GOAL_OPTIONS[0].title,
    };
    setEntries((prev) => [entry, ...prev]);
    setNewContent('');
    setNewTags([]);
    setNewGoal('');
    setShowNewEntry(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen size={20} className="text-teal-600" />
            Daily Diary
          </h2>
          <p className="text-sm text-gray-500">Record daily activities, link to goals, and track themes</p>
        </div>
        <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => setShowNewEntry(!showNewEntry)}>
          <Plus size={16} className="mr-1" /> New Entry
        </Button>
      </div>

      {/* New Entry Form */}
      {showNewEntry && (
        <Card className="border-teal-200 shadow-md">
          <CardContent className="pt-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-700 mb-1 block">Date</label>
                <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-700 mb-1 block">Link to Goal</label>
                <Select value={newGoal} onValueChange={setNewGoal}>
                  <SelectTrigger><SelectValue placeholder="Select a goal..." /></SelectTrigger>
                  <SelectContent>
                    {GOAL_OPTIONS.map((g) => (<SelectItem key={g.id} value={g.title}>{g.title}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Journal Entry</label>
              <Textarea placeholder="What did you work on today? Describe your progress, learnings, and any blockers..." value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={4} className="resize-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-2 block">Tags</label>
              <div className="flex gap-2">
                {(Object.keys(TAG_STYLES) as DiaryTag[]).map((tag) => {
                  const Icon = TAG_ICONS[tag];
                  return (
                    <button key={tag} onClick={() => toggleTag(tag)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${newTags.includes(tag) ? TAG_STYLES[tag] + ' ring-2 ring-offset-1 ring-teal-400' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}>
                      <Icon size={12} />{tag}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowNewEntry(false)}>Cancel</Button>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={addEntry}>Save Entry</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.keys(TAG_STYLES) as DiaryTag[]).map((tag) => {
          const Icon = TAG_ICONS[tag];
          return (
            <Card key={tag}>
              <CardContent className="pt-4 pb-3 px-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${TAG_STYLES[tag]}`}><Icon size={14} /></div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{tagCounts[tag]}</p>
                    <p className="text-[10px] text-gray-500">{tag}s</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Theme Summary with Word Cloud */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar size={18} className="text-teal-600" />
              Theme Summary
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button variant={summaryView === 'weekly' ? 'default' : 'outline'} size="sm" className={summaryView === 'weekly' ? 'bg-teal-600 hover:bg-teal-700 text-xs' : 'text-xs'} onClick={() => setSummaryView('weekly')}>Weekly</Button>
              <Button variant={summaryView === 'monthly' ? 'default' : 'outline'} size="sm" className={summaryView === 'monthly' ? 'bg-teal-600 hover:bg-teal-700 text-xs' : 'text-xs'} onClick={() => setSummaryView('monthly')}>Monthly</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">{summaryView === 'weekly' ? 'Week of Mar 3 - Mar 10, 2026' : 'March 2026'}</p>
            <p className="text-sm text-gray-600 mb-3">{entries.length} entries &middot; Most frequent themes</p>
            <WordCloud data={WORD_CLOUD_DATA} />
          </div>
        </CardContent>
      </Card>

      {/* Diary Entries Timeline */}
      <div className="space-y-4">
        {sortedDates.map((date) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-teal-500" />
              <h3 className="text-sm font-semibold text-gray-900">{formatDate(date)}</h3>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="space-y-3 ml-4">
              {entriesByDate[date].map((entry) => (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex flex-wrap gap-1.5">
                        {entry.tags.map((tag) => {
                          const Icon = TAG_ICONS[tag];
                          return (<Badge key={tag} className={`text-[10px] px-1.5 py-0 ${TAG_STYLES[tag]}`}><Icon size={10} className="mr-0.5" />{tag}</Badge>);
                        })}
                      </div>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">{entry.linkedGoal}</Badge>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{entry.content}</p>

                    {entry.managerComment && (
                      <div className="mt-3 pt-3 border-t border-dashed">
                        <div className="flex items-start gap-2 bg-blue-50/50 rounded-lg p-2.5">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0"><User size={12} className="text-blue-600" /></div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-blue-700">{entry.managerName}</span>
                              <span className="text-[10px] text-gray-400">{entry.managerCommentDate}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-0.5">{entry.managerComment}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {!entry.managerComment && (
                      <div className="mt-3 pt-3 border-t border-dashed">
                        <div className="flex items-center gap-2">
                          <MessageSquare size={12} className="text-gray-400" />
                          <span className="text-[10px] text-gray-400">Manager feedback</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Input placeholder="Add a comment..." className="text-xs h-8" value={managerReply[entry.id] || ''} onChange={(e) => setManagerReply((prev) => ({ ...prev, [entry.id]: e.target.value }))} />
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-teal-600 hover:text-teal-700" onClick={() => {
                            if (!managerReply[entry.id]?.trim()) return;
                            setEntries((prev) => prev.map((e) => e.id === entry.id ? { ...e, managerComment: managerReply[entry.id], managerName: 'Priya Sharma', managerCommentDate: '2026-03-10' } : e));
                            setManagerReply((prev) => ({ ...prev, [entry.id]: '' }));
                          }}><Send size={14} /></Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 py-2">
        <Button variant="outline" size="sm" className="text-xs"><ChevronLeft size={14} className="mr-1" />Previous Week</Button>
        <span className="text-xs text-gray-500">Showing Mar 2 - Mar 10, 2026</span>
        <Button variant="outline" size="sm" className="text-xs">Next Week<ChevronRight size={14} className="ml-1" /></Button>
      </div>
    </div>
  );
}
