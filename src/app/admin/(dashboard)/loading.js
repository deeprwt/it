import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border bg-card p-5">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="mt-5 h-8 w-20" />
            <Skeleton className="mt-3 h-3 w-32" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 rounded-2xl border bg-card p-5 xl:col-span-8">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-6 h-64 w-full rounded-xl" />
        </div>
        <div className="col-span-12 space-y-3 rounded-2xl border bg-card p-5 xl:col-span-4">
          <Skeleton className="h-5 w-32" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
