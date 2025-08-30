'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';

import { Modal } from '@/vibes/soul/primitives/modal';
import { Button } from '@/vibes/soul/primitives/button';
import { type Product } from '@/vibes/soul/primitives/product-card';
import { Image } from '~/components/image';
import { Link } from '~/components/link';

import { ProductModalForm } from './product-modal-form';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  return (
    <Modal
      title={product.title}
      isOpen={isOpen}
      setOpen={(open) => !open && onClose()}
      className="max-w-6xl"
      hideHeader={true}
    >
      {/* Custom Close Button */}
      <div className="flex justify-end mb-4">
        <Dialog.Close asChild>
          <Button shape="circle" size="x-small" variant="ghost">
            <XIcon size={20} />
          </Button>
        </Dialog.Close>
      </div>

      <div className="flex flex-col gap-6 @lg:flex-row @lg:gap-8">
        {/* Product Image - Left Side */}
        <div className="flex-shrink-0 @lg:w-1/2">
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            {product.image?.src ? (
              <Image
                src={product.image.src}
                alt={product.image.alt || product.title}
                className="h-full w-full object-contain"
                width={400}
                height={400}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>
        </div>

        {/* Product Details - Right Side */}
        <div className="flex flex-1 flex-col gap-4 @lg:w-1/2">
          {/* Product Name */}
          <h2 className="text-2xl font-bold text-gray-900 @md:text-3xl">
            {product.title}
          </h2>

          {/* Price */}
          {product.price && (
            <div className="text-xl font-semibold text-gray-900 @md:text-2xl">
              {(() => {
                if (typeof product.price === 'string') {
                  return product.price;
                }

                if (product.price.type === 'sale') {
                  return (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 line-through @md:text-base">
                        {product.price.previousValue}
                      </span>
                      <span className="text-[#F92F7B]">{product.price.currentValue}</span>
                    </div>
                  );
                }

                if (product.price.type === 'range') {
                  return `${product.price.minValue} – ${product.price.maxValue}`;
                }

                return product.price;
              })()}
            </div>
          )}

          {/* Product Form with Colors, Sizes, Add to Cart */}
          <ProductModalForm product={product} onClose={onClose} />
        </div>
      </div>
    </Modal>
  );
}