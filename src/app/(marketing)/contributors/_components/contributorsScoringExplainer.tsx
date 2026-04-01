export function ContributorsScoringExplainer() {
  return (
    <section
      aria-labelledby="contributors-scoring-heading"
      className="rounded-2xl border border-border bg-card/45 p-5 backdrop-blur-md sm:p-6"
    >
      <h2
        id="contributors-scoring-heading"
        className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl"
      >
        Cách tính điểm đóng góp
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Điểm trên bảng xếp hạng phản ánh đóng góp hiện tại của mỗi người trên
        nền tảng.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <article className="rounded-xl border border-border bg-background/70 p-4">
          <p className="text-2xl font-bold text-foreground">+50</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            Mỗi bài blog đang công khai
          </p>
        </article>
        <article className="rounded-xl border border-border bg-background/70 p-4">
          <p className="text-2xl font-bold text-foreground">+10</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            Mỗi lượt thích của blog công khai
          </p>
        </article>
        <article className="rounded-xl border border-border bg-background/70 p-4">
          <p className="text-2xl font-bold text-foreground">+5</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            Mỗi lượt thích cho bình luận blog hoặc hub
          </p>
        </article>
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Nếu bài blog không còn công khai hoặc lượt thích bị bỏ, điểm tương ứng
        cũng sẽ được trừ lại. Bảng xếp hạng vì vậy luôn bám theo trạng thái hiện
        tại của nội dung và tương tác.
      </p>
    </section>
  );
}
