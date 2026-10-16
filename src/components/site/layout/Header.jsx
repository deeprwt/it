"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Logo } from "@/components/brand/Logo";
import { ScrambleText } from "@/components/site/effects/ScrambleText";
import { Magnetic } from "@/components/site/effects/Interactive";
import { navLinks } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function Header({ email }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      const delta = y - last;
      if (Math.abs(delta) < 6) return; // ignore jitter
      // Hide when scrolling down past the hero, reveal on any scroll up.
      setHidden(delta > 0 && y > 420);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        hidden && !open ? "-translate-y-full" : "translate-y-0",
        scrolled ? "border-b border-white/[0.06] bg-background/70 backdrop-blur-xl" : "border-b border-transparent"
      )}
    >
      <div className="container flex h-[4.5rem] items-center justify-between gap-6 md:h-[5.5rem]">
        <Link href="/" aria-label="Snowdox — home" className="shrink-0">
          <Logo variant="dark" priority className="h-12 transition-transform duration-300 hover:scale-[1.03] md:h-16" />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks
              .filter((l) => l.href !== "/contact")
              .map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center rounded-full px-4 py-2 font-mono text-[12px] uppercase tracking-[0.14em] transition-colors",
                      isActive(link.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="text-brand opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>
                      /
                    </span>
                    <ScrambleText text={link.label} trigger="hover" duration={450} />
                    {isActive(link.href) && (
                      <span className="absolute inset-x-4 -bottom-0.5 h-px bg-brand-gradient" aria-hidden />
                    )}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Magnetic className="hidden sm:inline-block">
            <Button asChild variant="snow" size="default" className="group rounded-full pl-5 pr-4 font-semibold">
              <Link href="/contact">
                Start a project
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="!h-3.5 !w-3.5" />
                </span>
              </Link>
            </Button>
          </Magnetic>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full border-white/10 bg-background p-0 sm:max-w-md">
              <SheetTitle className="sr-only">Site navigation</SheetTitle>
              <div className="flex h-full flex-col p-6">
                <Logo variant="dark" tagline className="h-14" />
                <nav aria-label="Mobile" className="mt-10 flex-1">
                  <ul className="space-y-1">
                    {navLinks.map((link, i) => (
                      <li
                        key={link.href}
                        className="animate-in fade-in slide-in-from-right-4 fill-mode-both"
                        style={{ animationDelay: `${80 + i * 50}ms`, animationDuration: "500ms" }}
                      >
                        <SheetClose asChild>
                          <Link
                            href={link.href}
                            className={cn(
                              "group flex items-baseline gap-4 border-b border-white/[0.06] py-4 font-display text-4xl font-bold tracking-tight transition-colors",
                              isActive(link.href) ? "text-brand" : "text-foreground hover:text-brand"
                            )}
                          >
                            <span className="font-mono text-xs font-normal text-muted-foreground">0{i + 1}</span>
                            {link.label}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="space-y-4">
                  <p className="font-mono text-xs uppercase tracking-eyebrow text-muted-foreground">Say hello</p>
                  <a href={`mailto:${email}`} className="block font-display text-2xl font-semibold text-gradient">
                    {email}
                  </a>
                  <SheetClose asChild>
                    <Button asChild variant="brand" size="lg" className="w-full rounded-full">
                      <Link href="/contact">Start a project</Link>
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
