// src/app/(marketing)/page.tsx
import { BenefitsSection } from "@/app/(marketing)/_components/benefitsSection";
import { CaseHighlightsSection } from "@/app/(marketing)/_components/caseHighlightsSection";
import { CtaSection } from "@/app/(marketing)/_components/ctaSection";
import { FeatureBento } from "@/app/(marketing)/_components/featureBento";
import { HeroSection } from "@/app/(marketing)/_components/heroSection";
import { HowItWorks } from "@/app/(marketing)/_components/howItWorks";
import { StatsSection } from "@/app/(marketing)/_components/statsSection";
import { TestimonialsSection } from "@/app/(marketing)/_components/testimonialsSection";
import { TrustedStrip } from "@/app/(marketing)/_components/trustedStrip";

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
