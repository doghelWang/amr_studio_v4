# AMR Studio V4 Cloudflare Worker Verification Report

Date: 2026-07-11

## Scope

Prepare and verify a Cloudflare Worker deployment layer for AMR Studio V4.

The Worker serves the Vite frontend from Cloudflare Assets and proxies backend-dependent paths to the existing backend origin:

```text
http://116.62.39.177:8888
```

## Changes

- Added `wrangler.jsonc`.
- Added `cloudflare/worker.js`.
- Added `docs/CLOUDFLARE_WORKER_DEPLOYMENT.md`.

## Validation Results

| Check | Result | Evidence |
| --- | --- | --- |
| Frontend production build | PASS | `npm run build` completed successfully in `src/frontend`. |
| Worker config dry run | PASS | `npx wrangler deploy --dry-run --outdir /tmp/amr-studio-v4-worker-dry-run` completed successfully. |
| Remote backend health | PASS | `GET http://116.62.39.177:8888/api/v1/system/version` returned backend version `1.0.1`. |
| Local Worker static frontend | PASS | `HEAD http://127.0.0.1:8787/` returned `200 OK`. |
| Local Worker API proxy | PASS | `GET http://127.0.0.1:8787/api/v1/system/version` returned backend version `1.0.1`. |
| Local Worker schema proxy | PASS | `GET http://127.0.0.1:8787/api/v1/schemas` returned module schema data. |
| Temporary Cloudflare deploy | PASS WITH LIMITATION | `npx wrangler deploy --temporary` deployed version `ac63db48-8955-40cb-8afc-0e73d29c7731`. |
| Temporary workers.dev smoke test | BLOCKED BY CLOUDFLARE CHALLENGE | `curl` received `403` with `cf-mitigated: challenge`. |
| Production Cloudflare token identity | PASS | Wrangler identified account `2cead9db180dddbd0e7389d2eea893f7`. |
| Production Cloudflare deploy | BLOCKED BY TOKEN PERMISSIONS | Cloudflare API returned `Authentication error [code: 10000]`; Wrangler reported missing `User -> Memberships -> Read`. |
| Production Cloudflare deploy with updated token | PASS | Deployed `https://amr-studio-v4.wangrunxi30.workers.dev`, latest tested version `e718ebde-2362-4947-8a30-c64ff6151d71`. |
| Production frontend smoke test | PASS | `GET /` returned the Vite app shell and referenced the built JS/CSS assets. |
| Production static XML smoke test | PASS | `GET /models/v4/BoardDescriptions.xml` returned `200 OK`. |
| Production API proxy smoke test | BLOCKED BY CLOUDFLARE DIRECT-IP PROTECTION | Worker fetch to backend IP returned Cloudflare `1003`. DNS helper domains resolved but hit Aliyun ICP host checks or Cloudflare `520`. |
| Worker TypeScript backend deploy | PASS | Deployed version `c9cef334-25f0-43f5-8937-2c5db350c97e`. |
| Worker TypeScript version API | PASS | `GET /api/v1/system/version` returned `1.0.1-worker-ts`. |
| Worker TypeScript schemas API | PASS | `GET /api/v1/schemas` returned `1,596,203` bytes, 19 schema groups. |
| Worker TypeScript boards API | PASS | `GET /api/v1/resources/boards` returned 4 board entries matching the Python backend snapshot. |
| Worker TypeScript saved-list API | PASS | `GET /api/v1/projects/saved-list` returned 6 saved project entries. |
| Worker TypeScript saved-project load API | PASS | `GET /api/v1/projects/load/robot01` returned project `robot01` with 15 components. |
| Worker TypeScript cmodel upload API | PASS AS EXPLICITLY NOT MIGRATED | `POST /api/v1/models/upload` returned structured `501 NOT_MIGRATED_TO_WORKER_TS`. |
| Cloudflare custom route | PASS | Worker deployed to `cloud-ai.work/*`, version `ab799653-25ea-4ff3-8778-a52d40638f84`. |
| Cloudflare custom domain frontend | PASS | `GET https://cloud-ai.work/` returned the Vite app shell. |
| Cloudflare custom domain version API | PASS | `GET https://cloud-ai.work/api/v1/system/version` returned `1.0.1-worker-ts`. |
| Cloudflare custom domain schemas API | PASS | `GET https://cloud-ai.work/api/v1/schemas` returned `1,596,203` bytes. |
| Worker KV namespace | PASS | Created and bound `AMR_PROJECTS`, namespace id `7b09e5334d584ea591ec8626f6fb22b3`. |
| Worker KV project save/load | PASS | Production smoke save and direct load succeeded through `POST /api/v1/projects/save` and `GET /api/v1/projects/load/{name}`. |
| Worker KV saved-list | PASS WITH NOTE | Saved KV project appeared after KV list consistency delay; direct load was immediate. |
| Worker KV sandbox init | PASS | `POST /api/v1/models/init-sandbox` stored a 2-component sandbox in KV on local and production. |
| Worker KV component get/patch | PASS | `GET/PATCH /api/v1/models/{project_id}/components/comp_gyro` read and updated `mountX` locally and on `cloud-ai.work`. |
| Worker KV abilities get/patch | PASS | `GET/PATCH /api/v1/models/{project_id}/abilities` read and updated ability payload locally and on `cloud-ai.work`. |
| Worker KV functions get | PASS | `GET /api/v1/models/{project_id}/functions` returned the provided raw function data locally and on `cloud-ai.work`. |
| Worker frontend-only compile | PASS | Local and production `init-sandbox -> compile -> download` for saved frontend config `robot01` generated a valid `.cmodel`. |
| Worker cmodel upload parse | PASS | Local and production `POST /api/v1/models/upload` parsed a real `.cmodel` file using Worker TypeScript static protobuf decoders. |
| Worker cmodel CompDesc decode | PASS | Upload returned `full_json` with CompDesc keys `modelVersion`, `moduleComponets`, `moduleGroupName`, `moduleGroupUuid`, `moduleSys`, `moreModuleInfo`. |
| Worker cmodel AbiSet decode | PASS | Upload stored AbiSet and subsequent `GET /api/v1/models/{project_id}/abilities` returned `80,109` bytes for the tested model. |
| Worker cmodel FuncDesc absent handling | PASS | Tested model did not contain `FuncDesc.model`; Worker returned `{}` for functions and recorded the absence in audit. |
| Worker cmodel compile/export | PASS | Local and production upload -> compile -> download returned a valid `.cmodel` zip. |
| Worker cmodel manifest integrity | PASS | Downloaded `.cmodel` contained `CompDesc.model`, `AbiSet.model`, `ModelFileDesc.json`; manifest MD5 values matched file bytes. |
| Worker frontend CompDesc content | PASS | Production frontend-config compile produced `CompDesc.model` of `31,042` bytes; Python protobuf decode found `11` root child module groups and first group contained `1` component. |
| Worker component PATCH rematerialization fix deploy | PASS | Deployed Cloudflare Worker version `9ef33489-7f5b-48cd-9fdf-c0e29884df25` to `cloud-ai.work/*`. |
| Imported cmodel PATCH -> compile -> decode | PASS | Uploaded `MQ-Q3-600LE-DT.cmodel`, patched component `e703da1c58fd4950b35b0918dcfc57f6` with `locCoordX=4321.25`, compiled and decoded final `CompDesc.model`; decoded value remained `4321.25`. |
| Frontend config PATCH -> compile -> decode | PASS | Loaded saved project `robot01`, initialized sandbox, patched component `247ab1e1-4538-48ca-90db-0e006b96f437` with `locCoordY=-987.5`, compiled and decoded final `CompDesc.model`; decoded value remained `-987.5`. |
| Temporary verification KV cleanup | PASS | Removed the smoke-test sandbox and artifact keys for `import_MQ_Q3_600LE_DT_b156df1d` and `verify_robot01_mrgcg5bp`. |

