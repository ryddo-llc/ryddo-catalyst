'use client';

import { clsx } from 'clsx';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Image } from '~/components/image';
import { Link } from '~/components/link';

import { QuickShopDrawer } from './quick-shop-drawer';

interface MarketplaceProduct {
  entityId: number;
  name: string;
  path: string;
  defaultImage: {
    altText: string;
    url: string;
  } | null;
  brand?: {
    name: string;
  } | null;
}

interface MarketplaceCardProps {
  product: MarketplaceProduct;
  bgColor?: string;
  badgeText?: string | null;
  className?: string;
}

export function MarketplaceCard({
  product,
  bgColor = 'bg-blue-500',
  badgeText,
  className,
}: MarketplaceCardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Link
        className={clsx(
          'group block w-full min-w-[110px] max-w-[180px] shrink-0 snap-start overflow-hidden rounded-[24px] bg-white p-1 transition-all hover:shadow-lg',
          className,
        )}
        href={product.path}
      >
        <div
          className={clsx(
            'relative flex aspect-[3/4.2] flex-col overflow-hidden rounded-[22px]',
            bgColor,
          )}
        >
          {/* Top 45% - Content Area */}
          <div className="relative h-[45%] p-3">
            {/* Badge Text - Top Left */}
            {badgeText != null && badgeText !== '' ? (
              <span className="absolute left-4 top-3 font-[family-name:var(--font-family-body)] text-[13px] font-normal italic text-white">
                {badgeText}
              </span>
            ) : null}

            {/* Circle Button - Top Right */}
            <button
              aria-label={`Quick shop ${product.name}`}
              className="absolute right-2 top-2 flex h-[27px] w-[27px] items-center justify-center rounded-full bg-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDrawerOpen(true);
              }}
            >
              <Plus className="h-[15px] w-[15px] text-black" strokeWidth={3} />
            </button>

            {/* Brand & Product Names - Centered Vertically */}
            <div className="flex h-full flex-col items-start justify-end px-1 pb-2">
              {product.brand?.name != null && product.brand.name !== '' ? (
                <p className="font-[family-name:var(--font-family-body)] text-lg font-extrabold text-black">
                  {product.brand.name}
                </p>
              ) : null}
              <h3 className="w-full truncate font-[family-name:var(--font-family-body)] text-sm font-light italic text-black">
                {product.name}
              </h3>
            </div>
          </div>

          {/* Bottom 55% - Image Area */}
          <div className="relative h-[55%] overflow-hidden rounded-t-[22px]">
            {product.defaultImage ? (
              <Image
                alt={product.defaultImage.altText}
                className="object-cover"
                fill
                sizes="(max-width: 640px) 120px, 200px"
                src={product.defaultImage.url}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/20">
                <span className="text-xs text-white">No Image</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      <QuickShopDrawer onOpenChange={setDrawerOpen} open={drawerOpen} product={product} />
    </>
  );
}
