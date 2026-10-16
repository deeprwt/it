import { Badge } from "@/components/ui/badge";
import { Spotlight } from "@/components/site/effects/Interactive";
import { cn } from "@/lib/utils";

/** Generative "screenshot": a browser frame with a gradient mesh + abstract UI. */
function WorkArt({ item, large }) {
  const mesh = {
    backgroundImage: `radial-gradient(at 18% 22%, hsl(${item.hue} 95% 58% / 0.65), transparent 55%), radial-gradient(at 82% 78%, hsl(${item.hue2} 95% 60% / 0.55), transparent 55%), radial-gradient(at 70% 10%, hsl(${item.hue} 90% 70% / 0.25), transparent 40%)`,
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-background">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-card/80 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="ml-2 truncate rounded bg-background/70 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
          snowdox.dev/work/{item.slug}
        </span>
      </div>
      <div className={cn("relative overflow-hidden", large ? "aspect-[16/10]" : "aspect-[16/11]")} style={mesh}>
        <div className="absolute inset-0 bg-grid-lines [background-size:28px_28px] opacity-40" />
        {/* abstract interface */}
        <div className="absolute inset-x-[8%] top-[12%] flex items-center justify-between transition-transform duration-700 group-hover:-translate-y-1">
          <span className="h-2.5 w-16 rounded-full bg-white/70" />
          <span className="flex gap-2">
            <span className="h-2 w-8 rounded-full bg-white/40" />
            <span className="h-2 w-8 rounded-full bg-white/40" />
            <span className="h-2 w-10 rounded-full bg-white/80" />
          </span>
        </div>
        <div className="absolute left-[8%] top-[30%] w-[46%] space-y-2.5 transition-transform duration-700 group-hover:translate-x-1">
          <span className="block h-4 w-full rounded-md bg-white/90" />
          <span className="block h-4 w-4/5 rounded-md bg-white/90" />
          <span className="mt-4 block h-2 w-3/4 rounded-full bg-white/45" />
          <span className="block h-2 w-2/3 rounded-full bg-white/45" />
          <span className="mt-4 inline-block h-6 w-24 rounded-full bg-background/90" />
        </div>
        <div className="absolute bottom-[-8%] right-[7%] w-[38%] rotate-[-6deg] rounded-xl border border-white/30 bg-background/70 p-3 shadow-elegant backdrop-blur transition-transform duration-700 group-hover:rotate-[-2deg] group-hover:scale-105">
          <span className="block font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            {item.metrics[0].label}
          </span>
          <span className="mt-1 block font-display text-2xl font-extrabold text-foreground md:text-3xl">
            {item.metrics[0].value}
          </span>
          <span className="mt-2 flex h-8 items-end gap-1">
            {[40, 65, 50, 80, 70, 100].map((h, i) => (
              <span
                key={i}
                className="w-full rounded-sm"
                style={{ height: `${h}%`, background: `hsl(${i % 2 ? item.hue2 : item.hue} 90% 60% / 0.85)` }}
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

export function WorkCard({ item, large = false, className }) {
  return (
    <Spotlight
      className={cn(
        "group relative h-full rounded-2xl border border-white/[0.07] bg-card/50 p-3 transition-colors duration-500 hover:bg-card",
        className
      )}
    >
      <span className="spotlight-border" aria-hidden />
      <WorkArt item={item} large={large} />
      <div className="px-3 pb-3 pt-6">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          <span className="text-brand">{item.industry}</span>
          <span aria-hidden>·</span>
          <span>{item.client}</span>
          <span aria-hidden>·</span>
          <span>{item.year}</span>
        </div>
        <h3 className={cn("mt-3 font-display font-bold tracking-tight", large ? "text-3xl md:text-4xl" : "text-2xl")}>
          {item.title}
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <dl className="flex gap-8">
            {item.metrics.map((m) => (
              <div key={m.label}>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{m.label}</dt>
                <dd className="mt-1 font-display text-2xl font-extrabold text-foreground">{m.value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap items-center gap-1.5">
            {item.services.map((s) => (
              <Badge key={s} variant="outline" className="border-white/10 font-normal text-muted-foreground">
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Spotlight>
  );
}
