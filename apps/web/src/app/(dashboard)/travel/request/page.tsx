'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plane, ArrowLeft, GitBranch, CheckCircle2, Globe, MapPin } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  addApproval,
  buildTravelRequestChain,
  generateId,
} from '@/lib/approval-store';
import type { ApprovalRequest } from '@/lib/approval-store';
import { ApprovalTimeline } from '@/components/approvals/approval-timeline';

interface ItineraryDay {
  from: string;
  to: string;
  mode: string;
  departure: string;
  arrival: string;
  hotel: string;
}

export default function TravelRequestPage() {
  const { data: session } = useSession();
  const userName = (session?.user as any)?.name ?? 'Employee';
  const employeeId = (session?.user as any)?.employeeId ?? 'emp';

  // Form state
  const [fromCity, setFromCity] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [travelType, setTravelType] = useState<'DOMESTIC' | 'INTERNATIONAL'>('DOMESTIC');
  const [travelMode, setTravelMode] = useState('');
  const [accommodation, setAccommodation] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([
    { from: '', to: '', mode: '', departure: '', arrival: '', hotel: '' },
  ]);

  // Submission state
  const [submitted, setSubmitted] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<ApprovalRequest | null>(null);

  const isInternational = travelType === 'INTERNATIONAL';
  const previewSteps = buildTravelRequestChain(isInternational);

  function addItineraryDay() {
    setItinerary((prev) => [...prev, { from: '', to: '', mode: '', departure: '', arrival: '', hotel: '' }]);
  }

  function updateItinerary(index: number, field: keyof ItineraryDay, value: string) {
    setItinerary((prev) => prev.map((day, i) => (i === index ? { ...day, [field]: value } : day)));
  }

  function handleSubmit() {
    if (!fromCity || !destination || !startDate || !endDate || !purpose) return;

    const req: ApprovalRequest = {
      id: generateId(),
      type: 'TRAVEL_REQUEST',
      title: `Travel: ${fromCity} → ${destination} (${startDate} to ${endDate})`,
      description: purpose,
      requestedBy: employeeId,
      requestedByName: userName,
      requestedAt: new Date().toISOString(),
      status: 'PENDING',
      steps: buildTravelRequestChain(isInternational),
      metadata: {
        from: fromCity,
        destination,
        startDate,
        endDate,
        travelType,
        travelMode,
        accommodation,
        estimatedCost: estimatedCost || '0',
        advanceRequired: advanceAmount || '0',
        purpose,
      },
    };
    addApproval(req);
    setSubmittedRequest(req);
    setSubmitted(true);
  }

  if (submitted && submittedRequest) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/travel">
            <Button variant="ghost" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Travel Request Submitted</h1>
            <p className="text-sm text-gray-500">Your request is pending approval</p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <CheckCircle2 size={20} />
              <p className="text-sm font-medium">Travel request submitted successfully!</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <p className="text-xs text-gray-500">From</p>
                <p className="font-medium">{fromCity}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Destination</p>
                <p className="font-medium">{destination}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Travel Dates</p>
                <p className="font-medium">{startDate} to {endDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Type</p>
                <p className="font-medium">{travelType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Estimated Cost</p>
                <p className="font-medium">₹{Number(estimatedCost || 0).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Advance Required</p>
                <p className="font-medium">₹{Number(advanceAmount || 0).toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <GitBranch size={16} className="text-teal-600" /> Approval Chain
              </p>
              <ApprovalTimeline steps={submittedRequest.steps} />
            </div>

            <div className="flex gap-3 mt-6">
              <Link href="/approvals">
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <GitBranch size={16} className="mr-2" /> Track in Approvals
                </Button>
              </Link>
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                New Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          {/* Trip Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Travel Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTravelType('DOMESTIC')}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all',
                    travelType === 'DOMESTIC'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300',
                  )}
                >
                  <MapPin size={20} className={travelType === 'DOMESTIC' ? 'text-teal-600' : 'text-gray-400'} />
                  <div>
                    <p className="text-sm font-semibold">Domestic</p>
                    <p className="text-xs text-gray-500">Within India</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Employee → L1 Manager → Travel Desk</p>
                  </div>
                </button>
                <button
                  onClick={() => setTravelType('INTERNATIONAL')}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all',
                    travelType === 'INTERNATIONAL'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300',
                  )}
                >
                  <Globe size={20} className={travelType === 'INTERNATIONAL' ? 'text-teal-600' : 'text-gray-400'} />
                  <div>
                    <p className="text-sm font-semibold">International</p>
                    <p className="text-xs text-gray-500">Outside India</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">+ L2 Manager + HR Head required</p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Trip Details */}
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
                  <Label htmlFor="fromCity">From City *</Label>
                  <Input id="fromCity" placeholder="e.g. Bangalore" value={fromCity} onChange={(e) => setFromCity(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination *</Label>
                  <Input id="destination" placeholder="e.g. Mumbai" value={destination} onChange={(e) => setDestination(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Travel Start Date *</Label>
                  <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Travel End Date *</Label>
                  <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Travel *</Label>
                <Textarea id="purpose" placeholder="Describe the purpose of your travel" rows={3} value={purpose} onChange={(e) => setPurpose(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="travelMode">Primary Travel Mode</Label>
                  <Select value={travelMode} onValueChange={setTravelMode}>
                    <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
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
                  <Select value={accommodation} onValueChange={setAccommodation}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
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

          {/* Cost Estimate */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cost Estimate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimatedCost">Estimated Cost (₹)</Label>
                  <Input id="estimatedCost" type="number" placeholder="0" value={estimatedCost} onChange={(e) => setEstimatedCost(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="advanceAmount">Advance Required (₹)</Label>
                  <Input id="advanceAmount" type="number" placeholder="0" value={advanceAmount} onChange={(e) => setAdvanceAmount(e.target.value)} />
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
              {itinerary.map((day, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Day {index + 1}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>From</Label>
                      <Input placeholder="City/Location" value={day.from} onChange={(e) => updateItinerary(index, 'from', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>To</Label>
                      <Input placeholder="City/Location" value={day.to} onChange={(e) => updateItinerary(index, 'to', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Mode</Label>
                      <Input placeholder="Flight/Train" value={day.mode} onChange={(e) => updateItinerary(index, 'mode', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Departure</Label>
                      <Input type="time" value={day.departure} onChange={(e) => updateItinerary(index, 'departure', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Arrival</Label>
                      <Input type="time" value={day.arrival} onChange={(e) => updateItinerary(index, 'arrival', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Hotel Name (if applicable)</Label>
                    <Input placeholder="Hotel name" value={day.hotel} onChange={(e) => updateItinerary(index, 'hotel', e.target.value)} />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" onClick={addItineraryDay}>
                + Add Another Day
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Summary + Approval Chain sidebar */}
        <div className="space-y-4">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">From</span>
                  <span className="font-medium">{fromCity || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">To</span>
                  <span className="font-medium">{destination || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className={cn('font-medium', isInternational ? 'text-orange-600' : 'text-teal-600')}>
                    {travelType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Start</span>
                  <span className="font-medium">{startDate || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">End</span>
                  <span className="font-medium">{endDate || '-'}</span>
                </div>
                <hr />
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Cost</span>
                  <span className="font-medium">₹{Number(estimatedCost || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Advance</span>
                  <span className="font-medium">₹{Number(advanceAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  onClick={handleSubmit}
                  disabled={!fromCity || !destination || !startDate || !endDate || !purpose}
                >
                  Submit Request
                </Button>
                <Button variant="outline" className="w-full">Save as Draft</Button>
              </div>
            </CardContent>
          </Card>

          {/* Approval chain preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GitBranch size={16} className="text-teal-600" />
                Approval Chain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500 mb-3">
                {isInternational
                  ? 'International travel requires L1 Manager + L2 Manager + Travel Desk + HR Head approval.'
                  : 'Domestic travel requires L1 Manager + Travel Desk approval.'}
              </p>
              <ApprovalTimeline steps={previewSteps} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
