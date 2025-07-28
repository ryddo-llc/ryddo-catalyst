'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { clsx } from 'clsx';
import { ComponentPropsWithoutRef, memo } from 'react';

interface ServiceAccordionItemProps extends ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {
  title: string;
  children: React.ReactNode;
}

const AnimatedChevron = memo(function AnimatedChevron() {
  return (
    <svg
      className="mt-1 shrink-0 stroke-[#F92F7B] transition-transform duration-200 group-hover:scale-125 [&>line]:origin-center [&>line]:transition [&>line]:duration-300 [&>line]:ease-out"
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
});

export function ServiceAccordionItem({ children, className, title, ...props }: ServiceAccordionItemProps) {

  return (
    <AccordionPrimitive.Item
      className={clsx(className)}
      {...props}
    >
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className="group flex w-full cursor-pointer items-start gap-8 border-none py-3 px-6 text-start focus:outline-none @md:py-4">
          <div className="flex-1 select-none text-xl font-bold text-gray-700 group-hover:text-pink-600 group-data-[state=open]:text-pink-600 transition-colors duration-200">
            {title}
          </div>
          <AnimatedChevron />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content
        className={clsx(
          'overflow-hidden',
          'data-[state=closed]:animate-collapse data-[state=open]:animate-expand',
        )}
      >
        <div className="pb-3 px-6 text-base text-gray-700 leading-relaxed">
          {children}
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
} 