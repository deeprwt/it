"use client";

import { useEffect, useState } from "react";
import { Check, Link2, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Counts one view per post per browser session. */
export function ViewTracker({ slug }) {
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const key = `sdx-viewed:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // storage blocked — still count once per page load
    }
    createClient()
      .rpc("increment_post_views", { post_slug: slug })
      .then(() => {}, () => {});
  }, [slug]);
  return null;
}

export function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable
    }
  };

  const links = [
    { label: "Share on X", icon: Twitter, href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
    { label: "Share on LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  ];

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex items-center gap-2">
        {links.map(({ label, icon: ShareIcon, href }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button asChild variant="outline" size="icon" className="rounded-full border-white/10 hover:border-brand hover:text-brand">
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <ShareIcon />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={copy}
              className="rounded-full border-white/10 hover:border-brand hover:text-brand"
              aria-label="Copy link"
            >
              {copied ? <Check className="text-success" /> : <Link2 />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{copied ? "Copied!" : "Copy link"}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

/** Highlights the current section in the table of contents. */
export function TableOfContents({ items }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const headings = items.map((i) => document.getElementById(i.id)).filter(Boolean);
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav aria-label="Table of contents" className="space-y-1 border-l border-white/10">
      <p className="mb-4 pl-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{"// on this page"}</p>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`-ml-px block border-l py-1.5 text-sm transition-colors ${item.level === 3 ? "pl-7" : "pl-4"} ${
            active === item.id ? "border-brand text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}
