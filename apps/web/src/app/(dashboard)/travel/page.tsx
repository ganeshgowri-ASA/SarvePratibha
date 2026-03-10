'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plane,
  Train,
  Bus,
  Hotel,
  Car,
  Home,
  CreditCard,
  History,
  IndianRupee,
  Calendar,
} from 'lucide-react';

// Booking components from travel-guest-house (reusable across routes)
import { CabBooking } from '../travel-guest-house/components/cab-booking';
import { HotelBooking } from '../travel-guest-house/components/hotel-booking';
import { TrainBooking } from '../travel-guest-house/components/train-booking';
import { FlightBooking } from '../travel-guest-house/components/flight-booking';
import { BusBooking } from '../travel-guest-house/components/bus-booking';

// New components added in this hub
import { GuesthouseBooking } from './components/guesthouse-booking';
import { PaymentGateway } from './components/payment-gateway';
import { BookingHistory } from './components/booking-history';

const STATS = [
  { label: 'Trips This Year', value: '18', icon: Plane, color: 'text-teal-600 bg-teal-50' },
  { label: 'Upcoming Trips', value: '3', icon: Calendar, color: 'text-blue-600 bg-blue-50' },
  { label: 'This Month Spend', value: '₹2.4L', icon: IndianRupee, color: 'text-green-600 bg-green-50' },
  { label: 'Pending Payments', value: '₹22K', icon: CreditCard, color: 'text-orange-600 bg-orange-50' },
];

export default function TravelPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Travel & Booking Hub</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Book cabs, hotels, trains, flights, buses and company guest houses · Manage payments and history
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['Ola', 'Uber', 'Rapido', 'IRCTC', 'ConfirmTkt', 'MakeMyTrip', 'Paytm', 'RedBus'].map((p) => (
            <Badge key={p} variant="outline" className="text-xs text-teal-700 border-teal-200">
              {p}
            </Badge>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main tabbed interface */}
      <Tabs defaultValue="cabs">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="cabs" className="gap-1.5">
            <Car size={14} /> Cabs
          </TabsTrigger>
          <TabsTrigger value="hotels" className="gap-1.5">
            <Hotel size={14} /> Hotels
          </TabsTrigger>
          <TabsTrigger value="trains" className="gap-1.5">
            <Train size={14} /> Trains
          </TabsTrigger>
          <TabsTrigger value="flights" className="gap-1.5">
            <Plane size={14} /> Flights
          </TabsTrigger>
          <TabsTrigger value="buses" className="gap-1.5">
            <Bus size={14} /> Buses
          </TabsTrigger>
          <TabsTrigger value="guesthouse" className="gap-1.5">
            <Home size={14} /> Guest House
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-1.5">
            <CreditCard size={14} /> Payments
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            <History size={14} /> History
          </TabsTrigger>
        </TabsList>

        {/* Cab Booking */}
        <TabsContent value="cabs" className="mt-4">
          <CabBooking />
        </TabsContent>

        {/* Hotel Booking */}
        <TabsContent value="hotels" className="mt-4">
          <HotelBooking />
        </TabsContent>

        {/* Train Booking */}
        <TabsContent value="trains" className="mt-4">
          <TrainBooking />
        </TabsContent>

        {/* Flight Booking */}
        <TabsContent value="flights" className="mt-4">
          <FlightBooking />
        </TabsContent>

        {/* Bus Booking */}
        <TabsContent value="buses" className="mt-4">
          <BusBooking />
        </TabsContent>

        {/* Company Guest House */}
        <TabsContent value="guesthouse" className="mt-4">
          <GuesthouseBooking />
        </TabsContent>

        {/* Payment Gateway */}
        <TabsContent value="payment" className="mt-4">
          <PaymentGateway />
        </TabsContent>

        {/* Booking History */}
        <TabsContent value="history" className="mt-4">
          <BookingHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
