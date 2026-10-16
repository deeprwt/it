import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CodeSnow } from "@/components/site/effects/CodeSnow";
import { ScrambleText } from "@/components/site/effects/ScrambleText";
import { Reveal } from "@/components/site/effects/Reveal";
import { cn } from "@/lib/utils";

/** Hero for inner pages: breadcrumbs, `// eyebrow`, giant title, lede. */
export function PageHero({ eyebrow, title, accent, description, breadcrumbs = [], children, className }) {
  return (
    <section className={cn("relative isolate overflow-hidden pb-16 pt-32 md:pb-24 md:pt-44", className)}>
      <div className="absolute inset-0 -z-10 bg-grid-lines mask-radial [background-size:56px_56px] opacity-60" />
      <div className="absolute -top-24 right-[-10%] -z-10 h-[28rem] w-[28rem] rounded-full bg-brand/15 blur-[120px]" />
      <div className="absolute -bottom-40 left-[-10%] -z-10 h-[24rem] w-[24rem] rounded-full bg-brand-2/15 blur-[120px]" />
      <CodeSnow density={0.35} className="-z-10 opacity-70 mask-fade-b" />

      <div className="container">
        {breadcrumbs.length > 0 && (
          <Breadcrumb className="mb-8">
            <BreadcrumbList className="font-mono text-xs uppercase tracking-widest">
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.name} className="contents">
                  <BreadcrumbItem>
                    {crumb.url && i < breadcrumbs.length - 1 ? (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.url}>{crumb.name}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="text-brand">{crumb.name}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {i < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </span>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        {eyebrow && (
          <p className="eyebrow">
            <span aria-hidden className="text-muted-foreground">
              {"//"}
            </span>
            <ScrambleText text={eyebrow} />
          </p>
        )}

        <Reveal>
          <h1 className="mt-5 max-w-4xl text-balance font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.25rem]">
            {title} {accent && <span className="text-gradient animate-gradient-x">{accent}</span>}
          </h1>
        </Reveal>

        {description && (
          <Reveal delay={120}>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              {description}
            </p>
          </Reveal>
        )}

        {children && (
          <Reveal delay={220} className="mt-10">
            {children}
          </Reveal>
        )}
      </div>
    </section>
  );
}
