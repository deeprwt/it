"use client";

import * as React from "react";
import Image from "next/image";
import { LogoMark } from "@/components/brand/Logo";
import { useDebouncedValue } from "@/components/admin/hooks";
import { cn } from "@/lib/utils";

export function ogFallbackUrl(title, eyebrow) {
  const params = new URLSearchParams({ title: title || "" });
  if (eyebrow) params.set("eyebrow", eyebrow);
  return `/api/og?${params.toString()}`;
}

/**
 * Open Graph card preview (LinkedIn / X / Slack style, 1.91:1 image).
 * Falls back to the auto-generated `/api/og` card when no image is set.
 * @param {{ title: string, description?: string, image?: string, url?: string, eyebrow?: string, className?: string }} props
 */
export function SocialPreview({ title, description, image, url, eyebrow, className }) {
  // Debounced so the generated card isn't re-requested on every keystroke.
  const cardTitle = useDebouncedValue(title, 600);
  const src = image || ogFallbackUrl(cardTitle, eyebrow);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => setFailed(false), [src]);

  let domain = "example.com";
  try {
    domain = new URL(url).host.replace(/^www\./, "");
  } catch {
    // keep placeholder
  }

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Social share preview</p>
      <div className="overflow-hidden rounded-xl border bg-background">
        <div className="relative aspect-[1.91/1] w-full overflow-hidden border-b bg-muted">
          {!failed ? (
            <Image
              src={src}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 1280px) 420px, 100vw"
              className="object-cover"
              onError={() => setFailed(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col justify-between bg-card p-5">
              <div aria-hidden className="absolute inset-0 bg-grid-lines opacity-60 [background-size:28px_28px]" />
              <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/20 blur-3xl" />
              <div aria-hidden className="absolute -bottom-12 left-6 h-40 w-40 rounded-full bg-brand-2/20 blur-3xl" />
              <LogoMark className="relative h-8" />
              <p className="relative line-clamp-3 font-display text-lg font-bold leading-tight text-foreground">
                {title || "Untitled"}
              </p>
            </div>
          )}
          {!image && (
            <span className="absolute left-2 top-2 rounded-md bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground backdrop-blur">
              Auto-generated card
            </span>
          )}
        </div>
        <div className="space-y-1 bg-muted/40 px-4 py-3">
          <p className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">{domain}</p>
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">{title || "Untitled"}</p>
          {description && <p className="line-clamp-2 text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
    </div>
  );
}
