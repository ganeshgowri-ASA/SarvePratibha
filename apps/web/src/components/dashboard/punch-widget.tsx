'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, LogIn, LogOut } from 'lucide-react';

export function PunchWidget() {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [punchInTime, setPunchInTime] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  function handlePunch() {
    if (!isPunchedIn) {
      setPunchInTime(new Date());
      setIsPunchedIn(true);
    } else {
      setIsPunchedIn(false);
    }
  }

  const elapsedMs = punchInTime && isPunchedIn ? currentTime.getTime() - punchInTime.getTime() : 0;
  const hours = Math.floor(elapsedMs / 3600000);
  const minutes = Math.floor((elapsedMs % 3600000) / 60000);
  const seconds = Math.floor((elapsedMs % 60000) / 1000);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock size={18} className="text-teal-600" />
          Punch In/Out
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <div className="text-3xl font-mono font-bold text-gray-800">
            {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          {isPunchedIn && (
            <div className="text-sm text-gray-500">
              Working: {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          )}
          <Button
            onClick={handlePunch}
            className={
              isPunchedIn
                ? 'w-full bg-red-500 hover:bg-red-600'
                : 'w-full bg-teal-600 hover:bg-teal-700'
            }
            size="lg"
          >
            {isPunchedIn ? (
              <>
                <LogOut className="mr-2" size={18} /> Punch Out
              </>
            ) : (
              <>
                <LogIn className="mr-2" size={18} /> Punch In
              </>
            )}
          </Button>
          {punchInTime && (
            <p className="text-xs text-gray-500">
              Punched in at{' '}
              {punchInTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
