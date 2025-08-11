'use client';

import { ReactNode, useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export function CollapsibleSection({
  title,
  children,
  defaultExpanded = false,
  className = "",
  headerClassName = "",
  contentClassName = "",
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <button
        className={`w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left ${headerClassName}`}
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
      >
        <span className="font-['Inter'] text-base sm:text-lg font-semibold text-zinc-800">
          {title}
        </span>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded
            ? 'max-h-screen opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className={`p-4 bg-white ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
}