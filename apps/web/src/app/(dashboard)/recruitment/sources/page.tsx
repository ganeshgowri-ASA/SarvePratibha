'use client';

import { useState } from 'react';
import {
  Globe,
  Upload,
  Check,
  AlertCircle,
  RefreshCw,
  Settings,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface SourcePlatform {
  name: string;
  type: string;
  isConnected: boolean;
  lastSync?: string;
  candidatesImported: number;
  hiredFromSource: number;
  color: string;
  description: string;
}

const PLATFORMS: SourcePlatform[] = [
  {
    name: 'Naukri',
    type: 'NAUKRI',
    isConnected: true,
    lastSync: '2026-03-08T14:30:00Z',
    candidatesImported: 52,
    hiredFromSource: 4,
    color: 'bg-blue-600',
    description: "India's #1 job portal. Import candidates directly from Naukri job postings.",
  },
  {
    name: 'LinkedIn',
    type: 'LINKEDIN',
    isConnected: true,
    lastSync: '2026-03-08T10:00:00Z',
    candidatesImported: 68,
    hiredFromSource: 6,
    color: 'bg-blue-700',
    description: 'Professional networking platform. Import candidates from LinkedIn Recruiter.',
  },
  {
    name: 'Indeed',
    type: 'INDEED',
    isConnected: false,
    candidatesImported: 20,
    hiredFromSource: 1,
    color: 'bg-purple-600',
    description: 'Global job search engine. Connect to import candidates from Indeed postings.',
  },
  {
    name: 'Glassdoor',
    type: 'GLASSDOOR',
    isConnected: false,
    candidatesImported: 6,
    hiredFromSource: 0,
    color: 'bg-green-600',
    description: 'Company reviews and job listings. Import candidates from Glassdoor applications.',
  },
];

export default function SourcesPage() {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<SourcePlatform | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recruitment Sources</h1>
        <p className="text-gray-500 mt-1">Connect job boards and import candidates from external platforms</p>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PLATFORMS.map((platform) => (
          <Card key={platform.type} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center`}>
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{platform.name}</CardTitle>
                    <div className="flex items-center gap-1 mt-0.5">
                      {platform.isConnected ? (
                        <Badge variant="default" className="text-xs bg-green-600">
                          <Check className="h-3 w-3 mr-0.5" /> Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-0.5" /> Not Connected
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">{platform.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-xl font-bold text-teal-600">{platform.candidatesImported}</p>
                  <p className="text-xs text-gray-500">Imported</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-xl font-bold text-green-600">{platform.hiredFromSource}</p>
                  <p className="text-xs text-gray-500">Hired</p>
                </div>
              </div>

              {platform.lastSync && (
                <p className="text-xs text-gray-400 mb-3">
                  Last synced: {new Date(platform.lastSync).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              )}

              <div className="flex gap-2">
                {platform.isConnected ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedPlatform(platform);
                        setShowImportDialog(true);
                      }}
                    >
                      <Upload className="h-3 w-3 mr-1" /> Import
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-3 w-3 mr-1" /> Sync
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <Button
                    className="flex-1 bg-teal-600 hover:bg-teal-700"
                    size="sm"
                    onClick={() => {
                      setSelectedPlatform(platform);
                      setShowConnectDialog(true);
                    }}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" /> Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Import Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Import Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Source</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Imported</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Hired</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {PLATFORMS.map((platform) => (
                  <tr key={platform.type} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{platform.name}</td>
                    <td className="px-4 py-3">
                      {platform.isConnected ? (
                        <Badge variant="default" className="text-xs bg-green-600">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Inactive</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">{platform.candidatesImported}</td>
                    <td className="px-4 py-3 text-right">{platform.hiredFromSource}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {platform.candidatesImported > 0
                        ? `${((platform.hiredFromSource / platform.candidatesImported) * 100).toFixed(1)}%`
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import from {selectedPlatform?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); setShowImportDialog(false); }}>
            <div className="space-y-4 py-4">
              <div>
                <Label>Job Posting (optional)</Label>
                <Select>
                  <option value="">Map to all openings</option>
                  <option value="jp1">Senior Software Engineer</option>
                  <option value="jp2">Product Manager</option>
                  <option value="jp3">UI/UX Designer</option>
                </Select>
                <p className="text-xs text-gray-400 mt-1">Optionally map imported candidates to a specific job posting</p>
              </div>
              <div>
                <Label>Paste Candidate Data (JSON/CSV)</Label>
                <Textarea
                  rows={6}
                  placeholder={`Paste candidate data in JSON format:
[
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "currentCompany": "TCS",
    "currentTitle": "SE",
    "totalExp": 5,
    "skills": ["React", "Node.js"]
  }
]`}
                />
              </div>
              <p className="text-xs text-gray-400">
                Duplicate candidates (matching email) will be skipped. New applications will be created for the selected job posting.
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowImportDialog(false)}>Cancel</Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">Import Candidates</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Connect Dialog */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect {selectedPlatform?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); setShowConnectDialog(false); }}>
            <div className="space-y-4 py-4">
              <div>
                <Label>API Key *</Label>
                <Input type="password" placeholder="Enter your API key" required />
              </div>
              <div>
                <Label>API Secret</Label>
                <Input type="password" placeholder="Enter your API secret (if required)" />
              </div>
              <p className="text-xs text-gray-400">
                Your credentials are encrypted and stored securely. You can find your API credentials in your {selectedPlatform?.name} recruiter account settings.
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowConnectDialog(false)}>Cancel</Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">Connect</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
