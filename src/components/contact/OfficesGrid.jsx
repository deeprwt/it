import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { offices } from "@/data/site";

export function OfficesGrid() {
  return (
    <section className="section">
      <Container>
        <SectionHeading
          eyebrow="Our Offices"
          title="Three hubs, one global team"
          description="Reach us at the office nearest you — or simply send a message and we'll route it to the right people."
        />

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {offices.map((office, i) => (
            <Reveal key={office.id} delay={i * 90} className="flex flex-col bg-background p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                {office.role}
              </p>
              <h3 className="mt-3 font-display text-2xl font-medium text-foreground">
                {office.flag} {office.label}
              </h3>
              <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {office.address}
              </p>
              <div className="mt-5 space-y-2 text-sm">
                <a href={`tel:${office.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-accent">
                  <Phone className="h-4 w-4 text-accent" /> {office.phone}
                </a>
                <a href={`mailto:${office.email}`} className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-accent">
                  <Mail className="h-4 w-4 text-accent" /> {office.email}
                </a>
              </div>
              <a
                href={office.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-accent"
              >
                Get directions
                <ArrowUpRight className="h-4 w-4 text-accent" />
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
