// src/app/layout.tsx
import type { Metadata } from "next";

import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "LawyerAI — Tra cứu pháp lý & cộng đồng",
    template: "%s · LawyerAI",
  },
  description:
    "Tra cứu điều luật liên quan, thảo luận Hub với AI thư ký, blog đã kiểm chứng — tham khảo, không thay tư vấn luật sư.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
