/**
 * Services data — single source of truth for the services overview
 * page, the "What We Do" home section, and every /services/[slug] page.
 *
 * Icon fields hold Lucide icon NAMES (strings); they are resolved to
 * components via the icon map in `@/lib/icons`.
 */

/** Four top-level pillars (overview page + home grid). */
export const pillars = [
  {
    slug: "web-development",
    icon: "Code2",
    title: "Web Development",
    tagline: "Sites & apps engineered to convert",
    description:
      "Custom, full-stack websites and web applications — fast, secure and scalable, built to turn visitors into customers.",
    services: [
      "Website Design & Development",
      "Web Application Development",
      "WordPress & CMS",
      "E-commerce Development",
      "Headless & Framework builds",
    ],
  },
  {
    slug: "ai-agents",
    icon: "Bot",
    title: "AI Automations",
    tagline: "Agents that work while you sleep",
    description:
      "Custom AI agents, chat, voice and sales assistants that automate workflows, cut costs and respond 24/7.",
    services: [
      "AI Agent Development",
      "AI Chat Agents",
      "AI Voice Agents",
      "AI Sales & Support Agents",
      "eCommerce AI Agents",
    ],
  },
  {
    slug: "digital-marketing",
    icon: "Megaphone",
    title: "Digital Marketing",
    tagline: "Growth you can measure",
    description:
      "Data-driven SEO, paid media and performance marketing that grows traffic, leads and revenue with provable ROI.",
    services: [
      "SEO & AEO",
      "Google Ads / PPC",
      "Social Media Marketing",
      "Performance Marketing",
      "Content Marketing",
    ],
  },
  {
    slug: "ui-ux-branding",
    icon: "Palette",
    title: "UI/UX & Branding",
    tagline: "Identities people remember",
    description:
      "Brand identity, UI/UX design, motion and video that make your business unmistakable in a crowded market.",
    services: [
      "UI/UX Design",
      "Branding & Identity",
      "Motion Graphics",
      "Corporate & Product Videos",
      "AI Image & Video",
    ],
  },
];

/**
 * Detailed service pages keyed by slug.
 * Each drives a full /services/[slug] route.
 */
