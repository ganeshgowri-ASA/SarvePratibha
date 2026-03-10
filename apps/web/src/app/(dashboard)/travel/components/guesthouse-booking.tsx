'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Home,
  MapPin,
  Wifi,
  Car,
  Utensils,
  Wind,
  BedDouble,
  CheckCircle,
  XCircle,
  CalendarDays,
  Users,
  Star,
  Coffee,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Guesthouse {
  id: string;
  name: string;
  city: string;
  address: string;
  totalRooms: number;
  amenities: string[];
  rating: number;
  contactPhone: string;
  checkInTime: string;
  checkOutTime: string;
  roomTypes: { type: string; total: number; rate: string }[];
}

const GUESTHOUSES: Guesthouse[] = [
  {
    id: 'gh-blr',
    name: 'Bengaluru Corporate Guest House',
    city: 'Bengaluru',
    address: 'Koramangala 5th Block, Bengaluru - 560095',
    totalRooms: 12,
    amenities: ['WiFi', 'AC', 'Parking', 'Cafeteria', 'Laundry', 'Gym'],
    rating: 4.5,
    contactPhone: '+91 80 2345 6789',
    checkInTime: '12:00 PM',
    checkOutTime: '11:00 AM',
    roomTypes: [
      { type: 'Single Occupancy', total: 6, rate: 'Subsidised – ₹500/night' },
      { type: 'Double Occupancy', total: 4, rate: 'Subsidised – ₹750/night' },
      { type: 'Executive Suite', total: 2, rate: 'Subsidised – ₹1,200/night' },
    ],
  },
  {
    id: 'gh-mum',
    name: 'Mumbai Corporate Guest House',
    city: 'Mumbai',
    address: 'Andheri East, Near WEH Metro, Mumbai - 400069',
    totalRooms: 8,
    amenities: ['WiFi', 'AC', 'Breakfast', 'Laundry'],
    rating: 4.2,
    contactPhone: '+91 22 6789 0123',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    roomTypes: [
      { type: 'Single Occupancy', total: 5, rate: 'Subsidised – ₹600/night' },
      { type: 'Double Occupancy', total: 3, rate: 'Subsidised – ₹900/night' },
    ],
  },
  {
    id: 'gh-del',
    name: 'Delhi Corporate Guest House',
    city: 'Delhi',
    address: 'Connaught Place, New Delhi - 110001',
    totalRooms: 10,
    amenities: ['WiFi', 'AC', 'Parking', 'Cafeteria', 'Gym'],
    rating: 4.6,
    contactPhone: '+91 11 2345 6789',
    checkInTime: '12:00 PM',
    checkOutTime: '11:00 AM',
    roomTypes: [
      { type: 'Single Occupancy', total: 6, rate: 'Subsidised – ₹550/night' },
      { type: 'Double Occupancy', total: 3, rate: 'Subsidised – ₹800/night' },
      { type: 'Executive Suite', total: 1, rate: 'Subsidised – ₹1,500/night' },
    ],
  },
  {
    id: 'gh-hyd',
    name: 'Hyderabad Corporate Guest House',
    city: 'Hyderabad',
    address: 'HITEC City, Hyderabad - 500081',
    totalRooms: 8,
    amenities: ['WiFi', 'AC', 'Breakfast', 'Parking'],
    rating: 4.3,
    contactPhone: '+91 40 6789 0123',
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    roomTypes: [
      { type: 'Single Occupancy', total: 5, rate: 'Subsidised – ₹450/night' },
      { type: 'Double Occupancy', total: 3, rate: 'Subsidised – ₹700/night' },
    ],
  },
  {
    id: 'gh-pun',
    name: 'Pune Corporate Guest House',
    city: 'Pune',
    address: 'Hinjewadi Phase 1, Pune - 411057',
    totalRooms: 6,
    amenities: ['WiFi', 'AC', 'Cafeteria'],
    rating: 4.0,
    contactPhone: '+91 20 3456 7890',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    roomTypes: [
      { type: 'Single Occupancy', total: 4, rate: 'Subsidised – ₹400/night' },
      { type: 'Double Occupancy', total: 2, rate: 'Subsidised – ₹650/night' },
    ],
  },
];

