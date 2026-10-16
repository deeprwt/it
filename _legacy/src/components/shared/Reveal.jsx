"use client";

import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

/**
 * Scroll-reveal wrapper. Fades + slides children into view.
 * `delay` is in ms; `as` lets you change the wrapper element.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  once = true,
  ...props
}) {
  const { ref, inView } = useReveal({ once });

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none",
        inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
