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
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Hotel, Search, Star, MapPin, Wifi, Car, Dumbbell, Utensils, Waves, Coffee, Wind } from 'lucide-react';

const HOTEL_RESULTS = [
  {
    id: '1',
    name: 'Trident Nariman Point',
    city: 'Mumbai',
    address: 'Nariman Point, Mumbai - 400021',
    starRating: 5,
    pricePerNight: 8500,
    amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Parking', 'AC', 'Spa'],
    roomTypes: [
      { type: 'Deluxe Room', price: 8500, available: 3 },
      { type: 'Superior Room', price: 10200, available: 2 },
      { type: 'Suite', price: 18500, available: 1 },
    ],
    userRating: 4.6,
    reviewCount: 2340,
    distance: '0.5 km from city center',
    corporateRate: true,
  },
  {
    id: '2',
    name: 'Novotel Mumbai Juhu Beach',
    city: 'Mumbai',
    address: 'Juhu Tara Road, Juhu, Mumbai',
    starRating: 4,
    pricePerNight: 5200,
    amenities: ['WiFi', 'Pool', 'Restaurant', 'Parking', 'AC'],
    roomTypes: [
      { type: 'Superior Room', price: 5200, available: 8 },
      { type: 'Deluxe Room', price: 6800, available: 5 },
    ],
    userRating: 4.3,
    reviewCount: 1876,
    distance: '2 km from airport',
    corporateRate: true,
  },
  {
    id: '3',
    name: 'Ibis Mumbai Airport',
    city: 'Mumbai',
    address: 'Andheri Kurla Road, Andheri East',
    starRating: 3,
    pricePerNight: 2800,
    amenities: ['WiFi', 'Restaurant', 'AC'],
    roomTypes: [
      { type: 'Standard Room', price: 2800, available: 15 },
    ],
    userRating: 4.0,
    reviewCount: 3210,
    distance: '0.2 km from airport',
    corporateRate: false,
  },
  {
    id: '4',
    name: 'The Oberoi Mumbai',
    city: 'Mumbai',
    address: 'Nariman Point, Mumbai',
    starRating: 5,
    pricePerNight: 14500,
    amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Parking', 'AC', 'Spa', 'Concierge'],
    roomTypes: [
      { type: 'Luxury Room', price: 14500, available: 2 },
      { type: 'Premier Suite', price: 26000, available: 1 },
    ],
    userRating: 4.8,
    reviewCount: 1560,
    distance: '0.8 km from city center',
    corporateRate: false,
  },
];

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi size={12} />,
  Pool: <Waves size={12} />,
  Gym: <Dumbbell size={12} />,
  Restaurant: <Utensils size={12} />,
  Parking: <Car size={12} />,
  AC: <Wind size={12} />,
  Spa: <Coffee size={12} />,
};

const ALL_AMENITIES = ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Parking', 'AC', 'Spa'];

