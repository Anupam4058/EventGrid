# Deployment guide — monorepo (Vercel)

This document describes how to deploy the EventGrid monorepo (Frontend + Backend) to Vercel using the repository-root `vercel.json` and the backend adapter at `Backend/api/index.js`.

## What we changed in the repo

- Added `vercel.json` at the repository root. It builds the frontend (`Frontend/package.json`) with `@vercel/static-build` and builds the backend function from `Backend/api/index.js` with `@vercel/node`.
- Added `Backend/api/index.js` which exports the Express `app` from `App.js` so Vercel can invoke it as a serverless function.
- Removed a local `file:..` dependency from `Frontend/package.json` (the frontend doesn't need the backend as an npm dependency to build).

If you prefer the backend deployed separately (different host), skip the backend function steps and deploy `Frontend` alone to Vercel.

## Local validation (recommended)

1. Build the Frontend

   Open PowerShell and run:

   ```pwsh
   cd Frontend
   npm install
   npm run build
   ```

   This produces the `Frontend/dist` folder.

2. Start the Backend locally

   In a new shell:

   ```pwsh
   cd Backend
   npm install
   node server.js
   ```

   - The server listens on `process.env.PORT || 3000` (default 3000).
   - Visit http://localhost:3000 — it will serve `Frontend/dist/index.html` and provide API endpoints under `/api/*`.

3. Smoke test API endpoints

   Example with curl (PowerShell):

   ```pwsh
   curl http://localhost:3000/api/profiles
   curl http://localhost:3000/api/events
   ```

## Configure environment variables in Vercel

Set these at the project level in the Vercel dashboard (do NOT commit secrets into the repo):

- `DB_CONNECT` — MongoDB connection string (production DB URI)
- Any other third-party API keys or secrets

Set values for both Preview and Production environments as required.

## Import repository into Vercel

1. Go to vercel.com and click **New Project** → **Import Git Repository** → select `EventGrid`.
2. Vercel will detect `vercel.json` at repo root. Confirm the Root Directory is the repository root (so the root `vercel.json` is used).
3. During import you can set Environment Variables (or set them later in Project Settings).
4. Deploy. Vercel will run two builds:
   - `@vercel/static-build` for `Frontend` (runs `npm run build` in `Frontend` and expects `dist`)
   - `@vercel/node` for `Backend/api/index.js` (packaged as a serverless function)

## Routing behaviour after deploy

- Requests to `/api/*` are routed to the serverless backend function (`Backend/api/index.js`).
- All other requests are served from the frontend static build (`Frontend/dist`) with a SPA fallback to `index.html`.

## Notes: serverless constraints and DB connections

Serverless functions (Vercel) are stateless and have cold starts. Opening a new MongoDB connection on every invocation is inefficient and can hit connection limits. Use connection caching in `database/db.js`:

- Common pattern (Node/Mongoose): cache the established connection in a module-scoped variable so subsequent invocations reuse it.
- If you'd like, I can update `database/db.js` to apply the connection cache pattern.

Example pattern (conceptual):

```js
let cached = global._mongoClientPromise;
if (!cached) {
  const client = new MongoClient(process.env.DB_CONNECT, options);
  cached = client.connect();
  global._mongoClientPromise = cached;
}
module.exports = cached;
```

If you're using Mongoose, the pattern is similar: store the mongoose connection or promise on `global` and only call `mongoose.connect` when needed.

## Troubleshooting

- If the frontend build fails in Vercel: make sure `Frontend/package.json` `build` script is `vite build` and that the `dist` directory is used in `vercel.json`.
- If backend fails to connect to DB in production: verify `DB_CONNECT` value in Vercel dashboard and confirm network access (Atlas IP whitelist, VPC, etc.).
- Inspect Vercel Deploy Logs (Build logs and Function logs) for errors. Use `vercel` CLI or dashboard to view logs.

## Optional: Deploy with Vercel CLI

You can also deploy from your machine with the Vercel CLI (requires `npm i -g vercel`):

```pwsh
# from repo root
vercel login
vercel --prod
```

When using the CLI, Vercel will read `vercel.json` in repo root and deploy accordingly.

## Next steps (recommended)

1. (Optional) Let me update `database/db.js` to use connection caching for serverless.
2. Add a short `DEPLOYMENT.md` (this file) — done.
3. Add production environment variables in Vercel and redeploy.

If you want, I can also: (a) update `database/db.js` for serverless-friendly connects, (b) add a small GitHub Actions workflow to run tests/builds on push, or (c) show exact Vercel dashboard screenshots for each setting.
