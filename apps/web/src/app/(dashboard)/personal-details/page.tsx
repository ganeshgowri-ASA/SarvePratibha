'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';
import { UserCircle, Mail, Phone, Building2, Calendar, Edit } from 'lucide-react';

export default function PersonalDetailsPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personal Details</h1>
          <p className="text-sm text-gray-500">View and manage your personal information</p>
        </div>
        <Button variant="outline">
          <Edit size={16} className="mr-2" /> Edit Profile
        </Button>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-teal-600 text-white text-2xl">
                {session?.user?.name?.split(' ').map((n) => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900">{session?.user?.name || 'Employee'}</h2>
              <p className="text-gray-500">Senior Software Developer</p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                <Badge className="bg-teal-100 text-teal-700">EMP001</Badge>
                <Badge className="bg-green-100 text-green-700">Active</Badge>
                <Badge variant="secondary">Engineering</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UserCircle size={18} className="text-teal-600" /> Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ['Full Name', session?.user?.name || 'N/A'],
              ['Date of Birth', '15 Jan 1992'],
              ['Gender', 'Male'],
              ['Marital Status', 'Single'],
              ['Blood Group', 'O+'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 size={18} className="text-teal-600" /> Employment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ['Employee ID', 'EMP001'],
              ['Department', 'Engineering'],
              ['Designation', 'Senior Developer'],
              ['Date of Joining', '01 Apr 2021'],
              ['Reporting To', 'Vikram Patel'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail size={18} className="text-teal-600" /> Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ['Official Email', session?.user?.email || 'N/A'],
              ['Personal Email', 'john.doe.personal@gmail.com'],
              ['Phone', '+91 98765 43210'],
              ['Emergency Contact', '+91 98765 43211'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900 truncate ml-4">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar size={18} className="text-teal-600" /> Bank & Tax Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ['Bank Name', 'SBI'],
              ['Account No.', '****1234'],
              ['IFSC Code', 'SBIN00****'],
              ['PAN', 'ABCDE****F'],
              ['PF Number', 'MH/BOM/****'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
