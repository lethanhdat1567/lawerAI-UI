// src/app/(marketing)/layout.tsx
import { SiteFooter } from "@/components/layout/siteFooter";
import { SiteHeader } from "@/components/layout/siteHeader";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 xtract-grid mask-[linear-gradient(180deg,black_40%,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_90%_55%_at_50%_-8%,oklch(0.55_0.14_285/0.12),transparent_58%)] dark:bg-[radial-gradient(ellipse_90%_55%_at_50%_-8%,oklch(0.22_0.04_285/0.14),transparent_58%)]"
      />
      <SiteHeader />
      <main className="relative flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
