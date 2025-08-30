'use client';

import { useState, useTransition } from 'react';

import { Button } from '@/vibes/soul/primitives/button';
import { type Product } from '@/vibes/soul/primitives/product-card';
import { toast } from '@/vibes/soul/primitives/toaster';
import { Link } from '~/components/link';

interface ProductModalFormProps {
  product: Product;
  onClose: () => void;
}

// Mock color options - in a real app, these would come from the product data
const mockColors = [
  { id: 'black', name: 'Black', value: '#000000' },
  { id: 'white', name: 'White', value: '#FFFFFF' },
  { id: 'red', name: 'Red', value: '#EF4444' },
  { id: 'blue', name: 'Blue', value: '#3B82F6' },
];

// Mock size options - in a real app, these would come from the product data
const mockSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function ProductModalForm({ product, onClose }: ProductModalFormProps) {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = () => {
    startTransition(() => {
      // Simulate add to cart API call
      setTimeout(() => {
        toast.success(`${product.title} added to cart!`);
        onClose();
      }, 1000);
    });
  };

  const isAddToCartDisabled = !selectedColor || !selectedSize || isPending;

  return (
    <div className="flex flex-col gap-6">
      {/* Color Selection */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-900">Color</h3>
        <div className="flex flex-wrap gap-2">
          {mockColors.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedColor(color.id)}
              className={`relative h-10 w-10 rounded-full border-2 transition-all hover:scale-105 ${
                selectedColor === color.id
                  ? 'border-[#F92F7B] shadow-lg ring-2 ring-[#F92F7B] ring-offset-2'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {color.value === '#FFFFFF' && (
                <div className="absolute inset-0 rounded-full border border-gray-200" />
              )}
              {selectedColor === color.id && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`h-3 w-3 rounded-full ${color.value === '#FFFFFF' || color.value === '#FFFF00' ? 'bg-gray-800' : 'bg-white'}`} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-900">Size</h3>
        <div className="flex flex-wrap gap-2">
          {mockSizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`rounded-md border px-4 py-2 text-sm font-medium transition-all hover:scale-105 ${
                selectedSize === size
                  ? 'border-[#F92F7B] bg-[#F92F7B] text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="pt-4">
        <Button
          onClick={handleAddToCart}
          disabled={isAddToCartDisabled}
          loading={isPending}
          className="w-full bg-[#F92F7B] text-white hover:bg-[#d41f63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F92F7B] focus-visible:ring-offset-2 disabled:bg-gray-300"
          size="medium"
        >
          {isPending ? 'Adding to Cart...' : 'Add to Cart'}
        </Button>
        
        {!selectedColor || !selectedSize ? (
          <p className="mt-2 text-xs text-gray-500">
            Please select {!selectedColor && !selectedSize ? 'color and size' : !selectedColor ? 'color' : 'size'} to add to cart
          </p>
        ) : null}

        {/* View Full Product Details Link */}
        <div className="mt-4">
          <Link
            href={product.href}
            className="inline-flex items-center text-[#F92F7B] hover:text-[#d41f63] font-medium text-sm transition-colors"
            onClick={onClose}
          >
            View Full Product Details →
          </Link>
        </div>
      </div>
    </div>
  );
}