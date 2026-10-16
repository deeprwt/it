"use client";

import { useEffect, useRef, useState } from "react";
import {
  Apple,
  BadgeCheck,
  Bell,
  Bot,
  Check,
  ChevronUp,
  Frame,
  Headphones,
  Home,
  Layers,
  MousePointer2,
  Play,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  Type,
  User,
  PenTool,
  Square,
  Mic,
} from "lucide-react";
import { useInView, prefersReducedMotion } from "@/components/site/effects/use-in-view";
import { cn } from "@/lib/utils";

function Chrome({ url, children, className }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-card shadow-elegant", className)}>
      <div className="flex items-center gap-2 border-b border-white/10 bg-background/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 flex-1 truncate rounded-md bg-card px-3 py-1 font-mono text-[11px] text-muted-foreground">{url}</span>
      </div>
      {children}
    </div>
  );
}

function Glow({ className }) {
  return <div aria-hidden className={cn("absolute -inset-4 -z-10 rounded-[2rem] bg-brand-gradient opacity-25 blur-3xl", className)} />;
}

/* ═════════════════════════ SEO — SERP climb ═════════════════════════ */

const SERP = [
  { id: "a", site: "bigcrm.com", title: "BigCRM — CRM Software for Enterprises", desc: "Powerful enterprise CRM with advanced pipelines and reporting…" },
  { id: "b", site: "reviews-hub.com", title: "15 Best CRMs for Small Business (Tested)", desc: "We compared pricing, features and support of the top CRMs…" },
  { id: "c", site: "salesapp.io", title: "SalesApp | Simple CRM for Teams", desc: "Track deals and contacts in one simple workspace…" },
  { id: "you", site: "your-brand.com", title: "Your Brand — The CRM Small Businesses Love", desc: "Set up in 5 minutes. Pipelines, email and automation in one place…" },
  { id: "d", site: "crm-guide.org", title: "What Is a CRM? A Beginner's Guide", desc: "Everything you need to know about customer relationship…" },
];
const START = ["a", "b", "c", "d", "you"];
const END = ["you", "a", "b", "c", "d"];
const QUERY = "best crm for small business";

