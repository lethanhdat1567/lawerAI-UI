"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/pagination/pagination";
import { ApiError } from "@/lib/api/errors";
import {
  adminReputationAdjust,
  adminReputationLedger,
  type AdminReputationLedgerRow,
  type ReputationReasonCode,
} from "@/lib/admin/reputationApi";

const PAGE_SIZE = 20;

const REASON_OPTIONS: { value: ReputationReasonCode; label: string }[] = [
  { value: "ADMIN_BONUS", label: "ADMIN_BONUS — Thưởng" },
  { value: "ADMIN_PENALTY", label: "ADMIN_PENALTY — Phạt" },
  { value: "MOD_ADJUSTMENT", label: "MOD_ADJUSTMENT — Kiểm duyệt" },
  { value: "HUB_REPLY_HELPFUL", label: "HUB_REPLY_HELPFUL — Hub (tham chiếu)" },
  { value: "BLOG_QUALITY", label: "BLOG_QUALITY — Blog / tham chiếu bài" },
  {
    value: "BLOG_COMMENT_HELPFUL",
    label: "BLOG_COMMENT_HELPFUL — Bình luận blog",
  },
];

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function refsCell(row: AdminReputationLedgerRow): string {
  const parts: string[] = [];
  if (row.refHubCommentId) parts.push(`hubC:${row.refHubCommentId.slice(0, 8)}…`);
  if (row.refBlogPostId) parts.push(`blog:${row.refBlogPostId.slice(0, 8)}…`);
  if (row.refBlogCommentId)
    parts.push(`blogC:${row.refBlogCommentId.slice(0, 8)}…`);
  return parts.length ? parts.join(" ") : "—";
}

