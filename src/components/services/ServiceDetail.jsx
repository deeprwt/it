import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { PageHero } from "@/components/shared/PageHero";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { getIcon } from "@/lib/icons";
import { serviceList } from "@/data/services";

export function ServiceDetail({ service }) {
  const related = serviceList.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={service.eyebrow}
        title={service.title}
        description={service.heroSummary}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: service.eyebrow },
        ]}
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="accent" size="lg">
              <Link href="/contact">
                Get a free quote
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/services">All services</Link>
            </Button>
          </div>
          {/* metrics */}
          <dl className="flex flex-wrap gap-x-10 gap-y-4">
            {service.metrics.map((m) => (
              <div key={m.label}>
                <dt className="font-display text-2xl font-semibold text-accent sm:text-3xl">
                  {m.value}
                </dt>
                <dd className="text-xs uppercase tracking-wider text-muted-foreground">
                  {m.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </PageHero>

      {/* Intro + offerings */}
      <section className="section">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <Reveal>
              <p className="text-lg leading-relaxed text-foreground/90">
                {service.intro}
              </p>
            </Reveal>
            {service.image && (
              <Reveal delay={120}>
                <div className="relative aspect-[4/3] overflow-hidden border border-border">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            )}
          </div>

          <div className="mt-14">
            <SectionHeading eyebrow="What We Deliver" title="Services built around your goals" />
            <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {service.offerings.map((o, i) => {
                const Icon = getIcon(o.icon);
                return (
                  <Reveal
                    key={o.title}
                    delay={(i % 3) * 70}
                    className="group bg-background p-7 transition-colors hover:bg-card"
                  >
                    <span className="mb-5 flex h-11 w-11 items-center justify-center border border-border text-accent transition-colors group-hover:border-accent group-hover:bg-accent/10">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-lg font-medium text-foreground">
                      {o.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {o.description}
                    </p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* Why choose */}
      <section className="section bg-card/30">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Why Ribbon IT"
            title="Built right, delivered with care"
          />
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {service.whyChoose.map((w, i) => {
              const Icon = getIcon(w.icon);
              return (
                <Reveal key={w.title} delay={(i % 4) * 70} className="bg-background p-7">
                  <span className="mb-5 flex h-11 w-11 items-center justify-center border border-border text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-base font-medium text-foreground">
                    {w.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {w.description}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="section">
        <Container>
          <SectionHeading
            eyebrow="Our Process"
            title="A clear path from idea to impact"
            description="Transparent, collaborative and milestone-driven — you always know what's happening and what's next."
          />
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border md:grid-cols-3 lg:grid-cols-5">
            {service.process.map((step, i) => (
              <Reveal key={step.title} delay={(i % 5) * 70} className="bg-background p-6">
                <span className="font-display text-4xl font-semibold text-border">
                  0{i + 1}
                </span>
                <h3 className="mt-4 font-display text-base font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Industries */}
      <section className="section bg-card/30">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-16">
            <SectionHeading
              eyebrow="Industries We Serve"
              title="Expertise across every vertical"
              description="We adapt our craft to the realities of your sector — its users, regulations and growth levers."
            />
            <Reveal delay={120} className="flex flex-wrap gap-3">
              {service.industries.map((ind) => (
                <span
                  key={ind}
                  className="flex items-center gap-2 border border-border bg-background px-4 py-2.5 text-sm text-foreground/90 transition-colors hover:border-accent"
                >
                  <Check className="h-4 w-4 text-accent" />
                  {ind}
                </span>
              ))}
            </Reveal>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="section">
        <Container className="max-w-3xl" size="prose">
          <SectionHeading align="center" eyebrow="FAQ" title="Questions, answered" />
          <Accordion type="single" collapsible className="mt-12">
            {service.faqs.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </section>

      {/* Related */}
      <section className="section bg-card/30">
        <Container>
          <SectionHeading eyebrow="Keep Exploring" title="Related services" />
          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
            {related.map((r, i) => {
              const Icon = getIcon(r.icon);
              return (
                <Reveal key={r.slug} delay={i * 80} className="group bg-background p-7 transition-colors hover:bg-card">
                  <Link href={`/services/${r.slug}`} className="block">
                    <span className="mb-5 flex h-11 w-11 items-center justify-center border border-border text-accent transition-colors group-hover:border-accent group-hover:bg-accent/10">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-lg font-medium text-foreground group-hover:text-accent">
                      {r.eyebrow}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {r.heroSummary}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors group-hover:text-accent">
                      Learn more
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
