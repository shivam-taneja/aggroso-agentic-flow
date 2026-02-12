# Workflow Builder - Backend

This is the REST API and background worker service built with NestJS.

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL (via TypeORM)
- **Queue**: BullMQ (Redis)
- **AI Provider**: Google Gemini
- **Validation**: Joi

## Setup
1.  Install dependencies:
    ```bash
    pnpm install
    ```

2.  Configure Environment Variables:
    Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```

3.  Update `.env` with your credentials:
    **Required for all environments:**
    - `GEMINI_API_KEY`: Your Google Gemini API Key.
    - `PORT`: 3000 (default).

    **For Local Development (`NODE_ENV=development`):**
    - `DB_HOST`: localhost
    - `DB_PORT`: 5436 (mapped in docker-compose)
    - `DB_USER`: postgres
    - `DB_PASSWORD`: dev_password
    - `DB_NAME`: workflow_db
    - `REDIS_HOST`: localhost
    - `REDIS_PORT`: 6379

    **For Production (`NODE_ENV=production`):**
    - `DATABASE_URL`: Full connection string (e.g., from Neon/Supabase).
    - `REDIS_URL`: Full connection string (e.g., from Upstash).

4.  Start the PostgreSQL and Redis containers using Docker:
    ```bash
    pnpm du
    ```
## Running the App

```bash
pnpm dev
```

## API Endpoints

- `GET /health`: Check service health status.
- `POST /workflows`: Create and trigger a new workflow.
- `GET /workflows`: Fetch execution history.
- `GET /workflows/:id`: Fetch details of a specific workflow.

## Database Migrations (Production)

- In `development`, `synchronize: true` is enabled by default, so tables are created automatically.
- In `production`, `synchronize` is set to `false` to prevent accidental data loss.

> [!NOTE]
> **Important for First Deployment:**
> On your very first deployment to production, you must temporarily enable synchronization to create the tables.
> 
> 1. Open [`src/app.module.ts`](./src/app.module.ts).
> 2. Locate the production configuration inside `TypeOrmModule` (approx line 82).
> 3. Change `synchronize: false` to `synchronize: true`.
> 4. Deploy.
> 5. Once deployed, revert the change back to `false` and redeploy.