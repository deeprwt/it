"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink, Loader2, LogOut, PanelLeft, Search, Settings2, UserRound, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/admin/ThemeToggle";
import { useModKey } from "@/components/admin/hooks";
import { CommandPalette } from "@/components/admin/shell/CommandPalette";
import { useSidebar } from "@/components/admin/shell/SidebarContext";
import { UserAvatar } from "@/components/admin/shell/UserAvatar";
import { displayName } from "@/components/admin/shell/nav";
import { useSignOut } from "@/components/admin/shell/useSignOut";

export function AppHeader({ profile }) {
  const { isMobileOpen, isExpanded, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [signingOut, signOut] = useSignOut();
  const name = displayName(profile);

  useModKey("k", () => setPaletteOpen((v) => !v));

  function handleToggle() {
    if (window.matchMedia("(min-width: 1024px)").matches) toggleSidebar();
    else toggleMobileSidebar();
  }

  const toggleLabel = isMobileOpen ? "Close navigation" : isExpanded ? "Collapse sidebar" : "Expand sidebar";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-2 border-b bg-background/80 px-3 backdrop-blur-xl sm:gap-3 md:px-6">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            aria-label={toggleLabel}
            className="shrink-0 rounded-xl text-muted-foreground hover:text-foreground lg:border lg:border-border"
          >
            {isMobileOpen ? <X /> : <PanelLeft />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{toggleLabel}</TooltipContent>
      </Tooltip>

      <Link href="/admin" className="rounded-lg lg:hidden" aria-label="Dashboard home">
        <Logo className="h-10" />
      </Link>

      <Button
        type="button"
        variant="outline"
        onClick={() => setPaletteOpen(true)}
        className="hidden h-10 w-full max-w-[420px] justify-start gap-2 rounded-xl bg-muted/40 px-3 font-normal text-muted-foreground hover:text-foreground lg:flex"
      >
        <Search />
        <span className="flex-1 text-left">Search or jump to…</span>
        <kbd className="rounded-md border bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </Button>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl text-muted-foreground lg:hidden"
          onClick={() => setPaletteOpen(true)}
          aria-label="Search"
        >
          <Search />
        </Button>
        <Button asChild variant="outline" size="sm" className="hidden rounded-xl sm:inline-flex">
          <a href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink /> View site
          </a>
        </Button>
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 gap-2 rounded-xl px-1.5 sm:pr-2.5" aria-label="Account menu">
              <UserAvatar profile={profile} className="h-8 w-8" />
              <span className="hidden max-w-[8rem] truncate text-sm font-medium md:inline">{name.split(" ")[0]}</span>
              <ChevronDown className="hidden text-muted-foreground md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2">
            <DropdownMenuLabel className="flex items-center gap-3 font-normal">
              <UserAvatar profile={profile} className="h-10 w-10" dot dotRingClassName="ring-popover" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-foreground">{name}</span>
                <span className="block truncate text-xs text-muted-foreground">{profile?.email}</span>
                <span className="mt-1 inline-block rounded-full bg-brand/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand">
                  {profile?.role}
                </span>
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings?tab=account">
                <UserRound /> Account settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">
                <Settings2 /> Site settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setPaletteOpen(true)}>
              <Search /> Command palette <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                signOut();
              }}
              disabled={signingOut}
              className="text-destructive focus:text-destructive"
            >
              {signingOut ? <Loader2 className="animate-spin" /> : <LogOut />} Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} isAdmin={profile?.role === "admin"} />
    </header>
  );
}
