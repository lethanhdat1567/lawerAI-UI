// src/app/(admin)/admin/_components/adminPlatformActivityChart.tsx
"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type {
  AdminDashboardRange,
  AdminDashboardTimeseriesPoint,
} from "@/lib/admin/adminApi";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const overviewChartConfig = {
  chatMessages: {
    label: "ChatMessage",
    color: "var(--chart-1)",
  },
  hubComments: {
    label: "HubComment",
    color: "var(--chart-2)",
  },
  hubPosts: {
    label: "HubPost",
    color: "var(--chart-4)",
  },
  blogPublished: {
    label: "BlogPost · Published",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

const RANGE_OPTIONS = [
  { id: "3m" as const, label: "3 tháng" },
  { id: "30d" as const, label: "30 ngày" },
  { id: "7d" as const, label: "7 ngày" },
] as const;

function formatBucketLabel(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

type AdminPlatformActivityChartProps = {
  range: AdminDashboardRange;
  timeseries: AdminDashboardTimeseriesPoint[];
  loading?: boolean;
  onRangeChange: (range: AdminDashboardRange) => void;
};

export function AdminPlatformActivityChart({
  range,
  timeseries,
  loading = false,
  onRangeChange,
}: AdminPlatformActivityChartProps) {
  const chartData = React.useMemo(
    () =>
      timeseries.map((item) => ({
        ...item,
        label: formatBucketLabel(item.bucketStart),
      })),
    [timeseries],
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Hoạt động nền tảng</CardTitle>
          <CardDescription>
            Dữ liệu thật từ dashboard backend theo{" "}
            <span className="font-medium text-foreground/80">chatMessages</span>,{" "}
            <span className="font-medium text-foreground/80">hubPosts</span>,{" "}
            <span className="font-medium text-foreground/80">hubComments</span>,{" "}
            <span className="font-medium text-foreground/80">blogPublished</span>.
          </CardDescription>
        </div>
        <div className="flex shrink-0 rounded-none border border-border bg-muted/40 p-0.5">
          {RANGE_OPTIONS.map((item) => (
            <Button
              key={item.id}
              type="button"
              variant={range === item.id ? "secondary" : "ghost"}
              size="xs"
              className={cn("rounded-none px-2.5", range === item.id && "shadow-sm")}
              onClick={() => onRangeChange(item.id)}
              disabled={loading}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pl-2 pr-2 pt-0 sm:pl-4 sm:pr-4">
        <ChartContainer
          config={overviewChartConfig}
          className="aspect-auto h-[320px] w-full min-w-0"
          initialDimension={{ width: 900, height: 320 }}
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 8, right: 8, top: 12, bottom: 8 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "currentColor", fontSize: 11 }}
              className="text-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={40}
              tick={{ fill: "currentColor", fontSize: 11 }}
              className="text-muted-foreground"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="blogPublished"
              type="monotone"
              fill="var(--color-blogPublished)"
              fillOpacity={0.12}
              stroke="var(--color-blogPublished)"
              strokeWidth={1.5}
            />
            <Area
              dataKey="hubComments"
              type="monotone"
              fill="var(--color-hubComments)"
              fillOpacity={0.08}
              stroke="var(--color-hubComments)"
              strokeWidth={1.5}
            />
            <Area
              dataKey="hubPosts"
              type="monotone"
              fill="var(--color-hubPosts)"
              fillOpacity={0.12}
              stroke="var(--color-hubPosts)"
              strokeWidth={1.5}
            />
            <Area
              dataKey="chatMessages"
              type="monotone"
              stroke="var(--color-chatMessages)"
              strokeWidth={2}
              fill="var(--color-chatMessages)"
              fillOpacity={0.08}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
