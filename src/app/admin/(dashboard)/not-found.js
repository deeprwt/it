import Link from "next/link";
import { FileQuestion, LayoutDashboard, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border bg-card p-8 text-center">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-brand-2/10 blur-3xl" />
        <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-brand/20 bg-brand/10 text-brand">
          <FileQuestion className="h-6 w-6" aria-hidden />
        </span>
        <p className="relative mt-5 font-mono text-xs uppercase tracking-eyebrow text-brand">404</p>
        <h1 className="relative mt-2 text-xl font-bold tracking-tight text-foreground">We couldn&apos;t find that</h1>
        <p className="relative mt-2 text-sm text-muted-foreground">
          The item may have been deleted, or the link is out of date.
        </p>
        <div className="relative mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Button asChild variant="brand">
            <Link href="/admin">
              <LayoutDashboard /> Back to overview
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/posts">
              <Search /> Browse posts
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
