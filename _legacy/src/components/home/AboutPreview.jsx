import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { Counter } from "@/components/shared/Counter";

/**
 * About preview — asymmetric 2-column: a brand quote block on the left,
 * an imagery + key-facts panel on the right. Mirrors "About SODA".
 */
const facts = [
  { value: 13, suffix: "+", label: "Years building the web" },
  { value: 2000, suffix: "+", label: "Websites shipped" },
  { value: 500, suffix: "+", label: "Clients worldwide" },
];

export function AboutPreview() {
  return (
    <section className="section bg-card/30">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Quote / copy */}
          <div>
            <Reveal as="span" className="eyebrow mb-6 flex">
              <span className="h-px w-6 bg-accent" aria-hidden /> Who We Are
            </Reveal>
            <Reveal delay={80}>
              <Quote className="mb-6 h-10 w-10 text-accent" />
              <p className="heading-xl text-2xl text-foreground text-balance sm:text-3xl lg:text-[2.1rem] lg:leading-[1.25]">
                Ordinary websites fade. Result-driven digital experiences
                endure — and keep compounding long after launch.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground">
                Since 2013, Ribbon IT has grown into an elite web development
                and digital experience company. We discover, we design, we
                execute — pairing creative craft with engineering rigor to solve
                complex business challenges across the globe.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-9">
                <Button asChild variant="outline" size="lg">
                  <Link href="/about">
                    More about us
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Image + facts */}
          <Reveal delay={120} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden border border-border sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1100&q=70"
                alt="The Ribbon IT team collaborating"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>

            {/* Facts overlay */}
            <div className="relative -mt-16 ml-auto mr-0 w-[88%] border border-border bg-background p-6 sm:w-[70%] lg:w-[78%]">
              <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-accent">
                Principal-led, every project
              </p>
              <div className="grid grid-cols-3 gap-4">
                {facts.map((f) => (
                  <div key={f.label}>
                    <span className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
                      <Counter value={f.value} suffix={f.suffix} />
                    </span>
                    <p className="mt-1 text-[0.7rem] leading-tight text-muted-foreground">
                      {f.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
