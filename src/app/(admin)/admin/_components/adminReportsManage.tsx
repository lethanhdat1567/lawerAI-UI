"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
  adminPatchReport,
  adminReportsList,
  type AdminReportRow,
} from "@/lib/admin/adminApi";

const PAGE_SIZE = 20;

type StatusTab = "" | "OPEN" | "ACTIONED" | "DISMISSED";

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString("vi-VN");
  } catch {
    return iso;
  }
}

export function AdminReportsManage() {
  const [items, setItems] = useState<AdminReportRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusTab, setStatusTab] = useState<StatusTab>("OPEN");
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminReportsList({
        page,
        pageSize: PAGE_SIZE,
        status: statusTab || undefined,
      });
      setItems(res.items);
      setTotal(res.total);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Không tải được báo cáo.");
    } finally {
      setLoading(false);
    }
  }, [page, statusTab]);

  useEffect(() => {
    void load();
  }, [load]);

  async function setStatus(id: string, status: "ACTIONED" | "DISMISSED") {
    setActingId(id);
    try {
      await adminPatchReport(id, { status });
      toast.success("Đã cập nhật.");
      await load();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Thao tác thất bại.");
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["", "OPEN", "ACTIONED", "DISMISSED"] as StatusTab[]).map((s) => (
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
            {s === "" ? "Tất cả" : s}
          </Button>
        ))}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loại / đích</TableHead>
              <TableHead>Lý do</TableHead>
              <TableHead>Người gửi</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Tạo</TableHead>
              <TableHead className="w-[160px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>Không có báo cáo.</TableCell>
              </TableRow>
            ) : (
              items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-sm">
                    <div className="font-medium">{row.targetType}</div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {row.targetId}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm" title={row.reason}>
                    {row.reason}
                  </TableCell>
                  <TableCell className="text-sm">
                    {row.reporter.email}
                    <div className="text-xs text-muted-foreground">
                      @{row.reporter.username ?? "—"}
                    </div>
                  </TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell className="text-sm">{formatWhen(row.createdAt)}</TableCell>
                  <TableCell>
                    {row.status === "OPEN" ? (
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          className="h-7 text-xs"
                          disabled={actingId === row.id}
                          onClick={() => void setStatus(row.id, "ACTIONED")}
                        >
                          Đã xử lý
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          disabled={actingId === row.id}
                          onClick={() => void setStatus(row.id, "DISMISSED")}
                        >
                          Bác bỏ
                        </Button>
                      </div>
                    ) : (
                      "—"
                    )}
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
        ariaLabel="Phân trang báo cáo"
      />
    </div>
  );
}
