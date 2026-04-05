"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/errors";
import { blogIdeaCreate } from "@/services/blog-automation/blogIdeaApi";

type BlogIdeaGeneratorFormProps = {
  onIdeasCreated: () => Promise<void>;
  /** Khi false: chưa có schedule + model/prompt hệ thống để AI dùng. */
  scheduleReady: boolean;
};

export function BlogIdeaGeneratorForm({
  onIdeasCreated,
  scheduleReady,
}: BlogIdeaGeneratorFormProps) {
  const [quantity, setQuantity] = useState("5");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    const n = Number(quantity);
    if (!Number.isInteger(n) || n < 1) {
      toast.error("Số lượng phải là số nguyên dương.");
      return;
    }
    if (!scheduleReady) {
      toast.error("Hãy cấu hình lịch hệ thống (model và prompt) ở phần trên trước.");
      return;
    }
    setSubmitting(true);
    try {
      await blogIdeaCreate({ quantity: n });
      toast.success("Đã tạo ý tưởng blog.");
      await onIdeasCreated();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Tạo ý tưởng thất bại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="w-full min-w-0">
      <CardHeader>
        <CardTitle>Tạo ý tưởng bằng AI</CardTitle>
        <CardDescription>
          Chủ đề và model lấy từ cấu hình &quot;Lịch viết blog tự động&quot; phía trên. Chỉ cần chọn
          số lượng ý tưởng cần sinh.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!scheduleReady ? (
          <p className="text-sm text-muted-foreground">
            Cần có bản ghi lịch hệ thống với model và prompt đã lưu trước khi tạo ý tưởng.
          </p>
        ) : null}
        <div className="space-y-2">
          <label htmlFor="idea-qty" className="text-sm font-medium text-foreground">
            Số lượng ý tưởng
          </label>
          <Input
            id="idea-qty"
            type="number"
            min={1}
            step={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="max-w-[120px]"
          />
        </div>
        <Button
          type="button"
          disabled={submitting || !scheduleReady}
          onClick={() => void handleSubmit()}
        >
          {submitting ? "Đang tạo…" : "Tạo ý tưởng"}
        </Button>
      </CardContent>
    </Card>
  );
}
