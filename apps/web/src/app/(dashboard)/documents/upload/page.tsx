'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText } from 'lucide-react';

export default function DocumentUploadPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Document</h1>
        <p className="text-sm text-gray-500">Upload and categorize a new document</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Document Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Document title" />
          </div>
          <div>
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" placeholder="Brief description of the document" />
          </div>
          <div>
            <Label>Category</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hr">HR Policies</SelectItem>
                <SelectItem value="it">IT Documents</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="training">Training Materials</SelectItem>
                <SelectItem value="templates">Templates</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tags</Label>
            <Input placeholder="Add tags separated by commas" />
          </div>
          <div>
            <Label>File</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors cursor-pointer">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Drag and drop or click to upload</p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOCX, XLSX, PPTX up to 25MB</p>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Upload size={16} className="mr-2" /> Upload Document
            </Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
