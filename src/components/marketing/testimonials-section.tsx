// src/components/marketing/testimonials-section.tsx
"use client";

import { QuoteIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const quotes = [
  {
    text: "Cuối cùng tôi biết phải đọc điều luật nào trước khi làm việc với UBND.",
    name: "Chị Minh · Hà Nội",
    role: "Chủ hộ",
  },
  {
    text: "Hub giúp mình thấy góc nhìn khác nhưng vẫn có nguồn để kiểm.",
    name: "An Khôi · TP.HCM",
    role: "Founder",
  },
  {
    text: "Blog Verified là nơi mình gửi link cho khách hàng đọc thêm.",
    name: "LS. thực hành · Ẩn danh",
    role: "Luật sư",
  },
] as const;

export function TestimonialsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-b border-border px-5 py-14 sm:py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-reading text-center md:mx-0 md:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
            Đánh giá
          </p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Người dùng nói gì
          </h2>
        </div>

        <motion.div
          className="mt-12 grid gap-5 md:grid-cols-3"
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.09 } },
          }}
        >
          {quotes.map((q) => (
            <motion.blockquote
              key={q.name}
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="relative flex flex-col rounded-2xl border border-border bg-gradient-to-b from-card/60 to-card/30 p-6 backdrop-blur-md"
            >
              <QuoteIcon
                className="size-8 text-primary/40"
                aria-hidden
              />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/95">
                &ldquo;{q.text}&rdquo;
              </p>
              <footer className="mt-5 border-t border-border pt-4">
                <p className="text-sm font-semibold text-foreground">{q.name}</p>
                <p className="text-xs text-muted-foreground">{q.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
