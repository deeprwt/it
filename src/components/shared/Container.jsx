import { cn } from "@/lib/utils";

/**
 * Centered max-width container with responsive horizontal padding.
 * Caps near 1280px to match the reference grid.
 */
export function Container({ className, children, size = "default", ...props }) {
  const sizes = {
    default: "max-w-7xl",
    wide: "max-w-8xl",
    narrow: "max-w-4xl",
    prose: "max-w-3xl",
  };
  return (
    <div
      className={cn("mx-auto w-full container-px", sizes[size], className)}
      {...props}
    >
      {children}
    </div>
  );
}
