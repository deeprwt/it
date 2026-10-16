import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { Wordmark } from "@/components/brand/Wordmark";
import { footerNav } from "@/data/navigation";
import { socialIcons } from "@/components/site/icons";

export function Footer({ settings }) {
  const socials = Object.entries(settings.socials || {}).filter(([key, href]) => href && socialIcons[key]);
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-background">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />

      <div className="container relative grid grid-cols-1 gap-12 pb-10 pt-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo variant="dark" tagline className="h-20" />
          <p className="mt-5 max-w-sm text-muted-foreground">{settings.tagline}</p>
          <a
            href={`mailto:${settings.email}`}
            className="group mt-8 inline-flex items-center gap-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            <span className="link-underline">{settings.email}</span>
            <ArrowUpRight className="h-6 w-6 text-brand transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
          {settings.phone && <p className="mt-3 font-mono text-sm text-muted-foreground">{settings.phone}</p>}
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-card px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            Booking new projects
          </p>
        </div>

        {footerNav.map((col) => (
          <nav key={col.title} aria-label={col.title} className="md:col-span-2">
            <p className="font-mono text-xs uppercase tracking-eyebrow text-brand">{`// ${col.title}`}</p>
            <ul className="mt-5 space-y-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="md:col-span-3">
          <p className="font-mono text-xs uppercase tracking-eyebrow text-brand">{"// Elsewhere"}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {socials.map(([key, href]) => {
              const { icon: SocialIcon, label } = socialIcons[key];
              return (
                <li key={key}>
                  <Button asChild variant="outline" size="icon" className="rounded-full border-white/10 hover:border-brand hover:text-brand">
                    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                      <SocialIcon />
                    </a>
                  </Button>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">{settings.address}</p>
        </div>
      </div>

      {/* Giant wordmark — logo outlines scaled to the container width, glitches on hover */}
      <div className="container relative select-none pb-8 pt-4" aria-hidden="true">
        <div className="group relative">
          <Wordmark className="text-foreground/[0.16] transition-colors duration-700 group-hover:text-foreground/30" />
          <Wordmark variant="fill" className="wordmark-glitch wordmark-glitch-a absolute inset-0" />
          <Wordmark variant="fill" className="wordmark-glitch wordmark-glitch-b absolute inset-0" />
        </div>
      </div>

      <div className="container relative flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] py-6 text-xs text-muted-foreground sm:flex-row">
        <p className="font-mono">
          © {year} {settings.siteName}. All rights reserved.
        </p>
        <p className="font-mono">
          <span className="text-brand">{"<"}</span>crafted with caffeine & clean code<span className="text-brand">{" />"}</span>
        </p>
        <Button asChild variant="ghost" size="sm" className="font-mono text-xs">
          <a href="#main">
            Back to top <ArrowUp />
          </a>
        </Button>
      </div>
    </footer>
  );
}
