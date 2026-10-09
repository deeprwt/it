import { ArrowUpRight, MapPin } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Badge } from "@/components/ui/badge";
import { openings } from "@/data/careers";
import { site } from "@/data/site";

export function Openings() {
  return (
    <section id="openings" className="section bg-card/30 scroll-mt-24">
      <Container>
        <SectionHeading
          eyebrow="Current Openings"
          title="Find your next role"
          description="Don't see a perfect fit? We're always glad to meet great people — write to us anytime."
        />

        <div className="mt-12 divide-y divide-border border-y border-border">
          {openings.map((job, i) => (
            <Reveal key={job.title} delay={(i % 6) * 50}>
              <a
                href={`mailto:${site.careersEmail}?subject=Application: ${encodeURIComponent(job.title)}`}
                className="group flex flex-col gap-4 py-6 transition-colors hover:bg-background sm:flex-row sm:items-center sm:justify-between sm:px-2"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-xl font-medium text-foreground group-hover:text-accent">
                      {job.title}
                    </h3>
                    <Badge variant="accent">{job.team}</Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
                    <span>{job.type}</span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-accent" />
                      {job.location}
                    </span>
                    <span className="hidden sm:inline">{job.skills.join(" · ")}</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors group-hover:text-accent">
                  Apply now
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
