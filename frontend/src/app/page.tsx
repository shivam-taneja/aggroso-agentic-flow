'use client';

import { Sidebar } from '@/components/sidebar';
import { WorkflowForm } from '@/components/workflow-form';
import { WorkflowResults } from '@/components/workflow-results';
import { useGetWorkflows, usePollWorkflow } from '@/hooks/api/workflows';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: history = [], isLoading: isHistoryLoading } = useGetWorkflows();

  const { data: selectedWorkflow, isLoading: isWorkflowLoading } = usePollWorkflow({
    variables: { id: selectedId || '' },
    enabled: !!selectedId,
  });

  useEffect(() => {
    if (selectedWorkflow?.status === 'COMPLETED' || selectedWorkflow?.status === 'FAILED') {
      queryClient.invalidateQueries({ queryKey: useGetWorkflows.getKey() });
    }
  }, [selectedWorkflow?.status, queryClient]);

  const handleNew = () => {
    setSelectedId(null);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {isHistoryLoading ? (
        <aside className="w-80 border-r flex items-center justify-center bg-muted/10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/50" />
        </aside>
      ) : (
        <Sidebar
          history={history}
          selectedId={selectedId || undefined}
          currentWorkflow={selectedWorkflow}
          onSelect={(wf) => handleSelect(wf.id)}
          onNew={handleNew}
        />
      )}

      <main className="flex-1 overflow-y-auto bg-slate-50/50 p-8 relative">
        <div className="max-w-4xl mx-auto">
          {selectedId ? (
            isWorkflowLoading || !selectedWorkflow ? (
              <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Fetching workflow details...</p>
              </div>
            ) : (
              <WorkflowResults
                workflow={selectedWorkflow}
                onBack={() => setSelectedId(null)}
              />
            )
          ) : (
            <WorkflowForm
              onSuccess={(wf) => setSelectedId(wf.id)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
