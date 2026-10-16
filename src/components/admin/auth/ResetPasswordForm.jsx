"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, CircleDashed, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

/** New + confirm password with live requirement checklist. */
export function PasswordFields({ password, confirm, onPassword, onConfirm, idPrefix = "pw" }) {
  const [show, setShow] = React.useState(false);
  const rules = [
    { ok: password.length >= 8, label: "At least 8 characters" },
    { ok: /[A-Za-z]/.test(password) && /\d/.test(password), label: "Letters and numbers (recommended)", soft: true },
    { ok: Boolean(password) && password === confirm, label: "Passwords match" },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-new`}>New password</Label>
        <div className="relative">
          <Input
            id={`${idPrefix}-new`}
            type={show ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => onPassword(e.target.value)}
            className="h-11 pr-12"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setShow((v) => !v)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-label={show ? "Hide passwords" : "Show passwords"}
            aria-pressed={show}
          >
            {show ? <EyeOff /> : <Eye />}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-confirm`}>Confirm password</Label>
        <Input
          id={`${idPrefix}-confirm`}
          type={show ? "text" : "password"}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => onConfirm(e.target.value)}
          className="h-11"
          required
        />
      </div>
      <ul className="space-y-1.5" aria-live="polite">
        {rules.map((rule) => {
          const Icon = rule.ok ? CheckCircle2 : CircleDashed;
          return (
            <li key={rule.label} className="flex items-center gap-2 text-xs">
              <Icon className={cn("h-3.5 w-3.5", rule.ok ? "text-success" : "text-muted-foreground")} aria-hidden />
              <span className={rule.ok ? "text-foreground" : "text-muted-foreground"}>
                {rule.label}
                <span className="sr-only">{rule.ok ? " — done" : " — not yet"}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function passwordsValid(password, confirm) {
  return password.length >= 8 && password === confirm;
}

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [error, setError] = React.useState(null);
  const [pending, startTransition] = React.useTransition();
  const valid = passwordsValid(password, confirm);

  function onSubmit(event) {
    event.preventDefault();
    if (!valid) {
      setError(password !== confirm ? "The passwords don't match." : "Use at least 8 characters.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await updatePassword({ password });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      toast.success("Password updated", { description: "You're all set — welcome back." });
      router.push("/admin");
    });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand/20 bg-brand/10 text-brand">
          <KeyRound className="h-5 w-5" aria-hidden />
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Choose a new password</h1>
        <p className="text-sm text-muted-foreground">Pick something strong that you don&apos;t use anywhere else.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <PasswordFields password={password} confirm={confirm} onPassword={setPassword} onConfirm={setConfirm} idPrefix="reset" />
        <Button type="submit" variant="brand" size="lg" className="w-full rounded-xl" disabled={pending || !valid}>
          {pending ? <Loader2 className="animate-spin" /> : <KeyRound />}
          {pending ? "Saving…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
