---
name: amr-cmodel-builder
description: "Generate AMR Studio V4 .cmodel files from explicit human-provided model information. Use when asked to build/export a cmodel from chassis selection, device selection and assembly, mounting positions, interface wiring, CAN/ETH/RS485 bus configuration, abilities, and software function choices using module-library facts and backend compile APIs without inventing missing data."
---

# AMR CModel Builder

This skill is only for building/exporting `.cmodel` files from explicit human input and module-library facts. Do not use it to analyze arbitrary existing models except as optional reference input; use `amr-cmodel-reader` for parsing.

## Required Rules

- Never invent module parameters, descriptions, private attributes, interface definitions, bus parameters, connections, abilities, or `FuncDesc` content.
- The build input must be explicit JSON or user-confirmed structured information.
- Missing required build facts must produce diagnostics and block export unless the user supplies values or a registered module-library/default rule exists.
- Use backend APIs when available:
  - `POST /api/v1/models/init-sandbox`
  - `PATCH /api/v1/models/{project_id}/abilities`
  - `POST /api/v1/models/{project_id}/compile`
- Preserve debug artifacts and report output paths.
- Read `references/builder-input-schema.md` before changing builder logic.

## Build Workflow

1. Validate human input.
2. Confirm chassis selection.
3. Confirm device list and module-library source for each device.
4. Confirm common/private attributes.
5. Confirm mounting positions and `parentNodeUuid`.
6. Confirm interface wiring and CAN/ETH/RS485 bus configuration.
7. Confirm software ability selection and `FuncDesc` source.
8. Initialize backend sandbox.
9. Patch abilities when provided.
10. Compile `.cmodel`.
11. Verify returned artifact URLs and write build report.

## Required Input Shape

The minimum input is:

```json
{
  "projectId": "proj_manual_xxx",
  "config": {
    "identity": {},
    "components": [],
    "abilities": {},
    "functionProcesses": []
  }
}
```

The script does not create missing fields. It only validates and forwards explicit input.

## Script

Dry-run validation:

```bash
python3 skills/amr-cmodel-builder/scripts/build_cmodel_from_input.py \
  --input model_spec.json \
  --out build_report.json \
  --dry-run
```

Build via backend:

```bash
python3 skills/amr-cmodel-builder/scripts/build_cmodel_from_input.py \
  --input model_spec.json \
  --api http://116.62.39.177:8888/api/v1 \
  --out build_report.json
```

Outputs:

- JSON build report.
- Backend `project_id`.
- Diagnostics.
- Compile response with `.cmodel` and module-list URLs when successful.

