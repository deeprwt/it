import { FileText, FolderTree, Images, Inbox, LayoutDashboard, SearchCheck, Settings2 } from "lucide-react";

export const NAV_ITEMS = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard, keywords: "home dashboard stats" },
  { name: "Blog Posts", href: "/admin/posts", icon: FileText, keywords: "articles blog write" },
  { name: "Categories", href: "/admin/categories", icon: FolderTree, keywords: "topics taxonomy" },
  { name: "Pages SEO", href: "/admin/seo", icon: SearchCheck, keywords: "meta titles descriptions sitemap" },
  { name: "Media", href: "/admin/media", icon: Images, keywords: "images uploads library" },
  { name: "Leads", href: "/admin/leads", icon: Inbox, keywords: "contacts inbox enquiries", badge: "leads" },
  { name: "Settings", href: "/admin/settings", icon: Settings2, keywords: "site config team account" },
];

export function isNavActive(pathname, href) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function displayName(profile) {
  return profile?.full_name?.trim() || profile?.email?.split("@")[0] || "there";
}
