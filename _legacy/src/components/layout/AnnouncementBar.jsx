"use client";

import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { announcement } from "@/data/site";

/**
 * Top announcement ribbon — "WEBOVERSE 13".
 * Purple gradient, dismissible. Matches the brand banner.
 */
export function AnnouncementBar({ onClose }) {
  return (
    <div className="relative overflow-hidden bg-[linear-gradient(90deg,#1a1040_0%,#2a1a5e_45%,#3b1f74_100%)] text-white">
      {/* subtle starfield glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(40% 120% at 15% 50%, rgba(168,130,255,0.35), transparent 60%)",
        }}
      />
      <div className="relative mx-auto flex h-10 max-w-7xl items-center justify-center gap-3 container-px text-center">
        <span className="hidden shrink-0 items-center gap-2 sm:inline-flex">
          <span className="bg-gradient-to-r from-fuchsia-300 to-violet-300 bg-clip-text font-display text-sm font-bold tracking-wide text-transparent">
            WEBOVERSE 13
          </span>
          <span className="h-3 w-px bg-white/30" />
        </span>
        <p className="truncate text-xs font-medium tracking-wide text-white/90 sm:text-[0.8rem]">
          {announcement.text}
        </p>
        <Link
          href={announcement.ctaHref}
          className="group ml-1 hidden shrink-0 items-center gap-1 rounded-full bg-white px-3.5 py-1 text-xs font-semibold text-[#23134f] transition-transform hover:scale-[1.03] sm:inline-flex"
        >
          {announcement.ctaLabel}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss announcement"
          className="absolute right-3 flex h-6 w-6 items-center justify-center text-white/70 transition-colors hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
