# AMR Studio V4 - Agent Guidelines

## Quick Start

```bash
python3 start.py              # Start both services (kills stale ports, health probes)
# Backend:  http://127.0.0.1:8002  (PYTHONPATH=src/backend)
# Frontend: http://127.0.0.1:3001  (Vite dev server, proxies /api → :8002)
```

## Build & Verify Commands

```bash
# Frontend build
cd src/frontend && npm run build

# Python backend regression
src/backend/venv/bin/python -m pytest tests/unit -q

# TypeScript backend and Worker type checks
cd src/backend_ts && npm run build
./src/frontend/node_modules/.bin/tsc --noEmit cloudflare/worker.ts --target ES2022 --moduleResolution bundler --module ESNext --types @cloudflare/workers-types --skipLibCheck

# CModel round-trip tests (separate package, not the frontend)
cd tests && npm run build && npm run test:run        # basic
cd tests && npm run build && npm run test:detailed    # comprehensive

# E2E (root package.json has Playwright)
npx playwright test
```

## Architecture

- **Python backend** (`src/backend/`): FastAPI + Protobuf. `main.py` is a thin entry point. Canonical layers are `app/api/`, `app/application/`, `app/domain/modeling/`, and `app/infrastructure/`. Generated Python protobuf stubs live in `app/infrastructure/protobuf/generated/`.
- **TypeScript backend** (`src/backend_ts/`): Node-compatible backend runtime used by supported deployments.
- **Cloudflare runtime** (`cloudflare/`): Worker API, Node compatibility adapter, and generated protobufjs models. It must not contain alternate Proto schemas.
- **Frontend** (`src/frontend/`): React 18 + Vite + Ant Design + Zustand. Key stores in `src/store/` — `useProjectStore.ts` is the main state, `ImportService.ts` / `ExportService.ts` handle data round-trip, `SchemaEngine.ts` drives schema-driven rendering, `PerformanceConfig.ts` centralizes Full Load ratios.
- **Tests** (`tests/`): Standalone TypeScript test package for CModel encode/decode round-trips. Does NOT depend on the frontend build.
- **Proto schemas**: Only the user-provided `specifications/protocols/*.proto` files are authoritative. Python and Worker bindings are generated directly from these files; do not create, copy, rewrite, or infer alternate `.proto` definitions.
- **Module library**: `src/backend/resources/modules/` contains the runtime JSON/XML module templates. Missing values remain unknown and must not be inferred from names.

## Critical Constraints (blockers if violated)

Full detail lives in `CONSTRAINTS.md`, `DATA_INTEGRITY_CONSTRAINTS.md`, and `ENGINEERING_CONSTRAINTS.md` (§1–§24). Key rules:

- **NO_HARDCODE**: Defaults come from `SchemaDefaults.ts` / `PerformanceConfig.ts` / module templates, never inline literals. Type lookups use `SchemaEngine.getAvailableSubTypes()` / `getValidSubType()`, not string constants.
- **NO_PARTIAL_PARSE / NO_PARTIAL_EXPORT**: All Proto fields must be handled. Use `FIELD_REGISTRY` arrays + iteration, never manual field-by-field assignment. `ROBOT_IDENTITY_FIELD_REGISTRY` in `ExportService.ts` must stay in sync with `types.ts`.
- **PROTO_FIRST**: Before parsing/encoding, consult the `.proto` definitions. Generate field lists from schema, not from memory.
- **COMBOX resolution**: Only resolve the selected group (`comboType.typeKey`). Never enumerate all `typeGroups` when extracting active values. See `ENGINEERING_CONSTRAINTS.md` §24.
- **Backend CPU endpoints must be sync `def`**: Encoder/decoder APIs use `def`, not `async def`, to avoid blocking the event loop.
- **Hierarchy preservation**: Preserve source `moreModuleInfo` grouping and explicit `parentNodeUuid`; inferred UI topology must never overwrite source relationships.
- **Dual-key JSON**: Import boundaries may accept snake_case and camelCase, while canonical internal/output structures follow the official Proto mapping.

## Key File References

| Concern | File |
|---------|------|
| Backend entry | `src/backend/main.py` |
| HTTP API | `src/backend/app/api/http.py` |
| Import/compile use cases | `src/backend/app/application/` |
| CModel encoder | `src/backend/app/infrastructure/protobuf/cmodel_encoder.py` |
| CModel decoder | `src/backend/app/infrastructure/protobuf/cmodel_decoder.py` |
| Model splitter | `src/backend/app/infrastructure/protobuf/model_splitter.py` |
| Component mapping | `src/backend/app/domain/modeling/component_mapper.py` |
| Project repository | `src/backend/app/infrastructure/projects/repository.py` |
| Worker runtime | `cloudflare/worker.ts` |
| Frontend types | `src/frontend/src/store/types.ts` |
| Schema engine | `src/frontend/src/store/SchemaEngine.ts` |
| Schema defaults | `src/frontend/src/store/SchemaDefaults.ts` |
| Import service | `src/frontend/src/store/ImportService.ts` |
| Export service | `src/frontend/src/services/ExportService.ts` |
| Performance config | `src/frontend/src/store/PerformanceConfig.ts` |
| Full constraints | `specifications/ENGINEERING_CONSTRAINTS.md` |
| Data integrity rules | `DATA_INTEGRITY_CONSTRAINTS.md` |
| Hard constraint rules | `CONSTRAINTS.md` |
| Proto definitions | `specifications/protocols/` (tracked user-provided source) |

## Data Flow

```
Frontend config (Zustand store)
  → ExportService.ts (FIELD_REGISTRY-driven JSON)
    → POST /api/v1/models/{id}/compile
    → application compile use case
      → domain model mapping
      → infrastructure protobuf encoder → .cmodel binary

.cmodel binary upload
  → POST /api/v1/models/upload
    → infrastructure protobuf decoder (CompDesc/AbiSet/FuncDesc)
    → application import use case and model splitter
    → frontend ImportService.ts → Zustand store
```

## Common Pitfalls

- `types.ts` has `MainModuleType` values that must match the 18 standard hardware categories in `ENGINEERING_CONSTRAINTS.md` §18.2.
- `parentNodeUuid` uses `DATA_COMBOX` encoding (`comboType.typeKey`), not `DATA_STRING`.
- `interfaceParams` must be `interfaceParamsArray: [...]` (array), never a flat dict — `ParseDict` silently drops non-array values.
- Do not assign `moduleSys`, descriptions, defaults, or relationships from a module name. Preserve explicit source/template values; otherwise report unknown.
- Private attributes must stay in `privateAttrs` (Tag 2 grouped structure), never flattened into `extendParams`.
- Frontend `tsconfig.json` has `"strict": false` and `"noUnusedLocals": false` — don't introduce stricter checks without project-wide changes.
- When the user-provided Proto definitions change, run `npm run proto:generate` to regenerate Python stubs and `cloudflare/generated/protobuf_models.*`; never edit or synthesize `.proto` files. Verify source hashes, `oneof` presence, and explicit default-value round trips.
