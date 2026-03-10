'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Camera,
  Upload,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { EMPLOYEES, DEPARTMENTS, BUILDINGS } from './demo-data';

interface VisitorRegistrationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VisitorRegistrationForm({ open, onOpenChange }: VisitorRegistrationFormProps) {
  const [step, setStep] = useState(1);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [hostSearch, setHostSearch] = useState('');
  const [approverSearch, setApproverSearch] = useState('');
  const [showHostDropdown, setShowHostDropdown] = useState(false);
  const [showApproverDropdown, setShowApproverDropdown] = useState(false);
  const [selectedHost, setSelectedHost] = useState('');
  const [selectedApprover, setSelectedApprover] = useState('');
  const [aadhaarValue, setAadhaarValue] = useState('');
  const [materials, setMaterials] = useState<{ type: string; description: string }[]>([]);
  const [newMaterialType, setNewMaterialType] = useState('');
  const [newMaterialDesc, setNewMaterialDesc] = useState('');
  const [hasVehicle, setHasVehicle] = useState(false);

  const building = BUILDINGS.find((b) => b.name === selectedBuilding);
  const filteredHosts = EMPLOYEES.filter((e) =>
    e.toLowerCase().includes(hostSearch.toLowerCase())
  );
  const filteredApprovers = EMPLOYEES.filter((e) =>
    e.toLowerCase().includes(approverSearch.toLowerCase())
  );

