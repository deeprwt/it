"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Loader2, LogOut, MoreVertical, Plus, UserRound, X } from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "@/components/admin/shell/SidebarContext";
import { UserAvatar } from "@/components/admin/shell/UserAvatar";
import { NAV_ITEMS, displayName, isNavActive } from "@/components/admin/shell/nav";
import { useSignOut } from "@/components/admin/shell/useSignOut";
import { cn } from "@/lib/utils";

function NavTooltip({ show, label, children }) {
  if (!show) return children;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function AccountMenuItems({ onNavigate, signingOut, onSignOut }) {
  return (
    <>
      <DropdownMenuItem asChild>
        <a href="/" target="_blank" rel="noopener noreferrer">
          <ExternalLink /> View website
        </a>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/admin/settings?tab=account" onClick={onNavigate}>
          <UserRound /> Account settings
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          onSignOut();
        }}
        disabled={signingOut}
        className="text-destructive focus:text-destructive"
      >
        {signingOut ? <Loader2 className="animate-spin" /> : <LogOut />} Sign out
      </DropdownMenuItem>
    </>
  );
}

export function AppSidebar({ profile, newLeads = 0 }) {
  const pathname = usePathname();
  const { isExpanded, isHovered, isMobileOpen, setIsHovered, closeMobileSidebar } = useSidebar();
  const [signingOut, signOut] = useSignOut();
  const open = isExpanded || isHovered || isMobileOpen;
  const name = displayName(profile);
  const role = profile?.role || "viewer";

  const onNavigate = () => isMobileOpen && closeMobileSidebar();

  return (
    <aside
      aria-label="Dashboard navigation"
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar text-foreground transition-[width,transform,box-shadow] duration-200 ease-out",
        open ? "w-[260px]" : "w-[84px]",
        isMobileOpen ? "translate-x-0 shadow-elegant" : "-translate-x-full",
        "lg:translate-x-0",
        isHovered && !isExpanded && "lg:shadow-elegant"
      )}
    >
      {/* Brand */}
      <div className={cn("flex h-16 shrink-0 items-center gap-2 px-5", open ? "justify-between" : "lg:justify-center lg:px-0")}>
        <Link href="/admin" onClick={onNavigate} aria-label="Snowdox dashboard home" className="flex items-center rounded-lg">
          {open ? <Logo className="h-11" priority /> : <LogoMark className="h-9" />}
        </Link>
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={closeMobileSidebar}
          aria-label="Close navigation"
        >
          <X />
        </Button>
      </div>

      {/* Nav */}
      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 pb-4 pt-2">
        <p
          className={cn(
            "mb-2 px-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground",
            !open && "text-center"
          )}
        >
          {open ? "Menu" : "•••"}
        </p>
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(pathname, item.href);
            const count = item.badge === "leads" ? newLeads : 0;
            return (
              <li key={item.href}>
                <NavTooltip show={!open} label={count ? `${item.name} (${count} new)` : item.name}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    aria-label={!open ? item.name : undefined}
                    className={cn(
                      "group relative flex items-center rounded-xl outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-ring",
                      open ? "gap-3 px-3 py-2" : "mx-auto h-11 w-11 justify-center",
                      active
                        ? "bg-brand/10 text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-gradient"
                      />
                    )}
                    <span
                      className={cn(
                        "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-150",
                        active
                          ? "bg-brand-gradient text-brand-foreground shadow-glow"
                          : "bg-muted/70 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {!open && count > 0 && (
                        <span aria-hidden className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-sidebar" />
                      )}
                    </span>
                    {open && (
                      <>
                        <span className={cn("flex-1 truncate text-sm", active ? "font-semibold" : "font-medium")}>
                          {item.name}
                        </span>
                        {count > 0 && (
                          <Badge variant="brand" className="h-5 min-w-5 justify-center rounded-full px-1.5 tabular-nums">
                            {count > 99 ? "99+" : count}
                            <span className="sr-only"> new leads</span>
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                </NavTooltip>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* CTA */}
      <div className={cn("px-3 pb-3", !open && "flex justify-center")}>
        <NavTooltip show={!open} label="New post">
          <Button
            asChild
            variant="brand"
            className={cn("group rounded-xl font-semibold", open ? "h-10 w-full justify-start px-3" : "h-11 w-11 p-0")}
          >
            <Link href="/admin/posts/new" onClick={onNavigate} aria-label={!open ? "New post" : undefined}>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <Plus className="transition-transform duration-200 group-hover:rotate-90" />
              {open && <span>New post</span>}
            </Link>
          </Button>
        </NavTooltip>
      </div>

      {/* User card */}
      <div className={cn("border-t border-sidebar-border p-3", !open && "flex justify-center")}>
        {open ? (
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-2.5">
            <UserAvatar profile={profile} className="h-9 w-9" dot dotRingClassName="ring-sidebar" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{name}</p>
              <p className="truncate font-mono text-[10px] font-medium uppercase tracking-wider text-brand">{role}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="text-muted-foreground" aria-label="Account menu">
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" className="w-52">
                <AccountMenuItems onNavigate={onNavigate} signingOut={signingOut} onSignOut={signOut} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-11 w-11 rounded-full p-0" aria-label="Account menu">
                <UserAvatar profile={profile} className="h-9 w-9" dot dotRingClassName="ring-sidebar" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <p className="truncate text-sm font-semibold text-foreground">{name}</p>
                <p className="truncate text-xs text-muted-foreground">{profile?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <AccountMenuItems onNavigate={onNavigate} signingOut={signingOut} onSignOut={signOut} />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </aside>
  );
}

export function Backdrop() {
  const { isMobileOpen, closeMobileSidebar } = useSidebar();
  if (!isMobileOpen) return null;
  return (
    <div
      aria-hidden
      onClick={closeMobileSidebar}
      className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm animate-in fade-in-0 lg:hidden"
    />
  );
}
