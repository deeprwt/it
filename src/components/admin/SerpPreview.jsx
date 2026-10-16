"use client";

import * as React from "react";
import { Monitor, MoreVertical, Smartphone } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { serpTruncate } from "@/lib/seo-score";
import { cn } from "@/lib/utils";

function splitUrl(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean).map(decodeURIComponent);
    return { host: u.host.replace(/^www\./, ""), origin: u.origin, parts };
  } catch {
    return { host: "example.com", origin: "https://example.com", parts: [] };
  }
}

/**
 * Google-style search result preview with a desktop/mobile switch.
 * @param {{ title: string, description: string, url: string, siteName?: string, className?: string }} props
 */
export function SerpPreview({ title, description, url, siteName = "Snowdox", className }) {
  const [device, setDevice] = React.useState("desktop");
  const { host, origin, parts } = splitUrl(url);
  const mobile = device === "mobile";

  const shownTitle = serpTruncate(title || "Untitled page", mobile ? 78 : 60);
  const shownDescription = serpTruncate(
    description || "Add a meta description — otherwise Google picks a snippet from the page.",
    mobile ? 120 : 158
  );

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Search preview</p>
        <ToggleGroup
          type="single"
          size="sm"
          value={device}
          onValueChange={(v) => v && setDevice(v)}
          aria-label="Preview device"
          className="rounded-lg border p-0.5"
        >
          <ToggleGroupItem value="desktop" aria-label="Desktop preview" className="h-7 gap-1.5 px-2 text-xs">
            <Monitor /> <span className="hidden sm:inline">Desktop</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="mobile" aria-label="Mobile preview" className="h-7 gap-1.5 px-2 text-xs">
            <Smartphone /> <span className="hidden sm:inline">Mobile</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="rounded-xl border bg-background p-4 sm:p-5">
        <div className={cn("transition-all duration-300", mobile ? "mx-auto max-w-[360px]" : "max-w-[600px]")}>
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-muted">
              <LogoMark className="h-4" />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm text-foreground">{siteName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {origin.startsWith("https") ? "https://" : "http://"}
                {host}
                {parts.length > 0 && <span> › {parts.join(" › ")}</span>}
              </p>
            </div>
            <MoreVertical className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          </div>
          <p
            className={cn(
              "mt-2 font-medium leading-snug text-brand hover:underline",
              mobile ? "line-clamp-2 text-[17px]" : "truncate text-xl"
            )}
          >
            {shownTitle}
          </p>
          <p className={cn("mt-1 text-sm leading-relaxed", description ? "text-foreground/75" : "italic text-muted-foreground")}>
            {shownDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
