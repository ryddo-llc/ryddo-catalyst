export default function Loading() {
  return (
    <div className="@container">
      <div className="space-y-6">
        {/* Welcome Section Skeleton */}
        <div className="text-left">
          <div className="h-6 w-48 animate-pulse rounded-md bg-[var(--account-card-border,hsl(var(--contrast-200)))]" />
          <div className="mt-1 h-4 w-72 animate-pulse rounded-md bg-[var(--account-card-border,hsl(var(--contrast-200)))]" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-3 grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div 
              className="group relative overflow-hidden rounded-lg border border-[var(--account-card-border,hsl(var(--contrast-200)))] bg-[var(--account-card-background,hsl(var(--background)))] p-3"
              key={i}
            >
              <div className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-gradient-to-br from-[#F92F7B]/10 to-[#F92F7B]/5" />
              
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="h-6 w-6 animate-pulse rounded-full bg-[var(--account-card-border,hsl(var(--contrast-200)))]" />
                </div>
                
                <div className="mt-2">
                  <div className="h-5 w-8 animate-pulse rounded-md bg-[var(--account-card-border,hsl(var(--contrast-200)))]" />
                  <div className="mt-1 h-3 w-12 animate-pulse rounded-md bg-[var(--account-card-border,hsl(var(--contrast-200)))]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid Skeleton */}
        <div className="space-y-6">
          {/* Recent Orders Skeleton */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-[var(--account-card-border,hsl(var(--contrast-200)))] bg-[var(--account-card-background,hsl(var(--background)))] p-4">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-[#F92F7B]/10 to-[#F92F7B]/5" />
            
            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <div className="h-6 w-32 animate-pulse rounded-md bg-[var(--account-card-border,hsl(var(--contrast-200)))]" />
                <div className="h-8 w-24 animate-pulse rounded-md bg-[var(--account-card-border,hsl(var(--contrast-200)))]" />
              </div>

              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div className="flex items-center justify-between rounded-lg border border-[var(--account-card-border,hsl(var(--contrast-200)))] p-4" key={i}>
                    <div className="flex-1">
                      <div className="h-4 w-20 animate-pulse rounded-md bg-[var(--account-card-border,hsl(var(--contrast-200)))]" />
                      <div className="mt-2 h-3 w-32 animate-pulse rounded-md bg-[var(--account-card-border,hsl(var(--contrast-200)))]" />
                    </div>
                    <div className="text-right">
                      <div className="h-6 w-16 animate-pulse rounded-full bg-[var(--account-card-border,hsl(var(--contrast-200)))]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Skeleton */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-[var(--account-card-border,hsl(var(--contrast-200)))] bg-[var(--account-card-background,hsl(var(--background)))] p-4">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-[#F92F7B]/10 to-[#F92F7B]/5" />
            
            <div className="relative">
              <div className="mb-6 h-6 w-28 animate-pulse rounded-md bg-[var(--account-card-border,hsl(var(--contrast-200)))]" />

              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div className="flex items-center gap-3 rounded-lg border border-[var(--account-card-border,hsl(var(--contrast-200)))] p-3" key={i}>
                    <div className="h-4 w-4 animate-pulse rounded-full bg-[var(--account-card-border,hsl(var(--contrast-200)))]" />
                    <div className="h-4 w-24 animate-pulse rounded-md bg-[var(--account-card-border,hsl(var(--contrast-200)))]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Account Status Skeleton */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-[var(--account-card-border,hsl(var(--contrast-200)))] bg-[var(--account-card-background,hsl(var(--background)))] p-4">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-[#F92F7B]/10 to-[#F92F7B]/5" />
            
            <div className="relative">
              <div className="mb-6 h-6 w-32 animate-pulse rounded-md bg-[var(--account-card-border,hsl(var(--contrast-200)))]" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-28 animate-pulse rounded-md bg-[var(--account-card-border,hsl(var(--contrast-200)))]" />
                  <div className="h-4 w-10 animate-pulse rounded-md bg-[var(--account-card-border,hsl(var(--contrast-200)))]" />
                </div>
                
                <div className="h-2 w-full rounded-full bg-[var(--account-card-border,hsl(var(--contrast-200)))]">
                  <div className="h-2 w-2/3 animate-pulse rounded-full bg-[#F92F7B]/30" />
                </div>

                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div className="flex items-center gap-3" key={i}>
                      <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--account-card-border,hsl(var(--contrast-200)))]" />
                      <div className="h-4 w-32 animate-pulse rounded-md bg-[var(--account-card-border,hsl(var(--contrast-200)))]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}