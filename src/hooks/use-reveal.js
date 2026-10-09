"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal-on-scroll using IntersectionObserver.
 * Returns a ref to attach and a boolean `inView`.
 *
 * @param {Object} [options]
 * @param {number} [options.threshold=0.15]
 * @param {string} [options.rootMargin="0px 0px -10% 0px"]
 * @param {boolean} [options.once=true]
 */
export function useReveal({ threshold = 0.15, rootMargin = "0px 0px -10% 0px", once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
