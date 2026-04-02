"use client";

import { useState } from "react";
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
import { adminCrawlDraft } from "@/lib/admin/adminApi";

export function AdminCrawlManage() {
    const [url, setUrl] = useState("");
    const [draftLoading, setDraftLoading] = useState(false);

    async function runDraft() {
        if (!url.trim()) {
            toast.error("Vui lòng nhập URL.");
            return;
        }
        setDraftLoading(true);
        try {
            await adminCrawlDraft({ page_url: url.trim() });

            toast.success("Crawl thành công.");
        } catch (e) {
            toast.error(
                e instanceof ApiError ? e.message : "Không thể crawl draft.",
            );
        } finally {
            setDraftLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Crawl URL</CardTitle>
                    <CardDescription>
                        Nhập URL cần cào, hệ thống sẽ trả bản nháp để bạn review
                        trước khi approve.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://..."
                    />

                    <Button
                        type="button"
                        onClick={() => void runDraft()}
                        disabled={draftLoading}
                    >
                        {draftLoading ? (
                            <Loader2Icon className="mr-2 size-4 animate-spin" />
                        ) : null}
                        Crawl Data
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
