import { cn } from "@/lib/utils";

/**
 * Base skeleton block — a pulsing muted surface.
 * Square corners to match the design system (--radius: 0).
 */
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse bg-muted/70", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Skeleton };
