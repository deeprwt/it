import { PageHero } from "@/components/shared/PageHero";
import { InsightsGrid } from "@/components/blog/InsightsGrid";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = {
  title: "Insights & Blog — Ideas on Web, AI & Growth",
  description:
    "Practical insights on web development, AI agents, e-commerce, design and digital marketing from the Ribbon IT team.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Insights", url: "/blog" },
            ])
          ),
        }}
      />
      <PageHero
        eyebrow="Insights Hub"
        title="Ideas that help your business grow."
        description="Practical thinking on web, AI, e-commerce, design and marketing — from the team shipping it every day."
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "Insights" }]}
      />
      <InsightsGrid />
      <ContactCTA />
    </>
  );
}
