// src/app/(marketing)/contributors/_components/contributorsLeaderboard.tsx
import Link from "next/link";
import { BadgeCheckIcon } from "lucide-react";

import type { ContributorRow } from "@/lib/contributors/types";
import type { ContributorsLeaderboardPeriod } from "@/lib/contributors/fetchLeaderboard";
import { resolvePublicImageUrl } from "@/lib/media/resolvePublicImageUrl";
import { userProfilePath } from "@/lib/user/profilePath";

function initialsFor(row: ContributorRow): string {
  if (row.contributorOptOut) return "•";
  const base =
    row.displayName?.trim() ||
    row.username
      .split(/[-_.]/)
      .map((p) => p[0])
      .join("")
      .slice(0, 2) ||
    row.username.slice(0, 2);
  const letters = base.replace(/[^a-zA-ZÀ-ỹ0-9]/g, "").slice(0, 2);
  return letters.toUpperCase() || "LA";
}

function displayLabel(row: ContributorRow): { primary: string; sub?: string } {
  if (row.contributorOptOut) {
    return { primary: "Thành viên ẩn danh" };
  }
  return {
    primary: row.displayName?.trim() || row.username,
    sub: row.displayName?.trim() ? `@${row.username}` : undefined,
  };
}

function avatarSrcFor(row: ContributorRow): string | null {
  if (row.contributorOptOut) return null;
  return resolvePublicImageUrl(row.avatarUrl);
}

interface ContributorsLeaderboardProps {
  rows: ContributorRow[];
  fetchFailed?: boolean;
}

