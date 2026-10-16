"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Info, Loader2, Users } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/admin/EmptyState";
import { SectionCard } from "@/components/admin/SectionCard";
import { UserAvatar } from "@/components/admin/shell/UserAvatar";
import { updateMemberRole } from "@/lib/actions/settings";
import { formatDate } from "@/lib/format";

const ROLES = [
  { value: "admin", label: "Admin", hint: "Everything, including team management" },
  { value: "editor", label: "Editor", hint: "Posts, pages, SEO, media and leads" },
  { value: "viewer", label: "Viewer", hint: "Can sign in, no dashboard access" },
];

function RoleSelect({ member, isSelf }) {
  const router = useRouter();
  const [role, setRole] = React.useState(member.role);
  const [pending, startTransition] = React.useTransition();

  React.useEffect(() => setRole(member.role), [member.role]);

  function onChange(next) {
    const previous = role;
    setRole(next);
    startTransition(async () => {
      const res = await updateMemberRole(member.id, next);
      if (!res.ok) {
        setRole(previous);
        toast.error(res.error);
        return;
      }
      toast.success(`${member.full_name || member.email} is now ${next === "admin" ? "an" : "a"} ${next}`);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={role} onValueChange={onChange} disabled={isSelf || pending}>
        <SelectTrigger className="h-9 w-36" aria-label={`Role for ${member.full_name || member.email}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ROLES.map((r) => (
            <SelectItem key={r.value} value={r.value}>
              {r.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {pending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-label="Saving" />}
    </div>
  );
}

export function TeamPanel({ team, currentUserId }) {
  return (
    <div className="space-y-6">
      <Alert variant="brand">
        <Info className="h-4 w-4" />
        <AlertTitle>Inviting people</AlertTitle>
        <AlertDescription>
          Add people in Supabase → Authentication → Users; new accounts start as viewers. Promote them here to give dashboard
          access.
        </AlertDescription>
      </Alert>

      <SectionCard title="Team members" description={`${team.length} account${team.length === 1 ? "" : "s"}`} icon={Users} contentClassName="p-0">
        {team.length === 0 ? (
          <EmptyState compact icon={Users} title="No team members found" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="pr-5">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map((member) => {
                const isSelf = member.id === currentUserId;
                return (
                  <TableRow key={member.id}>
                    <TableCell className="pl-5">
                      <div className="flex min-w-[14rem] items-center gap-3">
                        <UserAvatar profile={member} className="h-9 w-9" />
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 truncate font-medium text-foreground">
                            {member.full_name || member.email?.split("@")[0]}
                            {isSelf && <Badge variant="brand">You</Badge>}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RoleSelect member={member} isSelf={isSelf} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap pr-5 text-xs text-muted-foreground">{formatDate(member.created_at)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </SectionCard>

      <ul className="grid gap-3 sm:grid-cols-3">
        {ROLES.map((r) => (
          <li key={r.value} className="rounded-xl border bg-card p-4">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-brand">{r.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{r.hint}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
