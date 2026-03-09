'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Users, Database, X, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PoolCandidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  currentCompany?: string;
  totalExp?: number;
  skills: string[];
}

interface TalentPool {
  id: string;
  name: string;
  description?: string;
  skills: string[];
  _count: { candidates: number };
  candidates: { candidate: PoolCandidate }[];
}

const MOCK_POOLS: TalentPool[] = [
  {
    id: '1', name: 'Engineering Talent', description: 'Top engineering candidates for future openings',
    skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS'],
    _count: { candidates: 45 },
    candidates: [
      { candidate: { id: 'c1', firstName: 'Arjun', lastName: 'Mehta', email: 'arjun@email.com', currentCompany: 'TCS', totalExp: 5, skills: ['React', 'Node.js', 'TypeScript'] } },
      { candidate: { id: 'c2', firstName: 'Karthik', lastName: 'Reddy', email: 'karthik@email.com', currentCompany: 'Zoho', totalExp: 6, skills: ['Java', 'Spring', 'React'] } },
      { candidate: { id: 'c3', firstName: 'Lakshmi', lastName: 'Rao', email: 'lakshmi@email.com', currentCompany: 'Infosys', totalExp: 4, skills: ['Python', 'AWS', 'Docker'] } },
    ],
  },
  {
    id: '2', name: 'Product & Design', description: 'Product managers and designers for strategic roles',
    skills: ['Product Strategy', 'UX Design', 'Figma', 'User Research'],
    _count: { candidates: 18 },
    candidates: [
      { candidate: { id: 'c4', firstName: 'Meera', lastName: 'Krishnan', email: 'meera@email.com', currentCompany: 'Infosys', totalExp: 7, skills: ['Product Strategy', 'Agile'] } },
      { candidate: { id: 'c5', firstName: 'Ananya', lastName: 'Iyer', email: 'ananya@email.com', currentCompany: 'Accenture', totalExp: 3, skills: ['Figma', 'UX Design'] } },
    ],
  },
  {
    id: '3', name: 'DevOps & Cloud', description: 'Cloud infrastructure and DevOps specialists',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    _count: { candidates: 12 },
    candidates: [
      { candidate: { id: 'c6', firstName: 'Rohit', lastName: 'Verma', email: 'rohit@email.com', currentCompany: 'Wipro', totalExp: 4, skills: ['AWS', 'Docker', 'Kubernetes'] } },
    ],
  },
  {
    id: '4', name: 'Leadership Pipeline', description: 'Candidates for senior management and leadership roles',
    skills: ['People Management', 'Strategy', 'P&L', 'Stakeholder Management'],
    _count: { candidates: 8 },
    candidates: [],
  },
];

export default function TalentPoolPage() {
  const [search, setSearch] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [expandedPool, setExpandedPool] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const filtered = MOCK_POOLS.filter((pool) => {
    const term = search.toLowerCase();
    return (
      !search ||
      pool.name.toLowerCase().includes(term) ||
      pool.skills.some((s) => s.toLowerCase().includes(term))
    );
  });

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Talent Pool</h1>
          <p className="text-gray-500 mt-1">Curated pools of potential candidates for future openings</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Pool
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search pools by name or skills..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Pools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((pool) => (
          <Card key={pool.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{pool.name}</CardTitle>
                  {pool.description && (
                    <p className="text-sm text-gray-500 mt-0.5">{pool.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Users className="h-4 w-4" />
                  <span className="font-semibold">{pool._count.candidates}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {pool.skills.map((skill) => (
                  <span key={skill} className="px-2 py-0.5 rounded-full text-xs bg-teal-50 text-teal-700 border border-teal-200">
                    {skill}
                  </span>
                ))}
              </div>

              {pool.candidates.length > 0 && (
                <div>
                  <button
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                    onClick={() => setExpandedPool(expandedPool === pool.id ? null : pool.id)}
                  >
                    {expandedPool === pool.id ? 'Hide' : 'Show'} candidates ({pool.candidates.length})
                  </button>

                  {expandedPool === pool.id && (
                    <div className="mt-2 space-y-2">
                      {pool.candidates.map((entry) => (
                        <div key={entry.candidate.id} className="flex items-center justify-between py-2 border-t text-sm">
                          <div>
                            <Link
                              href={`/recruitment/candidates/${entry.candidate.id}`}
                              className="font-medium hover:text-teal-600"
                            >
                              {entry.candidate.firstName} {entry.candidate.lastName}
                            </Link>
                            <p className="text-xs text-gray-400">
                              {entry.candidate.currentCompany} · {entry.candidate.totalExp}y exp
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {entry.candidate.skills.slice(0, 2).map((s) => (
                              <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Database className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          No talent pools found.
        </div>
      )}

      {/* Create Pool Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Talent Pool</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); setShowCreateDialog(false); setSkills([]); }}>
            <div className="space-y-4 py-4">
              <div>
                <Label>Pool Name *</Label>
                <Input placeholder="e.g. Engineering Talent" required />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea rows={2} placeholder="Purpose of this talent pool..." />
              </div>
              <div>
                <Label>Skills</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a skill..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" variant="outline" onClick={addSkill}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill) => (
                      <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-teal-50 text-teal-700 border border-teal-200">
                        {skill}
                        <button type="button" onClick={() => setSkills(skills.filter((s) => s !== skill))}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setShowCreateDialog(false); setSkills([]); }}>Cancel</Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">Create Pool</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
