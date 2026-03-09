'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plane, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TravelRequestPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/travel">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Travel Request</h1>
          <p className="text-sm text-gray-500">Submit a new travel request for approval</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Plane size={18} className="text-teal-600" />
                Trip Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromCity">From City</Label>
                  <Input id="fromCity" placeholder="e.g. Bangalore" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input id="destination" placeholder="e.g. Mumbai" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Travel Start Date</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Travel End Date</Label>
                  <Input id="endDate" type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Travel</Label>
                <Textarea id="purpose" placeholder="Describe the purpose of your travel" rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="travelMode">Travel Mode</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FLIGHT">Flight</SelectItem>
                      <SelectItem value="TRAIN">Train</SelectItem>
                      <SelectItem value="BUS">Bus</SelectItem>
                      <SelectItem value="CAR">Car</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accommodation">Accommodation</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOTEL">Hotel</SelectItem>
                      <SelectItem value="GUEST_HOUSE">Guest House</SelectItem>
                      <SelectItem value="SELF">Self Arranged</SelectItem>
                      <SelectItem value="NONE">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cost Estimate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimatedCost">Estimated Cost (&#8377;)</Label>
                  <Input id="estimatedCost" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="advanceAmount">Advance Required (&#8377;)</Label>
                  <Input id="advanceAmount" type="number" placeholder="0" />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Advance amount cannot exceed 80% of estimated cost as per travel policy.
              </p>
            </CardContent>
          </Card>

          {/* Itinerary Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Itinerary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">Day 1</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>From</Label>
                    <Input placeholder="City/Location" />
                  </div>
                  <div className="space-y-2">
                    <Label>To</Label>
                    <Input placeholder="City/Location" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Mode</Label>
                    <Input placeholder="Flight/Train" />
                  </div>
                  <div className="space-y-2">
                    <Label>Departure</Label>
                    <Input type="time" />
                  </div>
                  <div className="space-y-2">
                    <Label>Arrival</Label>
                    <Input type="time" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Hotel Name (if applicable)</Label>
                  <Input placeholder="Hotel name" />
                </div>
              </div>

              <Button variant="outline" className="w-full">
                + Add Another Day
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">From</span>
                  <span className="font-medium">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">To</span>
                  <span className="font-medium">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium">-</span>
                </div>
                <hr />
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Cost</span>
                  <span className="font-medium">&#8377;0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Advance</span>
                  <span className="font-medium">&#8377;0</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button className="w-full bg-teal-600 hover:bg-teal-700">Submit Request</Button>
                <Button variant="outline" className="w-full">Save as Draft</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
