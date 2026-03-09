'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Receipt, Plus, ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';

const EXPENSES = [
  { id: '1', category: 'Flight', description: 'Bangalore to Mumbai round trip', amount: '12,500', date: '15 Mar 2026', status: 'SUBMITTED', receipt: true },
  { id: '2', category: 'Hotel', description: 'Hotel Taj - 3 nights', amount: '18,000', date: '15 Mar 2026', status: 'SUBMITTED', receipt: true },
  { id: '3', category: 'Cab', description: 'Airport transfers', amount: '2,500', date: '15 Mar 2026', status: 'APPROVED', receipt: true },
  { id: '4', category: 'Meals', description: 'Per diem - 3 days', amount: '4,500', date: '15 Mar 2026', status: 'APPROVED', receipt: false },
];

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  SUBMITTED: 'bg-blue-100 text-blue-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  PAID: 'bg-teal-100 text-teal-700',
};

export default function TravelExpensesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/travel">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Travel Expenses</h1>
          <p className="text-sm text-gray-500">Submit and track expense reports for your trips</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt size={18} className="text-teal-600" />
                Expense Report
              </CardTitle>
              <div className="text-right">
                <p className="text-xs text-gray-500">Total Claimed</p>
                <p className="text-lg font-bold text-gray-900">&#8377;37,500</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-2 font-medium">Category</th>
                      <th className="pb-2 font-medium">Description</th>
                      <th className="pb-2 font-medium text-right">Amount</th>
                      <th className="pb-2 font-medium">Receipt</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {EXPENSES.map((exp) => (
                      <tr key={exp.id}>
                        <td className="py-3 font-medium text-gray-900">{exp.category}</td>
                        <td className="py-3 text-gray-600">{exp.description}</td>
                        <td className="py-3 text-right font-medium">&#8377;{exp.amount}</td>
                        <td className="py-3">
                          {exp.receipt ? (
                            <Badge className="bg-green-100 text-green-700">Attached</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-500">None</Badge>
                          )}
                        </td>
                        <td className="py-3">
                          <Badge className={STATUS_STYLES[exp.status] || ''}>{exp.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add Expense</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FLIGHT">Flight</SelectItem>
                    <SelectItem value="TRAIN">Train</SelectItem>
                    <SelectItem value="HOTEL">Hotel</SelectItem>
                    <SelectItem value="CAB">Cab/Transport</SelectItem>
                    <SelectItem value="MEALS">Meals</SelectItem>
                    <SelectItem value="PER_DIEM">Per Diem</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Brief description" />
              </div>
              <div className="space-y-2">
                <Label>Amount (&#8377;)</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Receipt</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
                  <Upload size={20} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500">Upload receipt (PDF/Image)</p>
                </div>
              </div>
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                <Plus size={16} className="mr-2" /> Add Expense
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
