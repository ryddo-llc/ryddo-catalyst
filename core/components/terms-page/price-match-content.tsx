'use client';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';

interface Props {
  buttonText?: string;
  href?: string;
  className?: string;
}

export function PriceMatchContent({ 
  buttonText = "Visit Shop", 
  href = "/", 
  className = "bg-pink-500 hover:bg-pink-600 text-white" 
}: Props = {}) {
  return (
    <div className="space-y-8">
      <div>
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
    </div>
  );
} 