import { clsx } from 'clsx';
import { ArrowRight } from 'lucide-react';
import { ComponentPropsWithoutRef } from 'react';

import { Button, ButtonProps } from '@/vibes/soul/primitives/button';

interface ArrowButtonProps extends Omit<ButtonProps, 'children'> {
  children: string;
  arrowClassName?: string;
}

export function ArrowButton({
  children,
  className,
  arrowClassName,
  ...props
}: ArrowButtonProps & ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      className={clsx('group/arrow-btn bg-[#F92F7B] hover:bg-[#d41f63] text-white px-4 py-2 text-sm font-medium rounded-full transition-all duration-200', className)}
      {...props}
    >
      <span className="flex items-center gap-0 transition-all duration-200 group-hover/arrow-btn:gap-1">
        <span>{children}</span>
        <ArrowRight
          className={clsx(
            'h-2 w-0 transform opacity-0 transition-all duration-200 group-hover/arrow-btn:w-2 group-hover/arrow-btn:translate-x-0.5 group-hover/arrow-btn:opacity-100',
            arrowClassName,
          )}
        />
      </span>
    </button>
  );
}
