import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { Field } from '@/vibes/soul/sections/product-detail/schema';

import { 
  BaseProductDetailProduct,
  ProductDetailLayout, 
  type ProductDetailLayoutProps 
} from './product-detail-layout';

interface BikeSpecifications {
  motorPower?: string;
  batteryCapacity?: string;
  maxSpeed?: string;
  range?: string;
  frameSize?: string;
  wheelSize?: string;
  brakeSystem?: string;
  transmissionType?: string;
}

interface ProductDetailBikeProduct extends BaseProductDetailProduct {
  bikeSpecs?: Streamable<BikeSpecifications | null>;
}

export type ProductDetailBikeProps<F extends Field> = Omit<ProductDetailLayoutProps<F, ProductDetailBikeProduct>, 'productType' | 'specsSection' | 'mainSkeleton'>;

export function ProductDetailBike<F extends Field>(props: ProductDetailBikeProps<F>) {
  return (
    <ProductDetailLayout
      {...props}
      mainSkeleton={() => <ProductDetailBikeSkeleton />}
      productType="Bike"
      specsSection={(product) => (
        <div className="group/bike-quick-specs">
          <Stream fallback={<BikeSpecsSkeleton />} value={product.bikeSpecs}>
            {(specs) =>
              specs && (
                <div className="rounded-lg border border-[var(--product-detail-border,hsl(var(--contrast-100)))] p-4">
                  <h3 className="mb-3 text-sm font-semibold uppercase text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">
                    Quick Specs
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {specs.motorPower ? (
                      <div>
                        <span className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">Motor:</span>
                        <span className="ml-2 font-medium">{specs.motorPower}</span>
                      </div>
                    ) : null}
                    {specs.batteryCapacity ? (
                      <div>
                        <span className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">Battery:</span>
                        <span className="ml-2 font-medium">{specs.batteryCapacity}</span>
                      </div>
                    ) : null}
                    {specs.maxSpeed ? (
                      <div>
                        <span className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">Max Speed:</span>
                        <span className="ml-2 font-medium">{specs.maxSpeed}</span>
                      </div>
                    ) : null}
                    {specs.range ? (
                      <div>
                        <span className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">Range:</span>
                        <span className="ml-2 font-medium">{specs.range}</span>
                      </div>
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

// Bike-specific skeleton components

function BikeSpecsSkeleton() {
  return (
    <Skeleton.Root
      className="rounded-lg border border-[var(--product-detail-border,hsl(var(--contrast-100)))] p-4 group-has-[[data-pending]]/bike-quick-specs:animate-pulse"
      pending
    >
      <Skeleton.Box className="mb-3 h-4 w-20 rounded-md" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton.Box className="h-3 w-full rounded-md" key={idx} />
        ))}
      </div>
    </Skeleton.Root>
  );
}


export function ProductDetailBikeSkeleton() {
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
        <BikeSpecsSkeleton />
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