import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { companyFacts, socials } from "@/data/site";
import { getIcon } from "@/lib/icons";

/**
 * Company information — 2-column: labeled firm facts on the left,
 * a "Follow Along" social CTA on the right. Mirrors the reference's
 * "Firm Information" block.
 */
export function CompanyInfo() {
  return (
    <section className="section">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          {/* Facts */}
          <div>
            <Reveal as="span" className="eyebrow mb-8 flex">
              <span className="h-px w-6 bg-accent" aria-hidden /> Company Information
            </Reveal>
            <dl className="grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
              {companyFacts.map((fact, i) => (
                <Reveal
                  key={fact.label}
                  delay={i * 70}
                  className="bg-background p-6"
                >
                  <dt className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {fact.label}
                  </dt>
                  <dd className="mt-2 font-display text-lg font-medium text-foreground">
                    {fact.value}
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>

          {/* Follow along */}
          <Reveal delay={120} className="flex flex-col justify-between border border-border bg-card p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Follow Along
              </p>
              <h3 className="mt-4 font-display text-2xl font-medium text-foreground">
                See how we grow brands, every day.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Behind-the-scenes work, launches and insights from the
                Ribbon IT studio.
              </p>
            </div>
            <ul className="mt-8 space-y-px overflow-hidden border border-border bg-border">
              {socials.map((s) => {
                const Icon = getIcon(s.icon);
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 bg-card px-4 py-3.5 transition-colors hover:bg-background"
                    >
                      <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                        <Icon className="h-4 w-4 text-accent" />
                        {s.label}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
