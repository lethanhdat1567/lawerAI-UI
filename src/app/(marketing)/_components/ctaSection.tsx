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
          <p className="text-sm italic text-muted-foreground">
            &ldquo;Lần đầu tôi hiểu rõ điều luật đất đai của mình.&rdquo;
          </p>
          <p className="mt-2 text-xs text-muted-foreground">— Người dùng thử</p>

          <h2 className="mt-10 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Tham gia{" "}
            <span className="bg-gradient-to-r from-primary to-[oklch(0.78_0.16_300)] bg-clip-text text-transparent">
              LawyerAI
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Tạo tài khoản hoặc mở Hub — luôn kèm nhắc nhở pháp lý phù hợp.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-[0_0_28px_-4px_oklch(0.72_0.2_285/0.65)] transition-[transform,box-shadow] hover:scale-[1.02] hover:shadow-[0_0_36px_-4px_oklch(0.72_0.2_285/0.8)]"
            >
              Đăng ký miễn phí
            </Link>
            <Link
              href="/hub"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-muted/40 px-8 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-border"
            >
              Xem Hub
              <ArrowRightIcon className="ml-2 size-4" />
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Đã có hơn{" "}
            <span className="font-semibold text-foreground">2.400</span> người đăng
            ký
          </p>
        </div>
      </motion.div>
    </section>
  );
}
