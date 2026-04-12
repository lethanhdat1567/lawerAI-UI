// src/app/not-found.tsx — global 404 (outside route-group layouts)
import Link from "next/link";
import { ArrowLeftIcon, HomeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-16">
      <p className="font-mono text-sm font-medium tracking-widest text-muted-foreground">
        404
      </p>
      <h1 className="font-heading mt-2 text-center text-3xl font-bold tracking-tight sm:text-4xl">
        Không tìm thấy trang
      </h1>
      <p className="mt-4 max-w-md text-center text-muted-foreground">
        Đường dẫn không tồn tại hoặc đã được di chuyển. Kiểm tra lại URL hoặc quay về
        trang chủ.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button render={<Link href="/" />}>
          <HomeIcon className="size-4" data-icon="inline-start" aria-hidden />
          Trang chủ
        </Button>
        <Button variant="outline" render={<Link href="/assistant" />}>
          Trợ lý AI
        </Button>
      </div>
      <Link
        href="/blog"
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <ArrowLeftIcon className="size-4" aria-hidden />
        Đến Blog
      </Link>
    </div>
  );
}
