"use client";
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  Row,
} from '@tanstack/react-table';

type DealerAccount = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  [key: string]: any;
};

export default function DealerAccountsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dealerAccounts, setDealerAccounts] = useState<DealerAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const sortBy = searchParams.get('sortBy') || 'name';
  const sortDir = searchParams.get('sortDir') || 'asc';
  const search = searchParams.get('search') || '';

  const buildUrl = useCallback((paramsObj: Record<string, string | number>) => {
    const sp = new URLSearchParams({
      page: String(paramsObj.page ?? page),
      pageSize: String(paramsObj.pageSize ?? pageSize),
      sortBy: String(paramsObj.sortBy ?? sortBy),
      sortDir: String(paramsObj.sortDir ?? sortDir),
      search: String(paramsObj.search ?? search),
    });
    return `/dealer_accounts?${sp.toString()}`;
  }, [page, pageSize, sortBy, sortDir, search]);

  const fetchDealerAccounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('dealer_accounts')
        .select('*', { count: 'exact' });

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
      }

      query = query.order(sortBy, { ascending: sortDir === 'asc' });
      query = query.range((page - 1) * pageSize, page * pageSize - 1);

      const { data, error, count } = await query;

      if (error) throw error;
      setDealerAccounts(data || []);
    } catch (err) {
      setError('Failed to fetch dealer accounts');
      console.error('Error fetching dealer accounts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDealerAccounts();
  }, [page, pageSize, sortBy, sortDir, search]);

  const columns: ColumnDef<DealerAccount>[] = [
    {
      accessorKey: "name",
      header: () => <span>Name</span>,
      cell: ({ row }: { row: Row<DealerAccount> }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: () => <span>Email</span>,
      cell: ({ row }: { row: Row<DealerAccount> }) => <div className="font-medium">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phone",
      header: () => <span>Phone</span>,
      cell: ({ row }: { row: Row<DealerAccount> }) => <div className="font-medium">{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "address",
      header: () => <span>Address</span>,
      cell: ({ row }: { row: Row<DealerAccount> }) => <div className="font-medium">{row.getValue("address")}</div>,
    },
    {
      accessorKey: "status",
      header: () => <span>Status</span>,
      cell: ({ row }: { row: Row<DealerAccount> }) => {
        const status = row.getValue("status") as string;
        return (
          <div className={`font-medium ${
            status === 'active' ? 'text-green-600' : 
            status === 'pending' ? 'text-yellow-600' : 
            'text-red-600'
          }`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: dealerAccounts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-foreground">Dealer Accounts</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded px-3 py-1 bg-background text-foreground"
            value={search}
            onChange={(e) => {
              router.push(buildUrl({ search: e.target.value }));
            }}
          />
          <select
            className="border rounded px-3 py-1 bg-background text-foreground"
            value={pageSize}
            onChange={(e) => {
              router.push(buildUrl({ pageSize: e.target.value }));
            }}
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-destructive text-center">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-background border">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-3 border-b border-border bg-muted text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      <button
                        onClick={() => {
                          router.push(buildUrl({ 
                            sortBy: header.column.id, 
                            sortDir: sortBy === header.column.id && sortDir === 'asc' ? 'desc' : 'asc' 
                          }));
                        }}
                        className="cursor-pointer hover:underline flex items-center gap-1 bg-transparent border-none p-0"
                      >
                        {typeof header.column.columnDef.header === 'function' 
                          ? header.column.columnDef.header({ column: header.column, table, header })
                          : header.column.columnDef.header}
                        {sortBy === header.column.id ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                      </button>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap border-b border-border text-foreground">
                      {cell.getValue() as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 