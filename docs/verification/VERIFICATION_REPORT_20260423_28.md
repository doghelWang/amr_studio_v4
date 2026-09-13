# Verification Report 2026-04-23 28

## Scope

This report covers the fallback diagnostics hardening step after the backend modularization completion check.

Goal:

- make compatibility defaults and mapping fallbacks visible
- avoid silently hiding missing protocol facts
- keep diagnostic metadata outside the CModel protocol payload

## Changes Verified

Added:

- `src/backend/core/fallback_diagnostics.py`
- `tests/unit/test_fallback_diagnostics.py`
- `tests/unit/test_project_service_diagnostics.py`

Updated:

- `src/backend/core/cmodel_export_adapter.py`
- `src/backend/core/resource_adapter.py`
- `src/backend/app/services/project_service.py`
- `tests/unit/test_resource_adapter_compat.py`

## Behavioral Summary

`collect_export_diagnostics(config)` now reports visible diagnostics for cases including:

- missing required component id
- empty component name
- category normalization
- missing module template
- missing category-to-type mapping
- missing category-to-subsystem mapping
- default module shape usage
- missing chassis dimensions
- mount coordinate/attitude defaults
- empty interface groups
- empty ability definitions

The diagnostics are returned by project initialization as a sibling field:

```json
{
  "status": "success",
  "project_id": "...",
  "diagnostics": [...]
}
```

The diagnostics are intentionally not written into `CompDesc.json`, `blueprint_CompDesc.json`, or module JSON payloads.

## Constraint Alignment

This change supports the no-guess/no-fabrication constraint:

- diagnostics do not invent missing values
- diagnostics report missing or weak facts explicitly
- cmodel export behavior remains backward-compatible
- protocol payloads are not polluted by non-protocol diagnostic fields

## Commands Run

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_project_service_diagnostics tests.unit.test_fallback_diagnostics tests.unit.test_resource_adapter_compat
```

Result:

- `Ran 5 tests in 0.004s`
- `OK`

```bash
src/backend/.venv310/bin/python -m unittest discover -s tests/unit -p 'test_*.py'
```

Result:

- `Ran 51 tests in 0.295s`
- `OK`

```bash
src/backend/.venv310/bin/python -m compileall -q src/backend/app src/backend/core src/backend/main.py tests/unit
```

Result:

- exit code `0`
- no syntax compilation errors reported

## Residual Risks

- Diagnostics are currently returned from initialization only; compile/export audit integration can be added next.
- Mapping tables remain Python constants for now, but weak mapping usage is now visible through diagnostics.
- Severity levels are conservative and may need calibration after real project data review.

## Next Recommended Step

Integrate diagnostics into compile/export audit output so saved-project recompile flows receive the same visibility as project initialization.
