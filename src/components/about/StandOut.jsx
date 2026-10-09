import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { getIcon } from "@/lib/icons";

const reasons = [
  {
    icon: "Lightbulb",
    title: "Creative Designers",
    description:
      "We combine strategy with design and technology to create best-in-class work that influences user satisfaction and business success.",
  },
  {
    icon: "MonitorSmartphone",
    title: "UI/UX Crafters",
    description:
      "Easy-to-navigate experiences with exceptional usability — layout, color, typography and motion considered down to the detail.",
  },
  {
    icon: "Code2",
    title: "Coding Experts",
    description:
      "Developers who work closely with you to analyze, code and execute — applications built with deep technical expertise.",
  },
  {
    icon: "Layout",
    title: "Web Genius",
    description:
      "A dedicated, certified web team that focuses on every requirement and ships modules that move your business forward.",
  },
  {
    icon: "Smartphone",
    title: "App Inventors",
    description:
      "App developers who bring your ideas to life with precision — intuitive applications that captivate users.",
  },
  {
    icon: "Megaphone",
    title: "Branding Connoisseurs",
    description:
      "Skilled digital marketers across social and content who make your brand rank at the top of any search result.",
  },
];

export function StandOut() {
  return (
    <section className="section">
      <Container>
        <SectionHeading
          eyebrow="Why We Stand Out"
          title="Six disciplines, one accountable team"
          description="From first concept to ongoing growth, every capability you need lives under one roof."
        />

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => {
            const Icon = getIcon(reason.icon);
            return (
              <Reveal
                key={reason.title}
                delay={(i % 3) * 80}
                className="group bg-background p-8 transition-colors hover:bg-card"
              >
                <span className="mb-6 flex h-12 w-12 items-center justify-center border border-border text-accent transition-colors group-hover:border-accent group-hover:bg-accent/10">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-display text-xl font-medium text-foreground">
                  {reason.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
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
