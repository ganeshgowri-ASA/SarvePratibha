'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, MapPin, Clock, Plus } from 'lucide-react';

const BOOKING_HISTORY = [
  { id: '1', pickup: 'Office - Tower A', drop: 'Airport T2', time: '9 Mar 2026, 6:00 PM', cabType: 'SEDAN', status: 'CONFIRMED', driver: 'Ravi Kumar', phone: '+91 98765 43210', vehicle: 'KA-01-AB-1234' },
  { id: '2', pickup: 'Home', drop: 'Office - Tower A', time: '8 Mar 2026, 8:30 AM', cabType: 'SEDAN', status: 'COMPLETED', driver: 'Suresh M.', phone: '+91 98765 43211', vehicle: 'KA-01-CD-5678' },
  { id: '3', pickup: 'Office - Tower A', drop: 'Client Office - Whitefield', time: '5 Mar 2026, 2:00 PM', cabType: 'SUV', status: 'COMPLETED', driver: 'Manoj P.', phone: '+91 98765 43212', vehicle: 'KA-01-EF-9012' },
  { id: '4', pickup: 'Office - Tower A', drop: 'Railway Station', time: '1 Mar 2026, 5:00 PM', cabType: 'HATCHBACK', status: 'CANCELLED' },
];

const STATUS_STYLES: Record<string, string> = {
  REQUESTED: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-teal-100 text-teal-700',
  CANCELLED: 'bg-gray-100 text-gray-700',
};

const CAB_TYPE_LABELS: Record<string, string> = {
  SEDAN: 'Sedan',
  SUV: 'SUV',
  HATCHBACK: 'Hatchback',
  SHARED: 'Shared',
};

export default function CabBookingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cab Booking</h1>
        <p className="text-sm text-gray-500">Book a cab for office commute or official travel</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Car size={18} className="text-teal-600" />
                Book a Cab
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Pickup Location</Label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" />
                  <Input placeholder="Enter pickup location" className="pl-9" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Drop Location</Label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
                  <Input placeholder="Enter drop location" className="pl-9" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cab Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SEDAN">Sedan</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="HATCHBACK">Hatchback</SelectItem>
                      <SelectItem value="SHARED">Shared</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Passengers</Label>
                  <Input type="number" placeholder="1" min={1} max={6} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Purpose (optional)</Label>
                <Textarea placeholder="e.g. Client visit, airport pickup" rows={2} />
              </div>

              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                <Plus size={16} className="mr-2" /> Request Cab
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Booking History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock size={18} className="text-teal-600" />
                Booking History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {BOOKING_HISTORY.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col items-center gap-0.5">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <div className="w-px h-4 bg-gray-300" />
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{booking.pickup}</p>
                            <p className="text-sm text-gray-600">{booking.drop}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 ml-4">
                          <span className="flex items-center gap-1"><Clock size={12} />{booking.time}</span>
                          <Badge variant="outline">{CAB_TYPE_LABELS[booking.cabType]}</Badge>
                        </div>
                        {booking.driver && (
                          <div className="flex items-center gap-3 text-xs text-gray-500 ml-4">
                            <span>Driver: {booking.driver}</span>
                            <span>{booking.phone}</span>
                            <span>{booking.vehicle}</span>
                          </div>
                        )}
                      </div>
                      <Badge className={STATUS_STYLES[booking.status] || ''}>
                        {booking.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
