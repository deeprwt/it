import { redirect } from "next/navigation";
import { requireUser, STAFF_ROLES } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AdminShell } from "@/components/admin/shell/AdminShell";
import { AccessPending } from "@/components/admin/auth/AccessPending";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
  if (!isSupabaseConfigured) redirect("/admin/setup");

  const { user, profile, supabase } = await requireUser();

  if (!profile || !STAFF_ROLES.includes(profile.role)) {
    return <AccessPending profile={profile} email={user.email} />;
  }

  const { count } = await supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new");

  return (
    <AdminShell profile={profile} newLeads={count || 0}>
      {children}
    </AdminShell>
  );
}
