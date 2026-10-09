"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether the window has scrolled past a threshold.
 * Used to toggle the header from transparent (over hero) to solid.
 *
 * @param {number} [threshold=24]
 */
export function useScrollPosition(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
