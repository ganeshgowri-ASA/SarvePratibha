'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail } from 'lucide-react';

interface ProfileCardProps {
  firstName: string;
  lastName: string;
  employeeId: string;
  designation: string;
  department: string;
  email?: string;
  phone?: string;
  location?: string;
  profilePhoto?: string;
  status?: string;
  compact?: boolean;
  onClick?: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  ON_LEAVE: 'bg-yellow-100 text-yellow-700',
  ON_NOTICE: 'bg-orange-100 text-orange-700',
  RESIGNED: 'bg-red-100 text-red-700',
};

export function EmployeeProfileCard({
  firstName,
  lastName,
  employeeId,
  designation,
  department,
  email,
  phone,
  location,
  status = 'ACTIVE',
  compact = false,
  onClick,
}: ProfileCardProps) {
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
  const fullName = `${firstName} ${lastName}`;

  if (compact) {
    return (
      <div
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={onClick}
      >
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-teal-100 text-teal-700 text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{fullName}</p>
          <p className="text-xs text-gray-500">{designation} &middot; {department}</p>
        </div>
        <span className="text-xs text-gray-400 hidden sm:block">{employeeId}</span>
      </div>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-teal-100 text-teal-700 text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{fullName}</h3>
              <Badge className={`text-[10px] ${STATUS_STYLES[status] || ''}`}>
                {status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mb-2">{designation} &middot; {department}</p>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {location}
                </span>
              )}
              {phone && (
                <span className="flex items-center gap-1">
                  <Phone size={12} /> {phone}
                </span>
              )}
              {email && (
                <span className="flex items-center gap-1">
                  <Mail size={12} /> {email}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
