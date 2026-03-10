'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Car, MapPin, Phone, Star, Navigation, Clock, Zap, User, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type VehicleType = 'Mini' | 'Sedan' | 'SUV' | 'Auto' | 'Bike';
type Provider = 'Ola' | 'Uber' | 'Rapido' | 'Meru' | 'OhmCabs';

interface FareData {
  provider: Provider;
  color: string;
  fares: Partial<Record<VehicleType, { fare: number; eta: number; surge?: boolean }>>;
}

const FARE_DATA: FareData[] = [
  {
    provider: 'Ola',
    color: 'bg-green-600',
    fares: {
      Mini: { fare: 185, eta: 4, surge: false },
      Sedan: { fare: 260, eta: 6, surge: false },
      SUV: { fare: 420, eta: 8, surge: false },
      Auto: { fare: 110, eta: 3, surge: false },
    },
  },
  {
    provider: 'Uber',
    color: 'bg-black',
    fares: {
      Mini: { fare: 195, eta: 5, surge: true },
      Sedan: { fare: 275, eta: 7, surge: true },
      SUV: { fare: 445, eta: 10, surge: false },
      Bike: { fare: 75, eta: 2, surge: false },
    },
  },
  {
    provider: 'Rapido',
    color: 'bg-yellow-500',
    fares: {
      Auto: { fare: 95, eta: 3, surge: false },
      Bike: { fare: 60, eta: 2, surge: false },
      Mini: { fare: 170, eta: 5, surge: false },
    },
  },
  {
    provider: 'Meru',
    color: 'bg-blue-700',
    fares: {
      Sedan: { fare: 290, eta: 8, surge: false },
      SUV: { fare: 480, eta: 12, surge: false },
    },
  },
  {
    provider: 'OhmCabs',
    color: 'bg-teal-600',
    fares: {
      Mini: { fare: 175, eta: 6, surge: false },
      Sedan: { fare: 245, eta: 8, surge: false },
      SUV: { fare: 395, eta: 10, surge: false },
    },
  },
];

const VEHICLE_TYPES: VehicleType[] = ['Mini', 'Sedan', 'SUV', 'Auto', 'Bike'];

const BOOKING_STEPS = [
  { key: 'SEARCHING', label: 'Searching for driver', icon: Navigation },
  { key: 'DRIVER_ASSIGNED', label: 'Driver assigned', icon: User },
  { key: 'EN_ROUTE', label: 'Driver en route', icon: Car },
  { key: 'ARRIVED', label: 'Driver arrived', icon: CheckCircle },
  { key: 'IN_TRIP', label: 'In progress', icon: Zap },
  { key: 'COMPLETED', label: 'Trip completed', icon: CheckCircle },
];

const MOCK_DRIVER = {
  name: 'Suresh Kumar',
  phone: '+91 98765 43210',
  rating: 4.8,
  trips: 3420,
  vehicle: 'Toyota Etios',
  number: 'KA 01 AB 1234',
  provider: 'Ola' as Provider,
  otp: '7843',
};

