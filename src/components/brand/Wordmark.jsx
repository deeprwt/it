import { WORDMARK_PATHS, WORDMARK_VIEWBOX } from "./wordmark-paths";
import { cn } from "@/lib/utils";

const PAD = 2;
const VIEWBOX = `${-PAD} ${-PAD} ${WORDMARK_VIEWBOX.width + PAD * 2} ${WORDMARK_VIEWBOX.height + PAD * 2}`;

/**
 * The "Snowdox" wordmark from the logo as scalable outlines. It always
 * fills exactly the width of its container (never clips, whatever the
 * viewport or font), so it's safe for giant decorative use.
 */
export function Wordmark({ className, variant = "outline", strokeWidth = 1 }) {
  const outline = variant === "outline";
  return (
    <svg viewBox={VIEWBOX} className={cn("block h-auto w-full", className)} aria-hidden="true" focusable="false">
      {WORDMARK_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={outline ? "none" : "currentColor"}
          stroke={outline ? "currentColor" : "none"}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
