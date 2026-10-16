"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { KeyRound, Loader2, Save, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/admin/FormField";
import { SectionCard } from "@/components/admin/SectionCard";
import { PasswordFields, passwordsValid } from "@/components/admin/auth/ResetPasswordForm";
import { UserAvatar } from "@/components/admin/shell/UserAvatar";
import { updatePassword, updateProfile } from "@/lib/actions/auth";

export function AccountPanel({ profile, email }) {
  const router = useRouter();
  const [name, setName] = React.useState(profile?.full_name || "");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [savingName, startName] = React.useTransition();
  const [savingPassword, startPassword] = React.useTransition();
  const nameDirty = name.trim() !== (profile?.full_name || "");

  function saveName(event) {
    event.preventDefault();
    startName(async () => {
      const res = await updateProfile({ full_name: name });
      if (!res.ok) toast.error(res.error);
      else {
        toast.success("Display name updated");
        router.refresh();
      }
    });
  }

  function savePassword(event) {
    event.preventDefault();
    if (!passwordsValid(password, confirm)) {
      toast.error(password !== confirm ? "The passwords don't match." : "Use at least 8 characters.");
      return;
    }
    startPassword(async () => {
      const res = await updatePassword({ password });
      if (!res.ok) toast.error(res.error);
      else {
        toast.success("Password changed");
        setPassword("");
        setConfirm("");
      }
    });
  }

  return (
    <div className="space-y-6">
      <SectionCard title="Profile" description="How you appear across the dashboard" icon={UserRound}>
        <form onSubmit={saveName} className="space-y-5">
          <div className="flex items-center gap-4">
            <UserAvatar profile={{ ...profile, full_name: name || profile?.full_name }} className="h-14 w-14" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">{name || email}</p>
              <p className="truncate text-sm text-muted-foreground">{email}</p>
              <Badge variant="brand" className="mt-1 capitalize">
                {profile?.role}
              </Badge>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="full_name" label="Display name">
              <Input id="full_name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
            </FormField>
            <FormField id="account_email" label="Email" hint="Change your sign-in email in Supabase → Authentication.">
              <Input id="account_email" value={email} readOnly disabled />
            </FormField>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="brand" disabled={!nameDirty || savingName}>
              {savingName ? <Loader2 className="animate-spin" /> : <Save />} Save name
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Change password" description="You'll stay signed in on this device" icon={KeyRound}>
        <form onSubmit={savePassword} className="space-y-5">
          <div className="max-w-md">
            <PasswordFields password={password} confirm={confirm} onPassword={setPassword} onConfirm={setConfirm} idPrefix="account" />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="outline" disabled={!passwordsValid(password, confirm) || savingPassword}>
              {savingPassword ? <Loader2 className="animate-spin" /> : <KeyRound />} Update password
            </Button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
