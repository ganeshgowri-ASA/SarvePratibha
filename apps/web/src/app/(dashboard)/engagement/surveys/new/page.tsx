'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, GripVertical, Save } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: string;
  options: string[];
  isRequired: boolean;
}

export default function NewSurveyPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', text: '', type: 'RATING', options: [], isRequired: true },
  ]);

  const addQuestion = () => {
    setQuestions([...questions, {
      id: String(Date.now()),
      text: '',
      type: 'RATING',
      options: [],
      isRequired: true,
    }]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id: string, field: string, value: unknown) => {
    setQuestions(questions.map((q) => q.id === id ? { ...q, [field]: value } : q));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Survey</h1>
        <p className="text-sm text-gray-500">Build a survey with drag-and-drop questions</p>
      </div>

      {/* Survey Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Survey Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Survey title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" placeholder="Brief description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} id="anon" />
            <Label htmlFor="anon">Anonymous responses</Label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start">Start Date</Label>
              <Input id="start" type="date" />
            </div>
            <div>
              <Label htmlFor="end">End Date</Label>
              <Input id="end" type="date" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Questions ({questions.length})</CardTitle>
          <Button onClick={addQuestion} size="sm" variant="outline">
            <Plus size={14} className="mr-1" /> Add Question
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical size={16} className="text-gray-400 cursor-grab" />
                  <span className="text-sm font-medium text-gray-700">Q{idx + 1}</span>
                </div>
                <Button size="sm" variant="ghost" onClick={() => removeQuestion(q.id)} disabled={questions.length === 1}>
                  <Trash2 size={14} className="text-red-500" />
                </Button>
              </div>
              <Input
                placeholder="Enter your question"
                value={q.text}
                onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type</Label>
                  <Select value={q.type} onValueChange={(v) => updateQuestion(q.id, 'type', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RATING">Rating (1-5)</SelectItem>
                      <SelectItem value="NPS">NPS (0-10)</SelectItem>
                      <SelectItem value="TEXT">Free Text</SelectItem>
                      <SelectItem value="SINGLE_CHOICE">Single Choice</SelectItem>
                      <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Switch
                    checked={q.isRequired}
                    onCheckedChange={(v) => updateQuestion(q.id, 'isRequired', v)}
                    id={`req-${q.id}`}
                  />
                  <Label htmlFor={`req-${q.id}`}>Required</Label>
                </div>
              </div>
              {(q.type === 'SINGLE_CHOICE' || q.type === 'MULTIPLE_CHOICE') && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex gap-2">
                      <Input
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...q.options];
                          newOpts[oi] = e.target.value;
                          updateQuestion(q.id, 'options', newOpts);
                        }}
                        placeholder={`Option ${oi + 1}`}
                      />
                      <Button size="sm" variant="ghost" onClick={() => {
                        updateQuestion(q.id, 'options', q.options.filter((_, i) => i !== oi));
                      }}>
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" onClick={() => updateQuestion(q.id, 'options', [...q.options, ''])}>
                    <Plus size={12} className="mr-1" /> Add Option
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Save size={16} className="mr-2" /> Publish Survey
        </Button>
        <Button variant="outline">Save as Draft</Button>
      </div>
    </div>
  );
}
