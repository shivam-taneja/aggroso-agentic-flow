'use client';

import { ModeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useHealthCheck } from '@/hooks/api/health';
import { cn } from '@/lib/utils';
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Database,
  RefreshCcw,
  Server,
  Workflow,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function StatusPage() {
  const { data: health, isLoading, isFetching, refetch } = useHealthCheck();

  const services = [
    {
      key: 'database',
      label: 'PostgreSQL Database',
      icon: Database,
      status: health?.services?.database || 'unknown',
    },
    {
      key: 'redis',
      label: 'Redis Queue',
      icon: Server,
      status: health?.services?.redis || 'unknown',
    },
    {
      key: 'llm',
      label: 'Gemini AI Connection',
      icon: Workflow,
      status: health?.services?.gemini || 'unknown',
    },
  ];

  const isGlobalHealthy = health?.status === 'ok';
  const loading = isFetching || isLoading

  return (
    <div className="relative min-h-screen w-full bg-background">
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6 rounded-xl border bg-card p-6 shadow-lg">

          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="rounded-full bg-muted p-3">
              <Activity
                className={cn(
                  'h-8 w-8',
                  loading
                    ? 'animate-pulse text-muted-foreground'
                    : isGlobalHealthy
                      ? 'text-green-600'
                      : 'text-red-600'
                )}
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                System Status
              </h1>
              <p className="text-sm text-muted-foreground">
                Live health check of all infrastructure components.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex h-12 animate-pulse items-center justify-between rounded-lg border bg-muted/50 px-4"
                />
              ))
            ) : (
              <>
                <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Backend API</span>
                  </div>
                  <StatusBadge status={isGlobalHealthy ? 'up' : 'down'} />
                </div>

                {services.map((service) => (
                  <div
                    key={service.key}
                    className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <service.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{service.label}</span>
                    </div>
                    <StatusBadge status={service.status} />
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link href="/" passHref>
              <Button variant="outline" className="w-full cursor-pointer">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to App
              </Button>
            </Link>

            <Button
              onClick={() => refetch()}
              disabled={loading}
              variant="secondary"
              className="w-full cursor-pointer"
            >
              <RefreshCcw
                className={cn('mr-2 h-4 w-4', loading && 'animate-spin')}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase() || '';

  const isUp =
    s === 'up' ||
    s === 'ok' ||
    s === 'healthy' ||
    s === 'configured' ||
    s === 'connected';

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border',
        isUp
          ? 'border-green-200 bg-green-100 text-green-700 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-400'
          : 'border-red-200 bg-red-100 text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400'
      )}
    >
      {isUp ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <XCircle className="h-3.5 w-3.5" />
      )}
      <span className="capitalize">
        {isUp ? 'Operational' : 'Downtime'}
      </span>
    </div>
  );
}
