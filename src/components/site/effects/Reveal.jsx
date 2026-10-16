"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./use-in-view";
import { cn } from "@/lib/utils";

/**
 * Fades, lifts and de-blurs children into view on scroll.
 *
 * Progressive enhancement: content is visible by default (server HTML,
 * no-JS, crawlers rendering with tall viewports). Only elements that are
 * genuinely below the fold on load get hidden, then animate in when they
 * scroll into view. `delay` in ms staggers siblings.
 */
export function Reveal({ children, className, delay = 0, as: Tag = "div", ...props }) {
  const ref = useRef(null);
  const [state, setState] = useState("static"); // static | hidden | shown

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    if (node.getBoundingClientRect().top < window.innerHeight * 0.9) return; // already on screen

    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={state === "shown" ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        state !== "static" &&
          "transition-[opacity,transform,filter] [transition-duration:900ms] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)]",
        state === "hidden" && "translate-y-8 opacity-0 blur-[6px]",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
