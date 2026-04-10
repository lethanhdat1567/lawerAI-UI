"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import slugify from "slugify";
import { Loader2Icon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Pagination } from "@/components/pagination/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
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
  blogAdminCreateTag,
  blogAdminDeleteTag,
  blogAdminPatchTag,
  blogPublicTags,
} from "@/lib/blog/blogTagApi";
import type { BlogTag } from "@/lib/blog/types";

const PAGE_SIZE = 10;
type FormMode = "create" | "edit";

function makeSlug(value: string): string {
  return slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function AdminBlogTagManage() {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [qDraft, setQDraft] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [editing, setEditing] = useState<BlogTag | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [slugTouchedManually, setSlugTouchedManually] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BlogTag | null>(null);

  async function loadTags() {
    setLoading(true);
    try {
      const { tags: rows } = await blogPublicTags();
      setTags(rows);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Không tải được blog tags.");
      setTags([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTags();
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

  const filteredTags = useMemo(() => {
    const query = q.trim().toLowerCase();
    const items = [...tags].sort((a, b) => a.name.localeCompare(b.name, "vi"));

    if (!query) return items;

    return items.filter((item) => {
      const name = item.name.toLowerCase();
      const slug = item.slug.toLowerCase();
      return name.includes(query) || slug.includes(query);
    });
  }, [tags, q]);

  const total = filteredTags.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredTags.slice(start, start + PAGE_SIZE);
  }, [filteredTags, page]);

  function resetForm() {
    setFormName("");
    setFormSlug("");
    setSlugTouchedManually(false);
  }

  function openCreate() {
    resetForm();
    setEditing(null);
    setFormMode("create");
    setSheetOpen(true);
  }

  function openEdit(tag: BlogTag) {
    setEditing(tag);
    setFormMode("edit");
    setFormName(tag.name);
    setFormSlug(tag.slug);
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

    if (!name) {
      toast.error("Tên tag là bắt buộc.");
      return;
    }

    setSaving(true);
    try {
      if (formMode === "create") {
        const { tag } = await blogAdminCreateTag({
          name,
          slug: slug || undefined,
        });
        toast.success("Đã tạo blog tag.");
        setTags((prev) => [tag, ...prev]);
        setPage(1);
      } else if (editing) {
        const { tag } = await blogAdminPatchTag(editing.id, {
          name,
          slug: slug || undefined,
        });
        toast.success("Đã cập nhật blog tag.");
        setTags((prev) => prev.map((item) => (item.id === tag.id ? tag : item)));
      }

      setPage(1);
      setSheetOpen(false);
      setEditing(null);
      resetForm();
    } catch (e) {
      toast.error(
        e instanceof ApiError
          ? e.message
          : formMode === "create"
            ? "Tạo blog tag thất bại."
            : "Cập nhật blog tag thất bại.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await blogAdminDeleteTag(deleteTarget.id);
      toast.success("Đã xóa blog tag.");
      setTags((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Xóa blog tag thất bại.");
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
              placeholder="Tên tag hoặc slug..."
              className="h-10"
            />
          </div>
        </div>

        <Button type="button" className="h-10" onClick={openCreate}>
          <PlusIcon className="size-4" aria-hidden />
          Blog tag mới
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
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    Không có blog tag phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {row.slug}
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
              blog tag
            </>
          ) : (
            "Chưa có blog tag."
          )}
        </p>
        <Pagination
          className="order-1 sm:order-2"
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          ariaLabel="Phân trang Blog tags admin"
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
        <AlertDialogContent className="flex max-h-[85vh] w-[min(calc(100vw-2rem),48rem)] max-w-2xl flex-col gap-0 overflow-hidden p-4 sm:p-6">
          <AlertDialogHeader className="border-b border-border pb-4">
            <AlertDialogTitle>
              {formMode === "create" ? "Tạo Blog tag" : "Sửa Blog tag"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tên sẽ tự sinh slug. Bạn vẫn có thể chỉnh slug thủ công trước khi lưu.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex-1 space-y-4 overflow-y-auto py-4">
            <Field label="Tên tag" required htmlFor="blog-tag-name">
              <Input
                id="blog-tag-name"
                value={formName}
                onChange={(e) => handleNameChange(e.target.value)}
                className="mt-1.5 h-10"
                placeholder="Ví dụ: Tư vấn dân sự"
              />
            </Field>

            <Field label="Slug" htmlFor="blog-tag-slug">
              <Input
                id="blog-tag-slug"
                value={formSlug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="mt-1.5 h-10"
                placeholder="tu-van-dan-su"
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
            <AlertDialogTitle>Xóa blog tag?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `Blog tag "${deleteTarget.name}" sẽ bị xóa mềm khỏi hệ thống. Nếu tag đang được bài viết sử dụng, backend sẽ từ chối thao tác này.`
                : "Blog tag này sẽ bị xóa mềm khỏi hệ thống."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              disabled={saving}
              onClick={() => void confirmDelete()}
            >
              {saving ? "Đang xóa..." : "Xóa blog tag"}
            </AlertDialogAction>
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
