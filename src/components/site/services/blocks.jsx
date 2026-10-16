import Link from "next/link";
import { ArrowUpRight, Check, Minus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SectionHeading } from "@/components/site/SectionHeading";
import { LightSection } from "@/components/site/LightSection";
import { Reveal } from "@/components/site/effects/Reveal";
import { Spotlight, Magnetic } from "@/components/site/effects/Interactive";
import { ScrambleText } from "@/components/site/effects/ScrambleText";
import { Icon } from "@/components/site/icons";
import { TechGrid } from "@/components/site/tech/ToolsSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { services, industries } from "@/data/services";
import { cn } from "@/lib/utils";

/** Dark or white section shell. */
export function Band({ light = false, className, children, id }) {
  if (light) {
    return (
      <LightSection id={id} className={cn("section", className)}>
        {children}
      </LightSection>
    );
  }
  return (
    <section id={id} className={cn("section relative overflow-hidden", className)}>
      {children}
    </section>
  );
}

/* ── Hero ──────────────────────────────────────────────────────── */

export function ServiceHero({ service, visual, background, primaryCta = "Get a free consultation" }) {
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
      {background}
      <div className="container grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <Breadcrumb className="mb-7">
            <BreadcrumbList className="font-mono text-[11px] uppercase tracking-widest">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/services">Services</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-brand">{service.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <p className="eyebrow">
            <Icon name={service.icon} className="h-3.5 w-3.5" />
            <ScrambleText text={service.title} />
          </p>

          <Reveal>
            <h1 className="mt-5 text-balance font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-[3.6rem]">
              {service.tagline}
            </h1>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              {service.description}
            </p>
          </Reveal>
          <Reveal delay={180} className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Button asChild variant="brand" size="lg" className="group rounded-full">
                <Link href="/contact">
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  {primaryCta}
                  <ArrowUpRight className="transition-transform duration-300 group-hover:rotate-45" />
                </Link>
              </Button>
            </Magnetic>
            <Button asChild variant="outline" size="lg" className="rounded-full border-white/15">
              <Link href="/work">See our work</Link>
            </Button>
          </Reveal>

          {service.credentials && (
            <Reveal delay={260}>
              <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-white/[0.08] pt-6 text-sm sm:grid-cols-2">
                {service.credentials.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-foreground/85">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>

        <Reveal delay={200} className="lg:col-span-6">
          {visual}
        </Reveal>
      </div>
    </section>
  );
}

/* ── Sub-services grid ─────────────────────────────────────────── */

export function SubServicesSection({ service, eyebrow = "what we offer", description, light = true, columns = 3 }) {
  const items = service.subServices;
  return (
    <Band light={light} id="services">
      <div className="container">
        <SectionHeading
          eyebrow={eyebrow}
          title={service.subServicesTitle}
          description={description || service.short}
          align="split"
        />
        <div
          className={cn(
            "mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2",
            columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          )}
        >
          {items.map((item, i) => (
            <Reveal key={item.title} delay={(i % columns) * 70}>
              <Spotlight className="group flex h-full flex-col rounded-2xl border bg-card p-6 shadow-subtle transition-all duration-500 hover:-translate-y-1 hover:border-brand/40 md:p-7">
                <span className="spotlight-border" aria-hidden />
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition-all duration-500 group-hover:bg-brand group-hover:text-brand-foreground">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-6 font-display text-xl font-bold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                <ul className="mt-5 space-y-2 border-t pt-5">
                  {item.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-foreground/85">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      {p}
                    </li>
                  ))}
                </ul>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>
    </Band>
  );
}

/* ── Value pillars ─────────────────────────────────────────────── */

export function PillarsSection({ pillars, eyebrow = "why it matters", title, light = false }) {
  return (
    <Band light={light}>
      <div className="container">
        <SectionHeading eyebrow={eyebrow} title={title} align="center" />
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <div className="relative h-full overflow-hidden rounded-2xl border bg-card p-8">
                <span aria-hidden className="absolute -right-4 -top-6 font-display text-[7rem] font-extrabold leading-none text-foreground/[0.04]">
                  {i + 1}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient text-white shadow-glow">
                  <Icon name={p.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-8 font-display text-2xl font-bold tracking-tight">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Band>
  );
}

/* ── Process (numbered steps) ──────────────────────────────────── */

export function StepsSection({ steps, eyebrow = "our process", title, description, light = false }) {
  return (
    <Band light={light}>
      <div className="container">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} align="split" />
        <ol className="relative mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={(i % 3) * 90} className="group relative">
              <div className="flex items-center gap-4">
                <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border bg-card font-display text-lg font-bold text-brand shadow-subtle">
                  {String(i + 1).padStart(2, "0")}
                  <span className="absolute -inset-1 -z-10 rounded-[1.1rem] bg-brand-gradient opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-40" />
                </span>
                <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-brand/50 to-transparent" />
              </div>
              <h3 className="mt-6 font-display text-xl font-bold tracking-tight md:text-2xl">{step.title}</h3>
              <p className="mt-2 max-w-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </Band>
  );
}

/* ── Comparison table ──────────────────────────────────────────── */

function Cell({ value, highlight }) {
  if (value === true)
    return (
      <span className={cn("inline-flex h-7 w-7 items-center justify-center rounded-full", highlight ? "bg-brand text-brand-foreground" : "bg-success/15 text-success")}>
        <Check className="h-4 w-4" strokeWidth={3} />
        <span className="sr-only">Yes</span>
      </span>
    );
  if (value === false)
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">No</span>
      </span>
    );
  if (value === null || value === undefined) return <Minus className="h-4 w-4 text-muted-foreground" />;
  return <span className={cn("text-sm font-medium", highlight ? "text-brand" : "text-muted-foreground")}>{value}</span>;
}

export function ComparisonSection({
  rows,
  eyebrow = "the difference",
  title = "Snowdox vs. a typical agency",
  colA = "Snowdox",
  colB = "Typical agency",
  light = false,
}) {
  return (
    <Band light={light}>
      <div className="container grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow={eyebrow} title={title} description="An honest look at what you get — and what you usually don't." />
        </div>
        <Reveal delay={100} className="lg:col-span-8">
          <div className="overflow-hidden rounded-2xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-1/2">Feature</TableHead>
                  <TableHead className="text-center text-brand">{colA}</TableHead>
                  <TableHead className="text-center">{colB}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(([feature, a, b]) => (
                  <TableRow key={feature}>
                    <TableCell className="py-4 font-medium">{feature}</TableCell>
                    <TableCell className="py-4 text-center">
                      <Cell value={a} highlight />
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <Cell value={b} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Reveal>
      </div>
    </Band>
  );
}

/* ── Tools for this service ────────────────────────────────────── */

export function ServiceToolsSection({ groups, title = "Robust tools & technologies we work with", description, light = true }) {
  return (
    <Band light={light}>
      <div className="container">
        <SectionHeading eyebrow="tools & technologies" title={title} description={description} align="split" />
        <Reveal delay={100} className="mt-12">
          <Tabs defaultValue={groups[0].label}>
            <TabsList className="h-auto flex-wrap justify-start gap-1 rounded-xl border bg-card p-1.5">
              {groups.map((g) => (
                <TabsTrigger
                  key={g.label}
                  value={g.label}
                  className="rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background"
                >
                  {g.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {groups.map((g) => (
              <TabsContent key={g.label} value={g.label} forceMount className="mt-8 data-[state=inactive]:hidden">
                <TechGrid items={g.items} tone={light ? "light" : "dark"} />
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>
      </div>
    </Band>
  );
}

/* ── Industries ────────────────────────────────────────────────── */

export function IndustriesSection({ title = "Industries we serve", light = false }) {
  return (
    <Band light={light}>
      <div className="container">
        <SectionHeading eyebrow="industries" title={title} align="split" description="Deep experience across sectors — we learn your domain fast and speak your customers' language." />
        <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {industries.map((ind, i) => (
            <Reveal as="li" key={ind.name} delay={(i % 4) * 60}>
              <div className="group flex h-full items-center gap-4 rounded-2xl border bg-card p-5 transition-colors hover:border-brand/40">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                  <Icon name={ind.icon} className="h-5 w-5" />
                </span>
                <span className="font-medium">{ind.name}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Band>
  );
}

/* ── Related services ──────────────────────────────────────────── */

export function RelatedServices({ current }) {
  const others = services.filter((s) => s.slug !== current).slice(0, 3);
  return (
    <section className="section border-t border-white/[0.06]">
      <div className="container">
        <SectionHeading eyebrow="keep exploring" title="Pairs well with" />
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {others.map((s, i) => (
            <Reveal key={s.slug} delay={i * 80}>
              <Spotlight asChild className="group block h-full rounded-2xl border bg-card/60 p-7 hover:bg-card">
                <Link href={`/services/${s.slug}`}>
                  <span className="spotlight-border" aria-hidden />
                  <div className="flex items-center justify-between">
                    <Icon name={s.icon} className="h-5 w-5 text-brand" />
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:rotate-45 group-hover:text-brand" />
                  </div>
                  <h3 className="mt-8 font-display text-xl font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.short}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {s.tags.slice(0, 3).map((t) => (
                      <Badge key={t} variant="outline" className="font-normal text-muted-foreground">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </Link>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
