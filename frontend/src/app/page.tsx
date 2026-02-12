'use client';

import { AppSidebar } from '@/components/sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { WorkflowForm } from '@/components/workflow-form';
import { WorkflowResults } from '@/components/workflow-results';
import { useHealthCheck } from '@/hooks/api/health';
import { useGetWorkflows, usePollWorkflow } from '@/hooks/api/workflows';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: health, isLoading: isHealthChecking } = useHealthCheck();

  const isBackendDown = isHealthChecking || health?.status !== 'ok';

  const { data: history = [], isLoading, isFetching } = useGetWorkflows({
    enabled: !isBackendDown,
  });

  const { data: selectedWorkflow, isLoading: isWorkflowLoading } = usePollWorkflow({
    variables: { id: selectedId || '' },
    enabled: !!selectedId && !isBackendDown,
  });

  useEffect(() => {
    if (
      selectedWorkflow?.status === 'COMPLETED' ||
      selectedWorkflow?.status === 'FAILED'
    ) {
      queryClient.invalidateQueries({ queryKey: useGetWorkflows.getKey() });
    }
  }, [selectedWorkflow?.status, queryClient]);

  const handleNew = () => {
    setSelectedId(null);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const isHistoryLoading = isLoading || isFetching;

  if (isBackendDown) {
    return (
      <div className="flex items-center justify-center h-screen bg-background p-6">
        <div className="w-full max-w-md rounded-xl border bg-card shadow-lg p-6 space-y-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-destructive" />
          </div>

          <div className="text-center space-y-2">
            <h2
              className={cn(
                'text-lg font-semibold',
                isHealthChecking
                  ? 'text-muted-foreground'
                  : health?.status === 'degraded'
                    ? 'text-yellow-600'
                    : 'text-red-600'
              )}
            >
              {isHealthChecking
                ? 'Checking Backend Status'
                : health?.status === 'degraded'
                  ? 'Backend Degraded'
                  : 'Backend Down'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isHealthChecking
                ? 'Checking backend status...'
                : 'The backend is not responding properly.'}
            </p>
          </div>

          {!isHealthChecking && health?.services && (
            <div className="space-y-2 text-sm">
              {Object.entries(health.services).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <span className="capitalize">{key}</span>
                  <span
                    className={cn(
                      'font-medium',
                      value === 'healthy' || value === 'configured'
                        ? 'text-green-600'
                        : 'text-red-600'
                    )}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar
        history={history}
        isLoading={isHistoryLoading}
        selectedId={selectedId || undefined}
        currentWorkflow={selectedWorkflow}
        onWorkflowSelect={(wf) => handleSelect(wf.id)}
        onNew={handleNew}
      />

      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b bg-background px-4 lg:h-15">
          <SidebarTrigger />
          <div className="flex-1 text-sm font-medium text-muted-foreground">
            {selectedWorkflow ? 'Workflow Details' : 'New Workflow'}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 md:p-8 relative">
          <div className="max-w-4xl mx-auto">
            {selectedId ? (
              isWorkflowLoading || !selectedWorkflow ? (
                <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-muted-foreground animate-pulse">
                    Fetching workflow details...
                  </p>
                </div>
              ) : (
                <WorkflowResults
                  workflow={selectedWorkflow}
                  onBack={() => setSelectedId(null)}
                />
              )
            ) : (
              <WorkflowForm onSuccess={(wf) => setSelectedId(wf.id)} />
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
