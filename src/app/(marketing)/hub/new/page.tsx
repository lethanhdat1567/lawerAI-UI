// src/app/(marketing)/hub/new/page.tsx
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { HubNewPostForm } from "@/app/(marketing)/hub/_components/hub-new-post-form";

export default function HubNewPostPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14 md:py-16">
      <Link
        href="/hub"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeftIcon className="size-4" aria-hidden />
        Về Hub
      </Link>
      <header className="mt-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Đăng bài mới
        </h1>
        <p className="mt-3 text-muted-foreground">
          Điền nội dung bên dưới — đây là giao diện demo, chưa lưu xuống server.
        </p>
      </header>
      <div className="mt-10">
        <HubNewPostForm />
      </div>
    </div>
  );
}
