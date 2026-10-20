"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Bookmark,
  FlaskConical,
  Heart,
  Instagram,
  Linkedin,
  MessageCircle,
  Facebook,
  Send,
  TrendingUp,
  UserPlus,
  Youtube,
  MoreHorizontal,
} from "lucide-react";
import { useInView, prefersReducedMotion } from "@/components/site/effects/use-in-view";
import { cn } from "@/lib/utils";

function Glow({ className }) {
  return <div aria-hidden className={cn("absolute -inset-4 -z-10 rounded-[2rem] bg-brand-gradient opacity-25 blur-3xl", className)} />;
}

/** Counts from `from` to `to` once `start` becomes true. */
function useCountUp(to, start, { from = 0, duration = 1600 } = {}) {
  const [v, setV] = useState(to);
  useEffect(() => {
    if (prefersReducedMotion()) return setV(to);
    if (!start) return setV(from);
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      setV(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, from, start, duration]);
  return v;
}

/* ═══════════════════ SOCIAL — phone feed + notifications ═══════════════════ */

const NOTIFICATIONS = [
  { icon: Heart, tone: "text-[#ff3d6e]", text: "ria.designs and 342 others liked your Reel" },
  { icon: UserPlus, tone: "text-brand", text: "+284 new followers this week" },
  { icon: MessageCircle, tone: "text-success", text: "New DM: “Is this available in blue?”" },
  { icon: TrendingUp, tone: "text-warning", text: "Your carousel is performing better than 92% of posts" },
];

export function SocialFeedVisual() {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [likes, setLikes] = useState(12480);
  const [liked, setLiked] = useState(false);
  const [slide, setSlide] = useState(0);
  const [note, setNote] = useState(0);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    const a = setInterval(() => setLikes((n) => n + Math.ceil(Math.random() * 37)), 900);
    const b = setInterval(() => setSlide((s) => (s + 1) % 4), 2600);
    const c = setInterval(() => setNote((s) => (s + 1) % NOTIFICATIONS.length), 2400);
    const d = setTimeout(() => setLiked(true), 1200);
    return () => {
      [a, b, c].forEach(clearInterval);
      clearTimeout(d);
    };
  }, [inView]);

  const slides = [
    { kicker: "Swipe →", title: "5 hooks that stop the scroll" },
    { kicker: "01", title: "Start with the result" },
    { kicker: "02", title: "Ask a bold question" },
    { kicker: "03", title: "Show, don't tell" },
  ];

  return (
    <div ref={ref} className="relative mx-auto flex min-h-[470px] max-w-md items-center justify-center" role="img" aria-label="Illustration: an Instagram carousel post gaining likes, followers and messages">
      <Glow className="opacity-20" />

      {/* Phone */}
      <div className="relative z-10 w-[250px] rounded-[2.4rem] border-[7px] border-[#1c1d22] bg-[#0b0c10] p-2 shadow-elegant">
        <div className="absolute left-1/2 top-2 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-[#1c1d22]" />
        <div className="overflow-hidden rounded-[1.9rem] bg-background pb-3">
          <div className="flex items-center justify-between px-4 pb-2 pt-7 text-[11px] font-semibold">
            <span className="font-display text-sm">Instagram</span>
            <span className="flex gap-2 text-muted-foreground">
              <Heart className="h-4 w-4" />
              <Send className="h-4 w-4" />
            </span>
          </div>
          {/* Post header */}
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="rounded-full bg-[linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)] p-[2px]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background font-display text-[10px] font-bold text-brand">S</span>
            </span>
            <div className="text-[11px] leading-tight">
              <p className="flex items-center gap-1 font-semibold">
                yourbrand <BadgeCheck className="h-3 w-3 text-brand" />
              </p>
              <p className="text-[9px] text-muted-foreground">Sponsored</p>
            </div>
            <MoreHorizontal className="ml-auto h-4 w-4 text-muted-foreground" />
          </div>
          {/* Carousel slide */}
          <div className="relative aspect-square overflow-hidden bg-[radial-gradient(at_25%_20%,hsl(var(--brand-2)/0.75),transparent_55%),radial-gradient(at_80%_85%,hsl(var(--gradient-from)/0.9),transparent_60%)] bg-card">
            <div className="absolute inset-0 bg-grid-lines opacity-30 [background-size:22px_22px]" />
            {slides.map((s, i) => (
              <div
                key={i}
                className={cn(
                  "absolute inset-0 flex flex-col justify-end p-5 transition-all duration-700",
                  i === slide ? "translate-x-0 opacity-100" : i < slide ? "-translate-x-8 opacity-0" : "translate-x-8 opacity-0"
                )}
              >
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/80">{s.kicker}</span>
                <span className="mt-1 font-display text-xl font-extrabold leading-tight text-white">{s.title}</span>
              </div>
            ))}
            <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-[9px] font-semibold text-white">{slide + 1}/4</span>
          </div>
          <div className="flex justify-center gap-1 pt-2">
            {slides.map((_, i) => (
              <span key={i} className={cn("h-1 rounded-full transition-all", i === slide ? "w-3 bg-brand" : "w-1 bg-foreground/25")} />
            ))}
          </div>
          {/* Actions */}
          <div className="flex items-center gap-3 px-3 pt-1">
            <Heart className={cn("h-5 w-5 transition-all duration-300", liked ? "scale-110 fill-[#ff3d6e] text-[#ff3d6e]" : "")} />
            <MessageCircle className="h-5 w-5" />
            <Send className="h-5 w-5" />
            <Bookmark className="ml-auto h-5 w-5" />
          </div>
          <p className="px-3 pt-1.5 text-[11px] font-semibold tabular-nums">{likes.toLocaleString("en-US")} likes</p>
          <p className="px-3 text-[10px] text-muted-foreground">
            <span className="font-semibold text-foreground">yourbrand</span> Save this for your next post ✨
          </p>
        </div>
      </div>

      {/* Notification toast */}
      <div className="absolute -right-2 top-6 z-20 w-60 sm:-right-10">
        {NOTIFICATIONS.map((n, i) => (
          <div
            key={i}
            className={cn(
              "absolute inset-x-0 flex items-center gap-3 rounded-2xl border border-white/10 bg-card/95 p-3 shadow-elegant backdrop-blur transition-all duration-500",
              i === note ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
            )}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted">
              <n.icon className={cn("h-4 w-4", n.tone)} />
            </span>
            <p className="text-[11px] leading-snug">{n.text}</p>
          </div>
        ))}
      </div>

      {/* Engagement chip */}
      <div className="absolute -left-2 bottom-20 z-20 rounded-2xl border border-white/10 bg-card/95 px-4 py-3 shadow-elegant backdrop-blur sm:-left-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Engagement rate</p>
        <p className="mt-0.5 flex items-center gap-1.5 font-display text-2xl font-extrabold">
          6.8% <TrendingUp className="h-4 w-4 text-success" />
        </p>
      </div>

      {/* Platform chips */}
      <div className="absolute bottom-2 right-2 z-20 flex gap-2 sm:right-0">
        {[Instagram, Facebook, Linkedin, Youtube].map((P, i) => (
          <span key={i} className="flex h-9 w-9 animate-float items-center justify-center rounded-xl border border-white/10 bg-card/95 shadow-elegant" style={{ animationDelay: `${i * -1.4}s` }}>
            <P className="h-4 w-4 text-foreground" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════ PERFORMANCE — ad dashboard ═══════════════════ */

const WEEKS = [
  { spend: 42, revenue: 118 },
  { spend: 45, revenue: 134 },
  { spend: 48, revenue: 162 },
  { spend: 50, revenue: 171 },
  { spend: 55, revenue: 206 },
  { spend: 58, revenue: 231 },
  { spend: 60, revenue: 262 },
  { spend: 62, revenue: 288 },
];

const CHANNELS = [
  { name: "Google Ads", roas: 5.2, share: 48, color: "#4285F4" },
  { name: "Meta Ads", roas: 4.1, share: 37, color: "#0467DF" },
  { name: "LinkedIn Ads", roas: 2.9, share: 15, color: "#0A66C2" },
];

export function AdsDashboardVisual() {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const roas = useCountUp(4.6, inView, { from: 1.2 });
  const revenue = useCountUp(1572, inView, { from: 320 });
  const cpa = useCountUp(18.4, inView, { from: 46 });
  const conversions = useCountUp(2380, inView, { from: 400 });
  const [grow, setGrow] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion() || inView) setGrow(true);
  }, [inView]);

  const max = 300;
  return (
    <div ref={ref} className="relative sm:pb-24" role="img" aria-label="Illustration: an ad performance dashboard showing return on ad spend rising">
      <Glow />
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-card shadow-elegant">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <div>
            <p className="text-sm font-semibold">Campaign performance</p>
            <p className="text-[11px] text-muted-foreground">Last 30 days · all channels</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-success">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            optimising
          </span>
        </div>

        {/* KPI tiles */}
        <div className="grid grid-cols-2 border-b border-white/10 sm:grid-cols-4">
          {[
            ["ROAS", `${roas.toFixed(1)}×`, "+38%", true],
            ["Revenue", `$${Math.round(revenue).toLocaleString("en-US")}k`, "+52%", true],
            ["CPA", `$${cpa.toFixed(2)}`, "−41%", true],
            ["Conversions", Math.round(conversions).toLocaleString("en-US"), "+64%", true],
          ].map(([label, value, delta]) => (
            <div key={label} className="border-b border-r border-white/10 px-4 py-3 last:border-r-0 sm:border-b-0">
              <p className="text-[11px] text-muted-foreground">{label}</p>
              <p className="mt-0.5 font-display text-xl font-bold tabular-nums">{value}</p>
              <p className="flex items-center gap-1 text-[11px] font-medium text-success">
                <TrendingUp className="h-3 w-3" /> {delta}
              </p>
            </div>
          ))}
        </div>

        {/* Spend vs revenue */}
        <div className="px-5 pt-4">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Weekly ad spend vs revenue</span>
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-muted-foreground/50" /> Spend
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-brand" /> Revenue
              </span>
            </span>
          </div>
          <div className="mt-3 flex h-36 items-end gap-2.5">
            {WEEKS.map((w, i) => (
              <div key={i} className="flex h-full flex-1 items-end justify-center gap-[3px]">
                <span
                  className="w-1/3 rounded-t-[3px] bg-muted-foreground/40 transition-[height] duration-1000 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)]"
                  style={{ height: grow ? `${(w.spend / max) * 100}%` : "4%", transitionDelay: `${i * 70}ms` }}
                />
                <span
                  className="w-1/2 rounded-t-[3px] bg-brand-gradient transition-[height] duration-1000 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)]"
                  style={{ height: grow ? `${(w.revenue / max) * 100}%` : "4%", transitionDelay: `${i * 70 + 40}ms` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[9px] text-muted-foreground">
            {WEEKS.map((_, i) => (
              <span key={i} className="flex-1 text-center">
                W{i + 1}
              </span>
            ))}
          </div>
        </div>

        {/* Channels */}
        <div className="space-y-3 px-5 py-4">
          {CHANNELS.map((c) => (
            <div key={c.name} className="flex items-center gap-3 text-xs">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c.color }} />
              <span className="w-24 shrink-0 font-medium">{c.name}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <span className="block h-full rounded-full transition-[width] duration-1000" style={{ width: grow ? `${c.share}%` : "0%", background: c.color }} />
              </span>
              <span className="w-20 shrink-0 whitespace-nowrap text-right font-mono tabular-nums text-success">{c.roas.toFixed(1)}× ROAS</span>
            </div>
          ))}
        </div>
      </div>

      {/* A/B test card */}
      <div className="absolute bottom-0 left-4 hidden w-60 rotate-[-3deg] rounded-2xl border border-white/10 bg-card/95 p-4 shadow-elegant backdrop-blur sm:block md:-left-6">
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <FlaskConical className="h-3.5 w-3.5 text-brand" /> Creative test
        </p>
        <div className="mt-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Variant A</span>
            <span className="font-mono tabular-nums">1.8% CTR</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-success/10 px-2 py-1.5">
            <span className="font-semibold text-success">Variant B · winner</span>
            <span className="font-mono font-semibold tabular-nums text-success">2.5% CTR</span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:absolute sm:bottom-6 sm:right-0">illustrative example</p>
    </div>
  );
}
