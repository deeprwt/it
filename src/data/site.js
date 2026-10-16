/**
 * Code-level brand defaults. Anything here can be overridden from
 * Dashboard → Settings (stored in `site_settings`); these values are the
 * fallback when Supabase is not configured or a field is left blank.
 */

export const site = {
  name: "Snowdox",
  legalName: "Snowdox Studio",
  tagline: "We code brands that move.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  description:
    "Snowdox is a design & engineering agency building fast websites, digital products and AI-powered tools for brands that refuse to blend in.",
  titleTemplate: "%s | Snowdox",
  email: "hello@snowdox.com",
  phone: "",
  address: "Remote-first · Working worldwide",
  keywords: [
    "web development agency",
    "Next.js development",
    "UI UX design agency",
    "AI automation agency",
    "SEO agency",
    "Snowdox",
  ],
  socials: {
    linkedin: "https://www.linkedin.com/company/snowdox",
    github: "https://github.com/snowdox",
    x: "https://x.com/snowdox",
    instagram: "https://www.instagram.com/snowdox",
    dribbble: "",
  },
};

/** Placeholder numbers — replace with your real figures before launch. */
export const stats = [
  { value: 120, suffix: "+", label: "Products shipped" },
  { value: 98, suffix: "%", label: "Avg. Lighthouse score" },
  { value: 14, suffix: "", label: "Countries served" },
  { value: 0.8, suffix: "s", label: "Median LCP we ship", decimals: 1 },
];

export const stack = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Supabase",
  "PostgreSQL",
  "Tailwind CSS",
  "Figma",
  "React Native",
  "Flutter",
  "Python",
  "OpenAI",
  "Anthropic",
  "AWS",
  "Vercel",
  "Shopify",
  "Stripe",
  "Docker",
  "GraphQL",
  "Framer",
];

/** "How we work" — rendered as a git log. */
export const processSteps = [
  {
    hash: "a1f3c9e",
    command: "git commit -m \"discover\"",
    title: "Discover",
    body: "Workshops, audits and user interviews. We map the business goal to measurable outcomes before a single pixel moves.",
    duration: "Week 1",
  },
  {
    hash: "7be21d4",
    command: "git commit -m \"design\"",
    title: "Design",
    body: "Wireframes to high-fidelity systems in Figma. Clickable prototypes you can put in front of real users.",
    duration: "Weeks 2–3",
  },
  {
    hash: "c09e5aa",
    command: "git commit -m \"build\"",
    title: "Build",
    body: "Typed, tested, accessible code in weekly sprints. You get a live preview URL from day one — no black boxes.",
    duration: "Weeks 3–8",
  },
  {
    hash: "e44b7f0",
    command: "git push origin production",
    title: "Launch",
    body: "Performance budgets, SEO, analytics and monitoring wired in. Zero-downtime deploys, and we stay on call.",
    duration: "Launch day",
  },
  {
    hash: "f9d02c1",
    command: "git checkout -b growth",
    title: "Grow",
    body: "Experiments, content and iteration. We read the data with you and keep shipping what moves the numbers.",
    duration: "Ongoing",
  },
];

export const principles = [
  {
    title: "Ship, then polish",
    body: "Working software beats perfect decks. Every week you see something real.",
    icon: "Rocket",
  },
  {
    title: "Fast is a feature",
    body: "Sub-second loads, 95+ Lighthouse and Core Web Vitals in the green — by default.",
    icon: "Gauge",
  },
  {
    title: "Loud by design",
    body: "Safe is forgettable. We craft brands and interfaces people actually remember.",
    icon: "Megaphone",
  },
  {
    title: "No black boxes",
    body: "Shared Slack, open repos, live previews. You own every line we write.",
    icon: "Eye",
  },
];

export const faqs = [
  {
    q: "How much does a project with Snowdox cost?",
    a: "Every project is scoped individually — marketing sites are usually fixed-price, product builds are planned per sprint. After a free 30-minute call we send a clear proposal within 48 hours, with no surprise invoices.",
  },
  {
    q: "How long does it take to launch?",
    a: "A marketing site typically takes 4–6 weeks. MVPs and web apps usually take 8–12 weeks. You get a live preview link from the first week so you always know where things stand.",
  },
  {
    q: "Can you work with our existing team or codebase?",
    a: "Yes. We regularly plug into in-house teams, inherit legacy codebases and pair with your engineers. We start with a short code audit so we know exactly what we're working with.",
  },
  {
    q: "Will I be able to update the site myself?",
    a: "Always. We hand over a clean admin dashboard for blogs, pages and SEO — the same one this site runs on — plus documentation and a training session.",
  },
  {
    q: "Do you offer support after launch?",
    a: "We offer monthly care plans covering monitoring, security updates, performance tuning and a pool of hours for new features and experiments.",
  },
];
