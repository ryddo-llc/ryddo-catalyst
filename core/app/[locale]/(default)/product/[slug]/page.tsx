import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { createCompareLoader } from '@/vibes/soul/primitives/compare-drawer/loader';
import { ProductDetail } from '@/vibes/soul/sections/product-detail';
import { getSessionCustomerAccessToken } from '~/auth';
import { Image } from '~/components/image';
import {
  getProductDetailVariant,
  ProductDetail as ProductDetailCustom,
} from '~/components/product';
import { DigitalTagLink } from '~/components/product/digital-tag/digital-tag-link';
import { getPerformanceConfig } from '~/components/product/layout/performance-comparison/config';
import { PerformanceComparison } from '~/components/product/layout/performance-comparison/performance-comparison';
import { PerformanceComparisonSkeleton } from '~/components/product/layout/performance-comparison/performance-comparison-skeleton';
import Addons from '~/components/product/shared/addons';
import { getFeaturedAddonsAndAccessories } from '~/components/product/shared/addons-query';
import RelatedProducts from '~/components/product/shared/related-products';
import { ProductFeatureCarousel } from '~/components/product-feature-carousel';
import { ProductShowcase } from '~/components/product-showcase';
import TechSpecs from '~/components/tech-specs';
import {
  findPerformanceImage,
  transformPerformanceComparisonData,
} from '~/data-transformers/performance-comparison-transformer';
import { pricesTransformer } from '~/data-transformers/prices-transformer';
import { productCardTransformer } from '~/data-transformers/product-card-transformer';
import { productOptionsTransformer } from '~/data-transformers/product-options-transformer';
import { productTransformer } from '~/data-transformers/product-transformer';
import { getPreferredCurrencyCode } from '~/lib/currency';
import { resolveCarouselImages } from '~/lib/extract-feature-fields';
import { imageManagerImageUrl } from '~/lib/store-assets';

import { getCompareProducts as getCompareProductsData } from '../../(faceted)/fetch-compare-products';

import { addToCart } from './_actions/add-to-cart';
import { ProductInventoryProvider } from './_components/inventory-provider';
import { ProductAnalyticsProvider } from './_components/product-analytics-provider';
import { ProductSchema } from './_components/product-schema';
import { ProductViewed } from './_components/product-viewed';
import { Reviews } from './_components/reviews';
import { WishlistButton } from './_components/wishlist-button';
import { WishlistButtonForm } from './_components/wishlist-button/form';
import { calculateCtaState } from './_lib/cta-state';
import { processCustomFields } from './_lib/custom-fields-processing';
import { processProductImages } from './_lib/image-processing';
import {
  getProduct,
  getProductPageMetadata,
  getProductPricingAndRelatedProducts,
  getProductsByCategory,
} from './page-data';

const compareLoader = createCompareLoader();

interface Props {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<SearchParams>;
}

// Product content revalidates every hour (pricing has shorter 5min revalidation)
export const revalidate = 3600;

