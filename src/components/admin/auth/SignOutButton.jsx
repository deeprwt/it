"use client";

import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSignOut } from "@/components/admin/shell/useSignOut";

export function SignOutButton({ variant = "outline", className, children = "Sign out" }) {
  const [pending, signOut] = useSignOut();
  return (
    <Button variant={variant} onClick={signOut} disabled={pending} className={className}>
      {pending ? <Loader2 className="animate-spin" /> : <LogOut />}
      {children}
    </Button>
  );
}