export const services = {
  "web-development": {
    slug: "web-development",
    icon: "Code2",
    eyebrow: "Web Development",
    title: "Web Development that Drives Infinite Results",
    heroSummary:
      "We build customized, full-stack websites and web applications that load fast on every device, rank well, and turn traffic into revenue. From a single landing page to enterprise platforms — engineered to scale.",
    intro:
      "Established in 2013, Ribbon IT has delivered 2,000+ websites for clients across 25+ countries. Our developers pair clean, secure code with conversion-focused design, so your website is not just beautiful — it is a measurable business asset.",
    metrics: [
      { value: "2000+", label: "Websites delivered" },
      { value: "99.9%", label: "Uptime engineered" },
      { value: "<2s", label: "Target load time" },
    ],
    offerings: [
      { icon: "Layout", title: "Custom Website Development", description: "Bespoke, brand-perfect sites built from scratch with the features your business actually needs." },
      { icon: "Layers", title: "Full-Stack Development", description: "Front-end to databases and server-side logic, delivered as one cohesive, seamless experience." },
      { icon: "ShoppingCart", title: "E-commerce Development", description: "Secure, user-friendly online stores with smooth navigation and trusted payment gateways." },
      { icon: "Cloud", title: "Cloud-Based Web Apps", description: "Scalable, flexible solutions on cloud infrastructure that grow effortlessly with your business." },
      { icon: "PenTool", title: "UI/UX Development", description: "Intuitive interfaces and engaging visuals that attract users and keep them coming back." },
      { icon: "Database", title: "CMS Development", description: "Flexible, user-friendly CMS builds so you can update content without touching code." },
    ],
    whyChoose: [
      { icon: "Sparkles", title: "Crafted Design", description: "Visually engrossing designs that captivate your audience from the first scroll." },
      { icon: "Layers", title: "Structured Framework", description: "Scalable architecture engineered for seamless, future-proof growth." },
      { icon: "ShieldCheck", title: "Secure by Design", description: "Robust, security-first coding that defends against modern cyber threats." },
      { icon: "Clock", title: "On-Time Delivery", description: "Timely completion of every milestone, every project — without compromise." },
    ],
    process: [
      { title: "Discovery & Planning", description: "We map your goals, audience and requirements into a clear technical blueprint." },
      { title: "UI/UX Design", description: "Wireframes and prototypes that align design with conversion before a line of code." },
      { title: "Development", description: "Clean, modular, secure builds with continuous reviews at every milestone." },
      { title: "Testing & QA", description: "Cross-device, cross-browser and performance testing to guarantee quality." },
      { title: "Launch & Support", description: "Smooth deployment plus ongoing maintenance and optimization." },
    ],
    industries: ["E-commerce", "Healthcare", "Real Estate", "Fintech", "Education", "Manufacturing", "Hospitality", "SaaS"],
    faqs: [
      { q: "How long does it take to build a website?", a: "A typical business website takes 4–8 weeks; complex web applications run longer. We share a clear timeline after the discovery phase." },
      { q: "Will I own the source code and IP?", a: "Yes. On final delivery, full ownership of the source code and intellectual property transfers to you." },
      { q: "Do you provide post-launch support?", a: "Absolutely. We offer ongoing maintenance, security updates and performance monitoring after launch." },
      { q: "Can you redesign my existing website?", a: "Yes — we handle redesigns and migrations while preserving your SEO equity and content." },
    ],
  },

  "ai-agents": {
    slug: "ai-agents",
    icon: "Bot",
    eyebrow: "AI Automations",
    title: "AI Agent Development that Never Sleeps",
    heroSummary:
      "From startups to enterprises, businesses rely on our AI agents to simplify tasks and boost productivity. We build custom AI agents, chat, voice and sales assistants that make everyday workflows faster, smarter and available 24/7.",
    intro:
      "Smart automation is no longer optional. Our AI engineers design custom agents that integrate with your existing systems, learn continuously, and handle the repetitive work — so your team can focus on what humans do best.",
    metrics: [
      { value: "24/7", label: "Always-on availability" },
      { value: "60%+", label: "Routine tasks automated" },
      { value: "9", label: "Industries deployed" },
    ],
    offerings: [
      { icon: "Bot", title: "Custom AI Agents", description: "Tailored autonomous agents that handle your specific business operations end to end." },
      { icon: "MessageSquare", title: "AI Chat Agents", description: "Conversational agents across web, WhatsApp and social that qualify and convert leads." },
      { icon: "Mic", title: "AI Voice Agents", description: "Natural voice assistants for inbound and outbound calls, bookings and support." },
      { icon: "Headphones", title: "AI Sales & Support", description: "24/7 assistants that answer queries, resolve issues and never miss a lead." },
      { icon: "ShoppingCart", title: "eCommerce AI Agents", description: "Product discovery, recommendations and cart recovery that lift store revenue." },
      { icon: "Workflow", title: "Workflow Automation (RPA)", description: "Automate multi-step processes and connect the tools your business already runs on." },
    ],
    whyChoose: [
      { icon: "Brain", title: "Experienced AI Engineers", description: "A team fluent in NLP, ML and LLMs — not just prompts, but production systems." },
      { icon: "Puzzle", title: "Seamless Integration", description: "Agents that plug into your CRM, helpdesk, store and databases without friction." },
      { icon: "Gauge", title: "Scalable Architecture", description: "Flexible foundations that grow from a pilot to enterprise volume." },
      { icon: "ShieldCheck", title: "Security & Privacy", description: "Data protection and compliance built in from day one." },
    ],
    process: [
      { title: "Consultation & Discovery", description: "We identify the highest-impact workflows to automate first." },
      { title: "Design & Development", description: "We architect and train the agent around your data and tools." },
      { title: "Integration", description: "We connect the agent to your systems and channels." },
      { title: "Testing & QA", description: "Rigorous evaluation for accuracy, safety and tone." },
      { title: "Deploy & Optimize", description: "Launch with monitoring and continuous improvement." },
    ],
    industries: ["E-commerce", "Healthcare", "Finance", "Real Estate", "Logistics", "Retail", "Legal", "Education", "Manufacturing"],
    faqs: [
      { q: "What can an AI agent actually do for my business?", a: "Automate customer support, qualify leads, book appointments, recover carts, answer FAQs and run multi-step internal workflows — 24/7." },
      { q: "Will the AI agent integrate with my current tools?", a: "Yes. We integrate with popular CRMs, helpdesks, e-commerce platforms and custom APIs." },
      { q: "Is my data secure?", a: "We build with security and privacy first, including access controls and compliant data handling." },
      { q: "Do you support the agent after launch?", a: "Yes — we monitor performance and continuously retrain and optimize the agent." },
    ],
  },

  "digital-marketing": {
    slug: "digital-marketing",
    icon: "Megaphone",
    eyebrow: "Digital Marketing",
    title: "Digital Marketing with Provable ROI",
    heroSummary:
      "Results-driven SEO, paid media and performance marketing strategies that grow traffic, generate qualified leads and increase revenue — every rupee tracked and accountable.",
    intro:
      "We are a data-first agency. Every campaign starts with an audit and ends with a report you can act on. From search and social to programmatic and content, we build full-funnel growth engines for ambitious brands.",
    metrics: [
      { value: "4.9", label: "Average client rating" },
      { value: "25+", label: "Countries served" },
      { value: "360°", label: "Full-funnel coverage" },
    ],
    offerings: [
      { icon: "Search", title: "SEO & AEO", description: "Technical, on-page and off-page SEO — plus Answer Engine Optimization for AI search." },
      { icon: "Target", title: "Google Ads / PPC", description: "High-intent paid search and shopping campaigns optimized for cost-per-acquisition." },
      { icon: "Share2", title: "Social Media Marketing", description: "Content and paid social on Meta, LinkedIn and beyond that build audience and demand." },
      { icon: "LineChart", title: "Performance Marketing", description: "ROI-obsessed campaigns engineered around your revenue, not vanity metrics." },
      { icon: "PenTool", title: "Content Marketing", description: "Blogs, copy and thought leadership that rank, educate and convert." },
      { icon: "Mail", title: "Email & Automation", description: "Lifecycle campaigns and automation that nurture leads into loyal customers." },
    ],
    whyChoose: [
      { icon: "ChartNoAxesCombined", title: "Data-Driven Strategy", description: "Decisions grounded in analytics, not guesswork — every campaign measured." },
      { icon: "Target", title: "Result-Oriented", description: "We optimize for the outcomes that move your business: leads and revenue." },
      { icon: "Users", title: "In-House Specialists", description: "Strategists, creators and analysts under one roof, fully accountable." },
      { icon: "FileChartColumn", title: "Transparent Reporting", description: "Clear monthly insights so you always know what's working and why." },
    ],
    process: [
      { title: "Discovery & Audit", description: "We benchmark your presence, competitors and opportunities." },
      { title: "Strategy", description: "A channel mix and roadmap built around your goals and budget." },
      { title: "Campaign Build", description: "Creative, copy and targeting set up for performance." },
      { title: "Optimize & Test", description: "Continuous A/B testing to compound results." },
      { title: "Report & Scale", description: "Transparent reporting and reinvestment into what works." },
    ],
    industries: ["E-commerce", "Healthcare", "Real Estate", "SaaS", "Education", "Hospitality", "Local Business", "B2B"],
    faqs: [
      { q: "How soon will I see results?", a: "Paid campaigns can drive traffic immediately; SEO typically compounds over 3–6 months. We set realistic milestones up front." },
      { q: "Do you provide reports?", a: "Yes — transparent monthly reports covering traffic, leads, conversions and ROI." },
      { q: "Can you work with my budget?", a: "We build strategies for a range of budgets and scale spend as performance proves out." },
      { q: "What is AEO and why does it matter?", a: "Answer Engine Optimization positions your brand inside AI-driven search and assistants — increasingly where buyers start." },
    ],
  },

  "ui-ux-branding": {
    slug: "ui-ux-branding",
    icon: "Palette",
    eyebrow: "UI/UX & Branding",
    title: "Branding & UI/UX that People Remember",
    heroSummary:
      "Strategic, results-focused brand identities and product experiences — from naming and logo to complete identity systems and pixel-perfect interfaces that build trust and drive growth.",
    intro:
      "We combine design thinking with market insight to create brands that stand out and interfaces that feel effortless. Strategy comes before aesthetics, so every design decision earns its place.",
    metrics: [
      { value: "13+", label: "Years of craft" },
      { value: "250+", label: "Brands shaped" },
      { value: "100%", label: "Custom, never templated" },
    ],
    offerings: [
      { icon: "Compass", title: "Brand Strategy", description: "Market research and positioning that give your brand a clear, ownable place." },
      { icon: "PenTool", title: "Logo & Visual Identity", description: "Complete visual systems — logo, type, color and guidelines that scale." },
      { icon: "MonitorSmartphone", title: "UI/UX Design", description: "Intuitive, accessible interfaces designed around real user behavior." },
      { icon: "Film", title: "Motion & Animation", description: "Motion graphics and micro-interactions that bring your brand to life." },
      { icon: "Video", title: "Corporate & Product Videos", description: "Story-driven video that explains, sells and builds credibility." },
      { icon: "Sparkles", title: "AI Image & Video", description: "AI-assisted visuals that produce premium creative at speed and scale." },
    ],
    whyChoose: [
      { icon: "Lightbulb", title: "Brand-First Thinking", description: "Strategy and storytelling before visuals — design with a reason behind it." },
      { icon: "Layers", title: "360° Branding", description: "From strategy to execution across digital and print, all in one place." },
      { icon: "Users", title: "In-House Teams", description: "Design, strategy and content specialists collaborating end to end." },
      { icon: "Globe", title: "Local + Global", description: "Regional insight paired with a globally competitive design standard." },
    ],
    process: [
      { title: "Discovery & Research", description: "We study your business, audience and competitors." },
      { title: "Strategy & Positioning", description: "We define values, voice and the message that sets you apart." },
      { title: "Concept Development", description: "Multiple creative directions to explore the brand's range." },
      { title: "Design & Identity", description: "Logos, type, palettes and UI crafted into a cohesive system." },
      { title: "Launch & Guidelines", description: "Rollout plus brand guidelines for consistency everywhere." },
    ],
    industries: ["Startups", "Real Estate", "Healthcare", "Hospitality", "Tech & SaaS", "Retail", "E-commerce", "Education"],
    faqs: [
      { q: "How long does a brand identity take?", a: "A complete brand identity typically takes 3–6 weeks depending on scope." },
      { q: "Do you offer rebranding?", a: "Yes — we handle brand evolution and full rebrands, from audit to rollout." },
      { q: "Is the design custom?", a: "Always. We never use templates — every brand and interface is crafted from scratch." },
      { q: "Do you cover both digital and print?", a: "Yes — from websites and apps to packaging, brochures and signage." },
    ],
  },

  "ecommerce-development": {
    slug: "ecommerce-development",
    icon: "ShoppingCart",
    eyebrow: "E-commerce Development",
    title: "E-commerce Stores Built to Sell",
    heroSummary:
      "Secure, fast and beautiful online stores on Shopify, WooCommerce, Magento and custom stacks — engineered for seamless shopping and higher conversion.",
    intro:
      "From a boutique catalogue to enterprise commerce with thousands of SKUs, we build storefronts that load fast, rank well and make checkout effortless. Every store is conversion-optimized from day one.",
    metrics: [
      { value: "10k+", label: "SKUs handled" },
      { value: "100%", label: "Mobile-first" },
      { value: "PCI", label: "Secure checkout" },
    ],
    offerings: [
      { icon: "ShoppingBag", title: "Shopify Development", description: "Custom Shopify themes and apps that turn browsers into buyers." },
      { icon: "ShoppingCart", title: "WooCommerce", description: "Flexible WordPress commerce tailored to your products and workflows." },
      { icon: "Store", title: "Magento & BigCommerce", description: "Enterprise-grade platforms for high-volume, complex catalogues." },
      { icon: "CreditCard", title: "Secure Payments", description: "Trusted gateways and PCI-compliant checkout your customers can rely on." },
      { icon: "Boxes", title: "Inventory & Integrations", description: "ERP, CRM and logistics integrations that keep operations in sync." },
      { icon: "Bot", title: "eCommerce AI Agents", description: "AI-powered recommendations, search and cart recovery that lift revenue." },
    ],
    whyChoose: [
      { icon: "Rocket", title: "Conversion-Optimized", description: "Every template and flow is designed to maximize average order value." },
      { icon: "Gauge", title: "Built for Speed", description: "Performance-tuned stores that load fast and keep shoppers engaged." },
      { icon: "ShieldCheck", title: "Secure & Reliable", description: "Hardened, PCI-compliant builds that protect customers and revenue." },
      { icon: "Smartphone", title: "Mobile-First", description: "Flawless shopping on the devices where most sales now happen." },
    ],
    process: [
      { title: "Discovery", description: "We map your products, customers and platform fit." },
      { title: "Design", description: "Conversion-focused store design and product storytelling." },
      { title: "Development", description: "Custom build, payments and third-party integrations." },
      { title: "Testing", description: "Checkout, performance and security QA before launch." },
      { title: "Launch & Grow", description: "Go live, then optimize with analytics and AI." },
    ],
    industries: ["Fashion & Apparel", "Health & Pharmacy", "Grocery", "Electronics", "Beauty", "Home & Living", "B2B", "Marketplaces"],
    faqs: [
      { q: "Which platform is right for me?", a: "We recommend Shopify, WooCommerce, Magento or a custom build based on your catalogue size, budget and goals." },
      { q: "Can you migrate my existing store?", a: "Yes — we migrate products, customers and orders while preserving SEO and uptime." },
      { q: "Do you handle payments and shipping?", a: "We integrate trusted payment gateways and shipping/logistics providers end to end." },
      { q: "Will my store be mobile-friendly?", a: "Every store we build is mobile-first, where the majority of commerce now happens." },
    ],
  },

  "mobile-apps": {
    slug: "mobile-apps",
    icon: "Smartphone",
    eyebrow: "Mobile App Development",
    title: "Mobile Apps that Users Love",
    heroSummary:
      "High-performance Android, iOS and cross-platform apps — scalable, user-friendly mobile solutions tailored to your business with seamless design and reliable performance.",
    intro:
      "We design and build apps with full team ownership and a security-first architecture. From MVP to scale, our mobile engineers ship intuitive products delivered across 8+ industries and 25+ countries.",
    metrics: [
      { value: "8+", label: "Industries shipped" },
      { value: "iOS · Android", label: "Native & cross-platform" },
      { value: "25+", label: "Countries delivered" },
    ],
    offerings: [
      { icon: "Smartphone", title: "Custom Android Apps", description: "Reliable, scalable Android solutions built around your business needs." },
      { icon: "Apple", title: "iOS App Development", description: "Polished, performant iPhone and iPad apps that feel right at home." },
      { icon: "Layers", title: "Cross-Platform (Flutter / React Native)", description: "One codebase, every platform — faster launches without compromise." },
      { icon: "PenTool", title: "App UI/UX Design", description: "Intuitive, visually appealing interfaces designed for real users." },
      { icon: "Building2", title: "Enterprise Apps", description: "Apps that streamline operations for large, complex organizations." },
      { icon: "Wrench", title: "Maintenance & Support", description: "Ongoing updates, monitoring and performance tuning post-launch." },
    ],
    whyChoose: [
      { icon: "Workflow", title: "Agile with Build Reviews", description: "Continuous demos so you see progress and steer at every sprint." },
      { icon: "Users", title: "One Dedicated Team", description: "Full project ownership and accountability from kickoff to launch." },
      { icon: "ShieldCheck", title: "Security Architected In", description: "Protection designed into the foundation, not bolted on later." },
      { icon: "Globe", title: "Proven Across Industries", description: "Delivered across 8+ industries and 25+ countries." },
    ],
    process: [
      { title: "Strategy", description: "We define the product, platforms and roadmap." },
      { title: "UX & UI Design", description: "Prototypes that validate the experience early." },
      { title: "Development", description: "Agile builds with continuous review cycles." },
      { title: "QA & Testing", description: "Device, performance and security testing." },
      { title: "Launch & Scale", description: "Store deployment plus growth and support." },
    ],
    industries: ["E-commerce & Retail", "Healthcare & Telemedicine", "EdTech", "Fintech & Banking", "Travel & Hospitality", "Logistics", "Real Estate", "Food & Restaurant"],
    faqs: [
      { q: "How long does it take to build an app?", a: "An MVP typically takes 8–12 weeks; feature-rich apps run longer. We share a roadmap after discovery." },
      { q: "Do I own the source code?", a: "Yes — full source code and IP ownership transfers to you on delivery." },
      { q: "Native or cross-platform?", a: "We advise based on your goals: native for maximum performance, Flutter/React Native for faster multi-platform launches." },
      { q: "Do you support the app after launch?", a: "Yes — we offer maintenance, updates, monitoring and feature additions." },
    ],
  },
};

/** Convenience arrays for routing + listings. */
export const serviceSlugs = Object.keys(services);
export const serviceList = Object.values(services);
