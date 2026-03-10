'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  DoorOpen, Users, Monitor, Pencil, Video, Plus, Calendar,
  Clock, ExternalLink, Check, X, HelpCircle, Minus,
  Bell, RefreshCw, Mail, UserPlus, Link2, ChevronRight,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type VideoPlatform = 'teams' | 'meet' | 'zoom' | 'webex' | 'none';
type RecurrenceType = 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly';
type RsvpStatus = 'accepted' | 'declined' | 'tentative' | 'no_response';

interface Attendee {
  name: string;
  email: string;
  status: RsvpStatus;
  isExternal?: boolean;
}

interface DemoMeeting {
  id: string;
  title: string;
  agenda: string;
  roomId: string;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  platform: VideoPlatform;
  meetingLink: string;
  organizer: string;
  attendees: Attendee[];
  recurrence: RecurrenceType;
  reminder: number;
}

// ─── Static Data ─────────────────────────────────────────────────────────────

const MEETING_ROOMS = [
  { id: '1', name: 'Boardroom A', floor: 1, capacity: 20, hasProjector: true, hasWhiteboard: true, hasVideoConf: true },
  { id: '2', name: 'Collab Space B', floor: 1, capacity: 8, hasProjector: true, hasWhiteboard: true, hasVideoConf: false },
  { id: '3', name: 'Huddle Room C', floor: 2, capacity: 4, hasProjector: false, hasWhiteboard: true, hasVideoConf: true },
  { id: '4', name: 'Conference D', floor: 2, capacity: 12, hasProjector: true, hasWhiteboard: false, hasVideoConf: true },
  { id: '5', name: 'Training Hall', floor: 3, capacity: 40, hasProjector: true, hasWhiteboard: true, hasVideoConf: true },
  { id: '6', name: 'Huddle Room E', floor: 3, capacity: 4, hasProjector: false, hasWhiteboard: false, hasVideoConf: true },
];

const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

const EMPLOYEES = [
  'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Reddy',
  'Vikram Singh', 'Ananya Gupta', 'Rajesh Nair', 'Deepika Iyer',
  'Karthik Menon', 'Meera Joshi',
];