export function ContributorsLeaderboard({
  rows,
  fetchFailed,
}: ContributorsLeaderboardProps) {
  return (
    <section className="mt-14" aria-labelledby="contributors-board-heading">
      <h2
        id="contributors-board-heading"
        className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl"
      >
        Bảng vinh danh đóng góp
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Thứ hạng được tính dựa trên tổng điểm tích lũy từ các hoạt động trên hệ
        thống. Nếu bạn chọn chế độ &quot;Ẩn danh&quot;, điểm số và vị trí vẫn
        được bảo lưu nhưng thông tin cá nhân sẽ không hiển thị công khai.
      </p>

      {fetchFailed ? (
        <p className="mt-6 rounded-xl border border-dashed border-destructive/40 bg-destructive/5 px-4 py-8 text-center text-sm text-muted-foreground">
          Rất tiếc, hệ thống không thể tải dữ liệu lúc này. Vui lòng làm mới
          trang hoặc quay lại sau ít phút.
        </p>
      ) : null}

      {!fetchFailed && rows.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-border bg-card/30 px-4 py-12 text-center text-sm text-muted-foreground">
          Bảng xếp hạng hiện đang trống. Hãy là người đầu tiên đóng góp tri thức
          và ghi tên mình tại đây!
        </p>
      ) : null}

      {/* Desktop table */}
      {rows.length > 0 ? (
        <div className="mt-6 hidden overflow-hidden rounded-2xl border border-border bg-card/35 backdrop-blur-sm md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-card/50">
                <th className="px-5 py-3 font-heading font-semibold text-muted-foreground">
                  Hạng
                </th>
                <th className="px-5 py-3 font-heading font-semibold text-muted-foreground">
                  Người đóng góp
                </th>
                <th className="px-5 py-3 font-heading font-semibold text-muted-foreground">
                  Bậc
                </th>
                <th className="px-5 py-3 font-heading font-semibold text-muted-foreground">
                  Điểm
                </th>
                <th className="px-5 py-3 font-heading font-semibold text-muted-foreground">
                  Ghi chú
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const { primary, sub } = displayLabel(row);
                const src = avatarSrcFor(row);
                const profileHref =
                  !row.contributorOptOut && row.username
                    ? userProfilePath(row.username)
                    : null;
                const tierLabel = row.tierLabelVi ?? "—";

                const nameBlock = profileHref ? (
                  <Link
                    href={profileHref}
                    className="transition-colors hover:text-primary"
                  >
                    {primary}
                  </Link>
                ) : (
                  <span>{primary}</span>
                );

                return (
                  <tr
                    key={row.userId}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/60"
                  >
                    <td className="px-5 py-4 font-mono text-muted-foreground tabular-nums">
                      #{row.rank}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {src ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={src}
                            alt=""
                            width={40}
                            height={40}
                            className="size-10 shrink-0 rounded-full border border-border object-cover"
                          />
                        ) : (
                          <span
                            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-primary/15 text-xs font-bold text-primary"
                            aria-hidden
                          >
                            {initialsFor(row)}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {nameBlock}
                          </p>
                          {sub ? (
                            <p className="truncate text-xs text-muted-foreground">
                              {profileHref ? (
                                <Link
                                  href={profileHref}
                                  className="hover:text-primary"
                                >
                                  {sub}
                                </Link>
                              ) : (
                                sub
                              )}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {tierLabel}
                    </td>
                    <td className="px-5 py-4 font-mono tabular-nums text-foreground">
                      {row.score.toLocaleString("vi-VN")}
                    </td>
                    <td className="px-5 py-4">
                      {row.role === "VERIFIED_LAWYER" &&
                      !row.contributorOptOut ? (
                        <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                          <BadgeCheckIcon
                            className="size-3.5 shrink-0"
                            aria-hidden
                          />
                          Luật sư đã xác minh
                        </span>
                      ) : row.contributorOptOut ? (
                        <span className="text-xs text-muted-foreground">
                          Ẩn danh công khai
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* Mobile cards */}
      {rows.length > 0 ? (
        <ul className="mt-6 flex flex-col gap-3 md:hidden">
          {rows.map((row) => {
            const { primary, sub } = displayLabel(row);
            const src = avatarSrcFor(row);
            const profileHref =
              !row.contributorOptOut && row.username
                ? userProfilePath(row.username)
                : null;
            const tierLabel = row.tierLabelVi ?? "—";

            const titleEl = profileHref ? (
              <Link
                href={profileHref}
                className="truncate font-medium text-foreground hover:text-primary"
              >
                {primary}
              </Link>
            ) : (
              <p className="truncate font-medium text-foreground">{primary}</p>
            );

            return (
              <li
                key={row.userId}
                className="rounded-2xl border border-border bg-card/45 p-4 backdrop-blur-md"
              >
                <div className="flex items-start gap-3">
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt=""
                      width={44}
                      height={44}
                      className="size-11 shrink-0 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <span
                      className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-primary/15 text-sm font-bold text-primary"
                      aria-hidden
                    >
                      {initialsFor(row)}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      {titleEl}
                      <span className="shrink-0 font-mono text-sm tabular-nums text-primary">
                        #{row.rank}
                      </span>
                    </div>
                    {sub ? (
                      <p className="truncate text-xs text-muted-foreground">
                        {profileHref ? (
                          <Link
                            href={profileHref}
                            className="hover:text-primary"
                          >
                            {sub}
                          </Link>
                        ) : (
                          sub
                        )}
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs text-muted-foreground">
                      Bậc:{" "}
                      <span className="text-foreground/90">{tierLabel}</span>
                    </p>
                    <p className="mt-2 font-mono text-lg tabular-nums text-foreground">
                      {row.score.toLocaleString("vi-VN")}{" "}
                      <span className="text-xs font-sans font-normal text-muted-foreground">
                        điểm
                      </span>
                    </p>
                    {row.role === "VERIFIED_LAWYER" &&
                    !row.contributorOptOut ? (
                      <span className="mt-2 inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                        <BadgeCheckIcon
                          className="size-3.5 shrink-0"
                          aria-hidden
                        />
                        Luật sư đã xác minh
                      </span>
                    ) : row.contributorOptOut ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Ẩn danh công khai
                      </p>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
