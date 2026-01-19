import { clsx } from 'clsx';

import * as Skeleton from '@/vibes/soul/primitives/skeleton';

const cardColors = [
  'bg-blue-500',
  'bg-yellow-400',
  'bg-pink-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-orange-500',
];

function SkeletonCard({ bgColor }: { bgColor: string }) {
  return (
    <div className="w-full min-w-[110px] max-w-[180px] shrink-0 snap-start rounded-[24px] bg-white p-1">
      <div className={clsx('relative flex aspect-[3/4.2] flex-col overflow-hidden rounded-[22px]', bgColor)}>
        {/* Top 45% - Content Area */}
        <div className="relative h-[45%] p-3">
          {/* Badge placeholder - Top Left */}
          <div className="absolute left-4 top-3">
            <Skeleton.Text characterCount={6} className="text-sm opacity-50" />
          </div>

          {/* Circle Button placeholder - Top Right */}
          <div className="absolute right-3 top-3 h-6 w-6 rounded-full bg-white/50" />

          {/* Brand & Product Names placeholder - Bottom */}
          <div className="flex h-full flex-col items-start justify-end gap-1 px-1 pb-2">
            <Skeleton.Text characterCount={8} className="text-lg" />
            <Skeleton.Text characterCount={12} className="text-sm" />
          </div>
        </div>

        {/* Bottom 55% - Image Area */}
        <div className="relative h-[55%] overflow-hidden rounded-t-[22px]">
          <Skeleton.Box className="h-full w-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}

export function MarketplaceShowcaseSkeleton() {
  return (
    <Skeleton.Root pending>
      <div className="relative animate-pulse">
        <div className="flex snap-x snap-mandatory justify-start gap-3 overflow-x-auto pl-8 pr-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:pl-12 md:gap-4 md:pl-16 md:pr-12 [&::-webkit-scrollbar]:hidden">
          {cardColors.map((color, index) => (
            <SkeletonCard bgColor={color} key={index} />
          ))}
        </div>
        {/* Fade hint on right edge - mobile only */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-blue-100/80 to-transparent md:hidden" />
      </div>
    </Skeleton.Root>
  );
}
