// src/components/marketing/cta-section.tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";

export function CtaSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative px-5 py-16 sm:py-20 md:py-24">
      <motion.div
        className="relative mx-auto max-w-3xl overflow-hidden rounded-[1.75rem] border border-border bg-card/50 px-8 py-12 text-center shadow-sm backdrop-blur-xl sm:px-10 sm:py-14 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset,0_32px_100px_-40px_oklch(0.55_0.2_285/0.45)]"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-64px" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(oklch(0.72 0.2 285 / 0.12) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />
        <div className="relative">
          {/* Quote Section tinh chỉnh */}
          <p className="text-sm font-medium italic leading-relaxed text-foreground/90">
            &ldquo;Pháp luật cần được hiểu đúng, hiểu đủ và trích dẫn thực. Đó
            là tiêu chuẩn duy nhất chúng tôi đặt ra tại LawyerAI.&rdquo;
          </p>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            — Lê Thành Đạt · Founder
          </p>

          <h2 className="mt-10 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Bắt đầu cùng{" "}
            <span className="bg-gradient-to-r from-primary to-[oklch(0.78_0.16_300)] bg-clip-text text-transparent">
              LawyerAI
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground leading-relaxed">
            Tham gia cộng đồng pháp lý minh bạch. Truy xuất dữ liệu nguồn và
            thảo luận chuyên sâu ngay hôm nay.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-[0_0_28px_-4px_oklch(0.72_0.2_285/0.65)] transition-[transform,box-shadow] hover:scale-[1.02] hover:shadow-[0_0_36px_-4px_oklch(0.72_0.2_285/0.8)]"
            >
              Trải nghiệm miễn phí
            </Link>
            <Link
              href="/hub"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-muted/40 px-8 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-border"
            >
              Khám phá Hub
              <ArrowRightIcon className="ml-2 size-4" />
            </Link>
          </div>

          <p className="mt-6 text-[12px] font-medium text-muted-foreground">
            Hệ thống đã hỗ trợ hơn{" "}
            <span className="font-bold text-foreground tracking-tighter text-sm">
              2.400+
            </span>{" "}
            truy vấn pháp lý
          </p>
        </div>
      </motion.div>
    </section>
  );
}
