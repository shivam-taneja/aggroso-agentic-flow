import { ModeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      <div className="space-y-6 max-w-md w-full">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-muted/50 blur-xl" />
            <div className="relative rounded-full bg-muted p-6">
              <FileQuestion className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            404
          </h1>
          <h2 className="text-xl font-semibold tracking-tight">
            Page not found
          </h2>
          <p className="text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
          </p>
        </div>

        <div className="pt-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
