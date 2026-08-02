# Verification Report 2026-04-23 30

## Scope

This report verifies the fix for the `new_proj_15kfuy5_packed.cmodel` artifact audit finding.

Original issue:

- `generalAttr` and `general_attr` coexisted in the same module JSON.
- `proto_final_sync()` normalized both to `general_attr`.
- The later sparse `general_attr` branch overwrote the complete `generalAttr` branch.
- The packed artifact lost chassis `moduleUuid`, `mainModuleType`, `subSysType`, and `subModuleType`.

## Code Change

Updated:

- `src/backend/skills_v2/cmodel_encoder/encoder.py`

Added:

- `_is_empty_proto_value()`
- `_merge_normalized_value()`

Behavior:

- normalized key collisions are no longer overwritten blindly
- dictionary collisions are deep-merged
- scalar/list collisions keep the existing non-empty value
- incoming values are used only when the existing value is empty

Regression coverage:

- `tests/unit/test_protobuf_export_alignment.py`

Added test:

- `test_proto_sync_merges_camel_and_snake_case_collisions_without_data_loss`

## Validation Commands

### Baseline Before Fix

```bash
src/backend/.venv310/bin/python -m unittest discover -s tests/unit -p 'test_*.py'
```

Result before changes:

- `Ran 52 tests in 0.314s`
- `OK`

### Focused Regression After Fix

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_protobuf_export_alignment tests.unit.test_backend_export_regressions tests.unit.test_backend_api_e2e
```

Result:

- `Ran 9 tests in 0.319s`
- `OK`

### Full Backend Regression After Fix

```bash
src/backend/.venv310/bin/python -m unittest discover -s tests/unit -p 'test_*.py'
```

Result:

- `Ran 53 tests in 0.344s`
- `OK`

### Python Compile Check

```bash
src/backend/.venv310/bin/python -m compileall -q src/backend/app src/backend/core src/backend/skills_v2/cmodel_encoder src/backend/main.py tests/unit
```

Result:

- exit code `0`

### Frontend Build Check

```bash
npm run build
```

Result:

- TypeScript build passed
- Vite build passed
- non-blocking large chunk warning remains

## Artifact Re-Export

Re-exported project:

- `new_proj_15kfuy5`

Updated files:

- `src/backend/saved_projects/new_proj_15kfuy5/new_proj_15kfuy5_packed.cmodel`
- `/Users/wangfeifei/Downloads/new_proj_15kfuy5_packed.cmodel`

New artifact hash:

- size: `8071` bytes
- md5: `598bb19f8a82ddf4bbb7c351c3a7ffda`
- sha256: `54a6425a75cf9c3068401e7510aba39448e08631a4d2b10efe3de6132aa8e57d`

Backend project copy and Downloads copy match exactly.

## Re-Audit Result

Decoded fixed artifact:

- groups: `16`
- components: `15`
- max depth: `1`
- `ModelFileDesc.json` MD5 values match embedded model files
- missing UUID count: `0`
- unknown/empty main type count: `0`
- warning/error diagnostics: `0`

Fixed chassis fields:

```json
{
  "group": "chassis_diff",
  "groupUuid": "chassis-root",
  "name": "chassis_diff",
  "uuid": "chassis-root",
  "main": "chassis",
  "subsys": "ChassisSys",
  "subtype": "steerChassis"
}
```

Remaining diagnostics are informational only:

- `EMPTY_INTERFACE_GROUP`
- `DEFAULT_MODULE_SHAPE_USED`

## Runtime Service Validation

Backend service restarted:

- URL: `http://127.0.0.1:8002`
- PID: `7296`

Frontend service remains running:

- URL: `http://127.0.0.1:3001`
- PID: `94937`

Backend version endpoint:

- HTTP `200`

Runtime compile endpoint:

```bash
POST http://127.0.0.1:8002/api/v1/models/new_proj_15kfuy5/compile
```

Result:

- `status: success`
- diagnostic count: `21`
- diagnostic codes: `DEFAULT_MODULE_SHAPE_USED`, `EMPTY_INTERFACE_GROUP`
- warning/error diagnostic count: `0`

## Judgment

The artifact data-loss issue is fixed.

The backend export path now preserves authoritative camelCase data when sparse snake_case patches coexist in the same module JSON.
