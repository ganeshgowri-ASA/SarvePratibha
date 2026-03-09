'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Download, FileSpreadsheet, CheckCircle } from 'lucide-react';

const EXPORT_MODULES = ['Employees', 'Departments', 'Designations', 'Locations', 'Leave Requests', 'Attendance', 'Payroll', 'Claims', 'Users', 'Audit Logs'];
const EXPORT_FORMATS = ['CSV', 'XLSX', 'JSON'];

export default function DataExportPage() {
  const [selectedModule, setSelectedModule] = useState('');
  const [format, setFormat] = useState('CSV');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [exportResult, setExportResult] = useState<any>(null);

  const exportMutation = useMutation({
    mutationFn: () =>
      api.post('/api/admin/data/export', {
        module: selectedModule,
        format,
        filters: {
          ...(dateFrom ? { from: dateFrom } : {}),
          ...(dateTo ? { to: dateTo } : {}),
        },
      }),
    onSuccess: (data) => setExportResult(data),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Export</h1>
        <p className="text-gray-500 mt-1">Export system data in various formats</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Export Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Module</Label>
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger><SelectValue placeholder="Select module" /></SelectTrigger>
                <SelectContent>
                  {EXPORT_MODULES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EXPORT_FORMATS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>From Date (optional)</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>To Date (optional)</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>

          <Button
            onClick={() => exportMutation.mutate()}
            className="bg-teal-600 hover:bg-teal-700"
            disabled={!selectedModule || exportMutation.isPending}
          >
            <Download className="h-4 w-4 mr-2" />
            {exportMutation.isPending ? 'Generating...' : 'Export Data'}
          </Button>
        </CardContent>
      </Card>

      {exportResult && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold">Export Started</h3>
                <p className="text-sm text-gray-500">{exportResult.message}</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
              <FileSpreadsheet className="h-5 w-5 text-teal-600" />
              <div>
                <p className="text-sm font-medium">{selectedModule} export</p>
                <p className="text-xs text-gray-500">Format: {format}</p>
              </div>
              <Badge className="ml-auto bg-blue-100 text-blue-800">{exportResult.data?.status}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Info */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Available Exports</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {EXPORT_MODULES.map((mod) => (
              <div key={mod} className="flex items-center gap-2 p-3 border rounded-lg">
                <FileSpreadsheet className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{mod}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
