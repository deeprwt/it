import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/admin/ThemeToggle";

const HIGHLIGHTS = ["Blog posts with live SEO scoring", "Per-page meta, sitemap & social cards", "Leads inbox and media library"];

export default function AuthLayout({ children }) {
  return (
    <div className="relative flex min-h-screen bg-background">
      {/* Form side */}
      <div className="relative flex w-full flex-col lg:w-1/2">
        <div className="flex h-16 items-center justify-between px-6 sm:px-10">
          <Link href="/" className="rounded-lg lg:invisible" aria-label="Snowdox home">
            <Logo markClassName="h-7 w-7" />
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <p className="px-6 pb-6 text-center text-xs text-muted-foreground sm:px-10">
          © {new Date().getFullYear()} Snowdox · Admin access only
        </p>
      </div>

      {/* Brand side */}
      <aside className="relative hidden w-1/2 overflow-hidden border-l bg-card lg:flex lg:items-center lg:justify-center">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-lines [background-size:48px_48px] mask-radial" />
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-28 -left-20 h-96 w-96 rounded-full bg-brand-2/20 blur-3xl" />
        <div className="relative flex max-w-sm flex-col items-center text-center">
          <Link href="/" aria-label="Snowdox home" className="rounded-xl">
            <Logo markClassName="h-12 w-12" animated className="[&>span:last-child]:text-4xl" />
          </Link>
          <p className="mt-6 text-balance font-display text-2xl font-semibold leading-tight text-foreground">
            Ship pages, posts &amp; SEO from one place.
          </p>
          <ul className="mt-8 space-y-3 text-left">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
