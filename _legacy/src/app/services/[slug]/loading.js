import { Container } from "@/components/shared/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { CardGridSkeleton } from "@/components/shared/CardSkeleton";

/**
 * Route-segment loading UI shown during navigation to a service page.
 * Card/component-level skeletons only (no full-page spinner).
 */
export default function ServiceLoading() {
  return (
    <>
      {/* Hero placeholder */}
      <section className="border-b border-border bg-charcoal pb-16 pt-36 md:pb-20 md:pt-44">
        <Container>
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-6 h-12 w-3/4 max-w-2xl" />
          <Skeleton className="mt-4 h-12 w-1/2 max-w-xl" />
          <div className="mt-9 flex gap-3">
            <Skeleton className="h-14 w-44" />
            <Skeleton className="h-14 w-36" />
          </div>
        </Container>
      </section>

      {/* Offerings grid placeholder */}
      <section className="section">
        <Container>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-5 h-9 w-2/3 max-w-md" />
          <div className="mt-12">
            <CardGridSkeleton count={6} />
          </div>
        </Container>
      </section>
    </>
  );
}
