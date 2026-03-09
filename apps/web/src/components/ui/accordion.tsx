'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (value: string) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = React.createContext<AccordionContextValue>({
  openItems: [],
  toggleItem: () => {},
  type: 'single',
});

interface AccordionProps {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ type = 'single', defaultValue, collapsible = true, className, children, ...props }, ref) => {
    const [openItems, setOpenItems] = React.useState<string[]>(
      defaultValue ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : []
    );

    const toggleItem = React.useCallback(
      (value: string) => {
        setOpenItems((prev) => {
          if (type === 'single') {
            if (prev.includes(value) && collapsible) return [];
            return [value];
          }
          if (prev.includes(value)) return prev.filter((v) => v !== value);
          return [...prev, value];
        });
      },
      [type, collapsible]
    );

    return (
      <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = 'Accordion';

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => (
  <div ref={ref} className={cn('border-b', className)} data-value={value} {...props} />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value?: string }
>(({ className, children, ...props }, ref) => {
  const { openItems, toggleItem } = React.useContext(AccordionContext);
  const item = React.useContext(AccordionItemContext);
  const isOpen = openItems.includes(item);

  return (
    <h3 className="flex">
      <button
        ref={ref}
        className={cn(
          'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
          className
        )}
        onClick={() => toggleItem(item)}
        data-state={isOpen ? 'open' : 'closed'}
        {...props}
      >
        {children}
        <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>
    </h3>
  );
});
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { openItems } = React.useContext(AccordionContext);
  const item = React.useContext(AccordionItemContext);
  const isOpen = openItems.includes(item);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn('overflow-hidden text-sm transition-all', className)}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  );
});
AccordionContent.displayName = 'AccordionContent';

const AccordionItemContext = React.createContext<string>('');

const AccordionItemWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ value, ...props }, ref) => (
  <AccordionItemContext.Provider value={value}>
    <AccordionItem ref={ref} value={value} {...props} />
  </AccordionItemContext.Provider>
));
AccordionItemWrapper.displayName = 'AccordionItemWrapper';

export { Accordion, AccordionItemWrapper as AccordionItem, AccordionTrigger, AccordionContent };
