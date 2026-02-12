import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Workflow } from '@/types';
import { Play, Plus } from 'lucide-react';

interface SidebarProps {
  history: Workflow[];
  selectedId: string | undefined;
  onSelect: (workflow: Workflow) => void;
  onNew: () => void;
}

export function Sidebar({ history, selectedId, onSelect, onNew }: SidebarProps) {
  return (
    <aside className="w-80 border-r flex flex-col bg-muted/10 h-full">
      <div className="p-6 border-b bg-background">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <div className="h-8 w-8 bg-primary text-primary-foreground rounded flex items-center justify-center">
            <Play size={16} fill="currentColor" />
          </div>
          Workflow Lite
        </h1>
        <Button onClick={onNew} className="w-full mt-6" variant="default">
          <Plus className="mr-2 h-4 w-4" /> New Workflow
        </Button>
      </div>

      <div className="p-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        History
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 pb-4">
          {history.map((wf) => (
            <Card
              key={wf.id}
              onClick={() => onSelect(wf)}
              className={`cursor-pointer transition-all hover:bg-accent ${
                selectedId === wf.id ? 'border-primary bg-accent' : ''
              }`}
            >
              <CardContent className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge
                    variant={wf.status === 'COMPLETED' ? 'default' : 'destructive'}
                    className="text-[10px] px-1 py-0 h-5"
                  >
                    {wf.status}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(wf.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm font-medium line-clamp-2 leading-tight text-foreground/90">
                  {wf.originalInput}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}