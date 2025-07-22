'use client';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';

export function PriceMatchContent() {
  return (
    <div className="space-y-8">
      <div>
        <ButtonLink 
          className="bg-pink-500 hover:bg-pink-600 text-white"
          href="/"
          shape="pill"
          size="small"
          variant="primary"
        >
          Visit Shop
        </ButtonLink>
      </div>
    </div>
  );
} 