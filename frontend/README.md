# Workflow Builder - Frontend

This is the user interface built with Next.js (App Router).

## Tech Stack

- **Framework**: Next.js 16+
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State/Fetching**: TanStack React Query (with Polling)
- **Icons**: Lucide React

## Setup
1.  Install dependencies:
    ```bash
    pnpm install
    ```

2.  Configure Environment Variables:
    Copy `.env.example` to `.env.local`:
    ```bash
    cp .env.example .env.local
    ```

    Set the API URL:
    ```
    NEXT_PUBLIC_API_URL=http://localhost:3000
    ```

## Running the App

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) (or whichever port Next.js assigns) to view the dashboard.

## Features

- **Templates**: Quick-start options for common workflows.
- **Real-time Updates**: Polls the backend to show step-by-step progress.
- **Responsive Sidebar**: Collapsible sidebar navigation powered by shadcn/ui, optimized for mobile.