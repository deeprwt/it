import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { pillars } from "@/data/services";
import { getIcon } from "@/lib/icons";

/**
 * Four service pillars — image-led cards using the real per-service
 * banner imagery, mirroring the reference's "Approach / Services" grid.
 */
export function WhatWeDo() {
  return (
    <section id="services" className="section">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="What We Do"
            title="Designed for distinction, engineered for results"
            description="One partner across the full digital journey — strategy, design, engineering, AI and growth, delivered end to end."
          />
          <Reveal delay={120}>
            <Link
              href="/services"
              className="link-underline inline-flex items-center gap-2 text-sm font-semibold text-foreground"
            >
              View all services
              <ArrowUpRight className="h-4 w-4 text-accent" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, i) => {
            const Icon = getIcon(pillar.icon);
            return (
              <Reveal
                key={pillar.slug}
                delay={i * 80}
                className="group relative flex flex-col bg-background transition-colors hover:bg-card"
              >
                <Link
                  href={`/services/${pillar.slug}`}
                  className="absolute inset-0 z-10"
                  aria-label={pillar.title}
                />
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={`/services/${pillar.slug}.webp`}
                    alt={`${pillar.title} services by Ribbon IT`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/40 text-accent backdrop-blur-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-display text-xl font-medium text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-accent">
                    {pillar.tagline}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors group-hover:text-accent">
                    Learn more
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
