import { Settings2 } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getSettingsRow, listTeam } from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsView } from "@/components/admin/settings/SettingsView";
import { SETTINGS_TABS } from "@/components/admin/settings/tabs";

export const metadata = { title: "Settings" };

export default async function SettingsPage({ searchParams }) {
  const [params, row, { profile, user }] = await Promise.all([searchParams, getSettingsRow(), getSession()]);
  const isAdmin = profile?.role === "admin";
  const team = isAdmin ? await listTeam() : [];

  const requested = Array.isArray(params?.tab) ? params.tab[0] : params?.tab;
  const allowed = SETTINGS_TABS.filter((t) => isAdmin || t !== "team");
  const tab = allowed.includes(requested) ? requested : "general";

  return (
    <>
      <PageHeader
        title="Settings"
        description="Site identity, SEO defaults, integrations, team and your account."
        icon={Settings2}
        breadcrumbs={[{ label: "Settings" }]}
      />
      <SettingsView settings={row} team={team} profile={profile} email={user?.email || profile?.email || ""} isAdmin={isAdmin} initialTab={tab} />
    </>
  );
}
