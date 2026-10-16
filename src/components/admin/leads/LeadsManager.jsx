"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Briefcase,
  Building2,
  CalendarDays,
  Download,
  Globe,
  Inbox,
  Mail,
  Reply,
  Search,
  SearchX,
  Trash2,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { CopyButton } from "@/components/admin/CopyButton";
import { EmptyState } from "@/components/admin/EmptyState";
import { RelativeTime } from "@/components/admin/RelativeTime";
import { LEAD_STATUSES } from "@/components/admin/StatusBadge";
import { UserAvatar } from "@/components/admin/shell/UserAvatar";
import { deleteLead, updateLeadStatus } from "@/lib/actions/leads";
import { formatDate } from "@/lib/format";

const CSV_COLUMNS = ["name", "email", "company", "service", "budget", "status", "source", "message", "created_at"];

function downloadCsv(rows) {
  const escape = (v) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [CSV_COLUMNS.join(","), ...rows.map((r) => CSV_COLUMNS.map((c) => escape(r[c])).join(","))].join("\r\n");
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `snowdox-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function LeadStatusSelect({ value, onChange, disabled, className }) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={className} aria-label="Lead status">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LEAD_STATUSES.map((s) => {
          const Icon = s.icon;
          return (
            <SelectItem key={s.value} value={s.value}>
              <span className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden /> {s.label}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

function LeadDetails({ lead, onStatusChange, onDelete }) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  if (!lead) return null;

  const details = [
    { icon: Mail, label: "Email", value: lead.email, copy: lead.email },
    { icon: Building2, label: "Company", value: lead.company },
    { icon: Briefcase, label: "Service", value: lead.service },
    { icon: Wallet, label: "Budget", value: lead.budget },
    { icon: Globe, label: "Source", value: lead.source },
    { icon: CalendarDays, label: "Received", value: formatDate(lead.created_at, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) },
  ];
  const subject = encodeURIComponent(`Re: your project enquiry${lead.service ? ` — ${lead.service}` : ""}`);

  return (
    <>
      <SheetHeader className="pr-10">
        <div className="flex items-center gap-3">
          <UserAvatar profile={{ full_name: lead.name }} className="h-11 w-11" />
          <div className="min-w-0">
            <SheetTitle className="truncate">{lead.name}</SheetTitle>
            <SheetDescription className="truncate">{lead.company || lead.email}</SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Status</span>
        <LeadStatusSelect value={lead.status} onChange={(v) => onStatusChange(lead, v)} className="h-9 flex-1" />
      </div>

      <section aria-label="Message" className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Message</p>
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">{lead.message}</p>
      </section>

      <dl className="space-y-1">
        {details.map((d) => {
          const Icon = d.icon;
          return (
            <div key={d.label} className="flex items-center gap-3 rounded-lg px-1 py-2">
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <dt className="w-20 shrink-0 text-xs text-muted-foreground">{d.label}</dt>
              <dd className="min-w-0 flex-1 truncate text-sm text-foreground">{d.value || <span className="text-muted-foreground">—</span>}</dd>
              {d.copy && <CopyButton value={d.copy} iconOnly variant="ghost" label={`Copy ${d.label.toLowerCase()}`} />}
            </div>
          );
        })}
      </dl>

      <Separator />

      <SheetFooter className="flex-col gap-2 sm:flex-col">
        <Button asChild variant="brand" className="w-full">
          <a href={`mailto:${lead.email}?subject=${subject}`}>
            <Reply /> Reply by email
          </a>
        </Button>
        <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setConfirmOpen(true)}>
          <Trash2 /> Delete lead
        </Button>
      </SheetFooter>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this lead?"
        description={`${lead.name}'s enquiry will be permanently removed. Export to CSV first if you need a record.`}
        confirmLabel="Delete lead"
        onConfirm={() => onDelete(lead)}
      />
    </>
  );
}

