import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Check, ShieldCheck, TrendingUp, Zap, Bot, Mail, Database, MessageSquare, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CodeWindow } from "@/components/site/CodeWindow";
import { Reveal } from "@/components/site/effects/Reveal";
import { Icon } from "@/components/site/icons";
import { Band } from "./blocks";
import { cn } from "@/lib/utils";

/* ════════════════════════════════ SEO ════════════════════════════════ */

export function SeoKpiSection({ kpis }) {
  return (
    <Band>
      <div className="container">
        <SectionHeading
          eyebrow="what we measure"
          title={
            <>
              SEO that shows up in <span className="text-gradient">revenue</span>, not just rankings.
            </>
          }
          description="Every engagement is tracked against four numbers that actually matter to your business."
          align="split"
        />
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k, i) => (
            <Reveal key={k.title} delay={i * 80}>
              <div className="h-full rounded-2xl border bg-card p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/15 text-success">
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

const TRAFFIC = [1.2, 1.4, 1.3, 1.8, 2.1, 2.0, 2.7, 3.1, 3.4, 4.2, 4.6, 5.3]; // thousands of sessions
const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const KEYWORDS = [
  ["crm for small business", 14, 2, "6.6k"],
  ["simple sales pipeline", 23, 4, "2.9k"],
  ["best free crm", 41, 7, "12k"],
  ["crm with email automation", 9, 1, "1.3k"],
  ["contact management app", 32, 5, "4.4k"],
];

function TrafficChart() {
  const W = 520;
  const H = 180;
  const max = 6;
  const x = (i) => (i / (TRAFFIC.length - 1)) * (W - 40) + 20;
  const y = (v) => H - 24 - (v / max) * (H - 48);
  const line = TRAFFIC.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(TRAFFIC.length - 1)},${H - 24} L${x(0)},${H - 24} Z`;
  const last = TRAFFIC.length - 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Organic sessions rising from 1.2k to 5.3k per month over a year (illustrative)">
      <defs>
        <linearGradient id="seo-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="hsl(var(--success))" stopOpacity="0.35" />
          <stop offset="1" stopColor="hsl(var(--success))" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 2, 4, 6].map((g) => (
        <g key={g}>
          <line x1="20" x2={W - 20} y1={y(g)} y2={y(g)} stroke="hsl(var(--border))" strokeWidth="1" />
          <text x="0" y={y(g) + 4} fontSize="10" fill="hsl(var(--muted-foreground))">
            {g}k
          </text>
        </g>
      ))}
      <path d={area} fill="url(#seo-area)" />
      <path d={line} fill="none" stroke="hsl(var(--success))" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(last)} cy={y(TRAFFIC[last])} r="5" fill="hsl(var(--success))" stroke="hsl(var(--card))" strokeWidth="2" />
      <text x={x(last) - 6} y={y(TRAFFIC[last]) - 12} textAnchor="end" fontSize="12" fontWeight="600" fill="hsl(var(--foreground))">
        5.3k / mo
      </text>
      {MONTHS.map((m, i) => (
        <text key={i} x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">
          {m}
        </text>
      ))}
    </svg>
  );
}

export function SeoReportSection() {
  return (
    <Band className="pt-0">
      <div className="container grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <Reveal className="space-y-6 lg:col-span-5">
          <p className="eyebrow">
            <span className="text-muted-foreground">{"//"}</span> reporting
          </p>
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            A monthly report you&apos;ll actually read.
          </h2>
          <p className="text-muted-foreground md:text-lg">
            Plain-English updates on rankings, traffic, leads and what we&apos;re doing next — plus a live dashboard
            you can open any time.
          </p>
          <ul className="space-y-3">
            {["Keyword position tracking (desktop & mobile)", "Organic traffic & conversions by page", "Technical health score and fixes shipped", "Next month's priorities, agreed with you"].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border bg-card shadow-elegant">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <p className="text-sm font-semibold">SEO report · your-brand.com</p>
              <Badge variant="muted" className="font-mono text-[10px] uppercase">illustrative</Badge>
            </div>
            <div className="grid grid-cols-3 border-b">
              {[
                ["Organic sessions", "5.3k", "+342%"],
                ["Top-3 keywords", "38", "+31"],
                ["Organic leads", "126", "+4.1×"],
              ].map(([label, value, delta]) => (
                <div key={label} className="border-r px-5 py-4 last:border-r-0">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-1 font-display text-2xl font-bold">{value}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-success">
                    <TrendingUp className="h-3 w-3" /> {delta}
                  </p>
                </div>
              ))}
            </div>
            <div className="px-5 pb-2 pt-5">
              <p className="text-xs font-medium text-muted-foreground">Organic sessions per month</p>
              <TrafficChart />
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Keyword</TableHead>
                  <TableHead className="text-right">Before</TableHead>
                  <TableHead className="text-right">Now</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {KEYWORDS.map(([kw, before, now, vol]) => (
                  <TableRow key={kw}>
                    <TableCell className="font-medium">{kw}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums text-muted-foreground">#{before}</TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-1 font-mono font-semibold tabular-nums text-success">
                        <ArrowUpRight className="h-3.5 w-3.5" />#{now}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums text-muted-foreground">{vol}</TableCell>
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

export function SeoAuditSection({ audit, light = true }) {
  const tone = (s) => (s >= 80 ? "bg-success" : s >= 55 ? "bg-warning" : "bg-destructive");
  const label = (s) => (s >= 80 ? "Good" : s >= 55 ? "Needs work" : "Critical");
  return (
    <Band light={light}>
      <div className="container grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="free seo audit"
            title="Find out exactly what's holding your rankings back."
            description="Our audit checks 200+ factors across eight areas and turns them into a prioritised, plain-English action plan."
          />
          <Reveal delay={150} className="mt-8">
            <Button asChild variant="default" size="lg" className="rounded-full">
              <Link href="/contact">
                Get my free SEO audit <ArrowUpRight />
              </Link>
            </Button>
          </Reveal>
        </div>
        <Reveal delay={100} className="lg:col-span-7">
          <div className="rounded-2xl border bg-card p-6 shadow-subtle md:p-8">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Sample audit summary</p>
              <span className="rounded-full bg-warning/15 px-3 py-1 font-mono text-xs font-semibold text-warning">Overall 69 / 100</span>
            </div>
            <ul className="mt-6 space-y-5">
              {audit.map((a) => (
                <li key={a.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium">{a.label}</span>
                    <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                      <span className={cn("h-2 w-2 rounded-full", tone(a.score))} aria-hidden />
                      {label(a.score)} · {a.score}
                    </span>
                  </div>
                  <Progress value={a.score} className="h-2" indicatorClassName={tone(a.score)} />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Band>
  );
}

/* ════════════════════════════════ WEB ════════════════════════════════ */

export function PerformanceSection({ service }) {
  return (
    <Band>
      <div className="container grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="performance budget"
            title="Fast isn't a phase. It's a contract."
            description="Before we design anything, we agree on hard limits. Every pull request is checked against them, so your site stays fast long after launch."
          />
          <ul className="mt-10 space-y-5">
            {service.budget.map((b, i) => (
              <Reveal as="li" key={b.metric} delay={i * 70}>
                <div className="mb-2 flex items-baseline justify-between gap-4">
                  <span className="flex items-baseline gap-3">
                    <span className="font-mono text-sm font-semibold text-brand">{b.metric}</span>
                    <span className="text-sm text-muted-foreground">{b.label}</span>
                  </span>
                  <span className="font-mono text-sm text-success">{b.target}</span>
                </div>
                <Progress value={b.value} className="h-1.5" indicatorClassName="bg-success" />
              </Reveal>
            ))}
          </ul>
        </div>
        <Reveal delay={150} className="lg:col-span-7">
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-brand-gradient opacity-20 blur-3xl" />
            <CodeWindow code={service.code} filename={service.filename} highlightLine={1} />
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                ["Server-rendered", "HTML first"],
                ["Edge cached", "global CDN"],
                ["Revalidated", "on publish"],
              ].map(([a, b]) => (
                <div key={a} className="rounded-xl border bg-card p-4">
                  <Zap className="h-4 w-4 text-brand" />
                  <p className="mt-2 text-sm font-semibold">{a}</p>
                  <p className="text-xs text-muted-foreground">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Band>
  );
}

/* ═══════════════════════════════ DESIGN ═══════════════════════════════ */

export function DesignSystemSection() {
  const palette = [
    ["Navy", "#061B49"],
    ["Royal", "#0058F4"],
    ["Azure", "#027AFF"],
    ["Sky", "#04B6FF"],
    ["Snow", "#F4F7FA"],
    ["Night", "#050914"],
  ];
  return (
    <Band>
      <div className="container">
        <SectionHeading
          eyebrow="design systems"
          title={
            <>
              From tokens to <span className="text-gradient">screens</span> — one source of truth.
            </>
          }
          description="We design systems, not just pages: colour, type, spacing and components that keep every future screen on-brand."
          align="split"
        />
        <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Reveal className="rounded-2xl border bg-card p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">01 · Colour tokens</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {palette.map(([name, hex]) => (
                <div key={name}>
                  <span className="block aspect-square rounded-xl border border-white/10" style={{ background: hex }} />
                  <p className="mt-2 text-xs font-medium">{name}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{hex}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={90} className="rounded-2xl border bg-card p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">02 · Type scale</p>
            <div className="mt-6 space-y-3">
              {[
                ["Display", "text-5xl font-extrabold", "Aa"],
                ["Heading", "text-3xl font-bold", "Heading"],
                ["Title", "text-xl font-semibold", "Section title"],
                ["Body", "text-base", "Readable body copy"],
                ["Caption", "text-xs text-muted-foreground", "CAPTION · 12/16"],
              ].map(([label, cls, sample]) => (
                <div key={label} className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] pb-3 last:border-0">
                  <span className={cn("font-display leading-none", cls)}>{sample}</span>
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={180} className="rounded-2xl border bg-card p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">03 · Components</p>
            <div className="mt-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground">Primary</span>
                <span className="rounded-lg border px-4 py-2 text-sm font-medium">Secondary</span>
                <span className="rounded-lg px-4 py-2 text-sm font-medium text-brand">Link</span>
              </div>
              <div className="rounded-lg border px-3 py-2.5 text-sm text-muted-foreground">you@company.com</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="brand">New</Badge>
                <Badge variant="success">Live</Badge>
                <Badge variant="warning">Beta</Badge>
                <Badge variant="violet">Pro</Badge>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <span className="h-9 w-9 rounded-full bg-brand-gradient" />
                <div className="flex-1 space-y-1.5">
                  <span className="block h-2 w-24 rounded-full bg-foreground/70" />
                  <span className="block h-2 w-16 rounded-full bg-foreground/25" />
                </div>
                <span className="flex h-5 w-9 items-center rounded-full bg-brand p-0.5">
                  <span className="ml-auto h-4 w-4 rounded-full bg-white" />
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Band>
  );
}

export function PrinciplesSection({ principles, light = true }) {
  return (
    <Band light={light}>
      <div className="container">
        <SectionHeading eyebrow="design principles" title="The rules every screen has to pass." align="center" />
        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 70} className="bg-card p-8">
              <span className="font-display text-4xl font-extrabold text-brand">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 font-display text-xl font-bold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Band>
  );
}

/* ═══════════════════════════════ MOBILE ═══════════════════════════════ */

export function AppFeaturesSection({ features }) {
  return (
    <Band>
      <div className="container">
        <SectionHeading
          eyebrow="built in"
          title="Features your users expect — done properly."
          description="Battle-tested building blocks we ship in almost every app, so your budget goes into what makes you unique."
          align="split"
        />
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 70}>
              <div className="group flex h-full flex-col items-start gap-6 rounded-2xl border bg-card p-6 transition-colors hover:border-brand/40">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon name={f.icon} className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-bold leading-snug">{f.title}</h3>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Band>
  );
}

/* ═════════════════════════════════ AI ═════════════════════════════════ */

function FlowNode({ icon: NodeIcon, title, meta, tone = "default", className }) {
  return (
    <div
      className={cn(
        "relative z-10 flex min-w-0 items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-subtle",
        tone === "ai" && "border-brand/50 shadow-glow",
        className
      )}
    >
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", tone === "ai" ? "bg-brand-gradient text-white" : "bg-muted text-foreground")}>
        <NodeIcon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{title}</p>
        <p className="truncate font-mono text-[10px] text-muted-foreground">{meta}</p>
      </div>
    </div>
  );
}

export function WorkflowSection() {
  return (
    <Band>
      <div className="container grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="automation"
            title="AI that doesn't just chat — it gets work done."
            description="We connect models to your tools so they can read, decide and act. Humans stay in the loop wherever it matters."
          />
          <ul className="mt-8 space-y-3 text-sm">
            {["Triggers from email, forms, webhooks or schedules", "AI classifies, extracts and drafts with your rules", "Actions in your CRM, helpdesk, Slack or database", "Low-confidence cases routed to a person"].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <Reveal delay={120} className="lg:col-span-7">
          <div
            className="relative rounded-2xl border bg-card/40 p-5 md:p-8"
            role="img"
            aria-label="Diagram: a new email triggers an AI step, which updates the CRM, alerts Slack, or sends to human review"
          >
            <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(hsl(var(--foreground)/0.07)_1px,transparent_1px)] [background-size:18px_18px]" />
            <div className="relative grid grid-cols-1 items-center gap-4 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.1fr)_auto_minmax(0,1fr)]">
              <FlowNode icon={Mail} title="New support email" meta="trigger · inbox" />
              <svg className="mx-auto h-8 w-8 rotate-90 xl:rotate-0" viewBox="0 0 32 32" aria-hidden>
                <line x1="0" y1="16" x2="32" y2="16" stroke="hsl(var(--brand))" strokeWidth="2" strokeDasharray="4 4" style={{ animation: "dash-flow 0.8s linear infinite" }} />
              </svg>
              <FlowNode icon={Bot} title="Classify & extract" meta="llm · intent, order id" tone="ai" />
              <svg className="mx-auto h-8 w-8 rotate-90 xl:rotate-0" viewBox="0 0 32 32" aria-hidden>
                <line x1="0" y1="16" x2="32" y2="16" stroke="hsl(var(--brand))" strokeWidth="2" strokeDasharray="4 4" style={{ animation: "dash-flow 0.8s linear infinite" }} />
              </svg>
              <div className="space-y-3">
                <FlowNode icon={Database} title="Update CRM" meta="action · hubspot" />
                <FlowNode icon={MessageSquare} title="Alert #support" meta="action · slack" />
                <FlowNode icon={UserCheck} title="Human review" meta="if confidence < 0.8" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Band>
  );
}

export function UseCasesSection({ useCases, light = true }) {
  return (
    <Band light={light}>
      <div className="container">
        <SectionHeading eyebrow="use cases" title="Where AI pays for itself first" align="split" description="Start where the hours are. These are the workflows we automate most often." />
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((u, i) => (
            <Reveal key={u.team} delay={(i % 3) * 80}>
              <div className="group h-full rounded-2xl border bg-card p-7 shadow-subtle transition-all duration-500 hover:-translate-y-1 hover:border-brand/40">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Icon name={u.icon} className="h-5 w-5" />
                  </span>
                  <ArrowDownRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:-rotate-45 group-hover:text-brand" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-bold">{u.team}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{u.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Band>
  );
}

export function GuardrailsSection({ service }) {
  return (
    <Band>
      <div className="container grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="safety & trust" title="Guardrails first. Hype never." description="AI in production needs the same rigour as any critical system. These come standard." />
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {service.pillars.map((p) => (
              <div key={p.title} className="rounded-2xl border bg-card p-5">
                <Icon name={p.icon} className="h-5 w-5 text-brand" />
                <p className="mt-4 font-semibold">{p.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
        <Reveal delay={120}>
          <div className="rounded-2xl border border-success/30 bg-success/[0.04] p-8">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-success">
              <ShieldCheck className="h-4 w-4" /> Security checklist
            </p>
            <ul className="mt-6 divide-y divide-border">
              {service.guardrails.map((g) => (
                <li key={g} className="flex items-center gap-3 py-3.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-white">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="font-medium">{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Band>
  );
}

/* ══════════════════════════════ COMMERCE ══════════════════════════════ */

export function FunnelSection({ funnel }) {
  return (
    <Band>
      <div className="container grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading
            eyebrow="conversion"
            title="We fix every leak in your funnel."
            description="Small lifts at every stage compound into big revenue gains. Here's where we focus."
          />
          <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Bars show a typical store funnel</p>
        </div>
        <ol className="space-y-3 lg:col-span-8">
          {funnel.map((f, i) => (
            <Reveal as="li" key={f.stage} delay={i * 80}>
              <div className="grid grid-cols-1 items-center gap-4 rounded-2xl border bg-card p-4 md:grid-cols-12 md:p-5">
                <div className="md:col-span-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">
                      <span className="mr-2 font-mono text-xs text-brand">{String(i + 1).padStart(2, "0")}</span>
                      {f.stage}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{f.value}%</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${f.value}%` }} />
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground md:col-span-7">{f.tactic}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Band>
  );
}
