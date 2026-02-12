import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Workflow } from '@/types';
import { CheckCircle2, ChevronRight, History, Loader2, XCircle } from 'lucide-react';

interface WorkflowResultsProps {
  workflow: Workflow;
  onBack: () => void;
}

export function WorkflowResults({ workflow, onBack }: WorkflowResultsProps) {
  const isComplete = workflow.status === 'COMPLETED';
  const isFailed = workflow.status === 'FAILED';
  const isInProgress = workflow.status === 'IN_PROGRESS' || workflow.status === 'PENDING';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <History className="h-4 w-4" />
          </Button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold tracking-tight">Run Results</h2>
        </div>
        
        <Badge 
          variant={isComplete ? 'default' : isFailed ? 'destructive' : 'secondary'}
          className="px-3 py-1 text-sm gap-2"
        >
          {isInProgress && <Loader2 className="h-3 w-3 animate-spin" />}
          {isComplete && <CheckCircle2 className="h-3 w-3" />}
          {isFailed && <XCircle className="h-3 w-3" />}
          {workflow.status}
        </Badge>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Original Input
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-md text-sm leading-relaxed border max-h-40 overflow-y-auto">
            {workflow.originalInput}
          </div>
        </CardContent>
      </Card>

      <div className="relative pl-8 border-l-2 border-muted space-y-8 py-4">
        {workflow.results?.map((res, idx) => (
          <div key={idx} className="relative animate-in slide-in-from-left-2 duration-300">
            <div className="absolute -left-10.25 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-primary text-primary text-xs font-bold shadow-sm z-10">
              {idx + 1}
            </div>

            <Card className="overflow-hidden pt-0">
              <CardHeader className="bg-muted/30 py-3 pt-6 border-b flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    STEP {idx + 1}
                  </Badge>
                  <span className="font-medium text-sm">{res.step}</span>
                </div>
              </CardHeader>
              <CardContent className="bg-card">
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                  {res.output}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {isInProgress && (
          <div className="relative animate-pulse">
            <div className="absolute -left-10.25 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-muted-foreground/20 text-muted-foreground text-xs font-bold">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="h-24 rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/5 flex items-center justify-center text-muted-foreground text-sm">
              Processing step {(workflow.results?.length || 0) + 1}...
            </div>
          </div>
        )}
        
        {isFailed && workflow.error && (
           <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
             Error: {workflow.error}
           </div>
        )}
      </div>
    </div>
  );
}