## Temporary Deployment

Temporary URL:

```text
https://amr-studio-v4.buttery-principal.workers.dev
```

Claim URL, valid for the temporary account window reported by Wrangler:

```text
https://dash.cloudflare.com/claim-preview?claimToken=xw7Hl1lZdJkCT1OkaV5rPnLPMslcwZGG5kzSl7cbqdM
```

## Regression Notes

Backend pytest regression could not be executed because `pytest` is not installed in the available Python environments:

- `/Users/wangfeifei/miniconda3/bin/python3`
- `src/backend/.venv310/bin/python`

No backend business code was changed in this deployment step.

## Production Deployment Result

Cloudflare production URL:

```text
https://amr-studio-v4.wangrunxi30.workers.dev
```

Cloudflare custom domain:

```text
https://cloud-ai.work/
```

Frontend static assets are live.

The first backend TypeScript migration slice is live on Cloudflare Worker.

Migrated endpoints:

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

Persistence:

```text
Cloudflare KV binding: AMR_PROJECTS
Namespace id: 7b09e5334d584ea591ec8626f6fb22b3
Key format: project:{name}
```

Backend API proxy is not fully live because Cloudflare Workers cannot reliably fetch the current bare-IP backend origin:

```text
116.62.39.177:8888
```

Observed failures:

- Direct dotted IP backend origin from Worker: Cloudflare `1003`.
- DNS helper domain resolving to the backend IP: Aliyun ICP filing block unless host header is rewritten.
- DNS helper domain plus backend IP host header: Cloudflare `520`.
- Decimal IPv4 backend origin from Worker: Cloudflare `1003`.

Local direct origin access remains healthy:

```text
GET http://116.62.39.177:8888/api/v1/system/version
```

## Conclusion

The Cloudflare Worker deployment layer is live.

Frontend deployment is complete. The first backend TypeScript API slice is complete.

Remaining backend migration work:

- Store uploaded `.cmodel` originals in R2 if original binary retention is required.
- Add module list/debug artifact export equivalents where required.

Latest component mutation fix:

- `GET/PATCH /api/v1/models/{project_id}/components/{module_uuid}` now falls back to the decoded protobuf `fullJson` tree when a sandbox was created from uploaded `.cmodel`.
- Protobuf-style snake_case patches are normalized to Worker camelCase object keys before merging, so fields such as `struct_param.extend_params[].double_value` can be encoded back into protobuf.
- Frontend-created sandboxes rebuild `fullJson` from current component state before compile, so patched pose fields are reflected in exported `CompDesc.model`.
- Compile now returns structured protobuf encode errors (`COMP_DESC_PROTOBUF_ENCODE_FAILED`, `ABI_SET_PROTOBUF_ENCODE_FAILED`, `FUNC_DESC_PROTOBUF_ENCODE_FAILED`) instead of opaque Worker 500 responses.

The recommended production deployment path is:

```bash
wrangler login
npx wrangler deploy
```

or:

```bash
CLOUDFLARE_API_TOKEN=... npx wrangler deploy
```

If using a custom API token, ensure it has at least the Cloudflare Workers deployment permissions required by Wrangler, including account-scoped Workers edit access and user membership read access.
