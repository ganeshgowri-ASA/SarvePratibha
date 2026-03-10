'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, ExternalLink, Mail, Phone, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SOURCE_LABELS } from '@sarve-pratibha/shared';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  currentCompany?: string;
  currentTitle?: string;
  totalExp?: number;
  source: string;
  skills: string[];
  location?: string;
  matchScore?: number;
  _count: { applications: number };
  tags: { tag: string }[];
  createdAt: string;
}

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: '1', firstName: 'Arjun', lastName: 'Mehta', email: 'arjun.mehta@email.com', phone: '+91-9876543210',
    currentCompany: 'TCS', currentTitle: 'Senior Software Engineer', totalExp: 5, source: 'LINKEDIN',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'], location: 'Bangalore',
    matchScore: 85,
    _count: { applications: 1 }, tags: [{ tag: 'frontend' }, { tag: 'fullstack' }, { tag: 'top-talent' }], createdAt: '2026-02-20T00:00:00Z',
  },
  {
    id: '2', firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@email.com', phone: '+91-9876543220',
    currentCompany: 'Flipkart', currentTitle: 'Software Engineer II', totalExp: 6, source: 'NAUKRI',
    skills: ['React', 'Node.js', 'TypeScript', 'GraphQL', 'Redis', 'Docker'], location: 'Bangalore',
    matchScore: 72,
    _count: { applications: 1 }, tags: [{ tag: 'fullstack' }, { tag: 'frontend' }], createdAt: '2026-02-25T00:00:00Z',
  },
  {
    id: '3', firstName: 'Vikram', lastName: 'Desai', email: 'vikram.desai@email.com', phone: '+91-9876543230',
    currentCompany: 'Amazon', currentTitle: 'SDE-2', totalExp: 8, source: 'LINKEDIN',
    skills: ['Java', 'Spring Boot', 'Node.js', 'PostgreSQL', 'AWS', 'Kubernetes'], location: 'Hyderabad',
    matchScore: 55,
    _count: { applications: 1 }, tags: [{ tag: 'backend' }, { tag: 'cloud' }], createdAt: '2026-02-18T00:00:00Z',
  },
  {
    id: '4', firstName: 'Sneha', lastName: 'Patel', email: 'sneha.patel@email.com', phone: '+91-9876543240',
    currentCompany: 'Razorpay', currentTitle: 'ML Engineer', totalExp: 3, source: 'CAREER_PAGE',
    skills: ['Python', 'Django', 'TensorFlow', 'Machine Learning', 'REST APIs'], location: 'Pune',
    matchScore: 42,
    _count: { applications: 1 }, tags: [{ tag: 'ml-engineer' }], createdAt: '2026-03-01T00:00:00Z',
  },
  {
    id: '5', firstName: 'Karthik', lastName: 'Reddy', email: 'karthik.r@email.com', phone: '+91-9876543214',
    currentCompany: 'Zoho', currentTitle: 'Full Stack Developer', totalExp: 6, source: 'CAREER_PAGE',
    skills: ['Java', 'Spring Boot', 'React', 'MongoDB'], location: 'Bangalore',
    _count: { applications: 3 }, tags: [{ tag: 'backend' }, { tag: 'fullstack' }], createdAt: '2026-01-15T00:00:00Z',
  },
];

function getMatchScoreColor(score: number) {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

export default function CandidatesPage() {
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [candidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filtered = candidates.filter((c) => {
    const term = search.toLowerCase();
    const matchSearch =
      !search ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.currentCompany?.toLowerCase().includes(term) ||
      c.skills.some((s) => s.toLowerCase().includes(term));
    const matchSource = !sourceFilter || c.source === sourceFilter;
    return matchSearch && matchSource;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
          <p className="text-gray-500 mt-1">Search and manage your candidate database</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Candidate
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, company, or skills..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={sourceFilter} onValueChange={(value) => setSourceFilter(value)}>
              <SelectTrigger><SelectValue placeholder="All Sources" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Sources</SelectItem>
                {Object.entries(SOURCE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label as string}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Candidates List */}
      <div className="space-y-3">
        {filtered.map((candidate) => (
          <Card key={candidate.id} className="hover:shadow-md transition-shadow">
            <CardContent className="py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/recruitment/candidates/${candidate.id}`}
                      className="text-lg font-semibold text-teal-700 hover:underline"
                    >
                      {candidate.firstName} {candidate.lastName}
                    </Link>
                    <Badge variant="outline" className="text-xs">
                      {SOURCE_LABELS[candidate.source] || candidate.source}
                    </Badge>
                    {candidate._count.applications > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {candidate._count.applications} application{candidate._count.applications > 1 ? 's' : ''}
                      </Badge>
                    )}
                    {candidate.matchScore !== undefined && (
                      <Badge className={`text-xs ${getMatchScoreColor(candidate.matchScore)}`}>
                        <Target className="h-3 w-3 mr-1" />
                        {candidate.matchScore}% Match
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {candidate.currentTitle}
                    {candidate.currentCompany && ` at ${candidate.currentCompany}`}
                    {candidate.totalExp !== undefined && ` · ${candidate.totalExp} yrs exp`}
                  </p>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {candidate.email}
                    </span>
                    {candidate.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {candidate.phone}
                      </span>
                    )}
                    {candidate.location && <span>{candidate.location}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {candidate.skills.slice(0, 6).map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 6 && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500">
                        +{candidate.skills.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
                <Link href={`/recruitment/candidates/${candidate.id}`}>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No candidates found matching your criteria.
        </div>
      )}

      {/* Add Candidate Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Candidate</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowAddDialog(false);
            }}
          >
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" name="firstName" required />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" name="lastName" required />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" />
              </div>
              <div>
                <Label htmlFor="currentCompany">Current Company</Label>
                <Input id="currentCompany" name="currentCompany" />
              </div>
              <div>
                <Label htmlFor="currentTitle">Current Title</Label>
                <Input id="currentTitle" name="currentTitle" />
              </div>
              <div>
                <Label htmlFor="totalExp">Experience (years)</Label>
                <Input id="totalExp" name="totalExp" type="number" min="0" step="0.5" />
              </div>
              <div>
                <Label htmlFor="source">Source</Label>
                <Select defaultValue="OTHER">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(SOURCE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label as string}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                Add Candidate
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
