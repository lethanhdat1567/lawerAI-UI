"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

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
  adminPatchUser,
  adminUsersList,
  type AdminUserRow,
  type UserRoleCode,
} from "@/lib/admin/adminApi";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;
const ROLES: UserRoleCode[] = ["USER", "VERIFIED_LAWYER", "ADMIN"];

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("vi-VN");
  } catch {
    return iso;
  }
}

export function AdminUsersManage() {
  const [items, setItems] = useState<AdminUserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [qDraft, setQDraft] = useState("");
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRoleCode | "">("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminUsersList({
        page,
        pageSize: PAGE_SIZE,
        q: q.trim() || undefined,
        role: roleFilter || undefined,
      });
      setItems(res.items);
      setTotal(res.total);
    } catch (e) {
      toast.error(
        e instanceof ApiError ? e.message : "Không tải được danh sách.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, q, roleFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveRole(row: AdminUserRow, role: UserRoleCode) {
    if (row.role === role) return;
    setSavingId(row.id);
    try {
      await adminPatchUser(row.id, role);
      toast.success("Đã cập nhật vai trò.");
      await load();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Cập nhật thất bại.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1 flex flex-col">
          <label
            htmlFor="admin-users-q"
            className="text-xs text-muted-foreground"
          >
            Tìm email / username
          </label>
          <Input
            id="admin-users-q"
            value={qDraft}
            onChange={(e) => setQDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setQ(qDraft);
                setPage(1);
              }
            }}
            placeholder="Tìm…"
            className="w-[220px]"
          />
        </div>
        <div className="space-y-1">
          <span className="block text-xs text-muted-foreground">Vai trò</span>
          <select
            className={cn(
              "h-9 rounded-md border border-input bg-background px-2 text-sm",
            )}
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as UserRoleCode | "");
              setPage(1);
            }}
          >
            <option value="">Tất cả</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Ngày tạo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Loader2Icon className="size-4 animate-spin" />
                    Đang tải…
                  </span>
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  Không có bản ghi.
                </TableCell>
              </TableRow>
            ) : (
              items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.email}</TableCell>
                  <TableCell>
                    <select
                      className="h-8 rounded border border-input bg-background px-2 text-xs"
                      value={row.role}
                      disabled={savingId === row.id}
                      onChange={(e) => {
                        void saveRole(row, e.target.value as UserRoleCode);
                      }}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>{row.username ?? "—"}</TableCell>
                  <TableCell>{formatDate(row.createdAt)}</TableCell>
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
        ariaLabel="Phân trang người dùng admin"
      />
    </div>
  );
}
