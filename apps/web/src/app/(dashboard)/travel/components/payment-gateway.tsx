'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  CreditCard,
  Smartphone,
  CheckCircle,
  Shield,
  Lock,
  RefreshCw,
  Zap,
  Building2,
  IndianRupee,
  AlertCircle,
  QrCode,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type PaymentMethod = 'phonepe' | 'paytm' | 'upi' | 'card' | 'netbanking' | 'corporate';
type PaymentState = 'idle' | 'processing' | 'otp' | 'success' | 'failed';

interface PendingPayment {
  id: string;
  type: string;
  description: string;
  amount: number;
  dueDate: string;
}

const PENDING_PAYMENTS: PendingPayment[] = [
  {
    id: 'PAY-001',
    type: 'Flight',
    description: 'IndiGo 6E-2341 • BLR→BOM • 15 Mar 2026',
    amount: 4850,
    dueDate: '2026-03-12',
  },
  {
    id: 'PAY-002',
    type: 'Hotel',
    description: 'Trident Nariman Point • 2 nights • 15–17 Mar',
    amount: 17000,
    dueDate: '2026-03-13',
  },
  {
    id: 'PAY-003',
    type: 'Cab',
    description: 'Ola Sedan • Office → Airport • 15 Mar',
    amount: 260,
    dueDate: '2026-03-15',
  },
];

const METHOD_CONFIG: Record<PaymentMethod, { label: string; logo: string; color: string; description: string }> = {
  phonepe: {
    label: 'PhonePe',
    logo: '📱',
    color: 'border-purple-300 bg-purple-50 hover:border-purple-500',
    description: 'Pay via PhonePe UPI or wallet',
  },
  paytm: {
    label: 'Paytm',
    logo: '💳',
    color: 'border-blue-300 bg-blue-50 hover:border-blue-500',
    description: 'Paytm wallet or UPI',
  },
  upi: {
    label: 'UPI / BHIM',
    logo: '🏦',
    color: 'border-teal-300 bg-teal-50 hover:border-teal-500',
    description: 'Any UPI ID (GPay, BHIM, etc.)',
  },
  card: {
    label: 'Credit / Debit Card',
    logo: '🪙',
    color: 'border-gray-300 bg-gray-50 hover:border-gray-500',
    description: 'Visa, Mastercard, RuPay',
  },
  netbanking: {
    label: 'Net Banking',
    logo: '🏢',
    color: 'border-orange-300 bg-orange-50 hover:border-orange-500',
    description: 'All major Indian banks',
  },
  corporate: {
    label: 'Corporate Account',
    logo: '🏛️',
    color: 'border-green-300 bg-green-50 hover:border-green-500',
    description: 'Charge to company travel wallet',
  },
};

const BANKS = ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'Yes Bank', 'PNB', 'Canara Bank'];

