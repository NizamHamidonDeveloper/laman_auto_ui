"use client";
import DebouncedSearch from '@/components/DebouncedSearch';
import { useRouter } from 'next/navigation';

export default function UsersFilterBar({ initialFilter }: { initialFilter: string }) {
  const router = useRouter();
  return (
    <div className="mb-4 flex gap-4 items-center">
      <DebouncedSearch
        initialValue={initialFilter}
        placeholder="Filter by email..."
        onSearch={val => {
          const sp = new URLSearchParams(window.location.search);
          if (val) {
            sp.set('filter', val);
            sp.set('page', '1');
          } else {
            sp.delete('filter');
            sp.set('page', '1');
          }
          router.replace(`/users?${sp.toString()}`);
        }}
      />
    </div>
  );
} 