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
    <Button
      className={clsx('group/arrow-btn text-[#FFFFFF] transition-all duration-200', className)}
      {...props}
    >
      <span className="flex items-center gap-0 transition-all duration-200 group-hover/arrow-btn:gap-2">
        <span>{children}</span>
        <ArrowRight
          className={clsx(
            'h-4 w-0 transform opacity-0 transition-all duration-200 group-hover/arrow-btn:w-4 group-hover/arrow-btn:translate-x-1 group-hover/arrow-btn:opacity-100',
            arrowClassName,
          )}
        />
      </span>
    </Button>
  );
}
