"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/app/(admin)/admin/_components/adminPageHeader";
import { Separator } from "@/components/ui/separator";
import { ApiError } from "@/lib/api/errors";
import { blogIdeaList } from "@/services/blog-automation/blogIdeaApi";
import { blogScheduleGet } from "@/services/blog-automation/blogScheduleApi";
import type { BlogIdea, ScheduleBlogSystem } from "@/services/blog-automation/types";

import { BlogIdeaGeneratorForm } from "./blogIdeaGeneratorForm";
import { BlogIdeasTableSection } from "./blogIdeasTableSection";
import { BlogScheduleSettings } from "./blogScheduleSettings";
import { DeleteBlogIdeaDialog } from "./deleteBlogIdeaDialog";

export function BlogIdeasAdminPage() {
  const [schedule, setSchedule] = useState<ScheduleBlogSystem | null>(null);
  const [ideas, setIdeas] = useState<BlogIdea[]>([]);
  const [booting, setBooting] = useState(true);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BlogIdea | null>(null);

  const refreshSchedule = useCallback(async () => {
    const r = await blogScheduleGet();
    setSchedule(r.schedule);
  }, []);

  const refreshIdeas = useCallback(async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent === true;
    if (!silent) {
      setIdeasLoading(true);
    }
    try {
      const r = await blogIdeaList();
      setIdeas(r.ideas);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Không tải được danh sách ý tưởng.");
      setIdeas([]);
    } finally {
      if (!silent) {
        setIdeasLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      setBooting(true);
      try {
        const [sRes, iRes] = await Promise.all([blogScheduleGet(), blogIdeaList()]);
        if (cancelled) {
          return;
        }
        setSchedule(sRes.schedule);
        setIdeas(iRes.ideas);
      } catch (e) {
        if (!cancelled) {
          toast.error(
            e instanceof ApiError ? e.message : "Không tải được dữ liệu trang.",
          );
        }
      } finally {
        if (!cancelled) {
          setBooting(false);
        }
      }
    }
    void boot();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto w-full min-w-0 max-w-5xl space-y-8 p-4 md:p-6">
      <AdminPageHeader
        title="Blog ideas & lịch AI"
        description="Cấu hình lịch viết blog tự động và quản lý ý tưởng do AI sinh ra."
      />

      {booting ? (
        <p className="text-sm text-muted-foreground">Đang tải…</p>
      ) : (
        <>
          <BlogScheduleSettings schedule={schedule} onScheduleChange={refreshSchedule} />
          <Separator />
          <BlogIdeaGeneratorForm
            scheduleReady={Boolean(
              schedule &&
                schedule.model.trim() !== "" &&
                schedule.prompt.trim() !== "",
            )}
            onIdeasCreated={async () => refreshIdeas({ silent: true })}
          />
          <Separator />
          <BlogIdeasTableSection
            ideas={ideas}
            loading={ideasLoading}
            onRequestDelete={setDeleteTarget}
          />
        </>
      )}

      <DeleteBlogIdeaDialog
        idea={deleteTarget}
        open={deleteTarget != null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        onDeleted={async () => refreshIdeas({ silent: true })}
      />
    </div>
  );
}
