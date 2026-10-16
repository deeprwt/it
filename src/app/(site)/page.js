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
  FaqSection,
} from "@/components/site/sections/HomeSections";
import { CtaSection } from "@/components/site/sections/CtaSection";
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
      <section className="section">
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

          <div className="mt-16 grid gap-5 md:grid-cols-2">
            {featured.map((item, i) => (
              <Reveal key={item.slug} delay={(i % 2) * 120} className={i % 2 ? "md:mt-20" : ""}>
                <WorkCard item={item} large />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ProcessSection />
      <StatsBand />

      {/* Interactive terminal */}
      <section className="section relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -z-10 h-[30rem] w-[30rem] -translate-y-1/2 rounded-full bg-brand-2/15 blur-[140px]" />
        <div className="container grid items-center gap-12 lg:grid-cols-12">
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
        <section className="section border-t border-white/[0.06]">
          <div className="container">
            <SectionHeading eyebrow="from the blog" title="Notes from the build log" align="split">
              <Button asChild variant="outline" className="rounded-full border-white/15">
                <Link href="/blog">
                  Read the blog <ArrowUpRight />
                </Link>
              </Button>
            </SectionHeading>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={i * 90}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <FaqSection faqs={faqs} />
      <CtaSection email={settings.email} />
    </>
  );
}
