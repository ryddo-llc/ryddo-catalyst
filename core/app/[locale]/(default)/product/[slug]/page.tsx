import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { SearchParams } from 'nuqs/server';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { createCompareLoader } from '@/vibes/soul/primitives/compare-drawer/loader';
import { FeaturedProductCarousel } from '@/vibes/soul/sections/featured-product-carousel';
import { ProductDetail } from '@/vibes/soul/sections/product-detail';
import { getSessionCustomerAccessToken } from '~/auth';
import {
  getProductDetailVariant,
  ProductDetailBike,
  ProductDetailScooter,
  ProductFeatures,
} from '~/components/product';
import { getBikeConfig } from '~/components/product/layout/performance-comparison/config';
import { PerformanceComparison } from '~/components/product/layout/performance-comparison/performance-comparison';
import Addons from '~/components/product/shared/addons';
import { ProductShowcase } from '~/components/product-showcase';
import TechSpecs from '~/components/tech-specs';
import { bikeProductTransformer } from '~/data-transformers/bike-product-transformer';
import { findPerformanceImage, transformPerformanceComparisonData } from '~/data-transformers/performance-comparison-transformer';
import { pricesTransformer } from '~/data-transformers/prices-transformer';
import { productCardTransformer } from '~/data-transformers/product-card-transformer';
import { productFeaturesTransformer, resolveFeatureImages } from '~/data-transformers/product-features-transformer';
import { productOptionsTransformer } from '~/data-transformers/product-options-transformer';
import { getPreferredCurrencyCode } from '~/lib/currency';

import { getCompareProducts as getCompareProductsData } from '../../(faceted)/fetch-compare-products';
import { getPageData } from '../../page-data';

import { addToCart } from './_actions/add-to-cart';
import { ProductAnalyticsProvider } from './_components/product-analytics-provider';
import { ProductSchema } from './_components/product-schema';
import { ProductViewed } from './_components/product-viewed';
import { Reviews } from './_components/reviews';
import { WishlistButton } from './_components/wishlist-button';
import { WishlistButtonForm } from './_components/wishlist-button/form';
import {
  getProduct,
  getProductPageMetadata,
  getProductPricingAndRelatedProducts,
  getStreamableProduct,
} from './page-data';

const compareLoader = createCompareLoader();

interface Props {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<SearchParams>;
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

  const baseProduct = await getProduct(productId, customerAccessToken);

  if (!baseProduct) {
    return notFound();
  }

  const streamableProduct = Streamable.from(async () => {
    const options = await searchParams;

    const optionValueIds = Object.keys(options)
      .map((option) => ({
        optionEntityId: Number(option),
        valueEntityId: Number(options[option]),
      }))
      .filter(
        (option) => !Number.isNaN(option.optionEntityId) && !Number.isNaN(option.valueEntityId),
      );

    const variables = {
      entityId: Number(productId),
      optionValueIds,
      useDefaultOptionSelections: true,
    };

    const product = await getStreamableProduct(variables, customerAccessToken);

    if (!product) {
      return notFound();
    }

    return product;
  });

  const streamableProductSku = Streamable.from(async () => (await streamableProduct).sku);

  const streamableProductPricingAndRelatedProducts = Streamable.from(async () => {
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

    const variables = {
      entityId: Number(productId),
      optionValueIds,
      useDefaultOptionSelections: true,
      currencyCode,
    };

    return await getProductPricingAndRelatedProducts(variables, customerAccessToken);
  });

  const streamablePrices = Streamable.from(async () => {
    const product = await streamableProductPricingAndRelatedProducts;

    if (!product) {
      return null;
    }

    return pricesTransformer(product.prices, format) ?? null;
  });

  const streamableImages = Streamable.from(async () => {
    const product = await streamableProduct;

    // Get all images without filtering out the default image
    const allImages = removeEdgesAndNodes(product.images).map((image) => ({
      src: image.url,
      alt: image.altText,
    }));

    // If we have a default image and it's not already in the array, ensure it's first
    if (product.defaultImage) {
      const defaultImageInArray = allImages.find((img) => img.src === product.defaultImage?.url);

      if (defaultImageInArray) {
        // Default image is already in array, reorder to put it first
        const otherImages = allImages.filter((img) => img.src !== product.defaultImage?.url);

        return [
          { src: product.defaultImage.url, alt: product.defaultImage.altText },
          ...otherImages,
        ];
      }

      // Default image not in array, add it as first
      return [{ src: product.defaultImage.url, alt: product.defaultImage.altText }, ...allImages];
    }

    return allImages;
  });

