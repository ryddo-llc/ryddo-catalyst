'use client';

import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';

import type { ExpandableContentProps } from '../types';

export const ExpandableContent = ({ isExpanded, children }: ExpandableContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          setHeight(entry.contentRect.height);
        });
      });

      resizeObserver.observe(contentRef.current);

      return () => resizeObserver.disconnect();
    }
  }, []);

  return (
    <div
      className="duration-800 overflow-hidden transition-all ease-in-out"
      style={{
        height: isExpanded ? height : 0,
        opacity: isExpanded ? 1 : 0,
      }}
    >
      <div
        className={clsx(
          'duration-600 transition-transform ease-in-out',
          isExpanded ? 'translate-y-0' : '-translate-y-2',
        )}
        ref={contentRef}
      >
        {children}
      </div>
    </div>
  );
};