import {
  Code2, PenTool, Smartphone, Sparkles, ShoppingBag, TrendingUp, Rocket, Gauge, Megaphone, Eye, Globe2, GraduationCap,
  Laptop, CalendarClock, GitBranch, HeartPulse, AppWindow, Layers, RefreshCcw, Zap, MousePointerClick, Search,
  ScanSearch, Frame, Palette, Component, Stamp, Wand2, Users, Gem, Handshake, Apple, Wrench, Fingerprint, CreditCard,
  BellRing, WifiOff, MapPin, MessagesSquare, Camera, Link2, ShieldCheck, Bot, BookOpenText, FileScan, Workflow,
  Headphones, Target, Settings2, Receipt, Lock, Store, Boxes, ShoppingCart, Repeat, Plug, ArrowRightLeft, BadgePercent,
  Expand, FileText, KeyRound, ClipboardCheck, ArrowUpWideNarrow, LineChart, BarChart3, Cpu, Landmark, Building2, Truck,
  Plane,
  Linkedin, Github, Twitter, Instagram, Dribbble, Youtube, Facebook,
} from "lucide-react";

/** Icon registry so data files can reference icons by name. */
export const icons = {
  Code2, PenTool, Smartphone, Sparkles, ShoppingBag, TrendingUp, Rocket, Gauge, Megaphone, Eye, Globe2, GraduationCap,
  Laptop, CalendarClock, GitBranch, HeartPulse, AppWindow, Layers, RefreshCcw, Zap, MousePointerClick, Search,
  ScanSearch, Frame, Palette, Component, Stamp, Wand2, Users, Gem, Handshake, Apple, Wrench, Fingerprint, CreditCard,
  BellRing, WifiOff, MapPin, MessagesSquare, Camera, Link2, ShieldCheck, Bot, BookOpenText, FileScan, Workflow,
  Headphones, Target, Settings2, Receipt, Lock, Store, Boxes, ShoppingCart, Repeat, Plug, ArrowRightLeft, BadgePercent,
  Expand, FileText, KeyRound, ClipboardCheck, ArrowUpWideNarrow, LineChart, BarChart3, Cpu, Landmark, Building2, Truck,
  Plane,
};

export const socialIcons = {
  linkedin: { icon: Linkedin, label: "LinkedIn" },
  github: { icon: Github, label: "GitHub" },
  x: { icon: Twitter, label: "X (Twitter)" },
  instagram: { icon: Instagram, label: "Instagram" },
  dribbble: { icon: Dribbble, label: "Dribbble" },
  youtube: { icon: Youtube, label: "YouTube" },
  facebook: { icon: Facebook, label: "Facebook" },
};

export function Icon({ name, ...props }) {
  const Cmp = icons[name] || Sparkles;
  return <Cmp {...props} />;
}
