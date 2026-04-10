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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pagination } from "@/components/pagination/pagination";
import { ApiError } from "@/lib/api/errors";
import {
  adminLawyerVerificationsList,
  adminPatchLawyerVerification,
  type AdminLawyerVerificationRow,
} from "@/lib/admin/adminApi";
const PAGE_SIZE = 15;

type StatusTab = "" | "PENDING" | "APPROVED" | "REJECTED" | "REVOKED";

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString("vi-VN");
  } catch {
    return iso;
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "PENDING":
      return "Chờ duyệt";
    case "APPROVED":
      return "Đã duyệt";
    case "REJECTED":
      return "Đã từ chối";
    case "REVOKED":
      return "Đã thu hồi";
    default:
      return status;
  }
}

export function AdminVerificationsManage() {
  const [items, setItems] = useState<AdminLawyerVerificationRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusTab, setStatusTab] = useState<StatusTab>("PENDING");
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<AdminLawyerVerificationRow | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminLawyerVerificationsList({
        page,
        pageSize: PAGE_SIZE,
        status: statusTab || undefined,
      });
      setItems(res.items);
      setTotal(res.total);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Không tải được hồ sơ.");
    } finally {
      setLoading(false);
    }
  }, [page, statusTab]);

  useEffect(() => {
    void load();
  }, [load]);

  async function act(id: string, status: "APPROVED" | "REJECTED" | "REVOKED") {
    setActing(true);
    try {
      await adminPatchLawyerVerification(id, {
        status,
        note: noteDraft.trim() || undefined,
      });
      toast.success("Đã cập nhật.");
      setDetail(null);
      setNoteDraft("");
      await load();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Thao tác thất bại.");
    } finally {
      setActing(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(
          ["", "PENDING", "APPROVED", "REJECTED", "REVOKED"] as StatusTab[]
        ).map((s) => (
          <Button
            key={s || "all"}
            type="button"
            size="sm"
            variant={statusTab === s ? "default" : "outline"}
            onClick={() => {
              setStatusTab(s);
              setPage(1);
            }}
          >
            {s === "" ? "Tất cả" : getStatusLabel(s)}
          </Button>
        ))}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người nộp</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Tạo lúc</TableHead>
              <TableHead className="w-[100px]">Chi tiết</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  <Loader2Icon className="size-4 animate-spin" />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>Không có hồ sơ.</TableCell>
              </TableRow>
            ) : (
              items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="text-sm font-medium">{row.user.email}</div>
                    <div className="text-xs text-muted-foreground">
                      @{row.user.username ?? "—"}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusLabel(row.status)}</TableCell>
                  <TableCell className="text-sm">
                    {formatWhen(row.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDetail(row);
                        setNoteDraft(row.note ?? "");
                      }}
                    >
                      Mở
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        page={page}
        totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        onPageChange={setPage}
        ariaLabel="Phân trang xác minh"
      />

      <AlertDialog
        open={detail != null}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
      >
        <AlertDialogContent className="flex w-[min(calc(100vw-2rem),42rem)] max-w-2xl flex-col gap-4 p-4 sm:p-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác minh luật sư</AlertDialogTitle>
          </AlertDialogHeader>
          {detail ? (
            <div className="flex max-h-[70vh] flex-1 flex-col gap-3 overflow-y-auto pr-1 text-sm">
              <p>
                <span className="text-muted-foreground">Người dùng:</span>{" "}
                {detail.user.email}
              </p>
              <p>
                <span className="text-muted-foreground">Trạng thái:</span>{" "}
                {getStatusLabel(detail.status)}
              </p>
              <p>
                <span className="text-muted-foreground">
                  Khu vực hành nghề:
                </span>{" "}
                {detail.jurisdiction ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Số thẻ luật sư:</span>{" "}
                {detail.barNumber ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Công ty luật:</span>{" "}
                {detail.firmName ?? "—"}
              </p>
              <div className="space-y-1">
                <label
                  htmlFor="ver-note"
                  className="text-xs text-muted-foreground"
                >
                  Ghi chú (tùy chọn)
                </label>
                <Input
                  id="ver-note"
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Lý do / ghi chú…"
                />
              </div>
              <div className="mt-auto flex flex-wrap gap-2 border-t pt-4">
                {detail.status === "PENDING" ? (
                  <>
                    <Button
                      size="sm"
                      disabled={acting}
                      onClick={() => void act(detail.id, "APPROVED")}
                    >
                      Duyệt
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={acting}
                      onClick={() => void act(detail.id, "REJECTED")}
                    >
                      Từ chối
                    </Button>
                  </>
                ) : null}
                {detail.status === "APPROVED" ? (
                  <>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={acting}
                      onClick={() => setDetail(null)}
                    >
                      Hủy
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={acting}
                      onClick={() => void act(detail.id, "REVOKED")}
                    >
                      Thu hồi
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
