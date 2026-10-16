import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";

export function AboutStory() {
  return (
    <section className="section">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative aspect-[5/4] overflow-hidden border border-border">
              <Image
                src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=1100&q=70"
                alt="Ribbon IT team at work"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-2 border border-border bg-background px-6 py-5 shadow-elegant sm:-right-6">
              <p className="font-display text-3xl font-semibold text-accent">2013</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Building since
              </p>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="Our Story"
              title="An elite digital partner, built on trust since 2013"
            />
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
              <Reveal as="p" delay={80}>
                Ribbon IT Pvt. Ltd. is a Bangalore-based company providing
                custom web development, web applications, CMS &amp; WordPress,
                e-commerce, UI/UX, and full-spectrum digital marketing across the
                globe. We are pioneers in social, content and performance
                marketing that reshape businesses worldwide.
              </Reveal>
              <Reveal as="p" delay={140}>
                Over 13+ years we&apos;ve navigated diverse challenges, achieved
                notable growth, and extended our services across every industry —
                earning recognition from local and global clients with the most
                demanding requirements.
              </Reveal>
              <Reveal as="p" delay={200}>
                We understand what it takes to create outstanding digital
                products — the right structure, typography, color, layout and
                technology — and we use that knowledge to craft experiences that
                generate leads and lift conversion. Our clients&apos; growth is
                the thriving motto of our business.
              </Reveal>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
