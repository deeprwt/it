import { Inbox } from "lucide-react";
import { listLeads } from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/PageHeader";
import { LeadsManager } from "@/components/admin/leads/LeadsManager";

export const metadata = { title: "Leads" };

export default async function LeadsPage({ searchParams }) {
  const [params, leads] = await Promise.all([searchParams, listLeads()]);
  const initialLead = typeof params?.lead === "string" ? params.lead : null;

  return (
    <>
      <PageHeader
        title="Leads"
        description="Enquiries from the website contact form. Track each one from new to won."
        icon={Inbox}
        breadcrumbs={[{ label: "Leads" }]}
      />
      <LeadsManager leads={leads} initialLeadId={initialLead} />
    </>
  );
}
