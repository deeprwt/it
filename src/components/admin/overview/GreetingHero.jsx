"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Moon, Plus, SearchCheck, Sun, Sunrise, Sunset, XCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { scoreLabel } from "@/lib/seo-score";
import { initials } from "@/lib/format";

function getGreeting(now = new Date()) {
  const h = now.getHours();
  if (h < 5) return { greeting: "Working late", icon: Moon, subtitle: "Here's your site at a glance — don't forget to rest." };
  if (h < 12) return { greeting: "Good morning", icon: Sunrise, subtitle: "Here's how your site is doing today." };
  if (h < 17) return { greeting: "Good afternoon", icon: Sun, subtitle: "Here's where things stand this afternoon." };
  if (h < 21) return { greeting: "Good evening", icon: Sunset, subtitle: "Here's what happened today." };
  return { greeting: "Good night", icon: Moon, subtitle: "Here's your end-of-day snapshot." };
}

const TONE_ICON = { success: CheckCircle2, warning: AlertTriangle, destructive: XCircle };

export function GreetingHero({ profile, seoScore = 0 }) {
  const [now, setNow] = React.useState(null);

  // Time-of-day depends on the viewer's clock, so compute it after mount.
  React.useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const info = now ? getGreeting(now) : { greeting: "Welcome back", icon: Sun, subtitle: "Here's how your site is doing." };
  const Icon = info.icon;
  const name = profile?.full_name || profile?.email || "";
  const firstName = name.split(/[\s@]/)[0] || "there";
  const { tone } = scoreLabel(seoScore);
  const ToneIcon = TONE_ICON[tone];

  return (
    <section className="relative mb-6 overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/10 via-card to-brand-2/10 p-5 sm:p-6">
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-brand-2/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-lines opacity-40 [background-size:40px_40px] mask-fade-b" />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <Avatar className="h-12 w-12 shadow-glow ring-4 ring-card sm:h-14 sm:w-14">
              {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt="" />}
              <AvatarFallback className="text-sm sm:text-base">{initials(name)}</AvatarFallback>
            </Avatar>
            <span aria-label="Online" className="absolute bottom-0.5 right-0.5 flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card" />
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-muted-foreground">
              <span suppressHydrationWarning>
                {now
                  ? now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
                  : "Dashboard overview"}
              </span>
              <Badge variant={tone} className="rounded-full px-2 py-0 text-[10px] uppercase tracking-wider">
                <ToneIcon aria-hidden />
                SEO health {seoScore}/100
              </Badge>
            </div>
            <h1 className="mt-1 flex flex-wrap items-center gap-x-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              <span>
                {info.greeting}, <span className="text-gradient animate-gradient-x">{firstName}</span>
              </span>
              <Icon className="h-6 w-6 text-brand motion-safe:animate-float" aria-hidden />
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground sm:text-[15px]">{info.subtitle}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button asChild variant="outline" className="h-11 rounded-xl bg-background/50 backdrop-blur">
            <Link href="/admin/seo">
              <SearchCheck /> Pages SEO
            </Link>
          </Button>
          <Button asChild variant="brand" className="group h-11 rounded-xl px-5 font-semibold">
            <Link href="/admin/posts/new">
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <Plus className="transition-transform duration-200 group-hover:rotate-90" />
              New post
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
