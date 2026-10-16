import { Users, Rocket, RefreshCcw } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Manifesto, ProcessSection, StatsBand } from "@/components/site/sections/HomeSections";
import { CtaSection } from "@/components/site/sections/CtaSection";
import { Reveal } from "@/components/site/effects/Reveal";
import { Spotlight } from "@/components/site/effects/Interactive";
import { CodeWindow } from "@/components/site/CodeWindow";
import { Icon } from "@/components/site/icons";
import { LightSection } from "@/components/site/LightSection";
import { ToolsSection } from "@/components/site/tech/ToolsSection";
import { JsonLd, PageJsonLd } from "@/components/site/JsonLd";
import { getSiteSettings } from "@/lib/cms";
import { buildPageMetadata, breadcrumbSchema, organizationSchema } from "@/lib/seo";
import { principles } from "@/data/site";

export const revalidate = 3600;

export function generateMetadata() {
  return buildPageMetadata("/about");
}

const MODELS = [
  {
    icon: Rocket,
    title: "Project",
    body: "A fixed scope, a fixed timeline and a fixed price. Perfect for launches, redesigns and MVPs.",
    meta: "4–12 weeks",
  },
  {
    icon: Users,
    title: "Dedicated squad",
    body: "A cross-functional pod — design, engineering, QA — embedded in your roadmap and rituals.",
    meta: "3+ months",
  },
  {
    icon: RefreshCcw,
    title: "Growth retainer",
    body: "Monthly hours for experiments, SEO, new features and care. We keep compounding your results.",
    meta: "Ongoing",
  },
];

const STUDIO_CODE = `const snowdox = {
  founded: "on a whiteboard",
  crew: ["designers", "engineers", "growth nerds"],
  values: ["ship weekly", "fast by default", "no black boxes"],
  timezone: "worldwide",
  coffee: Infinity,
};

export default snowdox;`;

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(settings),
          breadcrumbSchema(
            [
              { name: "Home", url: "/" },
              { name: "About", url: "/about" },
            ],
            settings
          ),
        ]}
      />
      <PageJsonLd path="/about" />

      <PageHero
        eyebrow="about the studio"
        title="Small crew."
        accent="Loud results."
        description="Snowdox is an independent design & engineering studio. We partner with founders and marketing teams who want work that's fast, distinctive and built to last."
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "About" }]}
      />

      <section className="pb-12">
        <div className="container grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <CodeWindow code={STUDIO_CODE} filename="studio.config.ts" highlightLine={4} />
          </Reveal>
          <Reveal delay={120} className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              We started Snowdox because we were tired of agencies that hand over pretty mockups and slow,
              fragile websites. We wanted a studio where{" "}
              <span className="text-foreground">designers write code and engineers care about pixels.</span>
            </p>
            <p>
              Today we&apos;re a remote crew working with clients around the world — shipping marketing sites,
              product platforms, mobile apps and AI tools. Every project gets senior people, weekly releases and
              complete transparency.
            </p>
            <p className="font-mono text-sm text-brand">{"// and yes, we still sketch on whiteboards."}</p>
          </Reveal>
        </div>
      </section>

      <Manifesto text="Good design is *invisible.* Great design is *unforgettable.* We build the second kind — and we *measure* everything so you know it worked." />

      <LightSection className="section">
        <div className="container">
          <SectionHeading eyebrow="principles" title="What we believe" align="split" description="Four rules every project at Snowdox lives by." />
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <Spotlight className="group h-full rounded-2xl border bg-card p-7 shadow-subtle">
                  <span className="spotlight-border" aria-hidden />
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon name={p.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-8 font-display text-2xl font-bold tracking-tight">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </LightSection>

      <StatsBand />
      <ToolsSection />

      <section className="section border-t border-white/[0.06]">
        <div className="container">
          <SectionHeading eyebrow="engagement models" title="Work with us your way" align="center" />
          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
            {MODELS.map((m, i) => (
              <Reveal key={m.title} delay={i * 100}>
                <Spotlight className="group h-full rounded-2xl border border-white/[0.07] bg-card/50 p-8">
                  <span className="spotlight-border" aria-hidden />
                  <div className="flex items-center justify-between">
                    <m.icon className="h-6 w-6 text-brand" />
                    <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{m.meta}</span>
                  </div>
                  <h3 className="mt-10 font-display text-3xl font-bold tracking-tight">{m.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{m.body}</p>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ProcessSection />
      <CtaSection email={settings.email} />
    </>
  );
}
