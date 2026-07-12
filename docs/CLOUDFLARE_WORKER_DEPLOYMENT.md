# AMR Studio V4 Cloudflare Worker Deployment

## Deployment Shape

The current project is deployed to Cloudflare in a staged Worker TypeScript backend shape:

- Cloudflare Worker + Assets serves the React/Vite frontend from `src/frontend/dist`.
- The Worker directly implements the first backend TypeScript API slice.
- Worker data snapshots are served from `src/frontend/public/worker-data`.
- Cloudflare KV stores user-saved projects created through the Worker API.
- Python/FastAPI cmodel parser, protobuf encoder/decoder, sandbox mutation, and cmodel export are not migrated yet.

This avoids inventing or approximating model data in the edge layer. Migrated endpoints use generated snapshots from the existing Python backend/resource library.

## Migrated Worker TypeScript Endpoints

```text
GET /api/v1/system/version
GET /api/v1/schemas
GET /api/v1/resources/boards
GET /api/v1/projects/saved-list
GET /api/v1/projects/load/{name}
POST /api/v1/projects/save
POST /api/v1/models/init-sandbox
GET /api/v1/models/{project_id}/components/{module_uuid}
PATCH /api/v1/models/{project_id}/components/{module_uuid}
GET /api/v1/models/{project_id}/abilities
PATCH /api/v1/models/{project_id}/abilities
GET /api/v1/models/{project_id}/functions
POST /api/v1/models/upload
POST /api/v1/models/{project_id}/compile
GET /downloads/{project_id}/{artifact}
```

These endpoints no longer depend on the Aliyun Python backend.

`saved-list` and `load` use KV first and static snapshots as fallback.

`init-sandbox` stores the frontend configuration as a Worker KV sandbox record and builds Worker-side protobuf `CompDesc` JSON from the explicit frontend component mapping.

`models/upload` parses `.cmodel` ZIP content in Worker TypeScript and decodes:

- `CompDesc.model` via generated static protobuf code.
- `AbiSet.model` via generated static protobuf code.
- `FuncDesc.model` via generated static protobuf code when present.

`models/{project_id}/compile` can compile both decoded `.cmodel` sandboxes and frontend-created config sandboxes. Frontend config is converted to CompDesc protobuf JSON inside Worker TypeScript using the same explicit module/category/interface/pose mapping rules ported from the existing Python/frontend code.

Component `PATCH` supports both frontend component fields and protobuf-style snake_case payloads. Position, shape, and name updates are mapped into the sandbox component state and re-materialized into `CompDesc.model` during compile; imported `.cmodel` sandboxes can also patch the decoded protobuf component tree directly by `moduleUuid`.

## Not Migrated Yet

The following API groups return `501 NOT_MIGRATED_TO_WORKER_TS`:

```text
Module list CSV and debug artifact export equivalents
```

These are not required for the browser's primary `.cmodel` import/export flow, but remain optional parity work if debug artifact downloads are required.

## Why Not Move All Backend Code Into Worker Now

Cloudflare Python Workers are available, but this backend currently depends on FastAPI, protobuf decoding/encoding, local project directories, uploaded `.cmodel` files, generated artifacts, and filesystem-backed debug outputs. Those can be migrated only after replacing filesystem persistence with Cloudflare storage services and validating protobuf/runtime compatibility.

## Commands

Build frontend:

```bash
cd src/frontend
npm run build
```

Preview locally through Wrangler:

```bash
npx wrangler dev
```

Deploy after Cloudflare authentication:

```bash
wrangler login
npx wrangler deploy
```

For token-based deployment:

```bash
CLOUDFLARE_API_TOKEN=... npx wrangler deploy
```

## Production Route

```text
https://cloud-ai.work/
```

The Worker is routed with:

```text
cloud-ai.work/*
```

## KV Namespace

```text
binding = AMR_PROJECTS
id = 7b09e5334d584ea591ec8626f6fb22b3
```

Saved projects are stored under:

```text
project:{name}
```

Note: Cloudflare KV `list()` is eventually consistent. A newly saved project can be loaded by name immediately, while `saved-list` may take a short time to include it.

## Verification Checklist

- `GET /` returns the React application.
- Browser refresh on nested routes returns the SPA shell.
- `GET /api/v1/system/version` returns backend version JSON through Cloudflare.
- `GET /api/v1/schemas` returns module schema data.
- `GET /api/v1/projects/saved-list` returns the static saved project snapshot.
- `GET /api/v1/projects/load/{name}` returns the selected saved project snapshot.
- `POST /api/v1/projects/save` persists a project config to KV.
- `POST /api/v1/models/init-sandbox` persists runtime model sandbox state to KV.
- `GET/PATCH /api/v1/models/{project_id}/components/{module_uuid}` reads and updates sandbox components.
- `GET/PATCH /api/v1/models/{project_id}/abilities` reads and updates sandbox abilities.
- `GET /api/v1/models/{project_id}/functions` reads sandbox function process data.
- `.cmodel` upload through `/api/v1/models/upload` returns parsed `full_json`, audit entries, and stores AbiSet/FuncDesc in the project sandbox.
- `.cmodel` compile through `/api/v1/models/{project_id}/compile` returns a downloadable `.cmodel` when the project sandbox was created from decoded protobuf JSON.
- Frontend-only config compile returns a downloadable `.cmodel` generated from Worker TypeScript CompDesc mapping.
