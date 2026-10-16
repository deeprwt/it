import dynamic from "next/dynamic";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { AboutPreview } from "@/components/home/AboutPreview";
import { WhyChoose } from "@/components/home/WhyChoose";
import { GlobalPresence } from "@/components/home/GlobalPresence";
import { CompanyInfo } from "@/components/home/CompanyInfo";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { TestimonialsSkeleton } from "@/components/shared/CardSkeleton";
import { organizationSchema } from "@/lib/schema";

// Heavy, below-the-fold client section — code-split out of the initial
// bundle, with a card-level skeleton fallback while its chunk loads.
const Testimonials = dynamic(
  () => import("@/components/home/Testimonials").then((m) => m.Testimonials),
  { loading: () => <TestimonialsSkeleton /> }
);

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Hero />
      <TrustStrip />
      <WhatWeDo />
      <FeaturedWork />
      <AboutPreview />
      <WhyChoose />
      <GlobalPresence />
      <Testimonials />
      <CompanyInfo />
      <ContactCTA />
    </>
  );
}
