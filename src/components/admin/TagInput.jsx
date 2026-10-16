"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Chips input. Enter, comma or Tab adds; Backspace on empty removes the last;
 * pasting "a, b, c" adds several. Case-insensitive de-duplication; `max` caps the list.
 * @param {{ id?: string, value: string[], onChange: (next: string[]) => void, placeholder?: string, max?: number, maxLength?: number, className?: string, "aria-describedby"?: string }} props
 */
export function TagInput({ id, value = [], onChange, placeholder = "Type and press Enter", max = 25, maxLength = 80, className, ...rest }) {
  const [draft, setDraft] = React.useState("");
  const inputRef = React.useRef(null);
  const tags = Array.isArray(value) ? value : [];
  const full = tags.length >= max;

  const add = React.useCallback(
    (raw) => {
      const incoming = (Array.isArray(raw) ? raw : [raw])
        .map((t) => String(t || "").trim().replace(/\s+/g, " ").slice(0, maxLength))
        .filter(Boolean);
      if (!incoming.length) return;
      const seen = new Set(tags.map((t) => t.toLowerCase()));
      const next = [...tags];
      for (const tag of incoming) {
        if (next.length >= max) break;
        const key = tag.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        next.push(tag);
      }
      if (next.length !== tags.length) onChange(next);
    },
    [tags, max, maxLength, onChange]
  );

  const remove = (index) => onChange(tags.filter((_, i) => i !== index));

  function commitDraft() {
    if (!draft.trim()) return false;
    add(draft.split(","));
    setDraft("");
    return true;
  }

  function onKeyDown(event) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitDraft();
    } else if (event.key === "Tab") {
      if (commitDraft()) event.preventDefault();
    } else if (event.key === "Backspace" && !draft && tags.length) {
      event.preventDefault();
      remove(tags.length - 1);
    }
  }

  function onPaste(event) {
    const text = event.clipboardData.getData("text");
    if (/[,\n]/.test(text)) {
      event.preventDefault();
      add((draft + text).split(/[,\n]/));
      setDraft("");
    }
  }

  return (
    <div
      className={cn(
        "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-lg border border-input bg-transparent px-2 py-1.5 transition-colors focus-within:border-brand/70 focus-within:ring-2 focus-within:ring-brand/20",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag, i) => (
        <Badge key={`${tag}-${i}`} variant="secondary" className="h-7 gap-1 rounded-md pl-2 pr-1 text-xs font-medium">
          <span className="max-w-[14rem] truncate">{tag}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-5 w-5 rounded text-muted-foreground hover:bg-background hover:text-foreground [&_svg]:size-3"
            onClick={(e) => {
              e.stopPropagation();
              remove(i);
            }}
            aria-label={`Remove ${tag}`}
          >
            <X />
          </Button>
        </Badge>
      ))}
      <Input
        ref={inputRef}
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onBlur={commitDraft}
        disabled={full}
        placeholder={full ? `Limit of ${max} reached` : tags.length ? "Add more…" : placeholder}
        className="h-7 min-w-[8rem] flex-1 border-0 bg-transparent px-1.5 py-0 shadow-none focus-visible:ring-0 disabled:opacity-60"
        {...rest}
      />
      <span className="ml-auto pr-1 font-mono text-[10px] tabular-nums text-muted-foreground" aria-hidden>
        {tags.length}/{max}
      </span>
    </div>
  );
}
