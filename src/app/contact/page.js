import { PageHero } from "@/components/shared/PageHero";
import { OfficesGrid } from "@/components/contact/OfficesGrid";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = {
  title: "Contact Us — Let's Build Together",
  description:
    "Talk to Ribbon IT about your website, app, AI or marketing project. Offices in Bangalore, Dubai and Toronto. We reply within one business day.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Contact", url: "/contact" },
            ])
          ),
        }}
      />
      <PageHero
        eyebrow="Get In Touch"
        title="Let's create something extraordinary."
        description="Tell us where you want to go and we'll bring the strategy, design and engineering to get you there — on time and on budget."
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "Contact" }]}
      />
      <OfficesGrid />
      <ContactCTA id="enquiry" />
    </>
  );
}
