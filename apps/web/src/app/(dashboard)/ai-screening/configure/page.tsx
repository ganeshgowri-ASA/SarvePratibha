'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Bot,
  Save,
  Volume2,
  Globe,
  Settings,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export default function ConfigureAssistantPage() {
  const [provider, setProvider] = useState('VAPI');
  const [language, setLanguage] = useState('en');
  const [maxDuration, setMaxDuration] = useState(900);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="h-6 w-6 text-teal-600" />
            Configure AI Assistant
          </h1>
          <p className="text-gray-500 mt-1">Set up voice provider, personality, and evaluation criteria</p>
        </div>
        <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">
          {saved ? <CheckCircle className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          {saved ? 'Saved!' : 'Save Configuration'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voice Provider */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-teal-600" />
              Voice Provider
            </CardTitle>
            <CardDescription>Select the AI voice provider for screening calls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select value={provider} onValueChange={(value) => setProvider(value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="VAPI">Vapi.ai - Conversational AI</SelectItem>
                  <SelectItem value="RETELL">Retell AI - Phone Screening</SelectItem>
                  <SelectItem value="ELEVENLABS">ElevenLabs - Natural TTS</SelectItem>
                  <SelectItem value="SARVAM">Sarvam AI - Indian Languages</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {provider === 'VAPI' && 'Full conversational AI with phone calling capabilities. Best for end-to-end automated screening.'}
                {provider === 'RETELL' && 'Specialized for phone call automation. Good for high-volume screening.'}
                {provider === 'ELEVENLABS' && 'Industry-leading text-to-speech with natural voices. Pair with STT provider.'}
                {provider === 'SARVAM' && 'Specialized in Indian languages including Hindi, Tamil, Telugu, Kannada, and more.'}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Voice ID (Optional)</Label>
              <Input placeholder="Enter voice ID from provider" />
              <p className="text-xs text-gray-500">Leave blank to use default voice</p>
            </div>

            <div className="space-y-2">
              <Label>API Key Status</Label>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">Not Configured</Badge>
                <span className="text-xs text-gray-500">Set {provider}_API_KEY in environment variables</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-teal-600" />
              Language Settings
            </CardTitle>
            <CardDescription>Configure language support for screenings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Primary Language</Label>
              <Select value={language} onValueChange={(value) => setLanguage(value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="ta">Tamil</SelectItem>
                  <SelectItem value="te">Telugu</SelectItem>
                  <SelectItem value="kn">Kannada</SelectItem>
                  <SelectItem value="ml">Malayalam</SelectItem>
                  <SelectItem value="bn">Bengali</SelectItem>
                  <SelectItem value="mr">Marathi</SelectItem>
                  <SelectItem value="gu">Gujarati</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Supported Languages</Label>
              <div className="flex flex-wrap gap-2">
                {['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'].map((lang) => (
                  <Badge key={lang} variant="secondary" className="bg-teal-50 text-teal-700 cursor-pointer hover:bg-teal-100">
                    {lang}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-500">Click to toggle language support. Requires Sarvam AI for Indian languages.</p>
            </div>

            <div className="space-y-2">
              <Label>Max Call Duration: {Math.floor(maxDuration / 60)} minutes</Label>
              <Slider
                min={300}
                max={3600}
                step={60}
                value={maxDuration}
                onChange={(e) => setMaxDuration(Number(e.target.value))}
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>5 min</span>
                <span>60 min</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personality & Context */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="h-5 w-5 text-teal-600" />
              AI Personality
            </CardTitle>
            <CardDescription>Define the assistant's behavior and tone</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Assistant Name</Label>
              <Input defaultValue="AI Screening Assistant" />
            </div>

            <div className="space-y-2">
              <Label>Personality Prompt</Label>
              <Textarea
                rows={4}
                defaultValue="You are a professional, friendly, and thorough AI interviewer for SarvePratibha Technologies. You conduct screening interviews in a conversational manner. Be encouraging but fair in your assessment. Ask follow-up questions when responses are vague."
                placeholder="Describe how the AI should behave during screenings..."
              />
            </div>

            <div className="space-y-2">
              <Label>Company Context</Label>
              <Textarea
                rows={4}
                placeholder="Provide information about your company culture, values, and what you look for in candidates..."
                defaultValue="SarvePratibha Technologies is a leading enterprise HRMS company. We value innovation, collaboration, and continuous learning. We look for candidates who are technically strong, good communicators, and aligned with our mission to transform HR management."
              />
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Criteria */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-teal-600" />
              Evaluation Criteria
            </CardTitle>
            <CardDescription>Define scoring weights for different assessment areas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Technical Skills', defaultValue: 30 },
              { label: 'Communication', defaultValue: 20 },
              { label: 'Cultural Fit', defaultValue: 20 },
              { label: 'Problem Solving', defaultValue: 15 },
              { label: 'Confidence & Clarity', defaultValue: 15 },
            ].map((criteria) => (
              <div key={criteria.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">{criteria.label}</Label>
                  <span className="text-sm font-medium text-teal-600">{criteria.defaultValue}%</span>
                </div>
                <Slider
                  min={0}
                  max={50}
                  step={5}
                  defaultValue={criteria.defaultValue}
                />
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Weight</span>
              <span className="text-sm font-bold text-teal-600">100%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
