# AMR Studio v5

Inspect, edit, validate and compare AMR `.cmodel` files. One TypeScript core (`@amr/core`) runs in the browser, the CLI and the Cloudflare Worker.

```
npm install
npm run gen          # schema + catalog from proto/ and catalog/
npm test             # 62 tests
npm run dev          # web UI at http://localhost:5173 (includes a local API)
npm run build        # production build into apps/web/dist
npm run e2e          # browser walkthrough against the build
npm run deploy       # build + wrangler deploy (needs `wrangler login`); see docs/07_DEPLOY.md
npm run amr -- check fixtures/diff-2lidar.cmodel
npm run amr -- diff  fixtures/modelset.cmodel fixtures/modelset-wide.cmodel
```

| Path | Content |
|---|---|
| `proto/` | the three `.proto` files (source of truth for types) |
| `catalog/` | module templates and board descriptions (source of truth for products) |
| `fixtures/` | real cmodels used by the tests |
| `packages/core` | codec, model view, edit operations, catalog, validation, diff |
| `packages/cli` | `amr` command |
| `apps/worker` | Cloudflare Worker: project storage API + static site |
| `apps/web` | React UI |
| `docs/` | redesign, plan, stage reports, test report, progress log; `docs/legacy` holds the v4 specs |

Design rule: the decoded protobuf message is the model. Nothing is mapped into a second shape, so nothing can be lost; `npm test` proves byte-identical round trips on every fixture.
