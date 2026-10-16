import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { projects } from "@/data/projects";

export function CaseStudyGrid() {
  return (
    <section className="section">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={(i % 2) * 100}>
              <article className="group flex h-full flex-col overflow-hidden border border-border bg-card transition-colors hover:border-accent/50">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={`${project.title} — ${project.category}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <span className="absolute left-4 top-4 border border-white/20 bg-black/40 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-widest text-white backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-display text-2xl font-medium text-foreground">
                      {project.title}
                    </h2>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                  </div>
                  <p className="mt-1 text-sm font-medium text-accent">{project.industry}</p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {project.summary}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                    <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-accent" />
                      {project.location}
                    </span>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-accent"
                    >
                      Start a similar project
                      <ArrowUpRight className="h-4 w-4 text-accent" />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
