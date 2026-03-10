'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Train, Plane, Bus, Hotel, Car, Settings, ShieldCheck, IndianRupee, MapPin, Calendar } from 'lucide-react';
import { TrainBooking } from './components/train-booking';
import { FlightBooking } from './components/flight-booking';
import { BusBooking } from './components/bus-booking';
import { HotelBooking } from './components/hotel-booking';
import { CabBooking } from './components/cab-booking';
import { ApiSettings } from './components/api-settings';
import { TravelPolicy } from './components/travel-policy';

const STATS = [
  { label: 'Trips This Year', value: '18', icon: Plane, color: 'text-teal-600 bg-teal-50' },
  { label: 'Pending Approvals', value: '2', icon: Calendar, color: 'text-yellow-600 bg-yellow-50' },
  { label: 'This Month Spend', value: '₹2.4L', icon: IndianRupee, color: 'text-blue-600 bg-blue-50' },
  { label: 'Upcoming Trips', value: '3', icon: MapPin, color: 'text-purple-600 bg-purple-50' },
];

export default function TravelGuestHousePage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Travel & Guest House</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Book transport, cabs, and hotels · Manage corporate travel policy & approvals
          </p>
        </div>
        <Badge variant="outline" className="text-xs text-teal-700 border-teal-300">
          IRCTC · MMT · Ola · Uber · Rapido · Meru · OhmCabs
        </Badge>
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
      <Tabs defaultValue="trains">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="trains" className="gap-1.5">
            <Train size={14} /> Trains
          </TabsTrigger>
          <TabsTrigger value="flights" className="gap-1.5">
            <Plane size={14} /> Flights
          </TabsTrigger>
          <TabsTrigger value="buses" className="gap-1.5">
            <Bus size={14} /> Buses
          </TabsTrigger>
          <TabsTrigger value="hotels" className="gap-1.5">
            <Hotel size={14} /> Hotels
          </TabsTrigger>
          <TabsTrigger value="cabs" className="gap-1.5">
            <Car size={14} /> Cabs
          </TabsTrigger>
          <TabsTrigger value="policy" className="gap-1.5">
            <ShieldCheck size={14} /> Policy & Approvals
          </TabsTrigger>
          <TabsTrigger value="api-settings" className="gap-1.5">
            <Settings size={14} /> API Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trains" className="mt-4">
          <TrainBooking />
        </TabsContent>

        <TabsContent value="flights" className="mt-4">
          <FlightBooking />
        </TabsContent>

        <TabsContent value="buses" className="mt-4">
          <BusBooking />
        </TabsContent>

        <TabsContent value="hotels" className="mt-4">
          <HotelBooking />
        </TabsContent>

        <TabsContent value="cabs" className="mt-4">
          <CabBooking />
        </TabsContent>

        <TabsContent value="policy" className="mt-4">
          <TravelPolicy />
        </TabsContent>

        <TabsContent value="api-settings" className="mt-4">
          <ApiSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
