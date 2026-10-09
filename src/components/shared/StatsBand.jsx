import { Counter } from "@/components/shared/Counter";
import { Reveal } from "@/components/shared/Reveal";
import { Container } from "@/components/shared/Container";
import { stats } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Four animated stat counters. Reused on Home + About.
 */
export function StatsBand({ className, withContainer = true }) {
  const grid = (
    <div className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border md:grid-cols-4">
      {stats.map((stat, i) => (
        <Reveal
          key={stat.label}
          delay={i * 90}
          className="flex flex-col gap-2 bg-background p-6 lg:p-8"
        >
          <span className="font-display text-4xl font-semibold text-foreground lg:text-5xl">
            <Counter value={stat.value} suffix={stat.suffix} />
          </span>
          <span className="text-sm font-medium text-foreground">{stat.label}</span>
          <span className="text-xs text-muted-foreground">{stat.detail}</span>
        </Reveal>
      ))}
    </div>
  );

  if (!withContainer) return <div className={className}>{grid}</div>;

  return (
    <section className={cn("section", className)}>
      <Container>{grid}</Container>
    </section>
  );
}
