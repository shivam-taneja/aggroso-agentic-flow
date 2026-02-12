'use client';

import { Sidebar } from '@/components/sidebar';
import { WorkflowForm } from '@/components/workflow-form';
import { WorkflowResults } from '@/components/workflow-results';
import { useGetWorkflows } from '@/hooks/api/workflows';
import { Workflow } from '@/types';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

  const { data: history = [], isLoading, isFetching } = useGetWorkflows();

  const handleNew = () => {
    setSelectedWorkflow(null);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {isLoading ? (
        <aside className="w-80 border-r flex items-center justify-center bg-muted/10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/50" />
        </aside>
      ) : (
        <Sidebar
          history={history}
          selectedId={selectedWorkflow?.id}
          onSelect={setSelectedWorkflow}
          onNew={handleNew}
        />
      )}

      <main className="flex-1 overflow-y-auto bg-slate-50/50 p-8 relative">
        {!isLoading && isFetching && (
          <div className="absolute top-4 right-4 z-50">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/50" />
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {selectedWorkflow ? (
            <WorkflowResults
              workflow={selectedWorkflow}
              onBack={() => setSelectedWorkflow(null)}
            />
          ) : (
            <WorkflowForm
              onSuccess={(wf) => setSelectedWorkflow(wf)}
            />
          )}
        </div>
      </main>
    </div>
  );
}