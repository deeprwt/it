import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeSnow } from "@/components/site/effects/CodeSnow";
import { Reveal } from "@/components/site/effects/Reveal";
import { ScrambleText } from "@/components/site/effects/ScrambleText";
import { Spotlight } from "@/components/site/effects/Interactive";
import { Marquee } from "@/components/site/effects/Marquee";
import { CodeWindow } from "@/components/site/CodeWindow";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProcessSection, FaqSection } from "@/components/site/sections/HomeSections";
import { CtaSection } from "@/components/site/sections/CtaSection";
import { Icon } from "@/components/site/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { JsonLd, PageJsonLd } from "@/components/site/JsonLd";
import { getSiteSettings } from "@/lib/cms";
import { buildPageMetadata, serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/seo";
import { services, serviceBySlug, serviceSlugs } from "@/data/services";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = serviceBySlug[slug];
  if (!service) return {};
  return buildPageMetadata(`/services/${slug}`, {
    title: `${service.title} Services`,
    description: service.short,
    eyebrow: service.title,
    keywords: service.tags,
  });
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = serviceBySlug[slug];
  if (!service) notFound();

  const settings = await getSiteSettings();
  const others = services.filter((s) => s.slug !== slug).slice(0, 3);
  const path = `/services/${slug}`;

  return (
    <>
      <JsonLd
        data={[
          serviceSchema(service, settings),
          faqSchema(service.faqs),
          breadcrumbSchema(
            [
              { name: "Home", url: "/" },
              { name: "Services", url: "/services" },
              { name: service.title, url: path },
            ],
            settings
          ),
        ]}
      />
      <PageJsonLd path={path} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden pb-20 pt-32 md:pt-44">
        <div className="absolute inset-0 -z-10 bg-grid-lines mask-radial [background-size:56px_56px] opacity-60" />
        <div className="absolute -top-24 right-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-brand/15 blur-[130px]" />
        <CodeSnow density={0.4} className="-z-10 opacity-70 mask-fade-b" />

        <div className="container grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Breadcrumb className="mb-8">
              <BreadcrumbList className="font-mono text-xs uppercase tracking-widest">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/services">Services</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-brand">{service.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 text-brand shadow-glow">
                <Icon name={service.icon} className="h-5 w-5" />
              </span>
              <p className="eyebrow">
                <span className="text-muted-foreground">{`// ${service.index}`}</span>
                <ScrambleText text={service.title} />
              </p>
            </div>

            <Reveal>
              <h1 className="mt-6 text-balance font-display text-5xl font-bold leading-[0.95] tracking-tightest sm:text-6xl md:text-7xl">
                {service.tagline}
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">{service.description}</p>
            </Reveal>
            <Reveal delay={200} className="mt-10 flex flex-wrap gap-3">
              <Button asChild variant="brand" size="lg" className="rounded-full">
                <Link href="/contact">
                  Start your project <ArrowUpRight />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full border-white/15">
                <Link href="/work">See related work</Link>
              </Button>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-6" delay={200}>
            <div className="relative">
              <div className="absolute -inset-px -z-10 rounded-2xl bg-brand-gradient opacity-30 blur-2xl" />
              <CodeWindow code={service.code} filename={service.filename} highlightLine={2} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stack ticker */}
      <section aria-label={`${service.title} stack`} className="border-y border-white/[0.06] bg-card/30 py-5">
        <Marquee duration={28}>
          {[...service.stack, ...service.stack].map((tech, i) => (
            <span key={`${tech}-${i}`} className="mx-6 flex items-center gap-6 font-mono text-sm uppercase tracking-widest text-muted-foreground">
              {tech}
              <span className="text-brand" aria-hidden>
                ✳
              </span>
            </span>
          ))}
        </Marquee>
      </section>

      {/* Deliverables */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="what you get" title="Deliverables, not decks." align="split" description="Everything below is included or available as part of a scoped engagement." />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.deliverables.map((d, i) => (
              <Reveal as="li" key={d} delay={(i % 3) * 80}>
                <Spotlight className="group flex h-full items-start gap-4 rounded-2xl border border-white/[0.07] bg-card/50 p-6">
                  <span className="spotlight-border" aria-hidden />
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="font-medium">{d}</span>
                </Spotlight>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-8 flex flex-wrap items-center gap-2" delay={100}>
            <span className="mr-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">stack:</span>
            {service.stack.map((t) => (
              <Badge key={t} variant="outline" className="border-white/10 font-mono font-normal">
                {t}
              </Badge>
            ))}
          </Reveal>
        </div>
      </section>

      <ProcessSection title={`How we deliver ${service.title.toLowerCase()}`} />
      <FaqSection faqs={service.faqs} title={`${service.title} FAQ`} />

      {/* Other services */}
      <section className="section border-t border-white/[0.06]">
        <div className="container">
          <SectionHeading eyebrow="keep exploring" title="Pairs well with" />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {others.map((s, i) => (
              <Reveal key={s.slug} delay={i * 80}>
                <Spotlight asChild className="group block h-full rounded-2xl border border-white/[0.07] bg-card/50 p-7 hover:bg-card">
                  <Link href={`/services/${s.slug}`}>
                    <span className="spotlight-border" aria-hidden />
                    <div className="flex items-center justify-between">
                      <Icon name={s.icon} className="h-5 w-5 text-brand" />
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:rotate-45 group-hover:text-brand" />
                    </div>
                    <h3 className="mt-8 font-display text-2xl font-bold tracking-tight">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.short}</p>
                  </Link>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaSection email={settings.email} />
    </>
  );
}
