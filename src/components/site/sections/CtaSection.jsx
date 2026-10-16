import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/effects/Reveal";
import { Magnetic } from "@/components/site/effects/Interactive";
import { Marquee } from "@/components/site/effects/Marquee";

export function CtaSection({ email = "hello@snowdox.com" }) {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/[0.06] py-24 md:py-36">
      <div className="absolute inset-0 -z-10 bg-grid-lines mask-radial [background-size:64px_64px] opacity-50" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-[30rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gradient opacity-20 blur-[140px]" />

      <Marquee duration={30} className="pointer-events-none mb-16 opacity-[0.07]">
        {["Let's build", "something", "loud", "✳"].map((w, i) => (
          <span key={i} className="mx-6 font-display text-6xl font-extrabold uppercase tracking-tight md:text-8xl">
            {w}
          </span>
        ))}
      </Marquee>

      <div className="container text-center">
        <Reveal>
          <p className="eyebrow justify-center">
            <span className="text-muted-foreground">{"//"}</span> got a project?
          </p>
          <h2 className="mx-auto mt-6 max-w-4xl text-balance font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl">
            Let&apos;s build something <span className="text-gradient animate-gradient-x">impossible to ignore.</span>
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground">
            Tell us where you want to go. We&apos;ll reply within one business day with a plan, a timeline and honest
            advice — even if we&apos;re not the right fit.
          </p>
        </Reveal>
        <Reveal delay={250} className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Magnetic>
            <Button asChild variant="brand" size="xl" className="group rounded-full">
              <Link href="/contact">
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                Start a project
                <ArrowUpRight className="transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </Button>
          </Magnetic>
          <Button asChild variant="outline" size="xl" className="rounded-full border-white/15 font-mono text-sm">
            <a href={`mailto:${email}`}>{email}</a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
