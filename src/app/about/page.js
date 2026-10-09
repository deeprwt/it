import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/shared/PageHero";
import { StatsBand } from "@/components/shared/StatsBand";
import { AboutStory } from "@/components/about/AboutStory";
import { Approach } from "@/components/about/Approach";
import { StandOut } from "@/components/about/StandOut";
import { Testimonials } from "@/components/home/Testimonials";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = {
  title: "About Us — 13 Years of Digital Craft",
  description:
    "Ribbon IT is an elite web development & digital experience company. Since 2013 we've delivered 2,000+ websites for 500+ clients across 25+ countries.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "About", url: "/about" },
            ])
          ),
        }}
      />
      <PageHero
        eyebrow="About Ribbon IT"
        title="We discover, we design, we execute."
        description="An elite web development and digital experience company — turning ambitious ideas into measurable results since 2013."
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "About" }]}
      >
        <Button asChild variant="accent" size="lg">
          <Link href="/contact">
            Work with us
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </PageHero>

      <AboutStory />
      <StatsBand className="!pt-0" />
      <Approach />
      <StandOut />
      <Testimonials />
      <ContactCTA />
    </>
  );
}
