// src/app/(admin)/admin/layout.tsx
import type { Metadata } from "next";

import { AdminLayoutShell } from "@/app/(admin)/admin/_components/adminLayoutShell";

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
