import { BadgeCheck } from "lucide-react";
import { clients } from "@/data/clients";
import { recognitions } from "@/data/site";

/**
 * Recognition line + infinite client marquee.
 * Mirrors the reference site's awards bar, adapted to client logos.
 */
export function TrustStrip() {
  const loop = [...clients, ...clients];

  return (
    <section className="border-y border-border bg-card/40 py-10">
      <div className="mx-auto mb-8 flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 container-px">
        {recognitions.map((r) => (
          <span
            key={r}
            className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            <BadgeCheck className="h-4 w-4 text-accent" />
            {r}
          </span>
        ))}
      </div>

      <div className="relative overflow-hidden mask-fade-x">
        <div className="flex w-max animate-marquee items-center gap-12 whitespace-nowrap">
          {loop.map((client, i) => (
            <span
              key={`${client}-${i}`}
              className="font-display text-lg font-medium text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
