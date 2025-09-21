import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { SearchParams } from 'nuqs/server';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { createCompareLoader } from '@/vibes/soul/primitives/compare-drawer/loader';
import { ProductDetail } from '@/vibes/soul/sections/product-detail';
import { getSessionCustomerAccessToken } from '~/auth';
import { getProductDetailVariant } from '~/components/product';
import { DigitalTagLink } from '~/components/product/digital-tag/digital-tag-link';
import Addons from '~/components/product/shared/addons';
import { getFeaturedAddonsAndAccessories } from '~/components/product/shared/addons-query';
import RelatedProducts from '~/components/product/shared/related-products';
import TechSpecs from '~/components/tech-specs';
import { pricesTransformer } from '~/data-transformers/prices-transformer';
import { productCardTransformer } from '~/data-transformers/product-card-transformer';
import { productOptionsTransformer } from '~/data-transformers/product-options-transformer';
import { getPreferredCurrencyCode } from '~/lib/currency';

import { getCompareProducts as getCompareProductsData } from '../../(faceted)/fetch-compare-products';

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

// Revalidate product pages every 30 minutes
export const revalidate = 1800;

// Generate static pages for popular products at build time
export function generateStaticParams() {
  return [
    { locale: 'en', slug: '1' }, // Dummy entry to prevent error
  ];
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

  setRequestLocale(locale);

  const productId = Number(slug);
  const baseProduct = await getProduct(productId, customerAccessToken);

  if (!baseProduct) {
    return notFound();
  }

  // Determine product type and redirect to specialized route
  const productVariant = getProductDetailVariant(baseProduct);

  if (productVariant === 'bike') {
    redirect(`/${locale}/product/bike/${slug}`);
  }

  if (productVariant === 'scooter') {
    redirect(`/${locale}/product/scooter/${slug}`);
  }

  // Continue with generic product page for accessories and other products
  const detachedWishlistFormId = 'product-add-to-wishlist-form';
  const t = await getTranslations('Product');
  const format = await getFormatter();

  // Create product variables for fetching
  const productVariables = Streamable.from(async () => {
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

    return {
      entityId: Number(productId),
      optionValueIds,
      useDefaultOptionSelections: true,
      currencyCode,
    };
  });

  // Streamable data
  const streamableProduct = Streamable.from(async () => {
    const variables = await productVariables;
    const product = await getStreamableProduct(variables, customerAccessToken);
    if (!product) return notFound();
    return product;
  });

  const streamableProductSku = Streamable.from(async () => {
    const product = await streamableProduct;
    return product.sku || '';
  });

  const streamableProductPricingAndRelatedProducts = Streamable.from(async () => {
    const variables = await productVariables;
    return getProductPricingAndRelatedProducts(variables, customerAccessToken);
  });

  const streamablePrices = Streamable.from(async () => {
    const [product, pricingData] = await Streamable.all([
      streamableProduct,
      streamableProductPricingAndRelatedProducts,
    ]);
    return pricesTransformer(pricingData?.prices, format);
  });

  const streamableImages = Streamable.from(async () => {
    const product = await streamableProduct;
    const allImages = removeEdgesAndNodes(product.images).map((image) => ({
      src: image.url.includes('{:size}')
        ? image.url
        : image.url.replace(/\/(\d+w|original)\//, '/{:size}/'),
      alt: image.altText,
    }));

    if (product.defaultImage) {
      const defaultImageInArray = allImages.find((img) => img.src === product.defaultImage?.url);

      if (defaultImageInArray) {
        const otherImages = allImages.filter((img) => img.src !== product.defaultImage?.url);
        return [
          {
            src: product.defaultImage.url.includes('{:size}')
              ? product.defaultImage.url
              : product.defaultImage.url.replace(/\/(\d+w|original)\//, '/{:size}/'),
            alt: product.defaultImage.altText
          },
          ...otherImages,
        ];
      }

      return [
        {
          src: product.defaultImage.url.includes('{:size}')
            ? product.defaultImage.url
            : product.defaultImage.url.replace(/\/(\d+w|original)\//, '/{:size}/'),
          alt: product.defaultImage.altText
        },
        ...allImages
      ];
    }

    return allImages;
  });

  const streamableProductOptions = Streamable.from(async () => {
    const product = await streamableProduct;
    return productOptionsTransformer(product.productOptions);
  });

  const streamableAddons = Streamable.from(async () => {
    const product = await streamableProduct;
    return getFeaturedAddonsAndAccessories(product.entityId);
  });

  const streamableCompareProducts = Streamable.from(async () => {
    const product = await streamableProduct;
    return getCompareProductsData(product.entityId, customerAccessToken);
  });

  const streamableInventoryStatus = Streamable.from(async () => {
    const product = await streamableProduct;
    return {
      isInStock: product.inventory.isInStock,
      status: product.availabilityV2.status,
    };
  });

  return (
    <ProductAnalyticsProvider data={streamableProduct}>
      <ProductViewed product={streamableProduct} />
      <ProductSchema product={streamableProduct} />

      <ProductDetail
        action={addToCart}
        additionalActions={<WishlistButtonForm formId={detachedWishlistFormId} />}
        product={{
          id: baseProduct.entityId.toString(),
          title: baseProduct.name,
          href: baseProduct.path,
          images: streamableImages,
          price: streamablePrices,
          subtitle: baseProduct.brand?.name,
          summary: Streamable.from(async () => {
            const product = await streamableProduct;
            return product.plainTextDescription;
          }),
          description: Streamable.from(async () => {
            const product = await streamableProduct;
            return product.description;
          }),
          inventoryStatus: streamableInventoryStatus,
        }}
        fields={streamableProductOptions}
        ctaLabel={Streamable.from(async () => {
          const inventoryStatus = await streamableInventoryStatus;
          if (!inventoryStatus.isInStock) {
            return inventoryStatus.status === 'Preorder' ? t('preorder') : t('outOfStock');
          }
          return t('addToCart');
        })}
        ctaDisabled={Streamable.from(async () => {
          const inventoryStatus = await streamableInventoryStatus;
          return !inventoryStatus.isInStock;
        })}
      />

      <Stream value={streamableAddons}>
        {(addons) => <Addons addons={addons} />}
      </Stream>

      <TechSpecs
        product={{
          entityId: baseProduct.entityId,
          name: baseProduct.name,
        }}
        productSku={streamableProductSku}
      />

      <Reviews productId={baseProduct.entityId} />

      <Stream value={streamableProductPricingAndRelatedProducts}>
        {(data) =>
          data?.relatedProducts && data.relatedProducts.length > 0 && (
            <RelatedProducts
              products={productCardTransformer(data.relatedProducts, format)}
              title={t('relatedProducts')}
            />
          )
        }
      </Stream>
    </ProductAnalyticsProvider>
  );
}