'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { clsx } from 'clsx';
import { ComponentPropsWithoutRef, useEffect, useState } from 'react';

export const PaymentOptionsAccordion = AccordionPrimitive.Root;

export interface AccordionProps extends ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {
  colorScheme?: 'light' | 'dark';
}

export function PaymentOptionsAccordionItem({
  title,
  children,
  colorScheme = 'light',
  className,
  ...props
}: AccordionProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <AccordionPrimitive.Item
      {...props}
      className={clsx(
        'bg-gray-100 rounded-lg mb-2 w-full',
        'data-[state=open]:bg-[rgb(227,243,246)]',
        'has-focus-visible:ring-2 has-focus-visible:ring-(--accordion-focus,hsl(var(--primary))) has-focus-visible:ring-offset-4 focus:outline-2',
        {
          light: 'ring-offset-[var(--acordion-light-offset,hsl(var(--background)))]',
          dark: 'ring-offset-[var(--acordion-dark-offset,hsl(var(--foreground)))]',
        }[colorScheme],
        className,
      )}
    >
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className="group flex w-full cursor-pointer items-start gap-8 border-none py-3 px-4 text-start focus:outline-none @md:py-4">
          <div
            className={clsx(
              'flex-1 select-none font-[family-name:var(--accordion-title-font-family,var(--font-family-mono))] text-lg font-bold transition-colors duration-300 ease-out',
              {
                light:
                  'text-[var(--accordion-light-title-text,hsl(var(--contrast-500)))] group-hover:text-[var(--accordion-light-title-text-hover,hsl(var(--foreground)))]',
                dark: 'text-[var(--accordion-dark-title-text,hsl(var(--contrast-200)))] group-hover:text-[var(--accordion-dark-title-text-hover,hsl(var(--background)))]',
              }[colorScheme],
            )}
          >
            {title}
          </div>
          <AnimatedChevron
            className={clsx(
              {
                light:
                  'stroke-[#F92F7B] transition-transform duration-200 group-hover:scale-125',
                dark: 'stroke-[#F92F7B] transition-transform duration-200 group-hover:scale-125',
              }[colorScheme],
            )}
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content
        className={clsx(
          'overflow-hidden',
          isMounted && 'data-[state=closed]:animate-collapse data-[state=open]:animate-expand',
        )}
      >
        <div
          className={clsx(
            'py-3 px-4 font-[family-name:var(--accordion-content-font-family,var(--font-family-body))] text-base font-light leading-normal',
            {
              light: 'text-[var(--accordion-light-content-text,hsl(var(--foreground)))]',
              dark: 'text-[var(--accordion-dark-content-text,hsl(var(--background)))]',
            }[colorScheme],
          )}
        >
          {children}
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}

function AnimatedChevron({
  className,
  ...props
}: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      className={clsx(
        'mt-1 shrink-0 [&>line]:origin-center [&>line]:transition [&>line]:duration-300 [&>line]:ease-out',
        className,
      )}
      viewBox="0 0 10 10"
      width={16}
    >
      {/* Left Line of Chevron */}
      <line
        className="group-data-[state=open]:-translate-y-[3px] group-data-[state=open]:-rotate-90"
        strokeLinecap="round"
        x1={2}
        x2={5}
        y1={2}
        y2={5}
      />
      {/* Right Line of Chevron */}
      <line
        className="group-data-[state=open]:-translate-y-[3px] group-data-[state=open]:rotate-90"
        strokeLinecap="round"
        x1={8}
        x2={5}
        y1={2}
        y2={5}
      />
    </svg>
  );
} 