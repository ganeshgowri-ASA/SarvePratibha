'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Search, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationBell } from '@/components/notifications/notification-bell';
import { ROLE_LABELS } from '@sarve-pratibha/shared';
import type { UserRole } from '@sarve-pratibha/shared';

export function Navbar() {
  const { data: session } = useSession();
  const [searchOpen, setSearchOpen] = useState(false);

  const user = session?.user;
  const userRole = (user as any)?.role as UserRole | undefined;
  const employeeId = (user as any)?.employeeId;

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-30 h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Global Search */}
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search employees, documents, policies..."
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
          <button className="sm:hidden p-2" onClick={() => setSearchOpen(!searchOpen)}>
            <Search size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 ml-4">
          {/* Notification Bell */}
          <NotificationBell />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image || undefined} />
                  <AvatarFallback className="bg-teal-600 text-white text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 leading-tight">{user?.name || 'User'}</p>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    {userRole ? ROLE_LABELS[userRole] : 'Employee'}
                  </p>
                </div>
                <ChevronDown size={14} className="text-gray-400 hidden md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  {employeeId && (
                    <p className="text-xs text-muted-foreground">ID: {employeeId}</p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="sm:hidden px-4 pb-3 bg-white border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input placeholder="Search..." className="pl-10" autoFocus />
          </div>
        </div>
      )}
    </header>
  );
}
