// src/app/(marketing)/about/_components/about-page-layout.tsx
import type { ReactNode } from "react";

interface AboutPageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AboutPageLayout({
  title,
  description,
  children,
}: AboutPageLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16 md:py-20">
      <div className="max-w-3xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.65rem] md:leading-tight">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
        <p className="mt-4 rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
          LawyerAI là công cụ{" "}
          <strong className="font-bold text-primary">tham khảo pháp lý</strong> — không
          thay thế tư vấn trực tiếp của luật sư hoặc cơ quan có thẩm quyền.
        </p>
      </div>
      <div className="mt-10">{children}</div>
    </div>
  );
}
