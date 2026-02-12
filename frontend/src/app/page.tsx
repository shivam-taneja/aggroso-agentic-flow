'use client';

import { AppSidebar } from '@/components/sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { WorkflowForm } from '@/components/workflow-form';
import { WorkflowResults } from '@/components/workflow-results';
import { useGetWorkflows, usePollWorkflow } from '@/hooks/api/workflows';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: history = [], isLoading, isFetching } = useGetWorkflows();

  const { data: selectedWorkflow, isLoading: isWorkflowLoading } = usePollWorkflow({
    variables: { id: selectedId || '' },
    enabled: !!selectedId,
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

  const isHistoryLoading = isLoading || isFetching

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
