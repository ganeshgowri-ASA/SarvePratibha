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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CreditCard,
  Printer,
  QrCode,
  Smartphone,
  User,
  Calendar,
  MapPin,
  Building,
} from 'lucide-react';
import { type Visitor, VISITORS_DATA } from './demo-data';

function VisitorIDCard({ visitor, onClose }: { visitor: Visitor; onClose: () => void }) {
  const isRelative = visitor.visitorType === 'relative';
  const borderColor = isRelative ? 'border-blue-500' : 'border-red-500';
  const headerBg = isRelative ? 'bg-blue-600' : 'bg-red-600';
  const passLabel = isRelative ? 'RELATIVE PASS' : 'VISITOR PASS';

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Visitor ID Card - {passLabel}</DialogTitle>
        </DialogHeader>

        {/* ID Card Preview */}
        <div className={`border-4 ${borderColor} rounded-xl overflow-hidden shadow-lg`}>
          {/* Card Header */}
          <div className={`${headerBg} text-white px-4 py-3 text-center`}>
            <p className="text-xs font-medium tracking-wider">{passLabel}</p>
            <p className="text-lg font-bold">SarvePratibha Corp.</p>
            <p className="text-xs opacity-80">Temporary Access Card</p>
          </div>

          {/* Card Body */}
          <div className="bg-white p-4">
            <div className="flex gap-4">
              {/* Photo */}
              <div className="w-20 h-24 bg-gray-100 border rounded flex items-center justify-center flex-shrink-0">
                <User size={32} className="text-gray-300" />
              </div>
              {/* Details */}
              <div className="flex-1 space-y-1.5 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Name</p>
                  <p className="font-bold text-gray-900">{visitor.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Company</p>
                  <p className="text-gray-700">{visitor.company}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Pass ID</p>
                  <p className="font-mono font-bold text-teal-700">{visitor.passId}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-1.5">
                <Calendar size={12} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-400">Date</p>
                  <p className="text-gray-700">10 Mar 2026</p>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <Calendar size={12} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-400">Valid Until</p>
                  <p className="text-gray-700">{visitor.expectedExit}</p>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <Building size={12} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-400">Host</p>
                  <p className="text-gray-700">{visitor.hostEmployee}</p>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <MapPin size={12} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-400">Areas Allowed</p>
                  <p className="text-gray-700">{visitor.area.building}, {visitor.area.floor} Floor, Wing {visitor.area.wing}</p>
                </div>
              </div>
            </div>

            {/* QR Code placeholder */}
            <div className="mt-4 flex items-center justify-center">
              <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50">
                <QrCode size={36} className="text-gray-300" />
                <p className="text-[10px] text-gray-400 mt-1">QR Code</p>
              </div>
            </div>

            {/* Footer */}
            <div className={`mt-3 text-center text-[10px] ${isRelative ? 'text-blue-500' : 'text-red-500'} font-medium`}>
              This pass must be returned at the exit gate. Valid for single day only.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-2">
          <Button variant="outline" className="flex-1" onClick={() => {}}>
            <Printer size={14} className="mr-2" /> Print Card
          </Button>
          <Button className="flex-1 bg-teal-600 hover:bg-teal-700" onClick={() => {}}>
            <Smartphone size={14} className="mr-2" /> Send Digital Pass
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function IdCardIssuance() {
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');

  const eligibleVisitors = VISITORS_DATA.filter((v) =>
    (v.approvalStatus === 'APPROVED') &&
    (filterType === 'all' || v.visitorType === filterType) &&
    (search === '' || v.name.toLowerCase().includes(search.toLowerCase()) || v.passId.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard size={18} className="text-teal-600" />
              ID Card Issuance
            </CardTitle>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search by name or pass ID..."
                className="w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="outsider">External (Red)</SelectItem>
                  <SelectItem value="relative">Relative (Blue)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eligibleVisitors.map((visitor) => {
              const isRelative = visitor.visitorType === 'relative';
              return (
                <div
                  key={visitor.id}
                  className={`border-2 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                    isRelative ? 'border-blue-200 hover:border-blue-400' : 'border-red-200 hover:border-red-400'
                  }`}
                  onClick={() => setSelectedVisitor(visitor)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isRelative ? 'bg-blue-100' : 'bg-red-100'
                      }`}>
                        <User size={18} className={isRelative ? 'text-blue-600' : 'text-red-600'} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{visitor.name}</p>
                        <p className="text-xs text-gray-500">{visitor.company}</p>
                      </div>
                    </div>
                    <Badge className={isRelative ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}>
                      {isRelative ? 'Relative' : 'External'}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-gray-500">
                    <p>Pass: <span className="font-mono font-medium text-gray-700">{visitor.passId}</span></p>
                    <p>Host: {visitor.hostEmployee}</p>
                    <p>Area: {visitor.area.building}, {visitor.area.floor} Floor</p>
                    <p>Valid: {visitor.expectedEntry} — {visitor.expectedExit}</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={(e) => { e.stopPropagation(); setSelectedVisitor(visitor); }}
                    >
                      <QrCode size={12} className="mr-1" /> View Card
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Printer size={12} className="mr-1" /> Print
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          {eligibleVisitors.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <CreditCard size={40} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No approved visitors match your search</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedVisitor && (
        <VisitorIDCard visitor={selectedVisitor} onClose={() => setSelectedVisitor(null)} />
      )}
    </>
  );
}
