"use client";

import { useState, useTransition } from "react";
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { submitLead } from "@/lib/actions/leads";
import { services } from "@/data/services";

const BUDGETS = ["< $10k", "$10k – 25k", "$25k – 50k", "$50k – 100k", "$100k+", "Not sure yet"];

const EMPTY = { name: "", email: "", company: "", service: "", budget: "", message: "", website: "" };

export function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e?.target ? e.target.value : e }));

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await submitLead({ ...form, source: typeof window !== "undefined" ? window.location.pathname : "" });
      if (res.ok) {
        setSent(true);
        setForm(EMPTY);
      } else {
        setError(res.error);
      }
    });
  };

  if (sent) {
    return (
      <div className="flex min-h-[520px] flex-col justify-center rounded-2xl border border-white/10 bg-card/60 p-8 font-mono text-sm md:p-12">
        <CheckCircle2 className="h-10 w-10 text-success" />
        <p className="mt-6">
          <span className="text-success">➜</span> <span className="text-brand">~/snowdox</span> send --message
        </p>
        <p className="mt-2 text-success">✓ message delivered</p>
        <p className="text-muted-foreground">✓ a human has been notified</p>
        <p className="text-muted-foreground">✓ reply ETA: &lt; 1 business day</p>
        <h3 className="mt-8 font-display text-3xl font-bold tracking-tight">Thanks — we&apos;re on it.</h3>
        <p className="mt-3 font-sans text-base text-muted-foreground">
          Keep an eye on your inbox. In the meantime, feel free to browse our work or read the blog.
        </p>
        <Button variant="outline" className="mt-8 w-fit rounded-full font-sans" onClick={() => setSent(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-7 rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur md:p-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="name">Your name *</Label>
          <Input id="name" required autoComplete="name" value={form.name} onChange={set("name")} placeholder="Ada Lovelace" className="h-12" />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="email">Work email *</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={set("email")}
            placeholder="ada@company.com"
            className="h-12"
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="company">Company</Label>
          <Input id="company" autoComplete="organization" value={form.company} onChange={set("company")} placeholder="Company Inc." className="h-12" />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="service">What do you need?</Label>
          <Select value={form.service} onValueChange={set("service")}>
            <SelectTrigger id="service" className="h-12">
              <SelectValue placeholder="Pick a service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((s) => (
                <SelectItem key={s.slug} value={s.title}>
                  {s.title}
                </SelectItem>
              ))}
              <SelectItem value="Something else">Something else</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Budget range</Label>
        <ToggleGroup type="single" value={form.budget} onValueChange={set("budget")} className="justify-start gap-2">
          {BUDGETS.map((b) => (
            <ToggleGroupItem
              key={b}
              value={b}
              className="h-9 rounded-full border border-white/10 px-4 font-mono text-xs data-[state=on]:border-brand data-[state=on]:bg-brand data-[state=on]:text-brand-foreground"
            >
              {b}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="message">Tell us about the project *</Label>
        <Textarea
          id="message"
          required
          rows={6}
          value={form.message}
          onChange={set("message")}
          placeholder="Goals, timeline, links — anything that helps us understand what success looks like."
          className="min-h-[150px]"
        />
      </div>

      {/* Honeypot — hidden from people, irresistible to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <Label htmlFor="website">Website</Label>
        <Input id="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-foreground">{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">We reply within one business day. No spam, ever.</p>
        <Button type="submit" variant="brand" size="lg" disabled={pending} className="group rounded-full">
          {pending ? <Loader2 className="animate-spin" /> : null}
          {pending ? "Sending…" : "Send message"}
          {!pending && <ArrowUpRight className="transition-transform duration-300 group-hover:rotate-45" />}
        </Button>
      </div>
    </form>
  );
}
