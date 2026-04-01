"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";
import { resolveApiAssetUrl } from "@/lib/media/resolveApiAssetUrl";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth/authService";

export function BlogThumbnailUploadField({
  id,
  label = "Ảnh thumbnail",
  description = "JPEG, PNG, GIF hoặc WebP. Ảnh upload lên server trước khi lưu bài.",
  value,
  onChange,
  disabled,
}: {
  id: string;
  label?: string;
  description?: string;
  value: string;
  onChange: (storagePathOrUrl: string) => void;
  disabled?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const previewSrc = resolveApiAssetUrl(value.trim() || null);
  const busy = disabled || uploading;

  async function onFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await authService.uploadImage(file);
      onChange(url);
      toast.success("Đã tải ảnh lên.");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Upload ảnh thất bại.",
      );
    } finally {
      setUploading(false);
    }
  }

  function clearThumbnail() {
    onChange("");
  }

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={id} className="text-sm font-semibold text-foreground">
          {label}
        </label>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>

      <div
        className={cn(
          "relative aspect-video w-full max-w-lg overflow-hidden rounded-xl border border-border bg-muted/40",
          previewSrc ? "border-primary/20" : null,
        )}
      >
        {previewSrc ? (
          <Image
            src={previewSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 32rem"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
            Chưa chọn ảnh
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          id={id}
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="sr-only"
          disabled={busy}
          onChange={(e) => void onFilePick(e)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
        >
          <ImagePlusIcon className="size-4" aria-hidden />
          {uploading ? "Đang tải…" : "Chọn ảnh"}
        </Button>
        {value.trim() ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            disabled={busy}
            onClick={clearThumbnail}
          >
            <Trash2Icon className="size-4" aria-hidden />
            Gỡ ảnh
          </Button>
        ) : null}
      </div>
    </div>
  );
}
