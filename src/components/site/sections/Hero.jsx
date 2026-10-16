import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeSnow } from "@/components/site/effects/CodeSnow";
import { ScrambleText } from "@/components/site/effects/ScrambleText";
import { TypingTerminal } from "@/components/site/effects/TypingTerminal";
import { Magnetic } from "@/components/site/effects/Interactive";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[min(100svh,1000px)] flex-col overflow-hidden pt-28 md:pt-32">
      {/* Background layers */}
      <div className="absolute inset-0 -z-20 bg-grid-lines mask-radial [background-size:64px_64px] opacity-70" />
      <div className="absolute -left-40 top-10 -z-20 h-[36rem] w-[36rem] animate-float rounded-full bg-brand/20 blur-[140px]" />
      <div
        className="absolute -right-32 bottom-0 -z-20 h-[32rem] w-[32rem] animate-float rounded-full bg-brand-2/20 blur-[140px]"
        style={{ animationDelay: "-3s" }}
      />
      {/* Faded behind the headline, full strength on the right */}
      <CodeSnow className="-z-10 [-webkit-mask-image:linear-gradient(90deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.35)_40%,#000_70%)] [mask-image:linear-gradient(90deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.35)_40%,#000_70%)]" />

      <div className="container grid grid-cols-1 flex-1 items-center gap-14 pb-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <div className="inline-flex animate-in fade-in slide-in-from-bottom-3 items-center gap-3 rounded-full border border-white/10 bg-card/60 py-1.5 pl-1.5 pr-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground backdrop-blur fill-mode-both [animation-duration:700ms]">
            <span className="rounded-full bg-brand px-2 py-0.5 font-semibold text-brand-foreground">❄ snowdox</span>
            design <span className="text-brand">&amp;&amp;</span> engineering studio
          </div>

          <h1 className="mt-7 font-display text-[clamp(2.4rem,5vw,4.6rem)] font-bold leading-[1] tracking-tight">
            <span className="block animate-in fade-in slide-in-from-bottom-6 fill-mode-both [animation-duration:900ms]">
              We code brands
            </span>
            <span
              className="block animate-in fade-in slide-in-from-bottom-6 fill-mode-both [animation-duration:900ms]"
              style={{ animationDelay: "140ms" }}
            >
              that <ScrambleText text="move." className="text-gradient animate-gradient-x" delay={650} duration={1100} />
            </span>
          </h1>

          <p
            className="mt-8 max-w-xl animate-in fade-in slide-in-from-bottom-4 text-pretty text-lg leading-relaxed text-muted-foreground fill-mode-both [animation-duration:900ms] md:text-xl"
            style={{ animationDelay: "380ms" }}
          >
            Snowdox designs and engineers blazing-fast websites, products and AI tools for brands that refuse to
            blend in. Strategy, design, code and growth — one loud, accountable crew.
          </p>

          <div
            className="mt-10 flex animate-in fade-in slide-in-from-bottom-4 flex-col gap-3 fill-mode-both [animation-duration:900ms] sm:flex-row sm:items-center"
            style={{ animationDelay: "500ms" }}
          >
            <Magnetic>
              <Button asChild variant="brand" size="xl" className="group w-full rounded-full sm:w-auto">
                <Link href="/contact">
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  Start a project
                  <ArrowUpRight className="transition-transform duration-300 group-hover:rotate-45" />
                </Link>
              </Button>
            </Magnetic>
            <Button asChild variant="outline" size="xl" className="rounded-full border-white/15 bg-background/40 backdrop-blur">
              <Link href="/work">
                <span className="font-mono text-brand">{"<"}</span>
                See our work
                <span className="font-mono text-brand">{"/>"}</span>
              </Link>
            </Button>
          </div>
        </div>

        <div
          className="animate-in fade-in slide-in-from-right-8 fill-mode-both [animation-duration:1000ms] lg:col-span-5"
          style={{ animationDelay: "450ms" }}
        >
          <div className="relative">
            <div className="absolute -inset-px -z-10 rounded-2xl bg-brand-gradient opacity-40 blur-2xl" />
            <TypingTerminal />
            <div className="absolute -bottom-6 -left-6 hidden rotate-[-4deg] rounded-xl border border-white/10 bg-card/90 px-4 py-3 font-mono text-xs shadow-elegant backdrop-blur md:block">
              <span className="text-muted-foreground">lighthouse</span>{" "}
              <span className="font-semibold text-success">100</span>
              <span className="text-muted-foreground"> / 100</span>
            </div>
            <div className="absolute -right-4 -top-5 hidden rotate-[5deg] rounded-xl border border-white/10 bg-card/90 px-4 py-3 font-mono text-xs shadow-elegant backdrop-blur md:block">
              <span className="text-brand-2">LCP</span> <span className="font-semibold text-foreground">0.8s</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container flex items-center justify-between pb-8 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        <span className="hidden sm:inline">Web · Product · AI · Growth</span>
        <a href="#services" className="group flex items-center gap-2 transition-colors hover:text-foreground">
          Scroll to explore
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
        </a>
        <span className="hidden sm:inline">Remote · Worldwide</span>
      </div>
    </section>
  );
}
