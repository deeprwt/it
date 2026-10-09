import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/shared/PageHero";
import { SolutionsIndex } from "@/components/solutions/SolutionsIndex";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { catalog } from "@/data/catalog";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = {
  title: "All Solutions — Services, Industries & Locations",
  description:
    "Browse every Ribbon IT solution — web & app development, AI agents, e-commerce, design, branding and digital marketing across Bangalore, Dubai and beyond.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Solutions", url: "/solutions" },
            ])
          ),
        }}
      />
      <PageHero
        eyebrow="All Solutions"
        title={`${catalog.length}+ ways we help you grow.`}
        description="Every service, specialization and location we deliver — explore the full catalogue and dive into the solution that fits your goals."
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "Solutions" }]}
      >
        <Button asChild variant="accent" size="lg">
          <Link href="/contact">
            Talk to an expert
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </PageHero>

      <SolutionsIndex />
      <ContactCTA />
    </>
  );
}
