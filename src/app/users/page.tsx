"use client";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';
import UserModal from '@/components/UserModal';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  Row,
} from '@tanstack/react-table';

type User = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  profile_status: string;
  [key: string]: any;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const sortBy = searchParams.get('sortBy') || 'full_name';
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
    return `/users?${sp.toString()}`;
  }, [page, pageSize, sortBy, sortDir, search]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('users')
        .select('*', { count: 'exact' });

      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
      }

      query = query.order(sortBy, { ascending: sortDir === 'asc' });
      query = query.range((page - 1) * pageSize, page * pageSize - 1);

      const { data, error, count } = await query;

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, sortBy, sortDir, search]);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "full_name",
      header: () => <span>Name</span>,
      cell: ({ row }: { row: Row<User> }) => <div className="font-medium">{row.getValue("full_name")}</div>,
    },
    {
      accessorKey: "email",
      header: () => <span>Email</span>,
      cell: ({ row }: { row: Row<User> }) => <div className="font-medium">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phone",
      header: () => <span>Phone</span>,
      cell: ({ row }: { row: Row<User> }) => <div className="font-medium">{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "address",
      header: () => <span>Address</span>,
      cell: ({ row }: { row: Row<User> }) => <div className="font-medium">{row.getValue("address")}</div>,
    },
    {
      accessorKey: "profile_status",
      header: () => <span>Profile Status</span>,
      cell: ({ row }: { row: Row<User> }) => {
        const status = row.getValue("profile_status") as string;
        return (
          <div className={`font-medium ${
            status === 'completed' ? 'text-green-600' : 
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
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
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
                  onClick={() => {
                    setSelectedUser(row.original);
                    setIsModalOpen(true);
                  }}
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

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        mode="view"
        userId={selectedUser?.id}
        onSave={() => {
          fetchUsers();
        }}
      />
    </div>
  );
} 