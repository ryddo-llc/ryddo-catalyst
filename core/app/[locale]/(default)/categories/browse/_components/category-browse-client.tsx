'use client';

import { useEffect, useRef, useState, useTransition } from 'react';

import { CarouselItem } from '@/vibes/soul/primitives/carousel';

import {
  type BrowseBrand,
  fetchBrandsForCategory,
} from '../_actions/fetch-brands-for-category';
import {
  type BrowseProduct,
  fetchProductsForBrand,
} from '../_actions/fetch-products-for-brand';

import { BrowseCard } from './browse-card';
import { BrowseSection } from './browse-section';

interface CategoryData {
  entityId: number;
  name: string;
  path: string;
  image: { url: string; altText: string } | null;
}

interface CategoryBrowseClientProps {
  initialCategories: CategoryData[];
  initialBrands: BrowseBrand[];
  initialProducts: BrowseProduct[];
}

export function CategoryBrowseClient({
  initialCategories,
  initialBrands,
  initialProducts,
}: CategoryBrowseClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<BrowseBrand | null>(null);
  const [brands, setBrands] = useState<BrowseBrand[]>(initialBrands);
  const [products, setProducts] = useState<BrowseProduct[]>(initialProducts);

  const [isPendingBrands, startBrandsTransition] = useTransition();
  const [isPendingProducts, startProductsTransition] = useTransition();

  const brandsSectionRef = useRef<HTMLDivElement>(null);
  const productsSectionRef = useRef<HTMLDivElement>(null);

  // Track whether this is a user-triggered update (not initial load)
  const brandsUpdatedByUser = useRef(false);
  const productsUpdatedByUser = useRef(false);

  function handleCategorySelect(category: CategoryData) {
    setSelectedCategory(category);
    setSelectedBrand(null);
    brandsUpdatedByUser.current = true;

    startBrandsTransition(async () => {
      const result = await fetchBrandsForCategory(category.entityId);

      setBrands(result);
      // Reset products to initial when category changes
      setProducts(initialProducts);
    });
  }

  function handleBrandSelect(brand: BrowseBrand) {
    if (!selectedCategory) return;

    setSelectedBrand(brand);
    productsUpdatedByUser.current = true;

    startProductsTransition(async () => {
      const result = await fetchProductsForBrand(
        selectedCategory.entityId,
        brand.entityId,
      );

      setProducts(result);
    });
  }

  // Scroll to brands section when brands data updates from user action
  useEffect(() => {
    if (brandsUpdatedByUser.current && brandsSectionRef.current) {
      brandsUpdatedByUser.current = false;
      brandsSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [brands]);

  // Scroll to products section when products data updates from user action
  useEffect(() => {
    if (productsUpdatedByUser.current && productsSectionRef.current) {
      productsUpdatedByUser.current = false;
      productsSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [products]);

  return (
    <div className="pb-80 @container">
      {/* Level 1: Categories */}
      <BrowseSection
        highlightWord="e-Ride"
        subtitle="Not just bikes, scooters, ATV's, mopeds & more."
        title="Premium"
      >
        {initialCategories.map((category) => (
          <CarouselItem
            className="basis-full @sm:basis-1/2 @md:basis-1/3 @4xl:basis-1/4"
            key={category.entityId}
          >
            <BrowseCard
              image={
                category.image
                  ? { src: category.image.url, alt: category.image.altText }
                  : null
              }
              isSelected={selectedCategory?.entityId === category.entityId}
              onClick={() => handleCategorySelect(category)}
              title={category.name}
            />
          </CarouselItem>
        ))}
      </BrowseSection>

      {/* Level 2: Brands */}
      <div className="bg-[hsl(var(--contrast-100)/0.5)]">
        <BrowseSection
          highlightWord="e-Ride"
          key={`brands-${selectedCategory?.entityId ?? 'all'}`}
          loading={isPendingBrands}
          ref={brandsSectionRef}
          subtitle={
            selectedCategory
              ? `Brands in ${selectedCategory.name}`
              : 'Not just bikes, scooters, ATV\'s, mopeds & more.'
          }
          title="Premium"
        >
          {brands.map((brand) => (
            <CarouselItem
              className="basis-full @sm:basis-1/2 @md:basis-1/3 @4xl:basis-1/4"
              key={brand.entityId}
            >
              <BrowseCard
                image={
                  brand.defaultImage
                    ? { src: brand.defaultImage.url, alt: brand.defaultImage.altText }
                    : null
                }
                isSelected={selectedBrand?.entityId === brand.entityId}
                onClick={() => handleBrandSelect(brand)}
                title={brand.name}
              />
            </CarouselItem>
          ))}
        </BrowseSection>
      </div>

      {/* Level 3: Products */}
      <BrowseSection
        highlightWord="e-Ride"
        key={`products-${selectedBrand?.entityId ?? 'all'}`}
        loading={isPendingProducts}
        ref={productsSectionRef}
        subtitle={
          selectedBrand
            ? `${selectedBrand.name} products`
            : 'Not just bikes, scooters, ATV\'s, mopeds & more.'
        }
        title="Premium"
      >
        {products.map((product) => (
          <CarouselItem
            className="basis-full @sm:basis-1/2 @md:basis-1/3 @4xl:basis-1/4"
            key={product.entityId}
          >
            <BrowseCard
              href={product.path}
              image={
                product.defaultImage
                  ? { src: product.defaultImage.url, alt: product.defaultImage.altText }
                  : null
              }
              subtitle={product.brand?.name}
              title={product.name}
            />
          </CarouselItem>
        ))}
      </BrowseSection>
    </div>
  );
}
