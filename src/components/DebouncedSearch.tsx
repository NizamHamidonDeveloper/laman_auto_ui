"use client";
import React from 'react';

interface DebouncedSearchProps {
  initialValue?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function DebouncedSearch({ initialValue = '', onSearch, placeholder = 'Search...', debounceMs = 400 }: DebouncedSearchProps) {
  const [value, setValue] = React.useState(initialValue);
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(value);
    }, debounceMs);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, onSearch, debounceMs]);

  return (
    <input
      type="text"
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder={placeholder}
      className="border px-2 py-1 rounded"
    />
  );
} 