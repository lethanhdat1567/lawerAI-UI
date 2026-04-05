export function ContributorsScoringExplainer() {
  return (
    <section
      aria-labelledby="contributors-scoring-heading"
      className="rounded-2xl border border-border bg-card/45 p-5 backdrop-blur-md sm:p-6 mt-10"
    >
      <h2
        id="contributors-scoring-heading"
        className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl"
      >
        Cơ chế ghi nhận đóng góp
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Hệ thống điểm thưởng vinh danh những giá trị thực tế mà bạn chia sẻ và
        lan tỏa trong cộng đồng LawyerAI.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <article className="rounded-xl border border-border bg-background/70 p-4">
          <p className="text-2xl font-bold text-foreground">+50</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            Mỗi bài viết chuyên sâu được xuất bản
          </p>
        </article>
        <article className="rounded-xl border border-border bg-background/70 p-4">
          <p className="text-2xl font-bold text-foreground">+10</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            Mỗi lượt yêu thích dành cho bài viết
          </p>
        </article>
        <article className="rounded-xl border border-border bg-background/70 p-4">
          <p className="text-2xl font-bold text-foreground">+5</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            Mỗi lượt tương tác hữu ích trên Hub & Blog
          </p>
        </article>
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Để đảm bảo tính công bằng, điểm số được cập nhật theo trạng thái thực tế
        của nội dung. Nếu bài viết hoặc tương tác bị gỡ bỏ, hệ thống sẽ tự động
        điều chỉnh lại điểm tích lũy tương ứng.
      </p>
    </section>
  );
}
