import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { pillars } from "@/data/services";
import { getIcon } from "@/lib/icons";

/**
 * Expanded view of the four service pillars — image-led cards that list
 * each pillar's sub-services and link to the detailed service page.
 */
export function ServicesGrid() {
  return (
    <section className="section">
      <Container>
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-border bg-border lg:grid-cols-2">
          {pillars.map((pillar, i) => {
            const Icon = getIcon(pillar.icon);
            return (
              <Reveal
                key={pillar.slug}
                delay={(i % 2) * 90}
                className="group relative flex flex-col bg-background transition-colors hover:bg-card"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={`/services/${pillar.slug}.webp`}
                    alt={`${pillar.title} by Ribbon IT`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <span className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center border border-white/20 bg-black/40 text-accent backdrop-blur-sm">
                    <Icon className="h-6 w-6" />
                  </span>
                  <Link
                    href={`/services/${pillar.slug}`}
                    aria-label={`Explore ${pillar.title}`}
                    className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </Link>
                </div>

                <div className="flex flex-1 flex-col p-8 lg:p-10">
                  <h2 className="font-display text-2xl font-medium text-foreground">
                    {pillar.title}
                  </h2>
                  <p className="mt-2 text-sm font-medium text-accent">
                    {pillar.tagline}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>

                  <ul className="mt-7 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                    {pillar.services.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm text-foreground/90">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {s}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/services/${pillar.slug}`}
                    className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors group-hover:text-accent"
                  >
                    Explore {pillar.title}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
