'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PenTool, Check, Clock, X, FileText, Eye } from 'lucide-react';

const PENDING_SIGS = [
  { id: '1', docTitle: 'Q1 Performance Acknowledgement', docFile: 'q1-perf-ack.pdf', requestedBy: 'John Manager', requestedAt: '2026-03-01', reason: 'Performance review acknowledgement' },
  { id: '2', docTitle: 'Updated NDA Agreement', docFile: 'nda-v3.pdf', requestedBy: 'Legal Team', requestedAt: '2026-02-28', reason: 'Annual NDA renewal' },
  { id: '3', docTitle: 'Benefits Change Form', docFile: 'benefits-change.pdf', requestedBy: 'HR Admin', requestedAt: '2026-02-25', reason: 'Benefits enrollment change' },
];

const COMPLETED_SIGS = [
  { id: '4', docTitle: 'Employment Contract Amendment', docFile: 'contract-amend.pdf', signedAt: '2026-02-20', status: 'SIGNED' },
  { id: '5', docTitle: 'IT Security Policy Acknowledgement', docFile: 'it-sec-ack.pdf', signedAt: '2026-01-15', status: 'SIGNED' },
  { id: '6', docTitle: 'Code of Conduct 2026', docFile: 'coc-2026.pdf', signedAt: '2026-01-05', status: 'SIGNED' },
];

export default function SignaturesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Signatures</h1>
        <p className="text-sm text-gray-500">Review and sign documents requiring your signature</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-1">
            <Clock size={14} /> Pending ({PENDING_SIGS.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-1">
            <Check size={14} /> Completed ({COMPLETED_SIGS.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-3 mt-4">
          {PENDING_SIGS.map((sig) => (
            <Card key={sig.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-50 rounded-lg">
                      <PenTool size={18} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{sig.docTitle}</p>
                      <p className="text-xs text-gray-500">
                        Requested by {sig.requestedBy} | {sig.requestedAt}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{sig.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye size={14} className="mr-1" /> View
                    </Button>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                      <PenTool size={14} className="mr-1" /> Sign
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <X size={14} className="mr-1" /> Decline
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3 mt-4">
          {COMPLETED_SIGS.map((sig) => (
            <Card key={sig.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Check size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{sig.docTitle}</p>
                      <p className="text-xs text-gray-500">Signed on {sig.signedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700">Signed</Badge>
                    <Button size="sm" variant="ghost">
                      <FileText size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
