"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/errors";
import { adminAiConfigGet, adminAiConfigPatch } from "@/lib/admin/adminApi";

export function AdminAiPromptsForm() {
  const [advisorPrompt, setAdvisorPrompt] = useState("");
  const [communityPrompt, setCommunityPrompt] = useState("");
  const [blogPrompt, setBlogPrompt] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { config } = await adminAiConfigGet();
      setAdvisorPrompt(config.advisor_prompt);
      setCommunityPrompt(config.community_prompt);
      setBlogPrompt(config.blog_prompt);
      setUpdatedAt(config.updatedAt);
    } catch (e) {
      toast.error(
        e instanceof ApiError
          ? e.message
          : "Không tải được cấu hình prompt AI.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSave() {
    setSaving(true);
    try {
      const { config } = await adminAiConfigPatch({
        advisor_prompt: advisorPrompt,
        community_prompt: communityPrompt,
        blog_prompt: blogPrompt,
      });
      setUpdatedAt(config.updatedAt);
      toast.success("Đã lưu prompt AI.");
    } catch (e) {
      toast.error(
        e instanceof ApiError ? e.message : "Lưu cấu hình prompt thất bại.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="w-full min-w-0">
        <CardHeader>
          <CardTitle>Prompt AI hệ thống</CardTitle>
          <CardDescription>
            Chỉnh ba prompt dùng cho trợ lý tư vấn, phản hồi Hub/cộng đồng và
            nội dung blog tự động. Thay đổi có hiệu lực cho các luồng AI tương
            ứng sau khi lưu.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2Icon className="size-4 animate-spin" />
              Đang tải…
            </div>
          ) : (
            <>
              {updatedAt ? (
                <p className="text-xs text-muted-foreground">
                  Cập nhật lần cuối:{" "}
                  {new Date(updatedAt).toLocaleString("vi-VN", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              ) : null}

              <div className="space-y-2">
                <label
                  htmlFor="ai-prompt-advisor"
                  className="text-sm font-medium text-foreground"
                >
                  Prompt trợ lý tư vấn (chat advisor)
                </label>
                <Textarea
                  id="ai-prompt-advisor"
                  value={advisorPrompt}
                  onChange={(e) => setAdvisorPrompt(e.target.value)}
                  rows={8}
                  className="min-h-40 font-mono text-sm"
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="ai-prompt-community"
                  className="text-sm font-medium text-foreground"
                >
                  Prompt Hub / cộng đồng
                </label>
                <Textarea
                  id="ai-prompt-community"
                  value={communityPrompt}
                  onChange={(e) => setCommunityPrompt(e.target.value)}
                  rows={8}
                  className="min-h-40 font-mono text-sm"
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="ai-prompt-blog"
                  className="text-sm font-medium text-foreground"
                >
                  Prompt blog / nội dung pháp lý
                </label>
                <Textarea
                  id="ai-prompt-blog"
                  value={blogPrompt}
                  onChange={(e) => setBlogPrompt(e.target.value)}
                  rows={8}
                  className="min-h-40 font-mono text-sm"
                  disabled={saving}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                  ) : null}
                  Lưu
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading || saving}
                  onClick={() => void load()}
                >
                  Tải lại
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
