'use client';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';

interface PriceMatchContentProps {
  buttonText?: string;
  href?: string;
  className?: string;
}

export function PriceMatchContent({ 
  buttonText = "Visit Shop", 
  href = "/", 
  className = "bg-pink-500 hover:bg-pink-600 text-white" 
}: PriceMatchContentProps) {
  return (
    <div className="space-y-8">
      <ButtonLink 
        className={className}
        href={href}
        shape="pill"
        size="small"
        variant="primary"
      >
        {buttonText}
      </ButtonLink>
    </div>
  );
} 