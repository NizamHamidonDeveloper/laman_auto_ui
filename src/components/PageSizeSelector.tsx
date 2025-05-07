"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PageSizeSelectorProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

export default function PageSizeSelector({ pageSize, onPageSizeChange }: PageSizeSelectorProps) {
  return (
    <Select
      value={String(pageSize)}
      onValueChange={(value) => onPageSizeChange(Number(value))}
    >
      <SelectTrigger className="w-[180px] bg-background text-foreground border-border">
        <SelectValue placeholder="Select page size" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="10">10 per page</SelectItem>
        <SelectItem value="20">20 per page</SelectItem>
        <SelectItem value="50">50 per page</SelectItem>
        <SelectItem value="100">100 per page</SelectItem>
      </SelectContent>
    </Select>
  );
} 