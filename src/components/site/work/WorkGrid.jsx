"use client";

import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Reveal } from "@/components/site/effects/Reveal";
import { WorkCard } from "./WorkCard";
import { work, industries } from "@/data/work";

export function WorkGrid() {
  const [filter, setFilter] = useState("All");
  const items = filter === "All" ? work : work.filter((w) => w.industry === filter);

  return (
    <section className="pb-24">
      <div className="container">
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(v) => v && setFilter(v)}
          aria-label="Filter by industry"
          className="mb-10 justify-start gap-2"
        >
          {industries.map((ind) => (
            <ToggleGroupItem
              key={ind}
              value={ind}
              className="h-9 rounded-full border border-white/10 px-4 font-mono text-xs uppercase tracking-widest data-[state=on]:border-brand data-[state=on]:bg-brand data-[state=on]:text-brand-foreground"
            >
              {ind}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="grid gap-5 md:grid-cols-2">
          {items.map((item, i) => (
            <Reveal key={item.slug} delay={(i % 2) * 100}>
              <WorkCard item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
