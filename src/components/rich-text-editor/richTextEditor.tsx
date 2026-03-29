"use client"

import {
  SimpleEditor,
  type SimpleEditorProps,
} from "@/components/tiptap-templates/simple/simple-editor"

export type RichTextEditorProps = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  "aria-labelledby"?: string
}

/**
 * Rich text (Tiptap Simple Editor) for Hub/Blog forms — full toolbar, embedded layout.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder,
  disabled,
  className,
  "aria-labelledby": ariaLabelledBy,
}: RichTextEditorProps) {
  const props: SimpleEditorProps = {
    value,
    onChange,
    placeholder,
    disabled,
    variant: "embedded",
    hideThemeToggle: true,
    className,
    "aria-labelledby": ariaLabelledBy,
  }
  return <SimpleEditor {...props} />
}
