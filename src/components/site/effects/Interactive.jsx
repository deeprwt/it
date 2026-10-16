"use client";

import { useEffect, useRef, useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import { useInView, prefersReducedMotion } from "./use-in-view";
import { cn } from "@/lib/utils";

/**
 * Card with a cursor-following spotlight + glowing border.
 * Pass `asChild` to apply it to a Link.
 */
export function Spotlight({ asChild = false, className, children, ...props }) {
  const Comp = asChild ? Slot : "div";
  const onMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };
  return (
    <Comp onMouseMove={onMove} className={cn("spotlight", className)} {...props}>
      {children}
    </Comp>
  );
}

/** Pulls its child toward the cursor (desktop pointers only). */
export function Magnetic({ children, strength = 0.3, className }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate3d(0,0,0)";
  };

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("inline-block transition-transform duration-300 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)]", className)}
    >
      {children}
    </span>
  );
}

/** Counts up to `value` when scrolled into view. */
export function Counter({ value, decimals = 0, duration = 1600, prefix = "", suffix = "", className }) {
  const [ref, inView] = useInView({ threshold: 0.5 });
  const [current, setCurrent] = useState(value);
  const started = useRef(false);

  // Below the fold on first paint → reset to 0 so it can count up later.
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (el.getBoundingClientRect().top > window.innerHeight) setCurrent(0);
  }, [ref]);

  useEffect(() => {
    if (!inView || started.current || prefersReducedMotion()) return;
    started.current = true;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setCurrent(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {current.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/** Thin bar pinned to the top showing how far the reader has scrolled. */
export function ReadingProgress({ targetId }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = targetId ? document.getElementById(targetId) : document.documentElement;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[70] h-[3px] bg-transparent">
      <div
        className="h-full origin-left bg-brand-gradient shadow-glow transition-transform duration-150"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
