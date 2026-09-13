# Cloudflare Worker (cloudflare/worker.ts) Audit — 2026-09-12

## Scope and why this file specifically

The user deployed a Cloudflare Worker at `https://amr.cloud-ai.work/`, wired to auto-deploy
from GitHub. This audit's first job was determining *what code is actually running there*,
because this repository contains three superficially similar backends:

1. `src/backend/` (Python/FastAPI) — on this branch (`codex/equipment-workshop-refactor`) it
   has been reorganized into a new `app/{api,application,domain,infrastructure,schemas}`
   layering (see `docs/BACKEND_ARCHITECTURE_REORGANIZATION_20260802.md`). Confirmed irrelevant
   to the live Worker: `wrangler.jsonc` has no Python dependency at all.
2. `src/backend_ts/` — a TypeScript library (`core/{dataManager,mappingRegistry,paths,
   resourceAdapter,schemaManager}.ts`, `skills/{cmodelDecoder,cmodelEncoder,modelSplitter}.ts`,
   `main.ts`, `testApi.ts`). **Confirmed orphaned/dead code**: not imported by
   `cloudflare/worker.ts`, not imported by `cloudflare/node-server.ts` (which imports only
   `./worker.ts`), and not referenced by any `package.json` script (only
   `"worker:server": "tsx cloudflare/node-server.ts"` exists). `AGENTS.md` describes it as
   "used by supported deployments" — that is stale documentation.
3. **`cloudflare/worker.ts`** (1777 lines) — confirmed live by matching its hardcoded
   `backendVersion: "1.0.1-worker-ts"`, `buildDate: "2026-07-11"`, `commitHash: "worker-ts-edge"`
   constants (the `/api/v1/system/version` handler) against the live site's actual API
   response, byte for byte.

The deployed branch was independently confirmed to be `codex/equipment-workshop-refactor` via
`docs/verification/AMR_STUDIO_CLOUDFLARE_ROUTE_FIX_20260815.md`, which documents a real
production routing conflict with another Worker ("ai-work") sharing the `cloud-ai.work` zone —
its described symptoms match what the live site actually does, and `wrangler.jsonc` on this
branch (and only this branch, compared against `codex/ts-backend-runtime-20260704` and
`codex/worker-node-server-deploy`) has the specific route fix (`cloud-ai.work/api/v1/*` added
alongside the general `cloud-ai.work/*`) that report describes.

