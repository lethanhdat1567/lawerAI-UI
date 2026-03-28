// src/app/(marketing)/page.tsx
import { BenefitsSection } from "@/components/marketing/benefits-section";
import { CaseHighlightsSection } from "@/components/marketing/case-highlights-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { FeatureBento } from "@/components/marketing/feature-bento";
import { HeroSection } from "@/components/marketing/hero-section";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { StatsSection } from "@/components/marketing/stats-section";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { TrustedStrip } from "@/components/marketing/trusted-strip";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <TrustedStrip />
      <BenefitsSection />
      <HowItWorks />
      <FeatureBento />
      <TestimonialsSection />
      <CaseHighlightsSection />
      <CtaSection />
    </>
  );
}
