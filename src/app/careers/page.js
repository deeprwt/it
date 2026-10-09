import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/shared/PageHero";
import { StatsBand } from "@/components/shared/StatsBand";
import { Culture } from "@/components/careers/Culture";
import { Openings } from "@/components/careers/Openings";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = {
  title: "Careers — Life @ Ribbon IT",
  description:
    "Join Ribbon IT. Build digital experiences for brands across 25+ countries in a growth-first, people-first culture. See current openings.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Careers", url: "/careers" },
            ])
          ),
        }}
      />
      <PageHero
        eyebrow="Join Us"
        title="Grow your career. Grow with us."
        description="13 years of purpose, people and progress — and we're just getting started. Come build what's next with the Ribbon IT team."
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "Careers" }]}
      >
        <Button asChild variant="accent" size="lg">
          <Link href="#openings">
            View open roles
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </PageHero>

      <Culture />
      <StatsBand className="!pt-0" />
      <Openings />
      <ContactCTA />
    </>
  );
}
