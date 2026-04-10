"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import slugify from "slugify";
import { Loader2Icon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Pagination } from "@/components/pagination/pagination";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { ApiError } from "@/lib/api/errors";
import {
  hubAdminCreateCategory,
  hubAdminDeleteCategory,
  hubAdminPatchCategory,
  hubPublicCategories,
} from "@/lib/hub/hubCategoryApi";
import type { HubCategoryUI } from "@/lib/hub/types";

const PAGE_SIZE = 10;

type FormMode = "create" | "edit";

function makeSlug(value: string): string {
  return slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function AdminHubCategoryManage() {
  const [categories, setCategories] = useState<HubCategoryUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [qDraft, setQDraft] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [editing, setEditing] = useState<HubCategoryUI | null>(null);

  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formSortOrder, setFormSortOrder] = useState("0");
  const [slugTouchedManually, setSlugTouchedManually] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<HubCategoryUI | null>(null);

  async function loadCategories() {
    setLoading(true);
    try {
      const { categories: rows } = await hubPublicCategories();
      setCategories(rows);
    } catch (e) {
      toast.error(
        e instanceof ApiError ? e.message : "Không tải được danh mục Hub.",
      );
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQ(qDraft);
      setPage(1);
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [qDraft]);

  const filteredCategories = useMemo(() => {
    const query = q.trim().toLowerCase();
    const items = [...categories].sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return a.name.localeCompare(b.name, "vi");
    });

    if (!query) return items;

    return items.filter((item) => {
      const name = item.name.toLowerCase();
      const slug = item.slug.toLowerCase();
      return name.includes(query) || slug.includes(query);
    });
  }, [categories, q]);

  const total = filteredCategories.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredCategories.slice(start, start + PAGE_SIZE);
  }, [filteredCategories, page]);

  function resetForm() {
    setFormName("");
    setFormSlug("");
    setFormSortOrder("0");
    setSlugTouchedManually(false);
  }

  function openCreate() {
    resetForm();
    setEditing(null);
    setFormMode("create");
    setSheetOpen(true);
  }

  function openEdit(category: HubCategoryUI) {
    setEditing(category);
    setFormMode("edit");
    setFormName(category.name);
    setFormSlug(category.slug);
    setFormSortOrder(String(category.sortOrder));
    setSlugTouchedManually(true);
    setSheetOpen(true);
  }

  function handleNameChange(value: string) {
    setFormName(value);
    if (!slugTouchedManually) {
      setFormSlug(makeSlug(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlugTouchedManually(true);
    setFormSlug(makeSlug(value));
  }

  async function submitForm() {
    const name = formName.trim();
    const slug = formSlug.trim();
    const sortOrder = Number(formSortOrder);

    if (!name) {
      toast.error("Tên category là bắt buộc.");
      return;
    }
    if (!slug) {
      toast.error("Slug là bắt buộc.");
      return;
    }
    if (!Number.isInteger(sortOrder)) {
      toast.error("Sort order phải là số nguyên.");
      return;
    }

    setSaving(true);
    try {
      if (formMode === "create") {
        const { category } = await hubAdminCreateCategory({
          name,
          slug,
          sortOrder,
        });
        toast.success("Đã tạo category.");
        setCategories((prev) => [category, ...prev]);
        setPage(1);
      } else if (editing) {
        const { category } = await hubAdminPatchCategory(editing.id, {
          name,
          slug,
          sortOrder,
        });
        toast.success("Đã cập nhật category.");
        setCategories((prev) =>
          prev.map((item) => (item.id === category.id ? category : item)),
        );
      }

      setSheetOpen(false);
      setEditing(null);
      resetForm();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Lưu category thất bại.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await hubAdminDeleteCategory(deleteTarget.id);
      toast.success("Đã xóa category.");
      setCategories((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Xóa category thất bại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="flex flex-1 flex-wrap items-end gap-2">
          <div className="min-w-[220px] flex-1">
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Tìm kiếm
            </p>
            <Input
              value={qDraft}
              onChange={(e) => setQDraft(e.target.value)}
              placeholder="Tên category hoặc slug..."
              className="h-10"
            />
          </div>
        </div>

        <Button type="button" className="h-10" onClick={openCreate}>
          <PlusIcon className="size-4" aria-hidden />
          Category mới
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-muted-foreground">
          <Loader2Icon className="size-8 animate-spin" aria-hidden />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Sort order</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    Không có category phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {row.slug}
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {row.sortOrder}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => openEdit(row)}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-destructive"
                          onClick={() => setDeleteTarget(row)}
                        >
                          <Trash2Icon className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex flex-col items-center gap-3 border-t border-border pt-4 sm:flex-row sm:justify-between">
        <p className="order-2 text-center text-xs text-muted-foreground sm:order-1 sm:text-left">
          {total > 0 ? (
            <>
              Hiển thị{" "}
              <span className="font-medium text-foreground">
                {(page - 1) * PAGE_SIZE + 1}–
                {(page - 1) * PAGE_SIZE + pageItems.length}
              </span>{" "}
              trong <span className="font-medium text-foreground">{total}</span>{" "}
              category
            </>
          ) : (
            "Chưa có category."
          )}
        </p>
        <Pagination
          className="order-1 sm:order-2"
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          ariaLabel="Phân trang Hub categories admin"
        />
      </div>

      <AlertDialog
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) {
            setEditing(null);
            resetForm();
          }
        }}
      >
        <AlertDialogContent className="flex w-[min(calc(100vw-2rem),48rem)] max-w-2xl flex-col gap-0 p-4 sm:p-6">
          <AlertDialogHeader className="border-b border-border pb-4">
            <AlertDialogTitle>
              {formMode === "create" ? "Tạo Hub category" : "Sửa Hub category"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tên sẽ tự sinh slug bằng `slugify`. Bạn vẫn có thể chỉnh slug thủ công.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex-1 space-y-4 overflow-y-auto py-4">
            <Field label="Tên category" required htmlFor="hub-category-name">
              <Input
                id="hub-category-name"
                value={formName}
                onChange={(e) => handleNameChange(e.target.value)}
                className="mt-1.5 h-10"
                placeholder="Ví dụ: Tư vấn đất đai"
              />
            </Field>

            <Field label="Slug" required htmlFor="hub-category-slug">
              <Input
                id="hub-category-slug"
                value={formSlug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="mt-1.5 h-10"
                placeholder="tu-van-dat-dai"
              />
            </Field>

            <Field label="Sort order" htmlFor="hub-category-sort-order">
              <Input
                id="hub-category-sort-order"
                type="number"
                step="1"
                value={formSortOrder}
                onChange={(e) => setFormSortOrder(e.target.value)}
                className="mt-1.5 h-10"
              />
            </Field>
          </div>

          <AlertDialogFooter className="border-t border-border pt-4">
            <Button variant="secondary" onClick={() => setSheetOpen(false)}>
              Hủy
            </Button>
            <Button disabled={saving} onClick={() => void submitForm()}>
              {saving
                ? formMode === "create"
                  ? "Đang tạo..."
                  : "Đang lưu..."
                : formMode === "create"
                  ? "Tạo"
                  : "Lưu"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteTarget != null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa category?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `Category "${deleteTarget.name}" sẽ bị xóa mềm khỏi hệ thống.`
                : "Category này sẽ bị xóa mềm khỏi hệ thống."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              disabled={saving}
              onClick={() => setDeleteTarget(null)}
            >
              Hủy
            </Button>
            <Button
              disabled={saving}
              variant="destructive"
              onClick={() => void confirmDelete()}
            >
              {saving ? "Đang xóa..." : "Xóa category"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({
  label,
  children,
  required,
  htmlFor,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium" htmlFor={htmlFor}>
        {label}
        {required ? " *" : ""}
      </label>
      {children}
    </div>
  );
}
