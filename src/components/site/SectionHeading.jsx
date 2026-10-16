import { Reveal } from "@/components/site/effects/Reveal";
import { ScrambleText } from "@/components/site/effects/ScrambleText";
import { cn } from "@/lib/utils";

/** `// eyebrow` + display title + optional lede. */
export function SectionHeading({ eyebrow, title, description, align = "left", className, children, as: Tag = "h2" }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        align === "split" && "md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className="eyebrow">
            <span aria-hidden className="text-muted-foreground">
              {"//"}
            </span>
            <ScrambleText text={eyebrow} />
          </p>
        )}
        <Reveal>
          <Tag className="mt-4 text-balance font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl md:text-[2.75rem] lg:text-5xl">
            {title}
          </Tag>
        </Reveal>
      </div>
      {(description || children) && (
        <Reveal delay={120} className={cn("max-w-xl", align === "center" && "mx-auto")}>
          {description && <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>}
          {children}
        </Reveal>
      )}
    </div>
  );
}
