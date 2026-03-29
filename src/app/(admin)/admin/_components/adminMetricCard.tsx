// src/app/(admin)/admin/_components/adminMetricCard.tsx
"use client";

import type { LucideIcon } from "lucide-react";
import {
  BadgeCheckIcon,
  FlagIcon,
  LayoutListIcon,
  MessagesSquareIcon,
  Sparkles,
  UsersIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { AdminStats } from "@/lib/admin/adminApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface AdminDashboardMetricItem {
  title: string;
  hint: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: LucideIcon;
}

export function buildAdminMetricItemsFromStats(
  stats: AdminStats,
  formatInt: (n: number) => string,
): AdminDashboardMetricItem[] {
  return [
    {
      title: "User · tổng tài khoản",
      hint: "bảng users (active)",
      value: formatInt(stats.usersTotal),
      delta: "Số liệu thời gian thực",
      positive: true,
      icon: UsersIcon,
    },
    {
      title: "LawyerVerification · PENDING",
      hint: "hồ sơ chờ duyệt",
      value: formatInt(stats.lawyerVerificationsPending),
      delta: "Số liệu thời gian thực",
      positive: stats.lawyerVerificationsPending === 0,
      icon: BadgeCheckIcon,
    },
    {
      title: "Hub — bài & bình luận",
      hint: "hub_posts + hub_comments",
      value: `${formatInt(stats.hubPostsTotal)} · ${formatInt(stats.hubCommentsTotal)}`,
      delta: "Bài · Bình luận",
      positive: true,
      icon: MessagesSquareIcon,
    },
    {
      title: "Report · OPEN",
      hint: "báo cáo chưa xử lý",
      value: formatInt(stats.reportsOpen),
      delta: "Số liệu thời gian thực",
      positive: stats.reportsOpen === 0,
      icon: FlagIcon,
    },
    {
      title: "BlogPost · PUBLISHED",
      hint: "bài blog đã xuất bản",
      value: formatInt(stats.blogPostsPublished),
      delta: "Số liệu thời gian thực",
      positive: true,
      icon: LayoutListIcon,
    },
    {
      title: "AssistantMessage",
      hint: "tin nhắn tra cứu (tổng)",
      value: formatInt(stats.assistantMessagesTotal),
      delta: "Số liệu thời gian thực",
      positive: true,
      icon: Sparkles,
    },
  ];
}

export function AdminMetricCard({
  title,
  hint,
  value,
  delta,
  positive,
  icon: Icon,
}: AdminDashboardMetricItem) {
  return (
    <Card>
      <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <p className="text-[11px] text-muted-foreground/80">{hint}</p>
        </div>
        <Icon className="size-4 shrink-0 text-muted-foreground/70" aria-hidden />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums tracking-tight">{value}</div>
        <p
          className={cn(
            "mt-1 text-xs font-medium",
            positive ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400",
          )}
        >
          {delta}
        </p>
      </CardContent>
    </Card>
  );
}
