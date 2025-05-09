"use client";

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import PageSizeSelector from '@/components/PageSizeSelector';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

export default function LoanApplicationsPage() {
  const [pageSize, setPageSize] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  const supabase = createClient();

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from('loan_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  };

  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['loanApplications'],
    queryFn: fetchApplications
  });

  const totalItems = applications?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedApplications = applications?.slice(startIndex, endIndex);

  if (isLoading) return <div className="text-foreground">Loading...</div>;
  if (error) return <div className="text-destructive">Error loading applications</div>;

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Loan Applications</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => window.history.back()} className="border-border hover:bg-muted">
            Back
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <PageSizeSelector
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">Application ID</TableHead>
              <TableHead className="text-foreground">User</TableHead>
              <TableHead className="text-foreground">Vehicle</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground">Amount</TableHead>
              <TableHead className="text-foreground">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApplications?.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="text-foreground">{application.id}</TableCell>
                <TableCell className="text-foreground">{application.user_id}</TableCell>
                <TableCell className="text-foreground">{application.vehicle_id}</TableCell>
                <TableCell>
                  <span className={`font-medium ${
                    application.status === 'approved' ? 'text-green-600 dark:text-green-400' :
                    application.status === 'rejected' ? 'text-red-600 dark:text-red-400' :
                    'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {application.status}
                  </span>
                </TableCell>
                <TableCell className="text-foreground">${application.loan_amount}</TableCell>
                <TableCell className="text-foreground">{new Date(application.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between text-foreground">
        <div>
          Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} items
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="border-border hover:bg-muted"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage >= totalPages}
            className="border-border hover:bg-muted"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
} 