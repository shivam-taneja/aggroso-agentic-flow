import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Workflow } from '@/types';
import {
  CheckCircle2,
  ChevronRight,
  History,
  Loader2,
  XCircle,
} from 'lucide-react';

interface WorkflowResultsProps {
  workflow: Workflow;
  onBack: () => void;
}

export function WorkflowResults({ workflow, onBack }: WorkflowResultsProps) {
  const isComplete = workflow.status === 'COMPLETED';
  const isFailed = workflow.status === 'FAILED';
  const isInProgress =
    workflow.status === 'IN_PROGRESS' || workflow.status === 'PENDING';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <History className="h-4 w-4" />
          </Button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold tracking-tight">Run Results</h2>
        </div>

        <Badge
          variant={
            isComplete ? 'default' : isFailed ? 'destructive' : 'secondary'
          }
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

      <div className="space-y-4">
        <Accordion
          type="single"
          collapsible
          className="w-full space-y-2"
          defaultValue={
            workflow.results?.length
              ? `item-${workflow.results.length - 1}`
              : undefined
          }
        >
          {workflow.results?.map((res, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="border rounded-lg bg-card px-4"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <Badge variant="outline" className="font-mono whitespace-nowrap">
                    STEP {idx + 1}
                  </Badge>

                  <span className="font-medium text-sm line-clamp-1">
                    {res.step}
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pt-2 pb-4">
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-md">
                  {res.output}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {isInProgress && (
          <div className="relative animate-pulse mt-4">
            <div className="h-16 rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/5 flex items-center justify-center text-muted-foreground text-sm gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
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
