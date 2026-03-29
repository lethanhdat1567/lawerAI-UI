// src/app/(admin)/admin/_components/adminPlatformActivityChart.tsx
"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

/** Minh họa — API timeseries admin có thể bổ sung sau. */
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

export function AdminPlatformActivityChart() {
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
        <div className="flex shrink-0 rounded-none border border-border bg-muted/40 p-0.5">
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
              className={cn("rounded-none px-2.5", range === item.id && "shadow-sm")}
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
