import { CodeSnow } from "@/components/site/effects/CodeSnow";
import { FaqSection } from "@/components/site/sections/HomeSections";
import { CtaSection } from "@/components/site/sections/CtaSection";
import {
  ServiceHero,
  SubServicesSection,
  PillarsSection,
  StepsSection,
  ComparisonSection,
  ServiceToolsSection,
  IndustriesSection,
  RelatedServices,
} from "./blocks";
import {
  SeoKpiSection,
  SeoReportSection,
  SeoAuditSection,
  PerformanceSection,
  DesignSystemSection,
  PrinciplesSection,
  AppFeaturesSection,
  WorkflowSection,
  UseCasesSection,
  GuardrailsSection,
  FunnelSection,
} from "./sections";
import { SerpVisual, LighthouseVisual, DesignCanvasVisual, PhonesVisual, AgentChatVisual, StorefrontVisual } from "./visuals";
import { SocialFeedVisual, AdsDashboardVisual } from "./marketing-visuals";
import {
  KpiSection,
  PlatformsSection,
  ContentCalendarSection,
  ChannelsSection,
  AdsFunnelSection,
  OptimizationLoopSection,
  MetricsGlossarySection,
} from "./marketing-sections";

/* Hero backgrounds — each service gets its own atmosphere. */

const GridGlow = ({ a = "bg-brand/15", b = "bg-brand-2/15" }) => (
  <>
    <div className="absolute inset-0 -z-10 bg-grid-lines mask-radial [background-size:56px_56px] opacity-60" />
    <div className={`absolute -top-24 right-[-5%] -z-10 h-[30rem] w-[30rem] rounded-full blur-[130px] ${a}`} />
    <div className={`absolute -bottom-32 left-[-10%] -z-10 h-[26rem] w-[26rem] rounded-full blur-[130px] ${b}`} />
  </>
);

const DotsGlow = ({ a = "bg-brand-2/20", b = "bg-brand/10" }) => (
  <>
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(hsl(var(--foreground)/0.09)_1px,transparent_1px)] mask-radial [background-size:22px_22px]" />
    <div className={`absolute -top-32 left-1/3 -z-10 h-[32rem] w-[32rem] rounded-full blur-[140px] ${a}`} />
    <div className={`absolute bottom-0 right-0 -z-10 h-[22rem] w-[22rem] rounded-full blur-[120px] ${b}`} />
  </>
);

/* ── Web development ───────────────────────────────────────────── */

function WebDevelopmentPage({ service, settings }) {
  return (
    <>
      <ServiceHero
        service={service}
        visual={<LighthouseVisual />}
        primaryCta="Get a free website audit"
        background={
          <>
            <GridGlow />
            <CodeSnow density={0.35} className="-z-10 opacity-60 mask-fade-b" />
          </>
        }
      />
      <SubServicesSection service={service} eyebrow="web development" />
      <PillarsSection pillars={service.pillars} title="Built around the three things that grow a business online" />
      <PerformanceSection service={service} />
      <StepsSection steps={service.process} title="How we build your website" light description="Six clear stages, a live preview link from week one, and no surprises." />
      <ComparisonSection rows={service.comparison} />
      <ServiceToolsSection groups={service.tools} description="Modern, proven technology — chosen for speed, security and how easy it is for your team to run." />
      <IndustriesSection />
      <FaqSection faqs={service.faqs} title="Website development FAQs" />
      <RelatedServices current={service.slug} />
      <CtaSection email={settings.email} />
    </>
  );
}

/* ── Product design ────────────────────────────────────────────── */

