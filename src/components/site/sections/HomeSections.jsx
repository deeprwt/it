import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/effects/Reveal";
import { Spotlight, Counter } from "@/components/site/effects/Interactive";
import { Marquee } from "@/components/site/effects/Marquee";
import { ScrollWords } from "@/components/site/effects/ScrollWords";
import { Icon } from "@/components/site/icons";
import { services } from "@/data/services";
import { stack, stats, processSteps as steps } from "@/data/site";

/* ── Tech stack ticker ─────────────────────────────────────────── */

export function StackMarquee() {
  return (
    <section aria-label="Technologies we work with" className="border-y border-white/[0.06] bg-card/30 py-6">
      <Marquee duration={45}>
        {stack.map((tech) => (
          <span key={tech} className="mx-7 flex items-center gap-7 font-mono text-sm uppercase tracking-widest text-muted-foreground">
            {tech}
            <span className="text-brand" aria-hidden>
              ✳
            </span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}

/* ── Services grid ─────────────────────────────────────────────── */

export function ServicesSection() {
  return (
    <section id="services" className="section scroll-mt-20">
      <div className="container">
        <SectionHeading
          eyebrow="what we ship"
          title={
            <>
              Six disciplines. <span className="text-muted-foreground">One crew.</span>
            </>
          }
          description="Pick one or bundle them all — every engagement is run by senior people who design, build and measure in the same sprint."
          align="split"
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 90}>
              <Spotlight asChild className="group block h-full rounded-2xl border border-white/[0.07] bg-card/60 p-7 transition-colors duration-500 hover:bg-card">
                <Link href={`/services/${s.slug}`}>
                  <span className="spotlight-border" aria-hidden />
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-background text-brand transition-all duration-500 group-hover:scale-110 group-hover:border-brand/40 group-hover:shadow-glow">
                      <Icon name={s.icon} className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{s.index}</span>
                  </div>
                  <h3 className="mt-10 font-display text-2xl font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.short}</p>
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <Badge key={t} variant="outline" className="border-white/10 font-mono text-[10px] font-normal text-muted-foreground">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <span className="mt-8 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-foreground/70 transition-colors group-hover:text-brand">
                    explore
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                </Link>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Manifesto ─────────────────────────────────────────────────── */

export function Manifesto({
  text = "We're a crew of designers and engineers who believe the web should be *fast,* *bold* and *impossible* to ignore. No templates. No black boxes. Just obsessively crafted work that *moves* the numbers.",
}) {
  return (
    <section className="section relative overflow-hidden">
      <div className="container">
        <p className="eyebrow mb-8">
          <span className="text-muted-foreground">{"//"}</span> manifesto
        </p>
        <ScrollWords text={text} className="max-w-6xl text-3xl sm:text-5xl md:text-6xl lg:text-7xl" />
      </div>
    </section>
  );
}

/* ── Process: git log ──────────────────────────────────────────── */

export function ProcessSection({ title = "How we ship", description }) {
  return (
    <section className="section relative overflow-hidden border-y border-white/[0.06] bg-card/20">
      <div className="container grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              eyebrow="git log --oneline"
              title={title}
              description={
                description ||
                "A transparent, sprint-based process. Every commit is visible, every week ships something real, and you never wonder what's happening."
              }
            />
            <Reveal delay={200} className="mt-10 hidden rounded-xl border border-white/10 bg-background/60 p-5 font-mono text-xs text-muted-foreground lg:block">
              <span className="text-success">$</span> git log --graph --oneline
              <br />
              <span className="text-brand">*</span> f9d02c1 <span className="text-foreground">(HEAD → growth)</span> keep shipping
              <br />
              <span className="text-brand">*</span> e44b7f0 <span className="text-brand-2">(tag: v1.0)</span> launch
              <br />
              <span className="text-brand">*</span> c09e5aa build the thing
              <br />
              <span className="text-brand">*</span> 7be21d4 design system
              <br />
              <span className="text-brand">*</span> a1f3c9e initial commit: discovery
            </Reveal>
          </div>
        </div>

        <ol className="relative lg:col-span-7">
          <span className="absolute bottom-4 left-[15px] top-4 w-px bg-gradient-to-b from-brand via-brand-2 to-transparent" aria-hidden />
          {steps.map((step, i) => (
            <Reveal as="li" key={step.hash} delay={i * 60} className="relative pb-12 pl-14 last:pb-0">
              <span className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-brand/40 bg-background shadow-glow">
                <span className="h-2.5 w-2.5 rounded-full bg-brand" />
              </span>
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                <span className="text-warning">commit {step.hash}</span>
                <Badge variant="outline" className="border-white/10 font-mono text-[10px] font-normal text-muted-foreground">
                  {step.duration}
                </Badge>
              </div>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                <span className="text-success">$</span> {step.command}
              </p>
              <h3 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">{step.title}</h3>
              <p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Stats band ────────────────────────────────────────────────── */

export function StatsBand() {
  return (
    <section aria-label="Studio in numbers" className="section">
      <div className="container">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="bg-background p-8 md:p-10">
              <p className="font-display text-5xl font-extrabold tracking-tightest md:text-7xl">
                <Counter value={s.value} decimals={s.decimals || 0} suffix={s.suffix} className="text-gradient" />
              </p>
              <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ───────────────────────────────────────────────────────── */

export function FaqSection({ faqs, title = "Questions, answered.", eyebrow = "faq" }) {
  return (
    <section className="section">
      <div className="container grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow={eyebrow} title={title} description="Can't find what you're looking for? Ask us anything — a human replies." />
          <Reveal delay={200} className="mt-8">
            <Button asChild variant="outline" className="rounded-full border-white/15">
              <Link href="/contact">
                Ask a question <ArrowUpRight />
              </Link>
            </Button>
          </Reveal>
        </div>
        <Reveal className="lg:col-span-8" delay={100}>
          <Accordion type="single" collapsible defaultValue="faq-0" className="border-t border-white/[0.08]">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`} className="border-white/[0.08]">
                <AccordionTrigger className="font-display text-lg font-semibold md:text-xl">
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-xs font-normal text-brand">0{i + 1}</span>
                    {f.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pl-9">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
