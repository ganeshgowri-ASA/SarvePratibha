'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onValueChange?: (value: number) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(({ className, onValueChange, onChange, ...props }, ref) => {
  return (
    <input
      type="range"
      className={cn(
        'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600',
        className,
      )}
      ref={ref}
      onChange={(e) => {
        onChange?.(e);
        onValueChange?.(Number(e.target.value));
      }}
      {...props}
    />
  );
});
Slider.displayName = 'Slider';

export { Slider };
