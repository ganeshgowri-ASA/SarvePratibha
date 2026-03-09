'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, Receipt, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  { id: 'cat-travel', name: 'Travel', code: 'TRAVEL', maxAmount: 50000, requiresReceipt: true },
  { id: 'cat-medical', name: 'Medical', code: 'MEDICAL', maxAmount: 25000, requiresReceipt: true },
  { id: 'cat-food', name: 'Food & Entertainment', code: 'FOOD', maxAmount: 5000, requiresReceipt: true },
  { id: 'cat-comm', name: 'Communication', code: 'COMM', maxAmount: 3000, requiresReceipt: false },
  { id: 'cat-stationery', name: 'Stationery & Supplies', code: 'STATIONERY', maxAmount: 2000, requiresReceipt: true },
  { id: 'cat-other', name: 'Other', code: 'OTHER', maxAmount: 10000, requiresReceipt: true },
];

export default function SubmitReimbursementPage() {
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [incurredDate, setIncurredDate] = useState('');
  const [receiptName, setReceiptName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedCategory = CATEGORIES.find((c) => c.id === categoryId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptName(file.name);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Claim Submitted!</h2>
            <p className="text-sm text-gray-500 mb-6">
              Your reimbursement claim for ₹{parseInt(amount).toLocaleString('en-IN')} has been submitted for approval.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/payroll/reimbursements">
                <Button variant="outline">View Claims</Button>
              </Link>
              <Button
                className="bg-teal-600 hover:bg-teal-700"
                onClick={() => {
                  setSubmitted(false);
                  setCategoryId('');
                  setAmount('');
                  setDescription('');
                  setIncurredDate('');
                  setReceiptName('');
                }}
              >
                Submit Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/payroll/reimbursements">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Submit Reimbursement</h1>
          <p className="text-sm text-gray-500">File a new expense claim</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Receipt size={18} className="text-teal-600" />
            Claim Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={categoryId} onValueChange={(value) => setCategoryId(value)}>
                <SelectTrigger id="category"><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name} (Max: ₹{cat.maxAmount.toLocaleString('en-IN')})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                min={1}
                max={selectedCategory?.maxAmount}
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              {selectedCategory && (
                <p className="text-xs text-gray-500">
                  Maximum limit: ₹{selectedCategory.maxAmount.toLocaleString('en-IN')}
                </p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date of Expense *</Label>
              <Input
                id="date"
                type="date"
                value={incurredDate}
                onChange={(e) => setIncurredDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide details about the expense"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={500}
              />
              <p className="text-xs text-gray-500 text-right">{description.length}/500</p>
            </div>

            {/* Receipt Upload */}
            <div className="space-y-2">
              <Label htmlFor="receipt">
                Receipt / Bill {selectedCategory?.requiresReceipt ? '*' : '(Optional)'}
              </Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-teal-300 transition-colors">
                <input
                  id="receipt"
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleFileChange}
                  required={selectedCategory?.requiresReceipt}
                />
                <label htmlFor="receipt" className="cursor-pointer">
                  {receiptName ? (
                    <div className="flex items-center justify-center gap-2 text-teal-600">
                      <CheckCircle2 size={20} />
                      <span className="text-sm font-medium">{receiptName}</span>
                    </div>
                  ) : (
                    <>
                      <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click to upload receipt</p>
                      <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, PDF (Max 5MB)</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <Link href="/payroll/reimbursements">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                Submit Claim
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
