import { Clock, ExternalLink, ShieldAlert } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/admin/auth/SignOutButton";

/** Shown to signed-in accounts that are not (yet) admin/editor. */
export function AccessPending({ profile, email }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-6">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-lines opacity-60 [background-size:48px_48px] mask-radial" />
      <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-brand-2/15 blur-3xl" />

      <div className="relative w-full max-w-md space-y-6 rounded-2xl border bg-card p-8 shadow-elegant">
        <Logo className="h-11" />
        <div className="space-y-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-warning/30 bg-warning/10 text-warning">
            <ShieldAlert className="h-6 w-6" aria-hidden />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Access pending</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You&apos;re signed in as <span className="font-medium text-foreground">{email || profile?.email}</span>, but your
            account doesn&apos;t have dashboard access yet. New accounts start as <strong className="text-foreground">viewers</strong>.
          </p>
        </div>
        <div className="flex items-start gap-3 rounded-xl border bg-muted/40 p-4 text-sm">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
          <p className="text-muted-foreground">
            Ask an admin to promote you to <strong className="text-foreground">editor</strong> or{" "}
            <strong className="text-foreground">admin</strong> in <span className="text-foreground">Settings → Team</span>, then
            sign in again.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <SignOutButton variant="brand" className="flex-1" />
          <Button asChild variant="outline" className="flex-1">
            <a href="/">
              <ExternalLink /> View website
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
