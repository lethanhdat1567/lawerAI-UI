// src/lib/site-config.ts
export interface NavItem {
  href: string;
  label: string;
}

export const siteName = "LawyerAI";

export const mainNavItems: NavItem[] = [
  { href: "/assistant", label: "Tra cứu" },
  { href: "/hub", label: "Thảo luận" },
  { href: "/blog", label: "Blog" },
  { href: "/contributors", label: "Tôn vinh" },
  { href: "/about", label: "Giới thiệu" },
];

export const footerProduct: NavItem[] = [
  { href: "/assistant", label: "Trợ lý tra cứu" },
  { href: "/hub", label: "Không gian Hub" },
  { href: "/blog", label: "Kho tri thức" },
];

export const footerLegal: NavItem[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Điều khoản" },
  { href: "/what-is-verified", label: "Verified là gì" },
];
