'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionContextType {
  openItems: string[];
  toggle: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextType>({
  openItems: [],
  toggle: () => {},
});

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { type?: 'single' | 'multiple'; defaultValue?: string[] | string; collapsible?: boolean }
>(({ className, type = 'single', defaultValue, children, ...props }, ref) => {
  const initial = defaultValue
    ? Array.isArray(defaultValue) ? defaultValue : [defaultValue]
    : [];
  const [openItems, setOpenItems] = React.useState<string[]>(initial);

  const toggle = (value: string) => {
    setOpenItems((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      }
      return type === 'single' ? [value] : [...prev, value];
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div ref={ref} className={cn('', className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
});
Accordion.displayName = 'Accordion';

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => (
  <div ref={ref} className={cn('border-b', className)} data-value={value} {...props}>
    {React.Children.map(children, (child) =>
      React.isValidElement(child)
        ? React.cloneElement(child as React.ReactElement<{ itemValue?: string }>, { itemValue: value })
        : child,
    )}
  </div>
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { itemValue?: string }
>(({ className, children, itemValue, ...props }, ref) => {
  const { openItems, toggle } = React.useContext(AccordionContext);
  const isOpen = itemValue ? openItems.includes(itemValue) : false;

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'flex flex-1 w-full items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
        className,
      )}
      data-state={isOpen ? 'open' : 'closed'}
      onClick={() => itemValue && toggle(itemValue)}
      {...props}
    >
      {children}
      <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')} />
    </button>
  );
});
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { itemValue?: string }
>(({ className, children, itemValue, ...props }, ref) => {
  const { openItems } = React.useContext(AccordionContext);
  const isOpen = itemValue ? openItems.includes(itemValue) : false;

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn('overflow-hidden text-sm pb-4 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
});
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