// Simulate room availability for a calendar month
function generateAvailability(totalRooms: number) {
  const today = new Date(2026, 2, 10); // March 10, 2026
  const availability: Record<string, number> = {};
  for (let d = 1; d <= 31; d++) {
    const date = `2026-03-${String(d).padStart(2, '0')}`;
    const isPast = d < 10;
    if (isPast) {
      availability[date] = 0;
    } else {
      // Random availability (some days fully booked)
      const booked = Math.floor(Math.random() * totalRooms);
      availability[date] = totalRooms - booked;
    }
  }
  // Pre-book some specific dates
  availability['2026-03-15'] = 0;
  availability['2026-03-16'] = 0;
  availability['2026-03-20'] = 1;
  return availability;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MARCH_FIRST_DAY = new Date(2026, 2, 1).getDay(); // 0 = Sunday

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi size={12} />,
  AC: <Wind size={12} />,
  Parking: <Car size={12} />,
  Cafeteria: <Utensils size={12} />,
  Breakfast: <Coffee size={12} />,
  Gym: <Star size={12} />,
  Laundry: <Home size={12} />,
};

interface BookingConfirmation {
  guesthouse: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  purpose: string;
  guests: string;
  confirmationId: string;
}

export function GuesthouseBooking() {
  const [selectedGH, setSelectedGH] = useState<Guesthouse>(GUESTHOUSES[0]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [roomType, setRoomType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [guests, setGuests] = useState('1');
  const [confirmed, setConfirmed] = useState<BookingConfirmation | null>(null);
  const [availability] = useState(() => generateAvailability(selectedGH.totalRooms));

  const handleBook = () => {
    const conf: BookingConfirmation = {
      guesthouse: selectedGH.name,
      roomType,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      purpose,
      guests,
      confirmationId: `GH-${Date.now().toString().slice(-6)}`,
    };
    setConfirmed(conf);
    setBookingOpen(false);
  };

  const getDayAvailColor = (available: number, total: number) => {
    if (available === 0) return 'bg-red-100 text-red-600 border-red-200';
    if (available <= 2) return 'bg-orange-100 text-orange-600 border-orange-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Home size={18} className="text-teal-600" />
            Company Guest House Booking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {GUESTHOUSES.map((gh) => (
              <button
                key={gh.id}
                onClick={() => setSelectedGH(gh)}
                className={cn(
                  'text-left p-3 rounded-lg border text-sm transition-all',
                  selectedGH.id === gh.id
                    ? 'bg-teal-50 border-teal-400 ring-1 ring-teal-400'
                    : 'bg-white border-gray-200 hover:border-teal-200'
                )}
              >
                <p className="font-semibold text-gray-900 text-xs">{gh.city}</p>
                <p className="text-xs text-gray-500 mt-0.5">{gh.totalRooms} rooms</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{gh.rating}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected guesthouse details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Details & Calendar */}
        <div className="lg:col-span-2 space-y-4">
          {/* Property info */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{selectedGH.name}</CardTitle>
                <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                      Book Room
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Book Guest House — {selectedGH.city}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs">Room Type</Label>
                        <Select value={roomType} onValueChange={setRoomType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select room type" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedGH.roomTypes.map((r) => (
                              <SelectItem key={r.type} value={r.type}>
                                {r.type} — {r.rate}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Check-in Date</Label>
                          <Input
                            type="date"
                            value={checkInDate}
                            onChange={(e) => setCheckInDate(e.target.value)}
                            min="2026-03-10"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Check-out Date</Label>
                          <Input
                            type="date"
                            value={checkOutDate}
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            min={checkInDate || '2026-03-11'}
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Number of Guests</Label>
                        <Select value={guests} onValueChange={setGuests}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {['1', '2', '3', '4'].map((n) => (
                              <SelectItem key={n} value={n}>{n} Guest{Number(n) > 1 ? 's' : ''}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Purpose / Travel Request ID</Label>
                        <Textarea
                          placeholder="e.g., Client meeting — linked to TR-2026-042"
                          value={purpose}
                          onChange={(e) => setPurpose(e.target.value)}
                          rows={2}
                        />
                      </div>
                      <div className="bg-teal-50 rounded-lg p-3 text-xs text-teal-800 space-y-1">
                        <p>Check-in: {selectedGH.checkInTime}</p>
                        <p>Check-out: {selectedGH.checkOutTime}</p>
                        <p>Contact: {selectedGH.contactPhone}</p>
                      </div>
                      <Button
                        className="w-full bg-teal-600 hover:bg-teal-700"
                        onClick={handleBook}
                        disabled={!roomType || !checkInDate || !checkOutDate}
                      >
                        Confirm Booking
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin size={14} className="mt-0.5 text-teal-500 shrink-0" />
                {selectedGH.address}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedGH.amenities.map((a) => (
                  <span
                    key={a}
                    className="flex items-center gap-1 text-xs px-2 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-full"
                  >
                    {AMENITY_ICONS[a]}
                    {a}
                  </span>
                ))}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">Room Types</p>
                <div className="space-y-1.5">
                  {selectedGH.roomTypes.map((r) => (
                    <div key={r.type} className="flex items-center justify-between text-xs bg-gray-50 rounded p-2">
                      <div className="flex items-center gap-2">
                        <BedDouble size={12} className="text-gray-400" />
                        <span className="text-gray-700 font-medium">{r.type}</span>
                        <Badge variant="outline" className="text-xs">{r.total} rooms</Badge>
                      </div>
                      <span className="text-teal-700 font-medium">{r.rate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability Calendar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CalendarDays size={16} className="text-teal-600" />
                Room Availability — March 2026
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Legend */}
              <div className="flex flex-wrap gap-3 mb-3">
                {[
                  { color: 'bg-green-100 border-green-200', label: 'Available' },
                  { color: 'bg-orange-100 border-orange-200', label: '1-2 rooms left' },
                  { color: 'bg-red-100 border-red-200', label: 'Fully Booked' },
                  { color: 'bg-gray-100 border-gray-200', label: 'Past / N/A' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <div className={`w-4 h-4 rounded border ${item.color}`} />
                    <span className="text-xs text-gray-500">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {DAYS_OF_WEEK.map((d) => (
                  <div key={d} className="text-xs font-medium text-gray-500 py-1">{d}</div>
                ))}
                {/* Empty cells before March 1 */}
                {Array.from({ length: MARCH_FIRST_DAY }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1;
                  const dateKey = `2026-03-${String(day).padStart(2, '0')}`;
                  const avail = availability[dateKey] ?? 0;
                  const isPast = day < 10;
                  let cellClass = '';
                  let label = '';
                  if (isPast) {
                    cellClass = 'bg-gray-50 text-gray-300 border-gray-100';
                    label = '';
                  } else if (avail === 0) {
                    cellClass = 'bg-red-50 text-red-500 border-red-200';
                    label = 'Full';
                  } else if (avail <= 2) {
                    cellClass = 'bg-orange-50 text-orange-600 border-orange-200';
                    label = `${avail}`;
                  } else {
                    cellClass = 'bg-green-50 text-green-700 border-green-200';
                    label = `${avail}`;
                  }
                  return (
                    <div
                      key={day}
                      className={cn(
                        'rounded border p-1 text-center transition-all',
                        !isPast && 'cursor-pointer hover:scale-105',
                        cellClass
                      )}
                    >
                      <p className="text-xs font-medium">{day}</p>
                      {!isPast && <p className="text-[10px]">{label}</p>}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-2 text-right">
                Numbers show available rooms for that date
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right column: My Bookings */}
        <div className="space-y-4">
          {/* Confirmed bookings */}
          {confirmed && (
            <Card className="border-green-300 bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-800 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Booking Confirmed!
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-1.5 text-green-900">
                <p><span className="font-semibold">Ref:</span> {confirmed.confirmationId}</p>
                <p><span className="font-semibold">Property:</span> {confirmed.guesthouse}</p>
                <p><span className="font-semibold">Room:</span> {confirmed.roomType}</p>
                <p><span className="font-semibold">Check-in:</span> {confirmed.checkIn}</p>
                <p><span className="font-semibold">Check-out:</span> {confirmed.checkOut}</p>
                <p><span className="font-semibold">Guests:</span> {confirmed.guests}</p>
                <p className="text-green-700 mt-2">A confirmation will be sent to your registered email.</p>
              </CardContent>
            </Card>
          )}

          {/* Existing bookings */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">My Guest House Bookings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  id: 'GH-892341',
                  city: 'Mumbai',
                  room: 'Single Occupancy',
                  checkIn: '15 Mar 2026',
                  checkOut: '18 Mar 2026',
                  status: 'CONFIRMED',
                },
                {
                  id: 'GH-756023',
                  city: 'Delhi',
                  room: 'Double Occupancy',
                  checkIn: '5 Mar 2026',
                  checkOut: '7 Mar 2026',
                  status: 'COMPLETED',
                },
              ].map((b) => (
                <div key={b.id} className="border rounded-lg p-3 bg-white">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-gray-900">{b.city} — {b.room}</p>
                    <Badge
                      className={
                        b.status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-700 text-xs'
                          : 'bg-teal-100 text-teal-700 text-xs'
                      }
                    >
                      {b.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{b.checkIn} → {b.checkOut}</p>
                  <p className="text-xs text-gray-400 font-mono mt-1">{b.id}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Policy reminder */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-4 text-xs text-blue-900 space-y-1.5">
              <p className="font-semibold text-blue-800">Guest House Policy</p>
              <p>Max stay: 30 nights/year</p>
              <p>Advance booking: Min 2 days</p>
              <p>Cancellation: Free up to 24 hrs before check-in</p>
              <p>Visitors not permitted after 10 PM</p>
              <Button size="sm" variant="outline" className="w-full mt-2 border-blue-300 text-blue-700 hover:bg-blue-100">
                View Full Policy
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
