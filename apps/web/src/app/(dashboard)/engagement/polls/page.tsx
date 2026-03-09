'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Plus, Vote, Check } from 'lucide-react';

const POLLS = [
  {
    id: '1', question: 'What day works best for the team outing?', status: 'ACTIVE', totalVotes: 156,
    options: [
      { id: 'a', text: 'Friday, Mar 20', votes: 62 },
      { id: 'b', text: 'Saturday, Mar 21', votes: 48 },
      { id: 'c', text: 'Friday, Mar 27', votes: 31 },
      { id: 'd', text: 'Saturday, Mar 28', votes: 15 },
    ],
  },
  {
    id: '2', question: 'Preferred lunch timing change?', status: 'ACTIVE', totalVotes: 180,
    options: [
      { id: 'a', text: '12:00 PM - 1:00 PM', votes: 95 },
      { id: 'b', text: '12:30 PM - 1:30 PM', votes: 60 },
      { id: 'c', text: '1:00 PM - 2:00 PM', votes: 25 },
    ],
  },
  {
    id: '3', question: 'Should we adopt a 4-day work week trial?', status: 'CLOSED', totalVotes: 195,
    options: [
      { id: 'a', text: 'Yes, absolutely', votes: 120 },
      { id: 'b', text: 'Maybe, with conditions', votes: 55 },
      { id: 'c', text: 'No, prefer current schedule', votes: 20 },
    ],
  },
];

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-600',
};

export default function PollsPage() {
  const [voted, setVoted] = useState<Record<string, string>>({});
  const [showCreate, setShowCreate] = useState(false);

  const handleVote = (pollId: string, optionId: string) => {
    setVoted({ ...voted, [pollId]: optionId });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Polls</h1>
          <p className="text-sm text-gray-500">Quick polls and voting</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setShowCreate(!showCreate)}>
          <Plus size={16} className="mr-2" /> Create Poll
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create New Poll</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Question</Label>
              <Input placeholder="What would you like to ask?" />
            </div>
            <div className="space-y-2">
              <Label>Options</Label>
              <Input placeholder="Option 1" />
              <Input placeholder="Option 2" />
              <Input placeholder="Option 3 (optional)" />
              <Button variant="outline" size="sm"><Plus size={14} className="mr-1" /> Add Option</Button>
            </div>
            <div className="flex gap-2">
              <Button className="bg-teal-600 hover:bg-teal-700">Create Poll</Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {POLLS.map((poll) => {
          const hasVoted = !!voted[poll.id];
          return (
            <Card key={poll.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Vote size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{poll.question}</CardTitle>
                      <p className="text-xs text-gray-500 mt-0.5">{poll.totalVotes} votes</p>
                    </div>
                  </div>
                  <Badge className={STATUS_STYLES[poll.status]}>{poll.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {poll.options.map((opt) => {
                  const pct = Math.round((opt.votes / poll.totalVotes) * 100);
                  const isSelected = voted[poll.id] === opt.id;
                  const showResults = hasVoted || poll.status === 'CLOSED';

                  return (
                    <div key={opt.id}>
                      {!showResults && poll.status === 'ACTIVE' ? (
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleVote(poll.id, opt.id)}
                        >
                          {opt.text}
                        </Button>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className={isSelected ? 'font-medium text-teal-700' : 'text-gray-700'}>
                              {isSelected && <Check size={14} className="inline mr-1" />}
                              {opt.text}
                            </span>
                            <span className="text-gray-500">{pct}%</span>
                          </div>
                          <Progress value={pct} className="h-2" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
