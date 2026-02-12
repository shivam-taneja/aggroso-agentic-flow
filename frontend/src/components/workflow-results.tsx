import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Workflow } from '@/types';
import { ChevronRight, History } from 'lucide-react';

interface WorkflowResultsProps {
  workflow: Workflow;
  onBack: () => void;
}

export function WorkflowResults({ workflow, onBack }: WorkflowResultsProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <History className="h-4 w-4" />
        </Button>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold tracking-tight">Run Results</h2>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Original Input
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-md text-sm leading-relaxed border">
            {workflow.originalInput}
          </div>
        </CardContent>
      </Card>

      <div className="relative pl-8 border-l-2 border-muted space-y-8 py-4">
        {workflow.results?.map((res, idx) => (
          <div key={idx} className="relative">
            <div className="absolute -left-10.25 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-primary text-primary text-xs font-bold shadow-sm">
              {idx + 1}
            </div>

            <Card>
              <CardHeader className="bg-muted/30 py-3 border-b">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    STEP {idx + 1}
                  </Badge>
                  <span className="font-medium text-sm">{res.step}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {res.output}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}