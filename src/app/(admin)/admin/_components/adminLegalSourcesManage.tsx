"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { Loader2Icon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  adminCreateLegalSource,
  adminDeleteLegalSource,
  adminLegalSourcesList,
  adminPatchLegalSource,
  type AdminLegalSourceRow,
} from "@/lib/admin/adminApi";

const PAGE_SIZE = 15;

function toIsoDateInput(iso: string | null): string {
  if (!iso) return "";
  try {
    return iso.slice(0, 10);
  } catch {
    return "";
  }
}

export function AdminLegalSourcesManage() {
  const [items, setItems] = useState<AdminLegalSourceRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [qDraft, setQDraft] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [editRow, setEditRow] = useState<AdminLegalSourceRow | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formJurisdiction, setFormJurisdiction] = useState("");
  const [formFrom, setFormFrom] = useState("");
  const [formTo, setFormTo] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminLegalSourcesList({
        page,
        pageSize: PAGE_SIZE,
        q: q.trim() || undefined,
      });
      setItems(res.items);
      setTotal(res.total);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Không tải được nguồn.");
    } finally {
      setLoading(false);
    }
  }, [page, q]);

  useEffect(() => {
    void load();
  }, [load]);

  function openCreate() {
    setFormTitle("");
    setFormUrl("");
    setFormJurisdiction("");
    setFormFrom("");
    setFormTo("");
    setCreateOpen(true);
  }

  function openEdit(row: AdminLegalSourceRow) {
    setEditRow(row);
    setFormTitle(row.title);
    setFormUrl(row.sourceUrl ?? "");
    setFormJurisdiction(row.jurisdiction ?? "");
    setFormFrom(toIsoDateInput(row.effectiveFrom));
    setFormTo(toIsoDateInput(row.effectiveTo));
  }

  async function submitCreate() {
    if (!formTitle.trim()) {
      toast.error("Nhập tiêu đề.");
      return;
    }
    setSaving(true);
    try {
      await adminCreateLegalSource({
        title: formTitle.trim(),
        sourceUrl: formUrl.trim() || null,
        jurisdiction: formJurisdiction.trim() || null,
        effectiveFrom: formFrom.trim()
          ? new Date(formFrom + "T00:00:00.000Z").toISOString()
          : null,
        effectiveTo: formTo.trim()
          ? new Date(formTo + "T23:59:59.999Z").toISOString()
          : null,
      });
      toast.success("Đã tạo nguồn.");
      setCreateOpen(false);
      await load();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Tạo thất bại.");
    } finally {
      setSaving(false);
    }
  }

  async function submitEdit() {
    if (!editRow) return;
    if (!formTitle.trim()) {
      toast.error("Nhập tiêu đề.");
      return;
    }
    setSaving(true);
    try {
      await adminPatchLegalSource(editRow.id, {
        title: formTitle.trim(),
        sourceUrl: formUrl.trim() || null,
        jurisdiction: formJurisdiction.trim() || null,
        effectiveFrom: formFrom.trim()
          ? new Date(formFrom + "T00:00:00.000Z").toISOString()
          : null,
        effectiveTo: formTo.trim()
          ? new Date(formTo + "T23:59:59.999Z").toISOString()
          : null,
      });
      toast.success("Đã lưu.");
      setEditRow(null);
      await load();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Xóa mềm nguồn này?")) return;
    try {
      await adminDeleteLegalSource(id);
      toast.success("Đã xóa.");
      await load();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Xóa thất bại.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label htmlFor="legal-q" className="text-xs text-muted-foreground">
            Tìm
          </label>
          <Input
            id="legal-q"
            value={qDraft}
            onChange={(e) => setQDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setQ(qDraft);
                setPage(1);
              }
            }}
            className="w-[200px]"
            placeholder="Tiêu đề / jurisdiction…"
          />
        </div>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => {
            setQ(qDraft);
            setPage(1);
          }}
        >
          Lọc
        </Button>
        <Button type="button" size="sm" onClick={openCreate}>
          <PlusIcon className="mr-1 size-4" />
          Thêm nguồn
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Jurisdiction</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="w-[120px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Loader2Icon className="size-4 animate-spin" />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>Không có nguồn.</TableCell>
              </TableRow>
            ) : (
              items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.title}</TableCell>
                  <TableCell className="text-sm">{row.jurisdiction ?? "—"}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm">
                    {row.sourceUrl ? (
                      <a
                        href={row.sourceUrl}
                        className="text-primary underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {row.sourceUrl}
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(row)}
                      >
                        Sửa
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => void remove(row.id)}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
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
        ariaLabel="Phân trang nguồn pháp lý"
      />

      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent className="flex w-full flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Nguồn pháp lý mới</SheetTitle>
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-3 py-4">
            <Field label="Tiêu đề" required>
              <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
            </Field>
            <Field label="URL">
              <Input value={formUrl} onChange={(e) => setFormUrl(e.target.value)} />
            </Field>
            <Field label="Jurisdiction">
              <Input
                value={formJurisdiction}
                onChange={(e) => setFormJurisdiction(e.target.value)}
              />
            </Field>
            <Field label="Hiệu lực từ (yyyy-mm-dd)">
              <Input type="date" value={formFrom} onChange={(e) => setFormFrom(e.target.value)} />
            </Field>
            <Field label="Hiệu lực đến (yyyy-mm-dd)">
              <Input type="date" value={formTo} onChange={(e) => setFormTo(e.target.value)} />
            </Field>
          </div>
          <SheetFooter>
            <Button type="button" disabled={saving} onClick={() => void submitCreate()}>
              Tạo
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet
        open={editRow != null}
        onOpenChange={(o) => {
          if (!o) setEditRow(null);
        }}
      >
        <SheetContent className="flex w-full flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Sửa nguồn</SheetTitle>
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-3 py-4">
            <Field label="Tiêu đề" required>
              <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
            </Field>
            <Field label="URL">
              <Input value={formUrl} onChange={(e) => setFormUrl(e.target.value)} />
            </Field>
            <Field label="Jurisdiction">
              <Input
                value={formJurisdiction}
                onChange={(e) => setFormJurisdiction(e.target.value)}
              />
            </Field>
            <Field label="Hiệu lực từ">
              <Input type="date" value={formFrom} onChange={(e) => setFormFrom(e.target.value)} />
            </Field>
            <Field label="Hiệu lực đến">
              <Input type="date" value={formTo} onChange={(e) => setFormTo(e.target.value)} />
            </Field>
          </div>
          <SheetFooter>
            <Button type="button" disabled={saving} onClick={() => void submitEdit()}>
              Lưu
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <span className="text-xs text-muted-foreground">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </div>
  );
}
