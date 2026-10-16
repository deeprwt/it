/**
 * Service catalogue. Each service has its OWN page design
 * (components/site/services/pages/*) — this file holds the copy.
 * Page SEO (title, description, OG image…) is managed from Dashboard → Pages SEO.
 */

export const industries = [
  { name: "SaaS & Tech", icon: "Cpu" },
  { name: "Fintech", icon: "Landmark" },
  { name: "E-commerce & D2C", icon: "ShoppingBag" },
  { name: "Healthcare", icon: "HeartPulse" },
  { name: "Education", icon: "GraduationCap" },
  { name: "Real Estate", icon: "Building2" },
  { name: "Logistics", icon: "Truck" },
  { name: "Hospitality & Travel", icon: "Plane" },
];

export const services = [
  /* ─────────────────────────── WEB ─────────────────────────── */
  {
    slug: "web-development",
    index: "01",
    icon: "Code2",
    title: "Web Development",
    short: "Blazing-fast marketing sites and web apps on Next.js, built to rank and convert.",
    tagline: "Websites engineered to load fast, rank high and convert.",
    description:
      "We design and build high-performance websites and web applications on modern stacks — server-rendered, accessible, SEO-ready and powered by a CMS your team will actually enjoy using.",
    tags: ["Next.js", "React", "Headless CMS", "Web Apps"],
    credentials: ["Free website audit", "Fixed-price proposals", "Core Web Vitals in the green", "30 days of free support"],
    subServicesTitle: "Our website development services",
    subServices: [
      {
        icon: "Code2",
        title: "Custom website development",
        body: "Bespoke marketing websites built from scratch around your brand, content and conversion goals.",
        points: ["Pixel-perfect, responsive builds", "Server rendering & edge delivery", "Accessible to WCAG 2.2 AA"],
      },
      {
        icon: "AppWindow",
        title: "Web application development",
        body: "Dashboards, portals and SaaS products with secure auth, real-time data and clean architecture.",
        points: ["React / Next.js front-ends", "Node.js & Python APIs", "Role-based access & audit logs"],
      },
      {
        icon: "Layers",
        title: "Headless CMS development",
        body: "Edit pages, blogs and SEO yourself — without breaking the design or waiting on a developer.",
        points: ["Supabase, Sanity, Strapi, Contentful", "Visual previews & scheduling", "SEO fields on every page"],
      },
      {
        icon: "Rocket",
        title: "Landing pages that convert",
        body: "Campaign pages designed for one job: turning paid and organic traffic into leads and sales.",
        points: ["A/B-test ready layouts", "Sub-second load times", "Analytics & pixel setup"],
      },
      {
        icon: "RefreshCcw",
        title: "Website redesign & migration",
        body: "Move off a slow or outdated platform without losing rankings, content or customers.",
        points: ["Content & URL mapping", "301 redirects preserved", "Zero-downtime cutover"],
      },
      {
        icon: "Gauge",
        title: "Performance & Core Web Vitals",
        body: "We audit, profile and fix slow sites so they pass Core Web Vitals and feel instant.",
        points: ["LCP, INP & CLS fixes", "Image & font optimisation", "JavaScript diet plans"],
      },
    ],
    pillars: [
      { icon: "Zap", title: "Speed", body: "Pages that render in under a second keep visitors engaged and lift every downstream metric." },
      { icon: "MousePointerClick", title: "Conversion", body: "Clear hierarchy, persuasive copy blocks and frictionless forms that turn visits into pipeline." },
      { icon: "Search", title: "Search visibility", body: "Semantic HTML, structured data and per-page SEO controls baked in from the first commit." },
    ],
    budget: [
      { metric: "LCP", target: "< 1.2s", label: "Largest Contentful Paint", value: 92 },
      { metric: "INP", target: "< 200ms", label: "Interaction to Next Paint", value: 88 },
      { metric: "CLS", target: "< 0.05", label: "Cumulative Layout Shift", value: 96 },
      { metric: "JS", target: "< 170 KB", label: "Critical-path JavaScript", value: 80 },
    ],
    process: [
      { title: "Discovery & audit", body: "Goals, audience, competitors and a technical audit of what you have today." },
      { title: "Sitemap & wireframes", body: "Information architecture and low-fi layouts that map every page to a goal." },
      { title: "Visual design", body: "High-fidelity designs for desktop and mobile, approved before we write code." },
      { title: "Development", body: "Weekly sprints with a live preview URL, CMS setup and content migration." },
      { title: "QA & launch", body: "Cross-browser testing, performance budgets, SEO checks and a zero-downtime launch." },
      { title: "Care & growth", body: "Monitoring, updates and a backlog of improvements based on real data." },
    ],
    comparison: [
      ["Custom design (no templates)", true, false],
      ["Sub-second page loads", true, false],
      ["SEO controls for every page", true, "Limited"],
      ["CMS your team can edit safely", true, true],
      ["Live preview from week one", true, false],
      ["You own the code & accounts", true, "Sometimes"],
      ["Post-launch support", "30 days free", "Paid"],
    ],
    tools: [
      { label: "Frontend", items: ["nextjs", "react", "typescript", "tailwind", "vue", "threejs", "gsap"] },
      { label: "Backend", items: ["nodejs", "nestjs", "python", "fastapi", "graphql", "prisma", "laravel"] },
      { label: "CMS", items: ["supabase", "wordpress", "strapi", "sanity", "contentful", "webflow"] },
      { label: "Cloud & DevOps", items: ["vercel", "cloudflare", "aws", "googlecloud", "docker", "githubactions"] },
      { label: "Quality", items: ["lighthouse", "pagespeed", "sentry", "cypress", "ga4", "gtm"] },
    ],
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
        q: "Which technology do you use to build websites?",
        a: "Our default stack is Next.js, React and TypeScript with Tailwind CSS, deployed on Vercel or AWS and paired with a headless CMS. For simpler needs we also build on WordPress or Webflow — we recommend whatever fits your team best.",
      },
      {
        q: "How long does it take to build a website?",
        a: "A marketing website typically takes 4–6 weeks from kickoff to launch. Larger sites and web applications take 8–12 weeks or more, delivered in weekly sprints with a live preview link.",
      },
      {
        q: "Will my website be SEO friendly?",
        a: "Yes. Every build ships with semantic markup, server rendering, structured data, an XML sitemap, fast Core Web Vitals and editable meta titles, descriptions and social images for every page.",
      },
      {
        q: "Can I update the website myself after launch?",
        a: "Absolutely. You get an admin dashboard to edit pages, publish blog posts and manage SEO, plus a recorded training session and documentation.",
      },
      {
        q: "Do you redesign existing websites?",
        a: "Yes — we audit your current site, keep what works, map every URL with proper 301 redirects and migrate content so you keep your rankings.",
      },
    ],
  },

  /* ────────────────────────── DESIGN ────────────────────────── */
  {
    slug: "product-design",
    index: "02",
    icon: "PenTool",
    title: "UI/UX & Product Design",
    short: "UI/UX, design systems and brand identities that make people stop scrolling.",
    tagline: "Design that people feel before they read a word.",
    description:
      "From research and wireframes to pixel-perfect interfaces and complete brand systems, we design digital products that feel effortless — and we test them with real users before a line of code is written.",
    tags: ["UI/UX", "Design Systems", "Branding", "Prototyping"],
    credentials: ["UX audit in week one", "Clickable prototypes", "Tested with real users", "Dev-ready Figma files"],
    subServicesTitle: "Our design services",
    subServices: [
      {
        icon: "ScanSearch",
        title: "UX research & strategy",
        body: "Interviews, analytics and competitor teardown to understand what your users actually need.",
        points: ["User interviews & surveys", "Journey & opportunity maps", "Heuristic UX audits"],
      },
      {
        icon: "Frame",
        title: "Wireframes & prototyping",
        body: "Low-fi flows that become clickable prototypes you can put in front of customers in days.",
        points: ["User flows & sitemaps", "Interactive Figma prototypes", "Usability testing rounds"],
      },
      {
        icon: "Palette",
        title: "UI design",
        body: "High-fidelity interfaces for web and mobile with a strong visual voice and obsessive detail.",
        points: ["Responsive layouts", "Dark & light themes", "Accessible colour & type"],
      },
      {
        icon: "Component",
        title: "Design systems",
        body: "Tokens, components and documentation that keep every screen consistent as you scale.",
        points: ["Design tokens", "Component libraries", "Storybook documentation"],
      },
      {
        icon: "Stamp",
        title: "Brand identity",
        body: "Logos, typography, colour and voice that make your brand instantly recognisable.",
        points: ["Logo & wordmark", "Brand guidelines", "Social & pitch templates"],
      },
      {
        icon: "Wand2",
        title: "Motion & interaction",
        body: "Micro-interactions and animations that guide attention and make products feel alive.",
        points: ["Interaction specs", "Rive & Lottie animation", "Prototype transitions"],
      },
    ],
    principles: [
      { title: "Clarity first", body: "Every screen answers one question: what should I do next?" },
      { title: "Visual hierarchy", body: "Size, weight and contrast lead the eye to what matters." },
      { title: "Accessible by default", body: "AA contrast, focus states and readable type for everyone." },
      { title: "Consistency", body: "Shared tokens and components so the product feels like one thing." },
      { title: "Feedback", body: "Every action gets a response — loading, success, error, empty." },
      { title: "Delight", body: "Small moments of motion and personality people remember." },
    ],
    pillars: [
      { icon: "Users", title: "User-centred", body: "Decisions backed by research and testing, not opinions in a meeting room." },
      { icon: "Gem", title: "Distinctive", body: "A visual language that stands apart in a sea of look-alike templates." },
      { icon: "Handshake", title: "Built to ship", body: "Designers and engineers in the same sprint — what we design is what goes live." },
    ],
    process: [
      { title: "Research", body: "Stakeholder workshops, user interviews and analytics review." },
      { title: "Define", body: "Personas, jobs-to-be-done and a prioritised problem list." },
      { title: "Wireframe", body: "User flows and low-fidelity layouts for every key journey." },
      { title: "Visual design", body: "High-fidelity UI, design tokens and component states." },
      { title: "Prototype & test", body: "Clickable prototypes tested with real users, then refined." },
      { title: "Handoff", body: "Organised Figma, specs and a component library for engineering." },
    ],
    comparison: [
      ["User research included", true, false],
      ["Clickable prototype before build", true, "Sometimes"],
      ["Full component states designed", true, false],
      ["Design system & tokens", true, false],
      ["Accessibility (WCAG AA) checks", true, false],
      ["Designers who understand code", true, "Rarely"],
    ],
    tools: [
      { label: "Design", items: ["figma", "framer", "sketch", "illustrator", "miro"] },
      { label: "Motion", items: ["rive", "lottie", "gsap", "framer"] },
      { label: "Handoff", items: ["storybook", "notion", "jira", "github"] },
    ],
    faqs: [
      {
        q: "What is the difference between UI and UX design?",
        a: "UX (user experience) is about how a product works — flows, structure and usability. UI (user interface) is how it looks — layout, colour, typography and components. We do both, together.",
      },
      {
        q: "Do you only design, or can you also build?",
        a: "Both. Our designers and engineers work in the same sprint, so the design you approve is exactly what ships.",
      },
      {
        q: "What will we receive at the end of a design project?",
        a: "Organised Figma files, a documented design system with tokens and components, exported assets, prototypes and — if we build it — a matching coded component library.",
      },
      {
        q: "Can you work with our existing brand guidelines?",
        a: "Yes. We can extend your guidelines or evolve them; after discovery we recommend the right level of change.",
      },
      {
        q: "How do you test designs with users?",
        a: "We run moderated and unmoderated usability sessions on prototypes, measure task success and iterate before development starts.",
      },
    ],
  },

  /* ────────────────────────── MOBILE ────────────────────────── */
  {
    slug: "mobile-apps",
    index: "03",
    icon: "Smartphone",
    title: "Mobile App Development",
    short: "Cross-platform iOS & Android apps with a native feel and one shared codebase.",
    tagline: "Apps people open every day — on iOS and Android.",
    description:
      "We design, build and launch polished mobile apps with React Native, Flutter and native Swift/Kotlin — offline-ready, smooth at 60fps and wired to the payments, analytics and backend you need to grow.",
    tags: ["React Native", "Flutter", "iOS", "Android"],
    credentials: ["iOS + Android from one codebase", "MVP in 8–12 weeks", "Store submission handled", "Crash-free monitoring"],
    subServicesTitle: "Our app development services",
    subServices: [
      {
        icon: "Apple",
        title: "iOS app development",
        body: "Native-quality iPhone and iPad apps that follow Apple's Human Interface Guidelines.",
        points: ["Swift & SwiftUI", "Apple Pay & HealthKit", "TestFlight beta programs"],
      },
      {
        icon: "Smartphone",
        title: "Android app development",
        body: "Fast, reliable Android apps that work beautifully across thousands of devices.",
        points: ["Kotlin & Jetpack Compose", "Material You design", "Play Console releases"],
      },
      {
        icon: "Layers",
        title: "Cross-platform apps",
        body: "One codebase, two stores. Save time and budget without compromising on feel.",
        points: ["React Native & Expo", "Flutter", "Shared logic with your web app"],
      },
      {
        icon: "Rocket",
        title: "MVP development",
        body: "Validate your idea fast with a focused first version real users can download.",
        points: ["Scope workshops", "8–12 week delivery", "Analytics from day one"],
      },
      {
        icon: "PenTool",
        title: "App UI/UX design",
        body: "Thumb-friendly, gesture-rich interfaces designed specifically for small screens.",
        points: ["Onboarding flows", "Interactive prototypes", "Platform-native patterns"],
      },
      {
        icon: "Wrench",
        title: "Maintenance & scaling",
        body: "Keep your app fast, secure and compatible with every new OS release.",
        points: ["OS update readiness", "Crash & performance fixes", "Feature roadmaps"],
      },
    ],
    features: [
      { icon: "Fingerprint", title: "Secure auth & biometrics" },
      { icon: "CreditCard", title: "Payments & subscriptions" },
      { icon: "BellRing", title: "Push notifications" },
      { icon: "WifiOff", title: "Offline-first sync" },
      { icon: "MapPin", title: "Maps & geolocation" },
      { icon: "MessagesSquare", title: "Chat & real-time" },
      { icon: "Camera", title: "Camera & media" },
      { icon: "Link2", title: "Deep links & sharing" },
    ],
    pillars: [
      { icon: "Smartphone", title: "Native feel", body: "Platform gestures, haptics and 60fps animations — users can't tell it's cross-platform." },
      { icon: "ShieldCheck", title: "Secure & reliable", body: "Encrypted storage, secure APIs and crash monitoring from the first build." },
      { icon: "TrendingUp", title: "Built to grow", body: "Analytics, A/B testing and modular architecture so new features ship fast." },
    ],
    platformComparison: [
      ["Codebases to maintain", "1 (iOS + Android)", "2 (one per platform)"],
      ["Time to market", "Faster", "Slower"],
      ["Performance", "Near-native", "Native"],
      ["Access to device features", "Almost all", "All"],
      ["Best for", "Most startups & businesses", "Heavy graphics, AR, deep OS hooks"],
    ],
    process: [
      { title: "Product discovery", body: "Goals, users, monetisation and a scoped feature list." },
      { title: "UX & prototype", body: "Flows and clickable prototypes tested on real phones." },
      { title: "Agile sprints", body: "Two-week sprints with builds on your device via TestFlight / Play." },
      { title: "Beta testing", body: "Closed beta, crash monitoring and performance profiling." },
      { title: "Store launch", body: "Listings, screenshots, review guidelines and release management." },
      { title: "Grow", body: "Analytics, push campaigns and a feature roadmap driven by data." },
    ],
    tools: [
      { label: "Cross-platform", items: ["reactnative", "flutter", "expo", "typescript"] },
      { label: "Native", items: ["swift", "kotlin", "ios", "android"] },
      { label: "Backend", items: ["firebase", "supabase", "nodejs", "graphql", "postgresql"] },
      { label: "Release & growth", items: ["appstore", "googleplay", "revenuecat", "sentry", "ga4"] },
    ],
    faqs: [
      {
        q: "Should we choose React Native or Flutter?",
        a: "Both are excellent. React Native is ideal if you also have a React web app (shared code and skills); Flutter shines for highly custom, animation-heavy interfaces. We'll recommend one after discovery.",
      },
      {
        q: "How much does it cost to build a mobile app?",
        a: "It depends on features, integrations and platforms. After a short discovery call we send a fixed-scope proposal for an MVP, with optional phases for later features.",
      },
      {
        q: "Do you publish the app to the App Store and Google Play?",
        a: "Yes. We handle store listings, screenshots, privacy labels, review guidelines, TestFlight and Play Console setup — and stay on hand for review feedback.",
      },
      {
        q: "Can you take over an existing app?",
        a: "We can. We start with a code and performance audit, stabilise crashes, then plan new features with you.",
      },
      {
        q: "Will the app work offline?",
        a: "If your use case needs it, yes — we build offline-first data sync so the app keeps working without a connection and syncs when it's back.",
      },
    ],
  },

  /* ──────────────────────────── AI ──────────────────────────── */
  {
    slug: "ai-automation",
    index: "04",
    icon: "Sparkles",
    title: "AI & Automation",
    short: "LLM copilots, AI agents and workflow automation that save real hours.",
    tagline: "Put AI to work on the tasks that eat your week.",
    description:
      "We design and ship practical AI — support agents trained on your knowledge, internal copilots, document processing and automated workflows — with guardrails, evaluations and a clear return on investment.",
    tags: ["AI Agents", "RAG", "LLMs", "Automation"],
    credentials: ["Free AI opportunity audit", "Proof of concept in 2–3 weeks", "Your data stays private", "Measured ROI"],
    subServicesTitle: "Our AI & automation services",
    subServices: [
      {
        icon: "Bot",
        title: "AI chat & support agents",
        body: "Agents that answer customers 24/7 from your docs and policies — and hand off to humans when needed.",
        points: ["Website, WhatsApp & Slack", "Cited, grounded answers", "Human handoff rules"],
      },
      {
        icon: "BookOpenText",
        title: "Knowledge search (RAG)",
        body: "Ask questions across wikis, PDFs, tickets and drives and get answers with sources.",
        points: ["Semantic search", "Permission-aware results", "Source citations"],
      },
      {
        icon: "FileScan",
        title: "Document processing",
        body: "Extract data from invoices, contracts, forms and emails into your systems automatically.",
        points: ["Classification & extraction", "Validation rules", "Human review queues"],
      },
      {
        icon: "Workflow",
        title: "Workflow automation",
        body: "Connect your tools and let AI handle the repetitive steps between them.",
        points: ["n8n, Zapier or custom", "CRM & helpdesk actions", "Scheduled & event triggers"],
      },
      {
        icon: "Sparkles",
        title: "AI features in your product",
        body: "Summaries, smart search, recommendations and copilots inside your own app.",
        points: ["Streaming UX", "Cost & latency budgets", "Usage analytics"],
      },
      {
        icon: "ShieldCheck",
        title: "Evaluation & guardrails",
        body: "Make AI safe and predictable with tests, monitoring and policy controls.",
        points: ["Evaluation suites", "PII redaction", "Prompt-injection defence"],
      },
    ],
    useCases: [
      { team: "Support", icon: "Headphones", body: "Resolve repetitive tickets instantly and draft replies for the rest." },
      { team: "Sales", icon: "Target", body: "Qualify leads, enrich CRM records and prepare call briefs automatically." },
      { team: "Operations", icon: "Settings2", body: "Route requests, reconcile data and keep systems in sync." },
      { team: "Finance", icon: "Receipt", body: "Read invoices, match payments and flag anomalies for review." },
      { team: "HR", icon: "Users", body: "Answer policy questions and screen applications consistently." },
      { team: "Marketing", icon: "Megaphone", body: "Draft on-brand content, repurpose assets and analyse campaigns." },
    ],
    guardrails: [
      "Zero-retention enterprise APIs",
      "PII redaction before the model",
      "Role-based tool permissions",
      "Confidence-based human handoff",
      "Weekly evaluation reports",
      "Deploy in your own cloud if required",
    ],
    pillars: [
      { icon: "Target", title: "ROI first", body: "We start with the processes where AI saves the most hours or money — and measure it." },
      { icon: "Lock", title: "Private & secure", body: "Your data is never used to train public models; sensitive fields are redacted." },
      { icon: "Gauge", title: "Production-grade", body: "Evaluations, monitoring and fallbacks — not a demo that breaks in week two." },
    ],
    process: [
      { title: "Opportunity audit", body: "Map workflows, estimate hours saved and pick the best first use case." },
      { title: "Proof of concept", body: "A working prototype on your real data in 2–3 weeks." },
      { title: "Evaluate", body: "Build a test set and measure accuracy, cost and latency." },
      { title: "Integrate", body: "Connect to your tools, add guardrails and human-in-the-loop steps." },
      { title: "Launch", body: "Roll out to a pilot group, monitor closely, then scale." },
      { title: "Improve", body: "Weekly evaluation runs and continuous tuning." },
    ],
    tools: [
      { label: "Models", items: ["openai", "anthropic", "gemini", "mistral", "huggingface", "ollama"] },
      { label: "Frameworks", items: ["langchain", "python", "fastapi", "nodejs", "typescript"] },
      { label: "Data", items: ["pgvector", "supabase", "postgresql", "redis"] },
      { label: "Automation", items: ["n8n", "zapier", "slack", "hubspot", "zendesk", "whatsapp"] },
    ],
    faqs: [
      {
        q: "Is our company data safe with AI?",
        a: "Yes. We use enterprise APIs with zero data retention, redact sensitive information before it reaches a model, and can deploy models inside your own cloud for strict compliance needs.",
      },
      {
        q: "How do you stop the AI from making things up?",
        a: "Answers are grounded in your own content through retrieval (RAG) with citations, low-confidence questions are escalated to a human, and every release is checked against an evaluation suite.",
      },
      {
        q: "Which AI models do you use?",
        a: "We're model-agnostic — OpenAI, Anthropic, Google Gemini, Mistral and open-source models. We pick the best balance of quality, speed, cost and privacy for each task.",
      },
      {
        q: "How quickly can we see results?",
        a: "Most clients have a working proof of concept on their own data within 2–3 weeks, and a production pilot within 6–8 weeks.",
      },
      {
        q: "Can AI connect to our existing tools?",
        a: "Yes — CRMs, helpdesks, databases, Slack, WhatsApp, email and internal APIs, so the AI can take actions rather than just chat.",
      },
    ],
  },

  /* ───────────────────────── COMMERCE ───────────────────────── */
  {
    slug: "ecommerce",
    index: "05",
    icon: "ShoppingBag",
    title: "E-commerce Development",
    short: "Shopify and headless storefronts engineered for conversion and speed.",
    tagline: "Online stores that sell while you sleep.",
    description:
      "We build Shopify, WooCommerce and headless commerce experiences that load instantly, look stunning and convert — with subscriptions, integrations and growth tooling that scale with your catalogue.",
    tags: ["Shopify", "Headless", "WooCommerce", "CRO"],
    credentials: ["Free store CRO audit", "Platform-agnostic advice", "SEO-safe migrations", "Launch in 6–10 weeks"],
    subServicesTitle: "Our e-commerce development services",
    subServices: [
      {
        icon: "Store",
        title: "Shopify & Shopify Plus",
        body: "Custom themes, apps and checkout extensions for brands of every size.",
        points: ["Custom Liquid themes", "Shopify Plus checkout", "Markets & multi-currency"],
      },
      {
        icon: "Boxes",
        title: "Headless commerce",
        body: "Lightning-fast storefronts with Next.js or Hydrogen on top of your commerce engine.",
        points: ["Edge-rendered PDPs", "Instant search & filters", "Content + commerce blended"],
      },
      {
        icon: "ShoppingCart",
        title: "WooCommerce development",
        body: "Flexible WordPress-based stores with custom features and solid performance.",
        points: ["Custom plugins", "Performance hardening", "B2B & wholesale pricing"],
      },
      {
        icon: "Repeat",
        title: "Subscriptions & custom checkout",
        body: "Recurring revenue, bundles and checkout flows designed to reduce abandonment.",
        points: ["Subscriptions & memberships", "One-page checkout", "Local payment methods"],
      },
      {
        icon: "Plug",
        title: "Integrations",
        body: "Connect your store to ERP, inventory, shipping, CRM and marketing tools.",
        points: ["ERP & PIM sync", "Shipping & fulfilment", "Email & SMS flows"],
      },
      {
        icon: "ArrowRightLeft",
        title: "Store migrations",
        body: "Move from Magento, WooCommerce or custom platforms without losing SEO or orders.",
        points: ["Products, customers & orders", "301 redirect mapping", "Zero-downtime cutover"],
      },
    ],
    funnel: [
      { stage: "Visit", value: 100, tactic: "Fast pages, rich previews and SEO-friendly category pages." },
      { stage: "Product view", value: 64, tactic: "Instant search, smart filters and merchandising rules." },
      { stage: "Add to cart", value: 28, tactic: "Persuasive PDPs, reviews, sizing help and urgency done right." },
      { stage: "Checkout", value: 14, tactic: "One-page checkout, wallets, local payments and trust cues." },
      { stage: "Purchase", value: 9, tactic: "Post-purchase upsells, order tracking and retention flows." },
    ],
    pillars: [
      { icon: "Zap", title: "Speed that sells", body: "Fast stores convert better — we treat load time as a revenue feature." },
      { icon: "BadgePercent", title: "Conversion-led", body: "Every template is designed around product discovery and checkout completion." },
      { icon: "Expand", title: "Scales with you", body: "From 50 to 50,000 SKUs, multiple markets and wholesale channels." },
    ],
    process: [
      { title: "Commerce audit", body: "Analytics, funnel drop-offs, catalogue structure and tech review." },
      { title: "Platform & architecture", body: "Choose the right platform and plan integrations." },
      { title: "Design", body: "Home, category, product, cart and checkout designed for conversion." },
      { title: "Build & integrate", body: "Theme or headless build, apps and data migration." },
      { title: "Launch", body: "QA on real devices, payment testing and redirect checks." },
      { title: "Optimise", body: "CRO experiments, email flows and performance tuning." },
    ],
    tools: [
      { label: "Platforms", items: ["shopify", "woocommerce", "bigcommerce", "magento", "nextjs", "wordpress"] },
      { label: "Payments", items: ["stripe", "razorpay", "paypal"] },
      { label: "Growth", items: ["algolia", "mailchimp", "hotjar", "ga4", "meta", "googleads"] },
    ],
    faqs: [
      {
        q: "Which e-commerce platform is right for my business?",
        a: "Shopify suits most brands thanks to its reliability and app ecosystem; WooCommerce is great when you need WordPress flexibility; headless makes sense for custom experiences or extreme performance. We recommend honestly after an audit.",
      },
      {
        q: "Can you migrate my store without losing SEO?",
        a: "Yes. We migrate products, customers and order history, map every old URL to its new home with 301 redirects and monitor rankings after launch.",
      },
      {
        q: "Do you integrate payment gateways?",
        a: "We integrate Stripe, Razorpay, PayPal, wallets like Apple Pay and Google Pay, and local payment methods for your markets.",
      },
      {
        q: "How do you increase conversion rates?",
        a: "We analyse your funnel, fix speed and UX issues, improve product pages and checkout, then run A/B tests to validate each change.",
      },
      {
        q: "Will I be able to manage products myself?",
        a: "Yes — you manage products, collections, discounts and content from your platform's admin, and we provide training.",
      },
    ],
  },

  /* ─────────────────────────── SEO ─────────────────────────── */
  {
    slug: "seo-growth",
    index: "06",
    icon: "TrendingUp",
    title: "SEO Services",
    short: "Technical SEO, content and link building that grow organic traffic month after month.",
    tagline: "Rank higher. Get found. Grow every single month.",
    description:
      "We help businesses climb Google's rankings with white-hat SEO — fixing technical foundations, creating content that answers real searches and earning authority that compounds. Transparent monthly reporting, tied to leads and revenue.",
    tags: ["Technical SEO", "On-page", "Local SEO", "Content"],
    credentials: ["Free SEO audit", "Monthly reporting", "White-hat only", "No long-term lock-in"],
    subServicesTitle: "Our SEO services",
    subServices: [
      {
        icon: "Wrench",
        title: "Technical SEO",
        body: "Make your site easy for search engines to crawl, render and index — and fast for visitors.",
        points: ["Crawl & index fixes", "Core Web Vitals", "XML sitemaps & robots"],
      },
      {
        icon: "FileText",
        title: "On-page SEO",
        body: "Optimise every page so Google understands exactly what you offer and who it's for.",
        points: ["Title tags & meta descriptions", "Headings & internal links", "Schema markup"],
      },
      {
        icon: "KeyRound",
        title: "Keyword research & content",
        body: "Find the searches your customers make, then publish content that wins them.",
        points: ["Keyword & intent mapping", "Content briefs & writing", "Content refreshes"],
      },
      {
        icon: "Link2",
        title: "Link building & off-page",
        body: "Earn high-quality backlinks and brand mentions that build real authority.",
        points: ["Digital PR", "Guest contributions", "Unlinked mention outreach"],
      },
      {
        icon: "MapPin",
        title: "Local SEO",
        body: "Show up in the map pack and \"near me\" searches in every city you serve.",
        points: ["Google Business Profile", "Local citations & NAP", "Review strategy"],
      },
      {
        icon: "ShoppingBag",
        title: "E-commerce SEO",
        body: "Rank category and product pages on Shopify, WooCommerce and headless stores.",
        points: ["Category page optimisation", "Product schema & rich results", "Faceted navigation fixes"],
      },
      {
        icon: "Globe2",
        title: "International SEO",
        body: "Target multiple countries and languages without duplicate-content problems.",
        points: ["hreflang setup", "Localised keyword research", "Country site structure"],
      },
      {
        icon: "ClipboardCheck",
        title: "SEO audits",
        body: "A complete health check of your website with a prioritised, plain-English action plan.",
        points: ["200+ point audit", "Competitor gap analysis", "Prioritised roadmap"],
      },
    ],
    kpis: [
      { icon: "ArrowUpWideNarrow", title: "Keyword rankings", body: "Positions for the terms that bring buyers — not vanity keywords." },
      { icon: "LineChart", title: "Organic traffic", body: "Qualified visitors from search, segmented by page and intent." },
      { icon: "Target", title: "Leads & revenue", body: "Form fills, calls and sales attributed to organic search." },
      { icon: "Gauge", title: "Core Web Vitals", body: "Speed and stability metrics that influence rankings and UX." },
    ],
    audit: [
      { label: "Crawlability & indexation", score: 92 },
      { label: "Site speed & Core Web Vitals", score: 78 },
      { label: "Mobile usability", score: 96 },
      { label: "On-page optimisation", score: 64 },
      { label: "Structured data", score: 40 },
      { label: "Internal linking", score: 71 },
      { label: "Content quality & gaps", score: 58 },
      { label: "Backlink profile", score: 49 },
    ],
    pillars: [
      { icon: "ShieldCheck", title: "White-hat only", body: "No shortcuts that risk penalties — just sustainable, guideline-friendly growth." },
      { icon: "BarChart3", title: "Transparent reporting", body: "Monthly reports in plain English: what we did, what moved and what's next." },
      { icon: "Code2", title: "Dev-powered SEO", body: "Our engineers implement technical fixes directly — no waiting on another agency." },
    ],
    process: [
      { title: "SEO audit", body: "Technical, on-page, content and backlink audit of your site and competitors." },
      { title: "Keyword strategy", body: "Map high-intent keywords to existing and new pages." },
      { title: "On-page optimisation", body: "Titles, metas, headings, internal links and schema on priority pages." },
      { title: "Content creation", body: "Briefs and articles that answer real search intent better than competitors." },
      { title: "Authority building", body: "Digital PR and outreach for relevant, high-quality backlinks." },
      { title: "Report & refine", body: "Monthly reporting, rank tracking and continuous iteration." },
    ],
    comparison: [
      ["Technical fixes implemented in-house", true, false],
      ["Reports tied to leads & revenue", true, "Rankings only"],
      ["White-hat link building", true, "Sometimes"],
      ["Content written for real intent", true, "Keyword-stuffed"],
      ["Monthly strategy calls", true, false],
      ["No long-term contracts", true, false],
    ],
    tools: [
      { label: "Research", items: ["semrush", "ahrefs", "searchconsole", "screamingfrog"] },
      { label: "Analytics", items: ["ga4", "gtm", "looker", "hotjar"] },
      { label: "On-page & speed", items: ["yoast", "wordpress", "lighthouse", "pagespeed"] },
      { label: "Local", items: ["gbp", "googlemaps"] },
    ],
    faqs: [
      {
        q: "How long does SEO take to show results?",
        a: "Technical fixes and on-page improvements can move rankings within weeks. Content and authority-led growth usually compounds over 3–6 months — we report progress monthly so you can see the trend early.",
      },
      {
        q: "Do you guarantee first-page rankings on Google?",
        a: "No honest agency can guarantee rankings — Google controls the results. We guarantee a transparent process, best-practice execution and reporting tied to traffic, leads and revenue.",
      },
      {
        q: "What's the difference between SEO and paid ads?",
        a: "Paid ads stop the moment you stop paying. SEO builds organic visibility that keeps sending traffic for months and years — most businesses benefit from both working together.",
      },
      {
        q: "What does your SEO audit include?",
        a: "Crawlability, indexation, site speed, mobile usability, on-page elements, structured data, internal linking, content gaps and your backlink profile — delivered as a prioritised action plan.",
      },
      {
        q: "Do you offer local SEO for small businesses?",
        a: "Yes. We optimise your Google Business Profile, build consistent local citations, create location pages and help you earn more reviews so you appear in the map pack.",
      },
      {
        q: "Can we manage on-page SEO ourselves afterwards?",
        a: "Yes — our dashboard lets your team edit meta titles, descriptions, keywords and social images for every page and blog post, with a live SEO score.",
      },
    ],
  },
];

/** "Web Development Services", but never "SEO Services Services". */
export function serviceMetaTitle(service) {
  return /services$/i.test(service.title) ? service.title : `${service.title} Services`;
}

export const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));
export const serviceSlugs = services.map((s) => s.slug);
