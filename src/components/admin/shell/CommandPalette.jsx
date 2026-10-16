"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CornerDownLeft,
  ExternalLink,
  FolderPlus,
  Globe,
  KeyRound,
  LogOut,
  Moon,
  Plug,
  Plus,
  Search,
  SearchCheck,
  Share2,
  Upload,
  Users,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NAV_ITEMS } from "@/components/admin/shell/nav";
import { useAdminTheme } from "@/components/admin/AdminThemeProvider";
import { useSignOut } from "@/components/admin/shell/useSignOut";
import { cn } from "@/lib/utils";

function buildCommands({ isAdmin, toggleTheme, signOut }) {
  return [
    ...NAV_ITEMS.map((item) => ({
      id: `nav-${item.href}`,
      group: "Go to",
      label: item.name,
      icon: item.icon,
      href: item.href,
      keywords: item.keywords,
    })),
    { id: "new-post", group: "Create", label: "New blog post", icon: Plus, href: "/admin/posts/new", keywords: "write article" },
    { id: "new-category", group: "Create", label: "New category", icon: FolderPlus, href: "/admin/categories?new=1" },
    { id: "upload", group: "Create", label: "Upload media", icon: Upload, href: "/admin/media", keywords: "image file" },
    { id: "custom-seo", group: "Create", label: "Add custom SEO path", icon: SearchCheck, href: "/admin/seo?add=1" },
    { id: "set-general", group: "Settings", label: "General settings", icon: Settings2, href: "/admin/settings?tab=general" },
    { id: "set-seo", group: "Settings", label: "SEO defaults", icon: SearchCheck, href: "/admin/settings?tab=seo", keywords: "title template robots" },
    { id: "set-social", group: "Settings", label: "Social profiles", icon: Share2, href: "/admin/settings?tab=social" },
    { id: "set-integrations", group: "Settings", label: "Integrations", icon: Plug, href: "/admin/settings?tab=integrations", keywords: "analytics google bing verification" },
    ...(isAdmin
      ? [{ id: "set-team", group: "Settings", label: "Team & roles", icon: Users, href: "/admin/settings?tab=team" }]
      : []),
    { id: "set-account", group: "Settings", label: "Account & password", icon: KeyRound, href: "/admin/settings?tab=account" },
    { id: "theme", group: "Other", label: "Toggle light / dark mode", icon: Moon, action: toggleTheme, keywords: "theme appearance" },
    { id: "site", group: "Other", label: "View website", icon: Globe, href: "/", external: true },
    { id: "sign-out", group: "Other", label: "Sign out", icon: LogOut, action: signOut, keywords: "logout" },
  ];
}

export function CommandPalette({ open, onOpenChange, isAdmin = false }) {
  const router = useRouter();
  const { toggleTheme } = useAdminTheme();
  const [, signOut] = useSignOut();
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const listId = React.useId();
  const listRef = React.useRef(null);

  const commands = React.useMemo(() => buildCommands({ isAdmin, toggleTheme, signOut }), [isAdmin, toggleTheme, signOut]);

  const results = React.useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return commands;
    return commands.filter((c) => {
      const hay = `${c.label} ${c.group} ${c.keywords || ""}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [commands, query]);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);
  React.useEffect(() => setActive(0), [query]);

  React.useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function run(command) {
    if (!command) return;
    onOpenChange(false);
    if (command.action) command.action();
    else if (command.external) window.open(command.href, "_blank", "noopener,noreferrer");
    else router.push(command.href);
  }

  function onKeyDown(event) {
    if (!results.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(results.length - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(results[active]);
    }
  }

  const groups = [];
  results.forEach((command, index) => {
    let group = groups.find((g) => g.name === command.group);
    if (!group) groups.push((group = { name: command.group, items: [] }));
    group.items.push({ command, index });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[12vh] max-w-xl translate-y-0 gap-0 overflow-hidden p-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <DialogDescription className="sr-only">Search pages and actions. Use the arrow keys and Enter.</DialogDescription>
        <div className="flex items-center gap-2 border-b px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search pages, settings and actions…"
            className="h-14 border-0 bg-transparent px-0 text-[15px] focus-visible:ring-0"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-${results[active].id}` : undefined}
            autoFocus
          />
          <kbd className="hidden rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
            Esc
          </kbd>
        </div>

        <ScrollArea className="max-h-[min(60vh,420px)]" viewportClassName="max-h-[min(60vh,420px)]">
          <div ref={listRef} id={listId} role="listbox" aria-label="Commands" className="p-2">
            {results.length === 0 ? (
              <p className="px-3 py-10 text-center text-sm text-muted-foreground">No results for “{query}”.</p>
            ) : (
              groups.map((group) => (
                <div key={group.name} role="group" aria-label={group.name} className="mb-1 last:mb-0">
                  <p className="px-3 pb-1 pt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {group.name}
                  </p>
                  {group.items.map(({ command, index }) => {
                    const Icon = command.icon;
                    const selected = index === active;
                    return (
                      <Button
                        key={command.id}
                        id={`${listId}-${command.id}`}
                        type="button"
                        variant="ghost"
                        role="option"
                        aria-selected={selected}
                        tabIndex={-1}
                        data-index={index}
                        onMouseMove={() => setActive(index)}
                        onClick={() => run(command)}
                        className={cn(
                          "h-11 w-full justify-start gap-3 rounded-lg px-3 font-normal",
                          selected ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-transparent"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-md border transition-colors",
                            selected ? "border-brand/30 bg-brand/10 text-brand" : "bg-muted/60"
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="flex-1 truncate text-left text-sm">{command.label}</span>
                        {command.external && <ExternalLink className="text-muted-foreground" aria-hidden />}
                        {selected && <CornerDownLeft className="text-muted-foreground" aria-hidden />}
                      </Button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center gap-4 border-t bg-muted/30 px-4 py-2.5 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border bg-background px-1 font-mono">↑</kbd>
            <kbd className="rounded border bg-background px-1 font-mono">↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border bg-background px-1 font-mono">↵</kbd> open
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <kbd className="rounded border bg-background px-1 font-mono">⌘K</kbd> toggle
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
