// src/components/marketing/hero-section.tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRightIcon } from "lucide-react";

function HeroStarfield() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.45]"
      style={{
        backgroundImage: [
          "radial-gradient(1px 1px at 8% 12%, rgba(255,255,255,0.55), transparent)",
          "radial-gradient(1px 1px at 22% 78%, rgba(255,255,255,0.35), transparent)",
          "radial-gradient(1px 1px at 38% 28%, rgba(255,255,255,0.5), transparent)",
          "radial-gradient(1px 1px at 52% 88%, rgba(255,255,255,0.3), transparent)",
          "radial-gradient(1px 1px at 64% 18%, rgba(255,255,255,0.45), transparent)",
          "radial-gradient(1px 1px at 78% 62%, rgba(255,255,255,0.4), transparent)",
          "radial-gradient(1px 1px at 91% 35%, rgba(255,255,255,0.35), transparent)",
          "radial-gradient(1px 1px at 15% 48%, rgba(255,255,255,0.25), transparent)",
          "radial-gradient(1px 1px at 45% 52%, rgba(255,255,255,0.2), transparent)",
          "radial-gradient(1px 1px at 72% 92%, rgba(255,255,255,0.28), transparent)",
        ].join(","),
        backgroundSize: "100% 100%",
      }}
    />
  );
}

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-background px-5 pt-20 pb-24 sm:pt-28 sm:pb-32 md:pt-32 md:pb-40 dark:bg-black">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_28%,oklch(0.52_0.22_285/0.18),transparent_68%)] dark:bg-[radial-gradient(ellipse_75%_55%_at_50%_28%,oklch(0.52_0.22_285/0.42),transparent_68%)]"
      />
      <div className="hidden dark:block">
        <HeroStarfield />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(1.2px_1.2px_at_50%_50%,oklch(0_0_0/0.08)_50%,transparent_51%)] [background-size:56px_56px] opacity-[0.35] dark:bg-[radial-gradient(1.2px_1.2px_at_50%_50%,oklch(1_0_0/0.06)_50%,transparent_51%)] dark:opacity-50"
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 inline-flex items-center rounded-full border border-border bg-muted/80 p-1 pl-1 shadow-sm backdrop-blur-md dark:border-white/12 dark:bg-white/[0.06] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]"
        >
          <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
            Mới
          </span>
          <span className="px-2 py-1 text-xs font-medium text-foreground/90 sm:px-3 sm:text-sm dark:text-white/85">
            <span className="sm:hidden">Tra cứu · Hub · Blog</span>
            <span className="hidden sm:inline">
              Tra cứu có trích dẫn · Hub · Blog đã kiểm chứng
            </span>
          </span>
        </motion.div>

        <motion.h1
          className="font-heading text-[2rem] font-bold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-5xl sm:leading-[1.08] md:text-[3.25rem] md:leading-[1.06] dark:text-white"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          Tra cứu pháp lý thông minh, minh bạch và dễ hiểu.
        </motion.h1>

        <motion.p
          className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-relaxed dark:text-white/75"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          LawyerAI đưa AI pháp lý tới tận tay bạn — tra cứu có nguồn, thảo luận
          trên Hub và đọc nội dung đã kiểm chứng; luôn là tham khảo, không thay
          tư vấn luật sư.
        </motion.p>

        <motion.div
          className="mt-12 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.18,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Link
            href="/assistant"
            className="inline-flex h-12 w-full max-w-[16.5rem] items-center justify-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_0_40px_-8px_oklch(0.62_0.22_285/0.85)] transition-[transform,box-shadow] hover:scale-[1.02] hover:shadow-[0_0_48px_-6px_oklch(0.68_0.2_285/0.95)] sm:w-auto"
          >
            Bắt đầu tra cứu
            <ArrowUpRightIcon className="size-4 shrink-0" aria-hidden />
          </Link>
          <Link
            href="/hub"
            className="inline-flex h-12 w-full max-w-[16.5rem] items-center justify-center rounded-xl border border-border bg-transparent px-7 text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:w-auto dark:border-white/20 dark:text-white dark:hover:border-white/35 dark:hover:bg-white/[0.04]"
          >
            Mở Hub
          </Link>
        </motion.div>

        <motion.p
          className="mt-8 text-sm text-muted-foreground dark:text-white/55"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={reduceMotion ? undefined : { opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.22 }}
        >
          Miễn phí thử · Không cần thẻ
        </motion.p>
      </div>
    </section>
  );
}
