# Workflow Builder

A web application that allows users to create, run, and track multi-step AI workflows. The system processes steps sequentially using a background queue to handle long-running AI tasks without blocking the user interface.

- Live Demo: [aggroso-agentic-flow.shivamtaneja.com](https://aggroso-agentic-flow.shivamtaneja.com/)
- Live API: [api.aggroso-agentic-flow.shivamtaneja.com](https://api.aggroso-agentic-flow.shivamtaneja.com/)
  
## Project Structure

This is a monorepo containing:

- **backend/**: NestJS application handling API requests, database interactions, and background job processing.
- **frontend/**: Next.js application providing the user interface.

## Prerequisites

- Node.js (v22.18.0 recommended)
- pnpm (v8.15.5)
- Docker Desktop (Required for local database and queue)

## Quick Start (Local Development)

#### To setup backend: See [backend/README.md](./backend/README.md) for detailed instructions.

#### To setup frontend: See [frontend/README.md](./frontend/README.md) for detailed instructions.

## Architecture

1.  **Frontend**: Submits a workflow request (input text + steps) to the API.
2.  **API**: Saves the workflow to PostgreSQL with `PENDING` status and adds a job to the Redis Queue. Returns immediately.
3.  **Processor (BullMQ)**: Picks up the job in the background.
    *   Iterates through steps.
    *   Calls Google Gemini AI for processing.
    *   Updates the database with results after *every* step to allow real-time tracking.
4.  **Frontend Polling**: The UI polls the API endpoint to retrieve updates and displays them live.

## Deployment

The application is designed to support both local Docker environments and cloud platforms (like Render/Railway) via environment variables.

- **Local**: Uses `DB_HOST`, `DB_PORT`, etc., to connect to Docker containers.
- **Production**: If `NODE_ENV=production`, the app ignores local settings and strictly requires `DATABASE_URL` (Postgres) and `REDIS_URL` (Upstash/Redis).

> [!NOTE] 
> Refer to the [backend README](./backend/README.md) for specific environment variable configurations.