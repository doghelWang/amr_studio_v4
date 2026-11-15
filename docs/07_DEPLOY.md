# Deployment

2026-11-15 · status: **ready to deploy with `cf`, not yet deployed** (this session has no Cloudflare credentials)

Deployment uses Cloudflare's new CLI, **`cf`** (open beta, tested with `cf` 1.0.0-beta.32). Wrangler is no longer used anywhere in the project.

## How it is set up

| File | Role |
|---|---|
| `apps/web/cloudflare.config.ts` | The deployment config (replaces `wrangler.jsonc`): Worker name `amr-studio-v5`, entry `../worker/src/worker.ts`, SPA asset handling with `/api/*` sent to the Worker first, bindings `AMR_PROJECTS` (KV), `CF_VERSION_METADATA`, `ASSETS`. |
| `apps/web/vite.config.ts` | Adds `@cloudflare/vite-plugin` (beta). It builds the Worker and the app together into `apps/web/.cloudflare/output`, and runs the real Worker in workerd for `vite dev` / `vite preview`. |

`cf migrate` would by default have kept bundling through Wrangler (because the project had no Vite plugin); with the Vite plugin, neither `cf` nor the plugin depends on Wrangler.

Upgrades this required: Vite 5 → 7 (the plugin needs Vite 7+), `@vitejs/plugin-react` 4 → 5, Vitest 2 → 3. `cf` needs **Node 22.18 or newer**.

## Deploy (from a terminal on your machine)

```
cd ~/code/amr_studio_v5            # the rewrite/v5 worktree
git pull
node -v                            # must be 22.18+
npm install
npx cf auth login                  # opens the browser once
npx cf auth whoami
npm run deploy                     # = generate schema/catalog, then cf deploy in apps/web
```

This creates a **separate Worker named `amr-studio-v5`** on its `workers.dev` address. It does not touch v4 (`amr-studio-v4`, serving cloud-ai.work). It shares the v4 KV namespace but writes only keys starting with `cmodel:`.

Then test the live site:

```
BASE_URL=https://amr-studio-v5.<your-subdomain>.workers.dev npm run e2e
```

## Verified here

| Check | Result |
|---|---|
| `cf deploy --dry-run` | builds; Worker 32 KiB, 5 asset files; bindings `AMR_PROJECTS`, `ASSETS`, `CF_VERSION_METADATA` resolved |
| `vite preview` (Worker in workerd, local KV) + browser walkthrough | **21 steps passed** |
| Unit tests | 62 passed |
| Type check | clean |

### Problems found earlier by running on the real runtime (still fixed)

1. The Worker used protobufjs, which generates code at run time; Workers forbid it. The Worker now checks only the container through `@amr/core/container`.
2. A Workers entry module may export only handlers; the API lives in `apps/worker/src/api.ts`.

## Replacing v4 on cloud-ai.work (later, when you decide)

Add the custom domain or route to `cloudflare.config.ts` (`cf docs search "custom domain worker config"`) and deploy. v4's saved projects use a different storage format and will not appear in v5.

## Note

`cf` and `@cloudflare/vite-plugin` are both beta. Cloudflare's own guidance during the beta still recommends Wrangler for production CI pipelines; for a manual deploy like this one `cf` is fine.
