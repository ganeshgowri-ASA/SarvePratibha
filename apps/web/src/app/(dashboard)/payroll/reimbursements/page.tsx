'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Receipt, Plus, IndianRupee, Clock, CheckCircle2, XCircle, Eye } from 'lucide-react';
import Link from 'next/link';

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  SUBMITTED: 'bg-blue-100 text-blue-700',
  MANAGER_APPROVED: 'bg-yellow-100 text-yellow-700',
  FINANCE_APPROVED: 'bg-teal-100 text-teal-700',
  PAID: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

const MY_CLAIMS = [
  { id: '1', category: 'Travel', amount: 4500, date: '5 Mar 2026', description: 'Client visit - Pune', status: 'SUBMITTED', receipt: true },
  { id: '2', category: 'Medical', amount: 2200, date: '28 Feb 2026', description: 'Health checkup', status: 'MANAGER_APPROVED', receipt: true },
  { id: '3', category: 'Food', amount: 1800, date: '20 Feb 2026', description: 'Team lunch - project milestone', status: 'PAID', receipt: true },
  { id: '4', category: 'Travel', amount: 6000, date: '10 Feb 2026', description: 'Client visit - Delhi', status: 'PAID', receipt: true },
  { id: '5', category: 'Communication', amount: 500, date: '5 Feb 2026', description: 'Mobile recharge', status: 'REJECTED', receipt: false },
  { id: '6', category: 'Medical', amount: 3500, date: '15 Jan 2026', description: 'Dental treatment', status: 'PAID', receipt: true },
];

const PENDING_APPROVALS = [
  { id: '101', employee: 'Amit Verma', empId: 'SP-ENG-004', category: 'Travel', amount: 8500, date: '7 Mar 2026', description: 'Conference travel', department: 'Engineering' },
  { id: '102', employee: 'Sneha Gupta', empId: 'SP-ENG-005', category: 'Medical', amount: 4200, date: '5 Mar 2026', description: 'Eye checkup + glasses', department: 'Engineering' },
  { id: '103', employee: 'Rahul Singh', empId: 'SP-ENG-006', category: 'Food', amount: 2100, date: '3 Mar 2026', description: 'Working dinner - release prep', department: 'Engineering' },
];

function formatCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

const SUMMARY = {
  total: MY_CLAIMS.reduce((sum, c) => sum + c.amount, 0),
  pending: MY_CLAIMS.filter((c) => ['SUBMITTED', 'MANAGER_APPROVED'].includes(c.status)).reduce((sum, c) => sum + c.amount, 0),
  approved: MY_CLAIMS.filter((c) => c.status === 'PAID').reduce((sum, c) => sum + c.amount, 0),
  rejected: MY_CLAIMS.filter((c) => c.status === 'REJECTED').reduce((sum, c) => sum + c.amount, 0),
};

export default function ReimbursementsPage() {
  const [tab, setTab] = useState('my-claims');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/payroll">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reimbursements</h1>
            <p className="text-sm text-gray-500">Submit and track expense claims</p>
          </div>
        </div>
        <Link href="/payroll/reimbursements/submit">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus size={16} className="mr-2" /> New Claim
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <IndianRupee size={16} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Total Claims</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(SUMMARY.total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-yellow-500" />
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-lg font-bold text-yellow-700">{formatCurrency(SUMMARY.pending)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Approved/Paid</p>
                <p className="text-lg font-bold text-green-700">{formatCurrency(SUMMARY.approved)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <XCircle size={16} className="text-red-500" />
              <div>
                <p className="text-xs text-gray-500">Rejected</p>
                <p className="text-lg font-bold text-red-700">{formatCurrency(SUMMARY.rejected)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="my-claims" onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="my-claims">My Claims</TabsTrigger>
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
        </TabsList>

        {/* My Claims */}
        <TabsContent value="my-claims">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt size={18} className="text-teal-600" />
                Claims History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 text-gray-500 font-medium">Category</th>
                      <th className="pb-2 text-gray-500 font-medium">Description</th>
                      <th className="pb-2 text-gray-500 font-medium">Date</th>
                      <th className="pb-2 text-gray-500 font-medium text-right">Amount</th>
                      <th className="pb-2 text-gray-500 font-medium">Receipt</th>
                      <th className="pb-2 text-gray-500 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MY_CLAIMS.map((claim) => (
                      <tr key={claim.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 font-medium text-gray-900">{claim.category}</td>
                        <td className="py-3 text-gray-600">{claim.description}</td>
                        <td className="py-3 text-gray-600">{claim.date}</td>
                        <td className="py-3 text-right font-medium">{formatCurrency(claim.amount)}</td>
                        <td className="py-3">
                          {claim.receipt ? (
                            <Badge className="bg-green-50 text-green-700 text-xs">Attached</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-500 text-xs">Missing</Badge>
                          )}
                        </td>
                        <td className="py-3">
                          <Badge className={STATUS_STYLES[claim.status] || ''}>
                            {claim.status.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Approvals (Manager View) */}
        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock size={18} className="text-yellow-600" />
                Pending Approvals ({PENDING_APPROVALS.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {PENDING_APPROVALS.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-gray-900">{item.employee}</p>
                          <span className="text-xs text-gray-400">({item.empId})</span>
                          <Badge variant="outline" className="text-xs">{item.department}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{item.category} - {item.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="ghost" size="sm" className="text-gray-600 h-7">
                            <Eye size={14} className="mr-1" /> View
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 h-7">
                            Reject
                          </Button>
                          <Button size="sm" className="bg-teal-600 hover:bg-teal-700 h-7">
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