  // Consolidated CTA data - combines label and disabled state
  const streamableCtaData = Streamable.from(async () => {
    const product = await streamableProduct;

    if (product.availabilityV2.status === 'Unavailable') {
      return {
        label: t('ProductDetails.Submit.unavailable'),
        disabled: true,
      };
    }

    if (product.availabilityV2.status === 'Preorder') {
      return {
        label: t('ProductDetails.Submit.preorder'),
        disabled: false,
      };
    }

    if (!product.inventory.isInStock) {
      return {
        label: t('ProductDetails.Submit.outOfStock'),
        disabled: true,
      };
    }

    return {
      label: t('ProductDetails.Submit.addToCart'),
      disabled: false,
    };
  });

  const streameableCtaLabel = Streamable.from(async () => (await streamableCtaData).label);
  const streameableCtaDisabled = Streamable.from(async () => (await streamableCtaData).disabled);

  const streameableAccordions = Streamable.from(async () => {
    const product = await streamableProduct;

    const customFields = removeEdgesAndNodes(product.customFields);

    const specifications = [
      {
        name: t('ProductDetails.Accordions.sku'),
        value: product.sku,
      },
      {
        name: t('ProductDetails.Accordions.weight'),
        value: `${product.weight?.value} ${product.weight?.unit}`,
      },
      {
        name: t('ProductDetails.Accordions.condition'),
        value: product.condition,
      },
      ...customFields.map((field) => ({
        name: field.name,
        value: field.value,
      })),
    ];

    return [
      ...(specifications.length
        ? [
            {
              title: t('ProductDetails.Accordions.specifications'),
              content: (
                <div className="prose @container">
                  <dl className="flex flex-col gap-4">
                    {specifications.map((field, index) => (
                      <div className="grid grid-cols-1 gap-2 @lg:grid-cols-2" key={index}>
                        <dt>
                          <strong>{field.name}</strong>
                        </dt>
                        <dd>{field.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ),
            },
          ]
        : []),
      ...(product.warranty
        ? [
            {
              title: t('ProductDetails.Accordions.warranty'),
              content: (
                <div className="prose" dangerouslySetInnerHTML={{ __html: product.warranty }} />
              ),
            },
          ]
        : []),
    ];
  });

  const streameableRelatedProducts = Streamable.from(async () => {
    const product = await streamableProductPricingAndRelatedProducts;

    if (!product) {
      return [];
    }

    const relatedProducts = removeEdgesAndNodes(product.relatedProducts);

    return productCardTransformer(relatedProducts, format);
  });

  const streamablePopularAccessories = Streamable.from(async () => {
    const accessToken = await getSessionCustomerAccessToken();
    const currency = await getPreferredCurrencyCode();

    const data = await getPageData(currency, accessToken);

    const featuredProducts = removeEdgesAndNodes(data.site.featuredProducts);

    // Take only first 6 products for popular accessories section
    return productCardTransformer(featuredProducts.slice(0, 6), format);
  });

  const streamableAnalyticsData = Streamable.from(async () => {
    const [extendedProduct, pricingProduct] = await Streamable.all([
      streamableProduct,
      streamableProductPricingAndRelatedProducts,
    ]);

    return {
      id: extendedProduct.entityId,
      name: extendedProduct.name,
      sku: extendedProduct.sku,
      brand: extendedProduct.brand?.name ?? '',
      price: pricingProduct?.prices?.price.value ?? 0,
      currency: pricingProduct?.prices?.price.currencyCode ?? '',
    };
  });

  // Determine which product detail component to use based on categories
  const productDetailVariant = getProductDetailVariant(baseProduct);

  // Create streamable bike-specific data for bike products
  const streamableBikeData =
    productDetailVariant === 'bike'
      ? Streamable.from(async () => {
          const product = await streamableProduct;

          return bikeProductTransformer(product);
        })
      : null;

  // Create streamable product features data for bikes and scooters
  const streamableProductFeatures =
    (productDetailVariant === 'bike' || productDetailVariant === 'scooter')
      ? Streamable.from(async () => {
          const [product, images] = await Streamable.all([streamableProduct, streamableImages]);
          
          // Transform features from custom fields
          const featuresData = productFeaturesTransformer(product.customFields);
          
          // Resolve image descriptors to actual BigCommerce images
          return resolveFeatureImages(featuresData, images);
        })
      : null;

  // Create streamable inventory status for all products
  const streamableInventoryStatus = Streamable.from(async () => {
    const product = await streamableProduct;

    return {
      isInStock: product.inventory.isInStock,
      status: product.availabilityV2.status,
    };
  });

  // Create streamable compare products
  const streamableCompareProducts = Streamable.from(async () => {
    const searchParamsData = await searchParams;

    const { compare } = compareLoader(searchParamsData);
    const compareIds = { entityIds: compare ? compare.map((id: string) => Number(id)) : [] };

    if (compareIds.entityIds.length === 0) {
      return [];
    }

    const products = await getCompareProductsData(compareIds, customerAccessToken);

    return products.map((product) => ({
      id: product.entityId.toString(),
      title: product.name,
      image: product.defaultImage
        ? { src: product.defaultImage.url, alt: product.defaultImage.altText }
        : undefined,
      href: product.path,
    }));
  });

  // Direct custom field filtering for TechSpecs (eliminates dependency chain)
  const streamableTechSpecFields = Streamable.from(async () => {
    const product = await streamableProduct;
    const customFields = removeEdgesAndNodes(product.customFields);

    const fieldNames = {
      Power: ['Battery', 'Charge Time', 'Class', 'Motor/s', 'Speed-Tech', 'Pedal Assist'],
      Components: ['Brakes', 'Class', 'Frame Material', 'Speed', 'Tires', 'Throttle'],
      Safety: [
        'Brake Lights',
        'Class',
        'Headlights',
        'Mobile App',
        'Speed',
        'Horn',
        'Tail Light',
        'Turn Signals',
      ],
      Other: ['Color', 'Class', 'Max Load', 'Model', 'Speed', 'Display', 'Seat Height'],
    };

    return {
      Power: customFields.filter((field) => fieldNames.Power.includes(field.name)),
      Components: customFields.filter((field) => fieldNames.Components.includes(field.name)),
      Safety: customFields.filter((field) => fieldNames.Safety.includes(field.name)),
      Other: customFields.filter((field) => fieldNames.Other.includes(field.name)),
    };
  });

  const baseProductData = {
    id: baseProduct.entityId.toString(),
    title: baseProduct.name,
    description: <div dangerouslySetInnerHTML={{ __html: baseProduct.description }} />,
    href: baseProduct.path,
    images: streamableImages,
    price: streamablePrices,
    subtitle: baseProduct.brand?.name,
    rating: baseProduct.reviewSummary.averageRating,
    accordions: streameableAccordions,
    inventoryStatus: streamableInventoryStatus,
  };

  // Enhanced product data for bike components
  const bikeProductData = streamableBikeData
    ? Streamable.from(async () => {
        const bikeData = await streamableBikeData;

        return {
          ...baseProductData,
          backgroundImage: bikeData.backgroundImage,
          bikeSpecs: Streamable.from(() => Promise.resolve(bikeData.bikeSpecs || null)),
          colors: bikeData.colors,
        };
      })
    : baseProductData;

  const productDetailProps = {
    action: addToCart,
    additionalActions: (
      <WishlistButton
        formId={detachedWishlistFormId}
        productId={productId}
        productSku={streamableProductSku}
      />
    ),
    additionalInformationTitle: t('ProductDetails.additionalInformation'),
    compareProducts: streamableCompareProducts,
    compareLabel: 'Compare',
    ctaDisabled: streameableCtaDisabled,
    ctaLabel: streameableCtaLabel,
    decrementLabel: t('ProductDetails.decreaseQuantity'),
    emptySelectPlaceholder: t('ProductDetails.emptySelectPlaceholder'),
    fields: productOptionsTransformer(baseProduct.productOptions),
    incrementLabel: t('ProductDetails.increaseQuantity'),
    maxCompareItems: 3,
    maxCompareLimitMessage: "You've reached the maximum number of products for comparison.",
    prefetch: true,
    product: productDetailVariant === 'bike' ? bikeProductData : baseProductData,
    quantityLabel: t('ProductDetails.quantity'),
    thumbnailLabel: t('ProductDetails.thumbnail'),
    relatedProducts: streameableRelatedProducts,
    popularAccessories: streamablePopularAccessories,
  };

  const renderProductDetail = () => {
    switch (productDetailVariant) {
      case 'bike':
        return <ProductDetailBike {...productDetailProps} />;

      case 'scooter':
        return <ProductDetailScooter {...productDetailProps} />;

      case 'default':
      default:
        return <ProductDetail {...productDetailProps} />;
    }
  };

  return (
    <>
      <ProductAnalyticsProvider data={streamableAnalyticsData}>
        {renderProductDetail()}
      </ProductAnalyticsProvider>

      {/* Enhanced sections for bikes and scooters only */}
      {(productDetailVariant === 'bike' || productDetailVariant === 'scooter') && (
        <>
          <Addons addons={streamablePopularAccessories} name={baseProduct.name} />
          <ProductShowcase
            aria-labelledby="product-images-heading"
            description={baseProduct.plainTextDescription}
            images={streamableImages}
            productName={baseProduct.name}
          />
          {/* Performance Comparison section */}
          <div className="bg-white px-4 py-8 md:px-8">
            <Stream
              fallback={null}
              value={Streamable.all([streamableProduct, streamableImages])}
            >
              {([product, images]) => {
                const customFields = product.customFields;
                const dynamicData = transformPerformanceComparisonData(customFields);
                
                const performanceImage = findPerformanceImage(
                  images,
                  dynamicData.performanceImageDescription
                );
                
                if (dynamicData.metrics.length === 0) {
                  return null;
                }
                
                const configKey = customFields.edges?.find(edge => edge.node.name === 'performance_config_key')?.node.value || product.sku || 'default';
                
                return (
                  <PerformanceComparison
                    config={getBikeConfig(configKey)}
                    dynamicData={dynamicData}
                    metrics={dynamicData.metrics}
                    productImage={performanceImage || {
                      src: product.defaultImage?.url || '/images/default-performance.webp',
                      alt: product.defaultImage?.altText || `${product.name} Performance`,
                    }}
                    productTitle={baseProduct.name}
                  />
                );
              }}
            </Stream>
          </div>
          {/* Product Features section */}
          {streamableProductFeatures && (
            <div className="bg-gray-50">
              <ProductFeatures features={streamableProductFeatures} />
            </div>
          )}
          <TechSpecs powerSpecs={streamableTechSpecFields} />
        </>
      )}

      {/* Common sections for all products */}
      <FeaturedProductCarousel
        cta={{ label: t('RelatedProducts.cta'), href: '/shop-all' }}
        emptyStateSubtitle={t('RelatedProducts.browseCatalog')}
        emptyStateTitle={t('RelatedProducts.noRelatedProducts')}
        nextLabel={t('RelatedProducts.nextProducts')}
        previousLabel={t('RelatedProducts.previousProducts')}
        products={streameableRelatedProducts}
        scrollbarLabel={t('RelatedProducts.scrollbar')}
        title={t('RelatedProducts.title')}
      />

      <Reviews productId={productId} searchParams={searchParams} />

      <Stream
        fallback={null}
        value={Streamable.from(async () =>
          Streamable.all([streamableProduct, streamableProductPricingAndRelatedProducts]),
        )}
      >
        {([extendedProduct, pricingProduct]) => (
          <>
            <ProductSchema
              product={{ ...extendedProduct, prices: pricingProduct?.prices ?? null }}
            />
            <ProductViewed
              product={{ ...extendedProduct, prices: pricingProduct?.prices ?? null }}
            />
          </>
        )}
      </Stream>

      <WishlistButtonForm
        formId={detachedWishlistFormId}
        productId={productId}
        productSku={streamableProductSku}
        searchParams={searchParams}
      />
    </>
  );
}
