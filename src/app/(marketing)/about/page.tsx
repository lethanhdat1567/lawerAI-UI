// src/app/(marketing)/about/page.tsx
import Link from "next/link";
import {
  ArrowUpRightIcon,
  BookOpenIcon,
  MessageSquareIcon,
  ScaleIcon,
} from "lucide-react";

import { AboutPageLayout } from "@/app/(marketing)/about/_components/aboutPageLayout";
import { ArticleBody } from "@/components/article/articleBody";

const pillars = [
  {
    href: "/assistant",
    title: "Tra cứu nguồn dẫn",
    description:
      "Phân tích tình huống bằng công nghệ RAG, truy xuất điều luật liên quan kèm trích dẫn văn bản gốc tức thời.",
    icon: ScaleIcon,
  },
  {
    href: "/hub",
    title: "Cộng đồng hỏi đáp",
    description:
      "Không gian thảo luận thực tế; AI thư ký hỗ trợ tóm tắt luồng tư duy và gợi ý đối soát pháp lý nhanh.",
    icon: MessageSquareIcon,
  },
  {
    href: "/blog",
    title: "Nội dung Verified",
    description:
      "Hệ thống bài viết chuyên sâu được kiểm chứng và đối soát trực tiếp với cơ sở dữ liệu luật hiện hành.",
    icon: BookOpenIcon,
  },
] as const;

const missionCopy = `Chúng tôi kết nối sức mạnh của **trí tuệ nhân tạo** với **nguồn dữ liệu pháp lý xác thực** để xóa bỏ rào cản thông tin cho mọi cá nhân và doanh nghiệp.

Mục tiêu của LawyerAI không phải là thay thế luật sư, mà là cung cấp **điểm tựa dữ liệu chuẩn xác**, giúp bạn định hướng đúng lộ trình pháp lý trước khi làm việc với chuyên gia.`;

export default function AboutPage() {
  return (
    <AboutPageLayout
      title="Về chúng tôi"
      description="LawyerAI là nền tảng kết hợp tra cứu nguồn dẫn thực, thảo luận cộng đồng và nội dung kiểm chứng — luôn là tham khảo, không thay thế luật sư."
    >
      <section aria-labelledby="about-pillars-heading">
        <h2
          id="about-pillars-heading"
          className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl"
        >
          Ba trụ cột cốt lõi
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {pillars.map(({ href, title, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col rounded-2xl border border-border bg-card/45 p-5 backdrop-blur-md transition-[border-color,box-shadow] sm:p-6 hover:border-primary/30 hover:shadow-[0_0_40px_-16px_oklch(0.55_0.18_285/0.35)]"
            >
              <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-heading text-lg font-bold text-foreground group-hover:text-primary">
                {title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Truy cập ngay
                <ArrowUpRightIcon className="size-4" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="about-mission-heading">
        <h2
          id="about-mission-heading"
          className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl"
        >
          Sứ mệnh LawyerAI
        </h2>
        <div className="mt-6 max-w-reading rounded-2xl border border-border bg-card/35 p-6 backdrop-blur-sm sm:p-8">
          <ArticleBody body={missionCopy} />
        </div>
      </section>

      <section className="mt-14" aria-labelledby="about-disclaimer-heading">
        <h2
          id="about-disclaimer-heading"
          className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl"
        >
          Giới hạn trách nhiệm
        </h2>
        <div className="mt-6 rounded-2xl border border-border bg-card/45 p-6 backdrop-blur-md sm:p-8">
          <ul className="list-inside list-disc space-y-3 text-sm leading-relaxed text-muted-foreground marker:text-primary">
            <li>
              Mọi nội dung (tra cứu, Hub, Blog) đều vận hành dựa trên thuật toán
              AI và chỉ mang tính chất{" "}
              <strong className="text-foreground">tham khảo dữ liệu</strong>,
              không phải tư vấn pháp lý chính thức.
            </li>
            <li>
              Đối với các vụ việc hình sự hoặc tranh chấp có giá trị lớn, bạn
              bắt buộc phải liên hệ{" "}
              <strong className="text-foreground">luật sư chuyên môn</strong> để
              được bảo vệ quyền lợi hợp pháp.
            </li>
            <li>
              Pháp luật thay đổi liên tục; hệ thống khuyến nghị bạn luôn đối
              soát với văn bản gốc tại thời điểm áp dụng thực tế.
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="about-legal-heading">
        <h2
          id="about-legal-heading"
          className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl"
        >
          Pháp lý & Minh bạch
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:border-primary/40 hover:text-primary"
          >
            Quyền riêng tư
            <ArrowUpRightIcon className="size-3.5 opacity-70" aria-hidden />
          </Link>
          <Link
            href="/terms"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:border-primary/40 hover:text-primary"
          >
            Điều khoản sử dụng
            <ArrowUpRightIcon className="size-3.5 opacity-70" aria-hidden />
          </Link>
          <Link
            href="/what-is-verified"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:border-primary/40 hover:text-primary"
          >
            Tiêu chuẩn Verified
            <ArrowUpRightIcon className="size-3.5 opacity-70" aria-hidden />
          </Link>
        </div>
      </section>
    </AboutPageLayout>
  );
}