export function SerpVisual() {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [typed, setTyped] = useState(QUERY);
  const [order, setOrder] = useState(START);
  const [climbed, setClimbed] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setOrder(END);
      setClimbed(true);
      return;
    }
    if (!inView) return;
    const timers = [];
    const cycle = () => {
      setOrder(START);
      setClimbed(false);
      setTyped("");
      [...QUERY].forEach((_, i) => timers.push(setTimeout(() => setTyped(QUERY.slice(0, i + 1)), 300 + i * 45)));
      timers.push(setTimeout(() => setOrder(["a", "b", "you", "c", "d"]), 2600));
      timers.push(setTimeout(() => setOrder(END), 3700));
      timers.push(setTimeout(() => setClimbed(true), 4300));
      timers.push(setTimeout(cycle, 9000));
    };
    cycle();
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const ROW = 76;

  return (
    <div ref={ref} className="relative" role="img" aria-label="Illustration: a Google search results page where your website climbs to position one">
      <Glow />
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f1013] shadow-elegant">
        {/* Search bar */}
        <div className="flex items-center gap-4 border-b border-white/10 px-5 py-4">
          <span className="font-display text-xl font-bold tracking-tight">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </span>
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="truncate text-foreground">
              {typed}
              <span className="ml-px inline-block h-4 w-px translate-y-0.5 animate-blink bg-foreground" />
            </span>
            <Mic className="ml-auto h-4 w-4 text-[#4285F4]" />
          </div>
        </div>

        {/* Results */}
        <div className="relative px-5 py-4" style={{ height: SERP.length * ROW + 24 }}>
          {SERP.map((r) => {
            const pos = order.indexOf(r.id);
            const you = r.id === "you";
            return (
              <div
                key={r.id}
                className={cn(
                  "absolute inset-x-5 rounded-xl px-3 py-2 transition-all duration-700 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)]",
                  you && "z-10 border border-brand/50 bg-brand/[0.08] shadow-glow"
                )}
                style={{ top: 12 + pos * ROW }}
              >
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold", you ? "bg-brand text-brand-foreground" : "bg-white/10")}>
                    {r.site[0].toUpperCase()}
                  </span>
                  {r.site}
                  {you && (
                    <span className="ml-auto flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-success">
                      <ChevronUp className="h-3 w-3" /> #{pos + 1}
                    </span>
                  )}
                </div>
                <p className={cn("mt-1 truncate text-[15px] font-medium", you ? "text-brand" : "text-[#8ab4f8]")}>{r.title}</p>
                <p className="truncate text-xs text-muted-foreground">{r.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 border-t border-white/10">
          {[
            ["Position", climbed ? "#1" : `#${order.indexOf("you") + 1}`],
            ["Click-through", climbed ? "31.7%" : "2.1%"],
            ["Rich result", climbed ? "FAQ + ★" : "—"],
          ].map(([label, value]) => (
            <div key={label} className="border-r border-white/10 px-4 py-3 last:border-r-0">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
              <p className={cn("mt-1 font-display text-lg font-bold transition-colors", climbed ? "text-success" : "text-foreground")}>{value}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">illustrative example</p>
    </div>
  );
}

/* ═════════════════════════ WEB — Lighthouse ═════════════════════════ */

function Gauge({ value, label }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
          <circle cx="32" cy="32" r={r} fill="none" stroke="hsl(var(--success) / 0.15)" strokeWidth="6" />
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke="hsl(var(--success))"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - value / 100)}
            style={{ transition: "stroke-dashoffset 80ms linear" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono text-base font-semibold text-success">{Math.round(value)}</span>
      </div>
      <span className="text-center text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}

export function LighthouseVisual() {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [p, setP] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return setP(1);
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1800);
      setP(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  const scores = [
    ["Performance", 100],
    ["Accessibility", 100],
    ["Best Practices", 100],
    ["SEO", 100],
  ];

  return (
    <div ref={ref} className="relative" role="img" aria-label="Illustration: a website with perfect Lighthouse scores and passing Core Web Vitals">
      <Glow />
      <Chrome url="https://your-brand.com">
        <div className="grid grid-cols-1 gap-0 sm:grid-cols-5">
          {/* fake site */}
          <div className="space-y-4 border-b border-white/10 p-5 sm:col-span-3 sm:border-b-0 sm:border-r">
            <div className="flex items-center justify-between">
              <span className="h-3 w-16 rounded-full bg-foreground/80" />
              <div className="flex gap-2">
                <span className="h-2 w-8 rounded-full bg-foreground/25" />
                <span className="h-2 w-8 rounded-full bg-foreground/25" />
                <span className="h-5 w-14 rounded-full bg-brand" />
              </div>
            </div>
            <div className="space-y-2 pt-4">
              <span className="block h-5 w-11/12 rounded-md bg-foreground/85" />
              <span className="block h-5 w-8/12 rounded-md bg-foreground/85" />
              <span className="mt-3 block h-2 w-10/12 rounded-full bg-foreground/25" />
              <span className="block h-2 w-9/12 rounded-full bg-foreground/25" />
            </div>
            <div className="aspect-[16/8] rounded-xl bg-[radial-gradient(at_20%_30%,hsl(var(--brand)/0.6),transparent_55%),radial-gradient(at_80%_70%,hsl(var(--brand-2)/0.55),transparent_55%)]" />
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-10 rounded-lg bg-foreground/[0.06]" />
              ))}
            </div>
          </div>
          {/* report */}
          <div className="p-5 sm:col-span-2">
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <BadgeCheck className="h-3.5 w-3.5 text-success" /> Lighthouse
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {scores.map(([label, v]) => (
                <Gauge key={label} value={v * p} label={label} />
              ))}
            </div>
            <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
              {[
                ["LCP", "0.8s"],
                ["INP", "64ms"],
                ["CLS", "0.01"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between font-mono text-xs">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="flex items-center gap-1.5 text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" /> {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Chrome>
    </div>
  );
}

/* ═════════════════════════ DESIGN — canvas ═════════════════════════ */

export function DesignCanvasVisual() {
  return (
    <div className="relative" role="img" aria-label="Illustration: a design tool canvas with a selected interface card, colour palette and collaborators">
      <Glow className="opacity-20" />
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0e0f12] shadow-elegant">
        {/* toolbar */}
        <div className="flex items-center gap-1 border-b border-white/10 px-3 py-2">
          {[MousePointer2, Frame, Square, PenTool, Type].map((I, i) => (
            <span key={i} className={cn("flex h-7 w-7 items-center justify-center rounded-md", i === 1 ? "bg-brand text-brand-foreground" : "text-muted-foreground")}>
              <I className="h-3.5 w-3.5" />
            </span>
          ))}
          <span className="ml-auto flex -space-x-2">
            {["bg-brand", "bg-brand-2", "bg-warning"].map((c, i) => (
              <span key={i} className={cn("h-6 w-6 rounded-full border-2 border-[#0e0f12]", c)} />
            ))}
          </span>
        </div>
        <div className="grid grid-cols-12">
          {/* layers */}
          <div className="col-span-3 hidden space-y-1 border-r border-white/10 p-3 text-[11px] text-muted-foreground sm:block">
            <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest">
              <Layers className="h-3 w-3" /> Layers
            </p>
            {["Card / Pricing", "Image", "Title", "Body", "Button / Primary", "Badge"].map((l, i) => (
              <p key={l} className={cn("truncate rounded px-2 py-1", i === 0 && "bg-brand/15 text-brand")}>
                {l}
              </p>
            ))}
          </div>
          {/* canvas */}
          <div className="relative col-span-12 h-[300px] bg-[radial-gradient(hsl(var(--foreground)/0.08)_1px,transparent_1px)] [background-size:16px_16px] sm:col-span-6">
            <div className="absolute left-1/2 top-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2">
              <div className="rounded-xl bg-white p-3 text-[#0b0b0f] shadow-elegant">
                <div className="aspect-[16/9] rounded-lg bg-[linear-gradient(120deg,#0AE4FF,#8B5CF6)]" />
                <p className="mt-3 font-display text-sm font-bold">Pro plan</p>
                <p className="mt-1 text-[10px] text-[#5b5f6b]">Everything you need to ship faster.</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-display text-lg font-extrabold">$49</span>
                  <span className="rounded-md bg-[#0b0b0f] px-2.5 py-1 text-[10px] font-semibold text-white">Get started</span>
                </div>
              </div>
              {/* selection */}
              <div className="pointer-events-none absolute -inset-1.5 rounded-sm border border-brand">
                {["-left-1 -top-1", "-right-1 -top-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((pos) => (
                  <span key={pos} className={cn("absolute h-2 w-2 border border-brand bg-white", pos)} />
                ))}
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded bg-brand px-1.5 py-0.5 font-mono text-[9px] text-brand-foreground">
                  200 × 236
                </span>
              </div>
            </div>
            {/* collaborator cursor */}
            <div className="absolute left-[18%] top-[22%] animate-[cursor-path_7s_ease-in-out_infinite] motion-reduce:animate-none">
              <MousePointer2 className="h-4 w-4 fill-brand-2 text-brand-2" />
              <span className="ml-3 rounded-full bg-brand-2 px-2 py-0.5 text-[10px] font-semibold text-white">Ana · design</span>
            </div>
          </div>
          {/* inspector */}
          <div className="col-span-3 hidden space-y-4 border-l border-white/10 p-3 text-[11px] sm:block">
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Fill</p>
              <div className="grid grid-cols-3 gap-1.5">
                {["#0AE4FF", "#8B5CF6", "#06070A", "#F4F7FA", "#FF5C8A", "#FFC542"].map((c) => (
                  <span key={c} className="aspect-square rounded-md border border-white/10" style={{ background: c }} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Text</p>
              <p className="font-display text-3xl font-bold leading-none">Aa</p>
              <p className="mt-1 text-muted-foreground">Syne · Bold · 48</p>
            </div>
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Radius</p>
              <p className="font-mono">12px</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════ MOBILE — phones ═════════════════════════ */

function Phone({ className, variant = "a" }) {
  return (
    <div className={cn("relative w-[190px] rounded-[2.2rem] border-[6px] border-[#1c1d22] bg-[#0b0c10] p-2 shadow-elegant", className)}>
      <div className="absolute left-1/2 top-2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-[#1c1d22]" />
      <div className="relative h-[370px] overflow-hidden rounded-[1.7rem] bg-background">
        <div className="flex items-center justify-between px-4 pt-6 font-mono text-[9px] text-muted-foreground">
          <span>9:41</span>
          <span>●●● 5G</span>
        </div>
        {variant === "a" ? (
          <div className="space-y-3 px-4 pt-4">
            <p className="text-[10px] text-muted-foreground">Good morning,</p>
            <p className="-mt-2 font-display text-lg font-bold">Sam 👋</p>
            <div className="rounded-2xl bg-brand-gradient p-3 text-white">
              <p className="text-[9px] opacity-80">This week</p>
              <p className="font-display text-2xl font-extrabold">12.4 km</p>
              <div className="mt-2 flex h-8 items-end gap-1">
                {[40, 70, 45, 90, 60, 100, 75].map((h, i) => (
                  <span key={i} className="flex-1 rounded-sm bg-white/70" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            {["Morning run", "Strength · 30 min", "Yoga flow"].map((t, i) => (
              <div key={t} className="flex items-center gap-2 rounded-xl border border-white/10 bg-card p-2">
                <span className={cn("h-7 w-7 rounded-lg", ["bg-brand/30", "bg-brand-2/30", "bg-success/30"][i])} />
                <div className="flex-1">
                  <p className="text-[10px] font-semibold">{t}</p>
                  <span className="mt-1 block h-1 w-16 rounded-full bg-foreground/15" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 px-4 pt-4">
            <div className="flex items-center justify-between">
              <p className="font-display text-base font-bold">Orders</p>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="aspect-square rounded-2xl bg-[radial-gradient(at_30%_30%,hsl(var(--brand-2)/0.7),transparent_60%),radial-gradient(at_70%_80%,hsl(var(--brand)/0.6),transparent_60%)]" />
            <p className="text-[11px] font-semibold">Out for delivery</p>
            <div className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
              <span className="block h-full w-3/4 rounded-full bg-brand" />
            </div>
            <p className="text-[9px] text-muted-foreground">Arriving today · 4:30 – 5:00 pm</p>
          </div>
        )}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-around rounded-2xl border border-white/10 bg-card/90 py-2 text-muted-foreground backdrop-blur">
          <Home className="h-4 w-4 text-brand" />
          <Search className="h-4 w-4" />
          <ShoppingCart className="h-4 w-4" />
          <User className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

export function PhonesVisual() {
  return (
    <div className="relative flex min-h-[440px] items-center justify-center" role="img" aria-label="Illustration: two mobile app screens on iOS and Android">
      <Glow className="opacity-20" />
      <Phone className="relative z-10 -rotate-6" variant="a" />
      <Phone className="-ml-10 mt-16 rotate-6 opacity-95" variant="b" />
      <div className="absolute left-1/2 top-4 z-20 w-64 -translate-x-1/2 animate-[toast-in_6s_ease-in-out_infinite] rounded-2xl border border-white/10 bg-card/95 p-3 shadow-elegant backdrop-blur motion-reduce:animate-none">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-gradient text-white">
            <Bell className="h-4 w-4" />
          </span>
          <div className="text-xs">
            <p className="font-semibold">Your order is on the way 🚚</p>
            <p className="text-muted-foreground">Tap to track in real time</p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-card px-3 py-1.5 text-xs font-medium">
          <Apple className="h-3.5 w-3.5" /> App Store
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-card px-3 py-1.5 text-xs font-medium">
          <Play className="h-3.5 w-3.5 fill-current" /> Google Play
        </span>
      </div>
    </div>
  );
}

/* ═════════════════════════ AI — support agent ═════════════════════════ */

const AGENT_REPLY =
  "Sorry for the wait! Order #4821 left our warehouse on Monday and is out for delivery today before 6 pm. I've also added a 10% credit to your account for the delay.";

export function AgentChatVisual() {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [stage, setStage] = useState(0); // 0 user, 1 typing, 2 streaming, 3 done
  const [words, setWords] = useState(0);
  const timers = useRef([]);
  const total = AGENT_REPLY.split(" ").length;

  useEffect(() => {
    if (prefersReducedMotion()) {
      setStage(3);
      setWords(total);
      return;
    }
    if (!inView) return;
    const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
    const run = () => {
      setStage(0);
      setWords(0);
      later(() => setStage(1), 900);
      later(() => {
        setStage(2);
        for (let i = 1; i <= total; i++) later(() => setWords(i), i * 70);
        later(() => setStage(3), total * 70 + 300);
      }, 2300);
      later(run, 2300 + total * 70 + 4500);
    };
    run();
    const all = timers.current;
    return () => all.forEach(clearTimeout);
  }, [inView, total]);

  return (
    <div ref={ref} className="relative" role="img" aria-label="Illustration: an AI support agent answering a customer question with sources">
      <Glow />
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-card shadow-elegant">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
            <Bot className="h-4 w-4" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-success" />
          </span>
          <div>
            <p className="text-sm font-semibold">Support agent</p>
            <p className="text-[11px] text-success">online · answers in seconds</p>
          </div>
          <span className="ml-auto flex items-center gap-1 rounded-full bg-brand/10 px-2 py-1 font-mono text-[10px] text-brand">
            <Sparkles className="h-3 w-3" /> AI
          </span>
        </div>
        <div className="min-h-[300px] space-y-4 p-5 text-sm">
          <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-foreground px-4 py-2.5 text-background">
            Hi! Where&apos;s my order #4821? It was meant to arrive yesterday.
          </div>
          {stage === 1 && (
            <div className="flex w-16 items-center justify-center gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-3">
              {[0, 150, 300].map((d) => (
                <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          )}
          {stage >= 2 && (
            <div className="max-w-[88%] space-y-3">
              <div className="rounded-2xl rounded-bl-md border border-white/10 bg-muted px-4 py-2.5 leading-relaxed">
                {AGENT_REPLY.split(" ").slice(0, words).join(" ")}
                {stage === 2 && <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-blink bg-brand" />}
              </div>
              {stage === 3 && (
                <div className="flex flex-wrap gap-1.5 animate-in fade-in slide-in-from-bottom-1">
                  {["orders/4821", "shipping-policy.md", "goodwill-credits.md"].map((s) => (
                    <span key={s} className="rounded-md border border-white/10 bg-background px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                      ↳ {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 font-mono text-[11px]">
          <span className={cn("flex items-center gap-1.5 transition-colors", stage === 3 ? "text-success" : "text-muted-foreground")}>
            <Check className="h-3.5 w-3.5" /> {stage === 3 ? "Resolved automatically" : "Retrieving sources…"}
          </span>
          <span className="text-muted-foreground">confidence {stage === 3 ? "0.94" : "—"}</span>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════ COMMERCE — storefront ═════════════════════════ */

const COLOURS = [
  { name: "Midnight", swatch: "#1b1d24", tint: "text-foreground" },
  { name: "Frost", swatch: "#0AE4FF", tint: "text-brand" },
  { name: "Violet", swatch: "#8B5CF6", tint: "text-brand-2" },
];

export function StorefrontVisual() {
  const [colour, setColour] = useState(COLOURS[1]);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => {
      setAdded(true);
      setTimeout(() => setAdded(false), 2600);
    }, 5200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative" role="img" aria-label="Illustration: an online store product page with add-to-cart and checkout">
      <Glow />
      <Chrome url="https://your-store.com/products/aurora-headphones">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="relative flex aspect-square items-center justify-center bg-[radial-gradient(at_30%_25%,hsl(var(--brand)/0.55),transparent_55%),radial-gradient(at_75%_75%,hsl(var(--brand-2)/0.6),transparent_55%)]">
            <span className="absolute h-40 w-40 rounded-full bg-background/40 blur-2xl" />
            <Headphones
              className={cn("relative h-36 w-36 drop-shadow-[0_20px_30px_rgba(0,0,0,0.55)] transition-colors duration-500", colour.tint)}
              strokeWidth={1.4}
            />
            <span className="absolute left-4 top-4 rounded-full bg-background/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur">
              new drop
            </span>
          </div>
          <div className="space-y-4 p-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Audio · Wireless</p>
              <p className="mt-1 font-display text-xl font-bold">Aurora Headphones</p>
              <div className="mt-1 flex items-center gap-1 text-warning">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
                <span className="ml-1 text-xs text-muted-foreground">(1,284)</span>
              </div>
            </div>
            <p className="font-display text-2xl font-extrabold">$129</p>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">
                Colour · <span className="text-foreground">{colour.name}</span>
              </p>
              <div className="flex gap-2">
                {COLOURS.map((c) => (
                  <span
                    key={c.name}
                    onMouseEnter={() => setColour(c)}
                    className={cn(
                      "h-8 w-8 rounded-full border-2 transition-transform",
                      colour.name === c.name ? "scale-110 border-foreground" : "border-white/10"
                    )}
                    style={{ background: c.swatch }}
                  />
                ))}
              </div>
            </div>
            <div className={cn("flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all", added ? "bg-success text-white" : "bg-foreground text-background")}>
              {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
              {added ? "Added to cart" : "Add to cart"}
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-medium">
              <span className="flex items-center justify-center gap-1 rounded-md border border-white/10 py-1.5">
                <Apple className="h-3 w-3" /> Pay
              </span>
              <span className="rounded-md border border-white/10 py-1.5">G Pay</span>
            </div>
          </div>
        </div>
      </Chrome>
      <div
        className={cn(
          "absolute -right-3 top-20 w-56 rounded-xl border border-white/10 bg-card/95 p-3 shadow-elegant backdrop-blur transition-all duration-500",
          added ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
        )}
      >
        <p className="flex items-center gap-2 text-xs font-semibold">
          <ShoppingCart className="h-3.5 w-3.5 text-brand" /> Cart · 1 item
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">Aurora Headphones · {colour.name}</p>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold">$129.00</span>
        </div>
        <div className="mt-2 rounded-md bg-brand py-1.5 text-center text-[11px] font-semibold text-brand-foreground">Checkout →</div>
      </div>
    </div>
  );
}
