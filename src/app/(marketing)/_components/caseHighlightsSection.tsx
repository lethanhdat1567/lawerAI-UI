// src/components/marketing/case-highlights-section.tsx
"use client";

import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const cases = [
  {
    title: "Tranh chấp đất đai",
    outcome: "3 điều luật then chốt + hướng làm việc với chính quyền",
    tag: "Tra cứu",
    href: "/assistant",
  },
  {
    title: "Hợp đồng lao động",
    outcome: "Checklist kỳ hạn & điều khoản thường gặp trong startup",
    tag: "Blog",
    href: "/blog",
  },
  {
    title: "Thảo luận có nguồn",
    outcome: "Cộng đồng Hub bổ sung án lệ và NĐ liên quan",
    tag: "Hub",
    href: "/hub",
  },
] as const;

export function CaseHighlightsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-b border-border px-5 py-14 sm:py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
              Ví dụ thực tế
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
              Một vài kịch bản phổ biến
            </h2>
          </div>
          <Link
            href="/assistant"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Thử ngay
            <ArrowUpRightIcon className="size-4" />
          </Link>
        </div>

        <motion.ul
          className="mt-10 grid gap-4 md:grid-cols-3"
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {cases.map((c) => (
            <motion.li
              key={c.title}
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              <Link
                href={c.href}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-md transition-[border-color,box-shadow] hover:border-primary/30 hover:shadow-[0_0_40px_-14px_oklch(0.55_0.18_285/0.35)]"
              >
                <span className="w-fit rounded-full border border-border bg-muted/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {c.tag}
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {c.outcome}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Xem chi tiết
                  <ArrowUpRightIcon className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
