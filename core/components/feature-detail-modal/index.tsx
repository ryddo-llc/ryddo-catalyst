'use client';

import { Modal } from '@/vibes/soul/primitives/modal';
import { Image } from '~/components/image';
import type { ParsedFeature } from '~/lib/extract-feature-fields';

interface FeatureDetailModalProps {
  feature: ParsedFeature | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FeatureDetailModal({ feature, isOpen, onClose }: FeatureDetailModalProps) {
  if (!feature) {
    return null;
  }

  return (
    <Modal
      className="max-w-4xl"
      isOpen={isOpen}
      setOpen={(open) => {
        if (!open) {
          onClose();
        }
      }}
      title={feature.title}
    >
      {/* Horizontal layout: Image left, content right */}
      <div className="grid grid-cols-1 gap-8 @lg:grid-cols-2 @lg:gap-12">
        {/* Image Section */}
        {feature.imageUrl ? (
          <div className="relative">
            <div className="aspect-square w-full overflow-hidden rounded-2xl bg-contrast-100 shadow-lg">
              <Image
                alt={`${feature.title} feature`}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                height={400}
                src={feature.imageUrl}
                width={400}
              />
            </div>
          </div>
        ) : null}

        {/* Content Section */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <h1 className="font-heading text-3xl font-medium leading-tight text-foreground @lg:text-4xl">
              {feature.title}
            </h1>
            <p className="text-lg leading-relaxed text-contrast-500 @lg:text-xl">
              {feature.desc}
            </p>
          </div>

          {/* Optional: Add features list or specs here */}
          <div className="rounded-xl bg-contrast-100/50 p-4">
            <p className="text-sm text-contrast-500">
              Click anywhere outside this modal or press ESC to close
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}