"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Big statement whose words light up one by one as you scroll through it.
 * Wrap words to emphasise in *asterisks* — they light up in the brand gradient.
 */
export function ScrollWords({ text, className }) {
  const ref = useRef(null);
  const tokens = text.split(/\s+/).map((raw) => {
    const accent = /^\*.*\*[.,!?]?$/.test(raw);
    return { word: raw.replace(/\*/g, ""), accent };
  });

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const words = Array.from(root.querySelectorAll("[data-word]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      words.forEach((w) => (w.style.opacity = "1"));
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh * 0.8 - rect.top) / (rect.height + vh * 0.25)));
      const lit = progress * words.length;
      words.forEach((w, i) => {
        const o = Math.min(1, Math.max(0, lit - i + 1));
        w.style.opacity = String(0.14 + o * 0.86);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [text]);

  return (
    <p ref={ref} className={cn("font-display font-bold leading-[1.08] tracking-tight", className)}>
      {tokens.map((t, i) => (
        <span
          key={i}
          data-word
          className={cn("transition-opacity duration-200", t.accent && "text-gradient")}
        >
          {t.word}
          {i < tokens.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
