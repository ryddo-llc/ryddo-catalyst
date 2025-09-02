'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';

import { Button } from '@/vibes/soul/primitives/button';
import { Modal } from '@/vibes/soul/primitives/modal';
import { type Product } from '@/vibes/soul/primitives/product-card';
import { Image } from '~/components/image';

import { ProductModalForm } from './product-modal-form';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  return (
    <Modal
      className="max-w-7xl"
      hideHeader={true}
      isOpen={isOpen}
      setOpen={(open) => !open && onClose()}
      title={product.title}
    >
      {/* Hidden description for accessibility */}
      <Dialog.Description className="sr-only">
        View details and options for {product.title}
      </Dialog.Description>

      {/* Custom Close Button */}
      <div className="mb-4 flex justify-end">
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
                alt={product.image.alt || product.title}
                className="h-full w-full object-contain"
                height={400}
                src={product.image.src}
                width={400}
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
          <h2 className="text-2xl font-bold text-gray-900 @md:text-3xl">{product.title}</h2>

          {/* Product Form with Colors, Sizes, Price, and Add to Cart */}
          <ProductModalForm onClose={onClose} product={product} />
        </div>
      </div>
    </Modal>
  );
}
