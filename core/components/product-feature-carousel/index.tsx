'use client';

import { useState } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { CategoryCardCarousel } from '@/vibes/soul/sections/category-card-carousel';
import type { ParsedFeature } from '~/lib/extract-feature-fields';

import { FeatureDetailModal } from '../feature-detail-modal';


const productFeatureVariants = [
  {
    href: '/features/battery',
    title: 'Battery',
    subtitle: 'Detachable with up\nto 70+ miles of range\nIn Eco Mode',
    image: {
      src: '/images/battery-feature.jpg',
      alt: 'High-capacity bike battery'
    },
    showPlusButton: true,
    cardBackground: 'white' as const
  },
  {
    href: '/features/lights',
    title: 'Headlight & Tail Light',
    subtitle: 'Roxim Z4E Elite, 600 Lumen LED headlight & Tail Light',
    image: {
      src: '/images/lights-feature.jpg',
      alt: 'LED headlight and taillight system'
    },
    showPlusButton: true,
    cardBackground: 'white' as const
  },
  {
    href: '/features/tires',
    title: 'Off-road BDGR Tires',
    subtitle: '20x4.5 Front & 20x5 Rear BDGR off-road tires.',
    image: {
      src: '/images/tires-feature.jpg',
      alt: 'All-terrain off-road tires'
    },
    showPlusButton: true,
    cardBackground: 'white' as const
  },
  {
    href: '/features/suspension',
    title: 'Suspension',
    subtitle: 'Smooth ride over rough terrain',
    image: {
      src: '/images/suspension-feature.jpg',
      alt: 'Advanced suspension system'
    },
    showPlusButton: true,
    cardBackground: 'white' as const
  }
];

interface ProductFeatureCarouselProps {
  bigCommerceFeatures?: Streamable<ParsedFeature[]>;
}

export function ProductFeatureCarousel({ bigCommerceFeatures }: ProductFeatureCarouselProps) {
  const [selectedFeature, setSelectedFeature] = useState<ParsedFeature | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFeatureClick = (feature: ParsedFeature) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFeature(null);
  };

  return (
    <>
      <div className="pt-24 pb-16" style={{ backgroundColor: '#E8F4FF' }}>
        <div className="pl-12 pr-0">
          <Stream
            fallback={
              <CategoryCardCarousel
                aspectRatio="7:11"
                cards={productFeatureVariants.map((variant) => ({
                  ...variant,
                  onPlusClick: () => {
                    // Convert variant to ParsedFeature format for modal
                    const feature: ParsedFeature = {
                      title: variant.title,
                      desc: variant.subtitle,
                      img: variant.image.src.split('/').pop()?.replace('-feature.jpg', '') || '',
                      imageUrl: variant.image.src,
                    };

                    handleFeatureClick(feature);
                  },
                }))}
                carouselColorScheme="light"
                nextLabel="Next Feature"
                previousLabel="Previous Feature"
                scrollbarLabel="Browse bike features"
                showButtons={true}
                showScrollbar={true}
                textColorScheme="dark"
              />
            }
            value={bigCommerceFeatures || []}
          >
            {(features) => {
              // Transform BigCommerce features to carousel format or use fallback
              const cardsToUse =
                features.length > 0
                  ? features.map((feature) => ({
                      href: `/features/${feature.title.toLowerCase().replace(/\s+/g, '-')}`,
                      title: feature.title,
                      subtitle: feature.desc,
                      image: {
                        src: feature.imageUrl || `/images/${feature.img}-feature.jpg`,
                        alt: `${feature.title} feature`,
                      },
                      showPlusButton: true,
                      cardBackground: 'white' as const,
                      onPlusClick: () => {
                        handleFeatureClick(feature);
                      },
                    }))
                  : productFeatureVariants.map((variant) => ({
                      ...variant,
                      onPlusClick: () => {
                        // Convert variant to ParsedFeature format for modal
                        const feature: ParsedFeature = {
                          title: variant.title,
                          desc: variant.subtitle,
                          img: variant.image.src.split('/').pop()?.replace('-feature.jpg', '') || '',
                          imageUrl: variant.image.src,
                        };

                        handleFeatureClick(feature);
                      },
                    }));

              return (
                <CategoryCardCarousel
                  aspectRatio="7:11"
                  cards={cardsToUse}
                  carouselColorScheme="light"
                  nextLabel="Next Feature"
                  previousLabel="Previous Feature"
                  scrollbarLabel="Browse bike features"
                  showButtons={true}
                  showScrollbar={true}
                  textColorScheme="dark"
                />
              );
            }}
          </Stream>
        </div>
      </div>

      <FeatureDetailModal
        feature={selectedFeature}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}