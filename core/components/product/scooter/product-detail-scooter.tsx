import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { Field } from '@/vibes/soul/sections/product-detail/schema';

import { 
  BaseProductDetailProduct,
  ProductDetailLayout, 
  type ProductDetailLayoutProps 
} from '../layout/product-detail-layout';

interface ScooterSpecifications {
  motorPower?: string;
  batteryCapacity?: string;
  maxSpeed?: string;
  range?: string;
  maxWeight?: string;
  wheelSize?: string;
  brakeSystem?: string;
  foldable?: boolean;
  ipRating?: string;
}

interface ProductDetailScooterProduct extends BaseProductDetailProduct {
  scooterSpecs?: Streamable<ScooterSpecifications | null>;
}

export type ProductDetailScooterProps<F extends Field> = Omit<ProductDetailLayoutProps<F, ProductDetailScooterProduct>, 'productType' | 'specsSection' | 'mainSkeleton'>;

export function ProductDetailScooter<F extends Field>(props: ProductDetailScooterProps<F>) {
  return (
    <ProductDetailLayout
      {...props}
      mainSkeleton={() => <ProductDetailScooterSkeleton />}
      productType="Scooter"
      specsSection={(product) => (
        <div className="group/scooter-quick-specs">
          <Stream fallback={<ScooterSpecsSkeleton />} value={product.scooterSpecs}>
            {(specs) =>
              specs && (
                <div className="rounded-lg border border-[var(--product-detail-border,hsl(var(--contrast-100)))] p-4">
                  <h3 className="mb-3 text-sm font-semibold uppercase text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">
                    Key Features
                  </h3>
                  <div className="grid grid-cols-1 gap-3 text-sm @md:grid-cols-2">
                    {specs.motorPower ? (
                      <div className="flex items-center">
                        <span className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">
                          Motor:
                        </span>
                        <span className="ml-2 font-medium">{specs.motorPower}</span>
                      </div>
                    ) : null}
                    {specs.maxSpeed ? (
                      <div className="flex items-center">
                        <span className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">
                          Max Speed:
                        </span>
                        <span className="ml-2 font-medium">{specs.maxSpeed}</span>
                      </div>
                    ) : null}
                    {specs.range ? (
                      <div className="flex items-center">
                        <span className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">
                          Range:
                        </span>
                        <span className="ml-2 font-medium">{specs.range}</span>
                      </div>
                    ) : null}
                    {specs.maxWeight ? (
                      <div className="flex items-center">
                        <span className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">
                          Max Load:
                        </span>
                        <span className="ml-2 font-medium">{specs.maxWeight}</span>
                      </div>
                    ) : null}
                    {specs.foldable !== undefined ? (
                      <div className="flex items-center">
                        <span className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">
                          Foldable:
                        </span>
                        <span className="ml-2 font-medium">
                          {specs.foldable ? 'Yes' : 'No'}
                        </span>
                      </div>
                    ) : null}
                    {specs.ipRating ? (
                      <div className="flex items-center">
                        <span className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">
                          Water Resistant:
                        </span>
                        <span className="ml-2 font-medium">{specs.ipRating}</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {specs.foldable ? (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        Portable
                      </span>
                    ) : null}
                    {specs.ipRating ? (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        Weather Resistant
                      </span>
                    ) : null}
                    {specs.maxSpeed && parseInt(specs.maxSpeed, 10) > 25 ? (
                      <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                        High Performance
                      </span>
                    ) : null}
                  </div>
                </div>
              )
            }
          </Stream>
        </div>
      )}
    />
  );
}

// Scooter-specific skeleton components

function ScooterSpecsSkeleton() {
  return (
    <Skeleton.Root
      className="rounded-lg border border-[var(--product-detail-border,hsl(var(--contrast-100)))] p-4 group-has-[[data-pending]]/scooter-quick-specs:animate-pulse"
      pending
    >
      <Skeleton.Box className="mb-3 h-4 w-24 rounded-md" />
      <div className="grid grid-cols-1 gap-3 @md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton.Box className="h-3 w-full rounded-md" key={idx} />
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton.Box className="h-6 w-16 rounded-full" key={idx} />
        ))}
      </div>
    </Skeleton.Root>
  );
}


export function ProductDetailScooterSkeleton() {
  return (
    <Skeleton.Root
      className="grid grid-cols-1 items-stretch gap-x-6 gap-y-8 group-has-[[data-pending]]/product-detail:animate-pulse @2xl:grid-cols-2 @5xl:gap-x-12"
      pending
    >
      <div className="hidden @2xl:block">
        <div className="w-full overflow-hidden rounded-xl @xl:rounded-2xl">
          <div className="flex">
            <Skeleton.Box className="aspect-[4/5] h-full w-full shrink-0 grow-0 basis-full" />
          </div>
        </div>
        <div className="mt-2 flex max-w-full gap-2 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton.Box className="h-12 w-12 shrink-0 rounded-lg @md:h-16 @md:w-16" key={idx} />
          ))}
        </div>
      </div>
      <div>
        <Skeleton.Box className="mb-6 h-4 w-20 rounded-lg" />
        <Skeleton.Box className="mb-6 h-6 w-72 rounded-lg" />
        <div className="flex w-[136px] items-center gap-1">
          <Skeleton.Box className="h-4 w-[100px] rounded-md" />
          <Skeleton.Box className="h-6 w-8 rounded-xl" />
        </div>
        <Skeleton.Box className="my-5 h-4 w-20 rounded-md" />
        <ScooterSpecsSkeleton />
        <div className="flex w-full flex-col gap-3.5 pb-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton.Box className="h-2.5 w-full" key={idx} />
          ))}
        </div>
        <div className="mb-8 @2xl:hidden">
          <div className="w-full overflow-hidden rounded-xl @xl:rounded-2xl">
            <Skeleton.Box className="aspect-[4/5] h-full w-full" />
          </div>
        </div>
        <div className="flex flex-col gap-8 py-8">
          <div className="flex gap-2">
            <Skeleton.Box className="h-12 w-[120px] rounded-lg" />
            <Skeleton.Box className="h-12 w-[216px] rounded-full" />
          </div>
        </div>
      </div>
    </Skeleton.Root>
  );
}
