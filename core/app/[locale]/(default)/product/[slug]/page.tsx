import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { SearchParams } from 'nuqs/server';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { createCompareLoader } from '@/vibes/soul/primitives/compare-drawer/loader';
import { ProductDetail } from '@/vibes/soul/sections/product-detail';
import { getSessionCustomerAccessToken } from '~/auth';
import {
  getProductDetailVariant,
  ProductDetailBike,
  ProductDetailScooter,
  ProductFeatures,
} from '~/components/product';
import { getPerformanceConfig } from '~/components/product/layout/performance-comparison/config';
import { PerformanceComparison } from '~/components/product/layout/performance-comparison/performance-comparison';
import { PerformanceComparisonSkeleton } from '~/components/product/layout/performance-comparison/performance-comparison-skeleton';
import Addons from '~/components/product/shared/addons';
import RelatedProducts from '~/components/product/shared/related-products';
import { ProductShowcase } from '~/components/product-showcase';
import TechSpecs from '~/components/tech-specs';
import { bikeProductTransformer } from '~/data-transformers/bike-product-transformer';
import { scooterProductTransformer } from '~/data-transformers/scooter-product-transformer';
import {
  findPerformanceImage,
  transformPerformanceComparisonData,
} from '~/data-transformers/performance-comparison-transformer';
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
  getProductsByCategory,
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

  // Consolidated stream for all product data to eliminate duplicate API calls
  const streamableAllProductData = Streamable.from(async () => {
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

    // Fetch both product and pricing data simultaneously
    const [product, pricingData] = await Promise.all([
      getStreamableProduct(variables, customerAccessToken),
      getProductPricingAndRelatedProducts(variables, customerAccessToken),
    ]);

    if (!product) {
      return notFound();
    }

    return {
      product,
      pricingData,
    };
  });

  // Derived streams from consolidated data
  const streamableProduct = Streamable.from(async () => {
    const data = await streamableAllProductData;

    return data.product;
  });

  const streamableProductSku = Streamable.from(async () => {
    const data = await streamableAllProductData;

    return data.product.sku;
  });

  const streamableProductPricingAndRelatedProducts = Streamable.from(async () => {
    const data = await streamableAllProductData;

    return data.pricingData;
  });

  const streamablePrices = Streamable.from(async () => {
    const data = await streamableAllProductData;

    if (!data.pricingData) {
      return null;
    }

    return pricesTransformer(data.pricingData.prices, format) ?? null;
  });

  const streamableImages = Streamable.from(async () => {
    const data = await streamableAllProductData;
    const product = data.product;

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
    const data = await streamableAllProductData;
    const product = data.product;

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
    const data = await streamableAllProductData;
    const product = data.product;

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
    const data = await streamableAllProductData;
    const pricingData = data.pricingData;

    if (!pricingData) {
      return [];
    }

    const relatedProducts = removeEdgesAndNodes(pricingData.relatedProducts);
    
    // If we have related products, return them
    if (relatedProducts.length > 0) {
      return productCardTransformer(relatedProducts, format);
    }
    
    // Otherwise, fetch products from the same category as fallback
    const categories = removeEdgesAndNodes(pricingData.categories);
    
    if (categories.length > 0) {
      const categoryId = categories[0]?.entityId; // Use first category
      
      if (categoryId) {
        const currencyCode = await getPreferredCurrencyCode();
        const categoryProducts = await getProductsByCategory(
          categoryId,
          productId,
          currencyCode,
          customerAccessToken
        );
      
        return productCardTransformer(categoryProducts, format);
      }
    }
    
    return [];
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
    const data = await streamableAllProductData;
    const product = data.product;
    const pricingData = data.pricingData;

    return {
      id: product.entityId,
      name: product.name,
      sku: product.sku,
      brand: product.brand?.name ?? '',
      price: pricingData?.prices?.price.value ?? 0,
      currency: pricingData?.prices?.price.currencyCode ?? '',
    };
  });

  // Determine which product detail component to use based on categories
  const productDetailVariant = getProductDetailVariant(baseProduct);

  // Create streamable bike-specific data for bike products
  const streamableBikeData =
    productDetailVariant === 'bike'
      ? Streamable.from(async () => {
          const data = await streamableAllProductData;
          const product = data.product;

          return bikeProductTransformer(product);
        })
      : null;

  // Create streamable scooter-specific data for scooter products
  const streamableScooterData =
    productDetailVariant === 'scooter'
      ? Streamable.from(async () => {
          const data = await streamableAllProductData;
          const product = data.product;

          return scooterProductTransformer(product);
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

  // Create streamable performance comparison data for bikes and scooters
  const streamablePerformanceComparison =
    (productDetailVariant === 'bike' || productDetailVariant === 'scooter')
      ? Streamable.from(async () => {
          const [product, images] = await Streamable.all([streamableProduct, streamableImages]);
          const dynamicData = transformPerformanceComparisonData(product.customFields);
          
          if (dynamicData.metrics.length === 0) return null;
          
          const configKey = product.customFields.edges?.find((edge) => edge.node.name === 'performance_config_key')?.node.value || product.sku || 'default';
          const performanceImage = findPerformanceImage(images, dynamicData.performanceImageDescription);

          return {
            config: getPerformanceConfig(configKey),
            dynamicData,
            metrics: dynamicData.metrics,
            productImage: performanceImage || {
              src: product.defaultImage?.url || '/images/default-performance.webp',
              alt: product.defaultImage?.altText || `${product.name} Performance`,
            },
            productTitle: product.name,
          };
        })
      : null;

  // Create streamable inventory status for all products
  const streamableInventoryStatus = Streamable.from(async () => {
    const data = await streamableAllProductData;
    const product = data.product;

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
    const data = await streamableAllProductData;
    const product = data.product;
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

  const defaultProductData = baseProductData;

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

  // Enhanced product data for scooter components
  const scooterProductData = streamableScooterData
    ? Streamable.from(async () => {
        const scooterData = await streamableScooterData;

        return {
          ...baseProductData,
          backgroundImage: scooterData.backgroundImage,
          scooterSpecs: Streamable.from(() => Promise.resolve(scooterData.scooterSpecs || null)),
          colors: scooterData.colors,
        };
      })
    : baseProductData;

  const baseProps = {
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
    fields: Streamable.from(() => productOptionsTransformer(baseProduct.productOptions)),
    incrementLabel: t('ProductDetails.increaseQuantity'),
    maxCompareItems: 3,
    maxCompareLimitMessage: "You've reached the maximum number of products for comparison.",
    prefetch: true,
    quantityLabel: t('ProductDetails.quantity'),
    thumbnailLabel: t('ProductDetails.thumbnail'),
    relatedProducts: streameableRelatedProducts,
    popularAccessories: streamablePopularAccessories,
  };

  const renderProductDetail = () => {
    switch (productDetailVariant) {
      case 'bike':
        return <ProductDetailBike {...baseProps} product={bikeProductData} />;

      case 'scooter':
        return <ProductDetailScooter {...baseProps} product={scooterProductData} />;

      case 'default':
      default:
        return <ProductDetail {...baseProps} product={defaultProductData} />;
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
          {streamablePerformanceComparison && (
            <Stream fallback={<PerformanceComparisonSkeleton />} value={streamablePerformanceComparison}>
              {(performanceData) => performanceData && (
                <PerformanceComparison
                  config={performanceData.config}
                  dynamicData={performanceData.dynamicData}
                  metrics={performanceData.metrics}
                  productImage={performanceData.productImage}
                  productTitle={performanceData.productTitle}
                />
              )}
            </Stream>
          )}
          {/* Product Features section */}
          {streamableProductFeatures && (
            <div className="bg-gray-50">
              <ProductFeatures features={streamableProductFeatures} />
            </div>
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
        products={streameableRelatedProducts}
        showCompare={true}
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
