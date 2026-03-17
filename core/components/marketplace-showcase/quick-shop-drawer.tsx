'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { Image } from '~/components/image';
import { Link } from '~/components/link';

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

interface QuickShopDrawerProps {
  product: MarketplaceProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickShopDrawer({ product, open, onOpenChange }: QuickShopDrawerProps) {
  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-30 flex items-center justify-center bg-[hsl(var(--foreground)/50%)] @container">
          <Dialog.Content
            aria-describedby={undefined}
            className="mx-3 w-full max-w-[560px] overflow-hidden rounded-2xl bg-background transition ease-out focus:outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-bottom-16 data-[state=open]:slide-in-from-bottom-16 data-[state=closed]:duration-200 data-[state=open]:duration-200"
          >
            {/* Pink accent bar */}
            <div className="h-1 w-full bg-primary" />

            {/* Split layout */}
            <div className="flex min-h-[280px]">
              {/* Left: Image 42% */}
              <div className="relative w-[42%] shrink-0 bg-contrast-100">
                {product.defaultImage ? (
                  <Image
                    alt={product.defaultImage.altText}
                    className="object-cover"
                    fill
                    sizes="240px"
                    src={product.defaultImage.url}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-xs text-contrast-400">No Image</span>
                  </div>
                )}
              </div>

              {/* Right: Content */}
              <div className="flex flex-1 flex-col justify-between px-5 py-5">
                {/* Close button */}
                <div className="flex justify-end">
                  <Dialog.Close className="flex h-7 w-7 items-center justify-center rounded-full text-contrast-400 transition-colors hover:text-foreground">
                    <X className="h-4 w-4" strokeWidth={2} />
                    <span className="sr-only">Close</span>
                  </Dialog.Close>
                </div>

                {/* Brand & product name */}
                <div className="mt-4 flex flex-col gap-2">
                  {product.brand?.name ? (
                    <p className="font-body text-[10px] font-semibold uppercase tracking-widest text-primary">
                      {product.brand.name}
                    </p>
                  ) : null}
                  <Dialog.Title className="font-heading text-xl font-bold leading-tight text-foreground">
                    {product.name}
                  </Dialog.Title>
                </div>

                {/* Divider */}
                <div className="my-4 h-px w-full bg-contrast-100" />

                {/* CTA */}
                <Link
                  className="flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 font-body text-sm font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
                  href={product.path}
                  onClick={() => onOpenChange(false)}
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