  const handleAadhaarChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 12);
    if (digits.length <= 4) {
      setAadhaarValue(digits);
    } else if (digits.length <= 8) {
      setAadhaarValue(`${digits.slice(0, 4)} ${digits.slice(4)}`);
    } else {
      setAadhaarValue(`${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`);
    }
  };

  const maskedAadhaar = aadhaarValue.length >= 13
    ? `XXXX XXXX ${aadhaarValue.slice(-4)}`
    : aadhaarValue;

  const addMaterial = () => {
    if (newMaterialType) {
      setMaterials([...materials, { type: newMaterialType, description: newMaterialDesc }]);
      setNewMaterialType('');
      setNewMaterialDesc('');
    }
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setStep(1);
    setSelectedBuilding('');
    setHostSearch('');
    setApproverSearch('');
    setSelectedHost('');
    setSelectedApprover('');
    setAadhaarValue('');
    setMaterials([]);
    setHasVehicle(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Plus size={16} className="mr-2" /> Register Visitor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register Visitor - Step {step} of 3</DialogTitle>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`h-2 rounded-full flex-1 ${s <= step ? 'bg-teal-600' : 'bg-gray-200'}`} />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mb-4">
          <span>Personal Details</span>
          <span>Visit Details</span>
          <span>Additional Info</span>
        </div>

        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Photo capture */}
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                <Camera size={28} className="text-gray-400" />
              </div>
              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  <Camera size={14} className="mr-2" /> Capture Photo
                </Button>
                <Button variant="outline" size="sm">
                  <Upload size={14} className="mr-2" /> Upload Photo
                </Button>
                <p className="text-xs text-gray-400">Webcam capture or upload JPG/PNG</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Visitor Name <span className="text-red-500">*</span></Label>
                <Input placeholder="Full name" />
              </div>
              <div>
                <Label>Phone <span className="text-red-500">*</span></Label>
                <Input placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="Email address" />
              </div>
              <div>
                <Label>Company / Organization <span className="text-red-500">*</span></Label>
                <Input placeholder="Company name" />
              </div>
            </div>

            {/* Aadhaar */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <Label className="text-sm font-medium">Aadhaar Card Verification</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label className="text-xs text-gray-500">Aadhaar Number</Label>
                  <Input
                    placeholder="XXXX XXXX XXXX"
                    value={aadhaarValue.length >= 13 ? maskedAadhaar : aadhaarValue}
                    onChange={(e) => handleAadhaarChange(e.target.value)}
                    maxLength={14}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {aadhaarValue.length >= 13 ? 'Masked for security' : 'Enter 12-digit Aadhaar number'}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Upload Aadhaar Photo</Label>
                  <div className="mt-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Upload size={14} className="mr-2" /> Upload Aadhaar Copy
                    </Button>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG or PDF (max 5MB)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setStep(2)}>
                Next: Visit Details
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Visit Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label>Purpose of Visit <span className="text-red-500">*</span></Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select purpose" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Area of Visit */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <Label className="text-sm font-medium">Area of Visit</Label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <div>
                  <Label className="text-xs text-gray-500">Building <span className="text-red-500">*</span></Label>
                  <Select onValueChange={setSelectedBuilding}>
                    <SelectTrigger><SelectValue placeholder="Building" /></SelectTrigger>
                    <SelectContent>
                      {BUILDINGS.map((b) => (
                        <SelectItem key={b.name} value={b.name}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Floor</Label>
                  <Select disabled={!building}>
                    <SelectTrigger><SelectValue placeholder="Floor" /></SelectTrigger>
                    <SelectContent>
                      {building?.floors.map((f) => (
                        <SelectItem key={f} value={f}>{f} Floor</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Wing</Label>
                  <Select disabled={!building}>
                    <SelectTrigger><SelectValue placeholder="Wing" /></SelectTrigger>
                    <SelectContent>
                      {building?.wings.map((w) => (
                        <SelectItem key={w} value={w}>Wing {w}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <Label>Division / Department <span className="text-red-500">*</span></Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Host Employee - autocomplete */}
            <div className="relative">
              <Label>Employee Host <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search employee..."
                  className="pl-9"
                  value={selectedHost || hostSearch}
                  onChange={(e) => {
                    setHostSearch(e.target.value);
                    setSelectedHost('');
                    setShowHostDropdown(true);
                  }}
                  onFocus={() => setShowHostDropdown(true)}
                />
              </div>
              {showHostDropdown && !selectedHost && hostSearch && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {filteredHosts.map((emp) => (
                    <button
                      key={emp}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={() => { setSelectedHost(emp); setShowHostDropdown(false); setHostSearch(''); }}
                    >
                      {emp}
                    </button>
                  ))}
                  {filteredHosts.length === 0 && (
                    <p className="px-3 py-2 text-sm text-gray-400">No employees found</p>
                  )}
                </div>
              )}
            </div>

            {/* Approver */}
            <div className="relative">
              <Label>Approver Name <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search approver..."
                  className="pl-9"
                  value={selectedApprover || approverSearch}
                  onChange={(e) => {
                    setApproverSearch(e.target.value);
                    setSelectedApprover('');
                    setShowApproverDropdown(true);
                  }}
                  onFocus={() => setShowApproverDropdown(true)}
                />
              </div>
              {showApproverDropdown && !selectedApprover && approverSearch && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {filteredApprovers.map((emp) => (
                    <button
                      key={emp}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={() => { setSelectedApprover(emp); setShowApproverDropdown(false); setApproverSearch(''); }}
                    >
                      {emp}
                    </button>
                  ))}
                  {filteredApprovers.length === 0 && (
                    <p className="px-3 py-2 text-sm text-gray-400">No employees found</p>
                  )}
                </div>
              )}
            </div>

            {/* Expected time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Expected Entry Time <span className="text-red-500">*</span></Label>
                <Input type="datetime-local" />
              </div>
              <div>
                <Label>Expected Exit Time <span className="text-red-500">*</span></Label>
                <Input type="datetime-local" />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setStep(3)}>
                Next: Additional Info
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Additional Info */}
        {step === 3 && (
          <div className="space-y-4">
            {/* Accompanied Materials */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <Label className="text-sm font-medium">Accompanied Materials Declaration</Label>
              <div className="grid grid-cols-5 gap-2 mt-3">
                <div className="col-span-2">
                  <Select value={newMaterialType} onValueChange={setNewMaterialType}>
                    <SelectTrigger><SelectValue placeholder="Material type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laptop">Laptop</SelectItem>
                      <SelectItem value="Documents">Documents</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Input
                    placeholder="Description / serial no."
                    value={newMaterialDesc}
                    onChange={(e) => setNewMaterialDesc(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm" onClick={addMaterial} className="h-10">
                  <Plus size={14} />
                </Button>
              </div>
              {materials.length > 0 && (
                <div className="mt-3 space-y-2">
                  {materials.map((m, i) => (
                    <div key={i} className="flex items-center justify-between bg-white px-3 py-2 rounded border text-sm">
                      <span><span className="font-medium">{m.type}</span> {m.description && `- ${m.description}`}</span>
                      <button onClick={() => removeMaterial(i)} className="text-gray-400 hover:text-red-500">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {materials.length === 0 && (
                <p className="text-xs text-gray-400 mt-2">No materials declared. Add items if the visitor carries any equipment or documents.</p>
              )}
            </div>

            {/* Vehicle Details */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <Checkbox
                  checked={hasVehicle}
                  onCheckedChange={(checked) => setHasVehicle(checked === true)}
                />
                <Label className="text-sm font-medium cursor-pointer">Visitor has a vehicle</Label>
              </div>
              {hasVehicle && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Vehicle Number</Label>
                    <Input placeholder="e.g., KA-01-AB-1234" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Vehicle Type</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="two-wheeler">Two Wheeler</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="auto">Auto Rickshaw</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            {/* Visitor Type */}
            <div>
              <Label>Visitor Category</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="outsider">External Visitor (Red Pass)</SelectItem>
                  <SelectItem value="relative">Employee Relative (Blue Pass)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-1">Determines the type of ID card issued</p>
            </div>

            {/* Additional notes */}
            <div>
              <Label>Additional Notes</Label>
              <Textarea placeholder="Any special requirements, accessibility needs, or notes..." />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button
                className="bg-teal-600 hover:bg-teal-700"
                onClick={() => {
                  onOpenChange(false);
                  resetForm();
                }}
              >
                Register & Generate Pass
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
