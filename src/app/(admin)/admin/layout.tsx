// src/app/(admin)/admin/layout.tsx
import type { Metadata } from "next";

import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";

export const metadata: Metadata = {
  title: "Admin",
  description: "Bảng điều khiển quản trị LawyerAI.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </div>
  );
}
