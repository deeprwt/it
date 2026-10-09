/**
 * Primary navigation. The "What We Do" item drives the mega-menu.
 * All hrefs resolve to real generated pages (catalog slugs or routes).
 */

export const megaMenu = [
  {
    title: "Web Development",
    items: [
      { label: "Web Application Development", href: "/web-application-development-company" },
      { label: "WordPress Development", href: "/wordpress-website-development-company" },
      { label: "CMS Development", href: "/cms-development-company" },
      { label: "HTML5 Website Development", href: "/html5-website-development" },
      { label: "All web development →", href: "/services/web-development" },
    ],
  },
  {
    title: "E-commerce & Mobile",
    items: [
      { label: "E-commerce Development", href: "/ecommerce-website-development-company" },
      { label: "Shopify Development", href: "/shopify-development-company-india" },
      { label: "Mobile App Development", href: "/mobile-app-development-company" },
      { label: "Android App Development", href: "/android-app-development-company-bangalore" },
      { label: "iOS App Development", href: "/ios-app-development-company" },
    ],
  },
  {
    title: "AI & Marketing",
    items: [
      { label: "AI Agent Development", href: "/ai-agent-development-company" },
      { label: "AI Chat Agents", href: "/ai-chat-agent-development-company" },
      { label: "Digital Marketing", href: "/digital-marketing-company-in-bangalore" },
      { label: "SEO Services", href: "/seo-company-in-bangalore" },
      { label: "Social Media Marketing", href: "/social-media-marketing-company-bangalore" },
    ],
  },
  {
    title: "Design & Branding",
    items: [
      { label: "UI/UX Design", href: "/ui-ux-design-company" },
      { label: "Logo Design", href: "/logo-design-company" },
      { label: "Branding Agency", href: "/branding-agency-bangalore" },
      { label: "Graphic Design", href: "/graphic-design-company" },
      { label: "Figma Design", href: "/figma-design-company-bangalore-india" },
    ],
  },
];

export const navLinks = [
  { label: "What We Do", href: "/services", mega: true },
  { label: "Solutions", href: "/solutions" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  services: {
    title: "Services",
    links: [
      { label: "Web Development", href: "/services/web-development" },
      { label: "Mobile App Development", href: "/services/mobile-apps" },
      { label: "AI Agent Development", href: "/services/ai-agents" },
      { label: "Digital Marketing", href: "/services/digital-marketing" },
      { label: "UI/UX & Branding", href: "/services/ui-ux-branding" },
      { label: "E-commerce", href: "/services/ecommerce-development" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "All Solutions", href: "/solutions" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Insights / Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
};
