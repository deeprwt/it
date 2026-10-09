import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { ContactForm } from "@/components/shared/ContactForm";
import { site, offices } from "@/data/site";

/**
 * Closing consultation section — heading + contact details on the left,
 * the enquiry form on the right. Mirrors the reference's contact block.
 */
export function ContactCTA({ id = "contact" }) {
  const hq = offices[0];

  return (
    <section id={id} className="section scroll-mt-24 bg-card/30">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal as="span" className="eyebrow mb-6 flex">
              <span className="h-px w-6 bg-accent" aria-hidden /> Let&apos;s Talk
            </Reveal>
            <Reveal delay={80}>
              <h2 className="heading-xl text-3xl text-foreground text-balance sm:text-4xl lg:text-5xl">
                Let&apos;s create something extraordinary
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                Tell us where you want to go. We&apos;ll bring the strategy,
                design and engineering to get you there — on time and on budget.
              </p>
            </Reveal>

            <div className="mt-10 space-y-px overflow-hidden border border-border bg-border">
              <ContactRow icon={Phone} label="Call us">
                <a href={`tel:${site.phonePrimary.replace(/\s/g, "")}`} className="hover:text-accent">
                  {site.phonePrimary}
                </a>
                <span className="text-muted-foreground"> · </span>
                <a href={`tel:${site.phoneSecondary.replace(/\s/g, "")}`} className="hover:text-accent">
                  {site.phoneSecondary}
                </a>
              </ContactRow>
              <ContactRow icon={Mail} label="Email us">
                <a href={`mailto:${site.email}`} className="hover:text-accent">
                  {site.email}
                </a>
              </ContactRow>
              <ContactRow icon={MapPin} label="Visit us">
                {hq.address}
              </ContactRow>
            </div>
          </div>

          <Reveal delay={120} className="border border-border bg-background p-6 sm:p-8 lg:p-10">
            <ContactForm />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function ContactRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-4 bg-card p-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-border text-accent">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm text-foreground">{children}</p>
      </div>
    </div>
  );
}
