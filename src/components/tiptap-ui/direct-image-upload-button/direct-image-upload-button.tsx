"use client";

import { useCallback, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ImagePlusIcon } from "@/components/tiptap-icons/image-plus-icon";
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button } from "@/components/tiptap-ui-primitive/button";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { handleImageUpload } from "@/lib/tiptap-utils";
import { cn } from "@/lib/utils";

/** tiptap-extension-resize-image registers the node as `imageResize`, not `image`. */
function getImageContentType(editor: Editor): "imageResize" | "image" | null {
  if (editor.schema.nodes.imageResize) return "imageResize";
  if (editor.schema.nodes.image) return "image";
  return null;
}

export type DirectImageUploadButtonProps = Omit<
  ButtonProps,
  "type" | "onClick"
> & {
  editor?: Editor | null;
};

/**
 * Mở hộp thoại chọn file, upload và chèn nút ảnh (hỗ trợ kéo giãn qua ImageResize).
 */
export function DirectImageUploadButton({
  editor: providedEditor,
  className,
  disabled: disabledProp,
  ...buttonProps
}: DirectImageUploadButtonProps) {
  const { editor } = useTiptapEditor(providedEditor);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickFile = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh");
        e.target.value = "";
        return;
      }

      const imageType = getImageContentType(editor);
      if (!imageType) {
        toast.error("Trình soạn thảo chưa hỗ trợ chèn ảnh");
        e.target.value = "";
        return;
      }

      try {
        setIsUploading(true);
        const url = await handleImageUpload(file);

        const base = file.name.replace(/\.[^/.]+$/, "") || "image";
        const ok = editor
          .chain()
          .focus()
          .insertContent({
            type: imageType,
            attrs: { src: url, alt: base, title: base },
          })
          .run();

        if (!ok) {
          toast.error("Không thể chèn ảnh tại vị trí này");
          return;
        }
        toast.success("Đã chèn ảnh");
      } catch (err) {
        console.error(err);
        toast.error("Tải ảnh thất bại");
      } finally {
        setIsUploading(false);
        e.target.value = "";
      }
    },
    [editor],
  );

  if (!editor || !editor.isEditable) return null;
  if (!getImageContentType(editor)) return null;

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-hidden
        tabIndex={-1}
        onChange={onFileChange}
      />
      <Button
        type="button"
        variant="ghost"
        tooltip="Tải ảnh từ máy"
        aria-label="Tải ảnh từ máy"
        onClick={pickFile}
        disabled={isUploading || disabledProp}
        className={cn(className)}
        {...buttonProps}
      >
        {isUploading ? (
          <Loader2 className="tiptap-button-icon animate-spin" aria-hidden />
        ) : (
          <ImagePlusIcon className="tiptap-button-icon" />
        )}
        <span className="tiptap-button-text">Tải ảnh</span>
      </Button>
    </>
  );
}
