import * as Skeleton from '@/vibes/soul/primitives/skeleton';

// Bike Image Skeleton
export function BikeImageSkeleton() {
  return <Skeleton.Box className="aspect-square w-full max-w-lg rounded-lg" />;
}

// Bike Specs Skeleton
export function BikeSpecsSkeleton() {
  return (
    <div className="flex justify-center space-x-8">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div className="flex flex-col items-center" key={idx}>
          <Skeleton.Box className="mb-2 h-12 w-12 rounded-lg" />
          <Skeleton.Box className="h-3 w-16 rounded" />
        </div>
      ))}
    </div>
  );
}

// Rating Skeleton
export function RatingSkeleton() {
  return (
    <Skeleton.Root className="mx-auto flex w-[136px] items-center gap-1" pending>
      <Skeleton.Box className="h-4 w-[100px] rounded-md" />
      <Skeleton.Box className="h-6 w-8 rounded-xl" />
    </Skeleton.Root>
  );
}

// Product Summary Skeleton
export function ProductSummarySkeleton() {
  return (
    <Skeleton.Root className="flex w-full flex-col gap-3.5 pb-6" pending>
      {Array.from({ length: 2 }).map((_, idx) => (
        <Skeleton.Box className="mx-auto h-2.5 w-full max-w-md" key={idx} />
      ))}
    </Skeleton.Root>
  );
}

// Product Detail Form Skeleton
export function ProductDetailFormSkeleton() {
  return (
    <Skeleton.Root className="flex flex-col gap-8 py-8" pending>
      <div className="flex justify-center">
        <Skeleton.Box className="h-12 w-48 rounded-full" />
      </div>
    </Skeleton.Root>
  );
}

// Full Product Detail Bike Skeleton
export function ProductDetailBikeSkeleton() {
  return (
    <section className="relative w-full">
      <div className="relative min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh]">
        {/* Background Skeleton */}
        <div className="absolute inset-0 h-full w-full">
          <Skeleton.Box className="h-full w-full" />
        </div>

        {/* Content Skeleton */}
        <div className="relative z-0 flex h-full flex-col justify-center px-4 py-8 md:px-8">
          <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
            <Skeleton.Root className="animate-pulse" pending>
              {/* Header */}
              <div className="mb-4 text-center md:mb-8">
                <Skeleton.Box className="mx-auto mb-4 h-8 w-32" />
                <Skeleton.Box className="mx-auto mb-2 h-16 w-96" />
                <Skeleton.Box className="mx-auto h-6 w-48" />
              </div>

              {/* Main Content Area */}
              <div className="relative mb-8 flex min-h-0 flex-1 items-center justify-center overflow-hidden">
                {/* Side Cards */}
                <div className="absolute left-0 top-0 z-0 hidden lg:block">
                  <Skeleton.Box className="h-64 w-64 rounded-lg" />
                </div>
                <div className="absolute right-0 top-0 z-0 hidden lg:block">
                  <Skeleton.Box className="h-64 w-64 rounded-lg" />
                </div>

                {/* Center Image */}
                <div className="mx-auto w-full max-w-xs px-4 sm:max-w-sm md:max-w-lg lg:max-w-3xl xl:max-w-4xl">
                  <Skeleton.Box className="aspect-square w-full rounded-lg" />
                </div>
              </div>

              {/* Bottom Specs */}
              <div className="mt-auto">
                <BikeSpecsSkeleton />
              </div>
            </Skeleton.Root>
          </div>
        </div>
      </div>
    </section>
  );
}