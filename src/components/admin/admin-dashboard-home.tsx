// src/components/admin/admin-dashboard-home.tsx
"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  BadgeCheckIcon,
  FlagIcon,
  LayoutListIcon,
  MessagesSquareIcon,
  UsersIcon,
} from "lucide-react";

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

/** Minh họa theo prisma/schema.prisma — thay bằng API thật khi có admin stats. */
const overviewChartData = [
  { label: "4 T1", assistantMessages: 120, hubPosts: 42, blogPublished: 18 },
  { label: "8 T1", assistantMessages: 132, hubPosts: 38, blogPublished: 21 },
  { label: "12 T1", assistantMessages: 158, hubPosts: 51, blogPublished: 19 },
  { label: "16 T1", assistantMessages: 141, hubPosts: 47, blogPublished: 24 },
  { label: "20 T1", assistantMessages: 176, hubPosts: 55, blogPublished: 22 },
  { label: "24 T1", assistantMessages: 168, hubPosts: 49, blogPublished: 26 },
  { label: "28 T1", assistantMessages: 189, hubPosts: 61, blogPublished: 28 },
  { label: "2 T2", assistantMessages: 201, hubPosts: 58, blogPublished: 31 },
  { label: "8 T2", assistantMessages: 195, hubPosts: 63, blogPublished: 27 },
  { label: "14 T2", assistantMessages: 218, hubPosts: 67, blogPublished: 33 },
  { label: "20 T2", assistantMessages: 205, hubPosts: 64, blogPublished: 30 },
  { label: "28 T3", assistantMessages: 232, hubPosts: 72, blogPublished: 36 },
];

const overviewChartConfig = {
  assistantMessages: {
    label: "AssistantMessage (tin nhắn tra cứu)",
    color: "var(--chart-1)",
  },
  hubPosts: {
    label: "HubPost (bài Hub)",
    color: "var(--chart-4)",
  },
  blogPublished: {
    label: "BlogPost · PUBLISHED",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

const metricCards = [
  {
    title: "User · tổng tài khoản",
    hint: "bảng users",
    value: "12.480",
    delta: "+4,2% so với tháng trước (mock)",
    positive: true,
    icon: UsersIcon,
  },
  {
    title: "LawyerVerification · PENDING",
    hint: "hồ sơ chờ duyệt",
    value: "38",
    delta: "−6 so với tuần trước (mock)",
    positive: true,
    icon: BadgeCheckIcon,
  },
  {
    title: "Hub — bài & bình luận",
    hint: "hub_posts + hub_comments (ước lượng)",
    value: "4.902",
    delta: "+12,8% so với tháng trước (mock)",
    positive: true,
    icon: MessagesSquareIcon,
  },
  {
    title: "Report · OPEN",
    hint: "báo cáo kiểm duyệt chưa xử lý",
    value: "17",
    delta: "+3 so với tuần trước (mock)",
    positive: false,
    icon: FlagIcon,
  },
  {
    title: "BlogPost · PUBLISHED",
    hint: "bài blog đã xuất bản",
    value: "624",
    delta: "+2,1% so với tháng trước (mock)",
    positive: true,
    icon: LayoutListIcon,
  },
] as const;

function MetricCard({
  title,
  hint,
  value,
  delta,
  positive,
  icon: Icon,
}: (typeof metricCards)[number]) {
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
            positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
          )}
        >
          {delta}
        </p>
      </CardContent>
    </Card>
  );
}

function PlatformActivityChart() {
  const [range, setRange] = React.useState<"3m" | "30d" | "7d">("3m");

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Hoạt động nền tảng (mock)</CardTitle>
          <CardDescription>
            Chuỗi minh hoạ theo{" "}
            <span className="font-medium text-foreground/80">AssistantMessage</span>,{" "}
            <span className="font-medium text-foreground/80">HubPost</span>,{" "}
            <span className="font-medium text-foreground/80">BlogPost</span> — cửa sổ:{" "}
            {range === "3m" ? "3 tháng" : range === "30d" ? "30 ngày" : "7 ngày"}.
          </CardDescription>
        </div>
        <div className="flex shrink-0 rounded-lg border border-border bg-muted/40 p-0.5">
          {(
            [
              { id: "3m" as const, label: "3 tháng" },
              { id: "30d" as const, label: "30 ngày" },
              { id: "7d" as const, label: "7 ngày" },
            ] as const
          ).map((item) => (
            <Button
              key={item.id}
              type="button"
              variant={range === item.id ? "secondary" : "ghost"}
              size="xs"
              className={cn("rounded-md px-2.5", range === item.id && "shadow-sm")}
              onClick={() => setRange(item.id)}
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
            data={overviewChartData}
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey="blogPublished"
              type="monotone"
              fill="var(--color-blogPublished)"
              fillOpacity={0.14}
              stroke="transparent"
            />
            <Area
              dataKey="hubPosts"
              type="monotone"
              fill="var(--color-hubPosts)"
              fillOpacity={0.2}
              stroke="transparent"
            />
            <Area
              dataKey="assistantMessages"
              type="monotone"
              stroke="var(--color-assistantMessages)"
              strokeWidth={2}
              fill="var(--color-assistantMessages)"
              fillOpacity={0.08}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function AdminDashboardHome() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {metricCards.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>
      <PlatformActivityChart />
    </div>
  );
}
