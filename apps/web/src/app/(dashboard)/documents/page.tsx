'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Upload, Search, FolderOpen, Download, Eye, PenTool, Clock } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  { id: '1', name: 'HR Policies', count: 12, icon: '📋' },
  { id: '2', name: 'IT Documents', count: 8, icon: '💻' },
  { id: '3', name: 'Finance', count: 6, icon: '💰' },
  { id: '4', name: 'Training Materials', count: 15, icon: '📚' },
  { id: '5', name: 'Templates', count: 10, icon: '📄' },
  { id: '6', name: 'Legal', count: 5, icon: '⚖️' },
];

const RECENT_DOCS = [
  { id: '1', title: 'Employee Handbook 2026', category: 'HR Policies', fileName: 'employee-handbook-2026.pdf', fileSize: '2.4 MB', uploadedBy: 'HR Admin', versions: 3, signatures: 0, createdAt: '2026-02-15' },
  { id: '2', title: 'NDA Template', category: 'Legal', fileName: 'nda-template-v3.docx', fileSize: '156 KB', uploadedBy: 'Legal Team', versions: 3, signatures: 12, createdAt: '2026-02-10' },
  { id: '3', title: 'Expense Report Form', category: 'Finance', fileName: 'expense-report-form.xlsx', fileSize: '45 KB', uploadedBy: 'Finance', versions: 2, signatures: 0, createdAt: '2026-01-20' },
  { id: '4', title: 'IT Security Guidelines', category: 'IT Documents', fileName: 'it-security-guidelines.pdf', fileSize: '1.8 MB', uploadedBy: 'IT Admin', versions: 4, signatures: 45, createdAt: '2026-01-15' },
  { id: '5', title: 'Offer Letter Template', category: 'Templates', fileName: 'offer-letter-template.docx', fileSize: '89 KB', uploadedBy: 'HR Admin', versions: 5, signatures: 0, createdAt: '2026-01-10' },
];

const PENDING_SIGNATURES = [
  { id: '1', title: 'Q1 Performance Acknowledgement', requestedBy: 'Manager', requestedAt: '2026-03-01' },
  { id: '2', title: 'Updated NDA Agreement', requestedBy: 'Legal', requestedAt: '2026-02-28' },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-sm text-gray-500">Upload, manage, and sign documents</p>
        </div>
        <div className="flex gap-2">
          <Link href="/documents/sign">
            <Button variant="outline">
              <PenTool size={16} className="mr-2" /> My Signatures
            </Button>
          </Link>
          <Link href="/documents/upload">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Upload size={16} className="mr-2" /> Upload
            </Button>
          </Link>
        </div>
      </div>

      {/* Pending Signatures Alert */}
      {PENDING_SIGNATURES.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <PenTool size={16} className="text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Pending Signatures ({PENDING_SIGNATURES.length})</span>
            </div>
            <div className="space-y-2">
              {PENDING_SIGNATURES.map((sig) => (
                <div key={sig.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">{sig.title}</p>
                    <p className="text-xs text-gray-500">Requested by {sig.requestedBy} on {sig.requestedAt}</p>
                  </div>
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Sign Now</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <Card key={cat.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-4 pb-4 text-center">
                <span className="text-2xl">{cat.icon}</span>
                <p className="text-sm font-medium text-gray-900 mt-1">{cat.name}</p>
                <p className="text-xs text-gray-500">{cat.count} docs</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input placeholder="Search documents..." className="pl-9" />
      </div>

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {RECENT_DOCS.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-xs">{doc.category}</Badge>
                      <span className="text-xs text-gray-400">{doc.fileName} | {doc.fileSize}</span>
                      <span className="text-xs text-gray-400">v{doc.versions}</span>
                      {doc.signatures > 0 && (
                        <span className="text-xs text-gray-400 flex items-center gap-0.5">
                          <PenTool size={10} /> {doc.signatures}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost"><Eye size={14} /></Button>
                  <Button size="sm" variant="ghost"><Download size={14} /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