export function PaymentGateway() {
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [upiId, setUpiId] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [payState, setPayState] = useState<PaymentState>('idle');
  const [progress, setProgress] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const handlePay = () => {
    if (!selectedPayment || !method) return;
    setPayState('processing');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 80) {
          clearInterval(interval);
          if (method === 'phonepe' || method === 'paytm' || method === 'upi') {
            setPayState('otp');
          } else {
            completePayment();
          }
          return 80;
        }
        return p + 10;
      });
    }, 200);
  };

  const completePayment = () => {
    setPayState('success');
    setProgress(100);
    if (selectedPayment) {
      setCompletedIds((prev) => [...prev, selectedPayment.id]);
    }
    setTimeout(() => {
      setPayState('idle');
      setProgress(0);
      setSelectedPayment(null);
      setMethod(null);
      setOtpValue('');
    }, 4000);
  };

  const handleOtpVerify = () => {
    if (otpValue.length >= 4) {
      setProgress(100);
      completePayment();
    }
  };

  const pendingCount = PENDING_PAYMENTS.filter((p) => !completedIds.includes(p.id)).length;
  const totalPending = PENDING_PAYMENTS.filter((p) => !completedIds.includes(p.id))
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-4">
      {/* Header summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <IndianRupee size={18} className="text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-orange-700">Pending Payments</p>
                <p className="text-xl font-bold text-orange-900">₹{totalPending.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-green-700">Paid This Month</p>
                <p className="text-xl font-bold text-green-900">₹42,200</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-100">
                <Building2 size={18} className="text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-teal-700">Corporate Wallet</p>
                <p className="text-xl font-bold text-teal-900">₹75,000</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pending payments list */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard size={18} className="text-teal-600" />
              Pending Payments
              {pendingCount > 0 && (
                <Badge className="bg-orange-100 text-orange-700">{pendingCount}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {PENDING_PAYMENTS.map((payment) => {
              const isDone = completedIds.includes(payment.id);
              return (
                <div
                  key={payment.id}
                  className={cn(
                    'border rounded-lg p-3 transition-all',
                    isDone
                      ? 'bg-green-50 border-green-200 opacity-75'
                      : 'bg-white hover:shadow-sm cursor-pointer',
                    selectedPayment?.id === payment.id && !isDone && 'border-teal-400 ring-1 ring-teal-300'
                  )}
                  onClick={() => !isDone && setSelectedPayment(payment)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge variant="outline" className="text-xs">{payment.type}</Badge>
                        <span className="text-xs font-mono text-gray-400">{payment.id}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{payment.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Due: {payment.dueDate}</p>
                    </div>
                    <div className="text-right ml-3">
                      <p className="text-base font-bold text-gray-900">
                        ₹{payment.amount.toLocaleString()}
                      </p>
                      {isDone ? (
                        <Badge className="bg-green-100 text-green-700 text-xs mt-1">
                          <CheckCircle size={10} className="mr-1" />Paid
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-teal-600 hover:bg-teal-700 mt-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPayment(payment);
                          }}
                        >
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {pendingCount === 0 && (
              <div className="text-center py-6 text-gray-500">
                <CheckCircle size={32} className="mx-auto mb-2 text-green-500" />
                <p className="text-sm">All payments are up to date!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment gateway */}
        <div className="space-y-4">
          {selectedPayment && payState === 'idle' && (
            <>
              {/* Amount summary */}
              <Card className="border-teal-200">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Paying for</p>
                      <p className="text-sm font-medium text-gray-900">{selectedPayment.description}</p>
                    </div>
                    <p className="text-2xl font-bold text-teal-700">
                      ₹{selectedPayment.amount.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment methods */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lock size={14} className="text-teal-600" />
                    Choose Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.entries(METHOD_CONFIG) as [PaymentMethod, typeof METHOD_CONFIG[PaymentMethod]][]).map(
                      ([key, cfg]) => (
                        <button
                          key={key}
                          onClick={() => setMethod(key)}
                          className={cn(
                            'text-left p-3 rounded-lg border-2 transition-all',
                            cfg.color,
                            method === key && 'ring-2 ring-teal-400'
                          )}
                        >
                          <p className="text-lg mb-1">{cfg.logo}</p>
                          <p className="text-xs font-semibold text-gray-900">{cfg.label}</p>
                          <p className="text-xs text-gray-500">{cfg.description}</p>
                        </button>
                      )
                    )}
                  </div>

                  {/* Dynamic input based on method */}
                  {method === 'upi' || method === 'phonepe' || method === 'paytm' ? (
                    <div className="space-y-2 pt-2 border-t">
                      <Label className="text-xs">UPI ID</Label>
                      <Input
                        placeholder="name@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                      {method === 'phonepe' && (
                        <div className="flex items-center justify-center gap-3 py-3 border-2 border-dashed border-purple-200 rounded-lg">
                          <QrCode size={40} className="text-purple-400" />
                          <div>
                            <p className="text-xs font-medium text-purple-700">Scan with PhonePe</p>
                            <p className="text-xs text-gray-400">QR code placeholder</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : method === 'card' ? (
                    <div className="space-y-2 pt-2 border-t">
                      <div>
                        <Label className="text-xs">Card Number</Label>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          maxLength={19}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Cardholder Name</Label>
                        <Input
                          placeholder="Name as on card"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Expiry</Label>
                          <Input
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">CVV</Label>
                          <Input
                            placeholder="•••"
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            maxLength={3}
                          />
                        </div>
                      </div>
                    </div>
                  ) : method === 'netbanking' ? (
                    <div className="pt-2 border-t">
                      <Label className="text-xs mb-2 block">Select Bank</Label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {BANKS.map((bank) => (
                          <button
                            key={bank}
                            onClick={() => setSelectedBank(bank)}
                            className={cn(
                              'text-xs p-2 rounded border text-center transition-all',
                              selectedBank === bank
                                ? 'bg-teal-600 text-white border-teal-600'
                                : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-teal-300'
                            )}
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : method === 'corporate' ? (
                    <div className="pt-2 border-t">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-green-800">Corporate Travel Wallet</p>
                        <p className="text-xs text-green-700 mt-1">Balance: ₹75,000 available</p>
                        <p className="text-xs text-green-600 mt-1">
                          Booking will be charged to your department&apos;s travel budget
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <Separator />

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Shield size={12} className="text-green-500" />
                    256-bit SSL encrypted · PCI-DSS compliant
                  </div>

                  <Button
                    className="w-full bg-teal-600 hover:bg-teal-700"
                    disabled={!method}
                    onClick={handlePay}
                  >
                    <Lock size={14} className="mr-2" />
                    Pay ₹{selectedPayment.amount.toLocaleString()} Securely
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* Processing state */}
          {(payState === 'processing' || payState === 'otp') && (
            <Card className="border-blue-200">
              <CardContent className="pt-6 pb-6 space-y-4">
                {payState === 'processing' ? (
                  <>
                    <div className="flex flex-col items-center gap-3 py-4">
                      <RefreshCw size={36} className="text-teal-600 animate-spin" />
                      <p className="text-sm font-medium text-gray-800">Processing Payment...</p>
                      <p className="text-xs text-gray-500">
                        {method === 'corporate'
                          ? 'Charging corporate account...'
                          : 'Connecting to payment gateway...'}
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Smartphone size={32} className="mx-auto text-purple-500 mb-2" />
                      <p className="text-sm font-semibold text-gray-900">Enter OTP</p>
                      <p className="text-xs text-gray-500 mt-1">
                        A 6-digit OTP has been sent to your registered mobile number
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs">OTP</Label>
                      <Input
                        placeholder="Enter 6-digit OTP"
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value)}
                        maxLength={6}
                        className="text-center text-lg tracking-widest font-mono"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-teal-600 hover:bg-teal-700"
                        onClick={handleOtpVerify}
                        disabled={otpValue.length < 4}
                      >
                        Verify & Pay
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Resend OTP
                      </Button>
                    </div>
                    <p className="text-center text-xs text-gray-400">OTP expires in 5:00 minutes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Success state */}
          {payState === 'success' && (
            <Card className="border-green-300 bg-green-50">
              <CardContent className="pt-6 pb-6 text-center space-y-3">
                <CheckCircle size={48} className="mx-auto text-green-500" />
                <p className="text-lg font-bold text-green-800">Payment Successful!</p>
                <p className="text-sm text-green-700">
                  ₹{selectedPayment?.amount.toLocaleString()} paid successfully
                </p>
                <div className="bg-white rounded-lg p-3 text-xs space-y-1 text-left">
                  <p className="flex justify-between">
                    <span className="text-gray-500">Transaction ID</span>
                    <span className="font-mono font-medium">TXN{Date.now().toString().slice(-8)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Method</span>
                    <span>{method && METHOD_CONFIG[method]?.label}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="text-green-600 font-medium">SUCCESS</span>
                  </p>
                </div>
                <p className="text-xs text-green-600">Receipt sent to your registered email</p>
              </CardContent>
            </Card>
          )}

          {/* Idle - no selection */}
          {!selectedPayment && payState === 'idle' && (
            <Card className="border-dashed border-2 border-gray-200">
              <CardContent className="py-12 text-center">
                <CreditCard size={36} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">Select a pending payment to proceed</p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports PhonePe, Paytm, UPI, Cards, Net Banking & Corporate Account
                </p>
              </CardContent>
            </Card>
          )}

          {/* Recent transactions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { id: 'TXN92834561', desc: 'Train • BLR→HYD', amount: 1760, date: '8 Mar', method: 'UPI', status: 'SUCCESS' },
                { id: 'TXN82734120', desc: 'Hotel • Novotel Hyderabad', amount: 5200, date: '5 Mar', method: 'Corporate', status: 'SUCCESS' },
                { id: 'TXN71823450', desc: 'Cab • Uber Sedan', amount: 340, date: '5 Mar', method: 'PhonePe', status: 'SUCCESS' },
              ].map((txn) => (
                <div key={txn.id} className="flex items-center justify-between text-xs py-1.5 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-800">{txn.desc}</p>
                    <p className="text-gray-400 font-mono">{txn.id} · {txn.date} · {txn.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{txn.amount.toLocaleString()}</p>
                    <Badge className="bg-green-100 text-green-700 text-xs">{txn.status}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
