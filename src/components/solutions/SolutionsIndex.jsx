import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { getIcon } from "@/lib/icons";
import { catalogByCategory, CATEGORY_LABEL } from "@/data/catalog";
import { pillars } from "@/data/services";

const ICONS = {
  "web-development": "Code2",
  "ai-agents": "Bot",
  "digital-marketing": "Megaphone",
  "ui-ux-branding": "Palette",
  "ecommerce-development": "ShoppingCart",
  "mobile-apps": "Smartphone",
};

// Category display order.
const ORDER = [
  "web-development",
  "ecommerce-development",
  "mobile-apps",
  "ai-agents",
  "digital-marketing",
  "ui-ux-branding",
];

export function SolutionsIndex() {
  const total = Object.values(catalogByCategory).reduce((n, a) => n + a.length, 0);

  return (
    <section className="section">
      <Container>
        {ORDER.filter((cat) => catalogByCategory[cat]?.length).map((cat, idx) => {
          const items = [...catalogByCategory[cat]].sort((a, b) =>
            a.h1.localeCompare(b.h1)
          );
          const Icon = getIcon(ICONS[cat]);
          const pillar = pillars.find((p) => p.slug === cat);
          return (
            <div
              key={cat}
              id={cat}
              className="scroll-mt-28 border-t border-border py-12 first:border-t-0 first:pt-0"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:gap-16">
                {/* Category header */}
                <div className="lg:w-72 lg:shrink-0">
                  <div className="lg:sticky lg:top-28">
                    <span className="flex h-12 w-12 items-center justify-center border border-border text-accent">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h2 className="mt-5 font-display text-2xl font-medium text-foreground">
                      {CATEGORY_LABEL[cat]}
                    </h2>
                    <p className="mt-1 text-sm text-accent">
                      {items.length} solutions
                    </p>
                    {pillar && (
                      <Link
                        href={`/services/${cat}`}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
                      >
                        Service overview
                        <ArrowUpRight className="h-4 w-4 text-accent" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Links */}
                <ul className="grid flex-1 grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
                  {items.map((page) => (
                    <li key={page.slug}>
                      <Link
                        href={`/${page.slug}`}
                        className="group flex items-center justify-between gap-3 border-b border-border/60 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <span className="flex items-center gap-2">
                          {page.h1}
                          {page.location && (
                            <span className="text-[0.65rem] uppercase tracking-wider text-accent/80">
                              {page.location}
                            </span>
                          )}
                        </span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-border transition-colors group-hover:text-accent" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </Container>
    </section>
  );
}
