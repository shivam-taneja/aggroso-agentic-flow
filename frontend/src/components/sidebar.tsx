'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Workflow } from '@/types';
import { format } from 'date-fns';
import { Activity, History as HistoryIcon, Loader2, Play, Plus } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from './ui/card';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  history: Workflow[];
  selectedId: string | undefined;
  currentWorkflow: Workflow | null | undefined;
  isLoading?: boolean;

  onWorkflowSelect: (workflow: Workflow) => void;
  onNew: () => void;
}

export function AppSidebar({
  history,
  selectedId,
  currentWorkflow,
  isLoading,
  onWorkflowSelect,
  onNew,
  ...props
}: AppSidebarProps) {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'default';
      case 'FAILED': return 'destructive';
      case 'IN_PROGRESS': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b p-4">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2 px-2">
          <div className="h-8 w-8 bg-primary text-primary-foreground rounded flex items-center justify-center">
            <Play size={16} fill="currentColor" />
          </div>
          Workflow Lite
        </h1>
        <Button onClick={onNew} className="w-full mt-4 cursor-pointer" variant="default">
          <Plus className="mr-2 h-4 w-4" /> New Workflow
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-4 py-2 space-y-2">
                    <Skeleton className="h-4 w-full bg-foreground/10" />
                    <Skeleton className="h-3 w-2/3 bg-foreground/10" />
                  </div>
                ))
              ) : history.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  No workflows yet. Start one!
                </div>
              ) : (
                <>
                  {history.map((wf) => {
                    const displayWf =
                      currentWorkflow && currentWorkflow.id === wf.id
                        ? currentWorkflow
                        : wf;
                    const isActive = selectedId === displayWf.id;

                    return (
                      <SidebarMenuItem key={displayWf.id}>
                        <SidebarMenuButton
                          onClick={() => onWorkflowSelect(displayWf)}
                          isActive={isActive}
                          size="lg"
                          asChild
                        >
                          <Card
                            className={cn(
                              'cursor-pointer transition-all hover:bg-accent p-0 h-full',
                              isActive ? 'border-primary bg-accent' : ""
                            )}
                          >
                            <CardContent className="p-3">
                              <div className="flex justify-between items-start mb-2">
                                <Badge
                                  variant={getBadgeVariant(displayWf.status)}
                                  className="text-[10px] px-1 py-0 h-5 gap-1"
                                >
                                  {displayWf.status === 'IN_PROGRESS' && (
                                    <Loader2 className="h-2 w-2 animate-spin" />
                                  )}
                                  {displayWf.status}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                  {format(new Date(displayWf.createdAt), 'hh:mm aa')}
                                </span>
                              </div>
                              <p className="text-sm font-medium line-clamp-2 leading-tight text-foreground/90">
                                {displayWf.originalInput}
                              </p>
                            </CardContent>
                          </Card>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}

                  {/* Replaced Load More with History Page Link */}
                  <div className="p-2 pt-4">
                    <Button
                      variant="ghost"
                      className="w-full text-xs cursor-pointer justify-start text-muted-foreground hover:text-foreground"
                      size="sm"
                      asChild
                    >
                      <Link href="/history">
                        <HistoryIcon className="mr-2 h-3 w-3" />
                        View Full History
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="sm">
              <Link href="/status">
                <Activity className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>System Status</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
