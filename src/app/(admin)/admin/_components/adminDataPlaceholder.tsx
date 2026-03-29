// src/app/(admin)/admin/_components/adminDataPlaceholder.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdminDataPlaceholderProps {
  columns: string[];
}

export function AdminDataPlaceholder({ columns }: AdminDataPlaceholderProps) {
  return (
    <div className="rounded-none border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c} className="text-muted-foreground">
                {c}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center text-sm text-muted-foreground"
            >
              Chưa kết nối API LawerAI. Dữ liệu sẽ hiển thị sau khi có endpoint quản trị.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
