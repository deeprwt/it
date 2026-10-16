"use client";

import { SidebarProvider, useSidebar } from "@/components/admin/shell/SidebarContext";
import { AppSidebar, Backdrop } from "@/components/admin/shell/AppSidebar";
import { AppHeader } from "@/components/admin/shell/AppHeader";
import { cn } from "@/lib/utils";

function ShellFrame({ profile, newLeads, children }) {
  const { isExpanded } = useSidebar();
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:shadow-elegant"
      >
        Skip to content
      </a>
      <AppSidebar profile={profile} newLeads={newLeads} />
      <Backdrop />
      {/* Hover-peek overlays the content instead of reflowing it. */}
      <div
        className={cn(
          "flex min-h-screen min-w-0 flex-col transition-[margin] duration-200 ease-out",
          isExpanded ? "lg:ml-[260px]" : "lg:ml-[84px]"
        )}
      >
        <AppHeader profile={profile} />
        <main id="admin-main" className="mx-auto w-full max-w-screen-2xl flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminShell({ profile, newLeads = 0, children }) {
  return (
    <SidebarProvider>
      <ShellFrame profile={profile} newLeads={newLeads}>
        {children}
      </ShellFrame>
    </SidebarProvider>
  );
}
