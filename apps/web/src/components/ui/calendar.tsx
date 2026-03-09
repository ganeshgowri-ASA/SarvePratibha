'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
  month?: Date;
  onMonthChange?: (date: Date) => void;
  modifiers?: Record<string, Date[]>;
  modifiersClassNames?: Record<string, string>;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function Calendar({ selected, onSelect, className, month: controlledMonth, onMonthChange, modifiers, modifiersClassNames }: CalendarProps) {
  const [internalMonth, setInternalMonth] = React.useState(controlledMonth || selected || new Date());
  const month = controlledMonth || internalMonth;

  const year = month.getFullYear();
  const m = month.getMonth();
  const daysInMonth = getDaysInMonth(year, m);
  const firstDay = getFirstDayOfMonth(year, m);
  const today = new Date();

  function changeMonth(delta: number) {
    const next = new Date(year, m + delta, 1);
    if (onMonthChange) onMonthChange(next);
    else setInternalMonth(next);
  }

  function getModifierClass(date: Date) {
    if (!modifiers || !modifiersClassNames) return '';
    for (const [key, dates] of Object.entries(modifiers)) {
      if (dates.some((d) => isSameDay(d, date))) {
        return modifiersClassNames[key] || '';
      }
    }
    return '';
  }

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className={cn('p-3', className)}>
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => changeMonth(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => changeMonth(1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-0">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1.5">
            {d}
          </div>
        ))}

        {days.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} />;
          }

          const date = new Date(year, m, day);
          const isSelected = selected && isSameDay(date, selected);
          const isToday = isSameDay(date, today);
          const modClass = getModifierClass(date);

          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelect?.(date)}
              className={cn(
                'h-9 w-9 mx-auto text-sm rounded-md transition-colors hover:bg-accent',
                isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
                isToday && !isSelected && 'bg-accent text-accent-foreground font-bold',
                modClass,
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
