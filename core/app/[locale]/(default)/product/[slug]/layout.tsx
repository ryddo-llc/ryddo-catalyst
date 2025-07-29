import { notFound } from 'next/navigation';
import React from 'react';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { getSessionCustomerAccessToken } from '~/auth';
import { getProductDetailVariant } from '~/components/product';
import { ProductAddonsSection, ProductShowcaseSection } from '~/components/product/shared/product-sections';

import { getProduct } from './page-data';

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string; locale: string }>;
}

export default async function ProductLayout({ children, params }: Props) {
  const { slug } = await params;
  const customerAccessToken = await getSessionCustomerAccessToken();
  const productId = Number(slug);

  // Get minimal product data to determine category
  const baseProduct = await getProduct(productId, customerAccessToken);

  if (!baseProduct) {
    return notFound();
  }

  // Determine if this is a vehicle (bike/scooter) or gear/accessories
  const productVariant = getProductDetailVariant(baseProduct);

  // For gear/accessories, return children without any layout wrapper
  if (productVariant === 'default') {
    return children;
  }

  // Transform product data to match expected interface
  const transformedProduct = Streamable.from(() => Promise.resolve({
    id: baseProduct.entityId.toString(),
    title: baseProduct.name,
    href: baseProduct.path,
    images: Streamable.from(() => Promise.resolve([])), // Images will be handled by page component
    subtitle: baseProduct.brand?.name,
    rating: Streamable.from(() => Promise.resolve(baseProduct.reviewSummary.averageRating)),
    description: Streamable.from(() => Promise.resolve(baseProduct.description)),
  }));

  // For e-bikes and e-scooters, add enhanced layout with shared sections
  return (
    <>
      {children}
      <ProductShowcaseSection product={transformedProduct} />
      <ProductAddonsSection 
        product={transformedProduct} 
        relatedProducts={Streamable.from(() => Promise.resolve([]))} 
      />
    </>
  );
}
