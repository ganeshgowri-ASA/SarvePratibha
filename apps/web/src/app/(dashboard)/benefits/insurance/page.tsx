'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shield, Users, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';

const INSURANCE_POLICIES = [
  {
    id: '1',
    name: 'Group Health Insurance',
    policyNumber: 'GHI-2026-001',
    provider: 'Star Health Insurance',
    type: 'Health',
    coverageAmount: '10,00,000',
    premium: '14,400/year',
    startDate: '1 Apr 2025',
    endDate: '31 Mar 2026',
    isActive: true,
    members: [
      { name: 'Self', relation: 'Employee', dob: '15 May 1990' },
      { name: 'Priya Sharma', relation: 'Spouse', dob: '20 Aug 1992' },
      { name: 'Arjun Sharma', relation: 'Child', dob: '10 Jan 2020' },
    ],
  },
  {
    id: '2',
    name: 'Group Term Life Insurance',
    policyNumber: 'GTLI-2026-001',
    provider: 'ICICI Prudential',
    type: 'Life',
    coverageAmount: '50,00,000',
    premium: '9,600/year',
    startDate: '1 Apr 2025',
    endDate: '31 Mar 2026',
    isActive: true,
    members: [
      { name: 'Self', relation: 'Employee', dob: '15 May 1990' },
    ],
  },
  {
    id: '3',
    name: 'Group Personal Accident',
    policyNumber: 'GPA-2026-001',
    provider: 'HDFC Ergo',
    type: 'Accident',
    coverageAmount: '25,00,000',
    premium: '4,800/year',
    startDate: '1 Apr 2025',
    endDate: '31 Mar 2026',
    isActive: true,
    members: [
      { name: 'Self', relation: 'Employee', dob: '15 May 1990' },
    ],
  },
];

export default function InsurancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/benefits">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Insurance Details</h1>
          <p className="text-sm text-gray-500">View your insurance policies and covered members</p>
        </div>
      </div>

      <div className="space-y-6">
        {INSURANCE_POLICIES.map((policy) => (
          <Card key={policy.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-50 rounded-lg">
                    <Shield size={20} className="text-teal-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{policy.name}</CardTitle>
                    <p className="text-xs text-gray-500 mt-0.5">Policy: {policy.policyNumber} | {policy.provider}</p>
                  </div>
                </div>
                <Badge className={policy.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                  {policy.isActive ? 'Active' : 'Expired'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="text-sm font-medium">{policy.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Coverage</p>
                    <p className="text-sm font-medium">&#8377;{policy.coverageAmount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Valid Till</p>
                    <p className="text-sm font-medium">{policy.endDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Members</p>
                    <p className="text-sm font-medium">{policy.members.length}</p>
                  </div>
                </div>
              </div>

              {policy.members.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Covered Members</p>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-left">
                          <th className="px-4 py-2 font-medium text-gray-500">Name</th>
                          <th className="px-4 py-2 font-medium text-gray-500">Relationship</th>
                          <th className="px-4 py-2 font-medium text-gray-500">Date of Birth</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {policy.members.map((member, i) => (
                          <tr key={i}>
                            <td className="px-4 py-2 font-medium text-gray-900">{member.name}</td>
                            <td className="px-4 py-2 text-gray-600">{member.relation}</td>
                            <td className="px-4 py-2 text-gray-600">{member.dob}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm">Download Card</Button>
                <Button variant="outline" size="sm">Submit Claim</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
