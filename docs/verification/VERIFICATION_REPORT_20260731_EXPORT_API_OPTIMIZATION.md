# AMR Studio V4 Export API Optimization Verification Report

Date: 2026-07-31

## Scope

This round optimizes the frontend export API path so that compile responses are handled consistently.

Before this change:

- `App.tsx` correctly called compile, read JSON, then downloaded `download_url`.
- `api_v2.ts` still had a legacy `apiCompileAndDownload` implementation that requested compile as `blob` and could save the compile JSON response as a `.cmodel` if reused.

After this change:

- `api_v2.ts` exposes `apiCompileProject()` for compile JSON.
- `api_v2.ts` exposes `resolveBackendAssetUrl()` and `triggerBrowserDownload()` for artifact downloads.
- `apiCompileAndDownload()` now compiles first and downloads the real artifact from `download_url`.
- `App.tsx` reuses the shared API service instead of issuing a separate raw compile `axios.post`.

## Files Changed

- `src/frontend/src/services/api_v2.ts`
- `src/frontend/src/App.tsx`

## Baseline Verification

- Backend unit tests:
  - Command: `PYTHONPATH=src/backend src/backend/.venv310/bin/python -m unittest discover -s tests/unit -p 'test_*.py'`
  - Result: `Ran 53 tests ... OK`
- Frontend build:
  - Command: `cd src/frontend && npm run build`
  - Result: PASS
  - Note: Vite chunk-size warning remains unchanged.
- Worker dry-run:
  - Command: `npx wrangler deploy --dry-run --outdir /tmp/amr-studio-v4-worker-dry-run-opt`
  - Result: not completed because `npx` stalled while fetching a transient Wrangler package. This was treated as tooling/network timeout, not a code failure.

## Post-change Verification

- Backend unit tests:
  - Result: `Ran 53 tests ... OK`
- Frontend build:
  - Result: PASS
- Local Node Worker-compatible API flow:
  - Command path:
    - `PORT=18889 npm run worker:server`
    - `POST /api/v1/models/upload`
    - `POST /api/v1/models/{project_id}/compile`
    - `GET /downloads/{project_id}/{artifact}`
  - Test model: `/Users/wangfeifei/Downloads/0323.cmodel`
  - Result:

```json
{
  "projectId": "import_0323_08670a38",
  "uploadStatus": "success",
  "compileStatus": "success",
  "hasDownloadUrl": true,
  "hasModuleListUrl": false,
  "artifactBytes": 19002
}
```

## Conclusion

The export API path is now internally consistent:

- compile returns JSON;
- artifact download follows `download_url`;
- frontend App and reusable API service use the same semantics;
- no model data is guessed or fabricated.

