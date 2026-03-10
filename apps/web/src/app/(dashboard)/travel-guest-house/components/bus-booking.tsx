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
import { Separator } from '@/components/ui/separator';
import { Bus, Search, Star, Clock, ArrowRight, Wind, Wifi, Zap, Coffee } from 'lucide-react';

const BUS_RESULTS = [
  {
    id: '1',
    operatorName: 'VRL Travels',
    busType: 'AC_SLEEPER',
    busTypeName: 'AC Sleeper (2+1)',
    departure: '21:00',
    arrival: '06:30+1',
    duration: '9h 30m',
    fromCity: 'Bengaluru',
    toCity: 'Mumbai',
    fare: 1450,
    seatsAvailable: 14,
    totalSeats: 36,
    rating: 4.3,
    reviewCount: 1240,
    amenities: ['WiFi', 'Blanket', 'Water', 'Charging', 'AC'],
    boardingPoints: ['Majestic', 'Silk Board', 'Marathahalli'],
  },
  {
    id: '2',
    operatorName: 'SRS Travels',
    busType: 'VOLVO',
    busTypeName: 'Volvo AC Semi-Sleeper',
    departure: '22:30',
    arrival: '08:00+1',
    duration: '9h 30m',
    fromCity: 'Bengaluru',
    toCity: 'Mumbai',
    fare: 1250,
    seatsAvailable: 22,
    totalSeats: 41,
    rating: 4.1,
    reviewCount: 876,
    amenities: ['WiFi', 'Charging', 'AC', 'Blanket'],
    boardingPoints: ['Kempegowda Bus Stand', 'Electronic City'],
  },
  {
    id: '3',
    operatorName: 'Orange Tours',
    busType: 'NON_AC_SLEEPER',
    busTypeName: 'Non-AC Sleeper (2+2)',
    departure: '20:00',
    arrival: '05:30+1',
    duration: '9h 30m',
    fromCity: 'Bengaluru',
    toCity: 'Mumbai',
    fare: 850,
    seatsAvailable: 30,
    totalSeats: 54,
    rating: 3.7,
    reviewCount: 432,
    amenities: ['Charging'],
    boardingPoints: ['Majestic', 'KR Puram'],
  },
  {
    id: '4',
    operatorName: 'Kallada G4',
    busType: 'AC_SLEEPER',
    busTypeName: 'Luxury AC Sleeper (1+1)',
    departure: '19:30',
    arrival: '06:00+1',
    duration: '10h 30m',
    fromCity: 'Bengaluru',
    toCity: 'Mumbai',
    fare: 2100,
    seatsAvailable: 6,
    totalSeats: 20,
    rating: 4.7,
    reviewCount: 3180,
    amenities: ['WiFi', 'Blanket', 'Water', 'Charging', 'AC', 'Meals'],
    boardingPoints: ['Shivajinagar', 'Koramangala', 'HSR Layout'],
  },
];

const BUS_TYPE_COLORS: Record<string, string> = {
  AC_SLEEPER: 'bg-blue-100 text-blue-800',
  NON_AC_SLEEPER: 'bg-gray-100 text-gray-700',
  VOLVO: 'bg-purple-100 text-purple-800',
  AC_SEATER: 'bg-teal-100 text-teal-800',
  NON_AC_SEATER: 'bg-gray-100 text-gray-700',
};

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi size={12} />,
  AC: <Wind size={12} />,
  Charging: <Zap size={12} />,
  Meals: <Coffee size={12} />,
};

