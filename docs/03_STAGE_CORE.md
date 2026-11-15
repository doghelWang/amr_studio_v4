# Stage report — core library (`@amr/core`)

Status: **done** · 50 tests pass · typecheck clean · 2026-11-14

## What was built

| Module | File | What it does |
|---|---|---|
| Proto | `src/proto` | Loads the three schemas (generated from `proto/*.proto`), decodes and encodes `CompDesc`, `FuncDesc`, `AbiSet`. 64-bit fields are handled with `long` in the browser as well. |
| Container | `src/codec/cmodel.ts` | Opens a `.cmodel`, checks each file's MD5 against `ModelFileDesc.json`, keeps every entry (calibration JSON included). On export only edited files are re-encoded and their MD5 refreshed. Undo snapshots. |
| View | `src/model/view.ts` | Module list, parameter rows with the COMBOX rule (value = selected key; only the selected option's sub-parameters are live), ranges, units, options, pose, interfaces, links resolved to module.port, buses, function bindings. |
| Edit | `src/model/edit.ts` | Set parameter (type-checked, option-checked), rename (follows through to function bindings), link / unlink (always both ends; DI↔DO, PI↔PO pairing), enable/disable, add template (single module or whole assembly, fresh UUIDs, internal wiring kept), remove module (cleans links), set binding. |
| Catalog | `src/catalog`, `scripts/gen-catalog.mjs` | One registry from the 142 product templates and 43 board descriptions. |
| Validate | `src/validate` | 28 rules in one table, four scopes (file, field, topology, vehicle). |
| Diff | `src/diff` | Semantic diff: modules by name, links by module.port, UUIDs and version stamps ignored, generated function-instance keys matched by content. |

## Evidence

| Claim | Test |
|---|---|
| Decode → encode is byte-identical for all 18 model files in the six real cmodels | `codec › every model file re-encodes byte-identical` |
| Export without edits leaves every archive entry byte-identical | `codec › export without edits…` |
| An edit changes only the edited file; MD5s are refreshed and verify on reopen | `codec › after an edit only the edited file changes` |
| Reverting an edit gives back the original bytes | `codec › an edit that is reverted…` |
| Lidar parameters match the independent Python decode from the earlier analysis | `view › resolves the lidar parameters…` |
| Links are always reciprocal after edits; removing a module leaves no dangling link | `edit › links…`, `edit › removing a module…` |
| Controller products and drivers with CAN ports are in the catalog (REQ-CL-01, REQ-CL-05) | `catalog › holds every template…` |
| Assembly templates keep their internal wiring under new UUIDs | `catalog › adding an assembly…` |
| Known problems of the two-lidar model are found, and clearing them clears the findings | `validate › finds the known problems…`, `fixing the model…` |
| `modelset` vs `modelset-wide` = 15 component values + 4 function values + 1 calibration file | `diff › modelset vs wide variant` |

## Things found while building

1. **Template naming trap.** The template JSON uses protoc JSON names (`interfaceGroup`, `module3dIcon`) while the proto fields are `interface_Group` and `module_3d_icon`. A naive conversion silently drops every interface of every template. This is very likely the real cause of v4's "driver has no CAN interface" (REQ-CL-05). The generator now maps names from the schema and fails loudly if any value is lost.
2. **Rules calibrated against production models.** Running the rule set over the four vendor models showed that three items from the earlier manual review of `diff-2lidar.cmodel` are conventions, not faults, and they were removed from the rule set:
   - a controller's ETH ports linked to each other (on-board switch) — present in every vendor model;
   - RS485 `dataBits = 1` — present on every RS485 port in every vendor model;
   - e-stop `MODE = NO` in attributes with `mode = NC` in parameters — present on every e-stop in every vendor model.
   CAN terminator count and rotation diameter were downgraded to *info* for the same reason. With this, all four production models validate with **0 errors**, and the two-lidar model shows exactly: duplicate CANopen node ID (error), front lidar facing across the body (warning), no obstacle laser facing forward (warning).
3. **Ranges such as `0 … 0` or `999 … 0`** in vendor data are placeholders; the range rule ignores them, and ignores parameters of unconnected ports.
4. **Four catalog templates are assemblies** (wheel sets with 6–12 modules). `addTemplate` handles them.

## Not done in this stage

Board descriptions are loaded into the catalog but not yet used to generate interfaces for a chosen board; templates already carry their interfaces, so this only matters for boards that have no template.
