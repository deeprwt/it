"use client";

import { useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, LayoutDashboard, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({ error, reset }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const message = error?.message || "Something went wrong while loading this page.";
  const schemaHint = /relation .* does not exist|schema cache|column .* does not exist/i.test(message);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-lg rounded-2xl border bg-card p-8 text-center shadow-elegant">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" aria-hidden />
        </span>
        <h1 className="mt-5 text-xl font-bold tracking-tight text-foreground">This page hit a snag</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {schemaHint
            ? "The database tables look incomplete. Run supabase/schema.sql in the Supabase SQL editor, then try again."
            : "We couldn't load this screen. It's usually temporary — try again in a moment."}
        </p>
        <p className="mx-auto mt-4 max-w-md break-words rounded-lg border bg-muted/40 px-3 py-2 font-mono text-xs text-muted-foreground">
          {message}
          {error?.digest && <span className="block opacity-70">ref: {error.digest}</span>}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Button
            variant="brand"
            disabled={pending}
            onClick={() =>
              startTransition(() => {
                router.refresh();
                reset();
              })
            }
          >
            {pending ? <Loader2 className="animate-spin" /> : <RotateCcw />} Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin">
              <LayoutDashboard /> Back to overview
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
