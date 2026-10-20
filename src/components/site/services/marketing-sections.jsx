import { ArrowDown, ArrowRight, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/effects/Reveal";
import { Icon } from "@/components/site/icons";
import { TechLogo, techName } from "@/components/site/tech/ToolsSection";
import { Band } from "./blocks";
import { cn } from "@/lib/utils";

/* ═══════════════════════════ Shared ═══════════════════════════ */

export function KpiSection({ kpis, eyebrow = "what we measure", title, description, light = false }) {
  return (
    <Band light={light}>
      <div className="container">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} align="split" />
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k, i) => (
            <Reveal key={k.title} delay={i * 80}>
              <div className="h-full rounded-2xl border bg-card p-6 shadow-subtle">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon name={k.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-display text-xl font-bold">{k.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{k.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Band>
  );
}

/* ═══════════════════════════ Social ═══════════════════════════ */

export function PlatformsSection({ platforms, light = true }) {
  return (
    <Band light={light}>
      <div className="container">
        <SectionHeading
          eyebrow="platforms"
          title="Every platform, played the way it's meant to be"
          description="Each network has its own culture, formats and algorithm. We create for each one natively — never one post resized six ways."
          align="split"
        />
        <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {platforms.map((p, i) => (
            <Reveal as="li" key={p.id} delay={(i % 4) * 70}>
              <div className="group h-full rounded-2xl border bg-card p-6 shadow-subtle transition-all duration-500 hover:-translate-y-1 hover:border-brand/40">
                <TechLogo id={p.id} tone={light ? "light" : "dark"} className="h-10 w-10" />
                <h3 className="mt-6 font-display text-lg font-bold">{techName(p.id)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Band>
  );
}

const TYPE_STYLES = {
  Reel: "border-[#ee2a7b]/30 bg-[#ee2a7b]/10 text-[#ff5c9a]",
  Short: "border-[#ff0000]/30 bg-[#ff0000]/10 text-[#ff6b6b]",
  Carousel: "border-brand/30 bg-brand/10 text-brand",
  Story: "border-warning/30 bg-warning/10 text-warning",
  Post: "border-success/30 bg-success/10 text-success",
};

export function ContentCalendarSection({ calendar }) {
  const types = Object.keys(TYPE_STYLES);
  return (
    <Band>
      <div className="container">
        <SectionHeading
          eyebrow="content calendar"
          title="A month of content, planned before it's posted"
          description="You approve every month's calendar in advance. Here's what a typical week looks like."
          align="split"
        />
        <Reveal delay={100} className="mt-12 overflow-hidden rounded-2xl border bg-card/60">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
            <p className="text-sm font-semibold">Week 2 · sample calendar</p>
            <div className="flex flex-wrap gap-1.5">
              {types.map((t) => (
                <span key={t} className={cn("rounded-md border px-2 py-0.5 text-[11px] font-medium", TYPE_STYLES[t])}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <ol className="grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-7 lg:divide-x">
            {calendar.map((d) => (
              <li key={d.day} className="min-h-[150px] border-border p-4 sm:border-b lg:border-b-0">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{d.day}</p>
                <div className="mt-3 space-y-2">
                  {d.posts.map((p) => (
                    <div key={p.title} className={cn("rounded-lg border p-2.5", TYPE_STYLES[p.type])}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider">{p.type}</p>
                      <p className="mt-0.5 text-xs font-medium text-foreground">{p.title}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">{p.platform}</p>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </Band>
  );
}

/* ═════════════════════════ Performance ═════════════════════════ */

export function ChannelsSection({ channels, light = true }) {
  return (
    <Band light={light}>
      <div className="container">
        <SectionHeading
          eyebrow="ad channels"
          title="The right channel for every job"
          description="We pick channels by what they do best — capturing intent, creating demand or reaching decision-makers — then fund what pays back."
          align="split"
        />
        <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map((c, i) => (
            <Reveal as="li" key={c.id} delay={(i % 3) * 80}>
              <div className="group flex h-full items-start gap-5 rounded-2xl border bg-card p-6 shadow-subtle transition-all duration-500 hover:-translate-y-1 hover:border-brand/40">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border bg-background">
                  <TechLogo id={c.id} tone={light ? "light" : "dark"} className="h-7 w-7" />
                </span>
                <div>
                  <Badge variant="brand" className="font-mono text-[10px] uppercase tracking-widest">
                    {c.role}
                  </Badge>
                  <h3 className="mt-3 font-display text-lg font-bold">{techName(c.id)}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Band>
  );
}

export function AdsFunnelSection({ funnel }) {
  const widths = ["lg:w-full", "lg:w-[86%]", "lg:w-[72%]"];
  return (
    <Band>
      <div className="container grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading
            eyebrow="full-funnel strategy"
            title="Ads for every stage of the buying journey"
            description="Most accounts only chase the bottom of the funnel. We feed it from the top so there are always new people ready to convert."
          />
        </div>
        <ol className="flex flex-col items-center gap-3 lg:col-span-8">
          {funnel.map((f, i) => (
            <Reveal as="li" key={f.stage} delay={i * 120} className={cn("w-full", widths[i])}>
              <div className="relative overflow-hidden rounded-2xl border bg-card p-6">
                <div
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-1.5 bg-brand-gradient"
                  style={{ opacity: 0.5 + i * 0.25 }}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-center">
                  <div className="md:col-span-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{f.label}</p>
                    <h3 className="mt-1 font-display text-2xl font-bold">{f.stage}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground md:col-span-4">{f.goal}</p>
                  <dl className="space-y-1.5 text-xs md:col-span-4">
                    <div>
                      <dt className="font-mono uppercase tracking-widest text-muted-foreground">Channels</dt>
                      <dd className="font-medium">{f.channels}</dd>
                    </div>
                    <div>
                      <dt className="font-mono uppercase tracking-widest text-muted-foreground">We optimise</dt>
                      <dd className="font-medium text-brand">{f.kpi}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              {i < funnel.length - 1 && <ArrowDown className="mx-auto mt-3 h-4 w-4 text-muted-foreground" />}
            </Reveal>
          ))}
        </ol>
      </div>
    </Band>
  );
}

export function OptimizationLoopSection({ loop, light = true }) {
  return (
    <Band light={light}>
      <div className="container">
        <SectionHeading
          eyebrow="how we optimise"
          title="Launch. Test. Measure. Scale. Repeat."
          description="Paid media rewards whoever learns fastest. Our weekly loop keeps your cost per result falling month after month."
          align="center"
        />
        <ol className="relative mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loop.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 90} className="relative">
              <div className="h-full rounded-2xl border bg-card p-6 shadow-subtle">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gradient font-display text-base font-bold text-white shadow-glow">
                  {i + 1}
                </span>
                <h3 className="mt-6 font-display text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
              {i < loop.length - 1 ? (
                <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-brand lg:block" />
              ) : (
                <RefreshCw className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-brand lg:block" />
              )}
            </Reveal>
          ))}
        </ol>
      </div>
    </Band>
  );
}

export function MetricsGlossarySection({ metrics }) {
  return (
    <Band>
      <div className="container">
        <SectionHeading
          eyebrow="metrics that matter"
          title="We report on profit, not clicks"
          description="Every report leads with the numbers that hit your bottom line — explained in plain language."
          align="split"
        />
        <dl className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((m, i) => (
            <Reveal key={m.name} delay={(i % 3) * 70} className="bg-card p-7">
              <dt>
                <span className="font-display text-4xl font-extrabold text-gradient">{m.name}</span>
                <span className="mt-2 block text-sm font-semibold">{m.full}</span>
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.body}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </Band>
  );
}
