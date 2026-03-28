// src/components/marketing/benefits-section.tsx
"use client";

import { ClockIcon, FileSearchIcon, LockIcon, ShieldCheckIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const benefits = [
  {
    title: "Có nguồn rõ ràng",
    body: "Mỗi gợi ý kèm trích dẫn văn bản để bạn tự đối chiếu.",
    icon: FileSearchIcon,
  },
  {
    title: "An toàn ngữ cảnh",
    body: "Luôn nhắc: thông tin mang tính tham khảo, không thay luật sư.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Phản hồi nhanh",
    body: "RAG tối ưu cho câu hỏi pháp lý thường gặp tại Việt Nam.",
    icon: ClockIcon,
  },
  {
    title: "Quyền riêng tư",
    body: "Bạn kiểm soát dữ liệu chia sẻ; không bán hồ sơ cho bên thứ ba.",
    icon: LockIcon,
  },
] as const;

export function BenefitsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-b border-border px-5 py-14 sm:py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-reading text-center md:mx-0 md:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
            Lợi ích
          </p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Pháp lý dễ tiếp cận, không hy sinh độ tin cậy.
          </h2>
        </div>

        <motion.ul
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {benefits.map(({ title, body, icon: Icon }) => (
            <motion.li
              key={title}
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-md transition-colors hover:border-primary/25"
            >
              <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-primary/10 text-primary">
                <Icon className="size-4" aria-hidden />
              </span>
              <h3 className="mt-4 font-heading text-base font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
