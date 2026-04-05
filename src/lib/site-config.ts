// src/lib/site-config.ts
export interface NavItem {
  href: string;
  label: string;
}

export const siteName = "LawyerAI";

export const mainNavItems: NavItem[] = [
  { href: "/assistant", label: "Trợ lý AI" },
  { href: "/hub", label: "Cộng đồng" },
  { href: "/blog", label: "Bài viết chuyên sâu" },
  { href: "/contributors", label: "Vinh danh" },
  { href: "/about", label: "Giới thiệu" },
];

export const footerProduct: NavItem[] = [
  { href: "/assistant", label: "Trợ lý AI" },
  { href: "/hub", label: "Cộng đồng" },
  { href: "/blog", label: "Bài viết chuyên sâu" },
];

export const footerLegal: NavItem[] = [
  { href: "/privacy", label: "Chính sách bảo mật" },
  { href: "/terms", label: "Điều khoản sử dụng" },
  { href: "/what-is-verified", label: "Tiêu chuẩn xác thực" },
];
