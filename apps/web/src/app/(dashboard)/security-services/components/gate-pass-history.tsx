'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  History,
  Search,
  LogIn,
  LogOut,
  FileText,
  Filter,
} from 'lucide-react';
import { GATE_PASS_HISTORY } from './demo-data';

const ACTION_STYLES: Record<string, { bg: string; icon: typeof LogIn }> = {
  'Pass Generated': { bg: 'bg-blue-100 text-blue-700', icon: FileText },
  'Check-In': { bg: 'bg-green-100 text-green-700', icon: LogIn },
  'Check-Out': { bg: 'bg-orange-100 text-orange-700', icon: LogOut },
};

export function GatePassHistory() {
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterGate, setFilterGate] = useState('all');

  const filtered = GATE_PASS_HISTORY.filter((entry) => {
    if (search && !entry.visitorName.toLowerCase().includes(search.toLowerCase()) &&
        !entry.passId.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterAction !== 'all' && entry.action !== filterAction) return false;
    if (filterGate !== 'all' && entry.gate !== filterGate) return false;
    return true;
  });

  const gates = [...new Set(GATE_PASS_HISTORY.map((e) => e.gate).filter((g) => g !== '-'))];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <History size={18} className="text-teal-600" />
            Gate Pass History &amp; Audit Trail
          </CardTitle>
          <span className="text-xs text-gray-400">{GATE_PASS_HISTORY.length} entries</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by visitor name or pass ID..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="Pass Generated">Pass Generated</SelectItem>
                <SelectItem value="Check-In">Check-In</SelectItem>
                <SelectItem value="Check-Out">Check-Out</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterGate} onValueChange={setFilterGate}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Gates</SelectItem>
                {gates.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Audit table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Visitor</TableHead>
                <TableHead>Pass ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Gate</TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((entry) => {
                const style = ACTION_STYLES[entry.action] || { bg: 'bg-gray-100 text-gray-700', icon: FileText };
                const Icon = style.icon;
                return (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <span className="text-xs text-gray-600 whitespace-nowrap">{entry.timestamp}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-gray-900">{entry.visitorName}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs font-medium text-teal-700">{entry.passId}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${style.bg} gap-1`}>
                        <Icon size={10} />
                        {entry.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{entry.gate}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-600">{entry.performedBy}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-500 max-w-[200px] truncate block">
                        {entry.notes || '—'}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <History size={36} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No audit entries match your filters</p>
          </div>
        )}

        {/* Timeline summary */}
        <div className="mt-6 border-t pt-4">
          <p className="text-xs text-gray-500 font-medium mb-3">Recent Activity Timeline</p>
          <div className="space-y-3">
            {GATE_PASS_HISTORY.slice(0, 5).map((entry) => {
              const style = ACTION_STYLES[entry.action] || { bg: 'bg-gray-100 text-gray-700', icon: FileText };
              const Icon = style.icon;
              return (
                <div key={entry.id} className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-full ${style.bg} mt-0.5`}>
                    <Icon size={12} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{entry.visitorName}</span>
                      {' — '}
                      <span className="text-gray-600">{entry.action}</span>
                      {entry.gate !== '-' && <span className="text-gray-400"> at {entry.gate}</span>}
                    </p>
                    <p className="text-xs text-gray-400">{entry.timestamp} &middot; {entry.performedBy}</p>
                    {entry.notes && <p className="text-xs text-gray-500 mt-0.5">{entry.notes}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
