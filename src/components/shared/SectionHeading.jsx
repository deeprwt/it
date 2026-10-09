import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/Reveal";

/**
 * Eyebrow + display title + optional description block.
 * Mirrors the reference site's section header rhythm.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleClassName,
  as: TitleTag = "h2",
}) {
  const alignment = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <div className={cn("flex flex-col gap-5", alignment, align === "center" && "max-w-3xl", className)}>
      {eyebrow && (
        <Reveal as="span" className="eyebrow">
          <span className="h-px w-6 bg-accent" aria-hidden />
          {eyebrow}
        </Reveal>
      )}
      {title && (
        <Reveal delay={80}>
          <TitleTag
            className={cn(
              "heading-xl text-3xl text-foreground sm:text-4xl lg:text-5xl text-balance",
              titleClassName
            )}
          >
            {title}
          </TitleTag>
        </Reveal>
      )}
      {description && (
        <Reveal delay={160}>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg text-pretty">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
