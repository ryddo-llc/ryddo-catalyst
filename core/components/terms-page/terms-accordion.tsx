'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { clsx } from 'clsx';
import { ComponentPropsWithoutRef, useEffect, useState } from 'react';

import { Accordion } from '@/vibes/soul/primitives/accordion';
import type { AccordionItem } from '~/lib/data/terms-conditions';

interface Props {
  accordionItems: AccordionItem[];
}

interface TermsAccordionItemProps extends ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {
  title: string;
  children: React.ReactNode;
}

function TermsAccordionItem({ title, children, className, ...props }: TermsAccordionItemProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <AccordionPrimitive.Item
      {...props}
      className={clsx('border border-gray-200 rounded-lg', className)}
    >
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className="group flex w-full cursor-pointer items-start gap-8 border-none py-3 px-6 text-start focus:outline-none @md:py-4">
          <div className="flex-1 select-none text-lg font-semibold text-gray-700 group-hover:text-pink-600 transition-colors duration-200">
            {title}
          </div>
          <AnimatedChevron />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content
        className={clsx(
          'overflow-hidden',
          isMounted && 'data-[state=closed]:animate-collapse data-[state=open]:animate-expand',
        )}
      >
        <div className="py-3 px-6 text-base text-gray-700 leading-relaxed">
          {children}
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}

function AnimatedChevron() {
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
}

export function TermsAccordion({ accordionItems }: Props) {
  return (
    <div className="space-y-4">
      <Accordion className="space-y-4" collapsible type="single">
        {accordionItems.map((item) => (
          <TermsAccordionItem
            key={item.id}
            title={item.title}
            value={item.id}
          >
                        <div 
              className="text-gray-700 leading-relaxed [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-1 [&>li]:mb-1"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </TermsAccordionItem>
        ))}
      </Accordion>
    </div>
  );
} 