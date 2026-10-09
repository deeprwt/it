import { PageHero } from "@/components/shared/PageHero";
import { CaseStudyGrid } from "@/components/casestudies/CaseStudyGrid";
import { StatsBand } from "@/components/shared/StatsBand";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = {
  title: "Case Studies — Work That Drives Results",
  description:
    "Explore Ribbon IT case studies across e-commerce, fintech, healthcare, real estate and education — real brands, real outcomes.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Case Studies", url: "/case-studies" },
            ])
          ),
        }}
      />
      <PageHero
        eyebrow="Our Work"
        title="Built on clarity. Delivered with results."
        description="A selection of brands we've helped grow — spanning luxury retail, fintech, healthcare, real estate and education."
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "Case Studies" }]}
      />
      <CaseStudyGrid />
      <StatsBand className="!pt-0" />
      <ContactCTA />
    </>
  );
}
