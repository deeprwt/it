"use client";

import { Quote, Star } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from "@/components/ui/carousel";
import { testimonials } from "@/data/testimonials";
import { ratings } from "@/data/site";

/**
 * Client testimonials carousel. Mirrors the reference's slider with
 * prev/next controls and a verified-rating badge.
 */
export function Testimonials() {
  return (
    <section className="section bg-card/30">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Client Stories"
            title="What our clients are saying"
            description="Trusted by 500+ businesses — rated 4.9 across Clutch, GoodFirms and Trustpilot."
          />
          <div className="flex items-center gap-3 border border-border bg-background px-4 py-3">
            <span className="flex items-center gap-1 text-accent">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent" />
              ))}
            </span>
            <div className="text-sm">
              <span className="font-semibold text-foreground">
                {ratings[0].score}/5
              </span>
              <span className="ml-2 text-muted-foreground">180+ reviews</span>
            </div>
          </div>
        </div>

        <Carousel
          opts={{ align: "start", loop: true }}
          className="mt-12"
        >
          <CarouselContent>
            {testimonials.map((t, i) => (
              <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                <figure className="flex h-full flex-col border border-border bg-background p-7">
                  <Quote className="mb-5 h-8 w-8 text-accent" />
                  <blockquote className="flex-1 text-sm leading-relaxed text-foreground/90">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-7 border-t border-border pt-5">
                    <p className="font-display text-base font-medium text-foreground">
                      {t.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{t.company}</p>
                    <p className="mt-1 text-xs uppercase tracking-wider text-accent">
                      {t.project}
                    </p>
                  </figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-10 flex items-center justify-between">
            <CarouselDots />
            <div className="flex items-center gap-3">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </div>
        </Carousel>
      </Container>
    </section>
  );
}
