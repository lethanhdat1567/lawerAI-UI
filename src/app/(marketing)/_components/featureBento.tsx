// src/components/marketing/feature-bento.tsx
"use client";

import type { ReactNode } from "react";
import {
  BookOpenIcon,
  CheckCircle2Icon,
  MessageSquareIcon,
  ScaleIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

interface FeatureCard {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
  preview?: ReactNode;
}

function RagPreview() {
  const results = [
    { law: "Điều 175 BLDS 2015", match: 94 },
    { law: "NĐ 43/2014/NĐ-CP §3", match: 87 },
    { law: "Luật Đất đai 2024 §13", match: 76 },
  ];
  return (
    <div className="mt-5 space-y-2 rounded-xl border border-border bg-muted/50 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Nguồn dẫn tham chiếu
      </p>
      {results.map((r) => (
        <div key={r.law} className="flex items-center gap-3">
          <CheckCircle2Icon
            className="size-3.5 shrink-0 text-primary"
            aria-hidden
          />
          <span className="flex-1 truncate text-xs text-foreground/90 font-medium">
            {r.law}
          </span>
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {r.match}%
          </span>
        </div>
      ))}
    </div>
  );
}

const features: FeatureCard[] = [
  {
    title: "Truy xuất nguồn dẫn thực",
    description:
      "Phân tích tình huống dựa trên dữ liệu RAG. Hệ thống tự động trích xuất các điều khoản liên quan kèm thời điểm ban hành mới nhất.",
    icon: <ScaleIcon className="size-4" aria-hidden />,
    className: "md:col-span-2",
    preview: <RagPreview />,
  },
  {
    title: "Trợ lý ảo cho cộng đồng",
    description:
      "Tối ưu hóa thảo luận cộng đồng bằng AI thư ký. Tóm tắt nội dung chính và gợi ý đối chiếu văn bản pháp luật ngay trong luồng chat.",
    icon: <MessageSquareIcon className="size-4" aria-hidden />,
  },
  {
    title: "Kiểm chứng chuyên sâu",
    description:
      "Mọi bài viết trên Blog đều được đối soát với cơ sở dữ liệu pháp luật hiện hành và gắn nhãn Verified bởi chuyên gia.",
    icon: <ShieldCheckIcon className="size-4" aria-hidden />,
  },
  {
    title: "Tư duy phản biện công khai",
    description:
      "Khuyến khích đóng góp tri thức với tiêu chí minh bạch. Chúng tôi bảo vệ quyền ẩn danh để đảm bảo tính khách quan trong tranh luận pháp lý.",
    icon: <BookOpenIcon className="size-4" aria-hidden />,
    className: "md:col-span-2",
  },
];

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function FeatureCardItem({ f }: { f: FeatureCard }) {
  return (
    <div
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border border-border bg-card/45 p-6 backdrop-blur-md transition-[border-color,box-shadow] hover:border-primary/25 hover:shadow-[0_0_48px_-16px_oklch(0.55_0.18_285/0.35)] md:p-7",
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-muted/60 text-foreground">
        {f.icon}
      </div>
      <h3 className="relative mt-5 font-heading text-lg font-bold tracking-tight">
        {f.title}
      </h3>
      <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
        {f.description}
      </p>
      {f.preview}
    </div>
  );
}

export function FeatureBento() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-b border-border px-5 py-14 sm:py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-reading text-center md:mx-0 md:text-left">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            Hệ sinh thái LawyerAI
          </p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tighter sm:text-4xl">
            Một nền tảng. Mọi nhu cầu tra cứu và thảo luận.
          </h2>
          <p className="mt-3 text-muted-foreground text-sm">
            Tối giản trải nghiệm phức tạp, tập trung vào dữ liệu có nguồn xác
            thực.
          </p>
        </div>

        {reduceMotion ? (
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className={cn(f.className)}>
                <FeatureCardItem f={f} />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="mt-12 grid gap-5 md:grid-cols-2"
            variants={gridVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-48px" }}
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={cardVariants}
                className={cn(f.className)}
              >
                <FeatureCardItem f={f} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
