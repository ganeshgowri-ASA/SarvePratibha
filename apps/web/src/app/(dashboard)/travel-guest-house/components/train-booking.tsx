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
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Train, Search, Star, ArrowRight, Clock, Info, CheckCircle, AlertCircle } from 'lucide-react';

const TRAIN_RESULTS = [
  {
    id: '1',
    trainNumber: '12658',
    trainName: 'KSK Express',
    fromStation: 'SBC (Bengaluru City)',
    toStation: 'NDLS (New Delhi)',
    departure: '21:30',
    arrival: '06:55+2',
    duration: '33h 25m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { class: '1AC', fare: 4250, available: 4 },
      { class: '2AC', fare: 2480, available: 12 },
      { class: '3AC', fare: 1760, available: 28 },
      { class: 'SL', fare: 675, available: 64 },
    ],
    isTatkal: false,
  },
  {
    id: '2',
    trainNumber: '22691',
    trainName: 'Rajdhani Express',
    fromStation: 'SBC (Bengaluru City)',
    toStation: 'NDLS (New Delhi)',
    departure: '20:00',
    arrival: '05:55+2',
    duration: '33h 55m',
    runsOn: ['Tue', 'Fri', 'Sun'],
    classes: [
      { class: '1AC', fare: 5120, available: 6 },
      { class: '2AC', fare: 3020, available: 18 },
      { class: '3AC', fare: 2190, available: 36 },
    ],
    isTatkal: false,
  },
  {
    id: '3',
    trainNumber: '16022',
    trainName: 'Kaveri Express',
    fromStation: 'SBC (Bengaluru City)',
    toStation: 'MAS (Chennai Central)',
    departure: '06:30',
    arrival: '11:00',
    duration: '4h 30m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { class: '2AC', fare: 760, available: 10 },
      { class: '3AC', fare: 495, available: 32 },
      { class: 'SL', fare: 185, available: 88 },
    ],
    isTatkal: false,
  },
];

const PNR_DATA = {
  pnr: '2354891230',
  trainNumber: '12658',
  trainName: 'KSK Express',
  journeyDate: '15 Mar 2026',
  fromStation: 'SBC',
  toStation: 'NDLS',
  class: '2AC',
  passengers: [
    { name: 'Rahul Sharma', age: 32, berth: 'S4/45 (SU)', status: 'CNF' },
    { name: 'Priya Sharma', age: 29, berth: 'S4/46 (LB)', status: 'CNF' },
  ],
  chartStatus: 'CHART PREPARED',
};

const CLASS_COLORS: Record<string, string> = {
  '1AC': 'bg-amber-100 text-amber-800 border-amber-200',
  '2AC': 'bg-blue-100 text-blue-800 border-blue-200',
  '3AC': 'bg-green-100 text-green-800 border-green-200',
  'SL': 'bg-gray-100 text-gray-800 border-gray-200',
  'CC': 'bg-purple-100 text-purple-800 border-purple-200',
};

