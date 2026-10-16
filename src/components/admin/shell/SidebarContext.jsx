"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { SIDEBAR_KEY } from "@/components/admin/theme-constants";

const SidebarContext = React.createContext(null);

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider");
  return ctx;
}

/** expanded (desktop, persisted) · hovered (peek while collapsed) · mobileOpen (drawer). */
export function SidebarProvider({ children }) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      if (window.localStorage.getItem(SIDEBAR_KEY) === "collapsed") setIsExpanded(false);
    } catch {
      // ignore
    }
  }, []);

  // Close the drawer on navigation and when growing past the lg breakpoint.
  React.useEffect(() => setIsMobileOpen(false), [pathname]);
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setIsMobileOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  React.useEffect(() => {
    if (!isMobileOpen) return;
    const onKey = (e) => e.key === "Escape" && setIsMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileOpen]);

  const value = React.useMemo(
    () => ({
      isExpanded,
      isHovered,
      isMobileOpen,
      setIsHovered,
      toggleSidebar: () =>
        setIsExpanded((prev) => {
          const next = !prev;
          try {
            window.localStorage.setItem(SIDEBAR_KEY, next ? "expanded" : "collapsed");
          } catch {
            // ignore
          }
          if (next) setIsHovered(false);
          return next;
        }),
      toggleMobileSidebar: () => setIsMobileOpen((prev) => !prev),
      closeMobileSidebar: () => setIsMobileOpen(false),
    }),
    [isExpanded, isHovered, isMobileOpen]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}
