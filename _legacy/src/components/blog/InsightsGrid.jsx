import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { getIcon } from "@/lib/icons";

const insights = [
  {
    icon: "Code2",
    tag: "Web Development",
    title: "How fast-loading websites win more customers in 2026",
    excerpt: "Core Web Vitals, modern frameworks and the performance budget that turns visitors into buyers.",
    href: "/services/web-development",
  },
  {
    icon: "Bot",
    tag: "AI Automations",
    title: "AI agents that actually move the needle for SMBs",
    excerpt: "Where conversational and voice agents deliver real ROI — and how to deploy them safely.",
    href: "/services/ai-agents",
  },
  {
    icon: "Search",
    tag: "SEO & AEO",
    title: "From SEO to AEO: ranking inside AI answers",
    excerpt: "Answer Engine Optimization is the next frontier. Here's how to be the source AI cites.",
    href: "/seo-company-in-bangalore",
  },
  {
    icon: "ShoppingCart",
    tag: "E-commerce",
    title: "The conversion checklist for high-volume online stores",
    excerpt: "Checkout friction, page speed and AI recommendations that lift average order value.",
    href: "/ecommerce-website-development-company",
  },
  {
    icon: "Palette",
    tag: "Branding",
    title: "Brand-first design: why strategy beats aesthetics",
    excerpt: "A repeatable framework for identities that are memorable, ownable and built to scale.",
    href: "/services/ui-ux-branding",
  },
  {
    icon: "Smartphone",
    tag: "Mobile Apps",
    title: "Native vs cross-platform: choosing right in 2026",
    excerpt: "A practical decision guide for founders weighing performance, speed-to-market and cost.",
    href: "/services/mobile-apps",
  },
];

export function InsightsGrid() {
  return (
    <section className="section">
      <Container>
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {insights.map((post, i) => {
            const Icon = getIcon(post.icon);
            return (
              <Reveal
                key={post.title}
                delay={(i % 3) * 80}
                className="group flex flex-col bg-background p-8 transition-colors hover:bg-card"
              >
                <Link href={post.href} className="flex h-full flex-col">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center border border-border text-accent transition-colors group-hover:border-accent group-hover:bg-accent/10">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                      {post.tag}
                    </span>
                  </div>
                  <h2 className="mt-6 font-display text-xl font-medium leading-snug text-foreground group-hover:text-accent">
                    {post.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors group-hover:text-accent">
                    Read more
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