export function TrainBooking() {
  const [activeView, setActiveView] = useState<'search' | 'pnr'>('search');
  const [isTatkal, setIsTatkal] = useState(false);
  const [selectedClass, setSelectedClass] = useState('all');
  const [searched, setSearched] = useState(false);
  const [pnrInput, setPnrInput] = useState('');
  const [pnrResult, setPnrResult] = useState<typeof PNR_DATA | null>(null);

  const handleSearch = () => setSearched(true);
  const handlePnrCheck = () => {
    if (pnrInput.length >= 6) setPnrResult(PNR_DATA);
  };

  const filteredResults = selectedClass === 'all'
    ? TRAIN_RESULTS
    : TRAIN_RESULTS.filter(t => t.classes.some(c => c.class === selectedClass));

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={activeView === 'search' ? 'default' : 'outline'}
          size="sm"
          className={activeView === 'search' ? 'bg-teal-600 hover:bg-teal-700' : ''}
          onClick={() => setActiveView('search')}
        >
          <Search size={14} className="mr-1" /> Search Trains
        </Button>
        <Button
          variant={activeView === 'pnr' ? 'default' : 'outline'}
          size="sm"
          className={activeView === 'pnr' ? 'bg-teal-600 hover:bg-teal-700' : ''}
          onClick={() => setActiveView('pnr')}
        >
          <Info size={14} className="mr-1" /> PNR Status
        </Button>
      </div>

      {activeView === 'search' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Train size={18} className="text-teal-600" />
              Train Search (IRCTC Integration)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs">From Station</Label>
                <Input placeholder="e.g., SBC, Bengaluru City" defaultValue="SBC" />
              </div>
              <div>
                <Label className="text-xs">To Station</Label>
                <Input placeholder="e.g., NDLS, New Delhi" defaultValue="NDLS" />
              </div>
              <div>
                <Label className="text-xs">Journey Date</Label>
                <Input type="date" defaultValue="2026-03-15" />
              </div>
              <div>
                <Label className="text-xs">Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="1AC">1AC - First AC</SelectItem>
                    <SelectItem value="2AC">2AC - Second AC</SelectItem>
                    <SelectItem value="3AC">3AC - Third AC</SelectItem>
                    <SelectItem value="SL">SL - Sleeper</SelectItem>
                    <SelectItem value="CC">CC - Chair Car</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch checked={isTatkal} onCheckedChange={setIsTatkal} id="tatkal" />
                <Label htmlFor="tatkal" className="text-sm cursor-pointer">
                  Tatkal Booking
                  {isTatkal && <Badge className="ml-2 bg-orange-100 text-orange-700 text-xs">+25% fare</Badge>}
                </Label>
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSearch}>
                <Search size={16} className="mr-2" /> Search Trains
              </Button>
            </div>

            {/* Results */}
            {searched && (
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">{filteredResults.length} trains found</p>
                  <Badge variant="outline" className="text-xs">Live availability</Badge>
                </div>
                {filteredResults.map((train) => (
                  <div key={train.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900">{train.trainName}</p>
                          <Badge variant="outline" className="text-xs">{train.trainNumber}</Badge>
                          {isTatkal && (
                            <Badge className="bg-orange-100 text-orange-700 text-xs">Tatkal</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                          <span className="font-medium">{train.departure}</span>
                          <span className="text-xs text-gray-400">{train.fromStation}</span>
                          <ArrowRight size={14} className="text-gray-400" />
                          <span className="font-medium">{train.arrival}</span>
                          <span className="text-xs text-gray-400">{train.toStation}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>{train.duration}</span>
                          <Separator orientation="vertical" className="h-3 mx-1" />
                          <span>Runs: {train.runsOn.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Class availability */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {train.classes.map((cls) => (
                        <div
                          key={cls.class}
                          className={`border rounded p-2 text-center cursor-pointer hover:shadow-sm transition-shadow ${CLASS_COLORS[cls.class] || 'bg-gray-50'}`}
                        >
                          <p className="text-xs font-semibold">{cls.class}</p>
                          <p className="text-sm font-bold">₹{(cls.fare * (isTatkal ? 1.25 : 1)).toFixed(0)}</p>
                          <p className="text-xs">{cls.available} available</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end mt-3 gap-2">
                      <Button variant="outline" size="sm">View Schedule</Button>
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Book Now</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeView === 'pnr' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Info size={18} className="text-teal-600" />
              PNR Status Check
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Label className="text-xs">Enter PNR Number (10 digits)</Label>
                <Input
                  placeholder="e.g., 2354891230"
                  value={pnrInput}
                  onChange={(e) => setPnrInput(e.target.value)}
                  maxLength={10}
                />
              </div>
              <div className="flex items-end">
                <Button className="bg-teal-600 hover:bg-teal-700" onClick={handlePnrCheck}>
                  Check Status
                </Button>
              </div>
            </div>

            {pnrResult && (
              <div className="border rounded-lg p-4 space-y-4 bg-green-50 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {pnrResult.trainNumber} - {pnrResult.trainName}
                    </p>
                    <p className="text-xs text-gray-500">PNR: {pnrResult.pnr}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-700">{pnrResult.chartStatus}</Badge>
                    <p className="text-xs text-gray-500 mt-1">{pnrResult.journeyDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="font-medium">{pnrResult.fromStation}</span>
                  <ArrowRight size={14} />
                  <span className="font-medium">{pnrResult.toStation}</span>
                  <Badge variant="outline" className={CLASS_COLORS[pnrResult.class]}>
                    {pnrResult.class}
                  </Badge>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Passenger</TableHead>
                      <TableHead className="text-xs">Age</TableHead>
                      <TableHead className="text-xs">Berth</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pnrResult.passengers.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-sm">{p.name}</TableCell>
                        <TableCell className="text-sm">{p.age}</TableCell>
                        <TableCell className="text-sm font-medium">{p.berth}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            <CheckCircle size={10} className="mr-1" />
                            {p.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Recent PNR bookings */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Recent Corporate Bookings</p>
              <div className="space-y-2">
                {[
                  { pnr: '4521367890', route: 'BLR → DEL', date: '18 Mar 2026', status: 'CONFIRMED' },
                  { pnr: '6834512300', route: 'BLR → MUM', date: '22 Mar 2026', status: 'WL/3' },
                  { pnr: '9021348760', route: 'HYD → BLR', date: '10 Mar 2026', status: 'COMPLETED' },
                ].map((b) => (
                  <div key={b.pnr} className="flex items-center justify-between p-2 border rounded text-sm">
                    <span className="text-gray-600 font-mono text-xs">{b.pnr}</span>
                    <span className="text-gray-700">{b.route}</span>
                    <span className="text-gray-500 text-xs">{b.date}</span>
                    <Badge
                      className={
                        b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                        b.status === 'COMPLETED' ? 'bg-teal-100 text-teal-700' :
                        'bg-yellow-100 text-yellow-700'
                      }
                    >
                      {b.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
