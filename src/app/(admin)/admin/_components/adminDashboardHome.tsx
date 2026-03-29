// src/app/(admin)/admin/_components/adminDashboardHome.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/errors";
import { adminStats, type AdminStats } from "@/lib/admin/adminApi";

import {
  AdminMetricCard,
  buildAdminMetricItemsFromStats,
  type AdminDashboardMetricItem,
} from "./adminMetricCard";
import { AdminPlatformActivityChart } from "./adminPlatformActivityChart";

function formatInt(n: number): string {
  return n.toLocaleString("vi-VN");
}

export function AdminDashboardHome() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { stats: s } = await adminStats();
      setStats(s);
    } catch (e) {
      const msg =
        e instanceof ApiError ? e.message : "Không tải được thống kê admin.";
      toast.error(msg);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const items: AdminDashboardMetricItem[] = useMemo(() => {
    if (!stats) return [];
    return buildAdminMetricItemsFromStats(stats, formatInt);
  }, [stats]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {loading && !stats ? (
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
      <AdminPlatformActivityChart />
    </div>
  );
}
