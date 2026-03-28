// src/components/marketing/how-it-works.tsx
"use client";

import type { ReactNode } from "react";
import { PenLineIcon, SparklesIcon, UsersIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface Step {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "01",
    icon: <PenLineIcon className="size-4" aria-hidden />,
    title: "Mô tả tình huống",
    description:
      "Viết ngắn gọn vấn đề pháp lý — không cần biết số điều luật cụ thể.",
  },
  {
    number: "02",
    icon: <SparklesIcon className="size-4" aria-hidden />,
    title: "AI trích dẫn điều khoản",
    description:
      "RAG trả về điều luật liên quan, có nguồn và thời điểm tra cứu.",
  },
  {
    number: "03",
    icon: <UsersIcon className="size-4" aria-hidden />,
    title: "Thảo luận & kiểm chứng",
    description:
      "Đăng Hub để cộng đồng bổ sung; bài đủ chuẩn được nhãn Verified.",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HowItWorks() {
  const reduceMotion = useReducedMotion();

  const grid = (
    <div className="grid gap-5 md:grid-cols-3 md:gap-6">
      {steps.map((step) => (
        <motion.div
          key={step.number}
          variants={reduceMotion ? undefined : itemVariants}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card/45 p-6 backdrop-blur-md transition-[border-color,box-shadow] hover:border-primary/30 hover:shadow-[0_0_40px_-12px_oklch(0.55_0.18_285/0.35)] md:p-7"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-primary/15 blur-2xl transition-opacity group-hover:opacity-100" />
          <div className="relative flex items-start justify-between gap-3">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-primary/90">
              {step.number}
            </span>
            <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-muted/60 text-foreground">
              {step.icon}
            </span>
          </div>
          <p className="relative mt-5 font-heading text-lg font-bold tracking-tight">
            {step.title}
          </p>
          <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
            {step.description}
          </p>
        </motion.div>
      ))}
    </div>
  );

  return (
    <section className="border-b border-border px-5 py-14 sm:py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-reading text-center md:mx-0 md:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
            Cách hoạt động
          </p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ba bước, một luồng rõ ràng.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Từ câu chuyện của bạn đến điều luật có căn cứ.
          </p>
        </div>

        <div className="mt-12">
          {reduceMotion ? (
            grid
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-48px" }}
            >
              {grid}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
