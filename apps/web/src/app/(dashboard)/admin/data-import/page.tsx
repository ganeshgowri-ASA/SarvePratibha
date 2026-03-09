'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const IMPORT_MODULES = ['Employees', 'Departments', 'Designations', 'Locations', 'Leave Balances', 'Payroll', 'Attendance'];

interface PreviewRow {
  [key: string]: string;
}

export default function DataImportPage() {
  const [selectedModule, setSelectedModule] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [importResult, setImportResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setImportResult(null);

    // Parse CSV preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter((l) => l.trim());
      if (lines.length === 0) return;

      const csvHeaders = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
      setHeaders(csvHeaders);

      const rows = lines.slice(1, 6).map((line) => {
        const values = line.split(',').map((v) => v.trim().replace(/"/g, ''));
        const row: PreviewRow = {};
        csvHeaders.forEach((h, i) => (row[h] = values[i] || ''));
        return row;
      });
      setPreview(rows);
    };
    reader.readAsText(selectedFile);
  };

  const importMutation = useMutation({
    mutationFn: () =>
      api.post('/api/admin/data/import', {
        module: selectedModule,
        fileName: file?.name || 'unknown.csv',
        totalRows: preview.length,
        columnMapping: headers.reduce((acc, h) => ({ ...acc, [h]: h }), {}),
      }),
    onSuccess: (data) => setImportResult(data),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Import</h1>
        <p className="text-gray-500 mt-1">Import bulk data from CSV files</p>
      </div>

      {/* Import Form */}
      <Card>
        <CardHeader><CardTitle>Upload Data File</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Module</Label>
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger><SelectValue placeholder="Select module" /></SelectTrigger>
                <SelectContent>
                  {IMPORT_MODULES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>CSV File</Label>
              <Input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
            </div>
          </div>

          {file && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <FileSpreadsheet className="h-5 w-5 text-teal-600" />
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      {preview.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Preview (first 5 rows)
              <Badge className="bg-blue-100 text-blue-800">{headers.length} columns</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {headers.map((h) => <TableHead key={h}>{h}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.map((row, idx) => (
                    <TableRow key={idx}>
                      {headers.map((h) => <TableCell key={h} className="text-sm">{row[h]}</TableCell>)}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Action */}
      {preview.length > 0 && selectedModule && (
        <div className="flex gap-3">
          <Button
            onClick={() => importMutation.mutate()}
            className="bg-teal-600 hover:bg-teal-700"
            disabled={importMutation.isPending}
          >
            <Upload className="h-4 w-4 mr-2" />
            {importMutation.isPending ? 'Importing...' : 'Start Import'}
          </Button>
          <Button variant="outline" onClick={() => { setFile(null); setPreview([]); setHeaders([]); }}>
            Clear
          </Button>
        </div>
      )}

      {/* Import Result */}
      {importResult && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">Import Started</h3>
            </div>
            <p className="text-sm text-gray-500">{importResult.message}</p>
            <Badge className="mt-2 bg-blue-100 text-blue-800">{importResult.data?.status}</Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
