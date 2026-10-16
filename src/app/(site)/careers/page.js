import { ArrowUpRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CtaSection } from "@/components/site/sections/CtaSection";
import { Reveal } from "@/components/site/effects/Reveal";
import { Spotlight } from "@/components/site/effects/Interactive";
import { Icon } from "@/components/site/icons";
import { LightSection } from "@/components/site/LightSection";
import { JsonLd, PageJsonLd } from "@/components/site/JsonLd";
import { getSiteSettings } from "@/lib/cms";
import { buildPageMetadata, breadcrumbSchema } from "@/lib/seo";
import { openings, perks } from "@/data/careers";

export const revalidate = 3600;

export function generateMetadata() {
  return buildPageMetadata("/careers");
}

export default async function CareersPage() {
  const settings = await getSiteSettings();
  const applyHref = (role) => `mailto:${settings.email}?subject=${encodeURIComponent(`Application: ${role}`)}`;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: "Home", url: "/" },
            { name: "Careers", url: "/careers" },
          ],
          settings
        )}
      />
      <PageJsonLd path="/careers" />

      <PageHero
        eyebrow="careers"
        title="Do the best work"
        accent="of your life."
        description="We're a remote-first crew of people who love shipping. If you care about craft, speed and kindness — we'd love to meet you."
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "Careers" }]}
      >
        <Button asChild variant="brand" size="lg" className="rounded-full">
          <a href="#openings">
            See open roles <ArrowUpRight />
          </a>
        </Button>
      </PageHero>

      <LightSection className="section">
        <div className="container">
          <SectionHeading eyebrow="perks" title="Life at Snowdox" align="split" description="We take care of the crew so the crew can do their best work." />
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 80}>
                <Spotlight className="group flex h-full items-start gap-5 rounded-2xl border bg-card p-6 shadow-subtle">
                  <span className="spotlight-border" aria-hidden />
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Icon name={p.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
                  </div>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </LightSection>

      <section id="openings" className="section scroll-mt-20 border-t border-white/[0.06]">
        <div className="container">
          <SectionHeading eyebrow="open roles" title={`${openings.length} open positions`} align="split" description="All roles are remote with a few hours of overlap with the team." />
          <ul className="mt-14 border-t border-white/[0.08]">
            {openings.map((role, i) => (
              <Reveal as="li" key={role.title} delay={i * 60}>
                <a
                  href={applyHref(role.title)}
                  className="group relative isolate grid grid-cols-1 items-center gap-4 overflow-hidden border-b border-white/[0.08] py-8 md:grid-cols-12"
                >
                  <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-gradient-to-r from-brand/10 to-transparent transition-transform duration-700 group-hover:scale-x-100" />
                  <div className="md:col-span-5">
                    <p className="font-mono text-xs uppercase tracking-widest text-brand">{role.team}</p>
                    <h3 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">{role.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5 md:col-span-4">
                    {role.stack.map((s) => (
                      <Badge key={s} variant="outline" className="border-white/10 font-normal text-muted-foreground">
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground md:col-span-3 md:justify-end">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> {role.location} · {role.type}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-foreground transition-all duration-300 group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-12 rounded-2xl border border-dashed border-white/15 p-8 text-center">
            <p className="font-display text-2xl font-bold">Don&apos;t see your role?</p>
            <p className="mt-2 text-muted-foreground">Send us your portfolio or GitHub anyway — great people create their own openings.</p>
            <Button asChild variant="outline" className="mt-6 rounded-full border-white/15">
              <a href={applyHref("Open application")}>Send an open application</a>
            </Button>
          </Reveal>
        </div>
      </section>

      <CtaSection email={settings.email} />
    </>
  );
}
