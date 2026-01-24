'use client';

import { clsx } from 'clsx';
import { SlidersHorizontal } from 'lucide-react';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

export interface FinderTriggerProps extends ComponentPropsWithoutRef<'button'> {
  label?: string;
}

export const FinderTrigger = forwardRef<HTMLButtonElement, FinderTriggerProps>(
  ({ label = 'Find Your Scooter', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center gap-2.5 rounded-full border border-contrast-200 bg-white px-5 py-3 text-sm font-medium text-foreground transition-all duration-200',
          'hover:border-[#F92F7B] hover:shadow-[0_4px_12px_rgba(249,47,123,0.15)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F92F7B] focus-visible:ring-offset-2',
          'active:scale-[0.98]',
          className,
        )}
        type="button"
        {...props}
      >
        <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
        <span>{label}</span>
      </button>
    );
  },
);

FinderTrigger.displayName = 'FinderTrigger';