function ProductDesignPage({ service, settings }) {
  return (
    <>
      <ServiceHero
        service={service}
        visual={<DesignCanvasVisual />}
        primaryCta="Book a design consultation"
        background={<DotsGlow a="bg-brand-2/25" b="bg-[#FF5C8A]/10" />}
      />
      <SubServicesSection service={service} eyebrow="ui/ux design" />
      <DesignSystemSection />
      <PrinciplesSection principles={service.principles} />
      <StepsSection steps={service.process} title="Our design process" description="Research-led and test-driven — so we design the right thing before we design it beautifully." />
      <ServiceToolsSection groups={service.tools} title="Design tools we work in" />
      <ComparisonSection rows={service.comparison} title="Snowdox vs. a typical design shop" />
      <PillarsSection pillars={service.pillars} title="Design that earns its keep" light />
      <FaqSection faqs={service.faqs} title="UI/UX design FAQs" />
      <RelatedServices current={service.slug} />
      <CtaSection email={settings.email} />
    </>
  );
}

/* ── Mobile apps ───────────────────────────────────────────────── */

function MobileAppsPage({ service, settings }) {
  return (
    <>
      <ServiceHero
        service={service}
        visual={<PhonesVisual />}
        primaryCta="Plan my app"
        background={<GridGlow a="bg-brand/20" b="bg-success/10" />}
      />
      <SubServicesSection service={service} eyebrow="app development" />
      <AppFeaturesSection features={service.features} />
      <ComparisonSection
        rows={service.platformComparison}
        eyebrow="cross-platform vs native"
        title="Which approach is right for your app?"
        colA="Cross-platform"
        colB="Fully native"
        light
      />
      <PillarsSection pillars={service.pillars} title="Apps that feel native and scale with you" />
      <StepsSection steps={service.process} title="From idea to the App Store" description="Two-week sprints with a fresh build on your phone every time." />
      <ServiceToolsSection groups={service.tools} title="Mobile technologies we use" />
      <IndustriesSection />
      <FaqSection faqs={service.faqs} title="Mobile app development FAQs" />
      <RelatedServices current={service.slug} />
      <CtaSection email={settings.email} />
    </>
  );
}

/* ── AI & automation ───────────────────────────────────────────── */

function AiAutomationPage({ service, settings }) {
  return (
    <>
      <ServiceHero
        service={service}
        visual={<AgentChatVisual />}
        primaryCta="Get a free AI audit"
        background={<DotsGlow a="bg-brand/20" b="bg-brand-2/20" />}
      />
      <SubServicesSection service={service} eyebrow="ai services" />
      <WorkflowSection />
      <UseCasesSection useCases={service.useCases} />
      <GuardrailsSection service={service} />
      <StepsSection steps={service.process} title="From idea to production AI" light description="A proof of concept on your real data in weeks — then a careful, measured rollout." />
      <ServiceToolsSection groups={service.tools} title="Models & tools we build with" light={false} />
      <FaqSection faqs={service.faqs} title="AI & automation FAQs" />
      <RelatedServices current={service.slug} />
      <CtaSection email={settings.email} />
    </>
  );
}

/* ── E-commerce ────────────────────────────────────────────────── */

function EcommercePage({ service, settings }) {
  return (
    <>
      <ServiceHero
        service={service}
        visual={<StorefrontVisual />}
        primaryCta="Get a free store audit"
        background={<GridGlow a="bg-brand-2/20" b="bg-warning/10" />}
      />
      <SubServicesSection service={service} eyebrow="e-commerce" />
      <FunnelSection funnel={service.funnel} />
      <PillarsSection pillars={service.pillars} title="Stores built to sell more" light />
      <StepsSection steps={service.process} title="How we launch your store" />
      <ServiceToolsSection groups={service.tools} title="Platforms & integrations" />
      <IndustriesSection title="Brands we build for" />
      <FaqSection faqs={service.faqs} title="E-commerce development FAQs" />
      <RelatedServices current={service.slug} />
      <CtaSection email={settings.email} />
    </>
  );
}

/* ── SEO ───────────────────────────────────────────────────────── */

