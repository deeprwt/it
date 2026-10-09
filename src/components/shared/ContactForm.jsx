"use client";

import { useState } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const projectTypes = [
  "Website Design & Development",
  "Web / Mobile Application",
  "E-commerce Store",
  "AI Agent / Automation",
  "Digital Marketing & SEO",
  "UI/UX & Branding",
  "Something else",
];

/**
 * Accessible contact form. Client-side validated; on submit it simulates
 * an async send and shows a success state. Wire `onSubmit`/an API route
 * to a real backend when ready.
 */
export function ContactForm() {
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const [projectType, setProjectType] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    // Simulated submit — replace with a fetch to /api/contact
    await new Promise((r) => setTimeout(r, 1100));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center border border-accent/40 bg-accent/5 p-10 text-center">
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="font-display text-xl font-medium text-foreground">
          Thank you — message received.
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Our team will get back to you within one business day. For anything
          urgent, call us directly.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            setStatus("idle");
            setProjectType("");
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="firstName" label="First name" required>
          <Input id="firstName" name="firstName" placeholder="Jane" required autoComplete="given-name" />
        </Field>
        <Field id="lastName" label="Last name" required>
          <Input id="lastName" name="lastName" placeholder="Doe" required autoComplete="family-name" />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="email" label="Email" required>
          <Input id="email" name="email" type="email" placeholder="jane@company.com" required autoComplete="email" />
        </Field>
        <Field id="phone" label="Phone">
          <Input id="phone" name="phone" type="tel" placeholder="+91 00000 00000" autoComplete="tel" />
        </Field>
      </div>

      <Field id="projectType" label="Project type" required>
        <Select value={projectType} onValueChange={setProjectType} required>
          <SelectTrigger id="projectType" aria-label="Project type">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {projectTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field id="message" label="Project details" required>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="Tell us about your goals, timeline and budget…"
        />
      </Field>

      <Button
        type="submit"
        variant="accent"
        size="lg"
        className="w-full"
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send message
            <Send className="h-4 w-4" />
          </>
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        By submitting, you agree to be contacted about your enquiry. We never
        share your details.
      </p>
    </form>
  );
}

function Field({ id, label, required, children }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-accent">*</span>}
      </Label>
      {children}
    </div>
  );
}
