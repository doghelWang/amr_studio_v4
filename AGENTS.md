# AMR Studio V4 - Agent Guidelines

## Quick Start

```bash
python3 start.py              # Start both services (kills stale ports, health probes)
# Backend:  http://127.0.0.1:8002  (PYTHONPATH=src/backend)
# Frontend: http://127.0.0.1:3001  (Vite dev server, proxies /api → :8002)
```

## Build & Verify Commands

```bash
# Frontend build + lint
cd src/frontend && npm run build && npm run lint

# CModel round-trip tests (separate package, not the frontend)
cd tests && npm run build && npm run test:run        # basic
cd tests && npm run build && npm run test:detailed    # comprehensive

# E2E (root package.json has Playwright)
npx playwright test
```

## Architecture

- **Backend** (`src/backend/`): FastAPI + Protobuf. Entry: `main.py`. Modules: `core/` (data_manager, resource_adapter, schema_builder, protobuf_engine, protobuf_navigator, mapping_registry), `skills_v2/` (cmodel_encoder, cmodel_decoder, model_splitter). Python protobuf stubs live in `skills_v2/schemas_pb/`.
- **Frontend** (`src/frontend/`): React 18 + Vite + Ant Design + Zustand. Key stores in `src/store/` — `useProjectStore.ts` is the main state, `ImportService.ts` / `ExportService.ts` handle data round-trip, `SchemaEngine.ts` drives schema-driven rendering, `PerformanceConfig.ts` centralizes Full Load ratios.
- **Tests** (`tests/`): Standalone TypeScript test package for CModel encode/decode round-trips. Does NOT depend on the frontend build.
- **Proto schemas**: `specifications/protocols/*.proto` — **git-ignored** but Python `_pb2.py` stubs are tracked. The `.proto` source of truth lives locally only.
- **Module library**: `specifications/ModuleLibrary/Aggregated/*.xml` is the source of truth for hardware specs. `src/backend/resources/modules/` has per-module JSON/XML templates.

## Critical Constraints (blockers if violated)

Full detail lives in `CONSTRAINTS.md`, `DATA_INTEGRITY_CONSTRAINTS.md`, and `ENGINEERING_CONSTRAINTS.md` (§1–§24). Key rules:

- **NO_HARDCODE**: Defaults come from `SchemaDefaults.ts` / `PerformanceConfig.ts` / module templates, never inline literals. Type lookups use `SchemaEngine.getAvailableSubTypes()` / `getValidSubType()`, not string constants.
- **NO_PARTIAL_PARSE / NO_PARTIAL_EXPORT**: All Proto fields must be handled. Use `FIELD_REGISTRY` arrays + iteration, never manual field-by-field assignment. `ROBOT_IDENTITY_FIELD_REGISTRY` in `ExportService.ts` must stay in sync with `types.ts`.
- **PROTO_FIRST**: Before parsing/encoding, consult the `.proto` definitions. Generate field lists from schema, not from memory.
- **COMBOX resolution**: Only resolve the selected group (`comboType.typeKey`). Never enumerate all `typeGroups` when extracting active values. See `ENGINEERING_CONSTRAINTS.md` §24.
- **Backend CPU endpoints must be sync `def`**: Encoder/decoder APIs use `def`, not `async def`, to avoid blocking the event loop.
- **Flat module tree only**: Client supports flat structure only. `encoder.py:standardize_sys_tree()` flattens all nesting. No nested `moreModuleInfo`.
- **Dual-key JSON**: Backend must accept both snake_case and camelCase. Before proto serialization, `proto_final_sync` normalizes all keys.

## Key File References

| Concern | File |
|---------|------|
| Backend entry | `src/backend/main.py` |
| CModel encoder | `src/backend/skills_v2/cmodel_encoder/encoder.py` |
| CModel decoder | `src/backend/skills_v2/cmodel_decoder/decoder.py` |
| Model splitter | `src/backend/skills_v2/model_splitter/splitter.py` |
| Resource adapter | `src/backend/core/resource_adapter.py` |
| Data manager | `src/backend/core/data_manager.py` |
| Proto protobuf engine | `src/backend/core/protobuf_engine.py` |
| Frontend types | `src/frontend/src/store/types.ts` |
| Schema engine | `src/frontend/src/store/SchemaEngine.ts` |
| Schema defaults | `src/frontend/src/store/SchemaDefaults.ts` |
| Import service | `src/frontend/src/store/ImportService.ts` |
| Export service | `src/frontend/src/services/ExportService.ts` |
| Performance config | `src/frontend/src/store/PerformanceConfig.ts` |
| Full constraints | `ENGINEERING_CONSTRAINTS.md` (§1–§24) |
| Data integrity rules | `DATA_INTEGRITY_CONSTRAINTS.md` |
| Hard constraint rules | `CONSTRAINTS.md` |
| Proto definitions | `specifications/protocols/` (local, not in git) |

## Data Flow

```
Frontend config (Zustand store)
  → ExportService.ts (FIELD_REGISTRY-driven JSON)
    → POST /api/v1/models/{id}/compile
      → backend resource_adapter (frontend_to_comp_desc)
      → encoder.py (resolve_with_fidelity → protobuf serialization → .cmodel binary)

.cmodel binary upload
  → POST /api/v1/models/upload
    → decoder.py (protobuf deserialization → CompDesc.json)
    → splitter.py (split modules)
    → frontend ImportService.ts → Zustand store
```

## Common Pitfalls

- `types.ts` has `MainModuleType` values that must match the 18 standard hardware categories in `ENGINEERING_CONSTRAINTS.md` §18.2.
- `parentNodeUuid` uses `DATA_COMBOX` encoding (`comboType.typeKey`), not `DATA_STRING`.
- `interfaceParams` must be `interfaceParamsArray: [...]` (array), never a flat dict — `ParseDict` silently drops non-array values.
- Only `G_MainController` gets `moduleSys="ControlSys"`; all other groups get `moduleSys=""`.
- Private attributes must stay in `privateAttrs` (Tag 2 grouped structure), never flattened into `extendParams`.
- Frontend `tsconfig.json` has `"strict": false` and `"noUnusedLocals": false` — don't introduce stricter checks without project-wide changes.
- Proto files are git-ignored; if you need to modify proto definitions, update the `_pb2.py` stubs too.