import {
  Code2,
  PenTool,
  Smartphone,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Rocket,
  Gauge,
  Megaphone,
  Eye,
  Globe2,
  GraduationCap,
  Laptop,
  CalendarClock,
  GitBranch,
  HeartPulse,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Dribbble,
  Youtube,
  Facebook,
} from "lucide-react";

/** Icon registry so data files can reference icons by name. */
export const icons = {
  Code2,
  PenTool,
  Smartphone,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Rocket,
  Gauge,
  Megaphone,
  Eye,
  Globe2,
  GraduationCap,
  Laptop,
  CalendarClock,
  GitBranch,
  HeartPulse,
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
