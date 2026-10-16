import { cn } from "@/lib/utils";

/**
 * Infinite horizontal ticker (CSS only). The track holds the content twice
 * and slides by -50%, so the loop is seamless. Pauses on hover.
 */
export function Marquee({ children, reverse = false, duration = 40, className, trackClassName }) {
  return (
    <div className={cn("group relative flex overflow-hidden mask-fade-x", className)}>
      <div
        style={{ "--marquee-duration": `${duration}s` }}
        className={cn(
          "flex w-max shrink-0 items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          trackClassName
        )}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
