'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NewRequisitionPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In production, send to /api/recruitment/requisition
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      departmentId: formData.get('departmentId'),
      designationId: formData.get('designationId') || undefined,
      description: formData.get('description'),
      requirements: formData.get('requirements') || undefined,
      skills,
      location: formData.get('location') || undefined,
      positions: Number(formData.get('positions')),
      minExp: formData.get('minExp') ? Number(formData.get('minExp')) : undefined,
      maxExp: formData.get('maxExp') ? Number(formData.get('maxExp')) : undefined,
      minSalary: formData.get('minSalary') ? Number(formData.get('minSalary')) : undefined,
      maxSalary: formData.get('maxSalary') ? Number(formData.get('maxSalary')) : undefined,
      employmentType: formData.get('employmentType'),
      priority: formData.get('priority'),
      closingDate: formData.get('closingDate') || undefined,
    };

    console.log('Submitting requisition:', data);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/recruitment/requisitions');
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/recruitment/requisitions">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Job Requisition</h1>
          <p className="text-gray-500 mt-1">Create a new hiring requisition for approval</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input id="title" name="title" placeholder="e.g. Senior Software Engineer" required />
              </div>
              <div>
                <Label htmlFor="departmentId">Department *</Label>
                <Select>
                  <SelectTrigger id="departmentId"><SelectValue placeholder="Select Department" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dept1">Engineering</SelectItem>
                    <SelectItem value="dept2">Product</SelectItem>
                    <SelectItem value="dept3">Design</SelectItem>
                    <SelectItem value="dept4">Marketing</SelectItem>
                    <SelectItem value="dept5">HR</SelectItem>
                    <SelectItem value="dept6">Finance</SelectItem>
                    <SelectItem value="dept7">Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="designationId">Designation</Label>
                <Select>
                  <SelectTrigger id="designationId"><SelectValue placeholder="Select Designation" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="des1">Junior Engineer</SelectItem>
                    <SelectItem value="des2">Software Engineer</SelectItem>
                    <SelectItem value="des3">Senior Engineer</SelectItem>
                    <SelectItem value="des4">Lead Engineer</SelectItem>
                    <SelectItem value="des5">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="employmentType">Employment Type *</Label>
                <Select defaultValue="FULL_TIME">
                  <SelectTrigger id="employmentType"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="INTERN">Intern</SelectItem>
                    <SelectItem value="CONSULTANT">Consultant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="e.g. Bangalore" />
              </div>
              <div>
                <Label htmlFor="positions">Number of Positions *</Label>
                <Input id="positions" name="positions" type="number" min="1" defaultValue="1" required />
              </div>
              <div>
                <Label htmlFor="priority">Priority *</Label>
                <Select defaultValue="MEDIUM">
                  <SelectTrigger id="priority"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="closingDate">Closing Date</Label>
                <Input id="closingDate" name="closingDate" type="date" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the role, responsibilities, and expectations..."
                rows={5}
                required
              />
            </div>
            <div>
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                name="requirements"
                placeholder="Required qualifications, certifications, etc."
                rows={4}
              />
            </div>
            <div>
              <Label>Skills</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a skill..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" variant="outline" onClick={addSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200"
                    >
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Salary & Experience */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Compensation & Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minExp">Min Experience (years)</Label>
                <Input id="minExp" name="minExp" type="number" min="0" step="0.5" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="maxExp">Max Experience (years)</Label>
                <Input id="maxExp" name="maxExp" type="number" min="0" step="0.5" placeholder="10" />
              </div>
              <div>
                <Label htmlFor="minSalary">Min Salary (Annual, INR)</Label>
                <Input id="minSalary" name="minSalary" type="number" min="0" placeholder="e.g. 800000" />
              </div>
              <div>
                <Label htmlFor="maxSalary">Max Salary (Annual, INR)</Label>
                <Input id="maxSalary" name="maxSalary" type="number" min="0" placeholder="e.g. 1500000" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link href="/recruitment/requisitions">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" variant="outline" disabled={isSubmitting}>
            Save as Draft
          </Button>
          <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
          </Button>
        </div>
      </form>
    </div>
  );
}