export function CabBooking() {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('Sedan');
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [pickup, setPickup] = useState('Koramangala, Bengaluru');
  const [drop, setDrop] = useState('Kempegowda Airport, Bengaluru');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const stepIndex = BOOKING_STEPS.findIndex((s) => s.key === bookingStatus);
  const progress = bookingStatus ? Math.round(((stepIndex + 1) / BOOKING_STEPS.length) * 100) : 0;

  const handleBook = (provider: Provider) => {
    setSelectedProvider(provider);
    setBookingStatus('DRIVER_ASSIGNED');
  };

  const availableVehicles = VEHICLE_TYPES.filter((v) =>
    FARE_DATA.some((p) => p.fares[v])
  );

  return (
    <div className="space-y-4">
      {/* Booking Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Car size={18} className="text-teal-600" />
            Cab Booking — Fare Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Pickup Location</Label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-3 text-green-500" />
                <Input className="pl-8" value={pickup} onChange={(e) => setPickup(e.target.value)} />
              </div>
            </div>
            <div>
              <Label className="text-xs">Drop Location</Label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-3 text-red-500" />
                <Input className="pl-8" value={drop} onChange={(e) => setDrop(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Vehicle type selector */}
          <div>
            <Label className="text-xs mb-2 block">Vehicle Type</Label>
            <div className="flex gap-2 flex-wrap">
              {availableVehicles.map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedVehicle(v)}
                  className={cn(
                    'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                    selectedVehicle === v
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Map placeholder */}
          <div className="w-full h-40 bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg border-2 border-dashed border-teal-200 flex flex-col items-center justify-center">
            <Navigation size={28} className="text-teal-400 mb-2" />
            <p className="text-sm text-gray-500 font-medium">Live Map View</p>
            <p className="text-xs text-gray-400">Real-time driver tracking placeholder</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" /> {pickup.split(',')[0]}
              </span>
              <span>→</span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" /> {drop.split(',')[0]}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fare comparison table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            Fare Comparison for <span className="text-teal-600">{selectedVehicle}</span> — Approx. 28 km
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {FARE_DATA.map((provider) => {
              const fareInfo = provider.fares[selectedVehicle];
              return (
                <div
                  key={provider.provider}
                  className={cn(
                    'border rounded-lg p-4 text-center transition-all',
                    fareInfo
                      ? 'hover:shadow-md cursor-pointer bg-white'
                      : 'bg-gray-50 opacity-50',
                    selectedProvider === provider.provider && fareInfo
                      ? 'border-teal-500 ring-2 ring-teal-200'
                      : 'border-gray-200'
                  )}
                >
                  <div className={`w-8 h-8 rounded-full ${provider.color} mx-auto mb-2 flex items-center justify-center`}>
                    <Car size={14} className="text-white" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{provider.provider}</p>
                  {fareInfo ? (
                    <>
                      <p className="text-xl font-bold text-gray-900 my-1">₹{fareInfo.fare}</p>
                      <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-2">
                        <Clock size={11} />
                        <span>{fareInfo.eta} min ETA</span>
                      </div>
                      {fareInfo.surge && (
                        <Badge className="bg-orange-100 text-orange-700 text-xs mb-2">
                          <Zap size={10} className="mr-1" />Surge
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        className="w-full bg-teal-600 hover:bg-teal-700 mt-1"
                        onClick={() => handleBook(provider.provider)}
                      >
                        Book
                      </Button>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400 mt-2">Not available</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Full comparison table */}
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  {VEHICLE_TYPES.map((v) => (
                    <TableHead key={v} className={cn('text-center', selectedVehicle === v && 'text-teal-600 font-semibold')}>
                      {v}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {FARE_DATA.map((p) => (
                  <TableRow key={p.provider}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${p.color}`} />
                        <span className="text-sm font-medium">{p.provider}</span>
                      </div>
                    </TableCell>
                    {VEHICLE_TYPES.map((v) => {
                      const f = p.fares[v];
                      return (
                        <TableCell key={v} className={cn('text-center', selectedVehicle === v && 'bg-teal-50')}>
                          {f ? (
                            <span className={cn('text-sm', f.surge ? 'text-orange-600 font-medium' : 'text-gray-700')}>
                              ₹{f.fare}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Booking status tracker */}
      {bookingStatus && selectedProvider && (
        <Card className="border-teal-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-teal-700">
              <Zap size={16} className="text-teal-600" />
              Live Booking Status — {selectedProvider}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Booking Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Steps */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {BOOKING_STEPS.map((step, i) => {
                const isDone = i <= stepIndex;
                const isCurrent = i === stepIndex;
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors',
                          isDone
                            ? 'bg-teal-600 border-teal-600 text-white'
                            : 'bg-gray-100 border-gray-300 text-gray-400'
                        )}
                      >
                        <Icon size={14} />
                      </div>
                      <p className={cn(
                        'text-xs mt-1 text-center w-16',
                        isCurrent ? 'text-teal-700 font-semibold' : 'text-gray-500'
                      )}>
                        {step.label}
                      </p>
                    </div>
                    {i < BOOKING_STEPS.length - 1 && (
                      <div className={cn(
                        'h-0.5 w-6 mx-1 flex-shrink-0 mt-0',
                        i < stepIndex ? 'bg-teal-500' : 'bg-gray-200'
                      )} />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 justify-end">
              {BOOKING_STEPS.map((step, i) => {
                if (i <= stepIndex || i > stepIndex + 1) return null;
                return (
                  <Button
                    key={step.key}
                    size="sm"
                    className="bg-teal-600 hover:bg-teal-700"
                    onClick={() => setBookingStatus(step.key)}
                  >
                    Simulate: {step.label}
                  </Button>
                );
              })}
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-200"
                onClick={() => { setBookingStatus(null); setSelectedProvider(null); }}
              >
                Cancel Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Driver details card */}
      {bookingStatus && bookingStatus !== 'SEARCHING' && bookingStatus !== 'COMPLETED' && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-800">Driver Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-green-200 text-green-800 font-semibold text-sm">
                    {MOCK_DRIVER.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{MOCK_DRIVER.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < Math.floor(MOCK_DRIVER.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">{MOCK_DRIVER.rating} · {MOCK_DRIVER.trips.toLocaleString()} trips</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                    <span>{MOCK_DRIVER.vehicle}</span>
                    <Separator orientation="vertical" className="h-3" />
                    <span className="font-mono font-medium">{MOCK_DRIVER.number}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-green-100 text-green-700 text-sm font-bold px-3 mb-2">
                  OTP: {MOCK_DRIVER.otp}
                </Badge>
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="outline" className="border-green-400 text-green-700 hover:bg-green-100">
                    <Phone size={14} className="mr-1" /> Call
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Track Live
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
