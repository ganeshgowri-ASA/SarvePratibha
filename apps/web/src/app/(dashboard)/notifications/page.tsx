'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Search,
  CalendarDays,
  Clock,
  IndianRupee,
  TrendingUp,
  Users,
  AlertTriangle,
  Info,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { apiFetch } from '@/lib/api';
import type { NotificationItem, NotificationCategory, ApiResponse } from '@sarve-pratibha/shared';

const CATEGORY_ICONS: Record<NotificationCategory, LucideIcon> = {
  LEAVE: CalendarDays,
  ATTENDANCE: Clock,
  PAYROLL: IndianRupee,
  PERFORMANCE: TrendingUp,
  RECRUITMENT: Users,
  SYSTEM: AlertTriangle,
  GENERAL: Info,
};

const CATEGORY_COLORS: Record<NotificationCategory, string> = {
  LEAVE: 'text-blue-600 bg-blue-50',
  ATTENDANCE: 'text-orange-600 bg-orange-50',
  PAYROLL: 'text-green-600 bg-green-50',
  PERFORMANCE: 'text-purple-600 bg-purple-50',
  RECRUITMENT: 'text-indigo-600 bg-indigo-50',
  SYSTEM: 'text-red-600 bg-red-50',
  GENERAL: 'text-gray-600 bg-gray-50',
};

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'LEAVE', label: 'Leave' },
  { value: 'ATTENDANCE', label: 'Attendance' },
  { value: 'PAYROLL', label: 'Payroll' },
  { value: 'PERFORMANCE', label: 'Performance' },
  { value: 'RECRUITMENT', label: 'Recruitment' },
  { value: 'SYSTEM', label: 'System' },
  { value: 'GENERAL', label: 'General' },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function groupByDate(notifications: NotificationItem[]): Record<string, NotificationItem[]> {
  const groups: Record<string, NotificationItem[]> = {};
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  for (const n of notifications) {
    const dateStr = new Date(n.createdAt).toDateString();
    let label: string;
    if (dateStr === today) label = 'Today';
    else if (dateStr === yesterday) label = 'Yesterday';
    else label = new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    if (!groups[label]) groups[label] = [];
    groups[label].push(n);
  }

  return groups;
}

interface NotificationsResponse extends ApiResponse<NotificationItem[]> {
  unreadCount: number;
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export default function NotificationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = (session?.user as any)?.accessToken;
  const userId = (session?.user as any)?.id;

  const fetchNotifications = useCallback(async () => {
    if (!token || !userId) return;
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (category !== 'all') params.set('category', category);

      const data = await apiFetch<NotificationsResponse>(
        `/api/notifications/${userId}?${params}`,
        { token },
      );
      setNotifications(data.data?.data || []);
      setUnreadCount(data.data?.unreadCount || 0);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [token, userId, page, category]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    if (!token) return;
    try {
      await apiFetch(`/api/notifications/${id}/read`, { method: 'PUT', token });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    if (!token) return;
    try {
      await apiFetch('/api/notifications/read-all', { method: 'PUT', token });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await apiFetch(`/api/notifications/${id}`, { method: 'DELETE', token });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const filteredNotifications = search
    ? notifications.filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.message.toLowerCase().includes(search.toLowerCase()),
      )
    : notifications;

  const grouped = groupByDate(filteredNotifications);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              <CheckCheck size={16} className="mr-1.5" />
              Mark all read
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/notifications/preferences')}
          >
            <Settings size={16} className="mr-1.5" />
            Preferences
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search notifications..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={category} onValueChange={(val) => { setCategory(val); setPage(1); }}>
        <TabsList className="flex-wrap h-auto gap-1">
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value} className="text-xs">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map((cat) => (
          <TabsContent key={cat.value} value={cat.value}>
            {loading ? (
              <Card>
                <CardContent className="p-12 text-center text-gray-500">
                  Loading notifications...
                </CardContent>
              </Card>
            ) : filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No notifications</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {category !== 'all' ? `No ${cat.label.toLowerCase()} notifications yet` : 'You\'re all caught up!'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {Object.entries(grouped).map(([dateLabel, items]) => (
                  <div key={dateLabel}>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2 px-1">{dateLabel}</h3>
                    <Card>
                      <CardContent className="p-0 divide-y divide-gray-100">
                        {items.map((notification) => {
                          const CategoryIcon = CATEGORY_ICONS[notification.category] || Info;
                          const colorClass = CATEGORY_COLORS[notification.category] || CATEGORY_COLORS.GENERAL;

                          return (
                            <div
                              key={notification.id}
                              className={cn(
                                'flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors',
                                !notification.isRead && 'bg-teal-50/30',
                              )}
                            >
                              <div className={cn('p-2 rounded-lg shrink-0 mt-0.5', colorClass)}>
                                <CategoryIcon size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className={cn('text-sm', !notification.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700')}>
                                      {notification.title}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-0.5">{notification.message}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                      <span className="text-xs text-gray-400">{formatDate(notification.createdAt)}</span>
                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                        {notification.category}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    {!notification.isRead && (
                                      <button
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        className="p-1.5 rounded-md hover:bg-teal-100 text-teal-600 transition-colors"
                                        title="Mark as read"
                                      >
                                        <Check size={14} />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleDelete(notification.id)}
                                      className="p-1.5 rounded-md hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-500">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
