import { Clock, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { ContactForm } from "@/components/site/ContactForm";
import { FaqSection } from "@/components/site/sections/HomeSections";
import { Reveal } from "@/components/site/effects/Reveal";
import { socialIcons } from "@/components/site/icons";
import { JsonLd, PageJsonLd } from "@/components/site/JsonLd";
import { getSiteSettings } from "@/lib/cms";
import { buildPageMetadata, breadcrumbSchema } from "@/lib/seo";
import { faqs } from "@/data/site";

export const revalidate = 3600;

export function generateMetadata() {
  return buildPageMetadata("/contact");
}

const NEXT_STEPS = [
  ["01", "We read every word", "A senior person reviews your brief — no bots, no sales scripts."],
  ["02", "30-minute intro call", "We dig into goals, constraints and what success looks like."],
  ["03", "Proposal in 48h", "A clear scope, timeline and price you can take to your team."],
];

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const socials = Object.entries(settings.socials || {}).filter(([k, v]) => v && socialIcons[k]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: "Home", url: "/" },
            { name: "Contact", url: "/contact" },
          ],
          settings
        )}
      />
      <PageJsonLd path="/contact" />

      <PageHero
        eyebrow="contact"
        title="Let's make it"
        accent="loud."
        description="Tell us about your project and we'll reply within one business day with next steps."
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "Contact" }]}
        className="pb-10 md:pb-14"
      />

      <section className="pb-24">
        <div className="container grid grid-cols-1 gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <ContactForm />
          </Reveal>

          <Reveal delay={120} className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-card/60 p-8">
              <p className="font-mono text-xs uppercase tracking-eyebrow text-brand">{"// direct line"}</p>
              <a href={`mailto:${settings.email}`} className="mt-4 flex items-center gap-3 font-display text-2xl font-bold tracking-tight hover:text-brand sm:text-3xl">
                <Mail className="h-6 w-6 shrink-0 text-brand" />
                <span className="break-all">{settings.email}</span>
              </a>
              {settings.phone && <p className="mt-3 font-mono text-sm text-muted-foreground">{settings.phone}</p>}
              <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand" /> Replies within 1 business day
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand" /> {settings.address}
                </p>
              </div>
              {socials.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {socials.map(([key, href]) => {
                    const { icon: SocialIcon, label } = socialIcons[key];
                    return (
                      <Button key={key} asChild variant="outline" size="icon" className="rounded-full border-white/10 hover:border-brand hover:text-brand">
                        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                          <SocialIcon />
                        </a>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-card/60 p-8">
              <p className="font-mono text-xs uppercase tracking-eyebrow text-brand">{"// what happens next"}</p>
              <ol className="mt-6 space-y-6">
                {NEXT_STEPS.map(([n, title, body]) => (
                  <li key={n} className="flex gap-4">
                    <span className="font-mono text-sm text-brand">{n}</span>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      <FaqSection faqs={faqs.slice(0, 4)} light />
    </>
  );
}
