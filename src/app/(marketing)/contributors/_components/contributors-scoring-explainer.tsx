// src/app/(marketing)/contributors/_components/contributors-scoring-explainer.tsx
import { REPUTATION_REASON_EXPLAINERS } from "@/lib/contributors/reputation-reasons";

export function ContributorsScoringExplainer() {
  return (
    <section aria-labelledby="contributors-scoring-heading">
      <h2
        id="contributors-scoring-heading"
        className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl"
      >
        Điểm đóng góp đến từ đâu?
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Hệ thống ghi nhận thay đổi điểm qua sổ cái uy tín (
        <span className="font-mono text-xs text-foreground/80">ReputationLedger</span>
        ), với các lý do sau. Số điểm cụ thể mỗi hành động có thể điều chỉnh theo quy tắc
        nền tảng.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REPUTATION_REASON_EXPLAINERS.map(({ code, title, description }) => (
          <article
            key={code}
            className="rounded-2xl border border-border bg-card/45 p-5 backdrop-blur-md sm:p-6"
          >
            <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground/90">
              {code}
            </p>
            <h3 className="mt-2 font-heading text-base font-bold text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
