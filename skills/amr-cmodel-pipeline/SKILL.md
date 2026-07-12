---
name: amr-cmodel-pipeline
description: "Use for AMR Studio V4 cmodel work: parse .cmodel files, summarize devices, mounting positions, electrical connections, abilities and FuncDesc, build models from chassis/device/wiring/function choices, export .cmodel artifacts, validate roundtrip fidelity, and manage module library or CAN/ETH/RS485 bus configuration without fabricating protocol data."
metadata:
  short-description: Parse, build, summarize, and validate AMR cmodel files
---

# AMR CModel Pipeline

Use this skill when the user asks to work with AMR Studio V4 `.cmodel` model files, including parsing, model construction, module-library-driven configuration, electrical/bus connection analysis, function configuration, export, or validation.

## Non-Negotiable Rules

- Do not guess, fabricate, or invent parameters, descriptions, module types, interface types, connections, bus parameters, abilities, or function-process content.
- Valid facts may only come from the uploaded/imported `.cmodel`, protobuf schema, module library, registered engineering constraints, backend API responses, or explicit user input.
- If a fact is absent, keep it absent, report `unknown`, produce diagnostics, or ask for user input. Never create a plausible value just to make the pipeline pass.
- Treat `proj*` files as possible historical/debug/invalid artifacts unless the user confirms they are reference models.
- Preserve `0`, `false`, empty string, empty arrays, UUIDs, interface UUIDs, `linkedInterfaceUuid`, `AbiSet.componentAbility`, `AbiSet.functionAbility`, and `FuncDesc.function` counts.

Read `references/constraints.md` when implementing or changing code, not just analyzing files.

## Workflow

1. **Baseline check**
   - If code changes are planned, first run regression tests:
     `src/backend/.venv310/bin/python -m unittest discover -s tests/unit -p 'test_*.py'`
   - If frontend changes are planned, also run:
     `cd src/frontend && npm run build`

2. **Parse `.cmodel`**
   - Prefer the project backend API when available:
     `POST /api/v1/models/upload`
   - Then retrieve:
     `GET /api/v1/models/{project_id}/abilities`
     `GET /api/v1/models/{project_id}/functions`
   - For local batch work, use:
     `python3 skills/amr-cmodel-pipeline/scripts/cmodel_batch_summary.py --root /path --api http://host:port/api/v1 --out analysis/out`

3. **Summarize parsed model facts**
   - Device list from `CompDesc.moreModuleInfo[].moduleComponets[]`.
   - Mounting from `structParam.extendParams.locCoordX/Y/Z/ROLL/PITCH/YAW` and `parentNodeUuid`.
   - Connections from `interfaceParams.interfaceGroup[].linkedInterfaceUuid`, resolved by `interfaceUuid`.
   - Abilities from `AbiSet.componentAbility` and `AbiSet.functionAbility`.
   - Function processes from `FuncDesc.function[]` and nested `childFunction`.

4. **Build or edit a model**
   - Step through chassis selection, device selection/assembly, mounting, wiring, bus configuration, software ability/function configuration, audit, and export.
   - Use module library facts for categories, common attributes, private attributes, composite modules, interfaces, and bus parameters.
   - Use explicit user choices for anything not present in facts.

5. **Manage bus information**
   - Treat CAN, ETH, and RS485 as first-class bus types.
   - Track bus type, master interface, slave interfaces, connection refs, parameters, and configuration status.
   - Bus state here means model configuration state, not runtime device health, unless a runtime data source is explicitly provided.

6. **Export and validate**
   - Materialize frontend connection entities back to `linkedInterfaceUuid`.
   - Compile through backend and preserve debug artifacts.
   - Use `scripts/cmodel_artifact_check.py` to verify exported artifacts and report missing expected files.
   - Write a verification report for any substantial work.

## Outputs

For analysis tasks, produce:

- Full JSON summary.
- Markdown review report.
- CSV files for model index, device list, connections, and function nodes when batch analysis is requested.

For build/export tasks, produce:

- Model construction summary.
- Audit diagnostics.
- Exported `.cmodel`.
- Module list CSV if backend provides one.
- Debug artifact paths.
- Verification report.
