// src/app/(marketing)/contributors/_components/contributorsScoringExplainer.tsx
import { CONTRIBUTION_TIER_EXPLAINERS } from "@/lib/contributors/contribution-tiers";
import { REPUTATION_REASON_EXPLAINERS } from "@/lib/contributors/reputation-reasons";

function formatTierRange(
  min: number,
  max: number | null,
): string {
  if (max === null) return `${min.toLocaleString("vi-VN")}+`;
  return `${min.toLocaleString("vi-VN")} – ${max.toLocaleString("vi-VN")}`;
}

export function ContributorsScoringExplainer() {
  return (
    <>
      <section aria-labelledby="contributors-scoring-heading">
        <h2
          id="contributors-scoring-heading"
          className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl"
        >
          Điểm đóng góp đến từ đâu?
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Hệ thống ghi nhận thay đổi điểm qua sổ cái uy tín (
          <span className="font-mono text-xs text-foreground/80">
            ReputationLedger
          </span>
          ), với các lý do sau. Số điểm cụ thể mỗi hành động có thể điều chỉnh theo
          quy tắc nền tảng.
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
              <h3 className="mt-2 font-heading text-base font-bold text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="contributors-tiers-heading">
        <h2
          id="contributors-tiers-heading"
          className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl"
        >
          Bậc xếp loại (theo điểm tích lũy)
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Bậc là nhãn gợi ý theo ngưỡng điểm;{" "}
          <strong className="text-foreground">hạng #</strong> trên bảng vẫn xếp
          theo điểm chính xác giữa mọi người.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONTRIBUTION_TIER_EXPLAINERS.map((t) => (
            <article
              key={t.code}
              className="rounded-2xl border border-border bg-card/45 p-5 backdrop-blur-md sm:p-6"
            >
              <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground/90">
                {formatTierRange(t.minPoints, t.maxPoints)} điểm
              </p>
              <h3 className="mt-2 font-heading text-base font-bold text-foreground">
                {t.labelVi}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
