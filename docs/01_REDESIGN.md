# AMR Studio v5 — Redesign

Branch `rewrite/v5` · based on a full read of `main` @ 17442f7e · 2026-11-14

## 1. Why a rewrite

Findings from the v4 source audit (numbers are from the tracked tree):

| # | Finding | Evidence | Consequence |
|---|---|---|---|
| A1 | Three backends implement the same pipeline | `src/backend` (Python FastAPI, ~3k lines), `src/backend_ts` (Express, ~2.5k), `cloudflare/worker.ts` (1,832 lines, one file). Only the Worker is deployed. | Behaviour drifts between local and production; every fix is done up to three times. |
| A2 | Two data models with hand-written mapping in both directions | Frontend `ComponentConfig` (`store/types.ts`) vs. proto `Message_Module_Componets`. `ImportService.ts` (585 lines) maps proto → frontend, `ExportService.ts` + Worker `mapComponentToCmodel` / `mergeRaw*` map back and patch the "raw" proto in to recover lost fields. | Root cause of the recurring round-trip bugs (fields dropped, falsy values filtered, first-wheel defaults). `CLAUDE.md`'s NO_PARTIAL_PARSE rule exists because the architecture makes partial parsing the default. |
| A3 | Three disconnected catalog sources + one hardcoded registry | `resources/definitions/*.xml`, `resources/modules/*.json` (143 templates), `board_desc/*`, and a 2,884-line `master_registry.json` in the frontend. | Main-controller products never reach the component library (REQ-CL-01); drivers have no CAN interface in the UI (REQ-CL-05). |
| A4 | Business rules live inside UI components | Audit rules in `AuditStep.tsx` (667 lines); store is 1,113 lines; 307 uses of `any`. | Rules cannot be tested or reused (CLI, server, compare). Only field-level checks exist. |
| A5 | No vehicle-level or topology-level validation | Design doc §6 lists it as a gap. | The problems found in real cmodels (duplicate CAN node IDs, three terminators, self-linked ETH ports, encoder mismatch, unreachable max speed, blind obstacle laser) all pass the v4 audit. |
| A6 | Repository hygiene | 24,744 tracked files; ~21k are `node_modules`, plus saved projects, `.bin` outputs, chat logs. Roughly 500 files are source. | Slow clones, noisy diffs, unclear what is authoritative. |
| A7 | No authoritative test suite | Scattered scripts and markdown reports under `tests/`, `audits/`. | "Bit-perfect" is a stated requirement (REQ-NF-01) with no test that proves it. |

## 2. Design principles

1. **The proto message is the model.** There is no second, frontend-shaped model. The app holds the decoded `Message_Module_Info`, `Robot_Description` and `Controller_Ability` objects and edits them in place. Nothing is mapped, so nothing can be dropped.
2. **Lossless by construction, proven by test.** Decoding then re-encoding every real cmodel in `fixtures/` yields byte-identical files (verified on 18 model files before writing this document). A file that was not edited is written back from its original bytes.
3. **One implementation, in TypeScript.** A single `@amr/core` library runs in the browser, in Node (CLI, tests) and in the Worker.
4. **Schema-driven.** Types come from `proto/*.proto`; modules come from the template catalog; rules come from a rule table. No type names or default numbers in UI code.
5. **Logic outside the UI.** The UI renders views and calls edit operations. Validation, diff and catalog are plain functions with tests.
6. **Thin server.** Because the browser can decode, edit, validate and encode by itself, the Worker only stores projects.

## 3. Architecture

```
proto/*.proto ──gen──▶ schema.json ─┐
catalog/modules/*.json ──gen──▶ catalog.json ─┤
                                    ▼
                          ┌──────────────────┐
                          │    @amr/core     │
                          │ codec  · model   │
                          │ catalog · edit   │
                          │ validate · diff  │
                          └───┬────┬────┬────┘
                 ┌────────────┘    │    └────────────┐
                 ▼                 ▼                 ▼
          apps/web (React)   packages/cli      apps/worker
          edit in browser    parse/check/      project storage
                             diff/export       (KV) + static site
```

### 3.1 Repository layout

```
proto/                 the three .proto files, UTF-8 (single source of truth)
catalog/modules/       143 module templates (proto-JSON of Message_Module_Info)
catalog/boards/        board interface descriptions (host / expansion)
fixtures/              real cmodels used by tests
packages/core/         the library (src/, test/)
packages/cli/          `amr` command
apps/worker/           Cloudflare Worker (storage API)
apps/web/              React UI
docs/                  design, plan, progress, stage reports; docs/legacy = v4 specs kept for reference
```

### 3.2 `@amr/core` modules

