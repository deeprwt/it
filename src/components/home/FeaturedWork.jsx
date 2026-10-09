import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { projects } from "@/data/projects";

/**
 * Featured Projects — 3-column image-dominant card grid with hover zoom,
 * mirroring the reference site's "Featured Projects" section.
 */
export function FeaturedWork() {
  return (
    <section id="work" className="section scroll-mt-24">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Featured Work"
            title="Built on clarity. Designed with purpose. Delivered with precision."
            description="A selection of brands we've helped grow — from luxury retail and fintech to healthcare and education."
          />
          <Reveal delay={120}>
            <Link
              href="/contact"
              className="link-underline inline-flex items-center gap-2 text-sm font-semibold text-foreground"
            >
              Start your project
              <ArrowUpRight className="h-4 w-4 text-accent" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 6).map((project, i) => (
            <Reveal key={project.id} delay={(i % 3) * 100}>
              <article className="group relative flex h-full flex-col overflow-hidden border border-border bg-card transition-colors hover:border-accent/50">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={`${project.title} — ${project.category}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <span className="absolute left-4 top-4 border border-white/20 bg-black/40 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-widest text-white backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-xl font-medium text-foreground">
                      {project.title}
                    </h3>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                  </div>
                  <p className="mt-1 text-sm font-medium text-accent">
                    {project.industry}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {project.summary}
                  </p>
                  <p className="mt-5 flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-accent" />
                    {project.location}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
