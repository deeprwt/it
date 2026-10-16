import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeading } from "@/components/site/SectionHeading";
import { LightSection } from "@/components/site/LightSection";
import { Reveal } from "@/components/site/effects/Reveal";
import { tech, homeTechGroups } from "./registry";
import { cn } from "@/lib/utils";

function luminance(hex) {
  const n = parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** One technology tile: brand-coloured logo (or monogram) + name. */
export function TechTile({ id, tone = "light", className }) {
  const item = tech[id];
  if (!item) return null;
  const { icon } = item;
  // Near-black logos vanish on dark backgrounds (and near-white on light) → use text colour.
  const lum = icon ? luminance(icon.hex) : 0;
  const color = !icon ? undefined : tone === "dark" ? (lum < 0.05 ? "currentColor" : `#${icon.hex}`) : lum > 0.8 ? "currentColor" : `#${icon.hex}`;

  return (
    <div
      className={cn(
        "group flex flex-col items-center justify-center gap-3 rounded-2xl border bg-card px-3 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-glow",
        className
      )}
    >
      {icon ? (
        <svg role="img" aria-hidden="true" viewBox="0 0 24 24" className="h-9 w-9 transition-transform duration-300 group-hover:scale-110" style={{ fill: color }}>
          <path d={icon.path} />
        </svg>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground font-display text-[11px] font-bold text-background">
          {item.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 3)}
        </span>
      )}
      <span className="text-xs font-medium text-foreground/80">{item.name}</span>
    </div>
  );
}

export function TechGrid({ items, tone = "light", className }) {
  return (
    <ul className={cn("grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6", className)}>
      {items.map((id) => (
        <li key={id}>
          <TechTile id={id} tone={tone} />
        </li>
      ))}
    </ul>
  );
}

/**
 * "Robust tools & technologies we work with" — tabbed logo grids on a white
 * section. Every tab is server-rendered and force-mounted so all names are
 * in the HTML for search engines.
 */
export function ToolsSection({
  groups = homeTechGroups,
  eyebrow = "tools & technologies",
  title = "Robust tools & technologies we work with",
  description = "We pick boring, proven tech for the foundations and cutting-edge tools where they move the needle.",
}) {
  return (
    <LightSection className="section">
      <div className="container">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} align="split" />
        <Reveal delay={100} className="mt-12">
          <Tabs defaultValue={groups[0].label}>
            <TabsList className="h-auto flex-wrap justify-start gap-1 rounded-xl border bg-card p-1.5">
              {groups.map((g) => (
                <TabsTrigger
                  key={g.label}
                  value={g.label}
                  className="rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background"
                >
                  {g.label}
                  <span className="ml-1.5 text-[10px] opacity-60">{g.items.length}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            {groups.map((g) => (
              <TabsContent key={g.label} value={g.label} forceMount className="mt-8 data-[state=inactive]:hidden">
                <TechGrid items={g.items} />
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>
      </div>
    </LightSection>
  );
}
