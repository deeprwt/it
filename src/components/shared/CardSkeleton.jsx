import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/shared/Container";
import { cn } from "@/lib/utils";

/**
 * Skeleton placeholders for cards/components (per request, loaders are
 * scoped to cards — not full-page spinners). Used as Suspense / dynamic
 * fallbacks and route-segment loading states.
 */

/** A single image-led project/work card skeleton. */
export function ProjectCardSkeleton({ className }) {
  return (
    <div className={cn("border border-border bg-card", className)}>
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="space-y-3 p-6">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}

/** A compact text/feature card skeleton (icon + lines). */
export function FeatureCardSkeleton({ className }) {
  return (
    <div className={cn("bg-background p-7", className)}>
      <Skeleton className="mb-5 h-11 w-11" />
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-4/5" />
    </div>
  );
}

/** A testimonial quote card skeleton. */
export function TestimonialCardSkeleton({ className }) {
  return (
    <div className={cn("flex flex-col border border-border bg-background p-7", className)}>
      <Skeleton className="mb-5 h-8 w-8" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-3/4" />
      <div className="mt-7 border-t border-border pt-5">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="mt-2 h-3 w-1/4" />
      </div>
    </div>
  );
}

/** Grid of feature-card skeletons. */
export function CardGridSkeleton({ count = 6, className }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <FeatureCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Section-level fallback for the Testimonials carousel. */
export function TestimonialsSkeleton() {
  return (
    <section className="section bg-card/30">
      <Container>
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-5 h-9 w-2/3 max-w-md" />
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <TestimonialCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
