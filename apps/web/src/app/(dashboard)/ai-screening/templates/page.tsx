'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Copy,
  Search,
} from 'lucide-react';

const mockTemplates = [
  {
    id: '1',
    name: 'Technical Interview - SDE',
    description: 'Standard technical screening for software development engineers',
    roleTitle: 'Software Engineer',
    department: 'Engineering',
    questionCount: 8,
    isActive: true,
    createdAt: '2026-02-15',
  },
  {
    id: '2',
    name: 'Behavioral Assessment',
    description: 'Assess behavioral and soft skills across all roles',
    roleTitle: null,
    department: null,
    questionCount: 6,
    isActive: true,
    createdAt: '2026-02-20',
  },
  {
    id: '3',
    name: 'Leadership Evaluation',
    description: 'Leadership and management capability assessment for senior roles',
    roleTitle: 'Engineering Manager',
    department: 'Engineering',
    questionCount: 10,
    isActive: true,
    createdAt: '2026-03-01',
  },
  {
    id: '4',
    name: 'Product Manager Screen',
    description: 'Product sense, analytical thinking, and stakeholder management',
    roleTitle: 'Product Manager',
    department: 'Product',
    questionCount: 7,
    isActive: true,
    createdAt: '2026-03-05',
  },
  {
    id: '5',
    name: 'Data Science Assessment',
    description: 'ML concepts, statistical knowledge, and problem-solving',
    roleTitle: 'Data Scientist',
    department: 'Analytics',
    questionCount: 9,
    isActive: false,
    createdAt: '2026-01-10',
  },
];

export default function TemplatesPage() {
  const [search, setSearch] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [questions, setQuestions] = useState([
    { text: '', type: 'TECHNICAL', difficulty: 'MEDIUM', expectedAnswer: '', maxScore: 10 },
  ]);

  const filtered = mockTemplates.filter(
    (t) => t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.roleTitle?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  const addQuestion = () => {
    setQuestions([...questions, { text: '', type: 'TECHNICAL', difficulty: 'MEDIUM', expectedAnswer: '', maxScore: 10 }]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-teal-600" />
            Screening Templates
          </h1>
          <p className="text-gray-500 mt-1">Create and manage question sets for different roles</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{template.name}</CardTitle>
                <Badge variant="secondary" className={template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}>
                  {template.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-3">{template.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {template.roleTitle && (
                  <Badge variant="outline" className="text-xs">{template.roleTitle}</Badge>
                )}
                {template.department && (
                  <Badge variant="outline" className="text-xs">{template.department}</Badge>
                )}
                <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                  {template.questionCount} questions
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Created {template.createdAt}</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Screening Template</DialogTitle>
            <DialogDescription>Define a reusable question set for AI screening sessions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input placeholder="e.g., Technical Interview - SDE" />
              </div>
              <div className="space-y-2">
                <Label>Role Title (Optional)</Label>
                <Input placeholder="e.g., Software Engineer" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department (Optional)</Label>
                <Input placeholder="e.g., Engineering" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Brief description of this template" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Questions</Label>
                <Button variant="outline" size="sm" onClick={addQuestion}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Question
                </Button>
              </div>

              {questions.map((q, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-medium text-gray-500">Question {idx + 1}</span>
                      {questions.length > 1 && (
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500" onClick={() => removeQuestion(idx)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                    <Textarea placeholder="Enter question text..." rows={2} />
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Type</Label>
                        <Select defaultValue="TECHNICAL">
                          <option value="TECHNICAL">Technical</option>
                          <option value="BEHAVIORAL">Behavioral</option>
                          <option value="SITUATIONAL">Situational</option>
                          <option value="CULTURAL_FIT">Cultural Fit</option>
                          <option value="COMMUNICATION">Communication</option>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Difficulty</Label>
                        <Select defaultValue="MEDIUM">
                          <option value="EASY">Easy</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HARD">Hard</option>
                          <option value="EXPERT">Expert</option>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Max Score</Label>
                        <Input type="number" defaultValue={10} min={1} max={100} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Expected Answer (Optional)</Label>
                      <Textarea placeholder="Describe what a good answer looks like..." rows={2} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setShowCreateDialog(false)}>
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
