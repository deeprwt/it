"use client";

import { useInView } from "./use-in-view";
import { cn } from "@/lib/utils";

/**
 * Fades, lifts and de-blurs children into view on scroll.
 * `delay` in ms — use it to stagger siblings.
 */
export function Reveal({ children, className, delay = 0, as: Tag = "div", ...props }) {
  const [ref, inView] = useInView();

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none",
        inView ? "translate-y-0 opacity-100 blur-0" : "translate-y-8 opacity-0 blur-[6px]",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
