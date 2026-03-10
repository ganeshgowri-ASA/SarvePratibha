'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Plane,
  Train,
  Bus,
  Hotel,
  Car,
  Home,
  Search,
  Download,
  Eye,
  Calendar,
  IndianRupee,
  TrendingUp,
  Filter,
  FileText,
} from 'lucide-react';

type BookingType = 'ALL' | 'FLIGHT' | 'TRAIN' | 'BUS' | 'HOTEL' | 'CAB' | 'GUESTHOUSE';
type StatusType = 'ALL' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'PENDING';

interface Booking {
  id: string;
  type: Exclude<BookingType, 'ALL'>;
  description: string;
  route: string;
  travelDate: string;
  bookingDate: string;
  amount: number;
  status: Exclude<StatusType, 'ALL'>;
  pnr?: string;
  vendor?: string;
  paymentMethod?: string;
}

const ALL_BOOKINGS: Booking[] = [
  {
    id: 'BK-FLT-001',
    type: 'FLIGHT',
    description: 'IndiGo 6E-2341',
    route: 'BLR → BOM',
    travelDate: '15 Mar 2026',
    bookingDate: '1 Mar 2026',
    amount: 4850,
    status: 'CONFIRMED',
    pnr: 'PNR-X7K2L',
    vendor: 'IndiGo',
    paymentMethod: 'PhonePe',
  },
  {
    id: 'BK-HTL-001',
    type: 'HOTEL',
    description: 'Trident Nariman Point',
    route: 'Mumbai • 3 nights',
    travelDate: '15–18 Mar 2026',
    bookingDate: '2 Mar 2026',
    amount: 25500,
    status: 'CONFIRMED',
    vendor: 'MakeMyTrip',
    paymentMethod: 'Corporate',
  },
  {
    id: 'BK-TRN-001',
    type: 'TRAIN',
    description: 'Rajdhani Express 22691',
    route: 'SBC → NDLS',
    travelDate: '5 Mar 2026',
    bookingDate: '18 Feb 2026',
    amount: 2480,
    status: 'COMPLETED',
    pnr: '6834512300',
    vendor: 'IRCTC',
    paymentMethod: 'UPI',
  },
  {
    id: 'BK-CAB-001',
    type: 'CAB',
    description: 'Ola Sedan',
    route: 'Koramangala → Airport',
    travelDate: '5 Mar 2026',
    bookingDate: '5 Mar 2026',
    amount: 260,
    status: 'COMPLETED',
    vendor: 'Ola',
    paymentMethod: 'Paytm',
  },
  {
    id: 'BK-BUS-001',
    type: 'BUS',
    description: 'VRL Travels AC Sleeper',
    route: 'BLR → HYD',
    travelDate: '20 Feb 2026',
    bookingDate: '15 Feb 2026',
    amount: 1200,
    status: 'COMPLETED',
    pnr: 'VRLB-7823',
    vendor: 'RedBus / VRL',
    paymentMethod: 'UPI',
  },
  {
    id: 'BK-GH-001',
    type: 'GUESTHOUSE',
    description: 'Mumbai Corporate Guest House',
    route: 'Mumbai • 2 nights',
    travelDate: '15–17 Mar 2026',
    bookingDate: '3 Mar 2026',
    amount: 1200,
    status: 'CONFIRMED',
    pnr: 'GH-892341',
    vendor: 'SarvePratibha',
    paymentMethod: 'Corporate',
  },
  {
    id: 'BK-FLT-002',
    type: 'FLIGHT',
    description: 'Air India AI-677',
    route: 'BLR → DEL',
    travelDate: '1 Apr 2026',
    bookingDate: '5 Mar 2026',
    amount: 5200,
    status: 'CONFIRMED',
    pnr: 'PNR-A3D8M',
    vendor: 'Air India',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'BK-HTL-002',
    type: 'HOTEL',
    description: 'Ibis Delhi Airport',
    route: 'Delhi • 1 night',
    travelDate: '1 Apr 2026',
    bookingDate: '5 Mar 2026',
    amount: 3500,
    status: 'CONFIRMED',
    vendor: 'Paytm Travel',
    paymentMethod: 'Paytm',
  },
  {
    id: 'BK-TRN-002',
    type: 'TRAIN',
    description: 'KSK Express 12658',
    route: 'HYD → BLR',
    travelDate: '10 Mar 2026',
    bookingDate: '28 Feb 2026',
    amount: 1760,
    status: 'COMPLETED',
    pnr: '9021348760',
    vendor: 'ConfirmTkt',
    paymentMethod: 'UPI',
  },
  {
    id: 'BK-CAB-002',
    type: 'CAB',
    description: 'Uber XL',
    route: 'Airport → Office',
    travelDate: '10 Mar 2026',
    bookingDate: '10 Mar 2026',
    amount: 480,
    status: 'COMPLETED',
    vendor: 'Uber',
    paymentMethod: 'UPI',
  },
];

const TYPE_ICON: Record<string, React.ReactNode> = {
  FLIGHT: <Plane size={14} className="text-blue-600" />,
  TRAIN: <Train size={14} className="text-green-600" />,
  BUS: <Bus size={14} className="text-orange-600" />,
  HOTEL: <Hotel size={14} className="text-purple-600" />,
  CAB: <Car size={14} className="text-teal-600" />,
  GUESTHOUSE: <Home size={14} className="text-red-600" />,
};

