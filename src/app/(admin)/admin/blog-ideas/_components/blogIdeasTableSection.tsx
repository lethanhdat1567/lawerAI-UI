"use client";

import { useMemo, useState } from "react";
import { Loader2Icon, Trash2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatIdeaDate } from "../_lib/formatIdeaDate";
import {
  filterBlogIdeasForTable,
  type BlogIdeaTabFilter,
} from "../_lib/filterBlogIdeas";
import type { BlogIdea, IdeaStatus } from "@/services/blog-automation/types";

function statusBadgeVariant(
  status: IdeaStatus,
): "default" | "secondary" | "destructive" {
  switch (status) {
    case "COMPLETED":
      return "default";
    case "FAILED":
      return "destructive";
    default:
      return "secondary";
  }
}

function statusLabel(status: IdeaStatus): string {
  switch (status) {
    case "PENDING":
      return "Chờ xử lý";
    case "COMPLETED":
      return "Hoàn thành";
    case "FAILED":
      return "Lỗi";
    default:
      return status;
  }
}

type BlogIdeasTableSectionProps = {
  ideas: BlogIdea[];
  loading: boolean;
  onRequestDelete: (idea: BlogIdea) => void;
};

export function BlogIdeasTableSection({
  ideas,
  loading,
  onRequestDelete,
}: BlogIdeasTableSectionProps) {
  const [tab, setTab] = useState<BlogIdeaTabFilter>("all");
  const [search, setSearch] = useState("");

  const rows = useMemo(
    () => filterBlogIdeasForTable(ideas, tab, search),
    [ideas, tab, search],
  );

  return (
    <Card className="w-full min-w-0">
      <CardHeader>
        <CardTitle>Danh sách ý tưởng</CardTitle>
        <CardDescription>Lọc theo trạng thái và tìm theo tên hoặc mô tả.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as BlogIdeaTabFilter)}
          className="w-full min-w-0"
        >
          <TabsList className="w-full min-w-0 flex-wrap justify-start">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="PENDING">Chờ xử lý</TabsTrigger>
            <TabsTrigger value="COMPLETED">Hoàn thành</TabsTrigger>
            <TabsTrigger value="FAILED">Lỗi</TabsTrigger>
          </TabsList>
        </Tabs>

        <Input
          type="search"
          placeholder="Tìm theo tên hoặc mô tả…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />

        <div className="min-w-0 overflow-x-auto rounded-lg border border-border">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
              <Loader2Icon className="size-4 animate-spin" />
              Đang tải…
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-14">ID</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead className="hidden md:table-cell">Mô tả</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="hidden sm:table-cell">Tạo lúc</TableHead>
                  <TableHead className="w-24 text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      Không có ý tưởng phù hợp.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono text-xs">{row.id}</TableCell>
                      <TableCell className="max-w-[200px] font-medium">
                        <span className="line-clamp-2">{row.name}</span>
                      </TableCell>
                      <TableCell className="hidden max-w-xs text-muted-foreground md:table-cell">
                        <span className="line-clamp-2 text-sm">{row.description}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant(row.status)}>
                          {statusLabel(row.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                        {formatIdeaDate(row.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="text-destructive hover:text-destructive"
                          aria-label={`Xóa ý tưởng ${row.name}`}
                          onClick={() => onRequestDelete(row)}
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
