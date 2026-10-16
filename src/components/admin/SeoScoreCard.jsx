"use client";

import * as React from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, Gauge, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { scoreLabel } from "@/lib/seo-score";
import { cn } from "@/lib/utils";

const STATUS = {
  pass: { icon: CheckCircle2, text: "text-success", label: "Passed" },
  warn: { icon: AlertTriangle, text: "text-warning", label: "Improve" },
  fail: { icon: XCircle, text: "text-destructive", label: "Problem" },
};
const ORDER = { fail: 0, warn: 1, pass: 2 };
const TONE_BAR = { success: "bg-success", warning: "bg-warning", destructive: "bg-destructive" };
const TONE_TEXT = { success: "text-success", warning: "text-warning", destructive: "text-destructive" };

/**
 * Live SEO score + checklist. Every check shows an icon and a label, never colour alone.
 * @param {{ analysis: { score: number, checks: {id: string, label: string, status: "pass"|"warn"|"fail", hint: string}[] }, title?: string, className?: string }} props
 */
export function SeoScoreCard({ analysis, title = "SEO analysis", className }) {
  const [showPassed, setShowPassed] = React.useState(false);
  const { score, checks } = analysis;
  const { label, tone } = scoreLabel(score);

  const sorted = [...checks].sort((a, b) => ORDER[a.status] - ORDER[b.status]);
  const problems = sorted.filter((c) => c.status !== "pass");
  const passed = sorted.filter((c) => c.status === "pass");
  const counts = {
    pass: passed.length,
    warn: checks.filter((c) => c.status === "warn").length,
    fail: checks.filter((c) => c.status === "fail").length,
  };

  return (
    <section className={cn("rounded-2xl border bg-card", className)} aria-label={title}>
      <div className="flex items-center gap-3 border-b px-5 py-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
          <Gauge className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground">Updates live as you type</p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-end justify-between gap-3">
          <p className="leading-none">
            <span className={cn("text-5xl font-bold tracking-tight", TONE_TEXT[tone])}>{score}</span>
            <span className="ml-1 text-sm font-medium text-muted-foreground">/ 100</span>
          </p>
          <Badge variant={tone} className="mb-1">
            {tone === "success" ? <CheckCircle2 /> : tone === "warning" ? <AlertTriangle /> : <XCircle />}
            {label}
          </Badge>
        </div>
        <Progress value={score} aria-label={`SEO score ${score} of 100`} indicatorClassName={TONE_BAR[tone]} />
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden /> {counts.pass} passed
          </span>
          <span className="inline-flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5 text-warning" aria-hidden /> {counts.warn} to improve
          </span>
          <span className="inline-flex items-center gap-1">
            <XCircle className="h-3.5 w-3.5 text-destructive" aria-hidden /> {counts.fail} problems
          </span>
        </div>

        {problems.length > 0 ? (
          <ul className="space-y-1">
            {problems.map((check) => (
              <CheckRow key={check.id} check={check} />
            ))}
          </ul>
        ) : (
          <p className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-2.5 text-sm text-foreground">
            <CheckCircle2 className="h-4 w-4 text-success" aria-hidden /> Everything checks out. Nice work!
          </p>
        )}

        {passed.length > 0 && (
          <div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-full justify-between px-2 text-xs text-muted-foreground"
              onClick={() => setShowPassed((v) => !v)}
              aria-expanded={showPassed}
            >
              {showPassed ? "Hide" : "Show"} {passed.length} passed check{passed.length === 1 ? "" : "s"}
              <ChevronDown className={cn("transition-transform", showPassed && "rotate-180")} />
            </Button>
            {showPassed && (
              <ul className="mt-1 space-y-1">
                {passed.map((check) => (
                  <CheckRow key={check.id} check={check} />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function CheckRow({ check }) {
  const s = STATUS[check.status] || STATUS.warn;
  const Icon = s.icon;
  return (
    <li className="flex items-start gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50">
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", s.text)} aria-hidden />
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">
          {check.label}
          <span className="sr-only"> — {s.label}</span>
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">{check.hint}</p>
      </div>
    </li>
  );
}
