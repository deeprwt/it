"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import { work } from "@/data/work";
import { stack } from "@/data/site";
import { cn } from "@/lib/utils";

const BANNER = [
  "                             _",
  "  ___ _ __   _____      ____| | _____  __",
  " / __| '_ \\ / _ \\ \\ /\\ / / _` |/ _ \\ \\/ /",
  " \\__ \\ | | | (_) \\ V  V / (_| | (_) >  <",
  " |___/_| |_|\\___/ \\_/\\_/ \\__,_|\\___/_/\\_\\",
].join("\n");

const ROUTES = { services: "/services", work: "/work", about: "/about", blog: "/blog", careers: "/careers", contact: "/contact", home: "/", "~": "/" };

const COMMANDS = ["help", "services", "work", "stack", "about", "contact", "hire", "ls", "cd", "whoami", "date", "clear", "echo"];

const SUGGESTIONS = ["help", "services", "work", "sudo hire snowdox"];

function welcome() {
  return [
    { kind: "banner", text: BANNER },
    { kind: "muted", text: "snowdox shell v2.6 — the friendliest terminal on the internet." },
    { kind: "muted", text: "Type `help` (or tap a chip below) to explore." },
  ];
}

/** Interactive mini-shell. Commands can navigate around the site. */
export function TerminalPlayground({ email = "hello@snowdox.com" }) {
  const router = useRouter();
  const [history, setHistory] = useState(welcome);
  const [value, setValue] = useState("");
  const [past, setPast] = useState([]);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  const navigate = (path, label) => {
    setTimeout(() => router.push(path), 900);
    return [{ kind: "brand", text: `→ opening ${label}…` }];
  };

  const runCommand = (raw) => {
    const input = raw.trim();
    const [cmd, ...args] = input.split(/\s+/);
    const arg = args.join(" ");
    const lower = input.toLowerCase();

    if (!input) return [];
    if (lower === "clear") return null;
    if (lower.startsWith("sudo") && lower.includes("hire")) {
      return [
        { kind: "ok", text: "[sudo] permission granted. good choice." },
        ...navigate("/contact", "/contact"),
      ];
    }

    switch (cmd.toLowerCase()) {
      case "help":
        return [
          { kind: "text", text: "Available commands:" },
          ...[
            ["services", "what we build"],
            ["work", "selected projects"],
            ["stack", "tools we ship with"],
            ["about", "who we are"],
            ["contact", "how to reach us"],
            ["hire", "start a project"],
            ["ls / cd <page>", "browse the site"],
            ["whoami · date · echo · clear", "the classics"],
          ].map(([c, d]) => ({ kind: "pair", a: c, b: d })),
        ];
      case "services":
        return services.map((s) => ({ kind: "pair", a: `${s.index} ${s.title}`, b: s.short }));
      case "work":
        return [
          ...work.slice(0, 4).map((w) => ({ kind: "pair", a: w.industry, b: w.title })),
          { kind: "muted", text: "→ `cd work` for the full list" },
        ];
      case "stack":
        return [{ kind: "text", text: stack.join(" · ") }];
      case "about":
        return [
          { kind: "text", text: "We're a crew of designers & engineers who ship fast, loud, measurable work." },
          { kind: "muted", text: "→ `cd about` to read more" },
        ];
      case "contact":
        return [
          { kind: "pair", a: "email", b: email },
          { kind: "pair", a: "reply time", b: "< 1 business day" },
          { kind: "muted", text: "→ type `hire` to open the project form" },
        ];
      case "hire":
        return navigate("/contact", "/contact");
      case "ls":
        return [{ kind: "text", text: "services/  work/  blog/  about.md  careers.md  contact.sh" }];
      case "cd": {
        const key = arg.toLowerCase().replace(/\.(md|sh)$/, "").replace(/\//g, "") || "~";
        const path = ROUTES[key === ".." ? "~" : key];
        if (path) return navigate(path, path);
        return [{ kind: "error", text: `cd: no such directory: ${arg}` }];
      }
      case "whoami":
        return [{ kind: "text", text: "guest@snowdox — future client, probably." }];
      case "date":
        return [{ kind: "text", text: new Date().toString() }];
      case "echo":
        return [{ kind: "text", text: arg || "" }];
      case "rm":
        return [{ kind: "error", text: "nice try. our code has backups." }];
      case "exit":
        return [{ kind: "muted", text: "there is no escape. only great websites." }];
      default:
        return [{ kind: "error", text: `command not found: ${cmd}. Try \`help\`.` }];
    }
  };

  const submit = (raw) => {
    const output = runCommand(raw);
    if (output === null) {
      setHistory([]);
    } else {
      setHistory((h) => [...h, { kind: "cmd", text: raw }, ...output]);
    }
    if (raw.trim()) setPast((p) => [raw, ...p].slice(0, 30));
    setCursor(-1);
    setValue("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(past.length - 1, cursor + 1);
      if (past[next] !== undefined) {
        setCursor(next);
        setValue(past[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = cursor - 1;
      setCursor(next);
      setValue(next >= 0 ? past[next] : "");
    } else if (e.key === "Tab") {
      const match = COMMANDS.find((c) => c.startsWith(value.toLowerCase()) && value);
      if (match) {
        e.preventDefault();
        setValue(match);
      }
    } else if (e.key.toLowerCase() === "l" && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/80 shadow-elegant backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">guest@snowdox: ~</span>
      </div>

      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
        className="h-[340px] cursor-text overflow-y-auto p-5 font-mono text-[12.5px] leading-relaxed sm:h-[380px] sm:text-[13px]"
        aria-live="polite"
      >
        {history.map((line, i) => (
          <OutputLine key={i} line={line} />
        ))}

        <div className="flex items-center gap-2">
          <span className="shrink-0">
            <span className="text-success">➜</span> <span className="text-brand">~</span>
          </span>
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Terminal command"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="type a command…"
            className="h-7 border-0 bg-transparent px-0 font-mono text-[13px] text-foreground shadow-none placeholder:text-muted-foreground/50 focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-white/10 bg-background/40 px-4 py-3">
        {SUGGESTIONS.map((s) => (
          <Button
            key={s}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => submit(s)}
            className="h-7 rounded-full px-3 font-mono text-[11px]"
          >
            {s}
          </Button>
        ))}
        <span className="ml-auto hidden items-center gap-1 font-mono text-[10px] text-muted-foreground sm:flex">
          <CornerDownLeft className="h-3 w-3" /> enter · ↑↓ history · tab complete
        </span>
      </div>
    </div>
  );
}

function OutputLine({ line }) {
  switch (line.kind) {
    case "banner":
      return <pre className="mb-3 overflow-x-auto text-[9px] leading-[1.15] text-gradient sm:text-[11px]">{line.text}</pre>;
    case "cmd":
      return (
        <div className="mt-2">
          <span className="text-success">➜</span> <span className="text-brand">~</span>{" "}
          <span className="text-foreground">{line.text}</span>
        </div>
      );
    case "pair":
      return (
        <div className="flex gap-3">
          <span className="w-44 shrink-0 text-brand sm:w-56">{line.a}</span>
          <span className="text-muted-foreground">{line.b}</span>
        </div>
      );
    default:
      return (
        <div
          className={cn(
            "whitespace-pre-wrap",
            line.kind === "muted" && "text-muted-foreground",
            line.kind === "error" && "text-destructive",
            line.kind === "ok" && "text-success",
            line.kind === "brand" && "text-brand",
            line.kind === "text" && "text-foreground/90"
          )}
        >
          {line.text}
        </div>
      );
  }
}
