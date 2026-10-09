import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Ribbon IT wordmark.
 * Understated, typography-led mark in the reference's style — "Ribbon"
 * in foreground with "IT" in the accent. A small ribbon tick sits before
 * the word as the brand glyph. Optional "let's grow together" tagline.
 */
export function Logo({ className, href = "/", withTagline = false }) {
  const content = (
    <span className="inline-flex items-center gap-2 leading-none">
      <RibbonGlyph className="h-5 w-5 shrink-0 text-accent" />
      <span className="inline-flex flex-col leading-none">
        <span className="font-display text-xl font-bold uppercase tracking-[0.14em] text-foreground">
          Ribbon<span className="ml-1.5 text-accent">IT</span>
        </span>
        {withTagline && (
          <span className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            let&apos;s grow together
          </span>
        )}
      </span>
    </span>
  );

  if (!href) {
    return <span className={cn("inline-block", className)}>{content}</span>;
  }

  return (
    <Link
      href={href}
      aria-label="Ribbon IT — home"
      className={cn("inline-block transition-opacity hover:opacity-90", className)}
    >
      {content}
    </Link>
  );
}

function RibbonGlyph({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} role="presentation">
      <path
        d="M12 2.5l2.6 1.5v3l-2.6 1.5L9.4 7v-3L12 2.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.4 7L4 16.5l3.4-.4 1.4 3L13 11.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M14.6 7L20 16.5l-3.4-.4-1.4 3L11 11.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