// Seat map component
function SeatMap({ available, total }: { available: number; total: number }) {
  const rows = Math.ceil(total / 4);
  const seats = Array.from({ length: total }, (_, i) => ({
    id: i + 1,
    isBooked: i >= available,
    isSelected: false,
  }));

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
      <p className="text-xs font-medium text-gray-600 mb-2">Seat Selection</p>
      <div className="flex gap-3 mb-2">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <div className="w-4 h-4 bg-green-200 border border-green-400 rounded-sm" />
          Available
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <div className="w-4 h-4 bg-gray-300 border border-gray-400 rounded-sm" />
          Booked
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <div className="w-4 h-4 bg-teal-400 border border-teal-600 rounded-sm" />
          Selected
        </div>
      </div>
      <div className="grid grid-cols-10 gap-1 max-w-xs">
        {seats.slice(0, 20).map((seat) => (
          <div
            key={seat.id}
            className={`w-5 h-5 rounded-sm border text-center text-xs flex items-center justify-center cursor-pointer transition-colors ${
              seat.isBooked
                ? 'bg-gray-300 border-gray-400 cursor-not-allowed'
                : 'bg-green-200 border-green-400 hover:bg-teal-400 hover:border-teal-600'
            }`}
          >
            {seat.id}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-1">Showing first 20 seats</p>
    </div>
  );
}

export function BusBooking() {
  const [selectedType, setSelectedType] = useState('all');
  const [searched, setSearched] = useState(false);
  const [expandedBus, setExpandedBus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'fare' | 'rating' | 'duration'>('fare');

  const filtered = BUS_RESULTS
    .filter((b) => selectedType === 'all' || b.busType === selectedType)
    .sort((a, b) => {
      if (sortBy === 'fare') return a.fare - b.fare;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bus size={18} className="text-teal-600" />
            Bus Search (RedBus Integration)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <Label className="text-xs">From City</Label>
              <Input placeholder="Bengaluru" defaultValue="Bengaluru" />
            </div>
            <div>
              <Label className="text-xs">To City</Label>
              <Input placeholder="Mumbai" defaultValue="Mumbai" />
            </div>
            <div>
              <Label className="text-xs">Date of Journey</Label>
              <Input type="date" defaultValue="2026-03-15" />
            </div>
            <div>
              <Label className="text-xs">Bus Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="AC_SLEEPER">AC Sleeper</SelectItem>
                  <SelectItem value="NON_AC_SLEEPER">Non-AC Sleeper</SelectItem>
                  <SelectItem value="VOLVO">Volvo AC</SelectItem>
                  <SelectItem value="AC_SEATER">AC Seater</SelectItem>
                  <SelectItem value="NON_AC_SEATER">Non-AC Seater</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setSearched(true)}>
              <Search size={16} className="mr-2" /> Search Buses
            </Button>
          </div>
        </CardContent>
      </Card>

      {searched && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">
                {filtered.length} buses found
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Sort by:</span>
                {(['fare', 'rating', 'duration'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSortBy(s)}
                    className={`text-xs px-2 py-1 rounded border transition-colors capitalize ${
                      sortBy === s
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-teal-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filtered.map((bus) => (
                <div key={bus.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900">{bus.operatorName}</p>
                        <Badge className={`text-xs ${BUS_TYPE_COLORS[bus.busType] || 'bg-gray-100'}`}>
                          {bus.busTypeName}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                        <span className="font-medium">{bus.departure}</span>
                        <span className="text-xs text-gray-400">{bus.fromCity}</span>
                        <ArrowRight size={14} className="text-gray-400" />
                        <span className="font-medium">{bus.arrival}</span>
                        <span className="text-xs text-gray-400">{bus.toCity}</span>
                        <Separator orientation="vertical" className="h-4" />
                        <span className="flex items-center gap-1 text-xs">
                          <Clock size={12} />{bus.duration}
                        </span>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {bus.amenities.map((a) => (
                          <span key={a} className="flex items-center gap-1 text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            {AMENITY_ICONS[a] || null}
                            {a}
                          </span>
                        ))}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={i < Math.floor(bus.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium text-gray-700">{bus.rating}</span>
                        <span className="text-xs text-gray-400">({bus.reviewCount} reviews)</span>
                        <Separator orientation="vertical" className="h-3" />
                        <span className="text-xs text-gray-500">
                          {bus.seatsAvailable}/{bus.totalSeats} seats left
                        </span>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <p className="text-xl font-bold text-gray-900">₹{bus.fare.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">per person</p>
                      <div className="flex flex-col gap-1 mt-2">
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Book Now</Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setExpandedBus(expandedBus === bus.id ? null : bus.id)}
                        >
                          {expandedBus === bus.id ? 'Hide Seats' : 'View Seats'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Boarding points */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-500">Boarding:</span>
                    {bus.boardingPoints.map((bp) => (
                      <Badge key={bp} variant="outline" className="text-xs">{bp}</Badge>
                    ))}
                  </div>

                  {/* Seat map */}
                  {expandedBus === bus.id && (
                    <SeatMap available={bus.seatsAvailable} total={bus.totalSeats} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
