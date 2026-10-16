"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView, prefersReducedMotion } from "./use-in-view";
import { cn } from "@/lib/utils";

const GLYPHS = "!<>-_\\/[]{}=+*^?#01$%&;:";

/**
 * "Decoding" text effect: characters resolve from random glyphs into the
 * real text. Server-renders the final text (good for SEO & no-JS), then
 * scrambles once in view — or on hover with `trigger="hover"`.
 * Works best on monospace or short text.
 */
export function ScrambleText({ text, className, trigger = "view", duration = 900, delay = 0, as: Tag = "span" }) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);
  const running = useRef(false);
  const [ref, inView] = useInView({ threshold: 0.4 });

  const scramble = useCallback(() => {
    if (running.current || prefersReducedMotion()) return;
    running.current = true;
    const chars = [...text];
    const reveal = chars.map((_, i) => (i / chars.length) * duration * 0.65 + Math.random() * duration * 0.35);
    let start = null;
    let lastSwap = 0;

    const tick = (now) => {
      if (start === null) start = now;
      const t = now - start;
      if (now - lastSwap > 45 || t >= duration) {
        lastSwap = now;
        setDisplay(
          chars
            .map((c, i) => (c === " " || t >= reveal[i] ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
            .join("")
        );
      }
      if (t < duration) {
        frame.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
        running.current = false;
      }
    };
    frame.current = requestAnimationFrame(tick);
  }, [text, duration]);

  useEffect(() => {
    if (trigger !== "view" || !inView) return;
    const id = setTimeout(scramble, delay);
    return () => clearTimeout(id);
  }, [inView, trigger, delay, scramble]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <Tag
      ref={ref}
      className={cn("inline-block", className)}
      onMouseEnter={trigger === "hover" ? scramble : undefined}
      onFocus={trigger === "hover" ? scramble : undefined}
    >
      {/* Single text node: crawlers and screen readers get the real text at rest. */}
      {display}
    </Tag>
  );
}
