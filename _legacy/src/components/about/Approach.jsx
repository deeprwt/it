import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { getIcon } from "@/lib/icons";

const steps = [
  {
    icon: "Compass",
    title: "We Discover",
    description:
      "We start by understanding your business, audience and goals — auditing where you are and mapping where you want to be.",
  },
  {
    icon: "PenTool",
    title: "We Design",
    description:
      "Strategy turns into wireframes, prototypes and identity — experiences crafted for clarity, usability and conversion.",
  },
  {
    icon: "Rocket",
    title: "We Execute",
    description:
      "Our engineers build, test and launch with precision — then optimize continuously so results keep compounding.",
  },
];

export function Approach() {
  return (
    <section className="section bg-card/30">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="How We Work"
          title="We Discover. We Design. We Execute."
          description="Futuristic digital solutions for complex business challenges — delivered through a proven, transparent process."
        />

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = getIcon(step.icon);
            return (
              <Reveal key={step.title} delay={i * 100} className="bg-background p-8 lg:p-10">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center border border-border text-accent">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-5xl font-semibold text-border">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
