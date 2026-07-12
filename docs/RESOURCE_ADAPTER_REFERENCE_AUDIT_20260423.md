# Resource Adapter Reference Audit 2026-04-23

## Purpose

This audit supports the next-stage refactor goal of turning `core.resource_adapter` into a narrow compatibility façade instead of a general-purpose dependency surface.

## Current References

### Compatibility entry-point usage

- `src/backend/app/services/project_service.py`
  - Imports `frontend_to_comp_desc`
  - Imports `export_abilities`
  - Status: keep for now
  - Reason: these are stable compatibility entry points and still represent the public conversion API

- `src/backend/app/services/resource_service.py`
  - Imports `resource_adapter` to call `xml_to_component_json`
  - Status: keep for now
  - Reason: XML parsing has not yet been extracted to a dedicated module

- `src/backend/main_init_snippet.py`
  - Imports `frontend_to_comp_desc`
  - Imports `export_abilities`
  - Status: defer
  - Reason: appears to be legacy/bootstrap snippet; should be reviewed before changing

- `tests/full_pipeline_audit/audit_pipeline.py`
  - Imports `frontend_to_comp_desc`
  - Imports `export_abilities`
  - Status: keep for now
  - Reason: audit scripts can continue validating public compatibility entry points

- `tests/unit/test_protobuf_export_alignment.py`
  - Imports `map_attribute_to_cmodel`
  - Status: keep for now
  - Reason: validates a public compatibility conversion function

### Constant dependency usage

- `src/backend/app/services/compile_service.py`
  - Imports `CATEGORY_TO_TYPE_KEY` from `core.resource_adapter`
  - Status: migrate now
  - Reason: stable mapping constants now live in `core.module_mappings`; service code should not depend on `resource_adapter` internals

## Immediate Action

- Migrate `compile_service.py` to import `CATEGORY_TO_TYPE_KEY` from `core.module_mappings`
- Keep `resource_adapter` re-export compatibility intact for historical callers
- Re-run backend regression suite after the change

## Follow-Up Actions

- Extract `xml_to_component_json` from `resource_adapter` into a dedicated XML adapter before changing `resource_service.py`
- Decide whether `main_init_snippet.py` is active code or historical reference
- Keep tests targeting public façade functions until direct builder-level tests are added
