"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./use-in-view";
import { cn } from "@/lib/utils";

/** Each step is either a typed command or a printed output line. */
const SCRIPT = [
  { type: "cmd", text: 'npx snowdox init --brand "yours"' },
  { type: "out", tone: "muted", text: "  resolving ambition… done" },
  { type: "out", tone: "ok", label: "strategy", text: "mapped to real KPIs" },
  { type: "out", tone: "ok", label: "design", text: "48 components · 1 bold system" },
  { type: "out", tone: "ok", label: "build", text: "next.js · edge · typed" },
  { type: "out", tone: "ok", label: "seo", text: "lighthouse 100 · schema ✓" },
  { type: "cmd", text: "snowdox deploy --prod" },
  { type: "out", tone: "brand", text: "  ▲ live → https://your-brand.com  (0.8s)" },
];

function Line({ step, typed }) {
  if (step.type === "cmd") {
    return (
      <div className="whitespace-pre-wrap break-all">
        <span className="text-success">➜</span> <span className="text-brand">~/snowdox</span>{" "}
        <span className="text-foreground">{typed ?? step.text}</span>
      </div>
    );
  }
  if (step.tone === "ok") {
    return (
      <div className="whitespace-pre">
        {"  "}
        <span className="text-success">✓</span> <span className="inline-block w-20 text-foreground">{step.label}</span>
        <span className="text-muted-foreground">{step.text}</span>
      </div>
    );
  }
  return (
    <div className={cn("whitespace-pre-wrap", step.tone === "brand" ? "text-brand" : "text-muted-foreground")}>
      {step.text}
    </div>
  );
}

/** Self-typing terminal used in the hero. Loops forever (unless reduced motion). */
export function TypingTerminal({ className }) {
  const [lines, setLines] = useState([]);
  const [typing, setTyping] = useState(null); // { index, chars }
  const timers = useRef([]);

  useEffect(() => {
    const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

    if (prefersReducedMotion()) {
      setLines(SCRIPT.map((_, i) => i));
      return;
    }

    const run = (index) => {
      if (index >= SCRIPT.length) {
        later(() => {
          setLines([]);
          run(0);
        }, 4200);
        return;
      }
      const step = SCRIPT[index];
      if (step.type === "cmd") {
        let chars = 0;
        const typeNext = () => {
          chars += 1;
          setTyping({ index, chars });
          if (chars < step.text.length) later(typeNext, 28 + Math.random() * 55);
          else
            later(() => {
              setTyping(null);
              setLines((prev) => [...prev, index]);
              run(index + 1);
            }, 380);
        };
        later(typeNext, 500);
      } else {
        later(() => {
          setLines((prev) => [...prev, index]);
          run(index + 1);
        }, 230);
      }
    };

    run(0);
    const all = timers.current;
    return () => all.forEach(clearTimeout);
  }, []);

  return (
    <div
      role="img"
      aria-label="A terminal running snowdox init and deploying a brand to production in under a second"
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-card/80 shadow-elegant backdrop-blur-xl",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">~/snowdox — zsh</span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-success">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          live
        </span>
      </div>
      <div aria-hidden="true" className="h-[320px] space-y-1.5 overflow-hidden p-5 font-mono text-[12.5px] leading-relaxed sm:h-[300px] sm:text-[13px]">
        {lines.map((i) => (
          <Line key={i} step={SCRIPT[i]} />
        ))}
        {typing && <Line step={SCRIPT[typing.index]} typed={SCRIPT[typing.index].text.slice(0, typing.chars)} />}
        {!typing && (
          <div>
            <span className="text-success">➜</span> <span className="text-brand">~/snowdox</span>{" "}
            <span className="inline-block h-4 w-2 translate-y-0.5 animate-blink bg-brand" />
          </div>
        )}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 animate-scan bg-gradient-to-b from-transparent via-brand/[0.04] to-transparent" />
    </div>
  );
}