Per user direction, this audit targets `cloudflare/worker.ts` only, at the same depth as the
earlier Python-backend audit, and does not re-verify the new Python `app/` architecture (out of
scope for what's live) or `src/backend_ts/` (confirmed dead code, not worth auditing further).

## P0 — CompDesc encoder silently drops all interface/bus wiring for brand-new components

**File:** `cloudflare/worker.ts`, `mapComponentToCmodel()` (the from-scratch branch, previously
lines 925-931).

**Root cause.** The real CompDesc proto has one field with an unusual mixed-case name:
`interface_Group` (capital `G` after the underscore) on message `Message_Interface_Param` —
confirmed in both the generated TypeScript types (`cloudflare/generated/protobuf_models.d.ts`)
and the generated JS encoder (`cloudflare/generated/protobuf_models.js`:
`Message_Interface_Param.prototype.interface_Group = $util.emptyArray;`). A schema-wide grep
(`grep -oE '[a-zA-Z0-9_]+_[A-Z][a-zA-Z0-9_]*' protobuf_models.d.ts`) confirms this is the
*only* field in the entire proto with this casing quirk — a genuine idiosyncrasy of the
original `.proto` source, not something introduced by either backend's authors.

For every brand-new (non-imported) component, `mapComponentToCmodel()` built:

```ts
interfaceParams: { interfaceGroup: buildComponentInterfaceGroups(component) }
```

— i.e. plain camelCase `interfaceGroup`. `Message_Interface_Param.fromObject()` (the real
generated encoder logic, called by `encodeCompDesc()`) only ever reads
`object.interface_Group`; it has no camelCase fallback. Since `{interfaceGroup: [...]}` has no
`interface_Group` key, `fromObject()` leaves the message's `interface_Group` at its default
(`$util.emptyArray`, i.e. `[]`) — silently. No exception, no warning, no audit-log entry.

This is reachable in the real, live compile path:
`compileCmodel()` (line ~1534/1544) rebuilds `sandbox.fullJson` from `sandbox.components` via
`buildFrontendCompDesc()` on every compile → `buildFrontendCompDesc()` calls
`buildModuleGroup()` for each root/child component → `buildModuleGroup()` calls
`mapComponentToCmodel(component)` → the buggy branch above → `encodeCompDesc(sandbox.fullJson)`
right after. **Any project built from scratch through the frontend UI (as opposed to
uploaded/imported from an existing `.cmodel`) loses all bus/interface wiring — CAN bus
assignments, linked interfaces, everything under `interfaceParams` — the moment it's compiled
to a downloadable `.cmodel` file.** The robot looks correctly wired in the editor (the frontend
state and the `interfaceAbility`/other fields are unaffected), but the exported artifact
silently has none of it.

The raw/imported-component path (`mapRawComponentToCmodel` → `mergeRawInterfaces`, worker.ts
~line 799) does **not** have this bug: it dynamically checks which key the existing decoded raw
proto JSON already uses (`interface_Group` vs `interfaceGroup`) and writes back under that same
key, since a real decoded `.cmodel` always uses the literal proto field name. The bug is
isolated to components that never went through an imported/raw representation.

This is the same *category* of bug as the two previously-documented findings in
`src/frontend/src/services/ExportService.ts` (wrong `arrayCmobEle` field name, missing
`DATA_FIXED_E` case) — a JS-object-key mismatch against the real proto schema that
`fromObject()`/`ParseDict()`-style calls silently tolerate instead of rejecting — but this one
lives in the code actually deployed to production, not in a currently-inert frontend path.

**Empirical verification (not just static reading).** Per this engagement's established
methodology, this was verified by actually running the real, unmodified generated encoder
(`cloudflare/generated/protobuf_models.js`'s `Message_Module_Info.fromObject()`), not just
reading it. `npm install protobufjs` is not possible in this sandbox — `registry.npmjs.org` is
blocked by this environment's network egress policy (confirmed via direct `curl`: `403 Host not
in allowlist`) — so a minimal load-time shim
(`tests/audit_fixes/ts_backend/protobufjs_minimal_shim.mjs`) supplies only the handful of
`$util` helpers the generated file touches at import time and inside `fromObject()`/
`toObject()` (confirmed exhaustively by grepping every `$util.*` call site), letting the real
generated file's own logic run untouched. `Reader`/`Writer` (wire format) are deliberately not
implemented, since the bug is entirely about whether data enters the in-memory message object
during `fromObject()` — fully observable without touching wire bytes.
`tests/audit_fixes/ts_backend/verify_interface_group_fix.mjs` runs this and confirms:

```
Pre-fix key 'interfaceGroup':  SILENTLY DROPPED (bug reproduced)
Post-fix key 'interface_Group': SURVIVES (fix confirmed)
```

**Fix applied.** Changed `mapComponentToCmodel()`'s from-scratch branch to write
`interfaceParams: { interface_Group: buildComponentInterfaceGroups(component) }`, matching the
literal proto field name directly (there is no raw JSON to resolve the key against in this
branch, unlike the raw/imported path). Verified no other code reads
`interfaceParams.interfaceGroup` expecting that exact camelCase key from this function's
output (the only other reader, `mergeRawInterfaces`, reads it from the *frontend-shape*
`component.interfaceParams`/`component.interfaces` input, not from this function's output, and
is unaffected). A `tsc --noEmit` pass over `cloudflare/worker.ts` shows no new errors introduced
by the change (pre-existing errors are only missing `fflate`/`js-md5`/`@cloudflare/workers-types`
type declarations, expected since `npm install` cannot run in this sandbox).

## Ability (AbiSet) export path — confirmed correct, no data loss

Traced the full path for a brand-new project's ability data: frontend Zustand state →
`App.tsx::handleExport()` → `apiInitSandbox(projectId, { ...config, abilities })` →
`initSandbox()` → `buildSandboxRecord()` → `buildExportedAbilities(config.abilities)` (since
`config.rawAbiSet` is undefined for a new project) → stored as `sandbox.abilities` → at compile
time, `compileCmodel()` passes `sandbox.abilities` directly to
`encodeAbiSet()`/`Controller_Ability.fromObject()`.

`buildExportedAbilities()`/`mapAttributeToCmodel()` (worker.ts ~line 378-540) correctly emits
`comboxParam.customCombox.element[].arrayAttr`/`defaultSelect` — matching the real AbiSet
schema — and has an explicit `DATA_FIXED_E` → `stringFix` case. This is the **opposite** of the
two bugs found earlier in `src/frontend/src/services/ExportService.ts` (which is the export
path used by the Python-backend UI flow, not this Worker): here the field names are right and
no value type is dropped.

The `PATCH /api/v1/models/{id}/abilities` endpoint (`updateAbilities()`, worker.ts ~line 1365)
exists but — matching what was found on the frontend side earlier — has **zero callers** in
`src/frontend`; abilities only ever reach the Worker via the `init-sandbox` payload on export,
not via this PATCH endpoint. This dead endpoint is not itself a bug (it works correctly if
called), just unreachable in the current frontend flow — noted for completeness, not treated as
a finding requiring a fix.

A schema-wide grep (see the P0 section) confirms `interface_Group` is the only oddly-cased
field in the entire proto surface, so there is no sibling of the P0 bug hiding in the Ability
schema.

## P2 — `parsed_models` flags in the upload/import response don't reflect parse failures

**File:** `cloudflare/worker.ts`, `uploadCmodel()` (~line 1451-1523).

When importing an uploaded `.cmodel`, `AbiSet.model`/`FuncDesc.model` parse failures are caught
and pushed as a `WARN: ... parse failed` string into the response's `audit` array — the request
still succeeds with `abilities`/`functions` silently defaulted to `{}`. This is **not** a fully
silent failure (the warning is genuinely present in the response body, unlike the P0 bug above),
but the same response's `parsed_models: { abiSet: Boolean(abiBytes), funcDesc: Boolean(funcBytes)
}` flags only check whether the zip *entry existed*, not whether it actually parsed — so a
caller that reads `parsed_models.abiSet === true` without also scanning the `audit` array for
`WARN:` lines can be misled into thinking ability data survived import when it didn't. Low
severity (the ground truth is present in `audit`), but worth fixing by deriving
`parsed_models.abiSet`/`funcDesc` from whether decoding actually succeeded rather than from
`Boolean(abiBytes)`/`Boolean(funcBytes)`. Not fixed in this pass — flagged for follow-up, since
it's a UI/reporting-accuracy issue rather than a data-loss issue.

## Other checks performed, no findings

- Swept every `catch {}` / `catch (error) {}` block (14 total) in `cloudflare/worker.ts`: all
  either return a proper error response with a status code, or (the two AbiSet/FuncDesc import
  cases above) degrade with an explicit audit-log warning. None silently continue with no trace
  at all.
- Swept for hardcoded magic-number fallbacks of the kind flagged in `CLAUDE.md` §1.1
  (`'PMSMMotor'`, `|| 1200`, `|| 800`, `|| 600`, `|| 400`, etc.) — none found in this file.
- `notMigratedResponse()`/the `COMPILE_REQUIRES_PROTOBUF_JSON` 501 case are explicit, honest
  "not implemented yet" responses (with a clear error code and message), not silent no-ops —
  acceptable engineering, not a red flag.

## Files touched

- `cloudflare/worker.ts` — one-line fix (`interfaceGroup` → `interface_Group`) plus an inline
  comment explaining why, in `mapComponentToCmodel()`.
- `tests/audit_fixes/ts_backend/protobufjs_minimal_shim.mjs` — new, minimal load-time shim
  documented above.
- `tests/audit_fixes/ts_backend/verify_interface_group_fix.mjs` — new, repeatable empirical
  verification harness; rerun with `node tests/audit_fixes/ts_backend/verify_interface_group_fix.mjs`.
- This report.

## What real execution could not cover here (and why)

This sandbox's network egress policy blocks `registry.npmjs.org` (and, by the same
allowlist-based policy, presumably other package registries) — confirmed directly rather than
assumed. That means `npm install` cannot run at all in this environment, which in turn means:

- No full byte-level encode → zip → decode round trip through the real `protobufjs` wire format
  was performed (only the `fromObject()` JS-object-shape step, which is where this specific bug
  lives and is fully conclusive for it).
- `cloudflare/node-server.ts` (which would let the whole Worker run over real HTTP via
  `tsx cloudflare/node-server.ts`) could not be started, since it transitively needs `fflate`,
  `js-md5`, and `protobufjs` installed.
- No existing automated test suite could be run for `cloudflare/worker.ts` on this branch (none
  exists here — the "53 backend tests passing" mentioned in
  `docs/verification/VERIFICATION_REPORT_20260801_WORKER_EDIT_ROUNDTRIP.md` was on a different
  branch, `codex/ts-backend-runtime-20260704`).

Per this sandbox's own operating rules, a blocked registry host is reported rather than routed
around (no alternate mirrors, no vendoring the library from memory, no disabling the egress
policy). The `fromObject()`-level empirical test above was chosen as the most rigorous check
achievable within that constraint, and is conclusive for the specific bug it targets since the
bug is entirely about whether a JS object key is recognized — a question fully answered by
running the real `fromObject()` code, independent of wire-format fidelity.
