# Verification Report 2026-04-23 31

## Scope

This report verifies the new debug-artifact preservation mechanism.

Goal:

- preserve frontend input artifacts
- preserve backend intermediate artifacts
- preserve final output artifacts
- support debugging without reopening the frontend UI

## Code Changes

Added:

- `src/backend/app/services/debug_artifacts.py`

Updated:

- `src/backend/app/services/project_service.py`
- `src/backend/app/services/compile_service.py`
- `tests/unit/test_project_service_diagnostics.py`
- `tests/unit/test_backend_export_regressions.py`

## Behavior

Project init now writes:

- `01_frontend_config.json`
- `02_frontend_diagnostics.json`
- `03_generated_full_CompDesc.json`
- `04_sanitized_CompDesc.json`
- `05_split_output/`
- `06_exported_AbiSet.json` when abilities are provided

Compile/export now writes:

- `01_resolved_CompDesc.json`
- `02_diagnostics.json`
- `03_audit.json`
- `04_blueprint_CompDesc.json`
- `05_module_list.csv`
- `06_final_packed.cmodel`
- `07_ModelFileDesc.json`
- `08_CompDesc.model`
- `09_AbiSet.model`
- `10_FuncDesc.model`

Artifact location pattern:

```text
saved_projects/{projectId}/debug_artifacts/{stage}_{timestamp}/
```

API responses now include:

- `debug_artifacts_path`
- `debug_artifacts_url`

## Validation Commands

### Baseline Regression Before Change

```bash
src/backend/.venv310/bin/python -m unittest discover -s tests/unit -p 'test_*.py'
```

Result:

- `Ran 53 tests in 0.304s`
- `OK`

### Focused Tests

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_project_service_diagnostics tests.unit.test_backend_export_regressions tests.unit.test_backend_api_e2e
```

Result:

- `Ran 6 tests in 0.324s`
- `OK`

### Full Backend Regression

```bash
src/backend/.venv310/bin/python -m unittest discover -s tests/unit -p 'test_*.py'
```

Result:

- `Ran 53 tests in 0.333s`
- `OK`

### Python Compile Check

```bash
src/backend/.venv310/bin/python -m compileall -q src/backend/app src/backend/core src/backend/skills_v2/cmodel_encoder src/backend/main.py tests/unit
```

Result:

- exit code `0`

## Real Project Validation

Project:

- `new_proj_15kfuy5`

Direct service compile generated:

```text
debug_artifacts/compile_20260423_130016_115742
```

Files present:

- `01_resolved_CompDesc.json`
- `02_diagnostics.json`
- `03_audit.json`
- `04_blueprint_CompDesc.json`
- `05_module_list.csv`
- `06_final_packed.cmodel`
- `07_ModelFileDesc.json`
- `08_CompDesc.model`
- `09_AbiSet.model`
- `10_FuncDesc.model`

Runtime API compile after backend restart generated:

```text
debug_artifacts/compile_20260423_130047_066281
```

Response summary:

- `status: success`
- returned `debug_artifacts_path`
- returned `debug_artifacts_url`
- diagnostic codes: `DEFAULT_MODULE_SHAPE_USED`, `EMPTY_INTERFACE_GROUP`
- warning/error diagnostics: `0`

## Runtime Services

Backend:

- URL: `http://127.0.0.1:8002`
- PID: `11719`

Frontend:

- URL: `http://127.0.0.1:3001`
- PID: `94937`

Frontend proxy check:

- `http://127.0.0.1:3001/api/v1/system/version`
- HTTP `200`

## Judgment

The debug-artifact preservation mechanism is working.

Future artifact audits can now compare:

- frontend submitted config
- generated full CompDesc
- sanitized CompDesc
- split blueprint and module refs
- resolved compile-time CompDesc
- diagnostics and audit
- final cmodel and embedded model files

This should significantly reduce dependency on the frontend UI during backend export debugging.
