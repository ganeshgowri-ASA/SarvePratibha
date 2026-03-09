'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { DoorOpen, Users, Monitor, Pencil, Video, Plus, Calendar } from 'lucide-react';

const MEETING_ROOMS = [
  { id: '1', name: 'Boardroom A', floor: 1, capacity: 20, hasProjector: true, hasWhiteboard: true, hasVideoConf: true },
  { id: '2', name: 'Collab Space B', floor: 1, capacity: 8, hasProjector: true, hasWhiteboard: true, hasVideoConf: false },
  { id: '3', name: 'Huddle Room C', floor: 2, capacity: 4, hasProjector: false, hasWhiteboard: true, hasVideoConf: true },
  { id: '4', name: 'Conference D', floor: 2, capacity: 12, hasProjector: true, hasWhiteboard: false, hasVideoConf: true },
  { id: '5', name: 'Training Hall', floor: 3, capacity: 40, hasProjector: true, hasWhiteboard: true, hasVideoConf: true },
  { id: '6', name: 'Huddle Room E', floor: 3, capacity: 4, hasProjector: false, hasWhiteboard: false, hasVideoConf: true },
];

const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

const BOOKED_SLOTS: Record<string, { start: string; end: string; title: string; bookedBy: string }[]> = {
  '1': [
    { start: '10:00', end: '11:00', title: 'Sprint Planning', bookedBy: 'Rahul S.' },
    { start: '14:00', end: '15:30', title: 'Client Call', bookedBy: 'Manager' },
  ],
  '2': [
    { start: '09:30', end: '10:30', title: 'Design Review', bookedBy: 'Priya P.' },
  ],
  '4': [
    { start: '11:00', end: '12:00', title: 'All Hands', bookedBy: 'Section Head' },
    { start: '15:00', end: '16:00', title: 'Interview', bookedBy: 'HR Team' },
  ],
};

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
          <p className="text-sm text-gray-500">Book meeting rooms and check availability</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-500">Date:</Label>
            <Input type="date" defaultValue="2026-03-09" className="w-40" />
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
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Book {room.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>Meeting Title</Label>
                      <Input placeholder="e.g. Sprint Planning" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label>Attendees</Label>
                        <Input type="number" placeholder="1" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Input type="time" />
                      </div>
                      <div className="space-y-2">
                        <Label>End Time</Label>
                        <Input type="time" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Notes (optional)</Label>
                      <Textarea placeholder="Any special requirements" rows={2} />
                    </div>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700">Confirm Booking</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
