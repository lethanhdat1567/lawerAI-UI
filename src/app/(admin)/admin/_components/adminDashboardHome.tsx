// src/app/(admin)/admin/_components/adminDashboardHome.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2Icon, TriangleAlertIcon } from "lucide-react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/errors";
import {
  adminStats,
  type AdminDashboardData,
  type AdminDashboardQueues,
  type AdminDashboardRange,
  type AdminDashboardSnapshot,
  type AdminStats,
} from "@/lib/admin/adminApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AdminMetricCard,
  buildAdminMetricItemsFromLegacyStats,
  buildAdminMetricItemsFromSnapshot,
  type AdminDashboardMetricItem,
} from "./adminMetricCard";
import { AdminPlatformActivityChart } from "./adminPlatformActivityChart";

function formatInt(n: number): string {
  return n.toLocaleString("vi-VN");
}

function buildFallbackSnapshot(stats: AdminStats): AdminDashboardSnapshot {
  return {
    usersTotal: stats.usersTotal,
    usersNew7d: 0,
    usersEmailVerifiedTotal: 0,
    lawyerVerificationsPending: stats.lawyerVerificationsPending,
    lawyerVerificationsApproved: 0,
    blogPostsPublished: stats.blogPostsPublished,
    blogPostsPublishedUnverified: 0,
    hubPostsTotal: stats.hubPostsTotal,
    hubCommentsTotal: stats.hubCommentsTotal,
    contributorsActiveTotal: 0,
    chatMessagesTotal: 0,
    chatSessionsTotal: 0,
    legacyAssistantMessagesTotal: stats.assistantMessagesTotal,
  };
}

function buildFallbackQueues(stats: AdminStats): AdminDashboardQueues {
  return {
    lawyerVerificationsPending: stats.lawyerVerificationsPending,
    blogPostsPublishedUnverified: 0,
    usersNew7d: 0,
  };
}

function QueueCard({
  title,
  hint,
  value,
  positive,
}: {
  title: string;
  hint: string;
  value: string;
  positive: boolean;
}) {
  return (
    <Card size="sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            <CardDescription className="text-[11px]">{hint}</CardDescription>
          </div>
          <TriangleAlertIcon
            className={
              positive ? "size-4 text-emerald-500" : "size-4 text-amber-500"
            }
            aria-hidden
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold tabular-nums tracking-tight">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminDashboardHome() {
  const [range, setRange] = useState<AdminDashboardRange>("30d");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (nextRange: AdminDashboardRange) => {
    setLoading(true);
    try {
      const data = await adminStats({ range: nextRange, granularity: "day" });
      setStats(data.stats);
      setDashboard(data.dashboard ?? null);
      setRange(data.dashboard?.range ?? nextRange);
    } catch (e) {
      const msg =
        e instanceof ApiError ? e.message : "Không tải được thống kê admin.";
      toast.error(msg);
      setStats(null);
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(range);
  }, [load, range]);

  const snapshot = useMemo(
    () => dashboard?.snapshot ?? (stats ? buildFallbackSnapshot(stats) : null),
    [dashboard, stats],
  );

  const queues = useMemo(
    () => dashboard?.queues ?? (stats ? buildFallbackQueues(stats) : null),
    [dashboard, stats],
  );

  const items: AdminDashboardMetricItem[] = useMemo(() => {
    if (snapshot) return buildAdminMetricItemsFromSnapshot(snapshot, formatInt);
    if (stats) return buildAdminMetricItemsFromLegacyStats(stats, formatInt);
    return [];
  }, [snapshot, stats]);

  const queueItems = useMemo(() => {
    if (!queues) return [];
    return [
      {
        title: "Luật sư chờ duyệt",
        hint: "backlog xác minh hiện tại",
        value: formatInt(queues.lawyerVerificationsPending),
        positive: queues.lawyerVerificationsPending === 0,
      },
      {
        title: "Blog chưa verify",
        hint: "đã publish nhưng chưa xác thực",
        value: formatInt(queues.blogPostsPublishedUnverified),
        positive: queues.blogPostsPublishedUnverified === 0,
      },
      {
        title: "User mới 7 ngày",
        hint: "nguồn vào gần đây cần theo dõi",
        value: formatInt(queues.usersNew7d),
        positive: true,
      },
    ];
  }, [queues]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {loading && !snapshot ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" aria-hidden />
          Đang tải số liệu…
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
        {items.map((m) => (
          <AdminMetricCard key={m.title} {...m} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hàng chờ xử lý</CardTitle>
          <CardDescription>
            Các đầu việc admin cần ưu tiên theo backend dashboard mới.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {queueItems.map((item) => (
            <QueueCard key={item.title} {...item} />
          ))}
        </CardContent>
      </Card>

      <AdminPlatformActivityChart
        range={range}
        timeseries={dashboard?.timeseries ?? []}
        loading={loading}
        onRangeChange={setRange}
      />
    </div>
  );
}
