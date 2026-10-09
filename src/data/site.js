/**
 * Global site configuration — brand, contact, offices, socials, stats.
 * Single source of truth so brand details can be swapped in one place.
 */

export const site = {
  name: "Ribbon IT",
  legalName: "Ribbon IT Pvt. Ltd.",
  tagline: "let's grow together",
  foundedYear: 2013,
  anniversaryYears: 13,
  url: "https://www.ribbonit.com",
  description:
    "Ribbon IT is an elite web development & digital experience company crafting result-oriented websites, apps, AI agents and marketing that drive infinite results.",
  email: "info@ribbonit.com",
  supportEmail: "support@ribbonit.com",
  careersEmail: "recruiter@ribbonit.com",
  phonePrimary: "+91 93533 70081",
  phoneSecondary: "+91 80887 49165",
  hours: "Mon – Sun · 08:30 – 20:30 IST",
};

export const announcement = {
  badge: "WEBOVERSE 13",
  text: "Celebrating 13 Years of Purpose, People & Progress",
  ctaLabel: "Watch Now",
  ctaHref: "/about",
};

export const offices = [
  {
    id: "bangalore",
    label: "Bangalore",
    flag: "🇮🇳",
    role: "Global Headquarters",
    address:
      "24, 2nd Floor, 5th Cross Rd, KHB Colony, 5th Block, Koramangala, Bengaluru, Karnataka 560095",
    phone: "+91 93533 70081",
    email: "info@ribbonit.com",
    maps: "https://g.page/ribbonit",
  },
  {
    id: "dubai",
    label: "Dubai",
    flag: "🇦🇪",
    role: "Middle East Office",
    address: "Prime Tower, 33rd Floor, Office #10, Business Bay, Dubai, UAE",
    phone: "+971 55 768 6795",
    email: "info@ribbonit.com",
    maps: "https://maps.app.goo.gl/rYbtkafoopz7FJxQ8",
  },
  {
    id: "toronto",
    label: "Toronto",
    flag: "🇨🇦",
    role: "North America Office",
    address: "1 King Street W, Suite 4800 - 203, Toronto, ON, M5H 1A1",
    phone: "+1 437-886-1554",
    email: "info@ribbonit.ca",
    maps: "https://maps.app.goo.gl/ncmfm1hkrxcSjsT26",
  },
];

export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/ribbonit-private-limited/", icon: "Linkedin" },
  { label: "Instagram", href: "https://www.instagram.com/ribbonit.official/", icon: "Instagram" },
  { label: "Facebook", href: "https://www.facebook.com/ribbonit/", icon: "Facebook" },
  { label: "Twitter", href: "https://twitter.com/ribbonit", icon: "Twitter" },
];

export const stats = [
  { value: 13, suffix: "+", label: "Years of Experience", detail: "Building since 2013" },
  { value: 2000, suffix: "+", label: "Websites Delivered", detail: "Across every industry" },
  { value: 500, suffix: "+", label: "Clients Worldwide", detail: "Startups to enterprises" },
  { value: 25, suffix: "+", label: "Countries Served", detail: "Global delivery footprint" },
];

export const ratings = [
  { platform: "Clutch", score: "4.9" },
  { platform: "GoodFirms", score: "4.9" },
  { platform: "Google", score: "4.8" },
  { platform: "Trustpilot", score: "4.9" },
  { platform: "Top Developers", score: "4.9" },
];

export const recognitions = [
  "Rated 4.9 on Clutch & GoodFirms",
  "Google Partner Agency",
  "Top Web Development Company — Bangalore",
  "180+ Verified Client Reviews",
];

/** Company facts for the "Company Information" block on the homepage. */
export const companyFacts = [
  { label: "Firm Name", value: "Ribbon IT Pvt. Ltd." },
  { label: "Established", value: "2013 · 13 Years Strong" },
  { label: "Headquarters", value: "Koramangala, Bengaluru, India" },
  { label: "Global Offices", value: "Bangalore · Dubai · Toronto" },
  { label: "Specialties", value: "Web · Apps · AI Agents · Marketing" },
  { label: "Engagement", value: "Project · Dedicated Team · Retainer" },
];
