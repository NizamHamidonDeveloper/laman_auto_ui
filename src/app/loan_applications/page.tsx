import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import PageSizeSelector from '@/components/PageSizeSelector';

export default async function LoanApplicationsPage(
  _props: any,
  context?: { searchParams?: URLSearchParams }
) {
  const searchParams = context?.searchParams ?? new URLSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const sortBy = searchParams.get('sortBy') || 'id';
  const sortDir = searchParams.get('sortDir') === 'desc' ? 'desc' : 'asc';
  const userIdFilter = searchParams.get('user_id') || '';
  const statusFilter = searchParams.get('loan_application_status') || '';

  let query = supabase.from('loan_applications').select('*', { count: 'exact' });
  if (userIdFilter) {
    query = query.eq('user_id', userIdFilter);
  }
  if (statusFilter) {
    query = query.ilike('loan_application_status', `%${statusFilter}%`);
  }
  query = query.order(sortBy, { ascending: sortDir === 'asc' });
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data: loans, error, count } = await query;

  if (error) {
    return <div className="p-4 text-red-500">Error fetching loan applications: {error.message}</div>;
  }

  if (!loans) {
    return <div className="p-4">No loan applications found.</div>;
  }

  function buildUrl(paramsObj: Record<string, string | number>) {
    const sp = new URLSearchParams({
      page: String(paramsObj.page ?? page),
      pageSize: String(paramsObj.pageSize ?? pageSize),
      sortBy: String(paramsObj.sortBy ?? sortBy),
      sortDir: String(paramsObj.sortDir ?? sortDir),
      user_id: String(paramsObj.user_id ?? userIdFilter),
      loan_application_status: String(paramsObj.loan_application_status ?? statusFilter),
    });
    return `/loan_applications?${sp.toString()}`;
  }

  return (
    <div className="p-8">
      <Link href="/" className="inline-block mb-4 font-semibold bg-white px-4 py-2 rounded shadow border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition">
        &larr; Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-6">All Loan Applications</h1>
      <form className="mb-4 flex gap-4 items-center" action="/loan_applications" method="get">
        <input
          type="text"
          name="user_id"
          placeholder="Filter by user_id..."
          defaultValue={userIdFilter}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          name="loan_application_status"
          placeholder="Filter by status..."
          defaultValue={statusFilter}
          className="border px-2 py-1 rounded"
        />
        <button type="submit" className="bg-gray-900 text-white px-3 py-1 rounded">Filter</button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            {Object.keys(loans[0] || {}).map((col) => (
              <TableHead key={col}>
                <a
                  href={buildUrl({ sortBy: col, sortDir: sortBy === col && sortDir === 'asc' ? 'desc' : 'asc' })}
                  className="cursor-pointer hover:underline flex items-center gap-1"
                >
                  {col}
                  {sortBy === col ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </a>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan: any) => (
            <TableRow key={loan.id}>
              {Object.values(loan).map((val, idx) => (
                <TableCell key={idx}>
                  {typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center gap-4 mt-4">
        <span>
          Page {page} of {count ? Math.ceil(count / pageSize) : 1}
        </span>
        <a
          href={buildUrl({ page: String(page > 1 ? page - 1 : 1) })}
          className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-200 text-gray-400' : 'bg-gray-900 text-white'}`}
        >
          Previous
        </a>
        <a
          href={buildUrl({ page: String(page + 1) })}
          className={`px-3 py-1 rounded ${(count && page >= Math.ceil(count / pageSize)) ? 'bg-gray-200 text-gray-400' : 'bg-gray-900 text-white'}`}
        >
          Next
        </a>
        <PageSizeSelector
          pageSize={String(pageSize)}
          sortBy={sortBy}
          sortDir={sortDir}
          filter={statusFilter}
        />
      </div>
    </div>
  );
} 