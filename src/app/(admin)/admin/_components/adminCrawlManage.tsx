"use client";

import { useEffect, useState, type ReactNode } from "react";
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
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/errors";
import {
  adminCrawlApprove,
  adminCrawlDraft,
  adminPipelineConfig,
  type AdminCrawlDraftRequest,
  type AdminCrawlApproveResponse,
  type AdminCrawlDraftResponse,
  type AdminPipelineTaskConfig,
  type PipelineTaskType,
} from "@/lib/admin/adminApi";

const TASKS: PipelineTaskType[] = [
  "HTML_CLEANING",
  "CLASSIFICATION",
  "METADATA_EXTRACT",
  "EMBEDDING",
];

const TASK_LABELS_VI: Record<PipelineTaskType, string> = {
  HTML_CLEANING: "Làm sạch HTML",
  CLASSIFICATION: "Phân loại lĩnh vực",
  METADATA_EXTRACT: "Trích xuất metadata",
  EMBEDDING: "Tạo embedding",
};

type TaskOverrideState = {
  modelName: string;
  promptName: string;
  promptContent: string;
};

export function AdminCrawlManage() {
  const [url, setUrl] = useState("");
  const [draftLoading, setDraftLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [draft, setDraft] = useState<AdminCrawlDraftResponse | null>(null);
  const [approveResult, setApproveResult] = useState<AdminCrawlApproveResponse | null>(null);
  const [pipelineLoading, setPipelineLoading] = useState(true);

  const [markdownDraft, setMarkdownDraft] = useState("");
  const [category, setCategory] = useState("");
  const [chapter, setChapter] = useState("");
  const [article, setArticle] = useState("");
  const [summary, setSummary] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [taskOverrides, setTaskOverrides] = useState<
    Record<PipelineTaskType, TaskOverrideState>
  >({
    HTML_CLEANING: { modelName: "", promptName: "", promptContent: "" },
    CLASSIFICATION: { modelName: "", promptName: "", promptContent: "" },
    METADATA_EXTRACT: { modelName: "", promptName: "", promptContent: "" },
    EMBEDDING: { modelName: "", promptName: "", promptContent: "" },
  });

  useEffect(() => {
    async function loadPipelineDefaults() {
      setPipelineLoading(true);
      try {
        const res = await adminPipelineConfig();
        setTaskOverrides((prev) => {
          const next = { ...prev };
          for (const task of TASKS) {
            const cfg = res.pipelineConfig.byTask[task] as AdminPipelineTaskConfig | undefined;
            if (!cfg) continue;
            next[task] = {
              modelName: cfg.modelName ?? "",
              promptName: cfg.promptName ?? "",
              promptContent: cfg.promptContent ?? "",
            };
          }
          return next;
        });
      } catch (e) {
        toast.error(e instanceof ApiError ? e.message : "Không tải được pipeline mặc định.");
      } finally {
        setPipelineLoading(false);
      }
    }
    void loadPipelineDefaults();
  }, []);

  function patchTaskOverride(
    task: PipelineTaskType,
    key: keyof TaskOverrideState,
    value: string,
  ) {
    setTaskOverrides((prev) => ({
      ...prev,
      [task]: {
        ...prev[task],
        [key]: value,
      },
    }));
  }

  function buildDraftRequest(): AdminCrawlDraftRequest {
    const overrides: NonNullable<AdminCrawlDraftRequest["overrides"]> = {};
    for (const task of TASKS) {
      const state = taskOverrides[task];
      const modelName = state.modelName.trim();
      const promptName = state.promptName.trim();
      const promptContent = state.promptContent.trim();
      if (!modelName && !promptName && !promptContent) continue;
      overrides[task] = {
        ...(modelName ? { modelName } : {}),
        ...(promptName ? { promptName } : {}),
        ...(promptContent ? { promptContent } : {}),
      };
    }
    return {
      url: url.trim(),
      ...(Object.keys(overrides).length > 0 ? { overrides } : {}),
    };
  }

  async function runDraft() {
    if (!url.trim()) {
      toast.error("Vui lòng nhập URL.");
      return;
    }
    setDraftLoading(true);
    setApproveResult(null);
    try {
      const res = await adminCrawlDraft(buildDraftRequest());
      setDraft(res);
      setMarkdownDraft(res.markdownDraft ?? "");
      setCategory(res.suggestedCategory ?? "");
      setChapter(res.metadata.chapter ?? "");
      setArticle(res.metadata.article ?? "");
      setSummary(res.metadata.summary ?? "");
      setTagsInput((res.metadata.tags ?? []).join(", "));
      toast.success("Crawl draft thành công.");
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Không thể crawl draft.");
    } finally {
      setDraftLoading(false);
    }
  }

  async function runApprove() {
    if (!draft) {
      toast.error("Chưa có dữ liệu draft để approve.");
      return;
    }
    if (!markdownDraft.trim()) {
      toast.error("Markdown không được để trống.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setApproveLoading(true);
    try {
      const res = await adminCrawlApprove({
        crawlLogId: draft.crawlLog.id,
        url: draft.url,
        markdownDraft: markdownDraft.trim(),
        category: category.trim() || null,
        metadata: {
          chapter: chapter.trim() || null,
          article: article.trim() || null,
          summary: summary.trim() || null,
          tags,
        },
      });
      setApproveResult(res);
      toast.success("Approve thành công.");
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Approve thất bại.");
    } finally {
      setApproveLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Crawl URL</CardTitle>
          <CardDescription>
            Nhập URL cần cào, hệ thống sẽ trả bản nháp để bạn review trước khi approve.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
          />
          <div className="space-y-3 rounded-md border p-3">
            <p className="text-xs font-medium text-muted-foreground">
              Cấu hình model/prompt mặc định theo task (có thể chỉnh trước khi crawl)
            </p>
            {pipelineLoading ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2Icon className="size-4 animate-spin" />
                Đang tải pipeline mặc định...
              </div>
            ) : null}
            <div className="grid gap-3 lg:grid-cols-2">
              {TASKS.map((task) => (
                <div key={task} className="space-y-2 rounded-md border p-3">
                  <p className="text-xs font-semibold">{TASK_LABELS_VI[task]}</p>
                  <p className="text-[11px] text-muted-foreground">{task}</p>
                  <Input
                    value={taskOverrides[task].modelName}
                    onChange={(e) =>
                      patchTaskOverride(task, "modelName", e.target.value)
                    }
                    placeholder="Model name"
                  />
                  <Input
                    value={taskOverrides[task].promptName}
                    onChange={(e) =>
                      patchTaskOverride(task, "promptName", e.target.value)
                    }
                    placeholder="Prompt name"
                  />
                  <textarea
                    value={taskOverrides[task].promptContent}
                    onChange={(e) =>
                      patchTaskOverride(task, "promptContent", e.target.value)
                    }
                    className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm"
                    placeholder="Prompt content"
                  />
                </div>
              ))}
            </div>
          </div>
          <Button type="button" onClick={() => void runDraft()} disabled={draftLoading}>
            {draftLoading ? <Loader2Icon className="mr-2 size-4 animate-spin" /> : null}
            Crawl Draft
          </Button>
        </CardContent>
      </Card>

      {draft ? (
        <Card>
          <CardHeader>
            <CardTitle>Review Draft</CardTitle>
            <CardDescription>
              Chỉnh sửa nội dung trước khi bấm Approve & Sync.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="URL">
                <Input value={draft.url} readOnly />
              </Field>
              <Field label="Crawl Log ID">
                <Input value={draft.crawlLog.id} readOnly />
              </Field>
              <Field label="Category đề xuất">
                <Input value={category} onChange={(e) => setCategory(e.target.value)} />
              </Field>
              <Field label="Tags (phân tách bằng dấu phẩy)">
                <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
              </Field>
              <Field label="Chapter">
                <Input value={chapter} onChange={(e) => setChapter(e.target.value)} />
              </Field>
              <Field label="Article">
                <Input value={article} onChange={(e) => setArticle(e.target.value)} />
              </Field>
            </div>

            <Field label="Summary">
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </Field>

            <Field label="Markdown Draft">
              <textarea
                value={markdownDraft}
                onChange={(e) => setMarkdownDraft(e.target.value)}
                className="min-h-[320px] w-full rounded-md border bg-background px-3 py-2 font-mono text-sm"
              />
            </Field>

            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>Status: {draft.crawlLog.status}</span>
              <span>Started: {draft.crawlLog.startedAt ?? "—"}</span>
              <span>Finished: {draft.crawlLog.finishedAt ?? "—"}</span>
            </div>

            <Button
              type="button"
              onClick={() => void runApprove()}
              disabled={approveLoading || !markdownDraft.trim()}
            >
              {approveLoading ? <Loader2Icon className="mr-2 size-4 animate-spin" /> : null}
              Approve & Sync
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {approveResult ? (
        <Card>
          <CardHeader>
            <CardTitle>Kết quả Approve</CardTitle>
            <CardDescription>
              Kết quả dry-run sync từ backend (chưa insert Supabase).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>Approved: {approveResult.approved ? "true" : "false"}</p>
            <p>Crawl status: {approveResult.crawlLog.status}</p>
            <p>Target: {approveResult.syncDryRun.target}</p>
            <p>Category: {approveResult.syncDryRun.preview.category ?? "—"}</p>
            <p>Markdown length: {approveResult.syncDryRun.preview.markdownLength}</p>
            <p>Tags count: {approveResult.syncDryRun.preview.tagsCount}</p>
            <p>Processed at: {approveResult.syncDryRun.preview.processedAt}</p>
            <pre className="overflow-auto rounded-md border bg-muted p-3 text-xs whitespace-pre-wrap">
              {approveResult.syncDryRun.note}
            </pre>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