// Generate static pages for popular products at build time
export function generateStaticParams() {
  // Default: minimal static generation (one dummy page to satisfy Next.js)
  // All other product pages will be generated on-demand with ISR (revalidate: 3600)
  return [{ locale: 'en', slug: '1' }];

  // PERFORMANCE BOOST: Pre-generate your top-selling products at build time
  // This makes the first visit to these pages instant (no server rendering needed)
  /*
  // Example: Pre-generate 10-20 most popular products
  const locales = ['en']; // Add more locales as needed: ['en', 'es', 'fr']
  const topProductIds = [
    '123', // Replace with your actual best-selling product IDs
    '456', // Check BigCommerce dashboard > Products > Sort by Sales
    '789',
    // ... add 10-20 of your top products
  ];

  return locales.flatMap(locale =>
    topProductIds.map(slug => ({
      locale,
      slug,
    }))
  );
  */
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const customerAccessToken = await getSessionCustomerAccessToken();

  const productId = Number(slug);

  const product = await getProductPageMetadata(productId, customerAccessToken);

  if (!product) {
    return notFound();
  }

  const { pageTitle, metaDescription, metaKeywords } = product.seo;
  const { url, altText: alt } = product.defaultImage || {};

  return {
    title: pageTitle || product.name,
    description: metaDescription || `${product.plainTextDescription.slice(0, 150)}...`,
    keywords: metaKeywords ? metaKeywords.split(',') : null,
    openGraph: {
      type: 'website',
      title: pageTitle || product.name,
      description: metaDescription || `${product.plainTextDescription.slice(0, 150)}...`,
      siteName: 'Ryddo',
      ...(url && {
        images: [
          {
            url,
            alt,
            width: 1200,
            height: 630,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle || product.name,
      description: metaDescription || `${product.plainTextDescription.slice(0, 150)}...`,
      ...(url && {
        images: [url],
      }),
    },
    alternates: {
      canonical: product.path,
    },
  };
}

export default async function Product({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const customerAccessToken = await getSessionCustomerAccessToken();
  const detachedWishlistFormId = 'product-add-to-wishlist-form';

  setRequestLocale(locale);

  const t = await getTranslations('Product');
  const format = await getFormatter();

  const productId = Number(slug);

  // Build variables immediately (synchronous)
  const options = await searchParams;
  const optionValueIds = Object.keys(options)
    .map((option) => ({
      optionEntityId: Number(option),
      valueEntityId: Number(options[option]),
    }))
    .filter(
      (option) => !Number.isNaN(option.optionEntityId) && !Number.isNaN(option.valueEntityId),
    );

  const currencyCode = await getPreferredCurrencyCode();

  const productVariables = {
    entityId: Number(productId),
    optionValueIds,
    useDefaultOptionSelections: true,
    currencyCode,
  };

  // Fetch main product and pricing in parallel immediately
  const [product, pricingData] = await Promise.all([
    getProduct(productVariables, customerAccessToken),
    getProductPricingAndRelatedProducts(productVariables, customerAccessToken),
  ]);

  if (!product) {
    return notFound();
  }

  // Process all data synchronously using helper functions
  const processedImages = processProductImages(product);
  const { features, showcaseDescription, techSpecFields, accordions } = processCustomFields(
    product,
    t,
  );
  const carouselFeatures = resolveCarouselImages(features, processedImages);
  const ctaData = calculateCtaState(product, t);

  // Create streamables (instant resolution)
  const streamableProductSku = Streamable.from(() => Promise.resolve(product.sku || ''));
  const streamableImages = Streamable.from(() => Promise.resolve(processedImages));
  const streamablePrices = Streamable.from(() =>
    Promise.resolve(pricingData ? (pricesTransformer(pricingData.prices, format) ?? null) : null),
  );
  const streamableCarouselFeatures = Streamable.from(() => Promise.resolve(carouselFeatures));
  const streamableCtaLabel = Streamable.from(() => Promise.resolve(ctaData.label));
  const streamableCtaDisabled = Streamable.from(() => Promise.resolve(ctaData.disabled));
  const streamableWarranty = Streamable.from(() => Promise.resolve(product.warranty || null));
  const streamableShowcaseDescription = Streamable.from(() => Promise.resolve(showcaseDescription));
  const streamableAccordions = Streamable.from(() => Promise.resolve(accordions));
  const streamableTechSpecFields = Streamable.from(() => Promise.resolve(techSpecFields));
  const streamableInventoryStatus = Streamable.from(() =>
    Promise.resolve({
      isInStock: product.inventory.isInStock,
      status: product.availabilityV2.status,
    }),
  );

  // Related products - optimize with early data
  const relatedProductsRaw = pricingData ? removeEdgesAndNodes(pricingData.relatedProducts) : [];
  const categories = pricingData ? removeEdgesAndNodes(pricingData.categories) : [];

  const streamableRelatedProducts = Streamable.from(async () => {
    // If we have related products, return them immediately
    if (relatedProductsRaw.length > 0) {
      return productCardTransformer(relatedProductsRaw, format);
    }

    // Otherwise, fetch products from the same category as fallback
    if (categories.length > 0) {
      const categoryId = categories[0]?.entityId;

      if (categoryId) {
        const categoryProducts = await getProductsByCategory(
          categoryId,
          productId,
          currencyCode,
          customerAccessToken,
        );

        return productCardTransformer(categoryProducts, format);
      }
    }

    return [];
  });

  // Popular accessories - can fetch independently
  const streamablePopularAccessories = Streamable.from(async () => {
    return getFeaturedAddonsAndAccessories(currencyCode, customerAccessToken);
  });

  // Analytics data (synchronous from already-fetched data)
  const analyticsData = {
    id: product.entityId,
    name: product.name,
    sku: product.sku,
    brand: product.brand?.name ?? '',
    price: pricingData?.prices?.price.value ?? 0,
    currency: pricingData?.prices?.price.currencyCode ?? '',
  };

  const streamableAnalyticsData = Streamable.from(() => Promise.resolve(analyticsData));

  // Determine which product detail component to use
  const productDetailVariant = getProductDetailVariant(product);

  // Product data for e-rides (synchronous transformation)
  const streamableProductData =
    productDetailVariant === 'e-rides'
      ? Streamable.from(() => Promise.resolve(productTransformer(product)))
      : null;

  // Performance comparison (synchronous with already-processed data)
  const streamablePerformanceComparison =
    productDetailVariant === 'e-rides'
      ? Streamable.from(() => {
          const dynamicData = transformPerformanceComparisonData(product.customFields);

          if (dynamicData.metrics.length === 0) return Promise.resolve(null);

          const performanceImage = findPerformanceImage(
            processedImages,
            dynamicData.performanceImageDescription,
          );

          return Promise.resolve({
            config: getPerformanceConfig(),
            dynamicData,
            metrics: dynamicData.metrics,
            productImage: performanceImage || {
              src: product.defaultImage?.url || '/images/default-performance.webp',
              alt: product.defaultImage?.altText || `${product.name} Performance`,
            },
            productTitle: product.name,
          });
        })
      : null;

  // Compare products
  const streamableCompareProducts = Streamable.from(async () => {
    const { compare } = compareLoader(options);
    const compareIds = { entityIds: compare ? compare.map((id: string) => Number(id)) : [] };

    if (compareIds.entityIds.length === 0) {
      return [];
    }

    const compareProducts = await getCompareProductsData(compareIds, customerAccessToken);

    return compareProducts.map((compareProduct) => ({
      id: compareProduct.entityId.toString(),
      title: compareProduct.name,
      image: compareProduct.defaultImage
        ? { src: compareProduct.defaultImage.url, alt: compareProduct.defaultImage.altText }
        : undefined,
      href: compareProduct.path,
    }));
  });

  // Base product data object
  const baseProductData = {
    id: product.entityId.toString(),
    title: product.name,
    description: <div dangerouslySetInnerHTML={{ __html: product.description }} />,
    href: product.path,
    images: streamableImages,
    price: streamablePrices,
    subtitle: product.brand?.name,
    rating: product.reviewSummary.averageRating,
    reviewCount: product.reviewSummary.numberOfReviews,
    accordions: streamableAccordions,
    inventoryStatus: streamableInventoryStatus,
    brandLogo: product.brand?.defaultImage
      ? {
          url: product.brand.defaultImage.url,
          altText: product.brand.defaultImage.altText,
        }
      : null,
  };

  const defaultProductData = baseProductData;

  // Enhanced product data for bike and scooter components
  const enhancedProductData = streamableProductData
    ? Streamable.from(async () => {
        const productData = await streamableProductData;
        const warranty = await streamableWarranty;

        return {
          ...baseProductData,
          backgroundImage: productData.backgroundImage,
          productSpecs: Streamable.from(() => Promise.resolve(productData.productSpecs || null)),
          colors: productData.colors,
          warranty,
          wheelSpecs: productData.wheelSpecs,
        };
      })
    : baseProductData;

  const baseProps = {
    action: addToCart,
    additionalInformationTitle: t('ProductDetails.additionalInformation'),
    compareProducts: streamableCompareProducts,
    compareLabel: 'Compare',
    ctaDisabled: streamableCtaDisabled,
    ctaLabel: streamableCtaLabel,
    decrementLabel: t('ProductDetails.decreaseQuantity'),
    emptySelectPlaceholder: t('ProductDetails.emptySelectPlaceholder'),
    fields: Streamable.from(() => productOptionsTransformer(product.productOptions)),
    incrementLabel: t('ProductDetails.increaseQuantity'),
    maxCompareItems: 3,
    maxCompareLimitMessage: "You've reached the maximum number of products for comparison.",
    prefetch: true,
    quantityLabel: t('ProductDetails.quantity'),
    thumbnailLabel: t('ProductDetails.thumbnail'),
    relatedProducts: streamableRelatedProducts,
    popularAccessories: streamablePopularAccessories,
    // Image overlay actions
    wishlistButton: (
      <WishlistButton
        formId={detachedWishlistFormId}
        productId={productId}
        productSku={streamableProductSku}
      />
    ),
    digitalTagLink: <DigitalTagLink productSlug={slug} />,
  };

  const { wishlistButton, digitalTagLink, ...basePropsWithoutOverlay } = baseProps;

  const renderProductDetail = () => {
    switch (productDetailVariant) {
      case 'e-rides':
        return <ProductDetailCustom {...baseProps} product={enhancedProductData} />;

      case 'default':
      default:
        // For default products, keep wishlist and digital tag in additionalActions
        return (
          <ProductDetail
            {...basePropsWithoutOverlay}
            additionalActions={
              <div className="flex items-center gap-2">
                {wishlistButton}
                {digitalTagLink}
              </div>
            }
            product={defaultProductData}
          />
        );
    }
  };

  return (
    <>
      <div className="fixed inset-0 left-1/2 -z-10 w-screen -translate-x-1/2">
        <Image
          alt=""
          aria-hidden="true"
          className="object-cover object-center"
          fill
          priority
          src={imageManagerImageUrl('home-page-bg.png')}
        />
      </div>
      <ProductInventoryProvider streamableInventoryStatus={streamableInventoryStatus} />
      <ProductAnalyticsProvider data={streamableAnalyticsData}>
        {renderProductDetail()}
      </ProductAnalyticsProvider>

      {/* Enhanced sections for e-rides only */}
      {productDetailVariant === 'e-rides' && (
        <>
          <Addons addons={streamablePopularAccessories} name={product.brand?.name} />

          <Stream
            fallback={<div className="h-[100vh] max-h-[900px] bg-gray-100" />}
            value={streamableShowcaseDescription}
          >
            {(showcaseDesc) => (
              <ProductShowcase
                aria-labelledby="product-images-heading"
                images={streamableImages}
                productName={product.name}
                showcaseDescription={showcaseDesc || undefined}
              />
            )}
          </Stream>

          {/* Bike Feature Variants section */}
          <ProductFeatureCarousel bigCommerceFeatures={streamableCarouselFeatures} />

          {/* Performance Comparison section - Stream handles its own loading state */}
          {streamablePerformanceComparison && (
            <Stream
              fallback={<PerformanceComparisonSkeleton />}
              value={streamablePerformanceComparison}
            >
              {(performanceData) =>
                performanceData && (
                  <PerformanceComparison
                    config={performanceData.config}
                    dynamicData={performanceData.dynamicData}
                    metrics={performanceData.metrics}
                    productImage={performanceData.productImage}
                    productTitle={performanceData.productTitle}
                  />
                )
              }
            </Stream>
          )}

          <TechSpecs powerSpecs={streamableTechSpecFields} />
        </>
      )}

      {/* Related Products section with same styling as popular products */}
      <RelatedProducts
        compareLabel="Compare"
        compareProducts={streamableCompareProducts}
        maxCompareLimitMessage="You've reached the maximum number of products for comparison."
        maxItems={3}
        products={streamableRelatedProducts}
        showCompare={true}
      />

      {/* Defer reviews rendering - below the fold */}
      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100" />}>
        <Reviews productId={productId} searchParams={searchParams} />
      </Suspense>

      {/* Product Schema and Analytics - instant with already-fetched data */}
      <ProductSchema product={{ ...product, prices: pricingData?.prices ?? null }} />
      <ProductViewed product={{ ...product, prices: pricingData?.prices ?? null }} />

      <WishlistButtonForm
        formId={detachedWishlistFormId}
        productId={productId}
        productSku={streamableProductSku}
        searchParams={searchParams}
      />
    </>
  );
}