const TYPE_BADGE: Record<string, string> = {
  FLIGHT: 'bg-blue-100 text-blue-700',
  TRAIN: 'bg-green-100 text-green-700',
  BUS: 'bg-orange-100 text-orange-700',
  HOTEL: 'bg-purple-100 text-purple-700',
  CAB: 'bg-teal-100 text-teal-700',
  GUESTHOUSE: 'bg-red-100 text-red-700',
};

const STATUS_BADGE: Record<string, string> = {
  CONFIRMED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
};

function BookingDetailDialog({ booking }: { booking: Booking }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2">
          <Eye size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {TYPE_ICON[booking.type]}
            Booking Details — {booking.id}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Booking Type</p>
                <Badge className={`${TYPE_BADGE[booking.type]} mt-1`}>{booking.type}</Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500">Description</p>
                <p className="font-medium">{booking.description}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Route / Property</p>
                <p className="font-medium">{booking.route}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Travel Date</p>
                <p className="font-medium">{booking.travelDate}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <Badge className={`${STATUS_BADGE[booking.status]} mt-1`}>{booking.status}</Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500">Amount Paid</p>
                <p className="font-bold text-lg text-teal-700">₹{booking.amount.toLocaleString()}</p>
              </div>
              {booking.pnr && (
                <div>
                  <p className="text-xs text-gray-500">PNR / Ref</p>
                  <p className="font-mono font-medium text-xs">{booking.pnr}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500">Vendor</p>
                <p className="font-medium">{booking.vendor || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Payment Method</p>
                <p className="font-medium">{booking.paymentMethod || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Booking Date</p>
                <p className="font-medium">{booking.bookingDate}</p>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Download size={13} className="mr-1" /> Download Ticket
            </Button>
            {booking.status === 'CONFIRMED' && (
              <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                Cancel Booking
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function BookingHistory() {
  const [typeFilter, setTypeFilter] = useState<BookingType>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = ALL_BOOKINGS.filter((b) => {
    const typeOk = typeFilter === 'ALL' || b.type === typeFilter;
    const statusOk = statusFilter === 'ALL' || b.status === statusFilter;
    const searchOk =
      !searchQuery ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.pnr && b.pnr.toLowerCase().includes(searchQuery.toLowerCase()));
    return typeOk && statusOk && searchOk;
  });

  const totalSpend = filtered.reduce((sum, b) => sum + b.amount, 0);
  const byType = ALL_BOOKINGS.reduce(
    (acc, b) => {
      acc[b.type] = (acc[b.type] || 0) + b.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-50">
                <FileText size={16} className="text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Bookings</p>
                <p className="text-xl font-bold">{ALL_BOOKINGS.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-green-50">
                <IndianRupee size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Spent</p>
                <p className="text-xl font-bold">
                  ₹{ALL_BOOKINGS.reduce((s, b) => s + b.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50">
                <Calendar size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Upcoming</p>
                <p className="text-xl font-bold">
                  {ALL_BOOKINGS.filter((b) => b.status === 'CONFIRMED').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-50">
                <TrendingUp size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Most Used</p>
                <p className="text-sm font-bold">Flights</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spend breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Spend by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {(Object.entries(byType) as [string, number][]).map(([type, amount]) => (
              <div key={type} className="text-center p-2 rounded-lg bg-gray-50 border">
                <div className="flex justify-center mb-1">{TYPE_ICON[type]}</div>
                <p className="text-xs text-gray-500">{type.charAt(0) + type.slice(1).toLowerCase()}</p>
                <p className="text-xs font-bold text-gray-900">₹{amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-48">
              <Search size={14} className="text-gray-400" />
              <Input
                placeholder="Search by description, route, PNR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as BookingType)}>
                <SelectTrigger className="h-8 w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['ALL', 'FLIGHT', 'TRAIN', 'BUS', 'HOTEL', 'CAB', 'GUESTHOUSE'] as BookingType[]).map(
                    (t) => (
                      <SelectItem key={t} value={t}>{t === 'ALL' ? 'All Types' : t.charAt(0) + t.slice(1).toLowerCase()}</SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusType)}>
                <SelectTrigger className="h-8 w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'PENDING'] as StatusType[]).map(
                    (s) => (
                      <SelectItem key={s} value={s}>{s === 'ALL' ? 'All Status' : s.charAt(0) + s.slice(1).toLowerCase()}</SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              <Download size={14} className="mr-1" /> Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Travel Date</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((b) => (
                  <TableRow key={b.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-xs text-gray-500">{b.id}</TableCell>
                    <TableCell>
                      <Badge className={`${TYPE_BADGE[b.type]} text-xs flex items-center gap-1 w-fit`}>
                        {TYPE_ICON[b.type]}
                        {b.type.charAt(0) + b.type.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-900">{b.description}</TableCell>
                    <TableCell className="text-xs text-gray-600">{b.route}</TableCell>
                    <TableCell className="text-xs text-gray-600">{b.travelDate}</TableCell>
                    <TableCell className="text-xs text-gray-600">{b.vendor || '—'}</TableCell>
                    <TableCell className="text-right font-semibold text-gray-900">
                      ₹{b.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${STATUS_BADGE[b.status]} text-xs`}>{b.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <BookingDetailDialog booking={b} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length > 0 && (
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>Showing {filtered.length} of {ALL_BOOKINGS.length} bookings</span>
              <span>Total: <span className="font-semibold text-gray-900">₹{totalSpend.toLocaleString()}</span></span>
            </div>
          )}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Search size={28} className="mx-auto mb-2" />
              <p className="text-sm">No bookings match your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
