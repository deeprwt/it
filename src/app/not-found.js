import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { CodeSnow } from "@/components/site/effects/CodeSnow";

export const metadata = {
  title: "404 — Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-screen flex-col overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid-lines mask-radial [background-size:56px_56px] opacity-60" />
      <CodeSnow className="-z-10" density={0.6} />

      <header className="container flex h-20 items-center">
        <Link href="/" aria-label="Snowdox — home">
          <Logo variant="dark" className="h-11" />
        </Link>
      </header>

      <div className="container flex flex-1 flex-col items-center justify-center pb-20 text-center">
        <p
          data-text="404"
          className="glitch font-display text-[34vw] font-extrabold leading-none tracking-tightest text-gradient sm:text-[16rem]"
        >
          404
        </p>
        <div className="mt-6 w-full max-w-md rounded-xl border border-white/10 bg-card/80 p-5 text-left font-mono text-sm backdrop-blur">
          <p>
            <span className="text-success">➜</span> <span className="text-brand">~</span> cd ./this-page
          </p>
          <p className="mt-1 text-destructive">zsh: no such file or directory</p>
          <p className="mt-1 text-muted-foreground">hint: the page moved, or never existed.</p>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild variant="brand" size="lg" className="rounded-full">
            <Link href="/">
              <ArrowLeft /> Back home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full border-white/15">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
