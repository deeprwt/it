import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { getIcon } from "@/lib/icons";
import { perks } from "@/data/careers";

export function Culture() {
  return (
    <section className="section">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative">
            <div className="relative aspect-[5/4] overflow-hidden border border-border">
              <Image
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1100&q=70"
                alt="Life at Ribbon IT"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Life @ Ribbon IT"
              title="Where purpose, people and progress meet"
              description="For 13 years we've grown by investing in our people. Join a team that ships work it's proud of — and has fun doing it."
            />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((perk, i) => {
            const Icon = getIcon(perk.icon);
            return (
              <Reveal key={perk.title} delay={(i % 3) * 70} className="group bg-background p-7 transition-colors hover:bg-card">
                <span className="mb-5 flex h-11 w-11 items-center justify-center border border-border text-accent transition-colors group-hover:border-accent group-hover:bg-accent/10">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-medium text-foreground">{perk.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{perk.description}</p>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
