"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Loader2, Mail, MailCheck, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/lib/actions/auth";

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [sentTo, setSentTo] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [pending, startTransition] = React.useTransition();

  function onSubmit(event) {
    event.preventDefault();
    setError(null);
    const value = email.trim().toLowerCase();
    startTransition(async () => {
      const res = await requestPasswordReset({ email: value });
      if (!res.ok) setError(res.error);
      else setSentTo(value);
    });
  }

  if (sentTo) {
    return (
      <div className="space-y-6">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-success/30 bg-success/10 text-success">
          <MailCheck className="h-6 w-6" aria-hidden />
        </span>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Check your inbox</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            If an account exists for <span className="font-medium text-foreground">{sentTo}</span>, we&apos;ve sent a link to reset
            your password. It expires in about an hour.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="brand" className="flex-1">
            <Link href="/admin/login">
              <ArrowLeft /> Back to sign in
            </Link>
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => setSentTo(null)}>
            Use a different email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="eyebrow">// reset password</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Forgot your password?</h1>
        <p className="text-sm text-muted-foreground">Enter your email and we&apos;ll send you a secure reset link.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="reset-email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="reset-email"
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
        <Button type="submit" variant="brand" size="lg" className="w-full rounded-xl" disabled={pending || !email.trim()}>
          {pending ? <Loader2 className="animate-spin" /> : <Send />}
          {pending ? "Sending link…" : "Send reset link"}
        </Button>
      </form>

      <Button asChild variant="ghost" className="w-full text-muted-foreground">
        <Link href="/admin/login">
          <ArrowLeft /> Back to sign in
        </Link>
      </Button>
    </div>
  );
}
