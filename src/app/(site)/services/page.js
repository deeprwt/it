import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { ProcessSection, FaqSection } from "@/components/site/sections/HomeSections";
import { CtaSection } from "@/components/site/sections/CtaSection";
import { Reveal } from "@/components/site/effects/Reveal";
import { Icon } from "@/components/site/icons";
import { JsonLd, PageJsonLd } from "@/components/site/JsonLd";
import { getSiteSettings } from "@/lib/cms";
import { buildPageMetadata, breadcrumbSchema } from "@/lib/seo";
import { services } from "@/data/services";
import { faqs } from "@/data/site";

export const revalidate = 3600;

export function generateMetadata() {
  return buildPageMetadata("/services");
}

export default async function ServicesPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: "Home", url: "/" },
            { name: "Services", url: "/services" },
          ],
          settings
        )}
      />
      <PageJsonLd path="/services" />

      <PageHero
        eyebrow="services"
        title="Everything you need to"
        accent="launch & grow."
        description="Strategy, design, engineering and growth under one roof — run by senior people who care about outcomes, not hours."
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "Services" }]}
      >
        <Button asChild variant="brand" size="lg" className="rounded-full">
          <Link href="/contact">
            Book a free consultation <ArrowUpRight />
          </Link>
        </Button>
      </PageHero>

      <section className="pb-24">
        <div className="container">
          <ul className="border-t border-white/[0.08]">
            {services.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={i * 50}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group relative isolate grid items-center gap-6 overflow-hidden border-b border-white/[0.08] py-10 md:grid-cols-12 md:py-12"
                >
                  {/* hover fill sweep */}
                  <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-gradient-to-r from-brand/10 via-brand-2/10 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-x-100" />
                  <span className="font-mono text-sm text-muted-foreground md:col-span-1">{s.index}</span>
                  <div className="flex items-center gap-5 md:col-span-6">
                    <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-card text-brand transition-all duration-500 group-hover:rotate-6 group-hover:shadow-glow sm:flex">
                      <Icon name={s.icon} className="h-6 w-6" />
                    </span>
                    <h2 className="font-display text-4xl font-bold tracking-tightest transition-transform duration-500 group-hover:translate-x-2 md:text-5xl lg:text-6xl">
                      {s.title}
                    </h2>
                  </div>
                  <div className="md:col-span-4">
                    <p className="text-muted-foreground">{s.short}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {s.tags.map((t) => (
                        <Badge key={t} variant="outline" className="border-white/10 font-mono text-[10px] font-normal text-muted-foreground">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <span className="hidden h-12 w-12 items-center justify-center justify-self-end rounded-full border border-white/10 transition-all duration-500 group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground md:col-span-1 md:flex">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <ProcessSection />
      <FaqSection faqs={faqs} />
      <CtaSection email={settings.email} />
    </>
  );
}
