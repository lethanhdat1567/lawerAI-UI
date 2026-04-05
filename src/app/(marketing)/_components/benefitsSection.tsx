// src/components/marketing/benefits-section.tsx
"use client";

import {
  ClockIcon,
  FileSearchIcon,
  LockIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const benefits = [
  {
    title: "Minh bạch nguồn dẫn",
    body: "Không có sự mơ hồ. Mọi phản hồi từ AI đều đi kèm trích dẫn văn bản luật chính xác để bạn đối soát tức thời.",
    icon: FileSearchIcon,
  },
  {
    title: "Phạm vi an toàn",
    body: "Chúng tôi đề cao tính chuẩn xác. LawyerAI đóng vai trò trợ lý sàng lọc thông tin trước khi bạn làm việc với luật sư.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Tốc độ xử lý RAG",
    body: "Thay vì đọc hàng trăm trang tài liệu, hệ thống quét và tổng hợp dữ liệu pháp luật Việt Nam chỉ trong vài giây.",
    icon: ClockIcon,
  },
  {
    title: "Bảo mật tuyệt đối",
    body: "Dữ liệu của bạn là tài sản riêng tư. Chúng tôi cam kết không lưu trữ hoặc khai thác hồ sơ cho mục đích thương mại.",
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
