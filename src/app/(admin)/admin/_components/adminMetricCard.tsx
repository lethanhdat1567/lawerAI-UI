// src/app/(admin)/admin/_components/adminMetricCard.tsx
"use client";

import type { LucideIcon } from "lucide-react";
import {
  BadgeCheckIcon,
  BotMessageSquareIcon,
  LayoutListIcon,
  MessagesSquareIcon,
  ShieldCheckIcon,
  UsersIcon,
  UserRoundCheckIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type {
  AdminDashboardSnapshot,
  AdminStats,
} from "@/lib/admin/adminApi";
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

export function buildAdminMetricItemsFromSnapshot(
  snapshot: AdminDashboardSnapshot,
  formatInt: (n: number) => string,
): AdminDashboardMetricItem[] {
  return [
    {
      title: "User · tổng tài khoản",
      hint: "bảng users (active)",
      value: formatInt(snapshot.usersTotal),
      delta: `${formatInt(snapshot.usersEmailVerifiedTotal)} email đã xác thực`,
      positive: true,
      icon: UsersIcon,
    },
    {
      title: "User mới · 7 ngày",
      hint: "tăng trưởng gần đây",
      value: formatInt(snapshot.usersNew7d),
      delta: "Cửa sổ 7 ngày gần nhất",
      positive: true,
      icon: UserRoundCheckIcon,
    },
    {
      title: "LawyerVerification · PENDING",
      hint: "hồ sơ chờ duyệt",
      value: formatInt(snapshot.lawyerVerificationsPending),
      delta: `${formatInt(snapshot.lawyerVerificationsApproved)} hồ sơ đã duyệt`,
      positive: snapshot.lawyerVerificationsPending === 0,
      icon: BadgeCheckIcon,
    },
    {
      title: "BlogPost · PUBLISHED",
      hint: "đã xuất bản",
      value: formatInt(snapshot.blogPostsPublished),
      delta: `${formatInt(snapshot.blogPostsPublishedUnverified)} bài chưa verify`,
      positive: snapshot.blogPostsPublishedUnverified === 0,
      icon: LayoutListIcon,
    },
    {
      title: "Contributors",
      hint: "score > 0",
      value: formatInt(snapshot.contributorsActiveTotal),
      delta: "Số liệu thời gian thực",
      positive: true,
      icon: ShieldCheckIcon,
    },
    {
      title: "Chat",
      hint: "chat_messages / chat_sessions",
      value: `${formatInt(snapshot.chatMessagesTotal)} · ${formatInt(snapshot.chatSessionsTotal)}`,
      delta: "Tin nhắn · Phiên chat",
      positive: true,
      icon: BotMessageSquareIcon,
    },
    {
      title: "Hub — bài & bình luận",
      hint: "hub_posts + hub_comments",
      value: `${formatInt(snapshot.hubPostsTotal)} · ${formatInt(snapshot.hubCommentsTotal)}`,
      delta: "Bài · Bình luận",
      positive: true,
      icon: MessagesSquareIcon,
    },
  ];
}

export function buildAdminMetricItemsFromLegacyStats(
  stats: AdminStats,
  formatInt: (n: number) => string,
): AdminDashboardMetricItem[] {
  return [
    {
      title: "User · tổng tài khoản",
      hint: "fallback từ payload cũ",
      value: formatInt(stats.usersTotal),
      delta: "Dữ liệu tương thích ngược",
      positive: true,
      icon: UsersIcon,
    },
    {
      title: "LawyerVerification · PENDING",
      hint: "fallback từ payload cũ",
      value: formatInt(stats.lawyerVerificationsPending),
      delta: "Dữ liệu tương thích ngược",
      positive: stats.lawyerVerificationsPending === 0,
      icon: BadgeCheckIcon,
    },
    {
      title: "Hub — bài & bình luận",
      hint: "fallback từ payload cũ",
      value: `${formatInt(stats.hubPostsTotal)} · ${formatInt(stats.hubCommentsTotal)}`,
      delta: "Bài · Bình luận",
      positive: true,
      icon: MessagesSquareIcon,
    },
    {
      title: "BlogPost · PUBLISHED",
      hint: "fallback từ payload cũ",
      value: formatInt(stats.blogPostsPublished),
      delta: "Dữ liệu tương thích ngược",
      positive: true,
      icon: LayoutListIcon,
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
