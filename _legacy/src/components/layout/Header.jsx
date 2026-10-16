"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks, megaMenu } from "@/data/navigation";
import { site } from "@/data/site";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Logo } from "@/components/shared/Logo";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [megaOpen, setMegaOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mega menu on route change
  useEffect(() => {
    setMegaOpen(false);
  }, [pathname]);

  const solid = scrolled || megaOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {showAnnouncement && (
        <AnnouncementBar onClose={() => setShowAnnouncement(false)} />
      )}

      <div
        className={cn(
          "relative border-b transition-colors duration-300",
          solid
            ? "border-border bg-background/85 backdrop-blur-md"
            : "border-transparent bg-transparent"
        )}
        onMouseLeave={() => setMegaOpen(false)}
      >
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 container-px lg:h-20"
          aria-label="Primary"
        >
          <Logo />

          {/* Desktop nav */}
          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) =>
              link.mega ? (
                <li
                  key={link.label}
                  onMouseEnter={() => setMegaOpen(true)}
                >
                  <button
                    type="button"
                    aria-expanded={megaOpen}
                    aria-haspopup="true"
                    onClick={() => setMegaOpen((v) => !v)}
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium tracking-wide transition-colors hover:text-accent",
                      megaOpen ? "text-accent" : "text-foreground/90"
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        megaOpen && "rotate-180"
                      )}
                    />
                  </button>
                </li>
              ) : (
                <li key={link.label} onMouseEnter={() => setMegaOpen(false)}>
                  <Link
                    href={link.href}
                    className={cn(
                      "link-underline text-sm font-medium tracking-wide transition-colors hover:text-accent",
                      pathname === link.href ? "text-accent" : "text-foreground/90"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${site.phonePrimary.replace(/\s/g, "")}`}
              className="hidden items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-accent xl:flex"
            >
              <Phone className="h-4 w-4 text-accent" />
              {site.phonePrimary}
            </a>
            <Button asChild variant="accent" size="sm" className="hidden sm:inline-flex">
              <Link href="/contact">Request a Consultation</Link>
            </Button>

            {/* Mobile trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-sm">
                <MobileNav />
              </SheetContent>
            </Sheet>
          </div>
        </nav>

        {/* Mega menu panel */}
        <MegaPanel open={megaOpen} />
      </div>
    </header>
  );
}

function MegaPanel({ open }) {
  return (
    <div
      className={cn(
        "absolute inset-x-0 top-full origin-top overflow-hidden border-b border-border bg-background/95 backdrop-blur-md transition-all duration-300",
        open ? "visible opacity-100" : "invisible h-0 opacity-0"
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-10 px-6 py-10 lg:grid-cols-4 lg:px-8">
        {megaMenu.map((col) => (
          <div key={col.title}>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-accent">
              {col.title}
            </p>
            <ul className="space-y-3">
              {col.items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border bg-card/60">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-5 sm:flex-row sm:items-center lg:px-8">
          <p className="text-sm text-muted-foreground">
            Looking for something specific? Browse our full solutions catalogue.
          </p>
          <Button asChild variant="accent" size="sm">
            <Link href="/solutions">Browse all solutions</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function MobileNav() {
  return (
    <div className="flex min-h-full flex-col">
      <div className="border-b border-border px-6 py-5">
        <Logo withTagline />
      </div>

      <div className="flex-1 px-6 py-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="services">
            <AccordionTrigger>What We Do</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-1">
                {megaMenu.map((col) => (
                  <div key={col.title}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
                      {col.title}
                    </p>
                    <ul className="space-y-2">
                      {col.items.map((item) => (
                        <li key={item.label}>
                          <SheetClose asChild>
                            <Link
                              href={item.href}
                              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                              {item.label}
                            </Link>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <ul className="mt-2 divide-y divide-border">
          {navLinks
            .filter((l) => !l.mega)
            .map((link) => (
              <li key={link.label}>
                <SheetClose asChild>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between py-4 font-display text-base font-medium text-foreground transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              </li>
            ))}
        </ul>
      </div>

      <div className="space-y-3 border-t border-border px-6 py-6">
        <SheetClose asChild>
          <Button asChild variant="accent" className="w-full">
            <Link href="/contact">Request a Consultation</Link>
          </Button>
        </SheetClose>
        <a
          href={`tel:${site.phonePrimary.replace(/\s/g, "")}`}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
        >
          <Phone className="h-4 w-4 text-accent" />
          {site.phonePrimary}
        </a>
      </div>
    </div>
  );
}
