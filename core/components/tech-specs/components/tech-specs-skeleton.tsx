import * as Skeleton from '@/vibes/soul/primitives/skeleton';

export const TechSpecsSkeleton = () => {
  return (
    <div className="max-w-8xl mx-auto bg-[#F5F5F5] p-4 sm:p-6 md:p-10 lg:p-16">
      {/* Header Skeleton */}
      <div className="mb-8 md:mb-12">
        <Skeleton.Root pending>
          <Skeleton.Box className="mb-2 h-12 w-32 md:h-16 md:w-40" />
          <Skeleton.Box className="h-12 w-36 md:h-16 md:w-44" />
        </Skeleton.Root>
      </div>

      {/* Sections Skeleton */}
      <div className="space-y-0">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <Skeleton.Root pending>
              <div className="flex w-full items-center justify-between py-4 md:py-6">
                <Skeleton.Box className="h-6 w-24 md:h-8 md:w-32" />
                <div className="mx-6 flex-1">
                  <Skeleton.Box className="h-px w-full" />
                </div>
                <Skeleton.Box className="h-6 w-6 md:h-8 md:w-8" />
              </div>
            </Skeleton.Root>

            {index === 0 && (
              <Skeleton.Root pending>
                <div className="pb-6 md:pb-8">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((__, specIndex) => (
                      <div className="space-y-2 md:space-y-3" key={specIndex}>
                        <Skeleton.Box className="h-4 w-20 md:h-5 md:w-24" />
                        <Skeleton.Box className="h-3 w-full" />
                        <Skeleton.Box className="h-3 w-4/5" />
                        <Skeleton.Box className="h-3 w-3/4" />
                      </div>
                    ))}
                  </div>
                </div>
              </Skeleton.Root>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};