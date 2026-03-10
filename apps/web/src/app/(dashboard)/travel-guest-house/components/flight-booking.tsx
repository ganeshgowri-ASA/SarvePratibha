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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plane, Search, ArrowRight, ArrowLeftRight, Plus, X, Clock, Luggage, RefreshCw } from 'lucide-react';

const AIRLINES = ['IndiGo', 'Air India', 'SpiceJet', 'Vistara', 'GoFirst', 'AirAsia India'];

const FLIGHT_RESULTS = [
  {
    id: '1',
    flightNumber: '6E-2341',
    airline: 'IndiGo',
    airlineCode: '6E',
    departure: '06:00',
    arrival: '08:20',
    duration: '2h 20m',
    stops: 0,
    fromAirport: 'BLR',
    toAirport: 'BOM',
    classes: [
      { class: 'ECONOMY', fare: 4850, seatsLeft: 8 },
      { class: 'BUSINESS', fare: 12400, seatsLeft: 3 },
    ],
    baggage: '15 kg',
    refundable: false,
  },
  {
    id: '2',
    flightNumber: 'AI-677',
    airline: 'Air India',
    airlineCode: 'AI',
    departure: '07:30',
    arrival: '10:00',
    duration: '2h 30m',
    stops: 0,
    fromAirport: 'BLR',
    toAirport: 'BOM',
    classes: [
      { class: 'ECONOMY', fare: 5200, seatsLeft: 14 },
      { class: 'BUSINESS', fare: 16800, seatsLeft: 6 },
      { class: 'FIRST', fare: 28500, seatsLeft: 2 },
    ],
    baggage: '23 kg',
    refundable: true,
  },
  {
    id: '3',
    flightNumber: 'UK-827',
    airline: 'Vistara',
    airlineCode: 'UK',
    departure: '10:15',
    arrival: '12:40',
    duration: '2h 25m',
    stops: 0,
    fromAirport: 'BLR',
    toAirport: 'BOM',
    classes: [
      { class: 'ECONOMY', fare: 5650, seatsLeft: 6 },
      { class: 'PREMIUM_ECONOMY', fare: 8200, seatsLeft: 4 },
      { class: 'BUSINESS', fare: 18900, seatsLeft: 3 },
    ],
    baggage: '20 kg',
    refundable: true,
  },
  {
    id: '4',
    flightNumber: 'SG-412',
    airline: 'SpiceJet',
    airlineCode: 'SG',
    departure: '14:00',
    arrival: '17:35',
    duration: '3h 35m',
    stops: 1,
    fromAirport: 'BLR',
    toAirport: 'DEL',
    classes: [
      { class: 'ECONOMY', fare: 6100, seatsLeft: 22 },
      { class: 'BUSINESS', fare: 14200, seatsLeft: 5 },
    ],
    baggage: '15 kg',
    refundable: false,
  },
];

type TripType = 'one-way' | 'round-trip' | 'multi-city';

interface CityLeg {
  from: string;
  to: string;
  date: string;
}

const CLASS_LABEL: Record<string, string> = {
  ECONOMY: 'Economy',
  PREMIUM_ECONOMY: 'Prem. Economy',
  BUSINESS: 'Business',
  FIRST: 'First Class',
};

const AIRLINE_COLORS: Record<string, string> = {
  IndiGo: 'bg-indigo-100 text-indigo-800',
  'Air India': 'bg-red-100 text-red-800',
  Vistara: 'bg-purple-100 text-purple-800',
  SpiceJet: 'bg-red-100 text-red-800',
  GoFirst: 'bg-blue-100 text-blue-800',
  'AirAsia India': 'bg-red-100 text-red-800',
};

