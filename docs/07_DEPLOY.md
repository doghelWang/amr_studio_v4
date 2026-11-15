# Deployment

2026-11-14 · status: **ready to deploy, not yet deployed to Cloudflare** (this session has no Cloudflare credentials)

## What was done

| Step | Result |
|---|---|
| Ran the Worker under the real Workers runtime (`wrangler dev`, workerd) | Found and fixed two problems that the Node tests could not see (below) |
| API smoke test on workerd | version, PUT, GET list, bad upload → 422 JSON, DELETE all correct |
| Full browser walkthrough against workerd (`BASE_URL=http://localhost:8799 npm run e2e`) | **21 steps passed**, 0 runtime errors in the Worker log |
| `wrangler deploy --dry-run` | bundles; Worker script 35 KiB (9.5 KiB gzip), 5 asset files, bindings resolved |
| Unit tests | 62 passed |

### Problems found by running on the real runtime

1. **Run-time code generation.** The Worker decoded uploads with protobufjs, which builds its decoders with `new Function`. Cloudflare Workers forbid that, so every save would have failed in production. The Worker now checks only the container (zip, file description, MD5 of every listed file) through `@amr/core/container`, which has no protobuf dependency. A test guards this.
2. **Entry module exports.** A Workers entry module may export only handlers; exporting the `VERSION` constant made the runtime refuse to start. The API moved to `apps/worker/src/api.ts`; `worker.ts` exports the handler only.

## How to deploy

From a terminal that is logged in to Cloudflare (`npx wrangler whoami`):

```
git fetch origin && git checkout rewrite/v5
npm install
npm run deploy          # = npm run build, then wrangler deploy in apps/worker
```

This creates a **separate Worker named `amr-studio-v5`** on its `workers.dev` address. It does not touch the v4 Worker (`amr-studio-v4`, serving cloud-ai.work) or its routes. It shares the v4 KV namespace but writes only keys starting with `cmodel:`.

Then test the live site with the same walkthrough:

```
BASE_URL=https://amr-studio-v5.<your-subdomain>.workers.dev npm run e2e
```

## Replacing v4 on cloud-ai.work (later, when you decide)

Add the `routes` block from v4's `wrangler.jsonc` to `apps/worker/wrangler.jsonc` and deploy; or point Workers Builds at `rewrite/v5` with build command `npm install && npm run build` and deploy command `npx wrangler deploy -c apps/worker/wrangler.jsonc`. v4's saved projects use a different storage format and will not appear in v5.

## Observed while checking

`https://cloud-ai.work/api/v1/system/version` answers (v4, build of 2026-09-13). `https://amr.cloud-ai.work/` returned Cloudflare error 522 from this environment at 21:39 PST; worth a look from your side.
