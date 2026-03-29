import { MySavedBlogGrid } from "@/app/(marketing)/my/_components/mySavedBlogGrid";

export default function MySavedBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Blog đã lưu
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Các bài bạn đã lưu từ trang Blog — mở bài để bỏ lưu hoặc tương tác
          thêm.
        </p>
      </div>
      <MySavedBlogGrid />
    </div>
  );
}