function SeoPage({ service, settings }) {
  return (
    <>
      <ServiceHero
        service={service}
        visual={<SerpVisual />}
        primaryCta="Get a free SEO audit"
        background={<GridGlow a="bg-success/15" b="bg-brand/10" />}
      />
      <SubServicesSection
        service={service}
        eyebrow="seo services"
        columns={4}
        description="Full-funnel SEO — from technical foundations to content and authority — run by specialists who implement, not just advise."
      />
      <SeoKpiSection kpis={service.kpis} />
      <SeoReportSection />
      <StepsSection steps={service.process} title="Our SEO process" light description="A repeatable, transparent process that compounds month after month." />
      <SeoAuditSection audit={service.audit} light={false} />
      <ComparisonSection rows={service.comparison} title="Snowdox vs. a typical SEO agency" light />
      <PillarsSection pillars={service.pillars} title="Why businesses trust us with their search growth" />
      <ServiceToolsSection groups={service.tools} title="SEO tools we use every day" />
      <IndustriesSection title="SEO for every industry" />
      <FaqSection faqs={service.faqs} title="SEO FAQs" />
      <RelatedServices current={service.slug} />
      <CtaSection email={settings.email} />
    </>
  );
}

/* ── Social media marketing ────────────────────────────────────── */

function SocialMediaPage({ service, settings }) {
  return (
    <>
      <ServiceHero
        service={service}
        visual={<SocialFeedVisual />}
        primaryCta="Get a free social audit"
        background={<DotsGlow a="bg-[#ee2a7b]/15" b="bg-brand/15" />}
      />
      <SubServicesSection
        service={service}
        eyebrow="social media"
        columns={4}
        description="Strategy, content, community and paid social — handled end to end by one team that knows your brand."
      />
      <ContentCalendarSection calendar={service.calendar} />
      <PlatformsSection platforms={service.platforms} />
      <KpiSection
        kpis={service.kpis}
        title={
          <>
            Followers are nice. <span className="text-gradient">Customers are better.</span>
          </>
        }
        description="We report on four numbers every month — and the last one is the one that pays."
      />
      <StepsSection steps={service.process} title="How we grow your social" light description="A clear monthly rhythm: plan, create, engage, report — and improve." />
      <ComparisonSection rows={service.comparison} title="Snowdox vs. a typical social agency" />
      <PillarsSection pillars={service.pillars} title="Why brands trust us with their voice" light />
      <ServiceToolsSection groups={service.tools} title="Platforms & tools we use" light={false} />
      <IndustriesSection light />
      <FaqSection faqs={service.faqs} title="Social media marketing FAQs" />
      <RelatedServices current={service.slug} />
      <CtaSection email={settings.email} />
    </>
  );
}

/* ── Performance marketing ─────────────────────────────────────── */

function PerformanceMarketingPage({ service, settings }) {
  return (
    <>
      <ServiceHero
        service={service}
        visual={<AdsDashboardVisual />}
        primaryCta="Get a free ad account audit"
        background={<GridGlow a="bg-brand/20" b="bg-success/10" />}
      />
      <SubServicesSection
        service={service}
        eyebrow="paid media"
        columns={4}
        description="Paid search, paid social and video — planned, tracked and optimised to hit your target cost per customer."
      />
      <ChannelsSection channels={service.channels} />
      <AdsFunnelSection funnel={service.funnel} />
      <OptimizationLoopSection loop={service.loop} />
      <MetricsGlossarySection metrics={service.metrics} />
      <StepsSection steps={service.process} title="How we launch and scale your ads" light description="Tracking first, then campaigns — so every decision is based on real numbers." />
      <ComparisonSection rows={service.comparison} title="Snowdox vs. a typical ads agency" />
      <PillarsSection pillars={service.pillars} title="Built to make your ad spend work harder" light />
      <ServiceToolsSection groups={service.tools} title="Ad platforms & tracking tools" light={false} />
      <IndustriesSection light />
      <FaqSection faqs={service.faqs} title="Performance marketing FAQs" />
      <RelatedServices current={service.slug} />
      <CtaSection email={settings.email} />
    </>
  );
}

export const servicePages = {
  "social-media-marketing": SocialMediaPage,
  "performance-marketing": PerformanceMarketingPage,
  "web-development": WebDevelopmentPage,
  "product-design": ProductDesignPage,
  "mobile-apps": MobileAppsPage,
  "ai-automation": AiAutomationPage,
  ecommerce: EcommercePage,
  "seo-growth": SeoPage,
};
