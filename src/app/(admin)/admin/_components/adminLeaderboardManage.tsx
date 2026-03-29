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
import { ApiError } from "@/lib/api/errors";
import { adminLeaderboard, type AdminLeaderboardRow } from "@/lib/admin/adminApi";

const PAGE_SIZE = 50;

export function AdminLeaderboardManage() {
  const [items, setItems] = useState<AdminLeaderboardRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminLeaderboard({ limit: PAGE_SIZE, offset });
      setItems(res.items);
      setTotal(res.total);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Không tải được bảng xếp hạng.");
    } finally {
      setLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    void load();
  }, [load]);

  const canPrev = offset > 0;
  const canNext = offset + PAGE_SIZE < total;

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">#</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Bậc</TableHead>
              <TableHead className="text-right">Điểm</TableHead>
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
                <TableCell colSpan={6}>Chưa có dữ liệu điểm.</TableCell>
              </TableRow>
            ) : (
              items.map((row) => (
                <TableRow key={`${row.userId}-${row.rank}`}>
                  <TableCell className="tabular-nums">{row.rank}</TableCell>
                  <TableCell className="text-sm">{row.email}</TableCell>
                  <TableCell>{row.username ?? "—"}</TableCell>
                  <TableCell className="text-xs">{row.userRole}</TableCell>
                  <TableCell className="text-xs">{row.tierLabelVi}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {row.score.toLocaleString("vi-VN")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Hiển thị {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} / {total}
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!canPrev || loading}
            onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
          >
            Trước
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!canNext || loading}
            onClick={() => setOffset((o) => o + PAGE_SIZE)}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}
