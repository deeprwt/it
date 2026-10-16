import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { cn } from "@/lib/utils";

/**
 * Compact inner-page hero with breadcrumb, eyebrow, title and lede.
 * Sits below the fixed header (top padding clears the nav + ribbon).
 */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs = [],
  children,
  className,
}) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden border-b border-border bg-charcoal pb-16 pt-36 md:pb-20 md:pt-44",
        className
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 60% at 85% 0%, hsl(var(--accent) / 0.14), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <Container>
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              {breadcrumbs.map((crumb, i) => (
                <li key={crumb.name} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-border" />}
                  {crumb.url ? (
                    <Link href={crumb.url} className="transition-colors hover:text-accent">
                      {crumb.name}
                    </Link>
                  ) : (
                    <span className="text-foreground">{crumb.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && (
          <span className="eyebrow mb-5 flex animate-fade-in">
            <span className="h-px w-6 bg-accent" aria-hidden /> {eyebrow}
          </span>
        )}
        <h1 className="heading-xl max-w-4xl text-4xl text-foreground text-balance sm:text-5xl lg:text-6xl animate-fade-up">
          {title}
        </h1>
        {description && (
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            {description}
          </p>
        )}
        {children && <div className="mt-9 animate-fade-up" style={{ animationDelay: "200ms" }}>{children}</div>}
      </Container>
    </section>
  );
}
