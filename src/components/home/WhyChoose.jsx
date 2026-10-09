import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { getIcon } from "@/lib/icons";

const reasons = [
  { icon: "Sparkles", title: "Crafted Design", description: "Visually engrossing interfaces that captivate your audience." },
  { icon: "Layers", title: "Structured Framework", description: "Scalable architecture engineered for seamless growth." },
  { icon: "ShieldCheck", title: "Secure by Design", description: "Hardened, security-first code that defends against threats." },
  { icon: "Users", title: "Dedicated Team", description: "Specialists fully committed to your project's success." },
  { icon: "Target", title: "Result-Oriented", description: "Strategies built around the outcomes that grow your business." },
  { icon: "Headphones", title: "24/7 Support", description: "Round-the-clock assistance and reliable maintenance." },
  { icon: "Clock", title: "On-Time Delivery", description: "Milestones met and projects shipped without delay." },
  { icon: "BadgeCheck", title: "100% Satisfaction", description: "We exceed expectations — and keep earning your trust." },
];

/**
 * Why-choose value props in a tight bordered grid.
 */
export function WhyChoose() {
  return (
    <section className="section">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Why Ribbon IT"
          title="A partner engineered for your success"
          description="The reasons 500+ brands choose us — and stay with us for years."
        />

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, i) => {
            const Icon = getIcon(reason.icon === "BadgeCheck" ? "ShieldCheck" : reason.icon);
            return (
              <Reveal
                key={reason.title}
                delay={(i % 4) * 70}
                className="group bg-background p-7 transition-colors hover:bg-card"
              >
                <span className="mb-5 flex h-11 w-11 items-center justify-center border border-border text-accent transition-colors group-hover:border-accent group-hover:bg-accent/10">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-base font-medium text-foreground">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {reason.description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
