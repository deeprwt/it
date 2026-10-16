"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/actions/auth";

const ERRORS = {
  link: "That sign-in link is invalid or has expired. Request a new one below.",
};

export function LoginForm({ next = "/admin", initialError }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState(initialError ? ERRORS[initialError] || initialError : null);
  const [pending, startTransition] = React.useTransition();

  function onSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    // Read from the form too — browser autofill doesn't always fire onChange.
    const finalEmail = String(form.get("email") || email).trim().toLowerCase();
    const finalPassword = String(form.get("password") || password);
    setError(null);
    startTransition(async () => {
      const res = await signIn({ email: finalEmail, password: finalPassword, next });
      if (res && !res.ok) setError(res.error);
    });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="eyebrow">// admin</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to manage posts, pages, SEO and leads.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Couldn&apos;t sign you in</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@snowdox.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 pl-10"
              required
              autoFocus
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/admin/forgot-password" className="text-sm font-medium text-brand underline-offset-4 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 pl-10 pr-12"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
        </div>

        <Button type="submit" variant="brand" size="lg" className="group w-full rounded-xl" disabled={pending}>
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          {pending ? (
            <>
              <Loader2 className="animate-spin" /> Signing in…
            </>
          ) : (
            <>
              Sign in <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        Accounts are created by an admin in Supabase. Need access? Ask your team lead.
      </p>
    </div>
  );
}