export function AdminReputationManage() {
  const [items, setItems] = useState<AdminReputationLedgerRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterUserId, setFilterUserId] = useState("");
  const [filterDraft, setFilterDraft] = useState("");

  const [adjUserId, setAdjUserId] = useState("");
  const [adjDelta, setAdjDelta] = useState("0");
  const [adjReason, setAdjReason] = useState<ReputationReasonCode>("ADMIN_BONUS");
  const [adjRefHub, setAdjRefHub] = useState("");
  const [adjRefBlogPost, setAdjRefBlogPost] = useState("");
  const [adjRefBlogComment, setAdjRefBlogComment] = useState("");
  const [adjSaving, setAdjSaving] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminReputationLedger({
        page,
        pageSize: PAGE_SIZE,
        userId: filterUserId.trim() || undefined,
      });
      setItems(res.items);
      setTotal(res.total);
    } catch (e) {
      const msg =
        e instanceof ApiError ? e.message : "Không tải được sổ cái uy tín.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [page, filterUserId]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  const adminOnlyReason =
    adjReason === "ADMIN_BONUS" || adjReason === "ADMIN_PENALTY";

  async function submitAdjust(e: React.FormEvent) {
    e.preventDefault();
    const delta = Number.parseInt(adjDelta, 10);
    if (!adjUserId.trim()) {
      toast.error("Nhập userId.");
      return;
    }
    if (!Number.isFinite(delta) || delta === 0) {
      toast.error("Delta phải là số nguyên khác 0.");
      return;
    }
    setAdjSaving(true);
    try {
      const body: Parameters<typeof adminReputationAdjust>[0] = {
        userId: adjUserId.trim(),
        delta,
        reason: adjReason,
      };
      if (!adminOnlyReason) {
        body.refHubCommentId = adjRefHub.trim() || null;
        body.refBlogPostId = adjRefBlogPost.trim() || null;
        body.refBlogCommentId = adjRefBlogComment.trim() || null;
      }
      const res = await adminReputationAdjust(body);
      setLastScore(res.score);
      toast.success(`Đã ghi nhận. Điểm tích lũy: ${res.score}`);
      setPage(1);
      const refreshed = await adminReputationLedger({
        page: 1,
        pageSize: PAGE_SIZE,
        userId: filterUserId.trim() || undefined,
      });
      setItems(refreshed.items);
      setTotal(refreshed.total);
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Không áp dụng được điều chỉnh.";
      toast.error(msg);
    } finally {
      setAdjSaving(false);
    }
  }

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-border bg-card/40 p-6">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Điều chỉnh điểm
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Gọi <span className="font-mono text-xs">POST /admin/reputation/adjust</span>.
          Thưởng/phạt quản trị không dùng tham chiếu (theo API).
        </p>
        <form onSubmit={(ev) => void submitAdjust(ev)} className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="rep-user" className="text-sm font-medium text-foreground">
              User ID (cuid)
            </label>
            <Input
              id="rep-user"
              value={adjUserId}
              onChange={(e) => setAdjUserId(e.target.value)}
              placeholder="clxxx…"
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="rep-delta" className="text-sm font-medium text-foreground">
              Delta (+/-)
            </label>
            <Input
              id="rep-delta"
              value={adjDelta}
              onChange={(e) => setAdjDelta(e.target.value)}
              inputMode="numeric"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <span className="text-sm font-medium text-foreground">Lý do</span>
            <select
              value={adjReason}
              onChange={(e) =>
                setAdjReason(e.target.value as ReputationReasonCode)
              }
              className="flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {REASON_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          {!adminOnlyReason ? (
            <>
              <div className="space-y-2">
                <label htmlFor="ref-hub" className="text-sm font-medium text-foreground">
                  refHubCommentId (tuỳ chọn)
                </label>
                <Input
                  id="ref-hub"
                  value={adjRefHub}
                  onChange={(e) => setAdjRefHub(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="ref-post" className="text-sm font-medium text-foreground">
                  refBlogPostId (tuỳ chọn)
                </label>
                <Input
                  id="ref-post"
                  value={adjRefBlogPost}
                  onChange={(e) => setAdjRefBlogPost(e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="ref-bc" className="text-sm font-medium text-foreground">
                  refBlogCommentId (tuỳ chọn)
                </label>
                <Input
                  id="ref-bc"
                  value={adjRefBlogComment}
                  onChange={(e) => setAdjRefBlogComment(e.target.value)}
                />
              </div>
            </>
          ) : null}
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <Button type="submit" disabled={adjSaving}>
              {adjSaving ? (
                <Loader2Icon className="size-4 animate-spin" aria-hidden />
              ) : null}
              Áp dụng
            </Button>
            {lastScore !== null ? (
              <span className="text-sm text-muted-foreground">
                Điểm sau thao tác:{" "}
                <span className="font-mono text-foreground">{lastScore}</span>
              </span>
            ) : null}
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-2">
            <label htmlFor="ledger-filter" className="text-sm font-medium text-foreground">
              Lọc theo userId
            </label>
            <Input
              id="ledger-filter"
              value={filterDraft}
              onChange={(e) => setFilterDraft(e.target.value)}
              placeholder="Để trống = tất cả"
              className="w-72 max-w-full"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setFilterUserId(filterDraft.trim());
              setPage(1);
            }}
          >
            Lọc
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thời điểm</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Delta</TableHead>
                <TableHead>Lý do</TableHead>
                <TableHead>Tham chiếu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                    <Loader2Icon className="mx-auto size-6 animate-spin" aria-hidden />
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Không có bản ghi.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="whitespace-nowrap text-sm">
                      {formatWhen(row.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-mono text-xs text-foreground/90">
                          {row.userId.slice(0, 12)}…
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {row.username ? `@${row.username}` : row.email}
                      </div>
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono text-sm ${row.delta >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}
                    >
                      {row.delta >= 0 ? "+" : ""}
                      {row.delta}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{row.reason}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                      {refsCell(row)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {total > PAGE_SIZE ? (
          <Pagination
            page={page}
            totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
            onPageChange={setPage}
            ariaLabel="Phân trang sổ cái uy tín"
          />
        ) : null}
      </section>
    </div>
  );
}
