import Link from "next/link";
import { CheckCircle2, Database, ExternalLink, KeyRound, Rocket, ServerCog, TerminalSquare, UserPlus } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/admin/CopyButton";
import { ThemeToggle } from "@/components/admin/ThemeToggle";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = { title: "Connect Supabase" };

const ENV_SNIPPET = `NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000`;

function Code({ children, copy }) {
  return (
    <div className="relative mt-3 overflow-hidden rounded-xl border bg-background">
      <pre className="overflow-x-auto p-4 pr-24 font-mono text-xs leading-relaxed text-foreground/90">{children}</pre>
      {copy && <CopyButton value={copy} className="absolute right-2 top-2 h-8" />}
    </div>
  );
}

const STEPS = [
  {
    icon: ServerCog,
    title: "Create a Supabase project",
    body: (
      <>
        Sign in at{" "}
        <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-brand underline-offset-4 hover:underline">
          supabase.com/dashboard
        </a>{" "}
        and create a new project (the free tier is fine). Then open <strong className="text-foreground">Project Settings → API</strong>.
      </>
    ),
  },
  {
    icon: KeyRound,
    title: "Add your environment variables",
    body: (
      <>
        Copy <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-brand">.env.example</code> to{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-brand">.env.local</code> in the project root and fill
        in the project URL and the anon (public) key.
        <Code copy={ENV_SNIPPET}>{ENV_SNIPPET}</Code>
      </>
    ),
  },
  {
    icon: Database,
    title: "Create the database tables",
    body: (
      <>
        In Supabase open <strong className="text-foreground">SQL Editor</strong>, paste and run{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-brand">supabase/schema.sql</code>, then run{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-brand">supabase/seed.sql</code> for starter content.
        Both scripts are safe to re-run.
      </>
    ),
  },
  {
    icon: UserPlus,
    title: "Create your admin account",
    body: (
      <>
        Go to <strong className="text-foreground">Authentication → Users → Add user</strong> and create a user with your email and a
        password (tick “Auto confirm”). <Badge variant="brand">The first account becomes admin</Badge> — everyone after starts as a
        viewer until promoted.
      </>
    ),
  },
  {
    icon: TerminalSquare,
    title: "Restart the dev server",
    body: (
      <>
        Environment variables are read at start-up, so stop and restart the server, then sign in.
        <Code copy="npm run dev">npm run dev</Code>
      </>
    ),
  },
];

export default function SetupPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-grid-lines [background-size:48px_48px] mask-fade-b" />
      <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-32 top-64 h-96 w-96 rounded-full bg-brand-2/15 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-16">
        <div className="mb-10 flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>

        <p className="eyebrow">// setup</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Connect your dashboard to Supabase</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          The website works without a database, but the dashboard needs Supabase for sign-in, posts, SEO, media and leads. It takes
          about five minutes.
        </p>

        <div className="mt-8">
          {isSupabaseConfigured ? (
            <Alert variant="success">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Supabase is connected</AlertTitle>
              <AlertDescription>
                Your environment variables are set. If you haven&apos;t yet, run the SQL scripts and create your account, then sign in.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="warning">
              <Database className="h-4 w-4" />
              <AlertTitle>Supabase isn&apos;t configured yet</AlertTitle>
              <AlertDescription>
                <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> are missing. Follow the steps below.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <ol className="mt-10 space-y-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="relative flex gap-4 rounded-2xl border bg-card p-5 sm:gap-5 sm:p-6">
                <div className="flex flex-col items-center">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">Step {i + 1}</p>
                  <h2 className="mt-1 text-base font-semibold text-foreground">{step.title}</h2>
                  <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 flex flex-col gap-3 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Rocket className="h-5 w-5 text-brand" aria-hidden />
            <p className="text-sm text-foreground">All done? Head to the sign-in screen.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="outline">
              <a href="https://supabase.com/docs/guides/getting-started" target="_blank" rel="noopener noreferrer">
                <ExternalLink /> Supabase docs
              </a>
            </Button>
            <Button asChild variant="brand">
              <Link href="/admin/login">Go to sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
