'use client';

import { ModeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetWorkflows } from '@/hooks/api/workflows';
import { format } from 'date-fns';
import { ArrowLeft, ChevronDown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const router = useRouter();

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useGetWorkflows({ variables: { limit: 10 } });

  const workflows = data?.pages.flatMap((page) => page) || [];

  const handleRowClick = (id: string) => {
    router.push(`/?id=${id}`);
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'default';
      case 'FAILED': return 'destructive';
      case 'IN_PROGRESS': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8 relative">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Execution History</h1>
              <p className="text-muted-foreground">
                View all past AI workflow runs.
              </p>
            </div>
          </div>
          <ModeToggle />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Workflows</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : workflows.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No history found.
              </div>
            ) : (
              <div className="relative w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[40%]">Input Prompt</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Steps</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workflows.map((wf) => (
                      <TableRow
                        key={wf.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(wf.id)}
                      >
                        <TableCell>
                          <Badge variant={getBadgeVariant(wf.status)} className="gap-1">
                            {wf.status === 'IN_PROGRESS' && <Loader2 className="h-3 w-3 animate-spin" />}
                            {wf.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="max-w-75 truncate" title={wf.originalInput}>
                            {wf.originalInput}
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(wf.createdAt), 'MMM d, yyyy h:mm a')}
                        </TableCell>
                        <TableCell>
                          {wf.steps?.length || 0} steps
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>

          {hasNextPage && (
            <div className="border-t p-4 flex justify-center bg-muted/10">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className='cursor-pointer'
              >
                {isFetchingNextPage ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ChevronDown className="mr-2 h-4 w-4" />
                )}
                Load Older Workflows
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
