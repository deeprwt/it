/**
 * Service catalogue. Page copy lives here; each page's SEO (title,
 * description, OG image…) is managed from Dashboard → Pages SEO.
 */

export const services = [
  {
    slug: "web-development",
    index: "01",
    icon: "Code2",
    title: "Web Engineering",
    short: "Blazing-fast marketing sites and web apps on Next.js, built to rank and convert.",
    tagline: "Websites that load before your competitors finish blinking.",
    description:
      "We engineer high-performance websites and web applications on modern stacks — server-rendered, edge-deployed, accessible and SEO-ready out of the box. Every build ships with a headless CMS your team can actually use.",
    tags: ["Next.js", "React", "Headless CMS", "Edge"],
    deliverables: [
      "Marketing websites & landing pages",
      "Web apps, portals & dashboards",
      "Headless CMS (Supabase, Sanity, Contentful)",
      "Core Web Vitals & performance tuning",
      "Accessibility (WCAG 2.2 AA)",
      "Analytics, tracking & A/B testing setup",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Vercel"],
    filename: "app/page.tsx",
    code: `export const revalidate = 60;

export default async function Home() {
  const posts = await cms.posts.latest(3);

  return (
    <Hero title="Fast by default." />
    <Posts items={posts} />
  );
}`,
    faqs: [
      {
        q: "Which tech stack do you use for websites?",
        a: "Our default is Next.js + React + TypeScript with Tailwind CSS, deployed on Vercel or AWS. For content we pair it with a headless CMS so your team can edit without a developer.",
      },
      {
        q: "Will my website be SEO friendly?",
        a: "Yes — semantic markup, server rendering, structured data, sitemaps, fast Core Web Vitals and per-page meta controls are part of every build.",
      },
      {
        q: "Can you redesign or migrate an existing site?",
        a: "Absolutely. We audit what you have, preserve your URLs and rankings with proper redirects, and migrate content without losing SEO equity.",
      },
    ],
  },
  {
    slug: "product-design",
    index: "02",
    icon: "PenTool",
    title: "Product Design",
    short: "UI/UX, design systems and brand identities that make people stop scrolling.",
    tagline: "Interfaces people remember — and actually enjoy using.",
    description:
      "From research and wireframes to pixel-perfect design systems, we design digital products that feel effortless. We prototype early, test with real users and hand over Figma files engineers love.",
    tags: ["UI/UX", "Design Systems", "Branding", "Prototyping"],
    deliverables: [
      "UX research & usability testing",
      "Wireframes & interactive prototypes",
      "High-fidelity UI design",
      "Design systems & component libraries",
      "Brand identity & visual language",
      "Motion & micro-interaction design",
    ],
    stack: ["Figma", "FigJam", "Framer", "Rive", "Lottie", "Storybook"],
    filename: "tokens/brand.json",
    code: `{
  "color": {
    "snow":  { "value": "#F4F7FA" },
    "frost": { "value": "#0AE4FF" },
    "night": { "value": "#06070A" }
  },
  "radius": { "card": "12px" },
  "motion": { "ease": "cubic-bezier(.2,.8,.2,1)" }
}`,
    faqs: [
      {
        q: "Do you only design, or also build?",
        a: "Both. Our designers and engineers work in the same sprint, so what gets designed is what gets shipped — no lost-in-translation handoffs.",
      },
      {
        q: "What do we receive at the end?",
        a: "Organised Figma files, a documented design system, exported assets and, if we build it, a coded component library that mirrors the design.",
      },
      {
        q: "Can you work within our existing brand?",
        a: "Yes. We can extend your current guidelines or evolve them — we'll recommend the right level of change after the discovery phase.",
      },
    ],
  },
  {
    slug: "mobile-apps",
    index: "03",
    icon: "Smartphone",
    title: "Mobile Apps",
    short: "Cross-platform iOS & Android apps with native feel and one shared codebase.",
    tagline: "One codebase. Two stores. Zero compromises.",
    description:
      "We build polished iOS and Android apps with React Native and Flutter — offline-ready, buttery smooth at 60fps and wired to the backend, payments and analytics you need to grow.",
    tags: ["React Native", "Flutter", "iOS", "Android"],
    deliverables: [
      "iOS & Android apps",
      "MVPs for startups",
      "Offline-first & real-time sync",
      "Push notifications & deep links",
      "In-app payments & subscriptions",
      "App Store & Play Store launch",
    ],
    stack: ["React Native", "Expo", "Flutter", "Swift", "Kotlin", "Firebase"],
    filename: "app/(tabs)/index.tsx",
    code: `export default function Feed() {
  const { data, refetch } = useFeed();

  return (
    <FlashList
      data={data}
      onRefresh={refetch}
      renderItem={({ item }) => <Card {...item} />}
    />
  );
}`,
    faqs: [
      {
        q: "React Native or Flutter — which should we choose?",
        a: "Both are excellent. We usually recommend React Native when you also have a React web app (shared code and team), and Flutter for highly custom, animation-heavy UIs.",
      },
      {
        q: "Do you handle the App Store submission?",
        a: "Yes — store listings, screenshots, review guidelines, TestFlight and Play Console setup are all part of our launch checklist.",
      },
      {
        q: "Can you take over an existing app?",
        a: "We can. We start with a technical audit, stabilise crashes and performance, then roadmap new features with you.",
      },
    ],
  },
  {
    slug: "ai-automation",
    index: "04",
    icon: "Sparkles",
    title: "AI & Automation",
    short: "LLM copilots, AI agents and workflow automation that save real hours.",
    tagline: "Put your busywork on autopilot.",
    description:
      "We design and ship practical AI — support agents trained on your docs, internal copilots, document processing and automated workflows — with guardrails, evaluations and clear ROI.",
    tags: ["LLMs", "AI Agents", "RAG", "Automation"],
    deliverables: [
      "AI chat & support agents",
      "Retrieval-augmented search (RAG)",
      "Document & data extraction",
      "Workflow automation (n8n, Zapier, custom)",
      "LLM evaluation & guardrails",
      "AI features inside your product",
    ],
    stack: ["Python", "TypeScript", "OpenAI", "Anthropic", "pgvector", "LangGraph"],
    filename: "agents/support.ts",
    code: `const agent = createAgent({
  model: "claude-sonnet",
  tools: [searchDocs, createTicket, refund],
  guardrails: [pii.redact, policy.check],
});

const reply = await agent.run(message);
// → escalates to a human when unsure`,
    faqs: [
      {
        q: "Is our data safe with AI tools?",
        a: "We use enterprise APIs with zero data retention, redact sensitive fields and can deploy models in your own cloud when compliance demands it.",
      },
      {
        q: "How do you measure whether the AI works?",
        a: "Every AI feature ships with an evaluation suite — accuracy, latency, cost per task and human review — so improvements are measured, not guessed.",
      },
      {
        q: "Can AI integrate with our existing tools?",
        a: "Yes. We connect agents to your CRM, helpdesk, database, Slack and internal APIs so they can actually take action, not just chat.",
      },
    ],
  },
  {
    slug: "ecommerce",
    index: "05",
    icon: "ShoppingBag",
    title: "Commerce",
    short: "Shopify and headless storefronts engineered for conversion and speed.",
    tagline: "Storefronts that sell while you sleep.",
    description:
      "We build Shopify, Shopify Plus and headless commerce experiences that load instantly, look stunning and convert — with subscriptions, personalisation and integrations that scale with you.",
    tags: ["Shopify", "Headless", "Stripe", "CRO"],
    deliverables: [
      "Shopify & Shopify Plus stores",
      "Headless storefronts (Hydrogen / Next.js)",
      "Custom checkout & subscriptions",
      "ERP, PIM & inventory integrations",
      "Conversion rate optimisation",
      "Store migrations",
    ],
    stack: ["Shopify", "Hydrogen", "Next.js", "Stripe", "Klaviyo", "Algolia"],
    filename: "lib/cart.ts",
    code: `export async function addToCart(variantId: string) {
  const cart = await shopify.cart.add({
    lines: [{ merchandiseId: variantId, quantity: 1 }],
  });

  track("add_to_cart", { value: cart.cost.total });
  return cart;
}`,
    faqs: [
      {
        q: "Should we go headless?",
        a: "Headless makes sense when you need custom experiences, multiple storefronts or extreme performance. For many brands a well-built Shopify theme is the faster, cheaper win — we'll tell you honestly.",
      },
      {
        q: "Can you migrate us from WooCommerce or Magento?",
        a: "Yes — products, customers, orders and SEO redirects are migrated with zero-downtime cutover.",
      },
      {
        q: "Do you help after launch with sales?",
        a: "Our growth team runs CRO experiments, email flows and performance marketing to keep revenue climbing.",
      },
    ],
  },
  {
    slug: "seo-growth",
    index: "06",
    icon: "TrendingUp",
    title: "SEO & Growth",
    short: "Technical SEO, content engines and CRO that compound month after month.",
    tagline: "Get found. Get clicked. Get chosen.",
    description:
      "We fix the technical foundations, build content that ranks and run experiments that turn traffic into revenue. Clear reporting, no vanity metrics — just growth you can see in the numbers.",
    tags: ["Technical SEO", "Content", "CRO", "Analytics"],
    deliverables: [
      "Technical SEO audits & fixes",
      "Keyword research & content strategy",
      "On-page optimisation & schema markup",
      "Programmatic SEO",
      "Conversion rate optimisation",
      "GA4, Search Console & Looker dashboards",
    ],
    stack: ["Search Console", "GA4", "Ahrefs", "Semrush", "Looker Studio", "Hotjar"],
    filename: "seo/metadata.ts",
    code: `export async function generateMetadata({ params }) {
  const page = await seo.forPath(params.slug);

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    openGraph: { images: [page.ogImage] },
  };
}`,
    faqs: [
      {
        q: "How long does SEO take to show results?",
        a: "Technical fixes can move rankings within weeks; content-led growth typically compounds over 3–6 months. We report progress monthly so you can see the trend early.",
      },
      {
        q: "Do you guarantee first-page rankings?",
        a: "No honest agency can. What we guarantee is a transparent process, best-practice execution and reporting tied to traffic, leads and revenue.",
      },
      {
        q: "Can we manage SEO ourselves after you set it up?",
        a: "Yes — the dashboard we build lets your team edit meta titles, descriptions, keywords and social images for every page and blog post.",
      },
    ],
  },
];

export const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));
export const serviceSlugs = services.map((s) => s.slug);
