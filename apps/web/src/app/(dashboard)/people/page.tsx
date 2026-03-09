'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, Users } from 'lucide-react';

const MOCK_EMPLOYEES = [
  { name: 'Priya Sharma', id: 'EMP001', dept: 'Engineering', designation: 'Senior Developer', status: 'ACTIVE' },
  { name: 'Rahul Verma', id: 'EMP002', dept: 'Sales', designation: 'Sales Manager', status: 'ACTIVE' },
  { name: 'Anita Singh', id: 'EMP003', dept: 'HR', designation: 'HR Executive', status: 'ACTIVE' },
  { name: 'Vikram Patel', id: 'EMP004', dept: 'Engineering', designation: 'Tech Lead', status: 'ON_LEAVE' },
  { name: 'Deepa Nair', id: 'EMP005', dept: 'Finance', designation: 'Accountant', status: 'ACTIVE' },
];

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  ON_LEAVE: 'bg-yellow-100 text-yellow-700',
  ON_NOTICE: 'bg-orange-100 text-orange-700',
};

export default function PeoplePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">People Directory</h1>
          <p className="text-sm text-gray-500">Manage and view all employees</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Download size={16} className="mr-2" /> Export
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input placeholder="Search employees..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter size={16} className="mr-2" /> Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {MOCK_EMPLOYEES.map((emp) => (
              <div key={emp.id} className="flex items-center gap-4 py-3 hover:bg-gray-50 px-2 rounded-lg cursor-pointer">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-teal-100 text-teal-700 text-sm">
                    {emp.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                  <p className="text-xs text-gray-500">{emp.designation} &middot; {emp.dept}</p>
                </div>
                <span className="text-xs text-gray-400 hidden sm:block">{emp.id}</span>
                <Badge className={`text-[10px] ${STATUS_STYLES[emp.status] || ''}`}>
                  {emp.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
