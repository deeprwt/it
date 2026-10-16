/**
 * Selected work.
 * ⚠ PLACEHOLDER CONTENT — these are sample project write-ups so the layout
 * has realistic data. Replace them with your real case studies (and real
 * numbers) before launch.
 */

export const work = [
  {
    slug: "fintech-onboarding",
    title: "Onboarding a neobank in under 4 minutes",
    client: "Fintech scale-up",
    industry: "Fintech",
    year: "2026",
    services: ["Product Design", "Web Engineering"],
    summary:
      "Rebuilt a 14-step KYC flow into a guided, mobile-first experience with live document capture and instant verification.",
    metrics: [
      { value: "-62%", label: "Drop-off" },
      { value: "3m 40s", label: "Avg. onboarding" },
    ],
    stack: ["Next.js", "TypeScript", "Supabase"],
    hue: 188,
    hue2: 258,
    featured: true,
  },
  {
    slug: "d2c-headless-store",
    title: "A headless storefront that loads in 0.7 seconds",
    client: "D2C apparel brand",
    industry: "Commerce",
    year: "2026",
    services: ["Commerce", "SEO & Growth"],
    summary:
      "Migrated a slow theme to a headless Shopify + Next.js storefront with edge rendering, instant search and a rebuilt PDP.",
    metrics: [
      { value: "+38%", label: "Conversion rate" },
      { value: "0.7s", label: "LCP (p75)" },
    ],
    stack: ["Shopify", "Hydrogen", "Algolia"],
    hue: 330,
    hue2: 20,
    featured: true,
  },
  {
    slug: "ai-support-agent",
    title: "An AI support agent trained on 4,000 help docs",
    client: "B2B SaaS platform",
    industry: "SaaS",
    year: "2025",
    services: ["AI & Automation"],
    summary:
      "Shipped a retrieval-augmented support agent inside the product, with guardrails, human handoff and a weekly evaluation suite.",
    metrics: [
      { value: "54%", label: "Tickets auto-resolved" },
      { value: "< 2s", label: "Median reply" },
    ],
    stack: ["Python", "pgvector", "Anthropic"],
    hue: 150,
    hue2: 200,
    featured: true,
  },
  {
    slug: "fitness-app",
    title: "A fitness app with 4.8★ across both stores",
    client: "Health & fitness startup",
    industry: "Health",
    year: "2025",
    services: ["Mobile Apps", "Product Design"],
    summary:
      "Designed and built a cross-platform training app with offline workouts, wearables sync and subscription billing.",
    metrics: [
      { value: "4.8★", label: "Store rating" },
      { value: "30%", label: "Trial → paid" },
    ],
    stack: ["React Native", "Expo", "RevenueCat"],
    hue: 40,
    hue2: 0,
    featured: true,
  },
  {
    slug: "logistics-dashboard",
    title: "Real-time ops dashboard for 1,200 trucks",
    client: "Logistics operator",
    industry: "Logistics",
    year: "2025",
    services: ["Web Engineering", "Product Design"],
    summary:
      "Replaced spreadsheets with a live fleet dashboard — map tracking, ETA predictions and exception alerts in one screen.",
    metrics: [
      { value: "11h", label: "Saved per week" },
      { value: "Real-time", label: "Fleet visibility" },
    ],
    stack: ["React", "Mapbox", "PostgreSQL"],
    hue: 210,
    hue2: 170,
    featured: false,
  },
  {
    slug: "edtech-seo",
    title: "Programmatic SEO for an edtech marketplace",
    client: "Edtech marketplace",
    industry: "Education",
    year: "2024",
    services: ["SEO & Growth", "Web Engineering"],
    summary:
      "Generated 9,000 high-quality course landing pages from structured data with schema markup and internal linking.",
    metrics: [
      { value: "5.2×", label: "Organic traffic" },
      { value: "9k", label: "Pages indexed" },
    ],
    stack: ["Next.js", "Search Console", "Looker"],
    hue: 275,
    hue2: 320,
    featured: false,
  },
];

export const industries = ["All", ...Array.from(new Set(work.map((w) => w.industry)))];
