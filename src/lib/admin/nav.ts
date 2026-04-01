// src/lib/admin/nav.ts — mục sidebar dashboard admin (bám schema Prisma)

import type { LucideIcon } from "lucide-react";
import {
  Bot,
  FileText,
  LayoutDashboard,
  MessagesSquare,
  Scale,
  Tags,
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
  { title: "Hub", href: "/admin/hub", icon: MessagesSquare },
  { title: "Hub Categories", href: "/admin/hub-categories", icon: Tags },
  { title: "Blog", href: "/admin/blog", icon: FileText },
  { title: "Blog Tags", href: "/admin/blog-tags", icon: Tags },
  { title: "Bảng xếp hạng", href: "/admin/leaderboard", icon: Trophy },
  { title: "Crawl", href: "/admin/crawl", icon: Bot },
];
