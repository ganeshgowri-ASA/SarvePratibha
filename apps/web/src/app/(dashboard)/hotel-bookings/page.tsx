'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hotel, MapPin, Calendar, Star, ExternalLink } from 'lucide-react';

const PROVIDERS = [
  { name: 'MakeMyTrip', short: 'MMT', color: 'bg-red-600', url: 'https://www.makemytrip.com/hotels' },
  { name: 'Paytm Travel', short: 'Paytm', color: 'bg-indigo-600', url: 'https://travel.paytm.com/hotels' },
  { name: 'Booking.com', short: 'Booking', color: 'bg-blue-700', url: 'https://www.booking.com' },
  { name: 'OYO Rooms', short: 'OYO', color: 'bg-rose-600', url: 'https://www.oyorooms.com' },
];

const RECENT_BOOKINGS = [
  { id: '1', hotel: 'Taj Lands End', city: 'Mumbai', checkIn: '12 Mar 2026', checkOut: '14 Mar 2026', provider: 'MMT', status: 'CONFIRMED', amount: '₹12,500' },
  { id: '2', hotel: 'ITC Gardenia', city: 'Bengaluru', checkIn: '5 Mar 2026', checkOut: '6 Mar 2026', provider: 'OYO', status: 'COMPLETED', amount: '₹4,200' },
  { id: '3', hotel: 'Courtyard Marriott', city: 'Delhi', checkIn: '20 Feb 2026', checkOut: '22 Feb 2026', provider: 'Booking', status: 'COMPLETED', amount: '₹9,800' },
];

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-teal-100 text-teal-700',
  CANCELLED: 'bg-gray-100 text-gray-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
};

export default function HotelBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hotel Bookings</h1>
        <p className="text-gray-500 mt-1">Book hotels for business travel via approved providers</p>
      </div>

      {/* Provider quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PROVIDERS.map((p) => (
          <Card key={p.short} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-4 pb-4 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-lg ${p.color} flex items-center justify-center`}>
                <span className="text-white font-bold text-xs">{p.short}</span>
              </div>
              <span className="text-sm font-medium text-gray-700">{p.name}</span>
              <Badge variant="outline" className="text-xs gap-1">
                <ExternalLink size={10} />
                Book Now
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Hotel size={18} className="text-teal-600" />
            Search Hotels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label>City / Destination</Label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input className="pl-8" placeholder="Enter city or hotel name" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Check-in</Label>
              <div className="relative">
                <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input className="pl-8" type="date" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Check-out</Label>
              <div className="relative">
                <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input className="pl-8" type="date" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>&nbsp;</Label>
              <Button className="w-full bg-teal-600 hover:bg-teal-700">Search Hotels</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Star size={18} className="text-teal-600" />
            Recent Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {RECENT_BOOKINGS.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Hotel size={18} className="text-teal-700" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{b.hotel}</p>
                    <p className="text-xs text-gray-500">{b.city} · {b.checkIn} → {b.checkOut}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 font-medium">{b.provider}</span>
                  <span className="text-sm font-semibold text-gray-800">{b.amount}</span>
                  <Badge className={STATUS_STYLES[b.status] || ''}>{b.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