export function LeadsManager({ leads, initialLeadId = null }) {
  const router = useRouter();
  const pathname = usePathname();
  const [overrides, setOverrides] = React.useState({});
  const [tab, setTab] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState(initialLeadId);
  const [sheetOpen, setSheetOpen] = React.useState(Boolean(initialLeadId));

  React.useEffect(() => {
    if (initialLeadId) router.replace(pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Server data wins once it catches up with an optimistic change.
  React.useEffect(() => setOverrides({}), [leads]);

  const rows = leads.map((l) => (overrides[l.id] ? { ...l, status: overrides[l.id] } : l));
  const counts = Object.fromEntries([["all", rows.length], ...LEAD_STATUSES.map((s) => [s.value, rows.filter((r) => r.status === s.value).length])]);
  const q = query.trim().toLowerCase();
  const filtered = rows.filter(
    (r) => (tab === "all" || r.status === tab) && (!q || `${r.name} ${r.email} ${r.company || ""} ${r.service || ""}`.toLowerCase().includes(q))
  );
  const selected = rows.find((r) => r.id === selectedId) || null;

  async function changeStatus(lead, status) {
    if (lead.status === status) return;
    const previous = lead.status;
    setOverrides((o) => ({ ...o, [lead.id]: status }));
    const res = await updateLeadStatus(lead.id, status);
    if (!res.ok) {
      setOverrides((o) => ({ ...o, [lead.id]: previous }));
      toast.error(res.error);
      return;
    }
    toast.success(`Marked as ${LEAD_STATUSES.find((s) => s.value === status)?.label.toLowerCase()}`);
    router.refresh();
  }

  async function removeLead(lead) {
    const res = await deleteLead(lead.id);
    if (!res.ok) {
      toast.error(res.error);
      return false;
    }
    toast.success("Lead deleted");
    setSheetOpen(false);
    router.refresh();
  }

  function open(lead) {
    setSelectedId(lead.id);
    setSheetOpen(true);
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="flex flex-col gap-3 border-b p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="no-scrollbar -mx-1 overflow-x-auto px-1">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="all">
                  All <span className="rounded bg-muted px-1.5 font-mono text-[10px] tabular-nums text-muted-foreground">{counts.all}</span>
                </TabsTrigger>
                {LEAD_STATUSES.map((s) => (
                  <TabsTrigger key={s.value} value={s.value}>
                    {s.label}
                    <span className="rounded bg-muted px-1.5 font-mono text-[10px] tabular-nums text-muted-foreground">{counts[s.value]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, company…" className="pl-9" aria-label="Search leads" />
            </div>
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={!filtered.length}
              onClick={() => {
                downloadCsv(filtered);
                toast.success(`Exported ${filtered.length} lead${filtered.length === 1 ? "" : "s"}`);
              }}
            >
              <Download /> Export CSV
            </Button>
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No leads yet"
            description="When visitors submit the contact form on your website, their enquiries land here."
          />
        ) : filtered.length === 0 ? (
          <EmptyState compact icon={SearchX} title="Nothing here" description="No leads match this status or search." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5">Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((lead) => (
                <TableRow key={lead.id} className="group cursor-pointer" onClick={() => open(lead)}>
                  <TableCell className="pl-5">
                    <div className="flex min-w-[14rem] items-center gap-3">
                      <UserAvatar profile={{ full_name: lead.name }} className="h-9 w-9" />
                      <div className="min-w-0">
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto p-0 text-sm font-semibold text-foreground group-hover:text-brand"
                          onClick={(e) => {
                            e.stopPropagation();
                            open(lead);
                          }}
                        >
                          {lead.name}
                          {lead.status === "new" && <span className="h-2 w-2 rounded-full bg-brand" aria-label="New" />}
                        </Button>
                        <p className="truncate text-xs text-muted-foreground">{lead.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{lead.company || "—"}</TableCell>
                  <TableCell className="max-w-[12rem] truncate text-muted-foreground">{lead.service || "—"}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{lead.budget || "—"}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <LeadStatusSelect value={lead.status} onChange={(v) => changeStatus(lead, v)} className="h-8 w-36 text-xs" />
                  </TableCell>
                  <TableCell className="whitespace-nowrap pr-5 text-xs text-muted-foreground">
                    <RelativeTime value={lead.created_at} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Sheet open={sheetOpen && Boolean(selected)} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full gap-5 overflow-y-auto p-6 sm:max-w-md">
          <LeadDetails lead={selected} onStatusChange={changeStatus} onDelete={removeLead} />
        </SheetContent>
      </Sheet>
    </>
  );
}

