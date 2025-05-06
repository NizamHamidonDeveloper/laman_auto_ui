"use client";
import { useRouter } from 'next/navigation';

interface PageSizeSelectorProps {
  pageSize: string;
  sortBy: string;
  sortDir: string;
  filter: string;
}

export default function PageSizeSelector({ pageSize, sortBy, sortDir, filter }: PageSizeSelectorProps) {
  const router = useRouter();

  function buildUrl(newPageSize: string) {
    const sp = new URLSearchParams({
      page: '1',
      pageSize: newPageSize,
      sortBy,
      sortDir,
      filter,
    });
    return `/users?${sp.toString()}`;
  }

  return (
    <label>
      Page Size:
      <select
        name="pageSize"
        value={pageSize}
        onChange={e => router.push(buildUrl(e.target.value))}
        className="ml-2 border rounded px-2 py-1"
      >
        {[5, 10, 20, 50].map(size => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>
    </label>
  );
} 