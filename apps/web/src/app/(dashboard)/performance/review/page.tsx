'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  Star,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

const REVIEW_STATUS_STYLES: Record<string, string> = {
  SELF_REVIEW: 'bg-yellow-100 text-yellow-700',
  MANAGER_REVIEW: 'bg-blue-100 text-blue-700',
  CALIBRATION: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

const SAMPLE_TEAM = [
  {
    id: '1',
    name: 'Priya Sharma',
    employeeId: 'EMP001',
    designation: 'Senior Developer',
    department: 'Engineering',
    selfRating: 4.2,
    managerRating: null,
    overallRating: null,
    status: 'MANAGER_REVIEW',
    goalProgress: 75,
    goalsCompleted: 3,
    totalGoals: 5,
  },
  {
    id: '2',
    name: 'Rahul Verma',
    employeeId: 'EMP002',
    designation: 'Developer',
    department: 'Engineering',
    selfRating: 3.8,
    managerRating: null,
    overallRating: null,
    status: 'MANAGER_REVIEW',
    goalProgress: 60,
    goalsCompleted: 2,
    totalGoals: 4,
  },
  {
    id: '3',
    name: 'Anita Patel',
    employeeId: 'EMP003',
    designation: 'QA Engineer',
    department: 'Engineering',
    selfRating: null,
    managerRating: null,
    overallRating: null,
    status: 'SELF_REVIEW',
    goalProgress: 45,
    goalsCompleted: 1,
    totalGoals: 4,
  },
  {
    id: '4',
    name: 'Vikram Singh',
    employeeId: 'EMP004',
    designation: 'Senior Developer',
    department: 'Engineering',
    selfRating: 4.5,
    managerRating: 4.3,
    overallRating: 4.36,
    status: 'COMPLETED',
    goalProgress: 90,
    goalsCompleted: 4,
    totalGoals: 5,
  },
];

function RatingStarsSmall({ value }: { value: number | null }) {
  if (value === null) return <span className="text-xs text-gray-400">-</span>;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={12}
          className={star <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
        />
      ))}
      <span className="ml-1 text-xs font-medium text-gray-700">{value.toFixed(1)}</span>
    </div>
  );
}

export default function TeamReviewPage() {
  const pendingReviews = SAMPLE_TEAM.filter((t) => t.status === 'MANAGER_REVIEW').length;
  const selfPending = SAMPLE_TEAM.filter((t) => t.status === 'SELF_REVIEW').length;
  const completed = SAMPLE_TEAM.filter((t) => t.status === 'COMPLETED').length;

  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [managerRating, setManagerRating] = useState(0);
  const [managerComments, setManagerComments] = useState('');

  const selected = SAMPLE_TEAM.find((t) => t.id === selectedMember);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/performance" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Review</h1>
          <p className="text-sm text-gray-500">Annual Review 2025-26 - Review your team members</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-teal-600" />
              <span className="text-sm text-gray-500">Team Size</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{SAMPLE_TEAM.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-blue-600" />
              <span className="text-sm text-gray-500">Pending Review</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{pendingReviews}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-yellow-600" />
              <span className="text-sm text-gray-500">Self Pending</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{selfPending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-600" />
              <span className="text-sm text-gray-500">Completed</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{completed}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Team Members</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Self Rating</TableHead>
                    <TableHead>Mgr Rating</TableHead>
                    <TableHead>Goals</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_TEAM.map((member) => (
                    <TableRow
                      key={member.id}
                      className={`cursor-pointer ${selectedMember === member.id ? 'bg-teal-50' : ''}`}
                      onClick={() => setSelectedMember(member.id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">
                              {member.name.split(' ').map((n) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.designation}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RatingStarsSmall value={member.selfRating} />
                      </TableCell>
                      <TableCell>
                        <RatingStarsSmall value={member.managerRating} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={member.goalProgress} className="h-1.5 w-16" />
                          <span className="text-xs text-gray-500">
                            {member.goalsCompleted}/{member.totalGoals}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={REVIEW_STATUS_STYLES[member.status]}>
                          {member.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ChevronRight size={14} className="text-gray-400" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Detail Panel */}
        <div>
          {selected ? (
            <Card className="sticky top-20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-teal-100 text-teal-700">
                      {selected.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{selected.name}</CardTitle>
                    <p className="text-xs text-gray-500">{selected.designation}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Self Rating</span>
                    <RatingStarsSmall value={selected.selfRating} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Goal Progress</span>
                    <span className="font-medium">{selected.goalProgress}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <Badge className={REVIEW_STATUS_STYLES[selected.status]}>
                      {selected.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>

                {selected.status === 'MANAGER_REVIEW' && (
                  <>
                    <div className="border-t pt-4 space-y-3">
                      <Label>Your Rating *</Label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setManagerRating(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              size={24}
                              className={
                                star <= managerRating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-300'
                              }
                            />
                          </button>
                        ))}
                      </div>

                      <Label>Comments *</Label>
                      <Textarea
                        value={managerComments}
                        onChange={(e) => setManagerComments(e.target.value)}
                        placeholder="Provide feedback on the employee's performance..."
                        rows={4}
                      />

                      <Button
                        className="w-full bg-teal-600 hover:bg-teal-700"
                        disabled={managerRating === 0 || !managerComments.trim()}
                      >
                        Submit Review
                      </Button>
                    </div>
                  </>
                )}

                {selected.status === 'SELF_REVIEW' && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 text-center">
                      Waiting for self-assessment submission
                    </p>
                  </div>
                )}

                {selected.status === 'COMPLETED' && (
                  <div className="border-t pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-teal-600">
                        {selected.overallRating?.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500">Final Rating</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Users size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">Select a team member to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