| Module | Responsibility |
|---|---|
| `proto/` | Loads `schema.json` into protobufjs types; `decode*` / `encode*` for the three files. |
| `codec/cmodel` | Reads and writes the `.cmodel` zip. Keeps every entry (including calibration JSON and unknown files) and its original bytes. Regenerates `ModelFileDesc.json` MD5s on export. Reports MD5 mismatches on import. |
| `model/project` | `Project` = container + three decoded messages + dirty flags. |
| `model/view` | Read-only accessors: module list, resolved attribute rows (COMBOX rule: value = `type_key`, children only from the selected `type_group`), interfaces, links resolved to module/port, pose, parent tree, function bindings. |
| `model/edit` | Edit operations on the proto objects: set attribute, set pose, link / unlink (always reciprocal), set interface param, rename, enable/disable, add module from template (fresh UUIDs), remove module (cleans links and bindings). |
| `catalog` | One registry built from `catalog/modules` + `catalog/boards`: main type → sub type → product. |
| `validate` | Rule engine. Each rule has an id, level, title and a pure check function. Three scopes: field, vehicle, topology. |
| `diff` | Semantic diff of two projects (modules by name, links by module.port, ignoring UUIDs and version stamps). |

### 3.3 Editing model

```
open .cmodel ─▶ Project ─▶ view(project) ─▶ UI
                   ▲                         │
                   └──── edit op (mutates proto, marks file dirty) ◀──┘
export ─▶ unchanged files: original bytes · changed files: re-encode ─▶ new ModelFileDesc ─▶ zip
```

Undo/redo is done by snapshotting the encoded bytes of the edited file (cheap: ≤200 KB), which also guarantees that an undo returns to an exact prior state.

### 3.4 Validation rules (first set)

| Scope | Rules |
|---|---|
| Field | value outside min/max; required field empty; COMBOX selection not in options |
| Topology | link not reciprocal; port linked to itself / to own module; linked port types differ; duplicate node ID on one CAN bus; more than two terminators on a CAN bus; baud/protocol mismatch across a link; duplicate IP; RS485 data bits; encoder type mismatch driver↔motor |
| Vehicle | no main controller; no battery; no e-stop; max speed unreachable from RPM/gear/wheel radius; rotate diameter smaller than footprint diagonal; lidar yaw pointing into the body; no safety laser covering the forward direction; function binding refers to a missing module; parent UUID missing |

Rule severities live in one table (REQ-AU-01) and every finding carries module name + field path (REQ-AU-03).

### 3.5 Worker API

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/system/version` | version info |
| GET | `/api/v1/projects` | list saved projects |
| GET | `/api/v1/projects/:name` | download stored `.cmodel` bytes |
| PUT | `/api/v1/projects/:name` | store `.cmodel` bytes |
| DELETE | `/api/v1/projects/:name` | delete |

Errors are always structured JSON `{error, detail}` (REQ-EX-01). There is no server-side compile: export happens in the browser with the same core code the CLI uses.

### 3.6 Web UI

Workspace layout instead of a wizard: left = module tree (grouped by subsystem, searchable), centre = tabbed work area, right = findings for the selected module.

| Tab | Content |
|---|---|
| Properties | General, private, mounting and interface parameters of the selected module, rendered from the proto (type, range, unit, required, options). |
| Wiring | Buses per controller port with the devices on them; create/remove links; node IDs and terminators at a glance. |
| Functions | Function bindings from FuncDesc (which module serves which function). |
| Validate | All findings, filterable by level; click to jump to the module. |
| Compare | Load a second cmodel and see the semantic diff. |
| Catalog | Browse templates and add a module to the project. |

Stage 2 keeps the 3D workshop out of scope (agreed); the top view can come back later on top of `view` poses.

## 4. Mapping to v4 requirements

| Requirement | How v5 addresses it |
|---|---|
| REQ-NF-01 bit-perfect | Principle 1–2; round-trip test on all fixtures. |
| REQ-NF-02 schema-driven | Types from proto, modules from catalog, rules from rule table. |
| REQ-CL-01 / CL-05 | Single catalog built from the product templates, which already contain the controller products and the driver CAN interfaces. |
| REQ-WR-01..04, AU-02 | Topology rules + bus-oriented Wiring tab. |
| REQ-AU-01 / AU-03 | Rule table; findings carry module and field path. |
| REQ-EX-01 / EX-02 | No server compile and no PATCH sync; export is local and deterministic. |
| REQ-NF-03 atomic PATCH | Not applicable any more (no per-component server state). |

## 5. What is deliberately dropped

Python and Express backends; sandbox / PATCH / compile endpoints; `master_registry.json`; frontend `ComponentConfig` model and Import/Export services; committed `node_modules`, saved projects, binaries and logs. All of it remains on `main`.
