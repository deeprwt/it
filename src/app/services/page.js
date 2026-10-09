import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/shared/PageHero";
import { ServicesGrid } from "@/components/services/ServicesGrid";
import { WhyChoose } from "@/components/home/WhyChoose";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = {
  title: "Services — Web, Apps, AI & Digital Marketing",
  description:
    "End-to-end digital services: web & app development, AI agents, e-commerce, UI/UX, branding and performance marketing — all under one roof.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Services", url: "/services" },
            ])
          ),
        }}
      />
      <PageHero
        eyebrow="What We Do"
        title="Everything your brand needs to win online."
        description="From strategy and design to engineering, AI and growth — a single, accountable partner across the full digital journey."
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "Services" }]}
      >
        <Button asChild variant="accent" size="lg">
          <Link href="/contact">
            Request a consultation
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </PageHero>

      <ServicesGrid />
      <WhyChoose />
      <ContactCTA />
    </>
  );
}
