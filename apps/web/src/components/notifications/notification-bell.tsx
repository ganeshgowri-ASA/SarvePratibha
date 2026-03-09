'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Check,
  CheckCheck,
  CalendarDays,
  Clock,
  IndianRupee,
  TrendingUp,
  Users,
  AlertTriangle,
  Info,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

interface NotificationsResponse extends ApiResponse<NotificationItem[]> {
  unreadCount: number;
}

export function NotificationBell() {
  const { data: session } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const token = (session?.user as any)?.accessToken;
  const userId = (session?.user as any)?.id;

  const fetchNotifications = useCallback(async () => {
    if (!token || !userId) return;
    try {
      setLoading(true);
      const res = await apiFetch(
        `/api/notifications/${userId}?limit=5`,
        { token },
      ) as unknown as NotificationsResponse;
      setNotifications(res.data || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
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

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && fetchNotifications()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} className="text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="text-base font-semibold">Notifications</span>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <>
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleMarkAllRead();
                  }}
                  className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                >
                  <CheckCheck size={14} />
                  Read all
                </button>
              </>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <ScrollArea className="max-h-[400px]">
          {loading && notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => {
                const CategoryIcon = CATEGORY_ICONS[notification.category] || Info;
                const colorClass = CATEGORY_COLORS[notification.category] || CATEGORY_COLORS.GENERAL;

                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      'w-full flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0',
                      !notification.isRead && 'bg-teal-50/50',
                    )}
                  >
                    <div className={cn('p-1.5 rounded-lg shrink-0 mt-0.5', colorClass)}>
                      <CategoryIcon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn('text-sm leading-tight', !notification.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700')}>
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="shrink-0 p-0.5 rounded hover:bg-teal-100 text-teal-600"
                            title="Mark as read"
                          >
                            <Check size={12} />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <DropdownMenuSeparator />
        <button
          onClick={() => router.push('/notifications')}
          className="w-full py-2.5 text-center text-sm text-teal-600 font-medium hover:bg-gray-50 transition-colors"
        >
          View all notifications
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
