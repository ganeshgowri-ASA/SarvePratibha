'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Moon, Mail, MessageSquare, BellRing, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { apiClient } from '@/lib/api';
import { NOTIFICATION_CATEGORIES, NOTIFICATION_CATEGORY_LABELS } from '@sarve-pratibha/shared';
import type { NotificationCategory, NotificationFrequency, QuietHoursSettings, ApiResponse } from '@sarve-pratibha/shared';

interface PreferenceRow {
  category: NotificationCategory;
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  frequency: NotificationFrequency;
}

interface PreferencesData {
  preferences: PreferenceRow[];
  quietHours: QuietHoursSettings;
}

const FREQUENCY_OPTIONS = [
  { value: 'INSTANT', label: 'Instant' },
  { value: 'DAILY_DIGEST', label: 'Daily Digest' },
  { value: 'WEEKLY_DIGEST', label: 'Weekly Digest' },
];

export default function NotificationPreferencesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<PreferenceRow[]>([]);
  const [quietHours, setQuietHours] = useState<QuietHoursSettings>({
    enabled: false,
    startTime: '22:00',
    endTime: '07:00',
    timezone: 'Asia/Kolkata',
  });

  const token = (session?.user as any)?.accessToken;
  const userId = (session?.user as any)?.id;

  const fetchPreferences = useCallback(async () => {
    if (!token || !userId) return;
    try {
      setLoading(true);
      const data = await apiClient<ApiResponse<PreferencesData>>(
        `/api/notifications/preferences/${userId}`,
        { token },
      );

      const existingPrefs = (data.data?.preferences || []) as PreferenceRow[];

      // Fill in defaults for any missing categories
      const allPrefs: PreferenceRow[] = NOTIFICATION_CATEGORIES.map((cat) => {
        const existing = existingPrefs.find((p) => p.category === cat);
        return existing || {
          category: cat,
          email: true,
          sms: false,
          push: true,
          inApp: true,
          frequency: 'INSTANT' as NotificationFrequency,
        };
      });

      setPreferences(allPrefs);
      if (data.data?.quietHours) {
        setQuietHours(data.data.quietHours);
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const handleToggle = (category: NotificationCategory, channel: 'email' | 'sms' | 'push' | 'inApp') => {
    setPreferences((prev) =>
      prev.map((p) =>
        p.category === category ? { ...p, [channel]: !p[channel] } : p,
      ),
    );
  };

  const handleFrequencyChange = (category: NotificationCategory, frequency: NotificationFrequency) => {
    setPreferences((prev) =>
      prev.map((p) =>
        p.category === category ? { ...p, frequency } : p,
      ),
    );
  };

  const handleSave = async () => {
    if (!token) return;
    try {
      setSaving(true);
      await apiClient('/api/notifications/preferences', {
        method: 'PUT',
        token,
        body: JSON.stringify({
          preferences: preferences.map((p) => ({
            category: p.category,
            email: p.email,
            sms: p.sms,
            push: p.push,
            inApp: p.inApp,
            frequency: p.frequency,
          })),
          quietHours,
        }),
      });
      alert('Preferences saved successfully!');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      alert('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading preferences...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notification Preferences</h1>
          <p className="text-sm text-gray-500 mt-0.5">Choose how and when you want to be notified</p>
        </div>
      </div>

      {/* Channel Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notification Channels</CardTitle>
          <CardDescription>Toggle notifications on or off for each category and channel</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Header row */}
          <div className="grid grid-cols-6 gap-4 pb-3 border-b border-gray-200 mb-4">
            <div className="col-span-2 text-sm font-semibold text-gray-700">Category</div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 justify-center">
              <Monitor size={14} />
              In-App
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 justify-center">
              <Mail size={14} />
              Email
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 justify-center">
              <MessageSquare size={14} />
              SMS
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 justify-center">
              <BellRing size={14} />
              Push
            </div>
          </div>

          {/* Preference rows */}
          <div className="space-y-4">
            {preferences.map((pref) => (
              <div key={pref.category} className="grid grid-cols-6 gap-4 items-center">
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-900">
                    {NOTIFICATION_CATEGORY_LABELS[pref.category]}
                  </p>
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={pref.inApp}
                    onCheckedChange={() => handleToggle(pref.category, 'inApp')}
                  />
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={pref.email}
                    onCheckedChange={() => handleToggle(pref.category, 'email')}
                  />
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={pref.sms}
                    onCheckedChange={() => handleToggle(pref.category, 'sms')}
                  />
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={pref.push}
                    onCheckedChange={() => handleToggle(pref.category, 'push')}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Frequency Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Delivery Frequency</CardTitle>
          <CardDescription>Choose how often you receive notification digests per category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {preferences.map((pref) => (
              <div key={pref.category} className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-900">
                  {NOTIFICATION_CATEGORY_LABELS[pref.category]}
                </span>
                <Select
                  value={pref.frequency}
                  onChange={(e) => handleFrequencyChange(pref.category, e.target.value as NotificationFrequency)}
                  className="w-40"
                >
                  {FREQUENCY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Moon size={18} />
                Quiet Hours
              </CardTitle>
              <CardDescription>Pause notifications during specific hours</CardDescription>
            </div>
            <Switch
              checked={quietHours.enabled}
              onCheckedChange={(enabled) => setQuietHours((prev) => ({ ...prev, enabled }))}
            />
          </div>
        </CardHeader>
        {quietHours.enabled && (
          <CardContent>
            <div className="flex items-center gap-4">
              <div>
                <Label className="text-xs text-gray-500">From</Label>
                <Input
                  type="time"
                  value={quietHours.startTime}
                  onChange={(e) => setQuietHours((prev) => ({ ...prev, startTime: e.target.value }))}
                  className="w-32"
                />
              </div>
              <span className="text-gray-400 pt-5">to</span>
              <div>
                <Label className="text-xs text-gray-500">Until</Label>
                <Input
                  type="time"
                  value={quietHours.endTime}
                  onChange={(e) => setQuietHours((prev) => ({ ...prev, endTime: e.target.value }))}
                  className="w-32"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Timezone: {quietHours.timezone}
            </p>
          </CardContent>
        )}
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-teal-600 hover:bg-teal-700">
          <Save size={16} className="mr-1.5" />
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
}
