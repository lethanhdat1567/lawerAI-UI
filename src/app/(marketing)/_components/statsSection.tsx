// src/components/marketing/stats-section.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Stat {
  prefix?: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
}

const stats: Stat[] = [
  {
    value: 1200,
    suffix: "+",
    label: "Văn bản pháp",
    description: "Đã index để tra cứu",
  },
  {
    value: 500,
    suffix: "+",
    label: "Thảo luận",
    description: "Mỗi tuần trên Hub",
  },
  {
    value: 98,
    suffix: "%",
    label: "Có trích dẫn",
    description: "Kèm nguồn & timestamp",
  },
  {
    prefix: "< ",
    value: 2,
    suffix: "s",
    label: "Phản hồi",
    description: "Trung bình mỗi lượt",
  },
];

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const count = useCountUp(stat.value, 1200, active);
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-5 text-center backdrop-blur-md transition-colors hover:border-primary/25 hover:bg-card/60 sm:text-left">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative">
        <p className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {stat.prefix ?? ""}
          <span>{active ? count.toLocaleString("vi-VN") : "0"}</span>
          <span className="text-primary">{stat.suffix}</span>
        </p>
        <p className="mt-2 text-sm font-semibold text-foreground">{stat.label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
      </div>
    </div>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-72px" });

  return (
    <section ref={ref} className="border-y border-border py-12 sm:py-14">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-5 md:grid-cols-4 md:gap-5">
        {stats.map((stat) => (
          <StatItem key={stat.label} stat={stat} active={inView} />
        ))}
      </div>
    </section>
  );
}
