import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-charcoal">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 30%, hsl(var(--accent) / 0.14), transparent 60%)",
        }}
      />
      <Container className="relative text-center">
        <p className="eyebrow justify-center">Error 404</p>
        <h1 className="mt-5 font-display text-7xl font-semibold text-foreground sm:text-8xl">
          4<span className="text-accent">∞</span>4
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base text-muted-foreground">
          The page you&apos;re looking for has moved or never existed. Let&apos;s
          get you back on track.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild variant="accent" size="lg">
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/services">
              <ArrowLeft className="h-4 w-4" />
              Explore services
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
