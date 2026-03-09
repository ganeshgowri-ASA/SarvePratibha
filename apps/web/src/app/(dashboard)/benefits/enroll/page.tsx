'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, UserPlus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function BenefitEnrollPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/benefits">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enroll in Benefits</h1>
          <p className="text-sm text-gray-500">Choose a plan and add your nominees</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <UserPlus size={18} className="text-teal-600" />
                Plan Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Benefit Plan</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a benefit plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health-gold">Health Insurance - Gold Plan</SelectItem>
                    <SelectItem value="health-silver">Health Insurance - Silver Plan</SelectItem>
                    <SelectItem value="dental">Dental Coverage</SelectItem>
                    <SelectItem value="vision">Vision Care Plus</SelectItem>
                    <SelectItem value="life">Life Insurance - 20x</SelectItem>
                    <SelectItem value="wellness">Wellness Program</SelectItem>
                    <SelectItem value="education">Education Assistance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Nominees / Family Members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">Nominee 1</p>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input placeholder="Full name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Percentage (%)</Label>
                    <Input type="number" placeholder="100" />
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Plus size={16} className="mr-2" /> Add Nominee
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-base">Enrollment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Selected Plan</span>
                  <span className="font-medium">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Monthly Premium</span>
                  <span className="font-medium">&#8377;0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Employer Contribution</span>
                  <span className="font-medium text-green-600">&#8377;0</span>
                </div>
                <hr />
                <div className="flex justify-between">
                  <span className="text-gray-500">Your Contribution</span>
                  <span className="font-bold text-gray-900">&#8377;0/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Nominees</span>
                  <span className="font-medium">0</span>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full bg-teal-600 hover:bg-teal-700">Confirm Enrollment</Button>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Enrollment will be effective from the selected start date
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
