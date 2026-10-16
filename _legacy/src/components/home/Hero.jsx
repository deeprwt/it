import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import { ratings } from "@/data/site";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-charcoal">
      {/* Background image + scrims */}
      <Image
        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=70"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-overlay" aria-hidden />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(60% 50% at 80% 10%, hsl(var(--accent) / 0.18), transparent 60%)",
        }}
      />

      <Container className="relative z-10 pb-16 pt-36 md:pb-24 lg:pb-28">
        <div className="max-w-4xl">
          {/* eyebrow tags */}
          <div className="mb-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium uppercase tracking-eyebrow text-accent animate-fade-in">
            <span>Design</span>
            <span className="text-muted-foreground">—</span>
            <span>Develop</span>
            <span className="text-muted-foreground">—</span>
            <span>Promote</span>
          </div>

          <h1 className="heading-xl text-4xl text-foreground text-balance sm:text-5xl md:text-6xl lg:text-7xl animate-fade-up">
            Digital Experiences
            <span className="block text-muted-foreground">
              that Drive{" "}
              <span className="relative whitespace-nowrap text-accent">
                Infinite
                <span className="ml-2 inline-block align-middle text-accent">∞</span>
              </span>{" "}
              Results
            </span>
          </h1>

          <p
            className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            We build result-oriented websites, apps, AI agents and marketing
            that load faster, rank higher and convert better — for ambitious
            brands in 25+ countries.
          </p>

          <div
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <Button asChild variant="accent" size="lg">
              <Link href="/#work">
                Explore our work
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Get in touch</Link>
            </Button>
          </div>

          {/* ratings row */}
          <div
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 animate-fade-in"
            style={{ animationDelay: "320ms" }}
          >
            {ratings.slice(0, 4).map((r) => (
              <div key={r.platform} className="flex items-center gap-2">
                <span className="flex items-center gap-0.5 text-accent">
                  <Star className="h-3.5 w-3.5 fill-accent" />
                  <span className="text-sm font-semibold text-foreground">
                    {r.score}
                  </span>
                </span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {r.platform}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="text-[0.65rem] uppercase tracking-eyebrow text-muted-foreground">
          Scroll
        </span>
        <span className="h-10 w-px bg-gradient-to-b from-accent to-transparent animate-bounce-subtle" />
      </div>
    </section>
  );
}