export function HotelBooking() {
  const [searched, setSearched] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [minStars, setMinStars] = useState('0');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [corporateOnly, setCorporateOnly] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<Record<string, string>>({});

  const toggleAmenity = (a: string) =>
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );

  const filtered = HOTEL_RESULTS.filter((h) => {
    const priceOk = h.pricePerNight >= priceRange[0] && h.pricePerNight <= priceRange[1];
    const starOk = h.starRating >= parseInt(minStars);
    const amenityOk =
      selectedAmenities.length === 0 ||
      selectedAmenities.every((a) => h.amenities.includes(a));
    const corporateOk = !corporateOnly || h.corporateRate;
    return priceOk && starOk && amenityOk && corporateOk;
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Hotel size={18} className="text-teal-600" />
            Hotel Search (MakeMyTrip / Corporate Tie-ups)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search inputs */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div>
              <Label className="text-xs">City</Label>
              <Input placeholder="Mumbai" defaultValue="Mumbai" />
            </div>
            <div>
              <Label className="text-xs">Check-in</Label>
              <Input type="date" defaultValue="2026-03-15" />
            </div>
            <div>
              <Label className="text-xs">Check-out</Label>
              <Input type="date" defaultValue="2026-03-18" />
            </div>
            <div>
              <Label className="text-xs">Guests</Label>
              <Select defaultValue="1">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n} Guest{n > 1 ? 's' : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Rooms</Label>
              <Select defaultValue="1">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n} Room{n > 1 ? 's' : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filters row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t">
            {/* Price range */}
            <div>
              <Label className="text-xs mb-2 block">
                Price Range: ₹{priceRange[0].toLocaleString()} – ₹{priceRange[1].toLocaleString()}
              </Label>
              <Slider
                min={0}
                max={20000}
                step={500}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mt-2"
              />
            </div>

            {/* Star rating */}
            <div>
              <Label className="text-xs mb-2 block">Minimum Star Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setMinStars(String(s))}
                    className={`p-1 rounded transition-colors ${
                      parseInt(minStars) >= s ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    <Star size={18} className={parseInt(minStars) >= s ? 'fill-yellow-400' : ''} />
                  </button>
                ))}
                {minStars !== '0' && (
                  <button className="text-xs text-gray-400 ml-1" onClick={() => setMinStars('0')}>
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <Label className="text-xs mb-2 block">Required Amenities</Label>
              <div className="flex flex-wrap gap-1">
                {ALL_AMENITIES.map((a) => (
                  <button
                    key={a}
                    onClick={() => toggleAmenity(a)}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-colors ${
                      selectedAmenities.includes(a)
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-teal-400'
                    }`}
                  >
                    {AMENITY_ICONS[a]}
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={corporateOnly}
                onCheckedChange={(v) => setCorporateOnly(Boolean(v))}
              />
              <span className="text-sm text-gray-700">Corporate rate hotels only</span>
            </label>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setSearched(true)}>
              <Search size={16} className="mr-2" /> Search Hotels
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {searched && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">{filtered.length} hotels found</p>
          </div>

          {filtered.map((hotel) => (
            <Card key={hotel.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  {/* Hotel image placeholder */}
                  <div className="w-24 h-20 bg-gradient-to-br from-teal-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Hotel size={32} className="text-teal-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900">{hotel.name}</p>
                      {hotel.corporateRate && (
                        <Badge className="bg-teal-100 text-teal-700 text-xs">Corporate Rate</Badge>
                      )}
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-1 my-1">
                      {Array.from({ length: hotel.starRating }).map((_, i) => (
                        <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <MapPin size={12} />
                      {hotel.address}
                      <Separator orientation="vertical" className="h-3 mx-1" />
                      {hotel.distance}
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {hotel.amenities.slice(0, 6).map((a) => (
                        <span key={a} className="flex items-center gap-1 text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          {AMENITY_ICONS[a]}
                          {a}
                        </span>
                      ))}
                      {hotel.amenities.length > 6 && (
                        <span className="text-xs text-gray-400 self-center">+{hotel.amenities.length - 6} more</span>
                      )}
                    </div>

                    {/* User rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={11}
                            className={i < Math.floor(hotel.userRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-gray-700">{hotel.userRating}/5</span>
                      <span className="text-xs text-gray-400">({hotel.reviewCount} reviews)</span>
                    </div>
                  </div>

                  {/* Pricing & booking */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-gray-900">
                      ₹{hotel.pricePerNight.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">per night</p>

                    <div className="mt-2 space-y-1 min-w-36">
                      <Select
                        value={selectedRoomType[hotel.id] || ''}
                        onValueChange={(v) =>
                          setSelectedRoomType((prev) => ({ ...prev, [hotel.id]: v }))
                        }
                      >
                        <SelectTrigger className="text-xs h-8">
                          <SelectValue placeholder="Select room" />
                        </SelectTrigger>
                        <SelectContent>
                          {hotel.roomTypes.map((r) => (
                            <SelectItem key={r.type} value={r.type}>
                              {r.type} – ₹{r.price.toLocaleString()} ({r.available} left)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Hotel size={40} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No hotels match your filters. Try adjusting the criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
