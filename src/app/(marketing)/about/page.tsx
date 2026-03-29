// src/app/(marketing)/about/page.tsx
import Link from "next/link";
import { ArrowUpRightIcon, BookOpenIcon, MessageSquareIcon, ScaleIcon } from "lucide-react";

import { AboutPageLayout } from "@/app/(marketing)/about/_components/aboutPageLayout";
import { ArticleBody } from "@/components/article/articleBody";

const pillars = [
  {
    href: "/assistant",
    title: "Tra cứu có nguồn",
    description:
      "Mô tả tình huống, nhận gợi ý điều luật liên quan kèm trích dẫn và ngữ cảnh tra cứu.",
    icon: ScaleIcon,
  },
  {
    href: "/hub",
    title: "Không gian Hub",
    description:
      "Thảo luận tình huống thật với cộng đồng; AI thư ký tóm tắt và gợi ý đối chiếu.",
    icon: MessageSquareIcon,
  },
  {
    href: "/blog",
    title: "Blog đã kiểm chứng",
    description:
      "Bài chuyên sâu có nhãn Verified khi đối chiếu được CSDL pháp hiện hành.",
    icon: BookOpenIcon,
  },
] as const;

const missionCopy = `Chúng tôi kết nối **công nghệ** với **nguồn pháp lý rõ ràng** để giảm rào cản tiếp cận thông tin — đặc biệt cho người chưa quen tra cứu văn bản.

Mục tiêu không phải đưa ra kết luận pháp lý cuối cùng, mà giúp bạn **định hướng đọc đúng điều khoản**, chuẩn bị tốt hơn khi làm việc với chuyên gia.`;

export default function AboutPage() {
  return (
    <AboutPageLayout
      title="Giới thiệu"
      description="LawyerAI kết nối tra cứu pháp lý có nguồn, thảo luận cộng đồng và nội dung đã kiểm chứng — luôn là tham khảo, không thay thế luật sư."
    >
      <section aria-labelledby="about-pillars-heading">
        <h2
          id="about-pillars-heading"
          className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl"
        >
          Ba trụ cột sản phẩm
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
                Khám phá
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
          Sứ mệnh
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
              Nội dung trên LawyerAI (tra cứu, Hub, blog) chỉ mang tính{" "}
              <strong className="text-foreground">tham khảo</strong>, không phải
              tư vấn pháp lý cá nhân hay quyết định của cơ quan nhà nước.
            </li>
            <li>
              Vụ việc có tranh chấp, hình sự, hoặc hậu quả pháp lý nghiêm trọng —
              bạn nên liên hệ <strong className="text-foreground">luật sư</strong>{" "}
              hoặc cơ quan có thẩm quyền.
            </li>
            <li>
              Văn bản pháp luật thay đổi theo thời gian; hãy luôn đối chiếu với
              CSDL và văn bản gốc tại thời điểm áp dụng.
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="about-legal-heading">
        <h2
          id="about-legal-heading"
          className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl"
        >
          Pháp lý &amp; minh bạch
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:border-primary/40 hover:text-primary"
          >
            Privacy
            <ArrowUpRightIcon className="size-3.5 opacity-70" aria-hidden />
          </Link>
          <Link
            href="/terms"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:border-primary/40 hover:text-primary"
          >
            Điều khoản
            <ArrowUpRightIcon className="size-3.5 opacity-70" aria-hidden />
          </Link>
          <Link
            href="/what-is-verified"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:border-primary/40 hover:text-primary"
          >
            Verified là gì
            <ArrowUpRightIcon className="size-3.5 opacity-70" aria-hidden />
          </Link>
        </div>
      </section>
    </AboutPageLayout>
  );
}
