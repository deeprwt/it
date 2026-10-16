import { cn } from "@/lib/utils";

/** Snowflake built from code chevrons — the Snowdox mark. */
export function LogoMark({ className, animated = false }) {
  const id = "sdx-grad";
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("h-8 w-8 shrink-0", className)}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="hsl(var(--brand))" />
          <stop offset="1" stopColor="hsl(var(--brand-2))" />
        </linearGradient>
      </defs>
      <g
        className={cn(animated && "origin-center animate-spin-slow motion-reduce:animate-none")}
        style={{ transformBox: "fill-box" }}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <g key={deg} transform={`rotate(${deg} 16 16)`}>
            <line x1="16" y1="16" x2="16" y2="5" />
            <polyline points="12.6,7 16,10.2 19.4,7" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Mark + wordmark with a blinking terminal cursor. */
export function Logo({ className, markClassName, showCursor = true, animated = false }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} animated={animated} />
      <span className="font-display text-xl font-bold lowercase tracking-tight text-foreground">
        snowdox
        {showCursor && (
          <span aria-hidden className="ml-0.5 inline-block animate-blink text-brand">
            _
          </span>
        )}
      </span>
    </span>
  );
}