const PLATFORM_CONFIG: Record<VideoPlatform, { label: string; color: string; bgColor: string; borderColor: string; linkDomain: string }> = {
  teams:  { label: 'Microsoft Teams', color: 'text-blue-700',  bgColor: 'bg-blue-50',  borderColor: 'border-blue-300', linkDomain: 'https://teams.microsoft.com/meet/' },
  meet:   { label: 'Google Meet',     color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-300', linkDomain: 'https://meet.google.com/' },
  zoom:   { label: 'Zoom',            color: 'text-blue-700',  bgColor: 'bg-blue-50',  borderColor: 'border-blue-300', linkDomain: 'https://zoom.us/j/' },
  webex:  { label: 'Cisco WebEx',     color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-300', linkDomain: 'https://webex.com/meet/' },
  none:   { label: 'In-Person Only',  color: 'text-gray-600',  bgColor: 'bg-gray-50',  borderColor: 'border-gray-300', linkDomain: '' },
};

const DEMO_MEETINGS: DemoMeeting[] = [
  {
    id: 'm1',
    title: 'Sprint Planning',
    agenda: 'Plan sprint 24 tasks, assign story points, and discuss blockers from last sprint.',
    roomId: '1',
    roomName: 'Boardroom A',
    date: '2026-03-10',
    startTime: '10:00',
    endTime: '11:00',
    platform: 'teams',
    meetingLink: 'https://teams.microsoft.com/meet/sp24-planning',
    organizer: 'Rahul Sharma',
    recurrence: 'biweekly',
    reminder: 15,
    attendees: [
      { name: 'Rahul Sharma', email: 'rahul@sarvepratibha.com', status: 'accepted' },
      { name: 'Priya Patel', email: 'priya@sarvepratibha.com', status: 'accepted' },
      { name: 'Amit Kumar', email: 'amit@sarvepratibha.com', status: 'tentative' },
      { name: 'Sneha Reddy', email: 'sneha@sarvepratibha.com', status: 'accepted' },
      { name: 'Karthik Menon', email: 'karthik@sarvepratibha.com', status: 'no_response' },
    ],
  },
  {
    id: 'm2',
    title: 'Design Review',
    agenda: 'Review new dashboard wireframes and finalize color palette for Q2 redesign.',
    roomId: '2',
    roomName: 'Collab Space B',
    date: '2026-03-10',
    startTime: '11:30',
    endTime: '12:30',
    platform: 'meet',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    organizer: 'Priya Patel',
    recurrence: 'weekly',
    reminder: 10,
    attendees: [
      { name: 'Priya Patel', email: 'priya@sarvepratibha.com', status: 'accepted' },
      { name: 'Deepika Iyer', email: 'deepika@sarvepratibha.com', status: 'accepted' },
      { name: 'Meera Joshi', email: 'meera@sarvepratibha.com', status: 'declined' },
      { name: 'John Carter', email: 'john@externalclient.com', status: 'accepted', isExternal: true },
    ],
  },
  {
    id: 'm3',
    title: 'Client Demo - Project Alpha',
    agenda: 'Present milestone 3 deliverables to client stakeholders. Prepare demo environment.',
    roomId: '4',
    roomName: 'Conference D',
    date: '2026-03-10',
    startTime: '14:00',
    endTime: '15:30',
    platform: 'zoom',
    meetingLink: 'https://zoom.us/j/98765432100',
    organizer: 'Vikram Singh',
    recurrence: 'none',
    reminder: 30,
    attendees: [
      { name: 'Vikram Singh', email: 'vikram@sarvepratibha.com', status: 'accepted' },
      { name: 'Rajesh Nair', email: 'rajesh@sarvepratibha.com', status: 'accepted' },
      { name: 'Amit Kumar', email: 'amit@sarvepratibha.com', status: 'accepted' },
      { name: 'Sarah Miller', email: 'sarah@clientcorp.com', status: 'tentative', isExternal: true },
      { name: 'David Chen', email: 'david@clientcorp.com', status: 'no_response', isExternal: true },
    ],
  },
  {
    id: 'm4',
    title: 'HR Policy Update',
    agenda: 'Discuss updated leave policy and remote work guidelines effective Q2 2026.',
    roomId: '5',
    roomName: 'Training Hall',
    date: '2026-03-10',
    startTime: '16:00',
    endTime: '17:00',
    platform: 'webex',
    meetingLink: 'https://webex.com/meet/hr-policy-q2',
    organizer: 'Ananya Gupta',
    recurrence: 'monthly',
    reminder: 15,
    attendees: [
      { name: 'Ananya Gupta', email: 'ananya@sarvepratibha.com', status: 'accepted' },
      { name: 'Sneha Reddy', email: 'sneha@sarvepratibha.com', status: 'accepted' },
      { name: 'Rajesh Nair', email: 'rajesh@sarvepratibha.com', status: 'no_response' },
      { name: 'Deepika Iyer', email: 'deepika@sarvepratibha.com', status: 'accepted' },
    ],
  },
];

const BOOKED_SLOTS: Record<string, { start: string; end: string; title: string; bookedBy: string; platform: VideoPlatform }[]> = {
  '1': [
    { start: '10:00', end: '11:00', title: 'Sprint Planning', bookedBy: 'Rahul S.', platform: 'teams' },
    { start: '14:00', end: '15:30', title: 'Client Call', bookedBy: 'Manager', platform: 'zoom' },
  ],
  '2': [
    { start: '11:30', end: '12:30', title: 'Design Review', bookedBy: 'Priya P.', platform: 'meet' },
  ],
  '4': [
    { start: '14:00', end: '15:30', title: 'Client Demo', bookedBy: 'Vikram S.', platform: 'zoom' },
  ],
  '5': [
    { start: '16:00', end: '17:00', title: 'HR Policy Update', bookedBy: 'Ananya G.', platform: 'webex' },
  ],
};

// ─── Helper Components ───────────────────────────────────────────────────────

function PlatformIcon({ platform, size = 16 }: { platform: VideoPlatform; size?: number }) {
  const config = PLATFORM_CONFIG[platform];
  if (platform === 'none') return <DoorOpen size={size} className="text-gray-500" />;
  return <Video size={size} className={config.color} />;
}

function RsvpIcon({ status }: { status: RsvpStatus }) {
  switch (status) {
    case 'accepted':    return <Check size={14} className="text-green-600" />;
    case 'declined':    return <X size={14} className="text-red-500" />;
    case 'tentative':   return <HelpCircle size={14} className="text-yellow-500" />;
    case 'no_response': return <Minus size={14} className="text-gray-400" />;
  }
}

function RsvpBadge({ status }: { status: RsvpStatus }) {
  const styles: Record<RsvpStatus, string> = {
    accepted:    'bg-green-50 text-green-700 border-green-200',
    declined:    'bg-red-50 text-red-700 border-red-200',
    tentative:   'bg-yellow-50 text-yellow-700 border-yellow-200',
    no_response: 'bg-gray-50 text-gray-500 border-gray-200',
  };
  const labels: Record<RsvpStatus, string> = {
    accepted: 'Accepted', declined: 'Declined', tentative: 'Tentative', no_response: 'No Response',
  };
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border', styles[status])}>
      <RsvpIcon status={status} />
      {labels[status]}
    </span>
  );
}

function platformBorderColor(platform: VideoPlatform) {
  switch (platform) {
    case 'teams': case 'zoom': return 'border-l-blue-500';
    case 'meet': case 'webex': return 'border-l-green-500';
    default: return 'border-l-teal-500';
  }
}

function generateMeetingLink(platform: VideoPlatform): string {
  if (platform === 'none') return '';
  const id = Math.random().toString(36).substring(2, 10);
  return PLATFORM_CONFIG[platform].linkDomain + id;
}

// ─── Booking Dialog Content ──────────────────────────────────────────────────

function BookRoomDialogContent({ room }: { room: typeof MEETING_ROOMS[number] }) {
  const [selectedPlatform, setSelectedPlatform] = useState<VideoPlatform>('none');
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [externalEmails, setExternalEmails] = useState<string[]>([]);
  const [externalInput, setExternalInput] = useState('');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const [reminder, setReminder] = useState('15');

  const filteredEmployees = attendeeSearch.length > 0
    ? EMPLOYEES.filter(e => e.toLowerCase().includes(attendeeSearch.toLowerCase()) && !selectedAttendees.includes(e))
    : [];

  const generatedLink = selectedPlatform !== 'none' ? generateMeetingLink(selectedPlatform) : '';

  const addExternalEmail = () => {
    const email = externalInput.trim();
    if (email && email.includes('@') && !externalEmails.includes(email)) {
      setExternalEmails([...externalEmails, email]);
      setExternalInput('');
    }
  };

  return (
    <div className="space-y-5 pt-2 max-h-[70vh] overflow-y-auto pr-1">
      {/* Meeting Title */}
      <div className="space-y-2">
        <Label>Meeting Title</Label>
        <Input placeholder="e.g. Sprint Planning" />
      </div>

      {/* Meeting Agenda */}
      <div className="space-y-2">
        <Label>Meeting Agenda / Description</Label>
        <Textarea placeholder="Describe the purpose and topics for this meeting..." rows={3} />
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label>Date</Label>
          <Input type="date" defaultValue="2026-03-10" />
        </div>
        <div className="space-y-2">
          <Label>Start Time</Label>
          <Input type="time" />
        </div>
        <div className="space-y-2">
          <Label>End Time</Label>
          <Input type="time" />
        </div>
      </div>

      <Separator />

      {/* Video Conferencing Platform Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Video Conferencing</Label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(PLATFORM_CONFIG) as VideoPlatform[]).map((key) => {
            const cfg = PLATFORM_CONFIG[key];
            const isSelected = selectedPlatform === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedPlatform(key)}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all',
                  isSelected
                    ? cn(cfg.bgColor, cfg.borderColor, 'ring-1 ring-offset-1', key === 'teams' || key === 'zoom' ? 'ring-blue-300' : key === 'none' ? 'ring-gray-300' : 'ring-green-300')
                    : 'border-gray-200 hover:border-gray-300 bg-white',
                )}
              >
                <div className={cn('p-1.5 rounded-md', isSelected ? cfg.bgColor : 'bg-gray-100')}>
                  <PlatformIcon platform={key} size={18} />
                </div>
                <span className={cn('text-sm font-medium', isSelected ? cfg.color : 'text-gray-700')}>
                  {cfg.label}
                </span>
                {isSelected && <Check size={16} className={cn('ml-auto', cfg.color)} />}
              </button>
            );
          })}
        </div>
        {generatedLink && (
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border text-xs">
            <Link2 size={14} className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-600 truncate">{generatedLink}</span>
          </div>
        )}
      </div>

      <Separator />

      {/* Attendees */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Attendees</Label>
        {selectedAttendees.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedAttendees.map((name) => (
              <span key={name} className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full text-xs border border-teal-200">
                {name}
                <button type="button" onClick={() => setSelectedAttendees(selectedAttendees.filter(a => a !== name))} className="hover:text-teal-900">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="relative">
          <Input
            placeholder="Search employees..."
            value={attendeeSearch}
            onChange={(e) => setAttendeeSearch(e.target.value)}
          />
          {filteredEmployees.length > 0 && (
            <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
              {filteredEmployees.map((emp) => (
                <button
                  key={emp}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-teal-50 flex items-center gap-2"
                  onClick={() => {
                    setSelectedAttendees([...selectedAttendees, emp]);
                    setAttendeeSearch('');
                  }}
                >
                  <UserPlus size={14} className="text-gray-400" />
                  {emp}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* External Attendees */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">External Attendees</Label>
        {externalEmails.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {externalEmails.map((email) => (
              <span key={email} className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 rounded-full text-xs border border-orange-200">
                <Mail size={10} />
                {email}
                <button type="button" onClick={() => setExternalEmails(externalEmails.filter(e => e !== email))} className="hover:text-orange-900">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            placeholder="external@email.com"
            type="email"
            value={externalInput}
            onChange={(e) => setExternalInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExternalEmail())}
          />
          <Button type="button" variant="outline" size="sm" onClick={addExternalEmail}>
            <Plus size={14} />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Recurring & Reminder */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Recurring Meeting</Label>
          <Select value={recurrence} onValueChange={(v) => setRecurrence(v as RecurrenceType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Bi-weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Reminder</Label>
          <Select value={reminder} onValueChange={setReminder}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 min before</SelectItem>
              <SelectItem value="10">10 min before</SelectItem>
              <SelectItem value="15">15 min before</SelectItem>
              <SelectItem value="30">30 min before</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button className="w-full bg-teal-600 hover:bg-teal-700">Confirm Booking</Button>
    </div>
  );
}

// ─── My Meetings Section ─────────────────────────────────────────────────────

function MyMeetingsSection() {
  const todayMeetings = DEMO_MEETINGS.filter(m => m.date === '2026-03-10');
  const now = '09:30'; // simulated current time

  return (
    <div className="space-y-6">
      {/* Calendar Sync Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-200">
          <Video size={14} className="text-blue-600" />
          <span className="text-xs font-medium text-blue-700">Outlook / Teams Calendar</span>
          <Badge className="bg-green-100 text-green-700 border-green-300 text-[10px] px-1.5">Synced</Badge>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
          <Calendar size={14} className="text-green-600" />
          <span className="text-xs font-medium text-green-700">Google Calendar</span>
          <Badge variant="outline" className="text-gray-500 border-gray-300 text-[10px] px-1.5">Not Connected</Badge>
        </div>
      </div>

      {/* Today's Meetings Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock size={18} className="text-teal-600" />
            Today&apos;s Meetings
            <Badge variant="outline" className="ml-2 text-xs">{todayMeetings.length} meetings</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayMeetings.map((meeting) => {
              const isUpcoming = meeting.startTime > now;
              const acceptedCount = meeting.attendees.filter(a => a.status === 'accepted').length;
              return (
                <div
                  key={meeting.id}
                  className={cn(
                    'flex items-stretch gap-4 p-4 rounded-lg border border-l-4 transition-all hover:shadow-sm',
                    platformBorderColor(meeting.platform),
                    isUpcoming ? 'bg-white' : 'bg-gray-50/50',
                  )}
                >
                  {/* Time */}
                  <div className="flex flex-col items-center justify-center min-w-[60px]">
                    <span className="text-sm font-semibold text-gray-900">{meeting.startTime}</span>
                    <span className="text-[10px] text-gray-400">to</span>
                    <span className="text-sm text-gray-600">{meeting.endTime}</span>
                  </div>

                  <Separator orientation="vertical" className="h-auto" />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">{meeting.title}</h4>
                      <PlatformIcon platform={meeting.platform} size={16} />
                      {meeting.recurrence !== 'none' && (
                        <RefreshCw size={12} className="text-gray-400" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-1">{meeting.agenda}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <DoorOpen size={12} /> {meeting.roomName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} /> {acceptedCount}/{meeting.attendees.length} attending
                      </span>
                      <span className="flex items-center gap-1">
                        <Bell size={12} /> {meeting.reminder} min
                      </span>
                    </div>

                    {/* Attendee RSVP Summary */}
                    <div className="flex items-center gap-3 mt-2">
                      {(['accepted', 'declined', 'tentative', 'no_response'] as RsvpStatus[]).map((status) => {
                        const count = meeting.attendees.filter(a => a.status === status).length;
                        if (count === 0) return null;
                        return (
                          <span key={status} className="flex items-center gap-1 text-xs">
                            <RsvpIcon status={status} />
                            <span className="text-gray-500">{count}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Join Button */}
                  <div className="flex flex-col items-end justify-center gap-2">
                    {meeting.platform !== 'none' && (
                      <Button
                        size="sm"
                        className={cn(
                          'text-xs',
                          meeting.platform === 'teams' || meeting.platform === 'zoom'
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-green-600 hover:bg-green-700',
                        )}
                        onClick={() => window.open(meeting.meetingLink, '_blank')}
                      >
                        <ExternalLink size={12} className="mr-1" />
                        Join
                      </Button>
                    )}
                    <span className={cn(
                      'text-[10px] font-medium px-2 py-0.5 rounded-full',
                      PLATFORM_CONFIG[meeting.platform].bgColor,
                      PLATFORM_CONFIG[meeting.platform].color,
                    )}>
                      {PLATFORM_CONFIG[meeting.platform].label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming This Week */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ChevronRight size={18} className="text-teal-600" />
            Upcoming This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { title: 'Product Roadmap Review', day: 'Wed, Mar 11', time: '10:00 - 11:30', room: 'Conference D', platform: 'teams' as VideoPlatform, attendees: 8 },
              { title: 'Team Retrospective', day: 'Thu, Mar 12', time: '15:00 - 16:00', room: 'Collab Space B', platform: 'meet' as VideoPlatform, attendees: 6 },
              { title: '1:1 with Manager', day: 'Fri, Mar 13', time: '11:00 - 11:30', room: 'Huddle Room C', platform: 'none' as VideoPlatform, attendees: 2 },
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-md border hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <PlatformIcon platform={m.platform} size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{m.title}</p>
                    <p className="text-xs text-gray-500">{m.day} &middot; {m.time} &middot; {m.room}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 flex items-center gap-1"><Users size={12} />{m.attendees}</span>
                  <span className={cn(
                    'text-[10px] font-medium px-2 py-0.5 rounded-full',
                    PLATFORM_CONFIG[m.platform].bgColor,
                    PLATFORM_CONFIG[m.platform].color,
                  )}>
                    {PLATFORM_CONFIG[m.platform].label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meeting RSVP Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="font-medium text-gray-700">Attendee Status:</span>
        <RsvpBadge status="accepted" />
        <RsvpBadge status="declined" />
        <RsvpBadge status="tentative" />
        <RsvpBadge status="no_response" />
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

function isSlotBooked(roomId: string, time: string) {
  const bookings = BOOKED_SLOTS[roomId] || [];
  return bookings.find((b) => time >= b.start && time < b.end);
}

export default function MeetingRoomsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meeting Rooms</h1>
          <p className="text-sm text-gray-500">Book meeting rooms, manage video calls, and check availability</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-500">Date:</Label>
            <Input type="date" defaultValue="2026-03-10" className="w-40" />
          </div>
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Floor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Floors</SelectItem>
              <SelectItem value="1">Floor 1</SelectItem>
              <SelectItem value="2">Floor 2</SelectItem>
              <SelectItem value="3">Floor 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabbed Layout: My Meetings / Room Availability */}
      <Tabs defaultValue="my-meetings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="my-meetings" className="flex items-center gap-2">
            <Calendar size={14} /> My Meetings
          </TabsTrigger>
          <TabsTrigger value="rooms" className="flex items-center gap-2">
            <DoorOpen size={14} /> Room Availability
          </TabsTrigger>
        </TabsList>

        {/* My Meetings Tab */}
        <TabsContent value="my-meetings" className="mt-6">
          <MyMeetingsSection />
        </TabsContent>

        {/* Room Availability Tab */}
        <TabsContent value="rooms" className="mt-6 space-y-6">
          {/* Room Grid / Timeline View */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar size={18} className="text-teal-600" />
                Room Availability - Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-medium text-gray-700 sticky left-0 bg-white min-w-[160px]">Room</th>
                      {TIME_SLOTS.map((time) => (
                        <th key={time} className="px-1 py-2 font-medium text-gray-500 min-w-[50px]">{time}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MEETING_ROOMS.map((room) => (
                      <tr key={room.id} className="border-b">
                        <td className="py-2 pr-4 sticky left-0 bg-white">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{room.name}</p>
                            <div className="flex items-center gap-2 text-gray-400 mt-0.5">
                              <span className="flex items-center gap-0.5"><Users size={10} />{room.capacity}</span>
                              <span>F{room.floor}</span>
                              {room.hasProjector && <Monitor size={10} />}
                              {room.hasVideoConf && <Video size={10} />}
                              {room.hasWhiteboard && <Pencil size={10} />}
                            </div>
                          </div>
                        </td>
                        {TIME_SLOTS.map((time) => {
                          const booking = isSlotBooked(room.id, time);
                          return (
                            <td key={time} className="px-0.5 py-2">
                              {booking ? (
                                <div className="bg-teal-100 text-teal-700 rounded px-1 py-0.5 text-center truncate" title={`${booking.title} - ${booking.bookedBy}`}>
                                  {booking.start === time ? booking.title.substring(0, 6) : ''}
                                </div>
                              ) : (
                                <div className="bg-green-50 rounded px-1 py-0.5 text-center text-green-400 cursor-pointer hover:bg-green-100">
                                  &bull;
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-50 rounded border border-green-200" /> Available</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-teal-100 rounded border border-teal-200" /> Booked</div>
              </div>
            </CardContent>
          </Card>

          {/* Room Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MEETING_ROOMS.map((room) => (
              <Card key={room.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-teal-50 rounded-lg">
                        <DoorOpen size={20} className="text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{room.name}</p>
                        <p className="text-xs text-gray-500">Floor {room.floor} &middot; {room.capacity} seats</p>
                        <div className="flex gap-2 mt-2">
                          {room.hasProjector && <Badge variant="outline" className="text-xs">Projector</Badge>}
                          {room.hasWhiteboard && <Badge variant="outline" className="text-xs">Whiteboard</Badge>}
                          {room.hasVideoConf && <Badge variant="outline" className="text-xs">Video Conf</Badge>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full mt-4 bg-teal-600 hover:bg-teal-700" size="sm">
                        <Plus size={14} className="mr-1" /> Book Room
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Book {room.name}</DialogTitle>
                      </DialogHeader>
                      <BookRoomDialogContent room={room} />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
