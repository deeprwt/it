import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/site/sections/Hero";
import {
  StackMarquee,
  ServicesSection,
  Manifesto,
  ProcessSection,
  StatsBand,
  WhySection,
  FaqSection,
} from "@/components/site/sections/HomeSections";
import { CtaSection } from "@/components/site/sections/CtaSection";
import { ToolsSection } from "@/components/site/tech/ToolsSection";
import { LightSection } from "@/components/site/LightSection";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TerminalPlayground } from "@/components/site/TerminalPlayground";
import { WorkCard } from "@/components/site/work/WorkCard";
import { PostCard } from "@/components/site/blog/PostCard";
import { Reveal } from "@/components/site/effects/Reveal";
import { JsonLd, PageJsonLd } from "@/components/site/JsonLd";
import { getLatestPosts, getSiteSettings } from "@/lib/cms";
import { buildPageMetadata, organizationSchema, websiteSchema, faqSchema } from "@/lib/seo";
import { work } from "@/data/work";
import { faqs } from "@/data/site";

export const revalidate = 300;

export function generateMetadata() {
  return buildPageMetadata("/");
}

/*
  Rhythm: dark → white → dark … so the page never feels like one long slab.
  Hero (dark) · Services (white) · Manifesto + Work (dark) · Tools (white)
  · Process + Stats (dark) · Why (white) · Terminal (dark) · Blog (white)
  · FAQ + CTA (dark)
*/
export default async function HomePage() {
  const [settings, posts] = await Promise.all([getSiteSettings(), getLatestPosts(3)]);
  const featured = work.filter((w) => w.featured).slice(0, 4);

  return (
    <>
      <JsonLd data={[organizationSchema(settings), websiteSchema(settings), faqSchema(faqs)]} />
      <PageJsonLd path="/" />

      <Hero />
      <StackMarquee />
      <ServicesSection />
      <Manifesto />

      {/* Selected work */}
      <section className="section pt-0">
        <div className="container">
          <SectionHeading
            eyebrow="selected work"
            title={
              <>
                Shipped, measured, <span className="text-gradient">loved.</span>
              </>
            }
            align="split"
          >
            <Button asChild variant="outline" className="rounded-full border-white/15">
              <Link href="/work">
                All projects <ArrowUpRight />
              </Link>
            </Button>
          </SectionHeading>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
            {featured.map((item, i) => (
              <Reveal key={item.slug} delay={(i % 2) * 120} className={i % 2 ? "md:mt-16" : ""}>
                <WorkCard item={item} large />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ToolsSection />
      <ProcessSection />
      <StatsBand />
      <WhySection />

      {/* Interactive terminal */}
      <section className="section relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -z-10 h-[30rem] w-[30rem] -translate-y-1/2 rounded-full bg-brand-2/15 blur-[140px]" />
        <div className="container grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="try it"
              title={
                <>
                  Don&apos;t scroll. <span className="text-gradient">Type.</span>
                </>
              }
              description="Our studio, as a shell. Ask it about services, browse our work or run `sudo hire snowdox` — we dare you."
            />
          </div>
          <Reveal className="lg:col-span-7" delay={120}>
            <TerminalPlayground email={settings.email} />
          </Reveal>
        </div>
      </section>

      {posts.length > 0 && (
        <LightSection className="section">
          <div className="container">
            <SectionHeading eyebrow="from the blog" title="Insights from the build log" align="split">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/blog">
                  Read the blog <ArrowUpRight />
                </Link>
              </Button>
            </SectionHeading>
            <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={i * 90}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          </div>
        </LightSection>
      )}

      <FaqSection faqs={faqs} />
      <CtaSection email={settings.email} />
    </>
  );
}
