// src/lib/admin/nav.ts — mục sidebar dashboard admin (bám schema Prisma)

import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpen,
  FileText,
  Flag,
  LayoutDashboard,
  MessagesSquare,
  Scale,
  Trophy,
  Users,
} from "lucide-react";

export type AdminNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const adminNavMain: AdminNavItem[] = [
  { title: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { title: "Người dùng", href: "/admin/users", icon: Users },
  { title: "Xác minh luật sư", href: "/admin/verifications", icon: Scale },
  { title: "Báo cáo", href: "/admin/reports", icon: Flag },
  { title: "Hub", href: "/admin/hub", icon: MessagesSquare },
  { title: "Blog", href: "/admin/blog", icon: FileText },
  { title: "Uy tín", href: "/admin/reputation", icon: Award },
  { title: "Bảng xếp hạng", href: "/admin/leaderboard", icon: Trophy },
  { title: "Nguồn pháp lý", href: "/admin/legal-sources", icon: BookOpen },
];