export function FlightBooking() {
  const [tripType, setTripType] = useState<TripType>('one-way');
  const [selectedClass, setSelectedClass] = useState('ECONOMY');
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [searched, setSearched] = useState(false);
  const [multiCityLegs, setMultiCityLegs] = useState<CityLeg[]>([
    { from: 'BLR', to: 'BOM', date: '2026-03-15' },
    { from: 'BOM', to: 'DEL', date: '2026-03-17' },
  ]);

  const toggleAirline = (airline: string) => {
    setSelectedAirlines((prev) =>
      prev.includes(airline) ? prev.filter((a) => a !== airline) : [...prev, airline]
    );
  };

  const filteredResults = FLIGHT_RESULTS.filter((f) => {
    const airlineOk = selectedAirlines.length === 0 || selectedAirlines.includes(f.airline);
    const classOk = f.classes.some((c) => c.class === selectedClass);
    return airlineOk && classOk;
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Plane size={18} className="text-teal-600" />
            Flight Search (MakeMyTrip / Paytm Travel Integration)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Trip Type */}
          <div className="flex gap-2">
            {(['one-way', 'round-trip', 'multi-city'] as TripType[]).map((t) => (
              <Button
                key={t}
                variant={tripType === t ? 'default' : 'outline'}
                size="sm"
                className={tripType === t ? 'bg-teal-600 hover:bg-teal-700' : ''}
                onClick={() => setTripType(t)}
              >
                {t === 'one-way' ? 'One Way' : t === 'round-trip' ? (
                  <><ArrowLeftRight size={13} className="mr-1" />Round Trip</>
                ) : (
                  <><Plus size={13} className="mr-1" />Multi-City</>
                )}
              </Button>
            ))}
          </div>

          {tripType !== 'multi-city' ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div>
                <Label className="text-xs">From</Label>
                <Input placeholder="BLR" defaultValue="BLR" />
              </div>
              <div>
                <Label className="text-xs">To</Label>
                <Input placeholder="BOM" defaultValue="BOM" />
              </div>
              <div>
                <Label className="text-xs">Departure</Label>
                <Input type="date" defaultValue="2026-03-15" />
              </div>
              {tripType === 'round-trip' && (
                <div>
                  <Label className="text-xs">Return</Label>
                  <Input type="date" defaultValue="2026-03-18" />
                </div>
              )}
              <div>
                <Label className="text-xs">Passengers</Label>
                <Select defaultValue="1">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n} Adult{n > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {multiCityLegs.map((leg, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-xs">From</Label>
                    <Input
                      value={leg.from}
                      onChange={(e) => {
                        const updated = [...multiCityLegs];
                        updated[i].from = e.target.value;
                        setMultiCityLegs(updated);
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">To</Label>
                    <Input
                      value={leg.to}
                      onChange={(e) => {
                        const updated = [...multiCityLegs];
                        updated[i].to = e.target.value;
                        setMultiCityLegs(updated);
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Date</Label>
                    <Input
                      type="date"
                      value={leg.date}
                      onChange={(e) => {
                        const updated = [...multiCityLegs];
                        updated[i].date = e.target.value;
                        setMultiCityLegs(updated);
                      }}
                    />
                  </div>
                  <div className="flex items-end">
                    {multiCityLegs.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => setMultiCityLegs(multiCityLegs.filter((_, idx) => idx !== i))}
                      >
                        <X size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMultiCityLegs([...multiCityLegs, { from: '', to: '', date: '' }])}
              >
                <Plus size={14} className="mr-1" /> Add City
              </Button>
            </div>
          )}

          {/* Class & Filters row */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-44">
              <Label className="text-xs">Cabin Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ECONOMY">Economy</SelectItem>
                  <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
                  <SelectItem value="BUSINESS">Business</SelectItem>
                  <SelectItem value="FIRST">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setSearched(true)}>
              <Search size={16} className="mr-2" /> Search Flights
            </Button>
          </div>

          {/* Airline filter chips */}
          {searched && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-500 self-center">Filter airlines:</span>
              {AIRLINES.map((a) => (
                <button
                  key={a}
                  onClick={() => toggleAirline(a)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    selectedAirlines.includes(a)
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-teal-400'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fare Comparison Table */}
      {searched && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              Fare Comparison
              <Badge variant="outline" className="text-xs">{filteredResults.length} results</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Flight</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Stops</TableHead>
                    <TableHead>Baggage</TableHead>
                    <TableHead className="text-right">
                      {CLASS_LABEL[selectedClass] || selectedClass} Fare
                    </TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((flight) => {
                    const cls = flight.classes.find((c) => c.class === selectedClass);
                    return (
                      <TableRow key={flight.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${AIRLINE_COLORS[flight.airline] || 'bg-gray-100'}`}>
                              {flight.airlineCode}
                            </Badge>
                            <span className="text-sm font-medium">{flight.flightNumber}</span>
                          </div>
                          <p className="text-xs text-gray-500">{flight.airline}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="font-medium">{flight.departure}</span>
                            <ArrowRight size={12} className="text-gray-400" />
                            <span className="font-medium">{flight.arrival}</span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {flight.fromAirport} → {flight.toAirport}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock size={12} />
                            {flight.duration}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${flight.stops === 0 ? 'text-green-700 border-green-300' : 'text-orange-700 border-orange-300'}`}>
                            {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Luggage size={12} />
                            {flight.baggage}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {cls ? (
                            <div>
                              <p className="text-sm font-bold text-gray-900">₹{cls.fare.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">{cls.seatsLeft} left</p>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {flight.refundable ? (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              <RefreshCw size={10} className="mr-1" />
                              Refundable
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-gray-500">Non-refundable</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" className="bg-teal-600 hover:bg-teal-700" disabled={!cls}>
                            Book
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
