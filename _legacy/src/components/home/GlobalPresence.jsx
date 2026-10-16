import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { offices } from "@/data/site";

const reach = [
  "India", "United Arab Emirates", "Canada", "United States", "United Kingdom",
  "Australia", "Saudi Arabia", "Qatar", "Singapore", "Germany", "Netherlands", "+ 14 more",
];

/**
 * Global presence — the reference's "Service Areas" pattern: an intro +
 * coverage list, then linked location cards.
 */
export function GlobalPresence() {
  return (
    <section className="section">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Global Presence"
              title="One studio, serving brands across 25+ countries"
              description="With offices in Bangalore, Dubai and Toronto, we deliver across time zones — combining local insight with a global standard of craft."
            />
            <Reveal delay={160} className="mt-8 flex flex-wrap gap-2">
              {reach.map((place) => (
                <span
                  key={place}
                  className="border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
                >
                  {place}
                </span>
              ))}
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-1">
            {offices.map((office, i) => (
              <Reveal
                key={office.id}
                delay={i * 90}
                className="group flex items-center justify-between gap-4 bg-background p-6 transition-colors hover:bg-card"
              >
                <div>
                  <p className="font-display text-lg font-medium text-foreground">
                    {office.flag} {office.label}
                    <span className="ml-2 text-xs font-normal uppercase tracking-wider text-accent">
                      {office.role}
                    </span>
                  </p>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    {office.address}
                  </p>
                  <a
                    href={`tel:${office.phone.replace(/\s/g, "")}`}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-accent"
                  >
                    <Phone className="h-3.5 w-3.5 text-accent" />
                    {office.phone}
                  </a>
                </div>
                <Link
                  href="/contact"
                  aria-label={`Contact our ${office.label} office`}
                  className="flex h-10 w-10 shrink-0 items-center justify-center border border-border text-muted-foreground transition-colors group-hover:border-accent group-hover:text-accent"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
